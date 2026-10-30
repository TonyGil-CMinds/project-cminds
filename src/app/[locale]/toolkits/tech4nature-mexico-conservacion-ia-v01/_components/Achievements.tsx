"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { stageSlug, toolkitHref } from "../data";
import type { Photo } from "../t4n";
import { useContent, useLocale } from "./i18n";
import { IconArrowRight, IconExternal } from "./icons";

type SheetId = "expansion" | "species" | "bioscanner" | "jaguars";

const NF: Record<Locale, string> = { es: "es-MX", en: "en-US" };
const fmt = (locale: Locale) => (n: number) => n.toLocaleString(NF[locale]);

const RISK: Record<Locale, Record<string, string>> = {
  es: {
    EN: "En peligro (UICN)",
    VU: "Vulnerable (UICN)",
    NT: "Casi amenazada (UICN)",
    DD: "Datos insuficientes (UICN)",
    LC: "Preocupación menor (UICN)",
  },
  en: {
    EN: "Endangered (IUCN)",
    VU: "Vulnerable (IUCN)",
    NT: "Near threatened (IUCN)",
    DD: "Data deficient (IUCN)",
    LC: "Least concern (IUCN)",
  },
};
const NOM: Record<Locale, Record<string, string>> = {
  es: {
    P: "En peligro de extinción (NOM-059)",
    A: "Amenazada (NOM-059)",
    Pr: "Sujeta a protección especial (NOM-059)",
  },
  en: {
    P: "In danger of extinction (NOM-059)",
    A: "Threatened (NOM-059)",
    Pr: "Subject to special protection (NOM-059)",
  },
};

/** Grupos taxonómicos: el valor es el de los datos (en español); la etiqueta cambia por idioma. */
const CLASS_LABEL: Record<Locale, Record<string, string>> = {
  es: {},
  en: { Todas: "All", Aves: "Birds", Mamíferos: "Mammals", Reptiles: "Reptiles", Anfibios: "Amphibians", Insectos: "Insects" },
};

