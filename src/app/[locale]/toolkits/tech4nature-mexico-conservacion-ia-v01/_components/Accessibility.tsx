"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/config";
import { useLocale } from "./i18n";
import { usePrefs, type FontSize, type ThemePref } from "./Preferences";
import {
  describe,
  getServerSpeechState,
  getServerVoices,
  getSpeechState,
  getVoices,
  pause,
  readPage,
  resume,
  say,
  skip,
  speechSupported,
  stop,
  subscribeSpeech,
  subscribeVoices,
} from "./speech";
import { useClientValue } from "./useLocalStore";
import {
  IconAccessibility,
  IconClose,
  IconMonitor,
  IconMoon,
  IconPause,
  IconPlay,
  IconSkip,
  IconStop,
  IconSun,
} from "./icons";

const L = {
  es: {
    dark: "Oscuro",
    light: "Claro",
    system: "Sistema",
    sm: "Texto pequeño",
    md: "Texto normal",
    lg: "Texto grande",
    xl: "Texto muy grande",
    focusOn:
      "Lectura al enfocar activada. Toca o navega con Tab para escuchar cada elemento. Para desactivarla, pulsa Alt, Mayúsculas y L.",
    focusOff: "Lectura al enfocar desactivada.",
    prefs: "Preferencias de accesibilidad",
    a11y: "Accesibilidad",
    closePrefs: "Cerrar preferencias",
    theme: "Tema",
    textSize: "Tamaño del texto",
    spacing: "Espaciado de lectura",
    spacingHint: "Más espacio entre líneas y letras.",
    underline: "Subrayar enlaces",
    reduceMotion: "Reducir animaciones",
    voiceGroup: "Voz",
    readPage: "Leer esta página en voz alta",
    stopReading: "Detener lectura",
    rate: "Velocidad",
    voice: "Voz en español",
    auto: "Automática",
    readOnFocus: "Leer al enfocar o tocar",
    readOnFocusHint: "Anuncia cada elemento y su función, como TalkBack o VoiceOver. Atajo: Alt + Mayús + L.",
    noSpeech: "Tu navegador no ofrece síntesis de voz. Puedes usar el lector de pantalla de tu sistema.",
    reset: "Restablecer preferencias",
    player: "Lectura en voz alta",
    paused: "En pausa",
    reading: "Leyendo",
    of: "de",
    prev: "Bloque anterior",
    resume: "Reanudar",
    pause: "Pausar",
    next: "Bloque siguiente",
    chip: "Leer al enfocar: activado",
    turnOff: "Desactivar",
  },
  en: {
    dark: "Dark",
    light: "Light",
    system: "System",
    sm: "Small text",
    md: "Normal text",
    lg: "Large text",
    xl: "Extra-large text",
    focusOn: "Read on focus is on. Tap or press Tab to hear each element. To turn it off, press Alt, Shift and L.",
    focusOff: "Read on focus is off.",
    prefs: "Accessibility preferences",
    a11y: "Accessibility",
    closePrefs: "Close preferences",
    theme: "Theme",
    textSize: "Text size",
    spacing: "Reading spacing",
    spacingHint: "More space between lines and letters.",
    underline: "Underline links",
    reduceMotion: "Reduce motion",
    voiceGroup: "Voice",
    readPage: "Read this page aloud",
    stopReading: "Stop reading",
    rate: "Speed",
    voice: "English voice",
    auto: "Automatic",
    readOnFocus: "Read on focus or tap",
    readOnFocusHint: "Announces each element and what it does, like TalkBack or VoiceOver. Shortcut: Alt + Shift + L.",
    noSpeech: "Your browser does not offer speech synthesis. You can use your system's screen reader.",
    reset: "Reset preferences",
    player: "Read aloud",
    paused: "Paused",
    reading: "Reading",
    of: "of",
    prev: "Previous block",
    resume: "Resume",
    pause: "Pause",
    next: "Next block",
    chip: "Read on focus: on",
    turnOff: "Turn off",
  },
} satisfies Record<Locale, Record<string, string>>;

const THEMES: { v: ThemePref; Icon: typeof IconSun }[] = [
  { v: "dark", Icon: IconMoon },
  { v: "light", Icon: IconSun },
  { v: "system", Icon: IconMonitor },
];

const SIZES: { v: FontSize; label: string }[] = [
  { v: "sm", label: "A−" },
  { v: "md", label: "A" },
  { v: "lg", label: "A+" },
  { v: "xl", label: "A++" },
];

