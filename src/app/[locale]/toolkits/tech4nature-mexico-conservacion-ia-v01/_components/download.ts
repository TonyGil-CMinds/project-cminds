import { TOOLKIT_VERSION, slugify, templateSlug, toolkitHref, type Template } from "../data";

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

function sourceLine(t: Template): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `Fuente: Toolkit para iniciativas de conservación con IA en México, v${TOOLKIT_VERSION} — C Minds / Tech4Nature México, octubre de 2026. ${origin}${toolkitHref("es", templateSlug(t))}`;
}

/** Hoja de trabajo: las filas de la plantilla con columnas vacías para completar. */
export function templateCsv(t: Template): string {
  return toCsv([
    [...t.table.head, "Respuesta", "Responsable", "Fecha"],
    ...t.table.rows.map((r) => [...r, "", "", ""]),
    [],
    [sourceLine(t)],
  ]);
}

export function templateMarkdown(t: Template): string {
  const row = (r: string[]) => `| ${r.map((c) => c.replace(/\|/g, "\\|")).join(" | ")} |`;
  const lines = [
    `# ${t.code} ${t.title}`,
    "",
    t.intro,
    "",
    row([...t.table.head, "Respuesta"]),
    row([...t.table.head, "Respuesta"].map(() => "---")),
    ...t.table.rows.map((r) => row([...r, " "])),
    "",
  ];
  for (const s of t.sections) {
    lines.push(`## ${s.title}`, "");
    if (s.example) lines.push(`> ${s.example}`, "");
    s.paragraphs?.forEach((p) => lines.push(p, ""));
    s.list?.forEach((li) => lines.push(`- ${li}`));
    if (s.list) lines.push("");
  }
  lines.push(`**Control de salida:** ${t.control}`, "", `Acciones asociadas: ${t.actions.join(", ")}`, "", `_${sourceLine(t)}_`, "");
  return lines.join("\n");
}

export function downloadTemplate(t: Template, format: "csv" | "md") {
  const name = `${t.code}-${slugify(t.title)}.${format}`;
  if (format === "csv") downloadFile(name, templateCsv(t), "text/csv");
  else downloadFile(name, templateMarkdown(t), "text/markdown");
}
