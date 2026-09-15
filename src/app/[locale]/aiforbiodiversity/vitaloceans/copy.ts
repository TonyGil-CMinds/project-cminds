import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    hero: {
      backAria: "Back",
      closeVideoAria: "Close video",
    },
    info: {
      location: "Latin America and Caribbean",
      taglineLine1: "Protecting Oceans,",
      taglineLine2: "Empowering Communities",
      cta: "See Initiative",
      body: "Vital Oceans Platform enables users to identify, visualize, and analyze potential Marine Protected Areas through an interactive map. By selecting a specific area, users can generate structured, data-driven reports that support decision-making, facilitate stakeholder engagement, and strengthen the case for marine protection.",
    },
    transition: {
      nextLabel: "Next up...",
      nextTitle: "Tech4Nature",
      hint: "Keep scrolling!",
    },
    partners: {
      ledBy: "LED BY",
    },
  },
  es: {
    hero: {
      backAria: "Atrás",
      closeVideoAria: "Cerrar video",
    },
    info: {
      location: "Latinoamérica y el Caribe",
      taglineLine1: "Protegiendo Océanos,",
      taglineLine2: "Fortaleciendo Comunidades",
      cta: "Ver Iniciativa",
      body: "La plataforma Vital Oceans te permite identificar, visualizar y analizar posibles Áreas Marinas Protegidas a través de un mapa interactivo. Al seleccionar un área específica, puedes generar reportes estructurados y basados en datos que apoyan la toma de decisiones, facilitan la participación de actores clave y fortalecen los argumentos a favor de la protección marina.",
    },
    transition: {
      nextLabel: "Sigue...",
      nextTitle: "Tech4Nature",
      hint: "¡Sigue haciendo scroll!",
    },
    partners: {
      ledBy: "LIDERADO POR",
    },
  },
} satisfies Record<Locale, unknown>;

export type VitalOceansCopy = (typeof copy)["en"];
