"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { targetOf, toolkitHref } from "../data";
import { useContent, useLocale } from "./i18n";
import { sectionLabels, useToolkit } from "./ToolkitState";
import { useClientValue, useLocalStore } from "./useLocalStore";
import {
  IconAccessibility,
  IconArrowRight,
  IconCompass,
  IconExternal,
  IconFlask,
  IconHandshake,
  IconLandmark,
  IconLeaf,
  IconMenu,
  IconSearch,
} from "./icons";

/** Se muestra una sola vez por navegador; cambiar la versión lo vuelve a mostrar a todos. */
const STORE_KEY = "tk-t4n-onboarding-v1";
const parseSeen = (raw: string | null) => raw === "true";

const L = {
  es: {
    welcomeEyebrow: "Recorrido rápido",
    welcomeTitle: "Te damos la bienvenida al toolkit",
    welcomeText: "En unos segundos te mostramos cómo moverte: el índice, el buscador, tu avance y las herramientas de accesibilidad.",
    start: "Ver el recorrido",
    skip: "Omitir",
    prev: "Anterior",
    next: "Siguiente",
    finish: "Entendido",
    count: (i: number, n: number) => `Paso ${i} de ${n}`,
    sideTitle: "El índice del toolkit",
    sideText: "Inicio, las cinco etapas, la caja de herramientas y las plantillas. La marca verde indica en qué página estás.",
    searchTitle: "Busca lo que necesites",
    searchText: "Encuentra herramientas, plantillas y temas desde cualquier página. También con el atajo Ctrl K.",
    progressTitle: "Tu avance y tu ruta",
    progressText: "Marca las etapas que revisas para desbloquear tu insignia. Si no sabes por dónde empezar, elige tu perfil aquí y te marcamos qué etapas leer.",
    footTitle: "Accesibilidad y BioScanner",
    footText: "Ajusta el tamaño del texto, el contraste o la lectura en voz alta, y abre BioScanner, la plataforma de IA que nació del proyecto.",
    // Móvil
    mWelcomeText: "Reúne lo que aprendimos en cuatro años de Tech4Nature México para que otros territorios creen su propia iniciativa.",
    mStart: "Empezar",
    profileTitle: "¿Cuál es tu perfil?",
    profileText: "Te marcamos qué etapas leer primero. Puedes cambiarlo cuando quieras.",
    explore: "Solo quiero explorar",
    exploreHint: "Recorre el toolkit a tu ritmo",
    startWith: "Empieza por:",
    continue: "Continuar",
    back: "Atrás",
    routeTitle: (t: string) => `Tu ruta: ${t}`,
    routeText: "La verás marcada en el Índice, con tu avance.",
    readyTitle: "Todo listo",
    readyText: "Explora a tu ritmo. Si quieres una ruta, elígela después en «Cómo usar el toolkit».",
    dockTitle: "Abajo tienes siempre a mano:",
    index: "Índice",
    search: "Buscar",
    a11y: "Accesibilidad",
    goTo: (t: string) => `Ir a ${t}`,
    stay: "Quedarme aquí",
    exploreCta: "Empezar a explorar",
    dialog: "Bienvenida al toolkit",
    progress: (i: number, n: number) => `Paso ${i} de ${n}`,
  },
  en: {
    welcomeEyebrow: "Quick tour",
    welcomeTitle: "Welcome to the toolkit",
    welcomeText: "In a few seconds we'll show you how to get around: the index, search, your progress and the accessibility tools.",
    start: "Take the tour",
    skip: "Skip",
    prev: "Back",
    next: "Next",
    finish: "Got it",
    count: (i: number, n: number) => `Step ${i} of ${n}`,
    sideTitle: "The toolkit index",
    sideText: "Home, the five stages, the toolbox and the templates. The green mark shows the page you're on.",
    searchTitle: "Find what you need",
    searchText: "Find tools, templates and topics from any page. Also with the Ctrl K shortcut.",
    progressTitle: "Your progress and your route",
    progressText: "Mark the stages you review to unlock your badge. Not sure where to start? Pick your profile here and we'll mark the stages to read.",
    footTitle: "Accessibility and BioScanner",
    footText: "Adjust text size, contrast or read-aloud, and open BioScanner, the AI platform that grew out of the project.",
    mWelcomeText: "It brings together four years of lessons from Tech4Nature Mexico so other territories can create their own initiative.",
    mStart: "Get started",
    profileTitle: "What's your profile?",
    profileText: "We'll mark the stages to read first. You can change it anytime.",
    explore: "I just want to explore",
    exploreHint: "Go through the toolkit at your own pace",
    startWith: "Start with:",
    continue: "Continue",
    back: "Back",
    routeTitle: (t: string) => `Your route: ${t}`,
    routeText: "You'll see it marked in the Index, along with your progress.",
    readyTitle: "All set",
    readyText: "Explore at your own pace. If you want a route, pick one later in “How to use the toolkit”.",
    dockTitle: "Always at hand at the bottom:",
    index: "Index",
    search: "Search",
    a11y: "Accessibility",
    goTo: (t: string) => `Go to ${t}`,
    stay: "Stay here",
    exploreCta: "Start exploring",
    dialog: "Welcome to the toolkit",
    progress: (i: number, n: number) => `Step ${i} of ${n}`,
  },
} satisfies Record<Locale, Record<string, string | ((...a: never[]) => string)>>;
type Strings = (typeof L)[Locale];

