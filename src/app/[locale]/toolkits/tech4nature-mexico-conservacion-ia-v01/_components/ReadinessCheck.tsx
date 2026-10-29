"use client";

import { READINESS, STORAGE_KEY } from "../data";
import { downloadFile, toCsv } from "./download";
import { IconDownload } from "./icons";
import { useLocalStore } from "./useLocalStore";

type Status = "disponible" | "fortalecer" | "pendiente";
type Entry = { status?: Status; owner?: string; date?: string };
type Answers = Record<string, Entry>;

const KEY = `${STORAGE_KEY}:diagnostico`;
const OPTIONS: { v: Status; label: string }[] = [
  { v: "disponible", label: "Disponible" },
  { v: "fortalecer", label: "Requiere fortalecimiento" },
  { v: "pendiente", label: "Pendiente" },
];
const COLUMNS: { v: Status; title: string; empty: string }[] = [
  { v: "pendiente", title: "Trabajo inicial", empty: "Ninguna condición marcada como pendiente." },
  { v: "fortalecer", title: "Requiere fortalecimiento", empty: "Sin condiciones por fortalecer." },
  { v: "disponible", title: "Disponible", empty: "Aún no hay condiciones confirmadas." },
];

function parse(raw: string | null): Answers {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Answers) : {};
  } catch {
    return {};
  }
}

/**
 * Diagnóstico de preparación (T01): cada condición se registra como disponible,
 * por fortalecer o pendiente, con responsable y fecha. Deliberadamente no
 * calcula un puntaje agregado: las pendientes definen el trabajo inicial.
 */
export default function ReadinessCheck() {
  const [answers, setAnswers] = useLocalStore(KEY, parse);

  const update = (id: string, patch: Entry) => setAnswers((a) => ({ ...a, [id]: { ...a[id], ...patch } }));

  const exportCsv = () => {
    const label = (s?: Status) => OPTIONS.find((o) => o.v === s)?.label ?? "Sin registrar";
    downloadFile(
      "T01-diagnostico-de-preparacion.csv",
      toCsv([
        ["Condición", "Evidencia mínima para comenzar", "Estado", "Responsable", "Fecha"],
        ...READINESS.conditions.map((c) => [
          c.title,
          c.evidence,
          label(answers[c.id]?.status),
          answers[c.id]?.owner ?? "",
          answers[c.id]?.date ?? "",
        ]),
      ]),
      "text/csv",
    );
  };

  const recorded = READINESS.conditions.filter((c) => answers[c.id]?.status).length;

  return (
    <div>
      <div className="tk-diag">
        {READINESS.conditions.map((c) => {
          const entry = answers[c.id] ?? {};
          return (
            <fieldset key={c.id} className="tk-diag-item" data-status={entry.status}>
              <legend>{c.title}</legend>
              <p className="tk-diag-evidence">{c.evidence}</p>
              <div className="tk-diag-row">
                <div className="tk-seg">
                  {OPTIONS.map((o) => (
                    <label key={o.v} data-v={o.v}>
                      <input
                        type="radio"
                        name={`diag-${c.id}`}
                        value={o.v}
                        checked={entry.status === o.v}
                        onChange={() => update(c.id, { status: o.v })}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
                <input
                  className="tk-input"
                  type="text"
                  placeholder="Persona responsable"
                  aria-label={`Responsable de ${c.title}`}
                  value={entry.owner ?? ""}
                  onChange={(e) => update(c.id, { owner: e.target.value })}
                />
                <input
                  className="tk-input"
                  type="date"
                  aria-label={`Fecha para ${c.title}`}
                  value={entry.date ?? ""}
                  onChange={(e) => update(c.id, { date: e.target.value })}
                />
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="tk-board" aria-live="polite">
        {COLUMNS.map((col) => {
          const items = READINESS.conditions.filter((c) => answers[c.id]?.status === col.v);
          return (
            <div key={col.v} className={`tk-board-col tk-board-col--${col.v}`}>
              <h3>
                {col.title}
                <span>{items.length}</span>
              </h3>
              {items.length ? (
                <ul>
                  {items.map((c) => (
                    <li key={c.id}>
                      {c.title}
                      {answers[c.id]?.owner || answers[c.id]?.date ? (
                        <small>
                          {[answers[c.id]?.owner, answers[c.id]?.date].filter(Boolean).join(" · ")}
                        </small>
                      ) : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tk-board-empty">{col.empty}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="tk-row-actions">
        <button type="button" className="tk-ghost" onClick={exportCsv}>
          <IconDownload />
          Descargar diagnóstico (.csv)
        </button>
        {recorded ? (
          <button type="button" className="tk-link-btn" onClick={() => setAnswers({})}>
            Reiniciar
          </button>
        ) : null}
        <span className="tk-saved">
          {recorded} de {READINESS.conditions.length} condiciones registradas · se guarda en este navegador
        </span>
      </div>
    </div>
  );
}
