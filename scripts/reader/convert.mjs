// Conversor de PDF al formato del lector 3D (src/components/reader3d/types.ts).
//
// convertPdf(bytes, opciones) → { manifest, files, report }
//   - manifest: el JSON del lector (versión 1)
//   - files: Map<ruta relativa, Buffer> con las páginas en WebP (grande y pequeña)
//   - report: resumen de lo detectado, para revisar
//
// Qué saca de cada página:
//   - imagen de la página (1600 px y 420 px de ancho)
//   - texto en orden de lectura (columnas), título de la página y sección
//   - puntos de zoom sobre los párrafos importantes
//   - enlaces: los del PDF (internos y externos) y, si el índice no está enlazado, los detecta
//     por el texto («Título ...... 12»)
//   - fotos (respetando el recorte) para el barniz y, si tienen pie de foto, un punto de zoom;
//     las que no lo tienen se devuelven en `pending` para describirlas aparte (describe.mjs)
// No escribe en disco ni usa red: se puede llamar desde la línea de comandos o desde un servidor.

import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { createCanvas } from "@napi-rs/canvas";

const require = createRequire(import.meta.url);
const PDFJS_DIR = dirname(require.resolve("pdfjs-dist/package.json"));
const pdfjs = await import(pathToFileURL(join(PDFJS_DIR, "legacy/build/pdf.mjs")).href);
pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(join(PDFJS_DIR, "legacy/build/pdf.worker.mjs")).href;
const { OPS } = pdfjs;
const sharp = (await import("sharp")).default;

export const TOOL = "reader-build/1";
const REF_W = 924; // página de referencia, como en Vital Oceans
const HI_W = 1600;
const LOW_W = 420;
const MAX_TEXT_HS = 4;
const MAX_PHOTO_HS = 2;

const T = {
  es: { cover: "Portada", toc: "Índice", photo: "Fotografía", goTo: "Ir a", back: "Contraportada" },
  en: { cover: "Cover", toc: "Contents", photo: "Photograph", goTo: "Go to", back: "Back cover" },
  pt: { cover: "Capa", toc: "Sumário", photo: "Fotografia", goTo: "Ir para", back: "Contracapa" },
};

// ---------------------------------------------------------------- utilidades geométricas
const area = (r) => Math.max(0, r[2] - r[0]) * Math.max(0, r[3] - r[1]);
const intersect = (a, b) => {
  const r = [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
  return r[2] > r[0] && r[3] > r[1] ? r : null;
};
const union = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
const xOverlap = (a, b) => Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0]));
const round = (r) => r.map((v) => Math.round(v));
const pad = (r, p, W, H) => [Math.max(0, r[0] - p), Math.max(0, r[1] - p), Math.min(W, r[2] + p), Math.min(H, r[3] + p)];
const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];
/** Caja (en espacio de usuario del PDF) de un rectángulo transformado por la matriz m. */
const bboxOf = (m, x0, y0, x1, y1) => {
  const pts = [
    [x0, y0],
    [x1, y0],
    [x0, y1],
    [x1, y1],
  ].map(([x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]]);
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};

// ---------------------------------------------------------------- texto
const clean = (s) => s.replace(/\s+/g, " ").trim();
const joinLines = (a, b) => (/[\p{L}]-$/u.test(a) && /^\p{Ll}/u.test(b) ? a.slice(0, -1) + b : `${a} ${b}`);
const isNum = (s) => /^\d{1,3}$/.test(s.trim());
const letters = (s) => (s.match(/\p{L}/gu) || []).length;
/** Recorta en una palabra completa y agrega «…». */
const cut = (s, n) => (s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "") + "…");
/**
 * Título de un punto de zoom: la primera oración si es corta; si no, su comienzo.
 * Si el párrafo viene de la columna o página anterior (empieza en minúscula), empieza con «…».
 */