/**
 * Bienvenida que aparece solo la primera vez que alguien abre el toolkit.
 * - Escritorio: recorrido guiado que resalta el índice, el buscador, el avance y la accesibilidad.
 * - Móvil y tableta: hoja inferior para elegir el perfil (la ruta por público) a modo de onboarding.
 */
export default function Onboarding() {
  const l = L[useLocale()];
  const [seen, setSeen] = useLocalStore(STORE_KEY, parseSeen);
  const hydrated = useClientValue(() => true, false);
  const [mode, setMode] = useState<"tour" | "mobile" | null>(null);

  useEffect(() => {
    if (!hydrated || seen) return;
    // Espera a que termine la animación de entrada y no se encima a otro diálogo abierto.
    const t = window.setTimeout(() => {
      if (document.querySelector("dialog[open]")) return;
      setMode(window.matchMedia("(max-width: 1023px)").matches ? "mobile" : "tour");
    }, 1200);
    return () => window.clearTimeout(t);
  }, [hydrated, seen]);

  const done = useCallback(() => {
    setSeen(true);
    setMode(null);
  }, [setSeen]);

  if (mode === "tour") return <Tour l={l} onDone={done} />;
  if (mode === "mobile") return <MobileOnboarding l={l} onDone={done} />;
  return null;
}

// ---------------------------------------------------------------------------
// Escritorio: recorrido guiado

type TourStep = { el: HTMLElement | null; title: string; text: string };

const isVisible = (el: Element | null): el is HTMLElement => {
  if (!(el instanceof HTMLElement)) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
};
/** Primer elemento visible de la lista de selectores. */
const firstVisible = (selectors: string[]) => {
  for (const s of selectors) {
    const el = document.querySelector(s);
    if (isVisible(el)) return el;
  }
  return null;
};

const CARD_W = 340;
const PAD = 8;

function cardPosition(rect: DOMRect | null): CSSProperties | undefined {
  if (!rect) return undefined;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clampTop = (t: number) => Math.max(16, Math.min(t, vh - 300));
  // Elementos bajos cerca del borde superior (el buscador): la tarjeta va debajo.
  if (rect.height < 120 && vh - rect.bottom > 300) {
    return { top: rect.bottom + PAD + 14, left: Math.max(16, Math.min(rect.right - CARD_W, vw - CARD_W - 16)) };
  }
  if (vw - rect.right > CARD_W + 40) return { top: clampTop(rect.top + 24), left: rect.right + PAD + 18 };
  if (rect.left > CARD_W + 40) return { top: clampTop(rect.top + 24), left: rect.left - PAD - 18 - CARD_W };
  return { top: clampTop(rect.bottom + PAD + 14), left: Math.max(16, (vw - CARD_W) / 2) };
}

