import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    fallbackTitle: "Report | C Minds",
    backToMindscope: "Mindscope",
    downloadPdf: "Save as PDF",
    read3d: "Read in 3D",
    viewInArchive: "View in The Archive",
    noDate: "—",
  },
  es: {
    fallbackTitle: "Reporte | C Minds",
    backToMindscope: "Mindscope",
    downloadPdf: "Guardar como PDF",
    read3d: "Leer en 3D",
    viewInArchive: "Ver en The Archive",
    noDate: "—",
  },
} satisfies Record<Locale, unknown>;

export type ReportDetailCopy = (typeof copy)["en"];
