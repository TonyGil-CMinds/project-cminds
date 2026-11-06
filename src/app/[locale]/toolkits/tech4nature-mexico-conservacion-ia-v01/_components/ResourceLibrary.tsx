"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import type { Locale } from "@/i18n/config";
import { RESOURCES as ES_RESOURCES, type AccessKind, type CategoryId, type Level } from "../data";
import type { Content } from "../content";
import { useContent, useLocale } from "./i18n";
import {
  IconChevronDown,
  IconClose,
  IconCoin,
  IconExternal,
  IconGlobe,
  IconKey,
  IconLanguages,
  IconLevel,
  IconSearch,
  IconSliders,
  IconStairs,
  IconUnlock,
  IconUser,
} from "./icons";

gsap.registerPlugin(Flip, ScrollTrigger);

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const buildIndex = (resources: Content["RESOURCES"]) =>
  resources.map((r) => ({
    r,
    need: r.category,
    text: normalize(`${r.code} ${r.title} ${r.org ?? ""} ${r.use} ${r.access ?? ""}`),
  }));
const ES_INDEX = buildIndex(ES_RESOURCES);

type LangId = Content["LANG_FILTERS"][number]["id"];

// Cada opción de filtro lleva un ícono; el de acceso usa el mismo color que el punto de las tarjetas.
const KIND_ICON: Record<AccessKind, ReactNode> = {
  gratuito: <IconUnlock className="tk-pill-ico" />,
  cuenta: <IconUser className="tk-pill-ico" />,
  costo: <IconCoin className="tk-pill-ico" />,
};
const LEVEL_N: Record<Level, 1 | 2 | 3> = { Básico: 1, Intermedio: 2, Avanzado: 3 };
const langIcon = (id: LangId) =>
  id === "MULTI" ? (
    <IconGlobe className="tk-pill-ico" />
  ) : (
    <span className="tk-pill-code" aria-hidden="true">
      {id}
    </span>
  );

const L = {
  es: {
    galleryTitle: "Explora la caja de herramientas",
    galleryDesc: (c: number, r: number) => `${c} categorías y ${r} recursos, con acceso, idioma y nivel. Elige una imagen para filtrar.`,
    seeAll: (n: number) => `Ver los ${n} recursos`,
    searchPh: "Buscar por herramienta, institución o tarea…",
    searchLabel: "Buscar en la caja de herramientas",
    of: "de",
    resources: "recursos",
    clear: "Limpiar filtros",
    byCategory: "Filtrar por categoría",
    category: "Categoría",
    all: "Todas",
    byAccess: "Filtrar por acceso",
    access: "Acceso",
    byLang: "Filtrar por idioma",
    lang: "Idioma",
    byLevel: "Filtrar por nivel",
    level: "Nivel",
    filters: "Filtros",
    filtersAria: "Más filtros: acceso, idioma y nivel",
    remove: "Quitar filtro",
    newTab: " (se abre en una pestaña nueva)",
    open: "Abrir",
    empty: "No hay recursos con esa combinación de filtros.",
  },
  en: {
    galleryTitle: "Explore the toolbox",
    galleryDesc: (c: number, r: number) => `${c} categories and ${r} resources, with access, language and level. Choose an image to filter.`,
    seeAll: (n: number) => `See all ${n} resources`,
    searchPh: "Search by tool, institution or task…",
    searchLabel: "Search the toolbox",
    of: "of",
    resources: "resources",
    clear: "Clear filters",
    byCategory: "Filter by category",
    category: "Category",
    all: "All",
    byAccess: "Filter by access",
    access: "Access",
    byLang: "Filter by language",
    lang: "Language",
    byLevel: "Filter by level",
    level: "Level",
    filters: "Filters",
    filtersAria: "More filters: access, language and level",
    remove: "Remove filter",
    newTab: " (opens in a new tab)",
    open: "Open",
    empty: "No resources match that combination of filters.",
  },
} satisfies Record<Locale, Record<string, string | ((...a: never[]) => string)>>;

