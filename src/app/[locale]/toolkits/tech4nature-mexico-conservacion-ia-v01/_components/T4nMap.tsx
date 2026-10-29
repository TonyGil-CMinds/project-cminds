import { MAP_POINTS, MAP_SHAPE } from "../t4n";

/** Mapa esquemático de la península de Yucatán con la zona de trabajo de Tech4Nature México. */
export default function T4nMap() {
  const { W, H, d } = MAP_SHAPE;
  const p = MAP_POINTS;
  const [dx, dy] = p.dzilam;
  const [rx, ry] = p.riolagartos;
  return (
    <figure className="tk-map" data-reveal>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="tk-map-title tk-map-desc">
        <title id="tk-map-title">Zona de trabajo de Tech4Nature México</title>
        <desc id="tk-map-desc">
          Mapa de la península de Yucatán. En la costa norte se señalan la Reserva Estatal de Dzilam, alrededor de Dzilam de Bravo, y la Reserva de la Biosfera Ría Lagartos, hacia el oriente. Un arco une ambas reservas: un mismo jaguar fue registrado en dos sitios a cerca de 40 kilómetros.
        </desc>
        <defs>
          <radialGradient id="tk-map-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--tk-lime)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--tk-lime)" stopOpacity="0" />
          </radialGradient>
          <marker id="tk-map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--tk-lime)" />
          </marker>
        </defs>
        <rect className="tk-map-sea" width={W} height={H} />
        <path className="tk-map-land" d={d} fillRule="evenodd" />
        {/* Zona de trabajo: costa entre Dzilam y Ría Lagartos */}
        <ellipse cx={(dx + rx) / 2 + 30} cy={(dy + ry) / 2 + 22} rx={200} ry={62} fill="url(#tk-map-glow)" transform={`rotate(-14 ${(dx + rx) / 2} ${(dy + ry) / 2})`} />
        <path
          className="tk-map-arc"
          d={`M${dx} ${dy + 8} Q ${(dx + rx) / 2} ${dy + 70} ${rx - 6} ${ry + 10}`}
          fill="none"
          markerEnd="url(#tk-map-arrow)"
        />
        <text className="tk-map-km" x={(dx + rx) / 2} y={dy + 62} textAnchor="middle">
          ~40 km · un mismo jaguar
        </text>
        <g className="tk-map-zone">
          <text x={dx - 18} y={dy + 40} textAnchor="end">
            Reserva Estatal
          </text>
          <text x={dx - 18} y={dy + 60} textAnchor="end">
            de Dzilam
          </text>
          <text x={rx + 90} y={ry + 50} textAnchor="middle">
            Reserva de la Biosfera
          </text>
          <text x={rx + 90} y={ry + 70} textAnchor="middle">
            Ría Lagartos
          </text>
        </g>
        {(
          [
            ["Dzilam de Bravo", p.dzilam, "end", -10, -8],
            ["San Felipe", p.sanfelipe, "end", -8, -10],
            ["Río Lagartos", p.riolagartos, "start", 10, -10],
            ["Mérida", p.merida, "start", 10, 5],
            ["Valladolid", p.valladolid, "start", 10, 5],
            ["Cancún", p.cancun, "end", -10, 5],
          ] as const
        ).map(([name, [x, y], anchor, ox, oy]) => (
          <g key={name} className={name === "Mérida" || name === "Valladolid" || name === "Cancún" ? "tk-map-city" : "tk-map-town"}>
            <circle cx={x} cy={y} r={name === "Dzilam de Bravo" || name === "Río Lagartos" ? 6 : 4} />
            <text x={x + ox} y={y + oy} textAnchor={anchor}>
              {name}
            </text>
          </g>
        ))}
        <text className="tk-map-sea-label" x={130} y={40}>
          Golfo de México
        </text>
        <text className="tk-map-sea-label" x={W - 30} y={H - 30} textAnchor="end">
          Mar Caribe
        </text>
      </svg>
    </figure>
  );
}
