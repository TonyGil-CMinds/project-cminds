"use client";

import { QUESTIONS, STAGES, STORAGE_KEY, stageSlug } from "../data";
import { downloadFile, toCsv } from "./download";
import { PageLink } from "./RefLink";
import { IconArrowRight, IconDownload } from "./icons";
import { useLocalStore } from "./useLocalStore";

type Answer = "si" | "no";
type Answers = Record<string, Answer>;

const KEY = `${STORAGE_KEY}:preguntas`;
const OPTIONS: { v: Answer; label: string }[] = [
  { v: "si", label: "Sí" },
  { v: "no", label: "Todavía no" },
];

function parse(raw: string | null): Answers {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(([, v]) => v === "si" || v === "no"),
    ) as Answers;
  } catch {
    return {};
  }
}

/**
 * Las diez preguntas rápidas: cada una se responde «sí» o «todavía no».
 * Con la mayoría en «sí», el equipo está listo para arrancar; si no, las
 * etapas 1 y 5 ayudan a resolver lo pendiente.
 */
export default function ReadinessCheck() {
  const [answers, setAnswers] = useLocalStore(KEY, parse);
  const id = (i: number) => `q${i + 1}`;

  const yes = QUESTIONS.items.filter((_, i) => answers[id(i)] === "si").length;
  const answered = QUESTIONS.items.filter((_, i) => answers[id(i)]).length;
  const total = QUESTIONS.items.length;
  const ready = yes > total / 2;

  const exportCsv = () => {
    downloadFile(
      "diez-preguntas-rapidas.csv",
      toCsv([
        ["Pregunta", "Respuesta"],
        ...QUESTIONS.items.map((q, i) => [q, answers[id(i)] === "si" ? "Sí" : answers[id(i)] === "no" ? "Todavía no" : "Sin responder"]),
      ]),
      "text/csv",
    );
  };

  return (
    <div>
      <ol className="tk-quiz">
        {QUESTIONS.items.map((q, i) => {
          const value = answers[id(i)];
          return (
            <li key={q} className="tk-quiz-item" data-answer={value}>
              <span className="tk-quiz-n" aria-hidden="true">
                {i + 1}
              </span>
              <fieldset>
                <legend>{q}</legend>
                <div className="tk-seg">
                  {OPTIONS.map((o) => (
                    <label key={o.v} data-v={o.v === "si" ? "disponible" : "pendiente"}>
                      <input
                        type="radio"
                        name={`pregunta-${i + 1}`}
                        value={o.v}
                        checked={value === o.v}
                        onChange={() => setAnswers((a) => ({ ...a, [id(i)]: o.v }))}
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div className="tk-quiz-result" aria-live="polite" data-ready={answered === total ? String(ready) : undefined}>
        <p>
          <strong>
            {yes} de {total}
          </strong>{" "}
          respuestas en «sí».{" "}
          {answered < total
            ? `Te ${total - answered === 1 ? "falta" : "faltan"} ${total - answered} por responder.`
            : ready
              ? "Estás listo para arrancar."
              : "Las etapas 1 y 5 te ayudarán a resolver lo pendiente."}
        </p>
        {answered === total && !ready ? (
          <div className="tk-quiz-links">
            {[STAGES[0], STAGES[4]].map((s) => (
              <PageLink key={s.id} slug={stageSlug(s)} className="tk-ghost" data-ref={s.code}>
                Etapa {s.n} · {s.title}
                <IconArrowRight />
              </PageLink>
            ))}
          </div>
        ) : null}
      </div>

      <div className="tk-row-actions">
        <button type="button" className="tk-ghost" onClick={exportCsv}>
          <IconDownload />
          Descargar respuestas (.csv)
        </button>
        {answered ? (
          <button type="button" className="tk-link-btn" onClick={() => setAnswers({})}>
            Reiniciar
          </button>
        ) : null}
        <span className="tk-saved">Tus respuestas se guardan en este navegador.</span>
      </div>
    </div>
  );
}
