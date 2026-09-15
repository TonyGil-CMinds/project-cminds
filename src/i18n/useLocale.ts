"use client";

import { useParams } from "next/navigation";
import { toLocale, localePath, type Locale } from "./config";

/** Reads the active locale from the `[locale]` route segment. */
export function useLocale(): Locale {
  const params = useParams<{ locale?: string }>();
  return toLocale(params?.locale);
}

/**
 * Returns a helper that prefixes app-relative paths with the active locale.
 * Use for every internal href / router.push so links stay inside the locale.
 */
export function useLocalePath(): (path: string) => string {
  const locale = useLocale();
  return (path: string) => localePath(locale, path);
}

/**
 * Picks the copy for the active locale out of a `{ en, es }` bundle.
 * Page-level copy lives next to the page in a `copy.ts` file.
 */
export function useCopy<T>(bundle: Record<Locale, T>): T {
  return bundle[useLocale()];
}
