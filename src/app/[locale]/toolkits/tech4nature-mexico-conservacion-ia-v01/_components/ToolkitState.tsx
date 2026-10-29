"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { ACTIONS, AUDIENCES, STORAGE_KEY, targetOf, type Audience } from "../data";
import { useLocalStore } from "./useLocalStore";

type Persisted = { route: string | null; done: string[]; celebrated: boolean };

type ToolkitContextValue = {
  route: Audience | null;
  done: string[];
  setRoute: (id: string | null) => void;
  toggleDone: (id: string) => void;
  setDone: (id: string, value: boolean) => void;
  isDone: (id: string) => boolean;
  /** Si la página (por slug) forma parte de la ruta elegida. */
  inRoute: (slug: string) => boolean;
  /** Las 12 acciones están revisadas: la insignia está desbloqueada. */
  complete: boolean;
  /** El aviso de insignia ya se mostró. */
  celebrated: boolean;
  markCelebrated: () => void;
};

const ToolkitContext = createContext<ToolkitContextValue | null>(null);

const ACTION_IDS = new Set(ACTIONS.map((a) => a.id));

/** Valida lo guardado: datos ajenos o de otra versión se descartan. */
function parse(raw: string | null): Persisted {
  try {
    const parsed = (raw ? JSON.parse(raw) : {}) as Partial<Persisted>;
    return {
      route: typeof parsed.route === "string" ? parsed.route : null,
      done: Array.isArray(parsed.done) ? parsed.done.filter((d) => typeof d === "string" && ACTION_IDS.has(d)) : [],
      celebrated: parsed.celebrated === true,
    };
  } catch {
    return { route: null, done: [], celebrated: false };
  }
}

export function ToolkitProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStore(STORAGE_KEY, parse);

  const setRoute = useCallback((id: string | null) => setState((s) => ({ ...s, route: id })), [setState]);
  const setDone = useCallback(
    (id: string, value: boolean) =>
      setState((s) => ({ ...s, done: value ? [...new Set([...s.done, id])] : s.done.filter((d) => d !== id) })),
    [setState],
  );
  const toggleDone = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, done: s.done.includes(id) ? s.done.filter((d) => d !== id) : [...s.done, id] })),
    [setState],
  );
  const markCelebrated = useCallback(() => setState((s) => ({ ...s, celebrated: true })), [setState]);

  const value = useMemo<ToolkitContextValue>(() => {
    const route = AUDIENCES.find((a) => a.id === state.route) ?? null;
    const slugs = new Set((route?.path ?? []).map((key) => targetOf(key).slug));
    return {
      route,
      done: state.done,
      setRoute,
      toggleDone,
      setDone,
      isDone: (id) => state.done.includes(id),
      inRoute: (slug) => slugs.has(slug),
      complete: state.done.length === ACTIONS.length,
      celebrated: state.celebrated,
      markCelebrated,
    };
  }, [state, setRoute, toggleDone, setDone, markCelebrated]);

  return <ToolkitContext.Provider value={value}>{children}</ToolkitContext.Provider>;
}

export function useToolkit(): ToolkitContextValue {
  const ctx = useContext(ToolkitContext);
  if (!ctx) throw new Error("useToolkit must be used inside <ToolkitProvider>");
  return ctx;
}

export const SECTION_LABELS: Record<string, string> = {
  contexto: "Contexto",
  caso: "Caso Tech4Nature",
  biblioteca: "Biblioteca",
};
