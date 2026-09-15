import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    nav: {
      logoAlt: "AI for Climate",
      items: [
        { label: "HOME", target: "top" },
        { label: "WHO WE ARE", target: ".afb-who" },
        { label: "WHERE WE COME FROM", target: ".afb-wcf" },
        { label: "INITIATIVES", target: "#initiatives" },
      ],
    },
    hero: {
      // Rendered word-by-word into fixed <span> slots — keep exactly 8 items,
      // same order, last 2 carry the gradient style (see page.tsx JSX).
      titleWords: ["Harnessing", "the", "power", "of", "AI", "against", "Climate", "Change"],
      subtitle:
        "We explore the use of AI to strengthen the protection, restoration, and management of public and private nature reserves around the globe.",
      featured: {
        imageAlt: "Tech4Nature México anual report 2024",
        title: "Tech4Nature México anual report 2024",
        cta: "See last report →",
      },
    },
    who: {
      label: "WHO ARE WE",
      ariaLabel: "Who we are",
      text: "A global initiative that explores the use of today's most advanced technologies to mitigate the risk of environmental crises in the world and to activate the economy in the poverty-stricken communities around nature reserves.",
    },
  },
  es: {
    nav: {
      logoAlt: "AI for Climate",
      items: [
        { label: "INICIO", target: "top" },
        { label: "QUIÉNES SOMOS", target: ".afb-who" },
        { label: "DE DÓNDE VENIMOS", target: ".afb-wcf" },
        { label: "INICIATIVAS", target: "#initiatives" },
      ],
    },
    hero: {
      // Same 8-slot structure as English — "Aprovechando el poder de la IA
      // frente al Cambio Climático". Last 2 items carry the gradient style.
      titleWords: ["Aprovechando", "el poder", "de", "la", "IA", "frente al", "Cambio", "Climático"],
      subtitle:
        "Exploramos el uso de la IA para fortalecer la protección, restauración y gestión de reservas naturales públicas y privadas alrededor del mundo.",
      featured: {
        imageAlt: "Tech4Nature México anual report 2024",
        title: "Tech4Nature México anual report 2024",
        cta: "Ver último informe →",
      },
    },
    who: {
      label: "QUIÉNES SOMOS",
      ariaLabel: "Quiénes somos",
      text: "Una iniciativa global que explora el uso de las tecnologías más avanzadas de hoy para mitigar el riesgo de crisis ambientales en el mundo y activar la economía en las comunidades empobrecidas que rodean las reservas naturales.",
    },
  },
} satisfies Record<Locale, unknown>;

export type AfbCopy = (typeof copy)["en"];
