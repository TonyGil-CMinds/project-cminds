"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { STAGES, stageSlug, toolkitHref } from "../data";
import {
  BIOSCANNER_PANEL,
  BIOSCANNER_PHOTOS,
  BIOSCANNER_REPORT,
  EXPANSION,
  JAGUAR_PANEL,
  JAGUAR_PHOTOS,
  SPECIES_BS,
  SPECIES_P1,
  SPECIES_PANEL,
  type Photo,
} from "../t4n";
import { IconArrowRight, IconExternal } from "./icons";

type SheetId = "expansion" | "species" | "bioscanner" | "jaguars";

const nf = (n: number) => n.toLocaleString("es-MX");

const RISK: Record<string, string> = {
  EN: "En peligro (UICN)",
  VU: "Vulnerable (UICN)",
  NT: "Casi amenazada (UICN)",
  DD: "Datos insuficientes (UICN)",
  LC: "Preocupación menor (UICN)",
};
const NOM: Record<string, string> = {
  P: "En peligro de extinción (NOM-059)",
  A: "Amenazada (NOM-059)",
  Pr: "Sujeta a protección especial (NOM-059)",
};

function Badge({ code, kind }: { code: string; kind: "uicn" | "nom" }) {
  if (!code || (kind === "uicn" && code === "LC")) return null;
  const label = kind === "uicn" ? RISK[code] ?? code : NOM[code.split(" ")[0]] ?? `NOM-059: ${code}`;
  return (
    <span className={`tk-sp-badge tk-sp-badge--${kind}`} title={label}>
      {kind === "nom" ? "NOM " : "UICN "}
      {code.replace(" end.", " · endémica")}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Visor de fotos: imagen grande y miniaturas

function Viewer({ photos, label }: { photos: Photo[]; label: string }) {
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
        <button type="button" className="tk-viewer-nav tk-viewer-nav--prev" aria-label="Foto anterior" onClick={() => setI((i - 1 + photos.length) % photos.length)}>
          ‹
        </button>
        <button type="button" className="tk-viewer-nav tk-viewer-nav--next" aria-label="Foto siguiente" onClick={() => setI((i + 1) % photos.length)}>
          ›
        </button>
      </figure>
      <ul className="tk-viewer-thumbs">
        {photos.map((ph, k) => (
          <li key={ph.src}>
            <button type="button" aria-label={`Ver foto ${k + 1}: ${ph.caption}`} aria-current={k === i ? "true" : undefined} onClick={() => setI(k)}>
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
  }, [tab, q, cls, risk]);

  const total = tab === "p1" ? SPECIES_P1.length : SPECIES_BS.length;
  const present = new Set((tab === "p1" ? SPECIES_P1 : SPECIES_BS).map((r) => r[2]));

  return (
    <div className="tk-sp">
      <div className="tk-sp-tabs" role="tablist" aria-label="Listas de especies">
        <button type="button" role="tab" aria-selected={tab === "p1"} onClick={() => setTab("p1")}>
          <strong>146 especies</strong>
          <span>Fase 1 · cámaras trampa y acústica</span>
        </button>
        <button type="button" role="tab" aria-selected={tab === "bs"} onClick={() => setTab("bs")}>
          <strong>84 registros</strong>
          <span>BioScanner · solo cámaras trampa</span>
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
          <span className="tk-sr">Buscar especie</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre común o científico" />
        </label>
        <div className="tk-sp-filters" role="group" aria-label="Filtrar por grupo">
          {CLASSES.filter((c) => c === "Todas" || present.has(c)).map((c) => (
            <button key={c} type="button" aria-pressed={cls === c} onClick={() => setCls(c)}>
              {c}
            </button>
          ))}
          <button type="button" aria-pressed={risk} onClick={() => setRisk((v) => !v)}>
            En riesgo
          </button>
        </div>
      </div>

      <p className="tk-sp-count" aria-live="polite">
        {rows.length === total ? `${total} ${tab === "p1" ? "especies" : "registros"}` : `${rows.length} de ${total}`}
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
              {r.flag === "domestica" ? <span className="tk-sp-badge">Doméstica</span> : null}
              {r.flag === "revisar" ? <span className="tk-sp-badge tk-sp-badge--warn">Por revisar</span> : null}
              {tab === "bs" && !r.inP1 && !r.flag ? <span className="tk-sp-badge tk-sp-badge--new">Nueva frente a fase 1</span> : null}
              <Badge code={r.uicn} kind="uicn" />
              <Badge code={r.nom.replace("subsp.", "").trim()} kind="nom" />
              {tab === "bs" ? <span className="tk-sp-ev">{nf(r.ev)} eventos</span> : null}
              <span className="tk-sp-class">{r.c}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="tk-sheet-source">
        Fuentes: {SPECIES_PANEL.sources.map((s) => s.label).join("; ")}. Categorías de riesgo según la NOM-059-SEMARNAT-2010 y la Lista Roja de la UICN.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contenido de cada panel

function SheetBody({ id, locale }: { id: SheetId; locale: string }) {
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
              <strong>{nf(EXPANSION.before)} ha</strong> antes de 2024
            </span>
            <span>
              <strong>{nf(EXPANSION.after)} ha</strong> hoy
            </span>
          </div>
        </div>
        {EXPANSION.paragraphs.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <a className="tk-cta" href={EXPANSION.decree.url} target="_blank" rel="noopener noreferrer">
          Leer el acuerdo oficial
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
        <Viewer photos={JAGUAR_PHOTOS} label="Fotos de jaguares" />
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
    [nf(r.files), `archivos analizados: ${nf(r.photos)} fotos y ${nf(r.videos)} videos`],
    [r.emptyShare, `vacíos que el modelo descartó solo (${nf(r.empty)})`],
    [nf(r.events), "eventos independientes de fauna"],
    [String(r.species), `taxones registrados: ${r.wild} especies silvestres, 4 domésticas y 4 por revisar`],
    [String(r.stations), "estaciones de cámara trampa"],
    [nf(r.cameraDays), "días-cámara de esfuerzo de muestreo"],
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
      <h3 className="tk-h3">Lo que hace BioScanner</h3>
      <dl className="tk-sheet-caps">
        {BIOSCANNER_PANEL.capabilities.map((c) => (
          <div key={c.title}>
            <dt>{c.title}</dt>
            <dd>{c.text}</dd>
          </div>
        ))}
      </dl>
      <h3 className="tk-h3">Así se ve un registro analizado</h3>
      <Viewer photos={BIOSCANNER_PHOTOS} label="Ejemplos de detecciones de BioScanner" />
      <div className="tk-sheet-actions">
        <a className="tk-cta" href={BIOSCANNER_PANEL.cta.url} target="_blank" rel="noopener noreferrer">
          {BIOSCANNER_PANEL.cta.label}
          <IconExternal />
        </a>
        <a className="tk-ghost" href={toolkitHref(locale, stageSlug(STAGES[2]))}>
          Cómo usarlo en tu proyecto
        </a>
      </div>
    </>
  );
}

const TITLES: Record<SheetId, string> = {
  expansion: "La Reserva Estatal de Dzilam creció 51 %",
  species: "Especies registradas en Dzilam",
  bioscanner: "BioScanner",
  jaguars: "Los jaguares de Dzilam",
};

// ---------------------------------------------------------------------------
// Tarjetas de logros

type Card = { id: string; value: string; label: string; note?: string; sheet?: SheetId; href?: string; cta?: string; wide?: boolean };

export default function Achievements({ locale }: { locale: string }) {
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
      label: "La Reserva Estatal de Dzilam creció de 69,000 a 104,304 hectáreas en 2024, con estudios de Tech4Nature México en la fundamentación del acuerdo oficial.",
      sheet: "expansion",
      cta: "Ver el acuerdo",
      wide: true,
    },
    { id: "species", value: "146", label: "especies registradas con cámaras trampa y acústica en la fase 1; 40 en alguna categoría de riesgo", sheet: "species", cta: "Ver el listado" },
    { id: "bioscanner", value: nf(BIOSCANNER_REPORT.files), label: "fotos y videos analizados en BioScanner, la plataforma de IA que nació del proyecto", sheet: "bioscanner", cta: "Conocer BioScanner" },
    { id: "jaguars", value: "16", label: "individuos de jaguar identificados a través de los años", note: "Catálogo en verificación", sheet: "jaguars", cta: "Ver fotos" },
    { id: "km", value: "~40 km", label: "entre dos registros del mismo jaguar, de Dzilam hacia Ría Lagartos", href: "#area-de-impacto", cta: "Ver en el mapa" },
    { id: "gl", value: "2", label: "reservas con autoevaluación para la Lista Verde de la UICN: Dzilam y Ría Lagartos", href: toolkitHref(locale, "lista-verde-uicn"), cta: "Cómo lo hicimos" },
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
              <h2 id="tk-sheet-title">{TITLES[open]}</h2>
              <button type="button" className="tk-sheet-close" aria-label="Cerrar" onClick={close}>
                ×
              </button>
            </header>
            <div className="tk-sheet-body">
              <SheetBody id={open} locale={locale} />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
