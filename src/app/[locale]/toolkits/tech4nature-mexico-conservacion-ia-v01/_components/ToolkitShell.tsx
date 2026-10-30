"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import SiteFooter from "@/components/SiteFooter";
import { LOCALES, LOCALE_LABELS, localePath, swapLocale, type Locale } from "@/i18n/config";
import {
  TOOLKIT_SLUG,
  TOOLKIT_VERSION,
  targetOf,
  toolkitHref,
  type ToolkitPage,
} from "../data";
import { ToolkitProvider, useToolkit } from "./ToolkitState";
import { PrefsProvider, usePrefs } from "./Preferences";
import { A11yMenu, FocusReader, SpeechPlayer } from "./Accessibility";
import { stop as stopSpeech } from "./speech";
import { CompletionDialog } from "./CompletionDialog";
import CommandPalette from "./CommandPalette";
import { LocaleProvider, useContent, useLocale } from "./i18n";
import RefPreview from "./RefPreview";
import { useClientValue } from "./useLocalStore";
import { IconArrowRight, IconCheck, IconChevronDown, IconClose, IconExternal, IconMenu, IconSearch } from "./icons";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const BIOSCANNER_APP = "https://app.bioscanner.io";

const L = {
  es: {
    home: "Inicio",
    stages: "Etapas",
    tools: "Herramientas",
    templates: "Plantillas",
    skip: "Saltar al contenido",
    openIndex: "Abrir índice del toolkit",
    sections: "Secciones del toolkit",
    searchAria: "Buscar en el toolkit",
    search: "Buscar",
    bioscannerAria: "Entrar a BioScanner (se abre en una pestaña nueva)",
    bioscanner: "Entrar a BioScanner",
    indexAria: "Índice del toolkit",
    index: "Índice",
    closeIndex: "Cerrar índice",
    rail: "Avance y recursos",
    reviewedOf: (done: number, total: number) => `${done} de ${total} revisadas`,
    route: "ruta",
    reviewed: "(revisada)",
    stagesReviewed: (done: number, total: number) => `${done} de ${total} etapas revisadas`,
    progress: "Tu avance",
    routeOf: (title: string) => `Ruta: ${title}`,
    unlocked: "Insignia desbloqueada.",
    unlockHint: "Al completarlas desbloqueas tu insignia.",
    badge: "Insignia Tech4Nature",
    share: "Descargar y compartir",
    nextInRoute: "Siguiente en tu ruta",
    stage: "Etapa",
    personalize: "Personaliza el recorrido",
    pickRoute: "Elige una ruta por público",
    onThisPage: "En esta página",
    promoTitle: "Valida tus datos con BioScanner",
    promoText:
      "Detecta y clasifica especies, identifica jaguares por el patrón de sus manchas y genera reportes. Interfaz en español, inglés, portugués y maya.",
    processed: "archivos procesados en Dzilam a octubre de 2026",
    language: "Cambiar de idioma",
    langNames: { es: "Español", en: "Inglés" } as Record<Locale, string>,
  },
  en: {
    home: "Home",
    stages: "Stages",
    tools: "Tools",
    templates: "Templates",
    skip: "Skip to content",
    openIndex: "Open toolkit index",
    sections: "Toolkit sections",
    searchAria: "Search the toolkit",
    search: "Search",
    bioscannerAria: "Go to BioScanner (opens in a new tab)",
    bioscanner: "Go to BioScanner",
    indexAria: "Toolkit index",
    index: "Index",
    closeIndex: "Close index",
    rail: "Progress and resources",
    reviewedOf: (done: number, total: number) => `${done} of ${total} reviewed`,
    route: "route",
    reviewed: "(reviewed)",
    stagesReviewed: (done: number, total: number) => `${done} of ${total} stages reviewed`,
    progress: "Your progress",
    routeOf: (title: string) => `Route: ${title}`,
    unlocked: "Badge unlocked.",
    unlockHint: "Complete them all to unlock your badge.",
    badge: "Tech4Nature badge",
    share: "Download and share",
    nextInRoute: "Next on your route",
    stage: "Stage",
    personalize: "Personalize your path",
    pickRoute: "Choose a route by audience",
    onThisPage: "On this page",
    promoTitle: "Validate your data with BioScanner",
    promoText:
      "Detect and classify species, identify individual jaguars by their spot patterns and generate reports. Interface in Spanish, English, Portuguese and Maya.",
    processed: "files processed in Dzilam as of October 2026",
    language: "Switch language",
    langNames: { es: "Spanish", en: "English" } as Record<Locale, string>,
  },
};

