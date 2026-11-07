import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ASSETS_URL, asset } from "@/lib/assets";
import type { ReaderManifest } from "./types";

/** Los lectores viven en R2 (o en /public en local) bajo /readers/{slug}/{idioma}/. */
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;
const LANG_RE = /^[a-z]{2}$/;

/**
 * Lee el manifest de una carpeta y devuelve también la base para resolver sus imágenes.
 * En producción solo se lee de R2. En desarrollo, si no está en R2, se usa la copia de /public:
 * así se puede revisar una conversión (npm run reader:build) antes de subirla.
 */
async function fetchManifest(dir: string): Promise<{ data: unknown; base: string } | null> {
  if (ASSETS_URL) {
    try {
      const res = await fetch(asset(`${dir}manifest.json`), { next: { revalidate: 300 } });
      if (res.ok) return { data: await res.json(), base: asset(dir) };
    } catch {
      // sin red o sin objeto: se intenta la copia local
    }
  }
  if (!ASSETS_URL || process.env.NODE_ENV !== "production") {
    try {
      return { data: JSON.parse(await readFile(join(process.cwd(), "public", dir, "manifest.json"), "utf8")), base: dir };
    } catch {
      return null;
    }
  }
  return null;
}

function isManifest(v: unknown): v is ReaderManifest {
  if (!v || typeof v !== "object") return false;
  const m = v as Partial<ReaderManifest>;
  return (
    m.version === 1 &&
    typeof m.title === "string" &&
    Array.isArray(m.ref) &&
    typeof m.aspect === "number" &&
    Array.isArray(m.pages) &&
    m.pages.length >= 2 &&
    m.pages.length % 2 === 0
  );
}

/** Entrada del registro de lectores (readers/index.json, lo escribe npm run reader:build). */
export type ReaderIndexEntry = { slug: string; title: string; langs: string[]; reportId?: string };

async function fetchIndex(): Promise<unknown | null> {
  if (ASSETS_URL) {
    try {
      const res = await fetch(asset("/readers/index.json"), { next: { revalidate: 300 } });
      if (res.ok) return await res.json();
    } catch {
      // se intenta la copia local
    }
  }
  if (!ASSETS_URL || process.env.NODE_ENV !== "production") {
    try {
      return JSON.parse(await readFile(join(process.cwd(), "public", "readers", "index.json"), "utf8"));
    } catch {
      return null;
    }
  }
  return null;
}

/** Lectores por id de reporte del Archive: { [reportId]: { slug, langs } }. */
export async function loadReaderIndex(): Promise<Record<string, { slug: string; langs: string[] }>> {
  const data = await fetchIndex();
  const list = data && typeof data === "object" && Array.isArray((data as { readers?: unknown }).readers) ? (data as { readers: unknown[] }).readers : [];
  const out: Record<string, { slug: string; langs: string[] }> = {};
  for (const e of list) {
    if (!e || typeof e !== "object") continue;
    const { slug, langs, reportId } = e as Partial<ReaderIndexEntry>;
    if (typeof slug !== "string" || !SLUG_RE.test(slug) || typeof reportId !== "string" || !Array.isArray(langs)) continue;
    const ok = langs.filter((l): l is string => typeof l === "string" && LANG_RE.test(l));
    if (ok.length) out[reportId] = { slug, langs: ok };
  }
  return out;
}

/**
 * Carga el manifest del primer idioma disponible de `langs` y convierte las rutas de las
 * páginas en URLs absolutas (relativas a la carpeta del manifest).
 */
export async function loadReaderManifest(slug: string, langs: (string | undefined)[]): Promise<ReaderManifest | null> {
  if (!SLUG_RE.test(slug)) return null;
  const tried = new Set<string>();
  for (const raw of langs) {
    const lang = raw?.toLowerCase();
    if (!lang || !LANG_RE.test(lang) || tried.has(lang)) continue;
    tried.add(lang);
    const found = await fetchManifest(`/readers/${slug}/${lang}/`);
    if (!found || !isManifest(found.data)) continue;
    const { data, base } = found;
    const resolve = (src?: string) => (!src ? src : /^https?:\/\//.test(src) ? src : base + src.replace(/^\.?\//, ""));
    return { ...data, pdf: resolve(data.pdf), pages: data.pages.map((p) => ({ ...p, src: resolve(p.src), low: resolve(p.low) })) };
  }
  return null;
}
