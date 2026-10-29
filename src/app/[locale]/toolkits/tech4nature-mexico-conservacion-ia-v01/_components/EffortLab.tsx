"use client";

import { useId, useState } from "react";
import { EXERCISE } from "../data";
import { IconFlask } from "./icons";

type Campaign = (typeof EXERCISE.campaigns)[number];

const fmt = new Intl.NumberFormat("es-MX", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const pct = new Intl.NumberFormat("es-MX", { style: "percent", maximumFractionDigits: 1 });
const per100 = (events: number, days: number) => (days > 0 ? (events / days) * 100 : 0);

function NumberField({ label, value, onChange, min = 0 }: { label: string; value: number; onChange: (v: number) => void; min?: number }) {
  const id = useId();
  return (
    <div className="tk-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="tk-input"
        type="number"
        inputMode="numeric"
        min={min}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
      />
    </div>
  );
}

/**
 * Laboratorio del ejercicio: índice de detección ajustado por esfuerzo y
 * precisión/sensibilidad de un modelo. Muestra unidades y supuestos, y nunca
 * presenta detecciones como abundancia.
 */
export default function EffortLab() {
  const [tab, setTab] = useState<"esfuerzo" | "modelo">("esfuerzo");
  const [campaigns, setCampaigns] = useState<Campaign[]>(EXERCISE.campaigns.map((c) => ({ ...c })));
  const [model, setModel] = useState(EXERCISE.model);
  const tabsId = useId();

  const set = (i: number, patch: Partial<Campaign>) =>
    setCampaigns((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  const rows = campaigns.map((c) => ({
    ...c,
    rate: per100(c.confirmed, c.effective),
    upper: per100(c.confirmed + c.unresolved, c.effective),
    operation: c.planned > 0 ? c.effective / c.planned : 0,
  }));
  const max = Math.max(...rows.map((r) => r.upper), 0.0001);
  const [a, b] = rows;
  const [higher, lower] = b.rate > a.rate ? [b, a] : [a, b];
  const tie = a.rate === b.rate;
  const effortChange = b.effective !== a.effective;

  const precision = model.tp + model.fp > 0 ? model.tp / (model.tp + model.fp) : 0;
  const sensitivity = model.tp + model.fn > 0 ? model.tp / (model.tp + model.fn) : 0;

  return (
    <div className="tk-lab" data-reveal>
      <div className="tk-lab-head">
        <h3>
          <IconFlask style={{ width: 18, height: 18, verticalAlign: -3, marginRight: 8, color: "var(--tk-sky)" }} />
          Laboratorio de cálculo
        </h3>
        <div className="tk-tabs" role="tablist" aria-label="Herramientas del laboratorio">
          <button
            type="button"
            role="tab"
            id={`${tabsId}-e`}
            aria-controls={`${tabsId}-pe`}
            aria-selected={tab === "esfuerzo"}
            className="tk-tab"
            onClick={() => setTab("esfuerzo")}
          >
            Esfuerzo comparable
          </button>
          <button
            type="button"
            role="tab"
            id={`${tabsId}-m`}
            aria-controls={`${tabsId}-pm`}
            aria-selected={tab === "modelo"}
            className="tk-tab"
            onClick={() => setTab("modelo")}
          >
            Precisión y sensibilidad
          </button>
        </div>
      </div>

      <div className="tk-lab-body" role="tabpanel" id={`${tabsId}-pe`} aria-labelledby={`${tabsId}-e`} hidden={tab !== "esfuerzo"}>
        <div className="tk-lab-grid">
          {rows.map((c, i) => (
            <div key={c.name} className="tk-lab-col">
              <h4>{c.name}</h4>
              <NumberField label="Días cámara planificados" value={c.planned} onChange={(v) => set(i, { planned: v })} />
              <NumberField label="Días cámara efectivos" value={c.effective} onChange={(v) => set(i, { effective: v })} />
              <NumberField label="Eventos confirmados" value={c.confirmed} onChange={(v) => set(i, { confirmed: v })} />
              <NumberField label="Eventos sin identificación resuelta" value={c.unresolved} onChange={(v) => set(i, { unresolved: v })} />
              <div className="tk-out">
                <div className="tk-out-num">{fmt.format(c.rate)}</div>
                <div className="tk-out-label">eventos confirmados por 100 días cámara</div>
                <div className="tk-out-formula">
                  {c.confirmed} ÷ {c.effective} × 100 · operación {pct.format(c.operation)} de lo planificado
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="tk-bars" aria-label="Comparación del índice por campaña">
          {rows.map((r) => (
            <div key={r.name} className="tk-bar-row">
              <span>{r.name}</span>
              <div className="tk-bar-track" role="img" aria-label={`${r.name}: ${fmt.format(r.rate)}; hasta ${fmt.format(r.upper)} si todos los casos sin resolver fueran de la especie`}>
                <div className="tk-bar-range" style={{ width: `${(r.upper / max) * 100}%` }} />
                <div className="tk-bar-fill" style={{ width: `${(r.rate / max) * 100}%` }} />
              </div>
              <span className="tk-bar-val">{fmt.format(r.rate)}</span>
            </div>
          ))}
        </div>
        <div className="tk-bar-legend">
          <span>
            <i style={{ background: "var(--tk-lime)" }} />
            Eventos confirmados
          </span>
          <span>
            <i style={{ background: "rgba(94,193,243,0.35)" }} />
            Máximo si todos los casos sin resolver fueran de la especie (solo como sensibilidad)
          </span>
        </div>

        <p className="tk-lab-note">
          {tie
            ? "Ambas campañas tienen el mismo índice. "
            : `${higher.name} muestra un índice mayor (${fmt.format(higher.rate)} frente a ${fmt.format(lower.rate)}). `}
          {effortChange
            ? `El esfuerzo efectivo cambió de ${a.effective} a ${b.effective} días cámara, así que comparar eventos brutos (${a.confirmed} y ${b.confirmed}) llevaría a otra conclusión. `
            : ""}
          La diferencia descriptiva no basta para afirmar un cambio de abundancia: {b.confirmed} eventos no representan {b.confirmed} individuos.
          Revise fallas por estación e incertidumbre antes de decidir.
        </p>
      </div>

      <div className="tk-lab-body" role="tabpanel" id={`${tabsId}-pm`} aria-labelledby={`${tabsId}-m`} hidden={tab !== "modelo"}>
        <div className="tk-lab-grid">
          <div className="tk-lab-col">
            <h4>Conjunto de prueba</h4>
            <NumberField label="Aciertos (verdaderos positivos)" value={model.tp} onChange={(v) => setModel((m) => ({ ...m, tp: v }))} />
            <NumberField label="Omisiones (falsos negativos)" value={model.fn} onChange={(v) => setModel((m) => ({ ...m, fn: v }))} />
            <NumberField label="Falsas alarmas (falsos positivos)" value={model.fp} onChange={(v) => setModel((m) => ({ ...m, fp: v }))} />
          </div>
          <div className="tk-gauges">
            <div className="tk-lab-col">
              <div className="tk-out-num">{pct.format(precision)}</div>
              <div className="tk-out-label">Precisión: de lo que el modelo marcó, cuánto era correcto</div>
              <div className="tk-out-formula">
                {model.tp} ÷ ({model.tp} + {model.fp})
              </div>
            </div>
            <div className="tk-lab-col">
              <div className="tk-out-num">{pct.format(sensitivity)}</div>
              <div className="tk-out-label">Sensibilidad: de los casos reales, cuántos detectó</div>
              <div className="tk-out-formula">
                {model.tp} ÷ ({model.tp} + {model.fn})
              </div>
            </div>
          </div>
        </div>
        <p className="tk-lab-note">
          Son medidas distintas y describen este conjunto de prueba, no todo territorio posible. Si omitir la especie es
          costoso, priorice la sensibilidad al elegir el umbral y el esfuerzo de revisión humana. Registre el resultado en
          la plantilla T05.
        </p>
      </div>
    </div>
  );
}
