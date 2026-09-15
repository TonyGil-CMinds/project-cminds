import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    fallbackTitle: "Report | C Minds",
    backToMindscope: "Mindscope",
    downloadPdf: "Save as PDF",
    viewInArchive: "View in The Archive",
    noDate: "—",
  },
  es: {
    fallbackTitle: "Reporte | C Minds",
    backToMindscope: "Mindscope",
    downloadPdf: "Guardar como PDF",
    viewInArchive: "Ver en The Archive",
    noDate: "—",
  },
} satisfies Record<Locale, unknown>;

export type ReportDetailCopy = (typeof copy)["en"];
