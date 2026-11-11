// Convierte al lector 3D los reportes publicados en The Archive que aún no lo tienen
// (o cuyo PDF cambió). Pensado para correr solo (GitHub Actions) o a mano.
//
//   npm run reader:sync                 convierte en public/readers (para revisar en local)
//   npm run reader:sync -- --upload     además sube cada lector y el registro a R2
//
// Opciones:
//   --only <id[,id…]>   solo esos reportes
//   --limit <n>         como máximo n conversiones nuevas en esta corrida
//   --dry-run           muestra qué haría, sin convertir
//   --force             reconvierte aunque el PDF no haya cambiado
//   --no-ai             sin descripciones con IA de las fotos sin pie
//
// Un lector por reporte (slug a partir del título del archivo) y un idioma por archivo.
// Si un archivo falla (PDF dañado, páginas horizontales…), lo reporta y sigue con los demás.

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["es", "en", "pt"];

const args = { _: [] };
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (["--upload", "--dry-run", "--force", "--no-ai"].includes(a)) args[a.slice(2)] = true;
  else if (a.startsWith("--")) args[a.slice(2)] = process.argv[++i];
  else args._.push(a);
}
const only = args.only ? new Set(String(args.only).split(",").map((s) => s.trim())) : null;
const limit = args.limit ? Number(args.limit) : Infinity;

