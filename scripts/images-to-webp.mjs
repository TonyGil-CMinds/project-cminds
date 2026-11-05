#!/usr/bin/env node
// Convierte imágenes JPG/PNG a WebP junto al original (foto.jpg → foto.webp).
// Usa sharp, que ya instala Next.js (npm ci); no añade dependencias.
//
// Uso (desde la raíz del repo):
//   npm run images:webp -- <archivo o carpeta> [...]            # crea .webp y conserva los originales
//   npm run images:webp -- <ruta> --replace                     # crea .webp y borra los originales
//   npm run images:webp -- <ruta> --quality=82 --max-width=1600 # ajustes
//
// Después de convertir, cambia las rutas en el código (.jpg/.png → .webp) y revisa la página.
// No conviertas imágenes que se usan para compartir en redes (og:image): deja esas en JPG/PNG.
//
// Opciones:
//   --replace        borra el original cuando el .webp se creó bien (el original sigue en Git)
//   --force          vuelve a convertir aunque ya exista un .webp
//   --quality=N      calidad de fotos (80 por defecto); los PNG con transparencia usan 90
//   --max-width=N    reduce el ancho si es mayor (sin límite por defecto)

import { readdir, stat, unlink } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("No encuentro sharp. Viene con Next.js: ejecuta `npm ci` y vuelve a intentarlo.");
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const num = (name, def) => Number(args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1]) || def;
const replace = flag("replace");
const force = flag("force");
const quality = num("quality", 80);
const maxWidth = num("max-width", 0);
const targets = args.filter((a) => !a.startsWith("--"));

if (!targets.length) {
  console.error("Indica al menos un archivo o carpeta. Ej.: npm run images:webp -- public/platforms/x/fotos");
  process.exit(1);
}

const IS_IMAGE = /\.(jpe?g|png)$/i;

async function collect(p) {
  const info = await stat(p).catch(() => null);
  if (!info) throw new Error(`No existe: ${p}`);
  if (info.isFile()) return IS_IMAGE.test(p) ? [p] : [];
  const out = [];
  for (const e of await readdir(p, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    out.push(...(await collect(join(p, e.name))));
  }
  return out;
}

async function encode(file) {
  const meta = await sharp(file).metadata();
  const base = () => {
    let img = sharp(file).rotate(); // respeta la orientación EXIF de las fotos de celular
    if (maxWidth && meta.width > maxWidth) img = img.resize({ width: maxWidth, withoutEnlargement: true });
    return img;
  };
  if (meta.hasAlpha) {
    // Logos con transparencia: prueba con y sin pérdida y quédate con el menor.
    const [lossy, lossless] = await Promise.all([
      base().webp({ quality: 90, alphaQuality: 100, effort: 6 }).toBuffer(),
      base().webp({ lossless: true, effort: 6 }).toBuffer(),
    ]);
    return lossless.length < lossy.length ? lossless : lossy;
  }
  // Fotos: si el WebP no pesa menos que el original (pasa con JPG ya muy comprimidos o con
  // mucho ruido, como las de cámara trampa), baja la calidad en pasos hasta 70.
  const original = (await stat(file)).size;
  let best;
  for (let q = quality; q >= 70; q -= 5) {
    const buf = await base().webp({ quality: q, effort: 6, smartSubsample: true }).toBuffer();
    if (!best || buf.length < best.length) best = buf;
    if (buf.length < original * 0.95) break;
  }
  return best;
}

const files = (await Promise.all(targets.map((t) => collect(resolve(t))))).flat().sort();
if (!files.length) {
  console.log("No hay JPG ni PNG en esas rutas.");
  process.exit(0);
}

let before = 0;
let after = 0;
let converted = 0;
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

for (const file of files) {
  const out = file.slice(0, -extname(file).length) + ".webp";
  const rel = relative(process.cwd(), file).split("\\").join("/");
  if (!force && (await stat(out).catch(() => null))) {
    console.log(`  ya existe  ${rel.replace(/\.(jpe?g|png)$/i, ".webp")}`);
    continue;
  }
  const size = (await stat(file)).size;
  const buf = await encode(file);
  await sharp(buf).toFile(out);
  before += size;
  after += buf.length;
  converted++;
  const pct = Math.round((1 - buf.length / size) * 100);
  const warn = buf.length >= size ? "  ⚠ el WebP no es más ligero" : "";
  console.log(`  ${kb(size).padStart(7)} → ${kb(buf.length).padStart(7)}  (${String(pct).padStart(3)}%)  ${rel}${warn}`);
  if (replace) await unlink(file);
}

if (converted) {
  console.log(`\n${converted} convertidas: ${kb(before)} → ${kb(after)} (${Math.round((1 - after / before) * 100)}% menos)` +
    (replace ? ". Originales borrados (recuperables con Git)." : ". Originales conservados."));
  console.log("Recuerda cambiar las rutas .jpg/.png → .webp en el código y revisar la página.");
}
