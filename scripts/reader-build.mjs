// Convierte un PDF al lector 3D y (opcional) lo sube a R2.
//
//   npm run reader:build -- <archivo.pdf | https://…pdf> --slug <slug> --lang es [opciones]
//   npm run reader:build -- --report <id> --slug <slug> --lang es [opciones]
//
// Opciones:
//   --slug <slug>        nombre en la URL: /lector/<slug> (minúsculas, números y guiones)
//   --lang es|en|pt      idioma de la publicación
//   --title, --kicker, --subtitle   textos de la portada de carga (si faltan, se toman del PDF)
//   --report <id>        reporte del Archive: descarga su PDF y el lector ofrece descargarlo
//   --report-lang ES     archivo del reporte a usar (por defecto, el del idioma --lang)
//   --pdf-url <url>      enlace al PDF original cuando no está en el Archive
//   --pages 1-12         solo esas páginas (para pruebas)
//   --cover-fx water     ondas de agua al pasar el cursor por la foto de portada
//   --out <carpeta>      por defecto public/readers/<slug>/<lang>
//   --upload             sube la carpeta a R2 (readers/<slug>) al terminar
//
// Escribe manifest.json y pages/*.webp. Vuelve a convertir solo si el PDF cambió (usa --force para forzar).

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { convertPdf } from "./reader/convert.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const READERS = join(ROOT, "public", "readers");

function parseArgs(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) o._.push(a);
    else if (["--upload", "--force"].includes(a)) o[a.slice(2)] = true;
    else o[a.slice(2)] = argv[++i];
  }
  return o;
}
const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
};

async function fetchBytes(url) {
  const res = await fetch(url);
  if (!res.ok) fail(`No se pudo descargar el PDF (${res.status}): ${url}`);
  return new Uint8Array(await res.arrayBuffer());
}

async function pdfFromReport(id, lang) {
  const key = process.env.REPORTES_API_KEY;
  if (!key) fail("Falta REPORTES_API_KEY en .env.local para leer el Archive.");
  const res = await fetch(`https://cminds.base44.app/functions/publicReportsFeed?id=${encodeURIComponent(id)}`, { headers: { "x-api-key": key } });
  if (!res.ok) fail(`El Archive respondió ${res.status} para el reporte ${id}.`);
  const data = await res.json();
  const report = Array.isArray(data?.reports) ? data.reports[0] : data;
  const files = report?.files ?? [];
  const file = files.find((f) => String(f.language).toLowerCase() === lang.toLowerCase()) || files[0];
  if (!file?.url) fail(`El reporte ${id} no tiene archivo.`);
  return { bytes: await fetchBytes(file.url), title: file.title || report.title, subtitle: file.description || report.description, fileLang: file.language || lang };
}

const args = parseArgs(process.argv.slice(2));
const slug = args.slug;
const lang = (args.lang || "es").toLowerCase();
if (!slug || !/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug)) fail("Indica --slug (minúsculas, números y guiones).");
if (!["es", "en", "pt"].includes(lang)) fail("--lang debe ser es, en o pt.");
const input = args._[0];
if (!input && !args.report) fail("Indica un PDF (archivo o URL) o --report <id>.");

let bytes, fromReport = null;
if (args.report && !input) {
  console.log(`Descargando el reporte ${args.report} del Archive…`);
  fromReport = await pdfFromReport(args.report, args["report-lang"] || lang);
  bytes = fromReport.bytes;
} else if (/^https?:\/\//.test(input)) {
  console.log("Descargando el PDF…");
  bytes = await fetchBytes(input);
} else {
  bytes = new Uint8Array(await readFile(resolve(input)));
}
if (String.fromCharCode(...bytes.slice(0, 5)) !== "%PDF-") fail("El archivo no es un PDF.");

const outDir = resolve(args.out || join(READERS, slug, lang));
if (!args.out && !outDir.startsWith(READERS + sep)) fail("Carpeta de salida no válida.");
const manifestPath = join(outDir, "manifest.json");

// Si el PDF no cambió, no se vuelve a convertir.
const sha = createHash("sha256").update(bytes).digest("hex");
try {
  const prev = JSON.parse(await readFile(manifestPath, "utf8"));
  if (!args.force && prev?.build?.sha256 === sha && !args.pages) {
    console.log(`El PDF no cambió desde la última conversión (${prev.build.createdAt}). Usa --force para rehacerla.`);
    await updateIndex(prev);
    if (args.upload) upload();
    process.exit(0);
  }
} catch {
  // primera conversión
}