const NUMBER_LOCALE: Record<Locale, string> = { es: "es-MX", en: "en-US" };

function topLinks(locale: Locale): { label: string; slug: string; match: (p: ToolkitPage) => boolean }[] {
  const l = L[locale];
  return [
    { label: l.home, slug: "", match: (p) => p.kind === "inicio" },
    { label: l.stages, slug: targetOf("E1").slug, match: (p) => p.kind === "etapa" },
    { label: l.tools, slug: "caja-de-herramientas", match: (p) => p.kind === "caja" || p.kind === "glosario" },
    { label: l.templates, slug: "plantillas", match: (p) => p.group === "plantillas" },
  ];
}

/** Slug de la página actual dentro del toolkit ("" en la portada). */
function useCurrentPage(): ToolkitPage {
  const { PAGES, PAGE_BY_SLUG } = useContent();
  const pathname = usePathname();
  const rest = pathname.split(`/${TOOLKIT_SLUG}`)[1] ?? "";
  const slug = rest.replace(/^\//, "").split(/[/?#]/)[0] ?? "";
  return PAGE_BY_SLUG.get(slug) ?? PAGES[0];
}

export default function ToolkitShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleProvider locale={locale}>
      <PrefsProvider>
        <ToolkitProvider>
          <Shell locale={locale}>{children}</Shell>
        </ToolkitProvider>
      </PrefsProvider>
    </LocaleProvider>
  );
}