const L = {
  es: {
    iucn: "UICN ",
    endemic: " · endémica",
    prevPhoto: "Foto anterior",
    nextPhoto: "Foto siguiente",
    viewPhoto: (k: number, c: string) => `Ver foto ${k}: ${c}`,
    lists: "Listas de especies",
    p1Count: "146 especies",
    p1Sub: "Fase 1 · cámaras trampa y acústica",
    bsCount: "84 registros",
    bsSub: "BioScanner · solo cámaras trampa",
    search: "Buscar especie",
    searchPh: "Buscar por nombre común o científico",
    filter: "Filtrar por grupo",
    atRisk: "En riesgo",
    species: "especies",
    records: "registros",
    of: "de",
    domestic: "Doméstica",
    review: "Por revisar",
    isNew: "Nueva frente a fase 1",
    events: "eventos",
    sources: "Fuentes",
    riskNote: "Categorías de riesgo según la NOM-059-SEMARNAT-2010 y la Lista Roja de la UICN.",
    before: "antes de 2024",
    today: "hoy",
    decree: "Leer el acuerdo oficial",
    jaguarPhotos: "Fotos de jaguares",
    files: (p: string, v: string) => `archivos analizados: ${p} fotos y ${v} videos`,
    empty: (n: string) => `vacíos que el modelo descartó solo (${n})`,
    evs: "eventos independientes de fauna",
    taxa: (w: number) => `taxones registrados: ${w} especies silvestres, 4 domésticas y 4 por revisar`,
    stations: "estaciones de cámara trampa",
    camDays: "días-cámara de esfuerzo de muestreo",
    whatBs: "Lo que hace BioScanner",
    looks: "Así se ve un registro analizado",
    bsExamples: "Ejemplos de detecciones de BioScanner",
    howUse: "Cómo usarlo en tu proyecto",
    tExpansion: "La Reserva Estatal de Dzilam creció 51 %",
    tSpecies: "Especies registradas en Dzilam",
    tJaguars: "Los jaguares de Dzilam",
    cExpansion: "La Reserva Estatal de Dzilam creció de 69,000 a 104,304 hectáreas en 2024, con estudios de Tech4Nature México en la fundamentación del acuerdo oficial.",
    aExpansion: "Ver el acuerdo",
    cSpecies: "especies registradas con cámaras trampa y acústica en la fase 1; 40 en alguna categoría de riesgo",
    aSpecies: "Ver el listado",
    cBs: "fotos y videos analizados en BioScanner, la plataforma de IA que nació del proyecto",
    aBs: "Conocer BioScanner",
    cJaguars: "individuos de jaguar identificados a través de los años",
    nJaguars: "Catálogo en verificación",
    aJaguars: "Ver fotos",
    cKm: "entre dos registros del mismo jaguar, de Dzilam hacia Ría Lagartos",
    aKm: "Ver en el mapa",
    cGl: "reservas con autoevaluación para la Lista Verde de la UICN: Dzilam y Ría Lagartos",
    aGl: "Cómo lo hicimos",
    close: "Cerrar",
  },
  en: {
    iucn: "IUCN ",
    endemic: " · endemic",
    prevPhoto: "Previous photo",
    nextPhoto: "Next photo",
    viewPhoto: (k: number, c: string) => `View photo ${k}: ${c}`,
    lists: "Species lists",
    p1Count: "146 species",
    p1Sub: "Phase 1 · camera traps and acoustics",
    bsCount: "84 records",
    bsSub: "BioScanner · camera traps only",
    search: "Search species",
    searchPh: "Search by common or scientific name",
    filter: "Filter by group",
    atRisk: "At risk",
    species: "species",
    records: "records",
    of: "of",
    domestic: "Domestic",
    review: "Under review",
    isNew: "New compared with phase 1",
    events: "events",
    sources: "Sources",
    riskNote: "Risk categories follow NOM-059-SEMARNAT-2010 and the IUCN Red List.",
    before: "before 2024",
    today: "today",
    decree: "Read the official agreement",
    jaguarPhotos: "Jaguar photos",
    files: (p: string, v: string) => `files analyzed: ${p} photos and ${v} videos`,
    empty: (n: string) => `empty files the model discarded on its own (${n})`,
    evs: "independent wildlife events",
    taxa: (w: number) => `taxa recorded: ${w} wild species, 4 domestic and 4 under review`,
    stations: "camera trap stations",
    camDays: "camera-days of sampling effort",
    whatBs: "What BioScanner does",
    looks: "What an analyzed record looks like",
    bsExamples: "Examples of BioScanner detections",
    howUse: "How to use it in your project",
    tExpansion: "The Dzilam State Reserve grew 51%",
    tSpecies: "Species recorded in Dzilam",
    tJaguars: "The jaguars of Dzilam",
    cExpansion: "The Dzilam State Reserve grew from 69,000 to 104,304 hectares in 2024, with Tech4Nature Mexico studies supporting the official agreement.",
    aExpansion: "See the agreement",
    cSpecies: "species recorded with camera traps and acoustics in phase 1; 40 in a risk category",
    aSpecies: "See the list",
    cBs: "photos and videos analyzed in BioScanner, the AI platform that grew out of the project",
    aBs: "Discover BioScanner",
    cJaguars: "individual jaguars identified over the years",
    nJaguars: "Catalog under verification",
    aJaguars: "See photos",
    cKm: "between two records of the same jaguar, from Dzilam toward Ría Lagartos",
    aKm: "See on the map",
    cGl: "reserves with a self-assessment for the IUCN Green List: Dzilam and Ría Lagartos",
    aGl: "How we did it",
    close: "Close",
  },
} satisfies Record<Locale, Record<string, string | ((...a: never[]) => string)>>;

