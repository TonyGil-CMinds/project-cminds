import { WHY } from "../data";

const nf = (n: number) => n.toLocaleString("en-US");

function Card({ title, source, meaning, wide, children }: { title: string; source: string; meaning: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <figure className={`tk-chart${wide ? " tk-chart--wide" : ""}`} data-reveal>
      <h3 className="tk-chart-title">{title}</h3>
      {children}
      <p className="tk-chart-meaning">
        <strong>Para tu proyecto:</strong> {meaning}
      </p>
      <figcaption className="tk-chart-source">Fuente: {source}</figcaption>
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
function Split({ part, total, partLabel, restLabel }: { part: number; total: number; partLabel: string; restLabel: string }) {
  const pct = Math.round((part / total) * 100);
  return (
    <div className="tk-split">
      <div className="tk-split-bar" role="img" aria-label={`${partLabel}: ${pct} %. ${restLabel}: ${100 - pct} %.`}>
        <span className="tk-split-part" style={{ width: `${pct}%` }}>
          {pct} %
        </span>
        <span className="tk-split-rest">{100 - pct} %</span>
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
export default function WhyCharts() {
  const { planet, lpr, jaguar, empty, connectivity } = WHY;
  const crossed = planet.boundaries.filter((b) => b.crossed).length;
  return (
    <div className="tk-charts">
      <Card title={planet.title} source={planet.source} meaning={planet.meaning} wide>
        <div className="tk-phc">
          <p className="tk-phc-big">
            <strong>{crossed}</strong> de {planet.boundaries.length}
            <span>límites planetarios transgredidos</span>
          </p>
          <ul className="tk-phc-grid">
            {planet.boundaries.map((b) => (
              <li key={b.name} className={`${b.crossed ? "is-crossed" : "is-safe"}${b.focus ? " is-focus" : ""}`}>
                <span>{b.name}</span>
                <small>{b.crossed ? "Transgredido" : "Dentro del límite"}</small>
              </li>
            ))}
          </ul>
        </div>
        <p className="tk-chart-text">{planet.text}</p>
      </Card>

      <Card title={lpr.title} source={lpr.source} meaning={lpr.meaning}>
        <ul className="tk-hbars" aria-label="Cambio promedio en las poblaciones de vertebrados monitoreadas por región">
          {lpr.regions.map((r) => (
            <Bar key={r.name} name={r.name} value={r.value} label={`−${r.value} %`} focus={r.focus} />
          ))}
        </ul>
      </Card>

      <Card title={jaguar.title} source={jaguar.source} meaning={jaguar.meaning}>
        <Split
          part={jaguar.peninsula}
          total={jaguar.total}
          partLabel={`Península de Yucatán: ${nf(jaguar.peninsula)}`}
          restLabel={`Resto de México: ${nf(jaguar.total - jaguar.peninsula)}`}
        />
        <p className="tk-chart-text">
          {nf(jaguar.total)} jaguares estimados en México. {jaguar.text}
        </p>
      </Card>

      <Card title={empty.title} source={empty.source} meaning={empty.meaning}>
        <Split
          part={empty.empty}
          total={empty.total}
          partLabel={`Archivos vacíos: ${nf(empty.empty)}`}
          restLabel={`Con animales: ${nf(empty.total - empty.empty)}`}
        />
        <p className="tk-chart-text">{empty.text}</p>
      </Card>

      <Card title={connectivity.title} source={connectivity.source} meaning={connectivity.meaning}>
        <ul className="tk-hbars" aria-label="Población con conectividad significativa">
          {connectivity.bars.map((b) => (
            <Bar key={b.name} name={b.name} value={b.value} label={`${b.value} %`} focus={b.focus} />
          ))}
        </ul>
      </Card>
    </div>
  );
}
