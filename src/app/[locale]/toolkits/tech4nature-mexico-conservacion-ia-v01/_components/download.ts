import type { Locale } from "@/i18n/config";
import { getContent } from "../content";
import { TOOLKIT_VERSION, slugify, templateSlug, toolkitHref, type Template } from "../data";

const L = {
  es: { source: "Fuente", field: "Campo", response: "Respuesta", template: "Plantilla" },
  en: { source: "Source", field: "Field", response: "Response", template: "Template" },
} satisfies Record<Locale, Record<string, string>>;

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

function sourceLine(t: Template, locale: Locale): string {
  const { HERO, TOOLKIT_DATE_LABEL } = getContent(locale);
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  const org = locale === "en" ? "Tech4Nature Mexico" : "Tech4Nature México";
  return `${L[locale].source}: ${HERO.title}, v${TOOLKIT_VERSION} — C Minds / ${org}, ${TOOLKIT_DATE_LABEL.toLowerCase()}. ${origin}${toolkitHref(locale, templateSlug(t))}`;
}

/** Hoja de trabajo: un campo por fila, o un registro con sus columnas. */
export function templateCsv(t: Template, locale: Locale): string {
  // Con columnas de BioScanner, el CSV se importa tal cual: solo el encabezado.
  if (t.fields.some((f) => f.key)) return toCsv([t.fields.map((f) => f.key ?? f.label)]);
  if (t.layout === "log") {
    return toCsv([
      t.fields.map((f) => f.label),
      ...Array.from({ length: LOG_ROWS }, () => t.fields.map(() => "")),
      [],
      [sourceLine(t, locale)],
    ]);
  }
  const l = L[locale];
  return toCsv([[l.field, l.response], ...t.fields.map((f) => [fieldText(f), ""]), [], [sourceLine(t, locale)]]);
}

export function templateMarkdown(t: Template, locale: Locale): string {
  const { TEMPLATES_INTRO } = getContent(locale);
  const l = L[locale];
  const row = (r: string[]) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  const lines = [`# ${l.template} ${t.n}. ${t.title}`, "", TEMPLATES_INTRO, ""];
  if (t.layout === "log") {
    const head = t.fields.map((f) => f.label);
    lines.push(row(head), row(head.map(() => "---")), ...Array.from({ length: 3 }, () => row(head.map(() => " "))));
  } else {
    lines.push(row([l.field, l.response]), row(["---", "---"]), ...t.fields.map((f) => row([`**${f.label}**${f.hint ? ` (${f.hint})` : ""}`, " "])));
  }
  lines.push("", `_${sourceLine(t, locale)}_`, "");
  return lines.join("\n");
}

export function downloadTemplate(t: Template, format: "csv" | "md", locale: Locale) {
  // El nombre del archivo usa siempre el título en español (slug estable).
  const es = getContent("es").TEMPLATES.find((x) => x.id === t.id) ?? t;
  const name = `plantilla-${t.n}-${slugify(es.title)}.${format}`;
  if (format === "csv") downloadFile(name, templateCsv(t, locale), "text/csv");
  else downloadFile(name, templateMarkdown(t, locale), "text/markdown");
}
