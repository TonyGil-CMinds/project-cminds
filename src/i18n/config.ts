export const LOCALES = ["en", "es"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Human labels for the language switcher. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

/** BCP-47 tags for <html lang> and OpenGraph locale fields. */
export const LOCALE_TAGS: Record<Locale, string> = {
  en: "en",
  es: "es",
};

export const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  es: "es_MX",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Narrows any value (route param, API field) to a supported locale. */
export function toLocale(value: unknown): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/** Prefixes an app-relative path with the locale segment. */
export function localePath(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Swaps (or adds) the locale segment of a pathname. */
export function swapLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isLocale(segments[0])) segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join("/")}`;
}
