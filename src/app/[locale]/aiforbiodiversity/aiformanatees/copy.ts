import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    backAria: "Back",
    location: "Latin America and Caribbean",
    tagline:
      "A Machine Learning Approach to better understand and protect manatees in Latin America and the Caribbean",
    downloadReport: "Download report",
    reportTitle: "AI4Manatees: A Machine Learning Approach...",
    body1:
      "AI 4 Manatees is a multi-sectoral alliance that aims to accelerate the conservation of manatee populations in the Caribbean, and regions in Central and South America.",
    body2:
      "By building a mechanism for analyzing manatee vocalizations from submarine audio recordings harnessing the power of AI systems, we will produce tools that allow researchers and conservation practitioners to better understand manatees' behavior and communication patterns.",
    partnerTabs: {
      partners: "PARTNERS AND OBSERVERS",
    },
    nextUpLabel: "Next up...",
    nextUpTitle: "Vital Oceans",
    keepScrolling: "Keep scrolling!",
  },
  es: {
    backAria: "Atrás",
    location: "América Latina y el Caribe",
    tagline:
      "Un enfoque de machine learning para entender y proteger mejor a los manatíes en América Latina y el Caribe",
    downloadReport: "Descargar informe",
    reportTitle: "AI4Manatees: A Machine Learning Approach...",
    body1:
      "AI 4 Manatees es una alianza multisectorial que busca acelerar la conservación de las poblaciones de manatíes en el Caribe y en regiones de Centro y Sudamérica.",
    body2:
      "Al construir un mecanismo para analizar las vocalizaciones de los manatíes a partir de grabaciones de audio submarino, aprovechando el poder de los sistemas de IA, produciremos herramientas que permitan a investigadores y conservacionistas entender mejor el comportamiento y los patrones de comunicación de los manatíes.",
    partnerTabs: {
      partners: "SOCIOS Y OBSERVADORES",
    },
    nextUpLabel: "Sigue...",
    nextUpTitle: "Vital Oceans",
    keepScrolling: "¡Sigue bajando!",
  },
} satisfies Record<Locale, unknown>;

export type PageCopy = (typeof copy)["en"];
