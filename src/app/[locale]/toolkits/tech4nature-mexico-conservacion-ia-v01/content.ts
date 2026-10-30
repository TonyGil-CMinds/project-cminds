/**
 * Contenido del toolkit por idioma. El español (data.ts, t4n.ts) es la fuente;
 * data.en.ts y t4n.en.ts reexportan todo lo que no cambia (recursos, especies,
 * slugs) y sustituyen solo los textos traducidos.
 */
import type { Locale } from "@/i18n/config";
import * as esData from "./data";
import * as esT4n from "./t4n";
import * as enData from "./data.en";
import * as enT4n from "./t4n.en";

const ES = { ...esData, ...esT4n };
export type Content = typeof ES;
const EN: Content = { ...enData, ...enT4n };

export function getContent(locale: Locale): Content {
  return locale === "en" ? EN : ES;
}

/** Elige el texto del idioma: `pick(locale, { es: "…", en: "…" })`. */
export function pick<T>(locale: Locale, v: Record<Locale, T>): T {
  return v[locale];
}