const titleOf = (text) => {
  const m = text.match(/^(\p{Lu}[^]{18,240}?[.!?:])(?=\s|$)/u);
  if (m) return cut(m[1], 130);
  return (/^\p{Ll}/u.test(text) ? "…" : "") + cut(text, 110);
};
const NO_SPACE_BEFORE = /^[.,;:!?)\]»”%]/u;
const NO_SPACE_AFTER = /[(¿¡«“\s-]$/u;

/**
 * Agrupa las piezas de texto en renglones (misma línea base, con tolerancia), cada renglón en
 * líneas (separadas por columnas) y las líneas en bloques (párrafos, títulos).
 * Las llamadas de nota (números pequeños elevados) se quitan.
 */
export function buildBlocks(items) {
  const rows = [];
  for (const it of [...items].sort((a, b) => a.base - b.base)) {
    const row = rows[rows.length - 1];
    if (row && Math.abs(it.base - row.base) < 0.35 * Math.max(row.size, it.size)) {
      row.items.push(it);
      if (it.size > row.size) {
        row.size = it.size;
        row.base = it.base;
      }
    } else rows.push({ base: it.base, size: it.size, items: [it] });
  }
  const lines = [];
  for (const row of rows) {
    const its = row.items.filter((it) => !(isNum(it.str) && it.size < 0.8 * row.size)).sort((a, b) => a.r[0] - b.r[0]);
    let L = null;
    for (const it of its) {
      const gap = L ? it.r[0] - L.r[2] : Infinity;
      if (L && gap < 1.5 * Math.max(it.size, L.size) && Math.abs(L.size - it.size) < 0.35 * Math.max(L.size, it.size)) {
        const sp = gap > 0.15 * it.size && !NO_SPACE_BEFORE.test(it.str) && !NO_SPACE_AFTER.test(L.str) && !/^\s/.test(it.str) ? " " : "";
        L.str += sp + it.str;
        L.r = union(L.r, it.r);
        L.size = Math.max(L.size, it.size);
      } else {
        L = { str: it.str, size: it.size, base: row.base, r: [...it.r] };
        lines.push(L);
      }
    }
  }
  for (const l of lines) l.str = clean(l.str);
  const blocks = [];
  for (const ln of lines.filter((l) => l.str).sort((a, b) => a.r[1] - b.r[1] || a.r[0] - b.r[0])) {
    let best = null, bestGap = Infinity;
    for (const b of blocks) {
      const gap = ln.r[1] - b.r[3];
      if (gap < -0.3 * ln.size || gap > 1.05 * ln.size) continue;
      if (Math.abs(b.size - ln.size) > 0.2 * b.size) continue;
      const ov = xOverlap(b.r, ln.r) / Math.max(1, Math.min(b.r[2] - b.r[0], ln.r[2] - ln.r[0]));
      if (ov < 0.5 && Math.abs(b.r[0] - ln.r[0]) > 1.5 * ln.size) continue;
      if (gap < bestGap) {
        bestGap = gap;
        best = b;
      }
    }
    if (best) {
      best.text = joinLines(best.text, ln.str);
      best.r = union(best.r, ln.r);
      best.lines++;
    } else blocks.push({ text: ln.str, size: ln.size, r: [...ln.r], lines: 1 });
  }
  return { rows, lines, blocks };
}

/**
 * Entradas de un índice escrito como texto: «Título ........ 12» (los puntos y el número
 * pueden venir en la misma pieza o separados). Un título partido en dos renglones se une.
 */
const TOC_WORDS = /^\s*(índice|indice|contenido|contenidos|tabla de contenido|contents|table of contents|index|sumário|sumario)\s*$/iu;
/** Columna aproximada de una entrada (tercios de la página de referencia). */
const columnOf = (e) => Math.floor(e.r[0] / (REF_W / 3));

/**
 * Índice con el número antes del título: «03  Nuestros sinceros agradecimientos». El título es el
 * texto a la derecha del número, en su misma franja vertical (puede ocupar varios renglones).
 * Si esos renglones son «28. Anexo A…», cada uno es una entrada propia.
 */
function tocLeading(rows) {
  const items = rows.flatMap((r) => r.items);
  const entries = [];
  for (const n of items.filter((it) => isNum(it.str))) {
    const band = [n.r[1] - 0.7 * n.size, n.r[3] + 0.7 * n.size];
    const right = items.filter(
      (it) => it !== n && !isNum(it.str) && it.r[0] >= n.r[2] - 1 && it.r[1] < band[1] && it.r[3] > band[0] && it.r[0] - n.r[2] < 3 * n.size,
    );
    if (!right.length) continue;
    // Renglones del título (agrupa por línea base y continúa a la derecha en el mismo renglón).
    const lines = [];
    for (const it of right.sort((a, b) => a.base - b.base || a.r[0] - b.r[0])) {
      const L = lines.find((l) => Math.abs(l.base - it.base) < 0.4 * it.size);
      if (L) {
        L.text = clean(`${L.text} ${it.str}`);
        L.r = union(L.r, it.r);
      } else lines.push({ base: it.base, text: clean(it.str), r: [...it.r] });
    }
    // Continuación del renglón hacia la derecha (piezas que empiezan más lejos del número).
    for (const L of lines)
      for (const it of items)
        if (!right.includes(it) && !isNum(it.str) && Math.abs(it.base - L.base) < 0.4 * it.size && it.r[0] >= L.r[2] - 1 && it.r[0] - L.r[2] < 1.5 * it.size) {
          L.text = clean(`${L.text} ${it.str}`);
          L.r = union(L.r, it.r);
        }
    const subs = lines.map((l) => l.text.match(/^(\d{1,3})\.\s+(\p{L}.*)$/u));
    if (subs.every(Boolean) && lines.length > 1) {
      lines.forEach((l, k) => entries.push({ title: subs[k][2], num: Number(subs[k][1]), r: l.r, top: false }));
    } else {
      const title = lines.map((l) => l.text).join(" ");
      if (letters(title) >= 3) entries.push({ title, num: Number(n.str), r: lines.reduce((r, l) => union(r, l.r), n.r), top: true });
    }
  }
  return entries;
}

function tocEntries(rows) {
  const entries = [];
  let pending = null;
  for (const row of rows) {
    const its = [...row.items].sort((a, b) => a.r[0] - b.r[0]);
    const text = clean(its.map((x) => x.str).join(" "));
    const r = [its[0].r[0], Math.min(...its.map((x) => x.r[1])), Math.max(...its.map((x) => x.r[2])), Math.max(...its.map((x) => x.r[3]))];
    let m = text.match(/^(.*\p{L}.*?)\s*[.·…_]{3,}\s*(\d{1,3})$/u);
    if (!m && its.length >= 2 && isNum(its[its.length - 1].str) && its[its.length - 1].r[0] - its[its.length - 2].r[2] > 2 * row.size) {
      m = [text, clean(its.slice(0, -1).map((x) => x.str).join(" ")), its[its.length - 1].str];
    }
    if (m && letters(m[1]) >= 3) {
      const joined = pending && Math.abs(pending.r[0] - r[0]) < 3 && Math.abs(pending.size - row.size) < 0.15 * row.size && r[1] - pending.r[3] < 0.8 * row.size ? pending : null;
      entries.push({ title: clean((joined ? joined.text + " " : "") + m[1].replace(/[\s.·…_]+$/u, "")), num: Number(m[2]), r: joined ? union(joined.r, r) : r });
      pending = null;
    } else pending = letters(text) >= 3 && text.length < 90 ? { text, r, size: row.size } : null;
  }
  return entries;
}

/** Orden de lectura: bloques de ancho completo en su lugar; entre ellos, columna por columna. */
export function readingOrder(blocks, W) {
  const sorted = [...blocks].sort((a, b) => a.r[1] - b.r[1]);
  const out = [];
  let band = [];
  const flush = () => {
    if (!band.length) return;
    const cols = [];
    for (const b of [...band].sort((a, c) => a.r[0] - c.r[0])) {
      const col = cols.find((c) => Math.abs(c.x - b.r[0]) < 0.12 * W || xOverlap(c.r, b.r) > 0.5 * (b.r[2] - b.r[0]));
      if (col) {
        col.items.push(b);
        col.r = union(col.r, b.r);
      } else cols.push({ x: b.r[0], r: [...b.r], items: [b] });
    }
    cols.sort((a, b) => a.x - b.x);
    for (const c of cols) out.push(...c.items.sort((a, b) => a.r[1] - b.r[1]));
    band = [];
  };
  for (const b of sorted) {
    if (b.r[2] - b.r[0] > 0.55 * W) {
      flush();
      out.push(b);
    } else band.push(b);
  }
  flush();
  return out;
}

// ---------------------------------------------------------------- fotos (con recorte)
export async function imageRects(page) {
  const ops = await page.getOperatorList();
  const stack = [];
  let ctm = [1, 0, 0, 1, 0, 0];
  let clip = null;
  let pendingClip = false;
  const rects = [];
  for (let k = 0; k < ops.fnArray.length; k++) {
    const fn = ops.fnArray[k], args = ops.argsArray[k];
    if (fn === OPS.save) stack.push({ ctm, clip });
    else if (fn === OPS.restore) {
      const s = stack.pop();
      if (s) ({ ctm, clip } = s);
    } else if (fn === OPS.transform) ctm = mul(ctm, args);
    else if (fn === OPS.clip || fn === OPS.eoClip) pendingClip = true;
    else if (fn === OPS.constructPath) {
      const minMax = args[2];
      if (pendingClip && minMax && minMax.length >= 4 && Number.isFinite(minMax[0])) {
        const bb = bboxOf(ctm, minMax[0], minMax[1], minMax[2], minMax[3]);
        clip = clip ? intersect(clip, bb) || [0, 0, 0, 0] : bb;
      }
      pendingClip = false;
    } else if (fn === OPS.paintFormXObjectBegin) {
      stack.push({ ctm, clip });
      if (args[0]) ctm = mul(ctm, args[0]);
      if (args[1]) {
        const bb = bboxOf(ctm, args[1][0], args[1][1], args[1][2], args[1][3]);
        clip = clip ? intersect(clip, bb) || [0, 0, 0, 0] : bb;
      }
    } else if (fn === OPS.paintFormXObjectEnd) {
      const s = stack.pop();
      if (s) ({ ctm, clip } = s);
    } else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject || fn === OPS.paintImageXObjectRepeat) {
      let r = bboxOf(ctm, 0, 0, 1, 1);
      if (clip) r = intersect(r, clip);
      if (r) rects.push(r);
    }
  }
  return rects;
}

