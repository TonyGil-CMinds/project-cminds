"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

// Respaldo en memoria para cuando localStorage no está disponible (modo privado, bloqueo de cookies).
const memory = new Map<string, string>();
const listeners = new Set<() => void>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}

function writeRaw(key: string, value: string) {
  memory.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Se conserva en memoria durante la sesión.
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Estado persistido en localStorage y compartido entre componentes (y pestañas).
 * En el servidor y durante la hidratación devuelve el valor por defecto.
 * `parse` debe ser estable (definida a nivel de módulo).
 */
export function useLocalStore<T>(key: string, parse: (raw: string | null) => T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null,
  );
  const value = useMemo(() => parse(raw), [raw, parse]);
  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = parse(readRaw(key));
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      writeRaw(key, JSON.stringify(resolved));
    },
    [key, parse],
  );
  return [value, set] as const;
}

const noop = () => () => {};

/** Valor que solo existe en el cliente (p. ej. la plataforma); en el servidor usa `server`. */
export function useClientValue<T>(get: () => T, server: T): T {
  return useSyncExternalStore(noop, get, () => server);
}