function Badge({ code, kind }: { code: string; kind: "uicn" | "nom" }) {
  const locale = useLocale();
  const l = L[locale];
  if (!code || (kind === "uicn" && code === "LC")) return null;
  const label = kind === "uicn" ? RISK[locale][code] ?? code : NOM[locale][code.split(" ")[0]] ?? `NOM-059: ${code}`;
  return (
    <span className={`tk-sp-badge tk-sp-badge--${kind}`} title={label}>
      {kind === "nom" ? "NOM " : l.iucn}
      {code.replace(" end.", l.endemic)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Visor de fotos: imagen grande y miniaturas

function Viewer({ photos, label }: { photos: Photo[]; label: string }) {
  const l = L[useLocale()];
  const [i, setI] = useState(0);
  const p = photos[i];
  return (
    <div className="tk-viewer" aria-label={label} role="group">
      <figure className="tk-viewer-main">
        <img src={p.src} alt={p.alt} width={1280} height={720} decoding="async" />
        <figcaption>
          {p.caption}
          <span>
            {i + 1} / {photos.length}
          </span>
        </figcaption>
        <button type="button" className="tk-viewer-nav tk-viewer-nav--prev" aria-label={l.prevPhoto} onClick={() => setI((i - 1 + photos.length) % photos.length)}>
          ‹
        </button>
        <button type="button" className="tk-viewer-nav tk-viewer-nav--next" aria-label={l.nextPhoto} onClick={() => setI((i + 1) % photos.length)}>
          ›
        </button>
      </figure>
      <ul className="tk-viewer-thumbs">
        {photos.map((ph, k) => (
          <li key={ph.src}>
            <button type="button" aria-label={l.viewPhoto(k + 1, ph.caption)} aria-current={k === i ? "true" : undefined} onClick={() => setI(k)}>
              <img src={ph.src} alt="" loading="lazy" decoding="async" width={160} height={90} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Listado de especies

const CLASSES = ["Todas", "Aves", "Mamíferos", "Reptiles", "Anfibios", "Insectos"];

function SpeciesList() {
  const locale = useLocale();
  const l = L[locale];
  const nf = fmt(locale);
  const { SPECIES_BS, SPECIES_P1, SPECIES_PANEL } = useContent();
  const [tab, setTab] = useState<"p1" | "bs">("p1");
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("Todas");
  const [risk, setRisk] = useState(false);

  const rows = useMemo(() => {
    const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const nq = norm(q.trim());
    const base =
      tab === "p1"
        ? SPECIES_P1.map(([sci, es, c, nom, uicn]) => ({ sci, es, c, nom, uicn, ev: 0, flag: "", note: "", inP1: true }))
        : SPECIES_BS.map(([sci, es, c, nom, uicn, ev, , flag, note, inP1]) => ({ sci, es, c, nom, uicn, ev, flag, note, inP1 }));
    return base
      .filter((r) => cls === "Todas" || r.c === cls)
      .filter((r) => !risk || (r.uicn && r.uicn !== "LC" && r.uicn !== "DD") || /^(P|A|Pr)\b/.test(r.nom))
      .filter((r) => !nq || norm(`${r.es} ${r.sci}`).includes(nq));
  }, [tab, q, cls, risk, SPECIES_P1, SPECIES_BS]);

  const total = tab === "p1" ? SPECIES_P1.length : SPECIES_BS.length;
  const present = new Set((tab === "p1" ? SPECIES_P1 : SPECIES_BS).map((r) => r[2]));

  return (
    <div className="tk-sp">
      <div className="tk-sp-tabs" role="tablist" aria-label={l.lists}>
        <button type="button" role="tab" aria-selected={tab === "p1"} onClick={() => setTab("p1")}>
          <strong>{l.p1Count}</strong>
          <span>{l.p1Sub}</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "bs"} onClick={() => setTab("bs")}>
          <strong>{l.bsCount}</strong>
          <span>{l.bsSub}</span>
        </button>
      </div>

      <div className="tk-sp-note">
        <strong>{SPECIES_PANEL.lead}</strong>
        {SPECIES_PANEL.note.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </div>

      <div className="tk-sp-tools">
        <label className="tk-sp-search">
          <span className="tk-sr">{l.search}</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={l.searchPh} />
        </label>
        <div className="tk-sp-filters" role="group" aria-label={l.filter}>
          {CLASSES.filter((c) => c === "Todas" || present.has(c)).map((c) => (
            <button key={c} type="button" aria-pressed={cls === c} onClick={() => setCls(c)}>
              {CLASS_LABEL[locale][c] ?? c}
            </button>
          ))}
          <button type="button" aria-pressed={risk} onClick={() => setRisk((v) => !v)}>
            {l.atRisk}
          </button>
        </div>
      </div>

      <p className="tk-sp-count" aria-live="polite">
        {rows.length === total ? `${total} ${tab === "p1" ? l.species : l.records}` : `${rows.length} ${l.of} ${total}`}
      </p>

      <ul className="tk-sp-list">
        {rows.map((r) => (
          <li key={r.sci} data-flag={r.flag || undefined}>
            <div className="tk-sp-name">
              <strong>{r.es}</strong>
              <em>{r.sci}</em>
              {r.note ? <small>{r.note}</small> : null}
            </div>
            <div className="tk-sp-meta">
              {r.flag === "domestica" ? <span className="tk-sp-badge">{l.domestic}</span> : null}
              {r.flag === "revisar" ? <span className="tk-sp-badge tk-sp-badge--warn">{l.review}</span> : null}
              {tab === "bs" && !r.inP1 && !r.flag ? <span className="tk-sp-badge tk-sp-badge--new">{l.isNew}</span> : null}
              <Badge code={r.uicn} kind="uicn" />
              <Badge code={r.nom.replace("subsp.", "").trim()} kind="nom" />
              {tab === "bs" ? <span className="tk-sp-ev">{nf(r.ev)} {l.events}</span> : null}
              <span className="tk-sp-class">{CLASS_LABEL[locale][r.c] ?? r.c}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="tk-sheet-source">
        {l.sources}: {SPECIES_PANEL.sources.map((s) => s.label).join("; ")}. {l.riskNote}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contenido de cada panel

function SheetBody({ id }: { id: SheetId }) {
  const locale = useLocale();
  const l = L[locale];
  const nf = fmt(locale);
  const { BIOSCANNER_PANEL, BIOSCANNER_PHOTOS, BIOSCANNER_REPORT, EXPANSION, JAGUAR_PANEL, JAGUAR_PHOTOS, STAGES } = useContent();
  if (id === "expansion") {
    const pct = Math.round((EXPANSION.before / EXPANSION.after) * 100);
    return (
      <>
        <div className="tk-exp">
          <div className="tk-exp-bar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
          <div className="tk-exp-legend">
            <span>
              <strong>{nf(EXPANSION.before)} ha</strong> {l.before}
            </span>
            <span>
              <strong>{nf(EXPANSION.after)} ha</strong> {l.today}
            </span>
          </div>
        </div>
        {EXPANSION.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <a className="tk-cta" href={EXPANSION.decree.url} target="_blank" rel="noopener noreferrer">
          {l.decree}
          <IconExternal />
        </a>
        <p className="tk-sheet-source">{EXPANSION.decree.label}.</p>
      </>
    );
  }
  if (id === "species") return <SpeciesList />;
  if (id === "jaguars") {
    return (
      <>
        <p>{JAGUAR_PANEL.lead}</p>
        <Viewer photos={JAGUAR_PHOTOS} label={l.jaguarPhotos} />
        <ul className="tk-list">
          {JAGUAR_PANEL.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="tk-sheet-source">{JAGUAR_PANEL.care}</p>
      </>
    );
  }
  const r = BIOSCANNER_REPORT;
  const stats: [string, string][] = [
    [nf(r.files), l.files(nf(r.photos), nf(r.videos))],
    [r.emptyShare, l.empty(nf(r.empty))],
    [nf(r.events), l.evs],
    [String(r.species), l.taxa(r.wild)],
    [String(r.stations), l.stations],
    [nf(r.cameraDays), l.camDays],
  ];
  return (
    <>
      <img className="tk-sheet-logo" src="/bioscanner/logo-bioscanner.svg" alt="BioScanner" width={160} height={40} />
      <p>{BIOSCANNER_PANEL.lead}</p>
      <ul className="tk-sheet-stats">
        {stats.map(([v, l]) => (
          <li key={l}>
            <strong>{v}</strong>
            <span>{l}</span>
          </li>
        ))}
      </ul>
      <p className="tk-sheet-source">{BIOSCANNER_PANEL.reportNote}</p>
      <h3 className="tk-h3">{l.whatBs}</h3>
      <dl className="tk-sheet-caps">
        {BIOSCANNER_PANEL.capabilities.map((c) => (
          <div key={c.title}>
            <dt>{c.title}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>
      <h3 className="tk-h3">{l.looks}</h3>
      <Viewer photos={BIOSCANNER_PHOTOS} label={l.bsExamples} />
      <div className="tk-sheet-actions">
        <a className="tk-cta" href={BIOSCANNER_PANEL.cta.url} target="_blank" rel="noopener noreferrer">
          {BIOSCANNER_PANEL.cta.label}
          <IconExternal />
        </a>
        <a className="tk-ghost" href={toolkitHref(locale, stageSlug(STAGES[2]))}>
          {l.howUse}
        </a>
      </div>
    </>
  );
}

const titles = (l: (typeof L)[Locale]): Record<SheetId, string> => ({
  expansion: l.tExpansion,
  species: l.tSpecies,
  bioscanner: "BioScanner",
  jaguars: l.tJaguars,
});

// ---------------------------------------------------------------------------
// Tarjetas de logros

type Card = { id: string; value: string; label: string; note?: string; sheet?: SheetId; href?: string; cta?: string; wide?: boolean };

export default function Achievements(props: { locale?: Locale }) {
  const ctxLocale = useLocale();
  const locale = props.locale ?? ctxLocale;
  const l = L[locale];
  const nf = fmt(locale);
  const { BIOSCANNER_REPORT, EXPANSION } = useContent();
  const [open, setOpen] = useState<SheetId | null>(null);
  const ref = useRef<HTMLDialogElement>(null);
  const last = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const show = (id: SheetId, el: HTMLElement) => {
    last.current = el;
    setOpen(id);
  };
  const close = () => {
    setOpen(null);
    last.current?.focus();
  };

  const cards: Card[] = [
    {
      id: "expansion",
      value: `${nf(EXPANSION.after)} ha`,
      label: l.cExpansion,
      sheet: "expansion",
      cta: l.aExpansion,
      wide: true,
    },
    { id: "species", value: "146", label: l.cSpecies, sheet: "species", cta: l.aSpecies },
    { id: "bioscanner", value: nf(BIOSCANNER_REPORT.files), label: l.cBs, sheet: "bioscanner", cta: l.aBs },
    { id: "jaguars", value: "16", label: l.cJaguars, note: l.nJaguars, sheet: "jaguars", cta: l.aJaguars },
    { id: "km", value: "~40 km", label: l.cKm, href: "#area-de-impacto", cta: l.aKm },
    { id: "gl", value: "2", label: l.cGl, href: toolkitHref(locale, "lista-verde-uicn"), cta: l.aGl },
  ];

  return (
    <>
      <ul className="tk-wins">
        {cards.map((c) => {
          const body: ReactNode = (
            <>
              <span className="tk-win-num">{c.value}</span>
              <span className="tk-win-label">{c.label}</span>
              {c.note ? <span className="tk-kpi-note">{c.note}</span> : null}
              {c.cta ? (
                <span className="tk-win-cta">
                  {c.cta} <IconArrowRight />
                </span>
              ) : null}
            </>
          );
          return (
            <li key={c.id} className={`tk-win${c.wide ? " tk-win--wide" : ""}`} data-reveal>
              {c.sheet ? (
                <button type="button" className="tk-win-btn" aria-haspopup="dialog" onClick={(e) => show(c.sheet!, e.currentTarget)}>
                  {body}
                </button>
              ) : c.href ? (
                <a className="tk-win-btn" href={c.href}>
                  {body}
                </a>
              ) : (
                <div className="tk-win-btn tk-win-btn--static">{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      <dialog ref={ref} className="tk-sheet" aria-labelledby="tk-sheet-title" onClose={close} onClick={(e) => e.target === ref.current && close()}>
        {open ? (
          <div className="tk-sheet-inner">
            <header className="tk-sheet-head">
              <h2 id="tk-sheet-title">{titles(l)[open]}</h2>
              <button type="button" className="tk-sheet-close" aria-label={l.close} onClick={close}>
                ×
              </button>
            </header>
            <div className="tk-sheet-body">
              <SheetBody id={open} />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
