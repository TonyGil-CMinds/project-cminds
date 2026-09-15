import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    backAria: "Back",
    closeVideoAria: "Close video",
    location: "Latin America and Caribbean",
    tagline: "It drives conservation through technology, innovation and biocultural knowledge.",
    seeInitiative: "See Initiative",
    body: "At NaturaTech LAC, we are driven by the commitment to discover and explore the roots that emerge from territories: their stories and, above all, their innovation.",
    featureLabels: {
      natura500: "Natura500",
      studio: "ScaleUp Studio",
    },
    partnerTabs: {
      ledby: "LED BY",
      funding: "FUNDING PARTNERS",
    },
    nextUpLabel: "Next up...",
    nextUpTitle: "AI For Manatees",
    keepScrolling: "Keep scrolling!",
  },
  es: {
    backAria: "Atrás",
    closeVideoAria: "Cerrar video",
    location: "América Latina y el Caribe",
    tagline: "Impulsa la conservación a través de la tecnología, la innovación y el conocimiento biocultural.",
    seeInitiative: "Ver iniciativa",
    body: "En NaturaTech LAC, nos mueve el compromiso de descubrir y explorar las raíces que emergen de los territorios: sus historias y, sobre todo, su innovación.",
    featureLabels: {
      natura500: "Natura500",
      studio: "ScaleUp Studio",
    },
    partnerTabs: {
      ledby: "LIDERADO POR",
      funding: "SOCIOS FINANCIADORES",
    },
    nextUpLabel: "Sigue...",
    nextUpTitle: "AI For Manatees",
    keepScrolling: "¡Sigue bajando!",
  },
} satisfies Record<Locale, unknown>;

export type PageCopy = (typeof copy)["en"];
