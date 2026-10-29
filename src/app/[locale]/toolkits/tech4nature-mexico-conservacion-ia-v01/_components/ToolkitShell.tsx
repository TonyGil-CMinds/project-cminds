"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SiteFooter from "@/components/SiteFooter";
import { localePath, type Locale } from "@/i18n/config";
import {
  GROUPS,
  IMAGES,
  PAGES,
  PAGE_BY_SLUG,
  STAGES,
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
import RefPreview from "./RefPreview";
import { useClientValue } from "./useLocalStore";
import { IconArrowRight, IconCheck, IconChevronDown, IconClose, IconExternal, IconMenu, IconSearch } from "./icons";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const BIOSCANNER_APP = "https://app.bioscanner.io";

const TOP_LINKS: { label: string; slug: string; match: (p: ToolkitPage) => boolean }[] = [
  { label: "Inicio", slug: "", match: (p) => p.kind === "inicio" },
  { label: "Etapas", slug: targetOf("E1").slug, match: (p) => p.kind === "etapa" },
  { label: "Herramientas", slug: "caja-de-herramientas", match: (p) => p.kind === "caja" },
  { label: "Plantillas", slug: "plantillas", match: (p) => p.group === "plantillas" },
];

/** Slug de la página actual dentro del toolkit ("" en la portada). */
function useCurrentPage(): ToolkitPage {
  const pathname = usePathname();
  const rest = pathname.split(`/${TOOLKIT_SLUG}`)[1] ?? "";
  const slug = rest.replace(/^\//, "").split(/[/?#]/)[0] ?? "";
  return PAGE_BY_SLUG.get(slug) ?? PAGES[0];
}

export default function ToolkitShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <PrefsProvider>
      <ToolkitProvider>
        <Shell locale={locale}>{children}</Shell>
      </ToolkitProvider>
    </PrefsProvider>
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

      const fmt = new Intl.NumberFormat("es-MX");
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
    { scope: rootRef, dependencies: [page.slug, reducedMotion], revertOnUpdate: true },
  );

  return (
    <>
      <div ref={rootRef} className="tk-root" lang="es">
        <a href="#contenido" className="tk-skip">
          Saltar al contenido
        </a>

        <header className="tk-top">
          <button
            type="button"
            className="tk-icon-btn"
            aria-label="Abrir índice del toolkit"
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

          <nav className="tk-top-nav" aria-label="Secciones del toolkit">
            {TOP_LINKS.map((l) => (
              <Link key={l.label} href={href(l.slug)} aria-current={l.match(page) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="tk-top-actions">
            <button type="button" className="tk-search-btn" onClick={() => setSearchOpen(true)} aria-label="Buscar en el toolkit">
              <IconSearch />
              <span className="tk-search-label">Buscar</span>
              <kbd className="tk-kbd">{modKey} K</kbd>
            </button>
            <A11yMenu />
            <LanguageSwitcher />
            <a
              className="tk-cta tk-cta--top"
              href={BIOSCANNER_APP}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Entrar a BioScanner (se abre en una pestaña nueva)"
            >
              <span className="tk-top-cta-label">Entrar a BioScanner</span>
              <IconExternal />
            </a>
          </div>
          <div className="tk-top-progress" aria-hidden="true" />
        </header>

        <div className="tk-layout">
          <aside id="tk-sidebar" ref={sidebarRef} className="tk-sidebar" data-open={navOpen || undefined} aria-label="Índice del toolkit">
            <div className="tk-side-head">
              <strong>Índice</strong>
              <button type="button" className="tk-icon-btn" aria-label="Cerrar índice" onClick={() => setNavOpen(false)}>
                <IconClose />
              </button>
            </div>
            <ProgressSummary compact locale={locale} />
            <Sidebar page={page} locale={locale} onNavigate={() => setNavOpen(false)} />
          </aside>

          <main id="contenido" className="tk-main" tabIndex={-1}>
            {locale === "en" ? (
              <p className="tk-notice" lang="en">
                This toolkit is currently available in Spanish only. Your browser can translate the page; templates and
                resource links work the same way.
              </p>
            ) : null}
            {children}
          </main>

          <aside className="tk-rail" aria-label="Avance y recursos">
            <ProgressSummary locale={locale} />
            <PageToc slug={page.slug} />
            <BioScannerCard />
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
  // Abierto por defecto solo el capítulo de la página actual; el usuario puede abrir o cerrar los demás.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  return (
    <nav>
      {GROUPS.map((group) => {
        const pages = PAGES.filter((p) => p.group === group.id);
        const open = overrides[group.id] ?? group.id === page.group;
        const actions = pages.filter((p) => p.kind === "etapa");
        const doneCount = actions.filter((p) => p.ref && isDone(p.ref)).length;
        return (
          <div key={group.id} className="tk-side-group" data-current={group.id === page.group || undefined}>
            <button
              type="button"
              className="tk-side-group-btn"
              aria-expanded={open}
              aria-controls={`tk-nav-${group.id}`}
              onClick={() => setOverrides((o) => ({ ...o, [group.id]: !open }))}
            >
              <span>{group.label}</span>
              {actions.length ? (
                <span className="tk-side-count" aria-label={`${doneCount} de ${actions.length} revisadas`}>
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
                    {route && inRoute(p.slug) ? <span className="tk-side-badge">ruta</span> : null}
                    {p.kind === "etapa" && p.ref && isDone(p.ref) ? (
                      <>
                        <IconCheck className="tk-side-check" />
                        <span className="sr-only">(revisada)</span>
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

function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg className="tk-ring" viewBox="0 0 54 54" role="img" aria-label={`${value} de ${total} etapas revisadas`}>
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
  const total = STAGES.length;
  const count = done.length;
  const next = route?.path.find((key) => /^E\d$/.test(key) && !isDone(key.toLowerCase()));
  const nextAction = next ? STAGES.find((s) => s.code === next) : null;

  if (compact) {
    return (
      <div className="tk-side-progress">
        <ProgressRing value={count} total={total} />
        <div>
          <strong>Tu avance</strong>
          <span>{route ? `Ruta: ${route.title}` : `${count} de ${total} etapas revisadas`}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tk-card tk-progress-card">
      <div className="tk-progress-row">
        <ProgressRing value={count} total={total} />
        <div>
          <p className="tk-progress-title">Tu avance</p>
          <p className="tk-progress-sub">
            {count} de {total} etapas revisadas. {complete ? "Insignia desbloqueada." : "Al completarlas desbloqueas tu insignia."}
          </p>
        </div>
      </div>
      {complete ? (
        <Link className="tk-progress-next" href={toolkitHref(locale, "insignia")}>
          <span>
            <small>Insignia Tech4Nature</small>
            Descargar y compartir
          </span>
          <IconArrowRight />
        </Link>
      ) : nextAction ? (
        <Link className="tk-progress-next" href={toolkitHref(locale, targetOf(nextAction.code).slug)}>
          <span>
            <small>Siguiente en tu ruta</small>
            Etapa {nextAction.n} · {nextAction.short}
          </span>
          <IconArrowRight />
        </Link>
      ) : (
        <Link className="tk-progress-next" href={toolkitHref(locale, "")}>
          <span>
            <small>Personaliza el recorrido</small>
            Elige una ruta por público
          </span>
          <IconArrowRight />
        </Link>
      )}
    </div>
  );
}

/** Índice de la página actual, construido a partir de sus encabezados. */
function PageToc({ slug }: { slug: string }) {
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const hs = Array.from(document.querySelectorAll<HTMLElement>(".tk-article [data-toc]"));
      setItems(hs.map((h) => ({ id: h.id, text: h.dataset.toc ?? h.textContent ?? "" })));
    });
    return () => cancelAnimationFrame(raf);
  }, [slug]);

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
    <nav className="tk-toc" aria-label="En esta página">
      <p className="tk-toc-title">En esta página</p>
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

function BioScannerCard() {
  return (
    <div className="tk-card tk-promo">
      <div className="tk-promo-media">
        <img src={IMAGES.platform.src} alt={IMAGES.platform.alt} width={482} height={319} loading="lazy" decoding="async" />
      </div>
      <div className="tk-promo-body">
        <span className="tk-eyebrow">Tech4Nature México</span>
        <p className="tk-promo-title">Valida tus datos con BioScanner</p>
        <p className="tk-promo-text">
          Detecta y clasifica especies, identifica jaguares por el patrón de sus manchas y genera reportes. Interfaz en
          español, inglés, portugués y maya.
        </p>
        <a className="tk-cta tk-cta--block" href={BIOSCANNER_APP} target="_blank" rel="noopener noreferrer">
          Entrar a BioScanner
          <IconExternal />
        </a>
        <div className="tk-promo-foot">
          <span className="tk-pulse" aria-hidden="true" />
          <span>
            <strong>333,099</strong> archivos procesados en Dzilam a septiembre de 2026
          </span>
        </div>
      </div>
    </div>
  );
}
