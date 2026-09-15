import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    title: "C Minds | A new era",
    visitSite: "Visit our website",
    links: [
      { label: "NaturaTech LAC Initiative" },
      { label: "Vital Oceans Initiative" },
      { label: "Tech4Nature Initiative" },
      { label: "AI4Manatees" },
    ],
    copyright: "© 2025 C Minds All rights reserved.",
  },
  es: {
    title: "C Minds | Una nueva era",
    visitSite: "Visita nuestro sitio web",
    links: [
      { label: "Iniciativa NaturaTech LAC" },
      { label: "Iniciativa Vital Oceans" },
      { label: "Iniciativa Tech4Nature" },
      { label: "AI4Manatees" },
    ],
    copyright: "© 2025 C Minds Todos los derechos reservados.",
  },
} satisfies Record<Locale, unknown>;

export type BioCopy = (typeof copy)["en"];