const pages = args.pages ? args.pages.split("-").map(Number) : undefined;
const t0 = Date.now();
const { manifest, files, report } = await convertPdf(bytes, {
  slug,
  lang,
  title: args.title || fromReport?.title,
  kicker: args.kicker,
  subtitle: args.subtitle || fromReport?.subtitle,
  source: args.report ? { reportId: args.report, lang: (args["report-lang"] || fromReport?.fileLang || lang).toUpperCase() } : undefined,
  pdf: args["pdf-url"],
  pages: pages && pages.length === 2 ? pages : undefined,
  coverFx: args["cover-fx"] === "water" ? "water" : undefined,
  onProgress: (m) => process.stdout.write(`\r${m}        `),
});
process.stdout.write("\n");

// Escribe la carpeta desde cero (solo la del lector).
await rm(join(outDir, "pages"), { recursive: true, force: true });
await mkdir(join(outDir, "pages"), { recursive: true });
let size = 0;
for (const [rel, buf] of files) {
  await writeFile(join(outDir, rel), buf);
  size += buf.length;
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 1));

const secs = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`\n✔ ${manifest.title}: ${report.pages} páginas en ${secs} s · ${(size / 1048576).toFixed(1)} MB de imágenes`);
console.log(`  Texto: ${report.text} bloques (${report.headings} títulos) · cuerpo ${report.bodySize} px`);
console.log(`  Puntos de zoom: ${report.hsText} de texto, ${report.hsPhoto} de fotos · fotos detectadas: ${report.photos}`);
console.log(`  Enlaces: ${report.links} internos del PDF, ${report.tocLinks} del índice, ${report.urls} externos`);
if (report.tocPages.length) console.log(`  Índice en la página ${report.tocPages.join(", ")} · desfase de numeración: ${report.offset}`);
if (report.sections.length) console.log(`  Secciones: ${report.sections.slice(0, 12).join(" | ")}${report.sections.length > 12 ? " …" : ""}`);
console.log(`  Archivos: ${relative(ROOT, outDir)}`);
console.log(`  Ver en local: http://localhost:3000/${lang}/lector/${slug}${lang === "es" || lang === "en" ? "" : `?lang=${lang}`}`);

await updateIndex(manifest);
if (args.upload) upload();

/**
 * Registro de lectores (readers/index.json): qué reportes del Archive tienen lector y en qué
 * idiomas. Se fusiona con la copia de R2 para no perder lectores hechos desde otra computadora.
 */
async function updateIndex(m) {
  const indexPath = join(READERS, "index.json");
  const read = async () => {
    try {
      return JSON.parse(await readFile(indexPath, "utf8"));
    } catch {
      return null;
    }
  };
  const remote = await (async () => {
    const base = (process.env.NEXT_PUBLIC_ASSETS_URL ?? "").trim().replace(/\/+$/, "");
    if (!base) return null;
    try {
      const res = await fetch(`${base}/readers/index.json`, { cache: "no-store" });
      return res.ok ? await res.json() : null;
    } catch {
      return null;
    }
  })();
  const bySlug = new Map();
  for (const src of [remote, await read()]) for (const e of src?.readers ?? []) bySlug.set(e.slug, { ...bySlug.get(e.slug), ...e });
  const prev = bySlug.get(slug);
  const langs = [...new Set([...(prev?.langs ?? []), lang])].sort();
  bySlug.set(slug, {
    slug,
    title: m.title,
    langs,
    ...(m.source?.reportId || prev?.reportId ? { reportId: m.source?.reportId || prev.reportId } : {}),
    updatedAt: new Date().toISOString(),
  });
  const index = { version: 1, readers: [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug)) };
  await mkdir(READERS, { recursive: true });
  await writeFile(indexPath, JSON.stringify(index, null, 1));
  console.log(`  Registro: ${index.readers.length} lectores en readers/index.json`);
}

function upload() {
  const prefix = relative(join(ROOT, "public"), dirname(outDir)).split(sep).join("/");
  console.log(`\nSubiendo ${prefix} y el registro a R2…`);
  for (const target of [prefix, "readers/index.json"]) {
    const r = spawnSync(process.execPath, [join(ROOT, "scripts", "r2-upload.mjs"), target, "--upload"], { stdio: "inherit", env: process.env });
    if (r.status !== 0) fail("La subida a R2 falló.");
  }
}
