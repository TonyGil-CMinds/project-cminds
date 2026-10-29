"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { useLocalStore } from "./useLocalStore";
import { PREFS_KEY } from "./prefs-script";

export type ThemePref = "dark" | "light" | "system";
export type FontSize = "sm" | "md" | "lg" | "xl";

export type Prefs = {
  theme: ThemePref;
  fontSize: FontSize;
  spacing: boolean;
  underline: boolean;
  reduceMotion: boolean;
  readOnFocus: boolean;
  rate: number;
  voice: string | null;
};

const DEFAULTS: Prefs = {
  theme: "dark",
  fontSize: "md",
  spacing: false,
  underline: false,
  reduceMotion: false,
  readOnFocus: false,
  rate: 1,
  voice: null,
};

const FONT_SIZES: FontSize[] = ["sm", "md", "lg", "xl"];

function parse(raw: string | null): Prefs {
  try {
    const p = (raw ? JSON.parse(raw) : {}) as Partial<Prefs>;
    return {
      theme: p.theme === "light" || p.theme === "system" ? p.theme : "dark",
      fontSize: FONT_SIZES.includes(p.fontSize as FontSize) ? (p.fontSize as FontSize) : "md",
      spacing: p.spacing === true,
      underline: p.underline === true,
      reduceMotion: p.reduceMotion === true,
      readOnFocus: p.readOnFocus === true,
      rate: typeof p.rate === "number" && p.rate >= 0.5 && p.rate <= 2 ? p.rate : 1,
      voice: typeof p.voice === "string" ? p.voice : null,
    };
  } catch {
    return DEFAULTS;
  }
}

function subscribeScheme(cb: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

type PrefsValue = {
  prefs: Prefs;
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  reset: () => void;
  /** Tema efectivo, ya resuelta la opción "sistema". */
  theme: "dark" | "light";
  /** Preferencia del usuario o del sistema operativo. */
  reducedMotion: boolean;
};

const PrefsContext = createContext<PrefsValue | null>(null);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useLocalStore(PREFS_KEY, parse);
  const systemLight = useSyncExternalStore(
    subscribeScheme,
    () => window.matchMedia("(prefers-color-scheme: light)").matches,
    () => false,
  );
  const systemReduce = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const theme = prefs.theme === "system" ? (systemLight ? "light" : "dark") : prefs.theme;

  // Las preferencias viven en <html> para que el tamaño de letra escale también el pie de página.
  useEffect(() => {
    const d = document.documentElement.dataset;
    d.tkTheme = theme;
    d.tkFs = prefs.fontSize;
    if (prefs.spacing) d.tkSpacing = "wide";
    else delete d.tkSpacing;
    if (prefs.underline) d.tkLinks = "underline";
    else delete d.tkLinks;
    if (prefs.reduceMotion) d.tkMotion = "reduce";
    else delete d.tkMotion;
  }, [theme, prefs.fontSize, prefs.spacing, prefs.underline, prefs.reduceMotion]);

  // Al salir del toolkit, el resto del sitio vuelve a su aspecto normal.
  useEffect(
    () => () => {
      const d = document.documentElement.dataset;
      delete d.tkTheme;
      delete d.tkFs;
      delete d.tkSpacing;
      delete d.tkLinks;
      delete d.tkMotion;
    },
    [],
  );

  const setPref = useCallback(
    <K extends keyof Prefs>(key: K, value: Prefs[K]) => setPrefs((p) => ({ ...p, [key]: value })),
    [setPrefs],
  );
  const reset = useCallback(() => setPrefs(DEFAULTS), [setPrefs]);

  const value = useMemo<PrefsValue>(
    () => ({ prefs, setPref, reset, theme, reducedMotion: prefs.reduceMotion || systemReduce }),
    [prefs, setPref, reset, theme, systemReduce],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}
