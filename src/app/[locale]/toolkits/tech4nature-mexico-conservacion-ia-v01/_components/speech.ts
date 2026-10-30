"use client";

/**
 * Lectura en voz alta con la Web Speech API.
 * - `readPage` lee el artículo bloque por bloque, resaltando y siguiendo el bloque actual.
 * - `say` anuncia un texto suelto (modo "leer al enfocar", similar a TalkBack).
 * El estado se expone como un store externo para `useSyncExternalStore`.
 * El idioma (voz y anuncios) depende del `locale` que pasa quien llama.
 */

import type { Locale } from "@/i18n/config";

export type SpeechStatus = "idle" | "playing" | "paused";
export type SpeechState = { status: SpeechStatus; index: number; total: number };
export type SpeechOptions = { rate: number; voice: string | null; locale: Locale };

const READABLE = "h1, h2, h3, h4, p, li, dt, dd, th, td, figcaption, .tk-callout-label, .tk-kpi-num, .tk-stat-num, .tk-fact-figure";

let state: SpeechState = { status: "idle", index: 0, total: 0 };
const listeners = new Set<() => void>();
let blocks: HTMLElement[] = [];
let options: SpeechOptions = { rate: 1, voice: null, locale: "es" };
let run = 0;

function emit(next: Partial<SpeechState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function subscribeSpeech(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
export const getSpeechState = () => state;
const IDLE: SpeechState = { status: "idle", index: 0, total: 0 };
export const getServerSpeechState = () => IDLE;

// ---- Voces ------------------------------------------------------------------

/** Etiqueta de idioma preferida para cada locale del toolkit. */
const SPEECH_LANG: Record<Locale, string> = { es: "es-MX", en: "en-US" };

const voiceCache: Record<Locale, SpeechSynthesisVoice[]> = { es: [], en: [] };
const voiceKey: Record<Locale, string> = { es: "", en: "" };

/** Voces del idioma del locale, con la variante preferida (es-MX / en-US) primero. */
export function getVoices(locale: Locale): SpeechSynthesisVoice[] {
  if (!speechSupported()) return voiceCache[locale];
  const preferred = SPEECH_LANG[locale];
  const all = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(locale));
  const key = all.map((v) => v.name).join("|");
  if (key !== voiceKey[locale]) {
    voiceKey[locale] = key;
    voiceCache[locale] = all.sort(
      (a, b) => Number(b.lang.replace("_", "-") === preferred) - Number(a.lang.replace("_", "-") === preferred),
    );
  }
  return voiceCache[locale];
}
const NO_VOICES: SpeechSynthesisVoice[] = [];
export const getServerVoices = () => NO_VOICES;

export function subscribeVoices(cb: () => void) {
  if (!speechSupported()) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", cb);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", cb);
}

function utterance(text: string, opts: SpeechOptions) {
  const u = new SpeechSynthesisUtterance(text);
  const voices = getVoices(opts.locale);
  const voice = voices.find((v) => v.name === opts.voice) ?? voices[0];
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? SPEECH_LANG[opts.locale];
  u.rate = opts.rate;
  return u;
}

// ---- Lectura de la página ------------------------------------------------------

function clearHighlight() {
  document.querySelectorAll(".tk-speaking").forEach((el) => el.classList.remove("tk-speaking"));
}

function collect(root: HTMLElement): HTMLElement[] {
  const found = Array.from(root.querySelectorAll<HTMLElement>(READABLE)).filter((el) => {
    // Migas, paginación y menús no se leen: la lectura empieza en el título.
    if (el.closest("nav, [aria-hidden='true'], [hidden], .tk-no-speak")) return false;
    if (!el.offsetParent && getComputedStyle(el).position !== "fixed") return false;
    return (el.innerText || "").trim().length > 0;
  });
  // Evita leer dos veces: un <li> que contiene un <p> se lee a través del <p>.
  return found.filter((el) => !found.some((other) => other !== el && el.contains(other)));
}

function speakAt(i: number, token: number) {
  if (token !== run) return;
  if (i >= blocks.length) {
    stop();
    return;
  }
  const el = blocks[i];
  clearHighlight();
  el.classList.add("tk-speaking");
  const reduce = document.documentElement.dataset.tkMotion === "reduce" || matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  emit({ status: "playing", index: i });
  const u = utterance(el.innerText.replace(/\s+/g, " ").trim(), options);
  u.onend = () => speakAt(i + 1, token);
  u.onerror = (e) => {
    if (e.error !== "interrupted" && e.error !== "canceled") speakAt(i + 1, token);
  };
  window.speechSynthesis.speak(u);
}

export function readPage(root: HTMLElement, opts: SpeechOptions, from = 0) {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  options = opts;
  blocks = collect(root);
  run += 1;
  emit({ status: "playing", index: from, total: blocks.length });
  speakAt(from, run);
}

