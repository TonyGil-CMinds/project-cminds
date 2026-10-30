"use client";

import { useRouter } from "next/navigation";
import GlassFolder, { type ArtRecipe, type FolderArt, type FolderStrings } from "@/components/ui/glass-folder-cards";
import type { Locale } from "@/i18n/config";
import { templateSlug, toolkitHref, type Template } from "../data";
import { useContent, useLocale } from "./i18n";
import { downloadTemplate } from "./download";
import { usePrefs } from "./Preferences";
import { PageLink } from "./RefLink";
import { IconArrowRight, IconDownload } from "./icons";

// Arte de las carpetas en la paleta de Tech4Nature: musgo y lima, cielo y lima.
const MOSS: ArtRecipe = {
  style: "marble",
  colors: ["#040314", "#0e1a14", "#232a20", "#55702c", "#96ab3c", "#cbe86b", "#eeff66"],
  scale: 0.7,
  warp: 3.3,
  angle: 1.9,
  gloss: 0.5,
  veins: 0.45,
};
const DAWN: ArtRecipe = {
  style: "streak",
  colors: ["#040314", "#0b1d33", "#1f5b7a", "#5ec1f3", "#cbe86b", "#f3f7e6"],
  scale: 0.7,
  warp: 1.5,
  angle: -0.5,
  gloss: 0.2,
  veins: 0,
};
const ARTS: FolderArt[] = [MOSS, DAWN, "verdant"];

const FOLDER_STRINGS: Record<Locale, Partial<FolderStrings>> = {
  es: {
    open: "Abrir",
    close: "Cerrar",
    openFolder: "Abrir carpeta",
    closeFolder: "Cerrar carpeta",
    item: "campo",
    items: "campos",
    addTo: "Agregar a",
    moreFor: "Más opciones de",
    contents: "contenido",
    options: "opciones",
  },
  en: {
    open: "Open",
    close: "Close",
    openFolder: "Open folder",
    closeFolder: "Close folder",
    item: "field",
    items: "fields",
    addTo: "Add to",
    moreFor: "More options for",
    contents: "contents",
    options: "options",
  },
};

const L = {
  es: {
    template: "Plantilla",
    columns: "columnas",
    fields: "campos",
    openTemplate: "Abrir plantilla",
    dlCsv: "Descargar hoja (.csv)",
    dlMd: "Descargar texto (.md)",
    sheetCsv: "Hoja de trabajo .csv",
    textMd: "Texto .md",
  },
  en: {
    template: "Template",
    columns: "columns",
    fields: "fields",
    openTemplate: "Open template",
    dlCsv: "Download worksheet (.csv)",
    dlMd: "Download text (.md)",
    sheetCsv: "Worksheet .csv",
    textMd: "Text .md",
  },
} satisfies Record<Locale, Record<string, string>>;

/** Carpeta de una plantilla: sus hojas son los campos y el menú abre o descarga. */
export function TemplateFolder({ template, index, width = 260 }: { template: Template; index: number; width?: number }) {
  const router = useRouter();
  const locale = useLocale();
  const { theme } = usePrefs();
  const l = L[locale];
  const href = toolkitHref(locale, templateSlug(template));
  return (
    <GlassFolder
      width={width}
      tone={theme}
      art={ARTS[index % ARTS.length]}
      seed={index * 7 + 3}
      label={template.short}
      meta={`${l.template} ${template.n} · ${template.fields.length} ${template.layout === "log" ? l.columns : l.fields}`}
      files={template.fields.map((f) => ({ name: f.label, meta: `${l.template} ${template.n}` }))}
      action="more"
      strings={FOLDER_STRINGS[locale]}
      menu={[
        { label: l.openTemplate, onSelect: () => router.push(href) },
        { label: l.dlCsv, onSelect: () => downloadTemplate(template, "csv", locale) },
        { label: l.dlMd, onSelect: () => downloadTemplate(template, "md", locale) },
      ]}
      onFileSelect={() => router.push(href)}
      appearDelay={(index % 3) * 90}
    />
  );
}

/** Índice de plantillas: una carpeta por plantilla. */
export function TemplateShelf() {
  const locale = useLocale();
  const { TEMPLATES } = useContent();
  return (
    <ul className="tk-folders">
      {TEMPLATES.map((t, i) => (
        <li key={t.id} className="tk-folder-item">
          <TemplateFolder template={t} index={i} />
          <PageLink slug={templateSlug(t)} className="tk-folder-caption" data-ref={t.code}>
            <span className="tk-side-code">{t.code}</span>
            <span>
              {L[locale].template} {t.n}. {t.title}
            </span>
            <IconArrowRight />
          </PageLink>
        </li>
      ))}
    </ul>
  );
}

export function TemplateDownloads({ id }: { id: string }) {
  const locale = useLocale();
  const { TEMPLATES } = useContent();
  const l = L[locale];
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) return null;
  return (
    <div className="tk-viewer-dl">
      <button type="button" className="tk-cta" onClick={() => downloadTemplate(t, "csv", locale)}>
        <IconDownload />
        {l.sheetCsv}
      </button>
      <button type="button" className="tk-ghost" onClick={() => downloadTemplate(t, "md", locale)}>
        <IconDownload />
        {l.textMd}
      </button>
    </div>
  );
}