function Tour({ l, onDone }: { l: Strings; onDone: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // Los pasos se calculan al abrir: se omiten los elementos que no se ven en este ancho.
  const [steps] = useState<TourStep[]>(() =>
    [
      { el: null, title: l.welcomeTitle, text: l.welcomeText },
      { el: firstVisible(["#tk-sidebar > nav", "#tk-sidebar"]), title: l.sideTitle, text: l.sideText },
      { el: firstVisible([".tk-search-btn"]), title: l.searchTitle, text: l.searchText },
      { el: firstVisible([".tk-rail .tk-progress-card", ".tk-side-progress"]), title: l.progressTitle, text: l.progressText },
      { el: firstVisible([".tk-side-foot"]), title: l.footTitle, text: l.footText },
    ].filter((s, i) => i === 0 || s.el),
  );
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const iRef = useRef(0);
  const total = steps.length - 1;

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    // El navegador enfoca el primer botón (Omitir); el foco va a la acción principal.
    d?.querySelector<HTMLElement>(".tk-cta")?.focus();
    const onResize = () => setRect(steps[iRef.current]?.el?.getBoundingClientRect() ?? null);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [steps]);

  const go = (n: number) => {
    if (n > total) return onDone();
    iRef.current = n;
    setI(n);
    setRect(steps[n].el?.getBoundingClientRect() ?? null);
  };

  const step = steps[i];
  const last = i === total;
  return (
    <dialog
      ref={ref}
      className="tk-tour"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onDone();
      }}
    >
      {rect ? (
        <div
          className="tk-tour-hole"
          aria-hidden="true"
          style={{ top: rect.top - PAD, left: rect.left - PAD, width: rect.width + PAD * 2, height: rect.height + PAD * 2 }}
        />
      ) : (
        <div className="tk-tour-dim" aria-hidden="true" />
      )}
      <div className={`tk-tour-card${rect ? "" : " tk-tour-card--center"}`} style={cardPosition(rect)}>
        <p className="tk-tour-count">{i === 0 ? l.welcomeEyebrow : l.count(i, total)}</p>
        <h2 id={titleId} className="tk-tour-title">
          {step.title}
        </h2>
        <p className="tk-tour-text">{step.text}</p>
        {i > 0 ? (
          <span className="tk-tour-dots" aria-hidden="true">
            {steps.slice(1).map((_, k) => (
              <i key={k} data-on={k + 1 === i || undefined} />
            ))}
          </span>
        ) : null}
        <div className="tk-tour-foot">
          {last ? <span /> : (
            <button type="button" className="tk-link-btn" onClick={onDone}>
              {l.skip}
            </button>
          )}
          <div className="tk-tour-actions">
            {i > 1 ? (
              <button type="button" className="tk-ghost" onClick={() => go(i - 1)}>
                {l.prev}
              </button>
            ) : null}
            <button type="button" className="tk-cta" onClick={() => go(i + 1)} autoFocus key={i}>
              {i === 0 ? l.start : last ? l.finish : l.next}
              {last ? null : <IconArrowRight />}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

// ---------------------------------------------------------------------------
// Móvil: elegir el perfil (ruta) a modo de onboarding

const AUDIENCE_ICON: Record<string, ReactNode> = {
  territorio: <IconLeaf />,
  autoridades: <IconLandmark />,
  academia: <IconFlask />,
  aliados: <IconHandshake />,
};
const EXPLORE = "explorar";

