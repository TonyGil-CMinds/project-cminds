"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, swapLocale, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/useLocale";
import { common } from "@/i18n/common";

/**
 * EN / ES segmented pill. Sits to the right of NavSearch in `.main-nav`.
 * Swaps the `[locale]` segment of the current URL so the visitor stays on the
 * same page, and remembers the choice for the `/` redirect in middleware.
 */
export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = common[locale].language;

  const go = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // One year, site-wide — read back by middleware on `/`.
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
      // Read the query at click time so the component stays out of Suspense.
      const query = typeof window === "undefined" ? "" : window.location.search;
      router.push(`${swapLocale(pathname, next)}${query}`);
    },
    [locale, pathname, router]
  );

  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t.switchTo}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switch__opt ${code === locale ? "is-active" : ""}`}
          onClick={() => go(code)}
          aria-current={code === locale ? "true" : undefined}
          lang={code}
          title={t[code]}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