// Con REPORTES_API_KEY lee Base44 directo; sin ella, el feed público del sitio (mismos datos).
const key = process.env.REPORTES_API_KEY;
const SITE = (process.env.READER_SYNC_SITE || "https://www.cminds.co").replace(/\/+$/, "");
if (args.upload) {
  const missing = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "NEXT_PUBLIC_ASSETS_URL"].filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`✖ Para subir a R2 faltan: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// ---- Reportes publicados
const res = key
  ? await fetch("https://cminds.base44.app/functions/publicReportsFeed?status=published", { headers: { "x-api-key": key } })
  : await fetch(`${SITE}/api/reports`);
if (!res.ok) {
  console.error(`✖ El Archive respondió ${res.status}.`);
  process.exit(1);
}
const feed = await res.json();
const reports = (Array.isArray(feed) ? feed : feed?.reports ?? []).filter((r) => r?.id && (!only || only.has(r.id)));

// ---- Registro actual (R2 + local): reportId → slug, para no duplicar lectores
const known = new Map(); // reportId → slug
const taken = new Map(); // slug → reportId | null
for (const src of [await remoteIndex(), await localIndex()]) {
  for (const e of src?.readers ?? []) {
    taken.set(e.slug, e.reportId ?? null);
    if (e.reportId) known.set(e.reportId, e.slug);
  }
}

// Palabras completas, hasta ~50 caracteres: «gobernanza-de-datos-y-las-nuevas-tecnologias».
function slugify(s) {
  const words = String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  let out = "";
  for (const w of words) {
    if (out && out.length + 1 + w.length > 50) break;
    out = out ? `${out}-${w}` : w.slice(0, 50);
  }
  // Sin conectores al final («…-para-la» → «…»).
  const STOP = new Set(["de", "del", "la", "las", "el", "los", "y", "e", "a", "en", "para", "por", "con", "da", "do", "das", "dos", "em", "the", "of", "for", "and", "in", "to"]);
  const parts = out.split("-");
  while (parts.length > 2 && STOP.has(parts[parts.length - 1])) parts.pop();
  return parts.join("-");
}

function slugFor(report) {
  if (known.has(report.id)) return known.get(report.id);
  const files = report.files ?? [];
  const base = slugify((files.find((f) => /^es$/i.test(f.language)) || files[0])?.title || report.title) || "reporte";
  let slug = base;
  for (let n = 2; taken.has(slug) && taken.get(slug) !== report.id; n++) slug = `${base}-${n}`;
  taken.set(slug, report.id);
  known.set(report.id, slug);
  return slug;
}

// ---- Trabajo: un lector por archivo (idioma)
const jobs = [];
for (const r of reports) {
  const seen = new Set();
  for (const f of r.files ?? []) {
    const lang = String(f.language || "").toLowerCase();
    if (!LANGS.includes(lang) || seen.has(lang) || !f.url) continue;
    seen.add(lang);
    jobs.push({ id: r.id, slug: slugFor(r), lang, title: f.title || r.title, subtitle: f.description || r.description || "", url: f.url });
  }
}
console.log(`${reports.length} reportes · ${jobs.length} archivos\n`);

const result = { converted: [], unchanged: [], failed: [] };
let fresh = 0;
for (const [i, j] of jobs.entries()) {
  const label = `[${i + 1}/${jobs.length}] ${j.slug} (${j.lang})`;
  if (args["dry-run"]) {
    console.log(`${label} ← ${j.id} «${j.title}»`);
    continue;
  }
  if (fresh >= limit) {
    console.log(`${label}: se deja para la siguiente corrida (--limit ${limit})`);
    continue;
  }
  console.log(`\n${label}`);
  // Se pasa el PDF y sus textos ya leídos del feed: reader-build no necesita volver a consultarlo.
  const cli = [join(ROOT, "scripts", "reader-build.mjs"), j.url, "--report", j.id, "--report-lang", j.lang.toUpperCase(), "--lang", j.lang, "--slug", j.slug, "--title", j.title];
  if (j.subtitle) cli.push("--subtitle", j.subtitle.replace(/\s+/g, " ").trim().slice(0, 240));
  for (const flag of ["upload", "force", "no-ai"]) if (args[flag]) cli.push(`--${flag}`);
  const run = spawnSync(process.execPath, cli, { env: process.env, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  process.stdout.write(out.replace(/^.*\r(?!\n)/gm, ""));
  if (run.status !== 0) result.failed.push({ ...j, why: (out.match(/✖ (.+)/)?.[1] ?? out.match(/^Error: (.+)$/m)?.[1] ?? out.trim().split("\n").pop() ?? "").slice(0, 160) });
  else if (/no cambió|Ya está convertido/.test(out)) result.unchanged.push(j);
  else {
    result.converted.push(j);
    fresh++;
  }
}

if (!args["dry-run"]) {
  console.log(`\n— Resumen —`);
  console.log(`Convertidos: ${result.converted.length}${result.converted.length ? ` (${result.converted.map((j) => `${j.slug}/${j.lang}`).join(", ")})` : ""}`);
  console.log(`Sin cambios: ${result.unchanged.length}`);
  console.log(`Con error: ${result.failed.length}`);
  for (const f of result.failed) console.log(`  · ${f.slug}/${f.lang} (${f.id}): ${f.why}`);
  // En GitHub Actions, el resumen queda en la página de la corrida.
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFile } = await import("node:fs/promises");
    const rows = [
      `### Lector 3D: ${result.converted.length} convertidos, ${result.unchanged.length} sin cambios, ${result.failed.length} con error`,
      ...result.converted.map((j) => `- ✅ ${j.title} (${j.lang}) → /${j.lang === "pt" ? "es" : j.lang}/lector/${j.slug}`),
      ...result.failed.map((j) => `- ⚠️ ${j.title} (${j.lang}): ${j.why}`),
    ];
    await appendFile(process.env.GITHUB_STEP_SUMMARY, rows.join("\n") + "\n");
  }
}

async function remoteIndex() {
  const base = (process.env.NEXT_PUBLIC_ASSETS_URL ?? "").trim().replace(/\/+$/, "");
  if (!base) return null;
  try {
    const r = await fetch(`${base}/readers/index.json`, { cache: "no-store" });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}
async function localIndex() {
  try {
    return JSON.parse(await readFile(join(ROOT, "public", "readers", "index.json"), "utf8"));
  } catch {
    return null;
  }
}
