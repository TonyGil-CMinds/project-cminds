"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import { ACCESS_KINDS, CATEGORIES, LANG_FILTERS, LEVELS, RESOURCES, type AccessKind, type CategoryId, type Level } from "../data";
import { IconExternal, IconSearch } from "./icons";

gsap.registerPlugin(Flip, ScrollTrigger);

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const INDEX = RESOURCES.map((r) => ({
  r,
  need: r.category,
  text: normalize(`${r.code} ${r.title} ${r.org ?? ""} ${r.use} ${r.access ?? ""}`),
}));
const NEED_LABEL = new Map<string, string>(CATEGORIES.map((n) => [n.id, n.label]));

type LangId = (typeof LANG_FILTERS)[number]["id"];

export default function ResourceLibrary() {
  const [query, setQuery] = useState("");
  const [need, setNeed] = useState<CategoryId | "all">("all");
  const [kinds, setKinds] = useState<AccessKind[]>([]);
  const [langs, setLangs] = useState<LangId[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const results = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    return INDEX.filter(
      (e) =>
        (need === "all" || e.need === need) &&
        (!kinds.length || (e.r.kind && kinds.includes(e.r.kind))) &&
        (!langs.length || langs.some((l) => LANG_FILTERS.find((f) => f.id === l)!.test.test(e.r.lang))) &&
        (!levels.length || (e.r.level && levels.includes(e.r.level))) &&
        tokens.every((t) => e.text.includes(t)),
    );
  }, [query, need, kinds, langs, levels]);

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

  return (
    <div>
      <div className="tk-lib-gallery" data-reveal>
        <PortfolioGallery
          title="Explora la caja de herramientas"
          description={`${CATEGORIES.length} categorías y ${RESOURCES.length} recursos, con acceso, idioma y nivel. Elige una imagen para filtrar.`}
          archiveButton={{ text: `Ver los ${RESOURCES.length} recursos`, href: "#caja-recursos" }}
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
              placeholder="Buscar por herramienta, institución o tarea…"
              aria-label="Buscar en la caja de herramientas"
              onChange={(e) => {
                capture();
                setQuery(e.target.value);
              }}
            />
          </div>
          <span className="tk-lib-count" aria-live="polite">
            <strong>{results.length}</strong> de {RESOURCES.length} recursos
          </span>
          {results.length !== RESOURCES.length ? (
            <button type="button" className="tk-link-btn" onClick={reset}>
              Limpiar filtros
            </button>
          ) : null}
        </div>

        <div className="tk-facets">
          <div className="tk-facet" role="group" aria-label="Filtrar por categoría">
            <span className="tk-facet-label">Categoría</span>
            <button
              type="button"
              className="tk-pill"
              aria-pressed={need === "all"}
              onClick={() => {
                capture();
                setNeed("all");
              }}
            >
              Todas <small>{RESOURCES.length}</small>
            </button>
            {CATEGORIES.map((n) => (
              <button
                key={n.id}
                type="button"
                className="tk-pill"
                aria-pressed={need === n.id}
                onClick={() => {
                  capture();
                  setNeed(need === n.id ? "all" : n.id);
                }}
              >
                {n.label} <small>{needCount(n.id)}</small>
              </button>
            ))}
          </div>
          <div className="tk-facet" role="group" aria-label="Filtrar por acceso">
            <span className="tk-facet-label">Acceso</span>
            {ACCESS_KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className="tk-pill"
                aria-pressed={kinds.includes(k.id)}
                onClick={() => {
                  capture();
                  setKinds((ks) => toggle(ks, k.id));
                }}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="tk-facet" role="group" aria-label="Filtrar por idioma">
            <span className="tk-facet-label">Idioma</span>
            {LANG_FILTERS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="tk-pill"
                aria-pressed={langs.includes(l.id)}
                onClick={() => {
                  capture();
                  setLangs((ls) => toggle(ls, l.id));
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div className="tk-facet" role="group" aria-label="Filtrar por nivel">
            <span className="tk-facet-label">Nivel</span>
            {LEVELS.map((l) => (
              <button
                key={l.id}
                type="button"
                className="tk-pill"
                aria-pressed={levels.includes(l.id)}
                title={l.hint}
                onClick={() => {
                  capture();
                  setLevels((ls) => toggle(ls, l.id));
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
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
                <p className="tk-res-use">
                  <strong>Para qué sirve.</strong> {r.use}.
                </p>
                {r.access ? (
                  <p className="tk-res-cond">
                    <strong>Acceso.</strong> {r.access}.
                  </p>
                ) : null}
                <div className="tk-res-foot">
                  <div className="tk-res-badges">
                    <span className="tk-badge-tag" title="Idioma">
                      {r.lang}
                    </span>
                    {r.level ? (
                      <span className="tk-badge-tag" title="Nivel">
                        {r.level}
                      </span>
                    ) : null}
                  </div>
                  <span className="tk-res-links">
                    {r.extra ? (
                      <a className="tk-res-link" href={r.extra.url} target="_blank" rel="noopener noreferrer">
                        {r.extra.label}
                        <IconExternal />
                        <span className="sr-only"> (se abre en una pestaña nueva)</span>
                      </a>
                    ) : null}
                    <a className="tk-res-link" href={r.url} target="_blank" rel="noopener noreferrer">
                      Abrir recurso
                      <IconExternal />
                      <span className="sr-only">: {r.title} (se abre en una pestaña nueva)</span>
                    </a>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="tk-empty">
            <p>No hay recursos con esa combinación de filtros.</p>
            <button type="button" className="tk-ghost" onClick={reset}>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