function Switch({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  const id = useId();
  return (
    <div className="tk-a11y-row">
      <span>
        <span id={id} className="tk-a11y-label">
          {label}
        </span>
        {hint ? <small>{hint}</small> : null}
      </span>
      <button type="button" role="switch" aria-checked={checked} aria-labelledby={id} className="tk-switch" onClick={() => onChange(!checked)}>
        <span aria-hidden="true" />
      </button>
    </div>
  );
}

function article(): HTMLElement | null {
  return document.querySelector<HTMLElement>(".tk-article");
}

/** Activa o desactiva "leer al enfocar", cortando la voz en curso y confirmándolo en voz alta. */
function useReadOnFocusToggle() {
  const { prefs, setPref } = usePrefs();
  const { rate, voice } = prefs;
  const locale = useLocale();
  return useCallback(
    (next: boolean) => {
      setPref("readOnFocus", next);
      stop();
      say(next ? L[locale].focusOn : L[locale].focusOff, { rate, voice, locale });
    },
    [setPref, rate, voice, locale],
  );
}

/** Botón de la barra superior y panel de preferencias de accesibilidad. */
export function A11yMenu() {
  const { prefs, setPref, reset } = usePrefs();
  const toggleReadOnFocus = useReadOnFocusToggle();
  const locale = useLocale();
  const l = L[locale];
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const getLocaleVoices = useCallback(() => getVoices(locale), [locale]);
  const voices = useSyncExternalStore(subscribeVoices, getLocaleVoices, getServerVoices);
  const supported = useClientValue(speechSupported, false);
  const speech = useSyncExternalStore(subscribeSpeech, getSpeechState, getServerSpeechState);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("button, input, select")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="tk-a11y">
      <button
        ref={triggerRef}
        type="button"
        className="tk-icon-btn tk-icon-btn--always"
        aria-label={l.prefs}
        aria-expanded={open}
        aria-controls="tk-a11y-panel"
        onClick={() => setOpen((o) => !o)}
      >
        <IconAccessibility />
      </button>

      <div
        ref={panelRef}
        id="tk-a11y-panel"
        className="tk-a11y-panel"
        role="dialog"
        aria-label={l.prefs}
        hidden={!open}
      >
        <div className="tk-a11y-head">
          <strong>{l.a11y}</strong>
          <button type="button" className="tk-icon-btn tk-icon-btn--always" aria-label={l.closePrefs} onClick={() => setOpen(false)}>
            <IconClose />
          </button>
        </div>

        <fieldset className="tk-a11y-group">
          <legend>{l.theme}</legend>
          <div className="tk-seg tk-seg--full">
            {THEMES.map(({ v, Icon }) => (
              <label key={v} data-v="on">
                <input type="radio" name="tk-theme" checked={prefs.theme === v} onChange={() => setPref("theme", v)} />
                <Icon aria-hidden="true" />
                {l[v]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="tk-a11y-group">
          <legend>{l.textSize}</legend>
          <div className="tk-seg tk-seg--full">
            {SIZES.map(({ v, label }) => (
              <label key={v} data-v="on" title={l[v]}>
                <input type="radio" name="tk-fs" aria-label={l[v]} checked={prefs.fontSize === v} onChange={() => setPref("fontSize", v)} />
                <span aria-hidden="true" className={`tk-fs-sample tk-fs-sample--${v}`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="tk-a11y-group">
          <Switch checked={prefs.spacing} onChange={(v) => setPref("spacing", v)} label={l.spacing} hint={l.spacingHint} />
          <Switch checked={prefs.underline} onChange={(v) => setPref("underline", v)} label={l.underline} />
          <Switch checked={prefs.reduceMotion} onChange={(v) => setPref("reduceMotion", v)} label={l.reduceMotion} />
        </div>

        <div className="tk-a11y-group">
          <span className="tk-a11y-legend">{l.voiceGroup}</span>
          {supported ? (
            <>
              <button
                type="button"
                className="tk-cta tk-cta--block"
                onClick={() => {
                  const root = article();
                  if (!root) return;
                  if (speech.status === "idle") readPage(root, { rate: prefs.rate, voice: prefs.voice, locale });
                  else stop();
                  setOpen(false);
                }}
              >
                {speech.status === "idle" ? <IconPlay /> : <IconStop />}
                {speech.status === "idle" ? l.readPage : l.stopReading}
              </button>
              <label className="tk-a11y-field">
                <span>
                  {l.rate} <output>{prefs.rate.toFixed(1)}×</output>
                </span>
                <input
                  type="range"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={prefs.rate}
                  onChange={(e) => setPref("rate", Number(e.target.value))}
                />
              </label>
              {voices.length ? (
                <label className="tk-a11y-field">
                  <span>{l.voice}</span>
                  <select className="tk-input" value={prefs.voice ?? ""} onChange={(e) => setPref("voice", e.target.value || null)}>
                    <option value="">{l.auto}</option>
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              <Switch
                checked={prefs.readOnFocus}
                onChange={toggleReadOnFocus}
                label={l.readOnFocus}
                hint={l.readOnFocusHint}
              />
            </>
          ) : (
            <p className="tk-a11y-note">{l.noSpeech}</p>
          )}
        </div>

        <button type="button" className="tk-link-btn" onClick={reset}>
          {l.reset}
        </button>
      </div>
    </div>
  );
}

/** Controles flotantes mientras se lee en voz alta. */
export function SpeechPlayer() {
  const speech = useSyncExternalStore(subscribeSpeech, getSpeechState, getServerSpeechState);
  const l = L[useLocale()];
  if (speech.status === "idle") return null;
  return (
    <div className="tk-player" role="region" aria-label={l.player}>
      <span className="tk-player-wave" aria-hidden="true" data-paused={speech.status === "paused" || undefined}>
        <i />
        <i />
        <i />
      </span>
      <span className="tk-player-text">
        {speech.status === "paused" ? l.paused : l.reading} · {Math.min(speech.index + 1, speech.total)} {l.of} {speech.total}
      </span>
      <button type="button" aria-label={l.prev} onClick={() => skip(-1)}>
        <IconSkip style={{ transform: "scaleX(-1)" }} />
      </button>
      {speech.status === "paused" ? (
        <button type="button" aria-label={l.resume} onClick={resume}>
          <IconPlay />
        </button>
      ) : (
        <button type="button" aria-label={l.pause} onClick={pause}>
          <IconPause />
        </button>
      )}
      <button type="button" aria-label={l.next} onClick={() => skip(1)}>
        <IconSkip />
      </button>
      <button type="button" aria-label={l.stopReading} onClick={stop}>
        <IconStop />
      </button>
    </div>
  );
}

const TAPPABLE = "h1, h2, h3, h4, p, li, dt, dd, td, th, figcaption";

/**
 * Modo "leer al enfocar o tocar": anuncia el elemento enfocado o el bloque tocado.
 * Mientras está activo muestra un aviso con botón para desactivarlo; Alt + Mayús + L
 * lo alterna desde cualquier parte y Esc silencia la frase en curso.
 */
export function FocusReader() {
  const { prefs } = usePrefs();
  const toggle = useReadOnFocusToggle();
  const supported = useClientValue(speechSupported, false);
  const locale = useLocale();
  const l = L[locale];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.code === "KeyL") {
        e.preventDefault();
        toggle(!prefs.readOnFocus);
      } else if (e.key === "Escape" && prefs.readOnFocus && speechSupported()) {
        window.speechSynthesis.cancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prefs.readOnFocus, toggle]);

  useEffect(() => {
    if (!prefs.readOnFocus || !speechSupported()) return;
    const opts = { rate: prefs.rate, voice: prefs.voice, locale };
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || !el.closest(".tk-root") || el.classList.contains("tk-main")) return;
      say(describe(el, locale), opts);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(".tk-article") || target.closest("a, button, input, select, textarea, label, summary")) return;
      const block = target.closest<HTMLElement>(TAPPABLE);
      if (!block) return;
      document.querySelectorAll(".tk-speaking").forEach((n) => n.classList.remove("tk-speaking"));
      block.classList.add("tk-speaking");
      window.setTimeout(() => block.classList.remove("tk-speaking"), 2500);
      say(describe(block, locale), opts);
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onClick);
    };
  }, [prefs.readOnFocus, prefs.rate, prefs.voice, locale]);

  if (!prefs.readOnFocus || !supported) return null;
  return (
    <div className="tk-focus-chip" role="status">
      <span className="tk-player-wave" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>{l.chip}</span>
      <button type="button" onClick={() => toggle(false)} aria-keyshortcuts="Alt+Shift+L">
        {l.turnOff}
      </button>
    </div>
  );
}
