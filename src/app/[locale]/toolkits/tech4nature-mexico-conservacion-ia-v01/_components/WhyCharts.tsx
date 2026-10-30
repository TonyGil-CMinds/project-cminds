import type { Locale } from "@/i18n/config";
import { getContent } from "../content";

const nf = (n: number) => n.toLocaleString("en-US");

const L = {
  es: {
    forProject: "Para tu proyecto:",
    source: "Fuente:",
    of: "de",
    crossed: "límites planetarios transgredidos",
    isCrossed: "Transgredido",
    isSafe: "Dentro del límite",
    lprAria: "Cambio promedio en las poblaciones de vertebrados monitoreadas por región",
    peninsula: "Península de Yucatán",
    rest: "Resto de México",
    jaguars: "jaguares estimados en México.",
    empty: "Archivos vacíos",
    animals: "Con animales",
    connAria: "Población con conectividad significativa",
    pct: " %",
  },
  en: {
    forProject: "For your project:",
    source: "Source:",
    of: "of",
    crossed: "planetary boundaries crossed",
    isCrossed: "Crossed",
    isSafe: "Within the boundary",
    lprAria: "Average change in monitored vertebrate populations by region",
    peninsula: "Yucatán Peninsula",
    rest: "Rest of Mexico",
    jaguars: "jaguars estimated in Mexico.",
    empty: "Empty files",
    animals: "With animals",
    connAria: "Population with significant connectivity",
    pct: "%",
  },
} satisfies Record<Locale, Record<string, string>>;
type Strings = (typeof L)[Locale];

function Card({ title, source, meaning, wide, l, children }: { title: string; source: string; meaning: string; wide?: boolean; l: Strings; children: React.ReactNode }) {
  return (
    <figure className={`tk-chart${wide ? " tk-chart--wide" : ""}`} data-reveal>
      <h3 className="tk-chart-title">{title}</h3>
      {children}
      <p className="tk-chart-meaning">
        <strong>{l.forProject}</strong> {meaning}
      </p>
      <figcaption className="tk-chart-source">
        {l.source} {source}
      </figcaption>
    </figure>
  );
}

/** Barra horizontal con su etiqueta y valor. */
function Bar({ name, value, label, focus }: { name: string; value: number; label: string; focus?: boolean }) {
  return (
    <li className={`tk-hbar${focus ? " is-focus" : ""}`}>
      <span className="tk-hbar-name">{name}</span>
      <span className="tk-hbar-track" aria-hidden="true">
        <span className="tk-hbar-fill" style={{ width: `${value}%` }} />
      </span>
      <span className="tk-hbar-val">{label}</span>
    </li>
  );
}

/** Proporción en una sola barra apilada. */
function Split({ part, total, partLabel, restLabel, l }: { part: number; total: number; partLabel: string; restLabel: string; l: Strings }) {
  const pct = Math.round((part / total) * 100);
  const u = l.pct;
  return (
    <div className="tk-split">
      <div className="tk-split-bar" role="img" aria-label={`${partLabel}: ${pct}${u}. ${restLabel}: ${100 - pct}${u}.`}>
        <span className="tk-split-part" style={{ width: `${pct}%` }}>
          {pct}
          {u}
        </span>
        <span className="tk-split-rest">
          {100 - pct}
          {u}
        </span>
      </div>
      <div className="tk-split-legend">
        <span>
          <i className="tk-dot tk-dot--part" /> {partLabel}
        </span>
        <span>
          <i className="tk-dot" /> {restLabel}
        </span>
      </div>
    </div>
  );
}

/** Gráficas de «Por qué importa». */
export default function WhyCharts({ locale = "es" }: { locale?: Locale }) {
  const { WHY } = getContent(locale);
  const l = L[locale];
  const { planet, lpr, jaguar, empty, connectivity } = WHY;
  const crossed = planet.boundaries.filter((b) => b.crossed).length;
  return (
    <div className="tk-charts">
      <Card title={planet.title} source={planet.source} meaning={planet.meaning} l={l} wide>
        <div className="tk-phc">
          <p className="tk-phc-big">
            <strong>{crossed}</strong> {l.of} {planet.boundaries.length}
            <span>{l.crossed}</span>
          </p>
          <ul className="tk-phc-grid">
            {planet.boundaries.map((b) => (
              <li key={b.name} className={`${b.crossed ? "is-crossed" : "is-safe"}${b.focus ? " is-focus" : ""}`}>
                <span>{b.name}</span>
                <small>{b.crossed ? l.isCrossed : l.isSafe}</small>
              </li>
            ))}
          </ul>
        </div>
        <p className="tk-chart-text">{planet.text}</p>
      </Card>

      <Card title={lpr.title} source={lpr.source} meaning={lpr.meaning} l={l}>
        <ul className="tk-hbars" aria-label={l.lprAria}>
          {lpr.regions.map((r) => (
            <Bar key={r.name} name={r.name} value={r.value} label={`−${r.value}${l.pct}`} focus={r.focus} />
          ))}
        </ul>
      </Card>

      <Card title={jaguar.title} source={jaguar.source} meaning={jaguar.meaning} l={l}>
        <Split
          part={jaguar.peninsula}
          total={jaguar.total}
          partLabel={`${l.peninsula}: ${nf(jaguar.peninsula)}`}
          restLabel={`${l.rest}: ${nf(jaguar.total - jaguar.peninsula)}`}
          l={l}
        />
        <p className="tk-chart-text">
          {nf(jaguar.total)} {l.jaguars} {jaguar.text}
        </p>
      </Card>

      <Card title={empty.title} source={empty.source} meaning={empty.meaning} l={l}>
        <Split
          part={empty.empty}
          total={empty.total}
          partLabel={`${l.empty}: ${nf(empty.empty)}`}
          restLabel={`${l.animals}: ${nf(empty.total - empty.empty)}`}
          l={l}
        />
        <p className="tk-chart-text">{empty.text}</p>
      </Card>

      <Card title={connectivity.title} source={connectivity.source} meaning={connectivity.meaning} l={l}>
        <ul className="tk-hbars" aria-label={l.connAria}>
          {connectivity.bars.map((b) => (
            <Bar key={b.name} name={b.name} value={b.value} label={`${b.value}${l.pct}`} focus={b.focus} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
