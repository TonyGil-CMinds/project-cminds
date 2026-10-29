"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/useLocale";
import { ACTIONS, toolkitHref } from "../data";
import { useToolkit } from "./ToolkitState";
import { IconArrowRight, IconCheck, IconCheckCircle, IconCopy } from "./icons";

/** Cierre de cada acción: marcarla como revisada y pasar a la siguiente página. */
export function ActionFinish({ id, code, nextSlug, nextLabel }: { id: string; code: string; nextSlug?: string; nextLabel?: string }) {
  const { isDone, setDone, done } = useToolkit();
  const router = useRouter();
  const locale = useLocale();
  const reviewed = isDone(id);
  const left = ACTIONS.length - done.length;
  return (
    <div className="tk-finish" data-done={reviewed || undefined}>
      <div>
        <strong>{reviewed ? `${code} revisada` : `¿Terminaste ${code}?`}</strong>
        <span>
          {left === 0
            ? "Revisaste las 12 acciones: tu insignia está desbloqueada."
            : `Te faltan ${left} ${left === 1 ? "acción" : "acciones"} para desbloquear la insignia del toolkit.`}
        </span>
      </div>
      <div className="tk-finish-actions">
        <ActionDone id={id} code={code} />
        {nextSlug ? (
          <button
            type="button"
            className="tk-cta"
            onClick={() => {
              setDone(id, true);
              router.push(toolkitHref(locale, nextSlug));
            }}
            aria-label={`${reviewed ? "Continuar" : "Marcar como revisada y continuar"} a ${nextLabel ?? "la siguiente página"}`}
          >
            {reviewed ? "Continuar" : "Revisada y continuar"}
            <IconArrowRight />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Marca una acción como revisada; el avance se guarda en el navegador. */
export function ActionDone({ id, code }: { id: string; code: string }) {
  const { isDone, toggleDone } = useToolkit();
  const done = isDone(id);
  return (
    <button
      type="button"
      className="tk-done"
      aria-pressed={done}
      aria-label={done ? `${code} revisada. Desmarcar` : `Marcar ${code} como revisada`}
      onClick={() => toggleDone(id)}
    >
      {done ? <IconCheck /> : <IconCheckCircle />}
      {done ? "Revisada" : "Marcar como revisada"}
    </button>
  );
}

/** Copia un texto al portapapeles y confirma en el propio botón. */
export function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="tk-ghost"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <IconCheck /> : <IconCopy />}
      <span aria-live="polite">{copied ? "Copiado" : label}</span>
    </button>
  );
}