function MobileOnboarding({ l, onDone }: { l: Strings; onDone: () => void }) {
  const locale = useLocale();
  const { AUDIENCES } = useContent();
  const { route, setRoute } = useToolkit();
  const labels = sectionLabels(locale);
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<string>(route?.id ?? EXPLORE);
  const chosen = AUDIENCES.find((a) => a.id === pick) ?? null;
  const first = chosen?.path[0];
  const firstTarget = first ? targetOf(first) : null;

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    d?.querySelector<HTMLElement>(".tk-cta")?.focus();
  }, []);

  const confirmProfile = () => {
    setRoute(chosen ? chosen.id : null);
    setStep(2);
  };

  return (
    <dialog
      ref={ref}
      className="tk-onb"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onDone();
      }}
    >
      <span className="tk-onb-grabber" aria-hidden="true" />
      <div className="tk-onb-top">
        <span className="tk-onb-steps" role="img" aria-label={l.progress(step + 1, 3)}>
          {[0, 1, 2].map((k) => (
            <i key={k} data-on={k <= step || undefined} />
          ))}
        </span>
        {step < 2 ? (
          <button type="button" className="tk-link-btn" onClick={onDone}>
            {l.skip}
          </button>
        ) : null}
      </div>

      {step === 0 ? (
        <div className="tk-onb-body">
          <p className="tk-onb-eyebrow">Toolkit Tech4Nature</p>
          <h2 id={titleId} className="tk-onb-title">
            {l.welcomeTitle}
          </h2>
          <p className="tk-onb-text">{l.mWelcomeText}</p>
          <div className="tk-onb-actions">
            <button type="button" className="tk-cta" onClick={() => setStep(1)} autoFocus>
              {l.mStart}
              <IconArrowRight />
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        <div className="tk-onb-body">
          <h2 id={titleId} className="tk-onb-title">
            {l.profileTitle}
          </h2>
          <p className="tk-onb-text">{l.profileText}</p>
          <div className="tk-onb-options" role="radiogroup" aria-labelledby={titleId}>
            {AUDIENCES.map((a) => (
              <label key={a.id} className="tk-onb-option" data-on={pick === a.id || undefined}>
                <input type="radio" name="tk-onb-profile" value={a.id} checked={pick === a.id} onChange={() => setPick(a.id)} />
                <span className="tk-onb-option-icon" aria-hidden="true">
                  {AUDIENCE_ICON[a.id] ?? <IconCompass />}
                </span>
                <span className="tk-onb-option-text">
                  <strong>{a.title}</strong>
                  <small>
                    {l.startWith} {a.short}
                  </small>
                </span>
              </label>
            ))}
            <label className="tk-onb-option tk-onb-option--explore" data-on={pick === EXPLORE || undefined}>
              <input type="radio" name="tk-onb-profile" value={EXPLORE} checked={pick === EXPLORE} onChange={() => setPick(EXPLORE)} />
              <span className="tk-onb-option-icon" aria-hidden="true">
                <IconCompass />
              </span>
              <span className="tk-onb-option-text">
                <strong>{l.explore}</strong>
                <small>{l.exploreHint}</small>
              </span>
            </label>
          </div>
          <div className="tk-onb-actions">
            <button type="button" className="tk-ghost" onClick={() => setStep(0)}>
              {l.back}
            </button>
            <button type="button" className="tk-cta" onClick={confirmProfile}>
              {l.continue}
              <IconArrowRight />
            </button>
          </div>
        </div>
      ) : (
        <div className="tk-onb-body">
          <h2 id={titleId} className="tk-onb-title">
            {chosen ? l.routeTitle(chosen.title) : l.readyTitle}
          </h2>
          <p className="tk-onb-text">{chosen ? l.routeText : l.readyText}</p>
          {chosen ? (
            <ol className="tk-onb-route">
              {chosen.path.map((key, k) => (
                <li key={key}>
                  <span className="tk-onb-route-n" aria-hidden="true">
                    {k + 1}
                  </span>
                  {labels[key] ?? key}
                </li>
              ))}
            </ol>
          ) : null}
          <p className="tk-onb-dock-title">{l.dockTitle}</p>
          <ul className="tk-onb-dock">
            <li>
              <IconMenu />
              {l.index}
            </li>
            <li>
              <IconSearch />
              {l.search}
            </li>
            <li>
              <IconAccessibility />
              {l.a11y}
            </li>
            <li>
              <IconExternal />
              BioScanner
            </li>
          </ul>
          <div className="tk-onb-actions tk-onb-actions--stack">
            {chosen && firstTarget ? (
              <>
                <Link className="tk-cta" href={toolkitHref(locale, firstTarget.slug, firstTarget.hash)} onClick={onDone} autoFocus>
                  {l.goTo(labels[first!] ?? first!)}
                  <IconArrowRight />
                </Link>
                <button type="button" className="tk-ghost" onClick={onDone}>
                  {l.stay}
                </button>
              </>
            ) : (
              <button type="button" className="tk-cta" onClick={onDone} autoFocus>
                {l.exploreCta}
                <IconArrowRight />
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