// ---------------------------------------------------------------- conversión
/**
 * @param {Uint8Array} bytes PDF
 * @param {{ slug: string, lang: string, title?: string, kicker?: string, subtitle?: string,
 *   source?: { reportId: string, lang: string }, pdf?: string, pages?: [number, number],
 *   coverFx?: "water", onProgress?: (msg: string) => void }} opts
 */
export async function convertPdf(bytes, opts) {
  const lang = opts.lang in T ? opts.lang : "es";
  const t = T[lang];
  const log = opts.onProgress || (() => {});
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const task = pdfjs.getDocument({
    data: new Uint8Array(bytes),
    standardFontDataUrl: join(PDFJS_DIR, "standard_fonts") + "/",
    cMapUrl: join(PDFJS_DIR, "cmaps") + "/",
    cMapPacked: true,
    wasmUrl: join(PDFJS_DIR, "wasm") + "/",
    iccUrl: join(PDFJS_DIR, "iccs") + "/",
    useSystemFonts: false,
    isEvalSupported: false,
    verbosity: 0,
  });
  const doc = await task.promise;

  const total = doc.numPages;
  const [from, to] = opts.pages ? [Math.max(1, opts.pages[0]), Math.min(total, opts.pages[1])] : [1, total];
  const first = await doc.getPage(from);
  const base0 = first.getViewport({ scale: 1 });
  const aspect = base0.height / base0.width;
  if (aspect < 1) throw new Error("El PDF tiene páginas horizontales: el lector necesita páginas verticales (una página por hoja).");
  const REF_H = Math.round(REF_W * aspect);
  const meta = await doc.getMetadata().catch(() => null);
  const outline = await doc.getOutline().catch(() => null);

  // ---- 1. Leer cada página
  const raw = [];
  const files = new Map();
  const skipped = []; // páginas sueltas diminutas (restos de exportación): no son páginas del libro
  for (let n = from; n <= to; n++) {
    log(`Página ${n} de ${to}`);
    const page = n === from ? first : await doc.getPage(n);
    const base = page.getViewport({ scale: 1 });
    if (base.width < 0.4 * base0.width && base.height < 0.4 * base0.height) {
      skipped.push(n);
      page.cleanup();
      continue;
    }
    const vp = page.getViewport({ scale: REF_W / base.width });
    const toRef = (r) => {
      const a = vp.convertToViewportPoint(r[0], r[1]), b = vp.convertToViewportPoint(r[2], r[3]);
      return [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])];
    };

    // Texto (sin texto girado)
    const tc = await page.getTextContent();
    const items = [];
    for (const it of tc.items) {
      if (!it.str || !it.str.trim() || !it.transform) continue;
      const [a, b, c, d, e, f] = it.transform;
      if (Math.abs(b) > 0.01 * Math.abs(a) || Math.abs(c) > 0.01 * Math.abs(d)) continue;
      const size = Math.abs(d) || Math.hypot(c, d);
      if (!size) continue;
      const r = toRef([e, f - 0.22 * size, e + (it.width || 0), f + 0.82 * size]);
      items.push({ str: it.str, size: size * vp.scale, base: r[3] - 0.22 * size * vp.scale, r });
    }

    // Enlaces del PDF
    const links = [];
    for (const an of await page.getAnnotations()) {
      if (an.subtype !== "Link" || !an.rect) continue;
      const r = toRef(an.rect);
      if (an.url && /^https?:\/\//i.test(an.url)) links.push({ r, url: an.url });
      else if (an.dest) {
        try {
          const dest = typeof an.dest === "string" ? await doc.getDestination(an.dest) : an.dest;
          if (dest && dest[0]) links.push({ r, goto: (await doc.getPageIndex(dest[0])) + 1 });
        } catch {
          // destino roto: se ignora
        }
      }
    }

    // Fotos: imágenes grandes, recortadas a lo que se ve
    const photos = [];
    for (const r0 of await imageRects(page)) {
      const r = intersect(toRef(r0), [0, 0, REF_W, REF_H]);
      if (!r || area(r) < 0.05 * REF_W * REF_H) continue;
      const same = photos.find((p) => {
        const i = intersect(p, r);
        return i && area(i) > 0.6 * Math.min(area(p), area(r));
      });
      if (same) Object.assign(same, union(same, r));
      else photos.push(r);
    }

    // Imagen de la página
    const scale = HI_W / base.width;
    const rv = page.getViewport({ scale });
    const H = Math.round(HI_W * aspect);
    const canvas = createCanvas(HI_W, H);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, HI_W, H);
    // Páginas de otro tamaño: centradas en vertical.
    const dy = Math.max(0, (H - rv.height) / 2);
    await page.render({ canvasContext: ctx, canvas, viewport: rv, transform: dy ? [1, 0, 0, 1, 0, dy] : undefined, background: "#ffffff" }).promise;
    const rgba = Buffer.from(ctx.getImageData(0, 0, HI_W, H).data.buffer);
    const img = sharp(rgba, { raw: { width: HI_W, height: H, channels: 4 } }).removeAlpha();
    const hi = await img.clone().webp({ quality: 80 }).toBuffer();
    const lowBuf = await img.clone().resize({ width: LOW_W }).webp({ quality: 72 }).toBuffer();
    const stats = await sharp(lowBuf).stats();
    const lum = (0.299 * stats.channels[0].mean + 0.587 * stats.channels[1].mean + 0.114 * stats.channels[2].mean) / 255;
    // El nombre lleva un hash del contenido: las imágenes se guardan en caché como inmutables,
    // así que una página que cambia al reconvertir debe tener otro nombre.
    const tag = (buf) => createHash("sha1").update(buf).digest("hex").slice(0, 8);
    const num = `p${String(raw.length + 1).padStart(3, "0")}`;
    const src = `pages/${num}-${tag(hi)}.webp`, low = `pages/${num}-${tag(lowBuf)}-low.webp`;
    files.set(src, hi);
    files.set(low, lowBuf);
    page.cleanup();

    raw.push({ n, items, links, photos, lum, src, low });
  }

  // ---- 2. Cabeceras, pies y números de página que se repiten
  const top = 0.07 * REF_H, bottom = REF_H - 0.09 * REF_H;
  const keyOf = (s) => s.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim();
  const count = new Map();
  const perPage = raw.map((p) => buildBlocks(p.items));
  perPage.forEach(({ lines }) => {
    const seen = new Set();
    for (const l of lines) if (l.r[3] < top || l.r[1] > bottom) seen.add(keyOf(l.str));
    for (const k of seen) count.set(k, (count.get(k) || 0) + 1);
  });
  const running = new Set([...count].filter(([k, c]) => k && c >= Math.max(3, 0.3 * raw.length)).map(([k]) => k));
  const printed = []; // número impreso de cada página (si lo tiene)
  perPage.forEach(({ lines }, i) => {
    const num = lines.find((l) => (l.r[3] < top || l.r[1] > bottom) && isNum(l.str));
    printed[i] = num ? Number(num.str) : null;
  });
  // Desfase entre número impreso y página del libro (el más frecuente).
  const offsets = new Map();
  printed.forEach((v, i) => v != null && offsets.set(i - v, (offsets.get(i - v) || 0) + 1));
  const offset = [...offsets].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 0;
  const printedIndex = (num) => {
    const i = num + offset;
    return i >= 0 && i < raw.length ? i : null;
  };

  // Tamaño de letra del cuerpo: el más común por cantidad de caracteres.
  const sizeHist = new Map();
  for (const { blocks } of perPage) for (const b of blocks) sizeHist.set(Math.round(b.size), (sizeHist.get(Math.round(b.size)) || 0) + b.text.length);
  const bodySize = [...sizeHist].sort((a, b) => b[1] - a[1])[0]?.[0] || 10;

  // Entrada del índice → página del libro. Primero por el título: la primera página después del
  // índice con un título que coincide (los números impresos de algunos PDF no cuadran con sus
  // páginas). Si no aparece, por el número impreso.
  const norm = (x) =>
    String(x)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/^\s*(?:\d+\s*[.)]?|annex\s+[ivx]+\.?|anexo\s+[ivx]+\.?|anexo\s+\d+\.?)\s*/, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  const headsOf = perPage.map(({ blocks }) => blocks.filter((b) => b.size >= bodySize * 1.25 && b.text.length < 200).map((b) => norm(b.text)));
  const tocTarget = (entry, after) => {
    const key = norm(entry.title).split(" ").slice(0, 5).join(" ");
    if (key.length >= 4) {
      for (let i = after + 1; i < raw.length; i++) if (headsOf[i].some((h) => h.startsWith(key) || (h.length >= 6 && key.startsWith(h)))) return i;
    }
    return printedIndex(entry.num);
  };

  // ---- 3. Índice sin enlaces: líneas «Título ... 12»
  const tocPages = new Set();
  const tocLinks = new Map(); // índice de página → enlaces detectados
  const sections = []; // { title, page } de las entradas principales
  raw.forEach((p, i) => {
    if (p.links.filter((l) => l.goto).length >= 3) return; // el PDF ya trae su índice enlazado
    const trailing = tocEntries(perPage[i].rows);
    const ups = trailing.filter((e, k) => k === 0 || e.num >= trailing[k - 1].num).length;
    if (trailing.length >= 5 && ups >= 0.8 * trailing.length) {
      tocPages.add(i);
      const minX = Math.min(...trailing.map((e) => e.r[0]));
      tocLinks.set(
        i,
        trailing.map((e) => ({ ...e, top: e.r[0] - minX < 0.02 * REF_W })),
      );
      return;
    }
    // Índice con el número antes del título (a menudo en rejilla de dos columnas). Las notas al
    // pie tienen la misma forma («1 Autor, título…»), así que se exige que la página se titule
    // «Índice», «Contents», etc., y que los números vayan en orden.
    if (!perPage[i].lines.some((l) => TOC_WORDS.test(l.str))) return;
    const leading = tocLeading(perPage[i].rows).filter((e) => !/https?:/i.test(e.title));
    const inOrder = [...leading].sort((a, b) => columnOf(a) - columnOf(b) || a.r[1] - b.r[1]);
    const upsL = inOrder.filter((e, k) => k === 0 || e.num >= inOrder[k - 1].num).length;
    if (leading.length >= 5 && upsL >= 0.75 * leading.length) {
      tocPages.add(i);
      tocLinks.set(i, leading);
    }
  });

  // Índice de página del libro a partir de un número de página del PDF.
  // (si esa página se omitió, la siguiente que sí está en el libro)
  const bookIndex = (pdfPage) => {
    const i = raw.findIndex((p) => p.n >= pdfPage);
    return i >= 0 ? i : null;
  };

  // ---- 4. Páginas del lector
  const pages = [];
  const pending = []; // fotos sin pie: { page, rect }
  let label = null;
  const report = { pages: raw.length, skipped, text: 0, headings: 0, hsText: 0, hsPhoto: 0, links: 0, urls: 0, tocLinks: 0, photos: 0, bodySize, offset };
  for (const [ti, entries] of tocLinks) for (const e of entries.filter((x) => x.top)) {
    const b = tocTarget(e, ti);
    if (b != null && b > ti) sections.push({ title: e.title, page: b });
  }
  if (outline?.length && !sections.length) {
    for (const o of outline) {
      try {
        const dest = typeof o.dest === "string" ? await doc.getDestination(o.dest) : o.dest;
        if (dest?.[0]) {
          const b = bookIndex((await doc.getPageIndex(dest[0])) + 1);
          if (b != null) sections.push({ title: clean(o.title), page: b });
        }
      } catch {
        // entrada del índice rota
      }
    }
  }
  sections.sort((a, b) => a.page - b.page);

  raw.forEach((p, i) => {
    const { blocks } = perPage[i];
    const kept = blocks.filter((b) => {
      if ((b.r[3] < top || b.r[1] > bottom) && (running.has(keyOf(b.text)) || isNum(b.text))) return false;
      return letters(b.text) >= 2;
    });
    for (const b of kept) b.role = b.size >= bodySize * 1.3 && b.text.length < 180 ? "heading" : b.size < bodySize * 0.85 ? "small" : "body";
    const ordered = readingOrder(kept, REF_W);
    const headings = ordered.filter((b) => b.role === "heading");
    report.text += ordered.length;
    report.headings += headings.length;

    // Sección de la página: índice/outline > primer título > la anterior
    const sec = [...sections].reverse().find((s) => s.page <= i);
    if (i === 0) label = t.cover;
    else if (tocPages.has(i)) label = t.toc;
    else if (sec) label = sec.title;
    else {
      // Antes de la primera sección: un título corto, no una cita destacada («Overfishing now affects…,»).
      const h = headings.find((b) => b.text.length <= 48 && !/[,;:]$/.test(b.text.trim()) && b.text.trim().split(/\s+/).length <= 7);
      if (h) label = h.text;
    }
    const pageLabel = label;

    const head = ordered[0]?.role === "heading" ? ordered[0].text : headings[0]?.text;
    const paras = ordered.filter((b) => b.text !== head).map((b) => b.text);

    // Puntos de zoom sobre texto: título + párrafo siguiente, o párrafos largos
    const hs = [];
    if (!tocPages.has(i)) {
      const cands = [];
      ordered.forEach((b, k) => {
        if (b.role !== "body" || b.text.length < 140) return;
        const prev = ordered[k - 1];
        const titled = prev && prev.role === "heading" && b.r[1] - prev.r[3] < 3 * prev.size && xOverlap(prev.r, b.r) > 0;
        cands.push({ b, title: titled ? prev.text : null, r: titled ? union(prev.r, b.r) : b.r });
      });
      cands.sort((a, b) => b.b.text.length - a.b.text.length);
      for (const c of cands.slice(0, MAX_TEXT_HS)) {
        const title = c.title || titleOf(c.b.text);
        const text = c.b.text;
        const zone = round(pad(c.r, 6, REF_W, REF_H));
        const left = zone[0] > 70;
        hs.push({ kind: "text", zone, dot: round([left ? zone[0] - 24 : Math.min(REF_W - 24, zone[2] + 24), zone[1] + 16]), title, text });
        report.hsText++;
      }
    }

    // Fotos: barniz y, si tienen pie de foto, punto de zoom
    const varnish = [];
    let nPhoto = 0;
    for (const r of p.photos) {
      varnish.push([...round(r), 230]);
      report.photos++;
      // Pie de foto: el bloque corto más cercano al borde inferior de la imagen (dentro o justo debajo).
      const cap = ordered
        .filter((b) => b.role !== "heading" && b.text.length < 320 && b.r[1] >= r[3] - 60 && b.r[1] <= r[3] + 40 && xOverlap(b.r, r) > 0.4 * (b.r[2] - b.r[0]))
        .sort((x, y) => Math.abs(x.r[1] - r[3]) - Math.abs(y.r[1] - r[3]))[0];
      if (cap && nPhoto < MAX_PHOTO_HS) {
        hs.push({ kind: "photo", zone: round(r), dot: round([(r[0] + r[2]) / 2, (r[1] + r[3]) / 2]), title: t.photo, text: cap.text, caption: true });
        nPhoto++;
        report.hsPhoto++;
      } else if (!cap && nPhoto < MAX_PHOTO_HS && area(r) < 0.8 * REF_W * REF_H) {
        // Sin pie: se describe aparte. Los fondos a página completa no llevan punto de zoom.
        pending.push({ page: i, rect: round(r) });
        nPhoto++;
      }
    }

    // Enlaces del PDF
    for (const l of p.links) {
      const zone = round(pad(l.r, 2, REF_W, REF_H));
      if (l.url) {
        hs.push({ kind: "url", zone, href: l.url, title: l.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "").slice(0, 60) });
        report.urls++;
      } else {
        const b = bookIndex(l.goto);
        if (b != null && b !== i) {
          hs.push({ kind: "link", zone, goto: b, title: `${t.goTo} ${pages[b]?.label || (sections.find((s) => s.page === b)?.title ?? `p. ${l.goto}`)}` });
          report.links++;
        }
      }
    }
    // Índice detectado por el texto
    for (const e of tocLinks.get(i) || []) {
      const b = tocTarget(e, i);
      if (b == null || b === i) continue;
      hs.push({ kind: "link", zone: round(pad([e.r[0] - 4, e.r[1], e.r[2] + 4, e.r[3]], 3, REF_W, REF_H)), goto: b, title: `${t.goTo} ${e.title}` });
      report.tocLinks++;
    }

    const page = { label: pageLabel, src: p.src, low: p.low, paras, hs };
    if (head) page.head = head;
    if (varnish.length) page.varnish = varnish;
    if (i === 0 && opts.coverFx === "water" && p.photos[0]) page.fx = { type: 1, rect: round(p.photos[0]) };
    pages.push(page);
  });

  // Número par de páginas: contraportada en blanco si hace falta.
  if (pages.length % 2) pages.push({ label: t.back, blank: true, color: "#f2f2ef", paras: [], hs: [] });

  // Ambiente de cada doble página según su luminosidad (sonido y partículas).
  const N = pages.length / 2;
  const moods = [];
  for (let s = 0; s <= N; s++) {
    const idx = [2 * s - 1, 2 * s].filter((k) => k >= 0 && k < raw.length);
    const l = idx.length ? idx.reduce((a, k) => a + raw[k].lum, 0) / idx.length : 0.5;
    moods.push(l < 0.32 ? "deep" : l > 0.72 ? "surface" : "calm");
  }

  const coverText = readingOrder(perPage[0]?.blocks || [], REF_W).sort((a, b) => b.size - a.size)[0]?.text;
  const manifest = {
    version: 1,
    id: opts.slug,
    lang,
    title: opts.title || meta?.info?.Title || coverText || opts.slug,
    ...(opts.kicker ? { kicker: opts.kicker } : {}),
    ...(opts.subtitle ? { subtitle: opts.subtitle } : {}),
    ref: [REF_W, REF_H],
    aspect,
    moods,
    pages,
    ...(opts.source ? { source: opts.source } : {}),
    ...(opts.pdf ? { pdf: opts.pdf } : {}),
    build: { tool: TOOL, sha256, pdfPages: total, createdAt: new Date().toISOString() },
  };
  await task.destroy();
  return { manifest, files, pending, report: { ...report, sections: sections.map((s) => `${s.page + 1}: ${s.title}`), tocPages: [...tocPages].map((i) => i + 1) } };
}
