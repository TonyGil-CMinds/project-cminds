import { HERO, TOOLKIT_DATE_LABEL, TOOLKIT_VERSION, TEMPLATES_INTRO, slugify, templateSlug, toolkitHref, type Template } from "../data";

/** Descarga un texto generado en el navegador. */
export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const cell = (v: string) => (/[",;\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);

/** CSV con BOM para que Excel respete los acentos. */
export function toCsv(rows: string[][]): string {
  return "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n");
}

/** Filas vacías que ofrece un registro por columnas (plantilla 3). */
const LOG_ROWS = 12;

const fieldText = (f: Template["fields"][number]) => (f.hint ? `${f.label} (${f.hint})` : f.label);

function sourceLine(t: Template): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `Fuente: ${HERO.title}, v${TOOLKIT_VERSION} — C Minds / Tech4Nature México, ${TOOLKIT_DATE_LABEL.toLowerCase()}. ${origin}${toolkitHref("es", templateSlug(t))}`;
}

/** Hoja de trabajo: un campo por fila, o un registro con sus columnas. */
export function templateCsv(t: Template): string {
  if (t.layout === "log") {
    return toCsv([
      t.fields.map((f) => f.label),
      ...Array.from({ length: LOG_ROWS }, () => t.fields.map(() => "")),
      [],
      [sourceLine(t)],
    ]);
  }
  return toCsv([["Campo", "Respuesta"], ...t.fields.map((f) => [fieldText(f), ""]), [], [sourceLine(t)]]);
}

export function templateMarkdown(t: Template): string {
  const row = (r: string[]) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  const lines = [`# Plantilla ${t.n}. ${t.title}`, "", TEMPLATES_INTRO, ""];
  if (t.layout === "log") {
    const head = t.fields.map((f) => f.label);
    lines.push(row(head), row(head.map(() => "---")), ...Array.from({ length: 3 }, () => row(head.map(() => " "))));
  } else {
    lines.push(row(["Campo", "Respuesta"]), row(["---", "---"]), ...t.fields.map((f) => row([`**${f.label}**${f.hint ? ` (${f.hint})` : ""}`, " "])));
  }
  lines.push("", `_${sourceLine(t)}_`, "");
  return lines.join("\n");
}

export function downloadTemplate(t: Template, format: "csv" | "md") {
  const name = `plantilla-${t.n}-${slugify(t.title)}.${format}`;
  if (format === "csv") downloadFile(name, templateCsv(t), "text/csv");
  else downloadFile(name, templateMarkdown(t), "text/markdown");
}