function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const page = useCurrentPage();
  const { reducedMotion, theme } = usePrefs();
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const modKey = useClientValue(() => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"), "Ctrl");
  const href = (slug: string, hash?: string) => toolkitHref(locale, slug, hash);
  const { IMAGES } = useContent();
  const l = L[locale];

  // Cambiar de página detiene la lectura en voz alta.
  useEffect(() => {
    stopSpeech();
  }, [page.slug]);

  // Barra de lectura de la página actual.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const read = window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight);
      root.style.setProperty("--tk-read", Math.min(1, read).toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [page.slug]);

  // Mantiene visible en la barra lateral la página activa.
  useEffect(() => {
    const side = sidebarRef.current;
    const link = side?.querySelector<HTMLElement>("[aria-current='page']");
    if (!side || !link) return;
    const s = side.getBoundingClientRect();
    const l = link.getBoundingClientRect();
    if (l.top < s.top + 60 || l.bottom > s.bottom - 60) side.scrollTo({ top: side.scrollTop + (l.top - s.top) - s.height / 3 });
  }, [page.slug]);

  // Atajos: Ctrl/⌘ K y "/" abren la búsqueda.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest("input, textarea, select, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "Escape" && navOpen) {
        setNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

  // Cajón móvil: bloquea el scroll del documento mientras está abierto.
  useEffect(() => {
    if (!navOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    sidebarRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [navOpen]);

  // ---- Animaciones por página ----------------------------------------------
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const lines = gsap.utils.toArray<HTMLElement>(".tk-steps, .tk-ninety");

      if (reducedMotion) {
        lines.forEach((el) => {
          el.dataset.static = "";
          el.style.setProperty("--tk-line-p", "1");
        });
        return;
      }

      const title = root.querySelector<HTMLElement>(".tk-article .tk-h1");
      if (title) {
        SplitText.create(title, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.words, { opacity: 0, yPercent: 40, filter: "blur(10px)", duration: 0.8, stagger: 0.03, ease: "power3.out" }),
        });
      }
      gsap.from("[data-hero]", { opacity: 0, y: 16, duration: 0.7, stagger: 0.06, ease: "power3.out", delay: 0.1 });
      gsap.from(".tk-banner-img", { scale: 1.1, duration: 1.6, ease: "power3.out" });

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(reveals, { autoAlpha: 0, y: 22 });
      ScrollTrigger.batch(reveals, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", overwrite: true }),
      });

      const fmt = new Intl.NumberFormat(NUMBER_LOCALE[locale]);
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const prefix = el.dataset.prefix ?? "";
        const suffix = el.dataset.suffix ?? "";
        const counter = { v: 0 };
        el.textContent = prefix + fmt.format(0) + suffix;
        gsap.to(counter, {
          v: target,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
          onUpdate: () => {
            el.textContent = prefix + fmt.format(Math.round(counter.v)) + suffix;
          },
        });
      });

      // Líneas de progreso: pasos clave y línea de tiempo.
      lines.forEach((el) => {
        gsap.fromTo(
          el,
          { "--tk-line-p": 0 },
          { "--tk-line-p": 1, ease: "none", scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 60%", scrub: 0.6 } },
        );
        el.querySelectorAll<HTMLElement>(":scope > li").forEach((li) =>
          ScrollTrigger.create({ trigger: li, start: "top 80%", toggleClass: { targets: li, className: "is-lit" } }),
        );
      });

      gsap.utils.toArray<HTMLElement>(".tk-step-media img").forEach((img) =>
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: img.parentElement, scrub: true } }),
      );

      // Las imágenes cargan después: recalcula posiciones.
      gsap.delayedCall(0.8, () => ScrollTrigger.refresh());
    },
    { scope: rootRef, dependencies: [page.slug, reducedMotion, locale], revertOnUpdate: true },
  );

  return (
    <>
      <div ref={rootRef} className="tk-root" lang={locale}>
        <a href="#contenido" className="tk-skip">
          {l.skip}
        </a>

        <header className="tk-top">
          <button
            type="button"
            className="tk-icon-btn"
            aria-label={l.openIndex}
            aria-expanded={navOpen}
            aria-controls="tk-sidebar"
            onClick={() => setNavOpen(true)}
          >
            <IconMenu />
          </button>
          <div className="tk-top-brand">
            <Link href={localePath(locale, "/aiforbiodiversity")} aria-label="AI for Climate & Biodiversity">
              <img className="tk-top-logo" src={IMAGES.afbLogo.src} alt={IMAGES.afbLogo.alt} width={130} height={26} />
            </Link>
            <span className="tk-top-sep" aria-hidden="true" />
            <Link href={href("")} className="tk-top-title">
              <span>Toolkit Tech4Nature</span>
              <span className="tk-version">v{TOOLKIT_VERSION}</span>
            </Link>
          </div>

          <nav className="tk-top-nav" aria-label={l.sections}>
            {topLinks(locale).map((t) => (
              <Link key={t.slug} href={href(t.slug)} aria-current={t.match(page) ? "page" : undefined}>
                {t.label}
              </Link>
            ))}
          </nav>

          <div className="tk-top-actions">
            <button type="button" className="tk-search-btn" onClick={() => setSearchOpen(true)} aria-label={l.searchAria}>
              <IconSearch />
              <span className="tk-search-label">{l.search}</span>
              <kbd className="tk-kbd">{modKey} K</kbd>
            </button>
            <LangSwitch locale={locale} />
            <A11yMenu />
            <a
              className="tk-cta tk-cta--top"
              href={BIOSCANNER_APP}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.bioscannerAria}
            >
              <span className="tk-top-cta-label">{l.bioscanner}</span>
              <IconExternal />
            </a>
          </div>
          <div className="tk-top-progress" aria-hidden="true" />
        </header>

        <div className="tk-layout">
          <aside id="tk-sidebar" ref={sidebarRef} className="tk-sidebar" data-open={navOpen || undefined} aria-label={l.indexAria}>
            <div className="tk-side-head">
              <strong>{l.index}</strong>
              <button type="button" className="tk-icon-btn" aria-label={l.closeIndex} onClick={() => setNavOpen(false)}>
                <IconClose />
              </button>
            </div>
            <ProgressSummary compact locale={locale} />
            <Sidebar page={page} locale={locale} onNavigate={() => setNavOpen(false)} />
          </aside>

          <main id="contenido" className="tk-main" tabIndex={-1}>
            {children}
          </main>

          <aside className="tk-rail" aria-label={l.rail}>
            <ProgressSummary locale={locale} />
            <PageToc slug={page.slug} />
            <BioScannerCard locale={locale} />
          </aside>
        </div>

        <div className="tk-scrim" data-open={navOpen || undefined} onClick={() => setNavOpen(false)} aria-hidden="true" />
        <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
        <RefPreview />
        <SpeechPlayer />
        <FocusReader />
        <CompletionDialog />
      </div>
      <div className="afb-footer-wrap tk-footer-wrap" data-theme={theme}>
        <SiteFooter />
      </div>
    </>
  );
}

