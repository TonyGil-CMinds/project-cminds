"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { toolkitHref } from "../data";
import { useContent, useLocale } from "./i18n";
import { useToolkit } from "./ToolkitState";
import { IconArrowRight, IconCheck, IconCheckCircle, IconCopy } from "./icons";

const L = {
  es: {
    reviewed: (label: string) => `${label} revisada`,
    finished: (label: string) => `¿Terminaste la ${label.toLowerCase()}?`,
    allDone: "Revisaste las cinco etapas: tu insignia está desbloqueada.",
    left: (n: number) => `Te ${n === 1 ? "falta" : "faltan"} ${n} ${n === 1 ? "etapa" : "etapas"} para desbloquear la insignia del toolkit.`,
    continue: "Continuar",
    markContinue: "Marcar como revisada y continuar",
    to: (action: string, next?: string) => `${action} a ${next ?? "la siguiente página"}`,
    reviewedContinue: "Revisada y continuar",
    unmark: (label: string) => `${label} revisada. Desmarcar`,
    mark: (label: string) => `Marcar ${label} como revisada`,
    done: "Revisada",
    markDone: "Marcar como revisada",
    copy: "Copiar",
    copied: "Copiado",
  },
  en: {
    reviewed: (label: string) => `${label} reviewed`,
    finished: (label: string) => `Finished ${label}?`,
    allDone: "You reviewed all five stages: your badge is unlocked.",
    left: (n: number) => `${n} more ${n === 1 ? "stage" : "stages"} to unlock the toolkit badge.`,
    continue: "Continue",
    markContinue: "Mark as reviewed and continue",
    to: (action: string, next?: string) => `${action} to ${next ?? "the next page"}`,
    reviewedContinue: "Reviewed, continue",
    unmark: (label: string) => `${label} reviewed. Unmark`,
    mark: (label: string) => `Mark ${label} as reviewed`,
    done: "Reviewed",
    markDone: "Mark as reviewed",
    copy: "Copy",
    copied: "Copied",
  },
} satisfies Record<Locale, Record<string, string | ((...args: never[]) => string)>>;

/** Cierre de cada etapa: marcarla como revisada y pasar a la siguiente página. */
export function ActionFinish({
  id,
  code,
  label,
  nextSlug,
  nextLabel,
}: {
  id: string;
  code: string;
  /** Nombre visible, por ejemplo «Etapa 1». */
  label: string;
  nextSlug?: string;
  nextLabel?: string;
}) {
  const { isDone, setDone, done } = useToolkit();
  const router = useRouter();
  const locale = useLocale();
  const { STAGES } = useContent();
  const l = L[locale];
  const reviewed = isDone(id);
  const left = STAGES.length - done.length;
  return (
    <div className="tk-finish" data-done={reviewed || undefined}>
      <div>
        <strong>{reviewed ? l.reviewed(label) : l.finished(label)}</strong>
        <span>{left === 0 ? l.allDone : l.left(left)}</span>
      </div>
      <div className="tk-finish-actions">
        <ActionDone id={id} code={code} label={label} />
        {nextSlug ? (
          <button
            type="button"
            className="tk-cta"
            onClick={() => {
              setDone(id, true);
              router.push(toolkitHref(locale, nextSlug));
            }}
            aria-label={l.to(reviewed ? l.continue : l.markContinue, nextLabel)}
          >
            {reviewed ? l.continue : l.reviewedContinue}
            <IconArrowRight />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Marca una etapa como revisada; el avance se guarda en el navegador. */
export function ActionDone({ id, code, label = code }: { id: string; code: string; label?: string }) {
  const { isDone, toggleDone } = useToolkit();
  const l = L[useLocale()];
  const done = isDone(id);
  return (
    <button
      type="button"
      className="tk-done"
      aria-pressed={done}
      aria-label={done ? l.unmark(label) : l.mark(label)}
      onClick={() => toggleDone(id)}
    >
      {done ? <IconCheck /> : <IconCheckCircle />}
      {done ? l.done : l.markDone}
    </button>
  );
}

/** Copia un texto al portapapeles y confirma en el propio botón. */
export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const l = L[useLocale()];
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
      <span aria-live="polite">{copied ? l.copied : (label ?? l.copy)}</span>
    </button>
  );
}
