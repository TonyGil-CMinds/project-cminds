"use client";

/**
 * Lectura en voz alta con la Web Speech API.
 * - `readPage` lee el artículo bloque por bloque, resaltando y siguiendo el bloque actual.
 * - `say` anuncia un texto suelto (modo "leer al enfocar", similar a TalkBack).
 * El estado se expone como un store externo para `useSyncExternalStore`.
 */

export type SpeechStatus = "idle" | "playing" | "paused";
export type SpeechState = { status: SpeechStatus; index: number; total: number };
export type SpeechOptions = { rate: number; voice: string | null };

const READABLE = "h1, h2, h3, h4, p, li, dt, dd, th, td, figcaption, .tk-callout-label, .tk-kpi-num, .tk-stat-num, .tk-fact-figure";

let state: SpeechState = { status: "idle", index: 0, total: 0 };
const listeners = new Set<() => void>();
let blocks: HTMLElement[] = [];
let options: SpeechOptions = { rate: 1, voice: null };
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

let voiceCache: SpeechSynthesisVoice[] = [];
let voiceKey = "";

export function getSpanishVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return voiceCache;
  const all = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("es"));
  const key = all.map((v) => v.name).join("|");
  if (key !== voiceKey) {
    voiceKey = key;
    voiceCache = all.sort((a, b) => Number(b.lang === "es-MX") - Number(a.lang === "es-MX"));
  }
  return voiceCache;
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
  const voices = getSpanishVoices();
  const voice = voices.find((v) => v.name === opts.voice) ?? voices[0];
  if (voice) u.voice = voice;
  u.lang = voice?.lang ?? "es-MX";
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

const ROLE_NAMES: Record<string, string> = {
  a: "Enlace",
  button: "Botón",
  select: "Lista desplegable",
  textarea: "Campo de texto",
  summary: "Desplegable",
};

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
export function describe(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const role = el.getAttribute("role");
  let kind = ROLE_NAMES[tag] ?? "";
  if (role === "tab") kind = "Pestaña";
  else if (role === "switch") kind = "Interruptor";
  else if (role === "menuitem") kind = "Opción de menú";
  else if (role === "option") kind = "Opción";
  else if (/^h[1-6]$/.test(tag)) kind = `Encabezado nivel ${tag[1]}`;
  else if (tag === "input") {
    const type = (el as HTMLInputElement).type;
    kind = type === "radio" ? "Opción" : type === "checkbox" ? "Casilla" : type === "search" ? "Búsqueda" : "Campo";
  }

  const states: string[] = [];
  const checked = el.getAttribute("aria-checked");
  if (checked === "true") states.push("activado");
  if (checked === "false") states.push("desactivado");
  const pressed = el.getAttribute("aria-pressed");
  if (pressed === "true") states.push("activado");
  if (pressed === "false") states.push("desactivado");
  const expanded = el.getAttribute("aria-expanded");
  if (expanded === "true") states.push("expandido");
  if (expanded === "false") states.push("contraído");
  if (el.getAttribute("aria-selected") === "true") states.push("seleccionado");
  if (el.getAttribute("aria-current")) states.push("página actual");
  if (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox")) {
    states.push(el.checked ? "marcado" : "sin marcar");
  }

  return [nameOf(el), kind, states.join(", ")].filter(Boolean).join(". ");
}