function Sidebar({ page, locale, onNavigate }: { page: ToolkitPage; locale: Locale; onNavigate: () => void }) {
  const { inRoute, isDone, route } = useToolkit();
  const { GROUPS, PAGES } = useContent();
  const l = L[locale];
  // Abierto por defecto solo el capítulo de la página actual; el usuario puede abrir o cerrar los demás.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  return (
    <nav>
      {GROUPS.map((group, gi) => {
        const pages = PAGES.filter((p) => p.group === group.id);
        const section = group.section && group.section !== GROUPS[gi - 1]?.section ? group.section : null;
        const open = overrides[group.id] ?? group.id === page.group;
        const actions = pages.filter((p) => p.kind === "etapa");
        const doneCount = actions.filter((p) => p.ref && isDone(p.ref)).length;
        return (
          <div key={group.id} className={`tk-side-group${group.section ? " tk-side-group--in" : ""}`} data-current={group.id === page.group || undefined}>
            {section ? (
              <Link href={toolkitHref(locale, "crea-el-tuyo")} className="tk-side-section" onClick={onNavigate}>
                {section}
              </Link>
            ) : null}
            <button
              type="button"
              className="tk-side-group-btn"
              aria-expanded={open}
              aria-controls={`tk-nav-${group.id}`}
              onClick={() => setOverrides((o) => ({ ...o, [group.id]: !open }))}
            >
              <span>{group.label}</span>
              {actions.length ? (
                <span className="tk-side-count" aria-label={l.reviewedOf(doneCount, actions.length)}>
                  {doneCount}/{actions.length}
                </span>
              ) : null}
              <IconChevronDown />
            </button>
            <ul id={`tk-nav-${group.id}`} className="tk-side-list" hidden={!open}>
              {pages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={toolkitHref(locale, p.slug)}
                    className="tk-side-link"
                    aria-current={p.slug === page.slug ? "page" : undefined}
                    onClick={onNavigate}
                  >
                    {p.code ? <span className="tk-side-code">{p.code}</span> : null}
                    <span className="tk-side-label">{p.label}</span>
                    {route && inRoute(p.slug) ? <span className="tk-side-badge">{l.route}</span> : null}
                    {p.kind === "etapa" && p.ref && isDone(p.ref) ? (
                      <>
                        <IconCheck className="tk-side-check" />
                        <span className="sr-only">{l.reviewed}</span>
                      </>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

function ProgressRing({ value, total, label }: { value: number; total: number; label: string }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg className="tk-ring" viewBox="0 0 54 54" role="img" aria-label={label}>
      <circle className="tk-ring-track" cx="27" cy="27" r={r} />
      <circle
        className="tk-ring-fill"
        cx="27"
        cy="27"
        r={r}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / total)}
        transform="rotate(-90 27 27)"
      />
      <text x="27" y="32" textAnchor="middle">
        {value}
      </text>
    </svg>
  );
}

function ProgressSummary({ compact = false, locale }: { compact?: boolean; locale: Locale }) {
  const { done, route, isDone, complete } = useToolkit();
  const { STAGES } = useContent();
  const l = L[locale];
  const total = STAGES.length;
  const count = done.length;
  const next = route?.path.find((key) => /^E\d$/.test(key) && !isDone(key.toLowerCase()));
  const nextAction = next ? STAGES.find((s) => s.code === next) : null;

  if (compact) {
    return (
      <div className="tk-side-progress">
        <ProgressRing value={count} total={total} label={l.stagesReviewed(count, total)} />
        <div>
          <strong>{l.progress}</strong>
          <span>{route ? l.routeOf(route.title) : l.stagesReviewed(count, total)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tk-card tk-progress-card">
      <div className="tk-progress-row">
        <ProgressRing value={count} total={total} label={l.stagesReviewed(count, total)} />
        <div>
          <p className="tk-progress-title">{l.progress}</p>
          <p className="tk-progress-sub">
            {l.stagesReviewed(count, total)}. {complete ? l.unlocked : l.unlockHint}
          </p>
        </div>
      </div>
      {complete ? (
        <Link className="tk-progress-next" href={toolkitHref(locale, "insignia")}>
          <span>
            <small>{l.badge}</small>
            {l.share}
          </span>
          <IconArrowRight />
        </Link>
      ) : nextAction ? (
        <Link className="tk-progress-next" href={toolkitHref(locale, targetOf(nextAction.code).slug)}>
          <span>
            <small>{l.nextInRoute}</small>
            {l.stage} {nextAction.n} · {nextAction.short}
          </span>
          <IconArrowRight />
        </Link>
      ) : (
        <Link className="tk-progress-next" href={toolkitHref(locale, "")}>
          <span>
            <small>{l.personalize}</small>
            {l.pickRoute}
          </span>
          <IconArrowRight />
        </Link>
      )}
    </div>
  );
}

/** Índice de la página actual, construido a partir de sus encabezados. */
function PageToc({ slug }: { slug: string }) {
  const locale = useLocale();
  const l = L[locale];
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const hs = Array.from(document.querySelectorAll<HTMLElement>(".tk-article [data-toc]"));
      setItems(hs.map((h) => ({ id: h.id, text: h.dataset.toc ?? h.textContent ?? "" })));
    });
    return () => cancelAnimationFrame(raf);
  }, [slug, locale]);

  useEffect(() => {
    if (!items.length) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let current: string | null = items[0].id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top - 140 <= 0) current = item.id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
    };
  }, [items]);

  if (items.length < 2) return null;
  return (
    <nav className="tk-toc" aria-label={l.onThisPage}>
      <p className="tk-toc-title">{l.onThisPage}</p>
      <ol>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              onClick={(e) => {
                const el = document.getElementById(item.id);
                if (!el) return;
                e.preventDefault();
                const reduce = document.documentElement.dataset.tkMotion === "reduce" || matchMedia("(prefers-reduced-motion: reduce)").matches;
                el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
                window.history.replaceState(null, "", `#${item.id}`);
              }}
            >
              <span>{i + 1}.</span>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function BioScannerCard({ locale }: { locale: Locale }) {
  const { IMAGES } = useContent();
  const l = L[locale];
  return (
    <div className="tk-card tk-promo">
      <div className="tk-promo-media">
        <img src={IMAGES.platform.src} alt={IMAGES.platform.alt} width={482} height={319} loading="lazy" decoding="async" />
      </div>
      <div className="tk-promo-body">
        <span className="tk-eyebrow">{locale === "en" ? "Tech4Nature Mexico" : "Tech4Nature México"}</span>
        <p className="tk-promo-title">{l.promoTitle}</p>
        <p className="tk-promo-text">{l.promoText}</p>
        <a className="tk-cta tk-cta--block" href={BIOSCANNER_APP} target="_blank" rel="noopener noreferrer">
          {l.bioscanner}
          <IconExternal />
        </a>
        <div className="tk-promo-foot">
          <span className="tk-pulse" aria-hidden="true" />
          <span>
            <strong>333,087</strong> {l.processed}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Selector EN | ES del toolkit: cambia solo el segmento de idioma de la URL y
 * conserva la página (mismo slug), la consulta y el ancla actuales.
 */
function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const l = L[locale];
  const go = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // Igual que el selector del sitio: recuerda la elección para la redirección de "/".
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; samesite=lax`;
      stopSpeech();
      router.push(`${swapLocale(pathname, next)}${window.location.search}${window.location.hash}`);
    },
    [locale, pathname, router],
  );
  return (
    <div className="lang-switch" role="group" aria-label={l.language}>
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switch__opt ${code === locale ? "is-active" : ""}`}
          onClick={() => go(code)}
          aria-current={code === locale ? "true" : undefined}
          lang={code}
          title={l.langNames[code]}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