export default function ResourceLibrary() {
  const locale = useLocale();
  const l = L[locale];
  const { ACCESS_KINDS, CATEGORIES, LANG_FILTERS, LEVELS, RESOURCES } = useContent();
  const INDEX = useMemo(() => (RESOURCES === ES_RESOURCES ? ES_INDEX : buildIndex(RESOURCES)), [RESOURCES]);
  const NEED_LABEL = useMemo(() => new Map<string, string>(CATEGORIES.map((n) => [n.id, n.label])), [CATEGORIES]);
  const LEVEL_LABEL = useMemo(() => new Map<string, string>(LEVELS.map((v) => [v.id, v.label])), [LEVELS]);
  const [query, setQuery] = useState("");
  const [need, setNeed] = useState<CategoryId | "all">("all");
  const [kinds, setKinds] = useState<AccessKind[]>([]);
  const [langs, setLangs] = useState<LangId[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const gridRef = useRef<HTMLUListElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const results = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return INDEX.filter(
      (e) =>
        (need === "all" || e.need === need) &&
        (!kinds.length || (e.r.kind && kinds.includes(e.r.kind))) &&
        (!langs.length || langs.some((id) => LANG_FILTERS.find((f) => f.id === id)!.test.test(e.r.lang))) &&
        (!levels.length || (e.r.level && levels.includes(e.r.level))) &&
        tokens.every((t) => e.text.includes(t)),
    );
  }, [query, need, kinds, langs, levels, INDEX, LANG_FILTERS]);

  // Captura posiciones antes de cada cambio de filtro para animarlas con Flip.
  const capture = () => {
    if (!gridRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    flipState.current = Flip.getState(gridRef.current.querySelectorAll(".tk-res"));
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (state && gridRef.current) {
      Flip.from(state, {
        targets: gridRef.current.querySelectorAll(".tk-res"),
        duration: 0.5,
        ease: "power3.inOut",
        scale: false,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.15 }),
      });
    }
    ScrollTrigger.refresh();
  }, [results]);

  const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  const reset = () => {
    capture();
    setQuery("");
    setNeed("all");
    setKinds([]);
    setLangs([]);
    setLevels([]);
  };

  // Enlaces #r01, #r02…: limpia filtros para que la ficha exista y la resalta.
  useEffect(() => {
    const onHash = () => {
      const m = /^#(r\d{2})$/.exec(window.location.hash);
      if (!m) return;
      setQuery("");
      setNeed("all");
      setKinds([]);
      setLangs([]);
      setLevels([]);
      setFocusId(m[1]);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!focusId) return;
    const raf = requestAnimationFrame(() => {
      const el = document.getElementById(focusId);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("is-flash");
      window.setTimeout(() => el.classList.remove("is-flash"), 1800);
      setFocusId(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [focusId]);

  const needCount = (id: CategoryId) => INDEX.filter((e) => e.need === id).length;
  const KIND_LABEL = new Map<string, string>(ACCESS_KINDS.map((k) => [k.id, k.label]));
  const LANG_LABEL = new Map<string, string>(LANG_FILTERS.map((f) => [f.id, f.label]));
  const MULTI_TEST = LANG_FILTERS.find((f) => f.id === "MULTI")?.test;

  // Idioma en la tarjeta, con la misma regla que el filtro: multilingüe → globo y texto;
  // si no, cada código (ES, EN) en su recuadro y el resto (p. ej. «guías en ES») como etiqueta.
  const langTags = (lang: string) => {
    if (MULTI_TEST?.test(lang)) {
      return (
        <span className="tk-badge-tag" title={l.lang}>
          <IconGlobe className="tk-pill-ico" />
          {lang}
        </span>
      );
    }
    return lang.split(/,\s*/).map((t) =>
      /^[A-Z]{2}$/.test(t) ? (
        <span key={t} className="tk-pill-code tk-res-code" title={l.lang}>
          {t}
        </span>
      ) : (
        <span key={t} className="tk-badge-tag" title={l.lang}>
          {t}
        </span>
      ),
    );
  };
  const extraCount = kinds.length + langs.length + levels.length;
  const filtered = Boolean(query) || need !== "all" || extraCount > 0;

  // Filtros secundarios activos, como chips que se pueden quitar.
  const activeChips: { key: string; tone?: string; icon: ReactNode; label: string; remove: () => void }[] = [
    ...kinds.map((id) => ({
      key: `k-${id}`,
      tone: id,
      icon: KIND_ICON[id],
      label: KIND_LABEL.get(id) ?? id,
      remove: () => setKinds((v) => v.filter((x) => x !== id)),
    })),
    ...langs.map((id) => ({
      key: `l-${id}`,
      icon: langIcon(id),
      label: LANG_LABEL.get(id) ?? id,
      remove: () => setLangs((v) => v.filter((x) => x !== id)),
    })),
    ...levels.map((id) => ({
      key: `n-${id}`,
      icon: <IconLevel className="tk-pill-ico" level={LEVEL_N[id]} />,
      label: LEVEL_LABEL.get(id) ?? id,
      remove: () => setLevels((v) => v.filter((x) => x !== id)),
    })),
  ];

  const pill = ({
    pressed,
    onClick,
    children,
    key,
    title,
    tone,
  }: {
    pressed: boolean;
    onClick: () => void;
    children: ReactNode;
    key?: string;
    title?: string;
    tone?: string;
  }) => (
    <button
      key={key}
      type="button"
      className="tk-pill"
      aria-pressed={pressed}
      title={title}
      data-tone={tone}
      onClick={() => {
        capture();
        onClick();
      }}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div className="tk-lib-gallery" data-reveal>
        <PortfolioGallery
          title={l.galleryTitle}
          description={l.galleryDesc(CATEGORIES.length, RESOURCES.length)}
          archiveButton={{ text: l.seeAll(RESOURCES.length), href: "#caja-recursos" }}
          images={CATEGORIES.map((n) => ({ src: n.image.src, alt: n.image.alt, title: n.label }))}
          itemWidth={290}
          overlap={226}
          maxHeight={110}
          onImageClick={(i) => {
            capture();
            setNeed(CATEGORIES[i].id);
            requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
          }}
        />
      </div>

      <div ref={listRef} id="caja-recursos" className="tk-lib">
        <div className="tk-lib-bar">
          <div className="tk-lib-search">
            <IconSearch />
            <input
              className="tk-input"
              type="search"
              value={query}
              placeholder={l.searchPh}
              aria-label={l.searchLabel}
              onChange={(e) => {
                capture();
                setQuery(e.target.value);
              }}
            />
          </div>
          <button
            type="button"
            className="tk-lib-filters"
            aria-expanded={moreOpen}
            aria-controls="tk-lib-more"
            aria-label={l.filtersAria}
            onClick={() => setMoreOpen((o) => !o)}
          >
            <IconSliders />
            <span className="tk-lib-filters-label">{l.filters}</span>
            {extraCount ? <span className="tk-lib-filters-n">{extraCount}</span> : null}
            <IconChevronDown className="tk-lib-filters-chev" />
          </button>
        </div>

        <div className="tk-lib-cats" role="group" aria-label={l.byCategory}>
          {pill({
            pressed: need === "all",
            onClick: () => setNeed("all"),
            children: (
              <>
                {l.all} <small>{RESOURCES.length}</small>
              </>
            ),
          })}
          {CATEGORIES.map((n) =>
            pill({
              key: n.id,
              pressed: need === n.id,
              onClick: () => setNeed(need === n.id ? "all" : n.id),
              children: (
                <>
                  {n.label} <small>{needCount(n.id)}</small>
                </>
              ),
            }),
          )}
        </div>

        <div id="tk-lib-more" className="tk-lib-more" hidden={!moreOpen}>
          <div className="tk-facet" role="group" aria-label={l.byAccess}>
            <span className="tk-facet-label">
              <IconKey />
              {l.access}
            </span>
            <div className="tk-facet-opts">
              {ACCESS_KINDS.map((k) =>
                pill({
                  key: k.id,
                  tone: k.id,
                  pressed: kinds.includes(k.id),
                  onClick: () => setKinds((ks) => toggle(ks, k.id)),
                  children: (
                    <>
                      {KIND_ICON[k.id]}
                      {k.label}
                    </>
                  ),
                }),
              )}
            </div>
          </div>
          <div className="tk-facet" role="group" aria-label={l.byLang}>
            <span className="tk-facet-label">
              <IconLanguages />
              {l.lang}
            </span>
            <div className="tk-facet-opts">
              {LANG_FILTERS.map((f) =>
                pill({
                  key: f.id,
                  pressed: langs.includes(f.id),
                  onClick: () => setLangs((ls) => toggle(ls, f.id)),
                  children: (
                    <>
                      {langIcon(f.id)}
                      {f.label}
                    </>
                  ),
                }),
              )}
            </div>
          </div>
          <div className="tk-facet" role="group" aria-label={l.byLevel}>
            <span className="tk-facet-label">
              <IconStairs />
              {l.level}
            </span>
            <div className="tk-facet-opts">
              {LEVELS.map((v) =>
                pill({
                  key: v.id,
                  title: v.hint,
                  pressed: levels.includes(v.id),
                  onClick: () => setLevels((ls) => toggle(ls, v.id)),
                  children: (
                    <>
                      <IconLevel className="tk-pill-ico" level={LEVEL_N[v.id]} />
                      {v.label}
                    </>
                  ),
                }),
              )}
            </div>
          </div>
        </div>

        <div className="tk-lib-status">
          <span className="tk-lib-count" aria-live="polite">
            <strong>{results.length}</strong> {l.of} {RESOURCES.length} {l.resources}
          </span>
          {activeChips.map((c) => (
            <button
              key={c.key}
              type="button"
              className="tk-lib-chip"
              data-tone={c.tone}
              aria-label={`${l.remove}: ${c.label}`}
              onClick={() => {
                capture();
                c.remove();
              }}
            >
              {c.icon}
              {c.label}
              <IconClose className="tk-lib-chip-x" />
            </button>
          ))}
          {filtered ? (
            <button type="button" className="tk-link-btn" onClick={reset}>
              {l.clear}
            </button>
          ) : null}
        </div>

        {results.length ? (
          <ul ref={gridRef} className="tk-res-grid">
            {results.map(({ r, need: n }) => (
              <li key={r.id} id={r.id} className="tk-res" data-flip-id={r.code}>
                <div className="tk-res-top">
                  <span className="tk-ref tk-ref--r">{r.code}</span>
                  <span className="tk-res-need">{NEED_LABEL.get(n)}</span>
                </div>
                <h3 className="tk-res-title">{r.title}</h3>
                {r.org ? <p className="tk-res-org">{r.org}</p> : null}
                <p className="tk-res-use">{r.use}.</p>
                {r.access || r.kind ? (
                  <p className="tk-res-access" data-tone={r.kind ?? undefined}>
                    {r.kind ? KIND_ICON[r.kind] : null}
                    <span>
                      <span className="sr-only">{l.access}: </span>
                      {r.access ?? KIND_LABEL.get(r.kind ?? "")}
                    </span>
                  </p>
                ) : null}
                <div className="tk-res-foot">
                  <div className="tk-res-badges">
                    {langTags(r.lang)}
                    {r.level ? (
                      <span className="tk-badge-tag" title={l.level}>
                        <IconLevel className="tk-pill-ico" level={LEVEL_N[r.level]} />
                        {LEVEL_LABEL.get(r.level) ?? r.level}
                      </span>
                    ) : null}
                  </div>
                  <span className="tk-res-links">
                    {r.extra ? (
                      <a className="tk-res-link tk-res-link--extra" href={r.extra.url} target="_blank" rel="noopener noreferrer">
                        {r.extra.label}
                        <IconExternal />
                        <span className="sr-only">{l.newTab}</span>
                      </a>
                    ) : null}
                    <a className="tk-res-link tk-res-link--main" href={r.url} target="_blank" rel="noopener noreferrer">
                      {l.open}
                      <IconExternal />
                      <span className="sr-only">
                        : {r.title}
                        {l.newTab}
                      </span>
                    </a>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="tk-empty">
            <p>{l.empty}</p>
            <button type="button" className="tk-ghost" onClick={reset}>
              {l.clear}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
