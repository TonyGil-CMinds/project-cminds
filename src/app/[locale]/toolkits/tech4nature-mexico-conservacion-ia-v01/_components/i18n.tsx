"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { getContent } from "../content";

const LocaleContext = createContext<Locale>("es");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Idioma de la página actual del toolkit. */
export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Contenido del toolkit en el idioma actual (mismos nombres que data.ts y t4n.ts). */
export function useContent() {
  return getContent(useLocale());
}
