"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { usePrefs, type FontSize, type ThemePref } from "./Preferences";
import {
  describe,
  getServerSpeechState,
  getServerVoices,
  getSpanishVoices,
  getSpeechState,
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

const THEMES: { v: ThemePref; label: string; Icon: typeof IconSun }[] = [
  { v: "dark", label: "Oscuro", Icon: IconMoon },
  { v: "light", label: "Claro", Icon: IconSun },
  { v: "system", label: "Sistema", Icon: IconMonitor },
];

const SIZES: { v: FontSize; label: string; name: string }[] = [
  { v: "sm", label: "A−", name: "Texto pequeño" },
  { v: "md", label: "A", name: "Texto normal" },
  { v: "lg", label: "A+", name: "Texto grande" },
  { v: "xl", label: "A++", name: "Texto muy grande" },
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
  return useCallback(
    (next: boolean) => {
      setPref("readOnFocus", next);
      stop();
      say(
        next
          ? "Lectura al enfocar activada. Toca o navega con Tab para escuchar cada elemento. Para desactivarla, pulsa Alt, Mayúsculas y L."
          : "Lectura al enfocar desactivada.",
        { rate, voice },
      );
    },
    [setPref, rate, voice],
  );
}

/** Botón de la barra superior y panel de preferencias de accesibilidad. */
export function A11yMenu() {
  const { prefs, setPref, reset } = usePrefs();
  const toggleReadOnFocus = useReadOnFocusToggle();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const voices = useSyncExternalStore(subscribeVoices, getSpanishVoices, getServerVoices);
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
        aria-label="Preferencias de accesibilidad"
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
        aria-label="Preferencias de accesibilidad"
        hidden={!open}
      >
        <div className="tk-a11y-head">
          <strong>Accesibilidad</strong>
          <button type="button" className="tk-icon-btn tk-icon-btn--always" aria-label="Cerrar preferencias" onClick={() => setOpen(false)}>
            <IconClose />
          </button>
        </div>

        <fieldset className="tk-a11y-group">
          <legend>Tema</legend>
          <div className="tk-seg tk-seg--full">
            {THEMES.map(({ v, label, Icon }) => (
              <label key={v} data-v="on">
                <input type="radio" name="tk-theme" checked={prefs.theme === v} onChange={() => setPref("theme", v)} />
                <Icon aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="tk-a11y-group">
          <legend>Tamaño del texto</legend>
          <div className="tk-seg tk-seg--full">
            {SIZES.map(({ v, label, name }) => (
              <label key={v} data-v="on" title={name}>
                <input type="radio" name="tk-fs" aria-label={name} checked={prefs.fontSize === v} onChange={() => setPref("fontSize", v)} />
                <span aria-hidden="true" className={`tk-fs-sample tk-fs-sample--${v}`}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="tk-a11y-group">
          <Switch checked={prefs.spacing} onChange={(v) => setPref("spacing", v)} label="Espaciado de lectura" hint="Más espacio entre líneas y letras." />
          <Switch checked={prefs.underline} onChange={(v) => setPref("underline", v)} label="Subrayar enlaces" />
          <Switch checked={prefs.reduceMotion} onChange={(v) => setPref("reduceMotion", v)} label="Reducir animaciones" />
        </div>

        <div className="tk-a11y-group">
          <span className="tk-a11y-legend">Voz</span>
          {supported ? (
            <>
              <button
                type="button"
                className="tk-cta tk-cta--block"
                onClick={() => {
                  const root = article();
                  if (!root) return;
                  if (speech.status === "idle") readPage(root, { rate: prefs.rate, voice: prefs.voice });
                  else stop();
                  setOpen(false);
                }}
              >
                {speech.status === "idle" ? <IconPlay /> : <IconStop />}
                {speech.status === "idle" ? "Leer esta página en voz alta" : "Detener lectura"}
              </button>
              <label className="tk-a11y-field">
                <span>
                  Velocidad <output>{prefs.rate.toFixed(1)}×</output>
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
                  <span>Voz en español</span>
                  <select className="tk-input" value={prefs.voice ?? ""} onChange={(e) => setPref("voice", e.target.value || null)}>
                    <option value="">Automática</option>
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
                label="Leer al enfocar o tocar"
                hint="Anuncia cada elemento y su función, como TalkBack o VoiceOver. Atajo: Alt + Mayús + L."
              />
            </>
          ) : (
            <p className="tk-a11y-note">Tu navegador no ofrece síntesis de voz. Puedes usar el lector de pantalla de tu sistema.</p>
          )}
        </div>

        <button type="button" className="tk-link-btn" onClick={reset}>
          Restablecer preferencias
        </button>
      </div>
    </div>
  );
}

/** Controles flotantes mientras se lee en voz alta. */
export function SpeechPlayer() {
  const speech = useSyncExternalStore(subscribeSpeech, getSpeechState, getServerSpeechState);
  if (speech.status === "idle") return null;
  return (
    <div className="tk-player" role="region" aria-label="Lectura en voz alta">
      <span className="tk-player-wave" aria-hidden="true" data-paused={speech.status === "paused" || undefined}>
        <i />
        <i />
        <i />
      </span>
      <span className="tk-player-text">
        {speech.status === "paused" ? "En pausa" : "Leyendo"} · {Math.min(speech.index + 1, speech.total)} de {speech.total}
      </span>
      <button type="button" aria-label="Bloque anterior" onClick={() => skip(-1)}>
        <IconSkip style={{ transform: "scaleX(-1)" }} />
      </button>
      {speech.status === "paused" ? (
        <button type="button" aria-label="Reanudar" onClick={resume}>
          <IconPlay />
        </button>
      ) : (
        <button type="button" aria-label="Pausar" onClick={pause}>
          <IconPause />
        </button>
      )}
      <button type="button" aria-label="Bloque siguiente" onClick={() => skip(1)}>
        <IconSkip />
      </button>
      <button type="button" aria-label="Detener lectura" onClick={stop}>
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
    const opts = { rate: prefs.rate, voice: prefs.voice };
    const onFocus = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || !el.closest(".tk-root") || el.classList.contains("tk-main")) return;
      say(describe(el), opts);
    };
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest(".tk-article") || target.closest("a, button, input, select, textarea, label, summary")) return;
      const block = target.closest<HTMLElement>(TAPPABLE);
      if (!block) return;
      document.querySelectorAll(".tk-speaking").forEach((n) => n.classList.remove("tk-speaking"));
      block.classList.add("tk-speaking");
      window.setTimeout(() => block.classList.remove("tk-speaking"), 2500);
      say(describe(block), opts);
    };
    document.addEventListener("focusin", onFocus);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("click", onClick);
    };
  }, [prefs.readOnFocus, prefs.rate, prefs.voice]);

  if (!prefs.readOnFocus || !supported) return null;
  return (
    <div className="tk-focus-chip" role="status">
      <span className="tk-player-wave" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span>Leer al enfocar: activado</span>
      <button type="button" onClick={() => toggle(false)} aria-keyshortcuts="Alt+Shift+L">
        Desactivar
      </button>
    </div>
  );
}