export function skip(delta: number) {
  if (state.status === "idle") return;
  window.speechSynthesis.cancel();
  run += 1;
  speakAt(Math.max(0, Math.min(blocks.length - 1, state.index + delta)), run);
}

export function pause() {
  if (!speechSupported() || state.status !== "playing") return;
  window.speechSynthesis.pause();
  emit({ status: "paused" });
}

export function resume() {
  if (!speechSupported() || state.status !== "paused") return;
  window.speechSynthesis.resume();
  emit({ status: "playing" });
}

export function stop() {
  run += 1;
  if (speechSupported()) window.speechSynthesis.cancel();
  clearHighlight();
  blocks = [];
  emit({ status: "idle", index: 0, total: 0 });
}

/** Anuncia un texto corto, interrumpiendo lo anterior (no afecta la lectura de página). */
export function say(text: string, opts: SpeechOptions) {
  if (!speechSupported() || !text.trim()) return;
  if (state.status !== "idle") stop();
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance(text, opts));
}

// ---- Descripción accesible (modo "leer al enfocar") ---------------------------

const SR = {
  es: {
    roles: {
      a: "Enlace",
      button: "Botón",
      select: "Lista desplegable",
      textarea: "Campo de texto",
      summary: "Desplegable",
    } as Record<string, string>,
    tab: "Pestaña",
    switch: "Interruptor",
    menuitem: "Opción de menú",
    option: "Opción",
    heading: (n: string) => `Encabezado nivel ${n}`,
    checkbox: "Casilla",
    search: "Búsqueda",
    field: "Campo",
    on: "activado",
    off: "desactivado",
    expanded: "expandido",
    collapsed: "contraído",
    selected: "seleccionado",
    current: "página actual",
    checked: "marcado",
    unchecked: "sin marcar",
  },
  en: {
    roles: {
      a: "Link",
      button: "Button",
      select: "Drop-down list",
      textarea: "Text field",
      summary: "Disclosure",
    } as Record<string, string>,
    tab: "Tab",
    switch: "Switch",
    menuitem: "Menu item",
    option: "Option",
    heading: (n: string) => `Heading level ${n}`,
    checkbox: "Checkbox",
    search: "Search",
    field: "Field",
    on: "on",
    off: "off",
    expanded: "expanded",
    collapsed: "collapsed",
    selected: "selected",
    current: "current page",
    checked: "checked",
    unchecked: "not checked",
  },
} satisfies Record<Locale, unknown>;
function nameOf(el: HTMLElement): string {
  const labelled = el.getAttribute("aria-labelledby");
  if (labelled) {
    const text = labelled
      .split(/\s+/)
      .map((id) => document.getElementById(id)?.innerText ?? "")
      .join(" ")
      .trim();
    if (text) return text;
  }
  const aria = el.getAttribute("aria-label");
  if (aria) return aria;
  if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) {
    const label = el.labels?.[0]?.innerText || el.getAttribute("placeholder") || "";
    const value = el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox") ? "" : el.value;
    return [label, value].filter(Boolean).join(", ");
  }
  return (el.innerText || el.getAttribute("title") || el.getAttribute("alt") || "").replace(/\s+/g, " ").trim();
}

/** Texto que se anuncia para un elemento: rol, nombre y estado, como un lector de pantalla. */
export function describe(el: HTMLElement, locale: Locale): string {
  const t = SR[locale];
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role");
  let kind = t.roles[tag] ?? "";
  if (role === "tab") kind = t.tab;
  else if (role === "switch") kind = t.switch;
  else if (role === "menuitem") kind = t.menuitem;
  else if (role === "option") kind = t.option;
  else if (/^h[1-6]$/.test(tag)) kind = t.heading(tag[1]);
  else if (tag === "input") {
    const type = (el as HTMLInputElement).type;
    kind = type === "radio" ? t.option : type === "checkbox" ? t.checkbox : type === "search" ? t.search : t.field;
  }

  const states: string[] = [];
  const checked = el.getAttribute("aria-checked");
  if (checked === "true") states.push(t.on);
  if (checked === "false") states.push(t.off);
  const pressed = el.getAttribute("aria-pressed");
  if (pressed === "true") states.push(t.on);
  if (pressed === "false") states.push(t.off);
  const expanded = el.getAttribute("aria-expanded");
  if (expanded === "true") states.push(t.expanded);
  if (expanded === "false") states.push(t.collapsed);
  if (el.getAttribute("aria-selected") === "true") states.push(t.selected);
  if (el.getAttribute("aria-current")) states.push(t.current);
  if (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox")) {
    states.push(el.checked ? t.checked : t.unchecked);
  }

  return [nameOf(el), kind, states.join(", ")].filter(Boolean).join(". ");
}
