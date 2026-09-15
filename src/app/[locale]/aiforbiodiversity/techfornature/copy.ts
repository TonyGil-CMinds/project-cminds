import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    hero: {
      bgAlt: "Tech4Nature México",
      closeAria: "Back to Initiatives",
      seeVideo: "See Video",
      seeResults: "See Results",
      closeVideoAria: "Close video",
    },
    info: {
      phaseChip: "PHASE 1",
      dateRange: "2022 - 2024",
      logoAlt: "Tech4Nature México",
      location: "Dzilam State Reserve",
      desc: "A multisectoral collaboration for jaguar conservation in the Yucatán Peninsula.",
      downloadReport: "Download report",
      bodyHtml:
        "<strong>Tech4Nature Mexico</strong> works to accelerate the effective conservation and " +
        "regeneration of biodiversity and ecosystem health, strengthening monitoring, conservation, " +
        "and understanding of the impacts of climate change on ecosystems and priority species " +
        "in the mangrove area of the Yucatán Peninsula.",
    },
    mission: {
      imgAlt: "The Mission",
      title: "The Mission",
      col1: [
        "Our mission at Tech4Nature México centers on understanding, preserving and restoring the Dzilam State Reserve to provide a secure sanctuary for a rich variety of plant and animal species.",
        "Nestled in the northeastern region of Yucatan, the Dzilam State Reserve is a natural protected area with over <strong>69,000 hectares</strong> that belongs to the municipalities of Dzilam de Bravo and San Felipe.",
      ],
      col2: [
        "This reserve holds a special status as a critical wetland conservation site, boasting nearly <strong>290 species of fauna</strong> intricately linked with over <strong>300 flora species</strong>. It spans five distinct vegetation types, including coastal dunes, mangroves, petenes, along with vibrant aquatic flora in coastal lagoons.",
      ],
    },
    impact: {
      title: "The Impact",
      desc:
        "Camera traps, audio recorders and two custom AI models turned an overwhelming archive " +
        "into a living catalogue of individuals — observed, logged and identified.",
      kpis: {
        jaguars: "Individual jaguars identified",
        accuracy: "Individual-level accuracy",
        species: "Species detected",
        atRisk: "40 at risk",
      },
      slides: [
        {
          entry: "ENTRY 01",
          title: "Automated detection",
          rows: [
            { label: "Images / Video", value: "100,000+" },
            { label: "Audio Files", value: "600,000+" },
            { label: "Analysis", value: "3 yrs → months" },
          ],
        },
        {
          entry: "ENTRY 02",
          title: "Two new algorithms",
          rows: [
            { label: "Algorithms", value: "2" },
            { label: "Accuracy", value: "90%+" },
            { label: "Individuals", value: "9 jaguars" },
          ],
        },
        {
          entry: "ENTRY 03",
          title: "Platform & people",
          rows: [
            { label: "Platform", value: "First-of-kind" },
            { label: "Reports", value: "Open · ethical" },
            { label: "Students", value: "12+" },
          ],
        },
      ],
      slideAriaLabel: (n: number) => `Slide ${n}`,
    },
    bioscanner: {
      imgAlt: "Bioscanner",
      chipHtml: "Bioscanner <strong>BETA</strong>",
    },
    arbimon: {
      imgAlt: "Arbimon",
      chip: "ARBIMON",
    },
    transition: {
      cardImgAlt: "NaturaTech LAC",
      nextLabel: "Next up...",
      nextTitle: "NaturaTech LAC",
      hintHtml: "Keep <em>scrolling!</em>",
    },
    partners: {
      tabs: {
        ledby: "LED BY",
        innovation: "INNOVATION PARTNERS",
        supported: "SUPPORTED BY",
      },
    },
    report: {
      closeAria: "Close",
      chip: "PHASE I",
      title: "Ethical Use of AI Systems for Biodiversity...",
      cta: "Download Report",
    },
  },
  es: {
    hero: {
      bgAlt: "Tech4Nature México",
      closeAria: "Volver a Iniciativas",
      seeVideo: "Ver video",
      seeResults: "Ver resultados",
      closeVideoAria: "Cerrar video",
    },
    info: {
      phaseChip: "FASE 1",
      dateRange: "2022 - 2024",
      logoAlt: "Tech4Nature México",
      location: "Reserva Estatal de Dzilam",
      desc: "Una colaboración multisectorial para la conservación del jaguar en la península de Yucatán.",
      downloadReport: "Descargar reporte",
      bodyHtml:
        "<strong>Tech4Nature Mexico</strong> trabaja para acelerar la conservación y regeneración " +
        "efectiva de la biodiversidad y la salud de los ecosistemas, fortaleciendo el monitoreo, " +
        "la conservación y la comprensión de los impactos del cambio climático en los ecosistemas " +
        "y especies prioritarias del manglar de la península de Yucatán.",
    },
    mission: {
      imgAlt: "La Misión",
      title: "La Misión",
      col1: [
        "Nuestra misión en Tech4Nature México es entender, preservar y restaurar la Reserva Estatal de Dzilam para ofrecer un refugio seguro a una gran variedad de especies vegetales y animales.",
        "Ubicada en el noreste de Yucatán, la Reserva Estatal de Dzilam es un área natural protegida de más de <strong>69,000 hectáreas</strong> que pertenece a los municipios de Dzilam de Bravo y San Felipe.",
      ],
      col2: [
        "Esta reserva tiene un estatus especial como sitio crítico de conservación de humedales, con cerca de <strong>290 especies de fauna</strong> estrechamente vinculadas con más de <strong>300 especies de flora</strong>. Abarca cinco tipos de vegetación distintos, entre ellos dunas costeras, manglares y petenes, además de una vibrante flora acuática en sus lagunas costeras.",
      ],
    },
    impact: {
      title: "El Impacto",
      desc:
        "Cámaras trampa, grabadoras de audio y dos modelos de IA hechos a la medida convirtieron " +
        "un archivo abrumador en un catálogo vivo de individuos observados, registrados e identificados.",
      kpis: {
        jaguars: "Jaguares individuales identificados",
        accuracy: "Precisión a nivel individual",
        species: "Especies detectadas",
        atRisk: "40 en riesgo",
      },
      slides: [
        {
          entry: "ENTRADA 01",
          title: "Detección automatizada",
          rows: [
            { label: "Imágenes / Video", value: "100,000+" },
            { label: "Archivos de audio", value: "600,000+" },
            { label: "Análisis", value: "3 años → meses" },
          ],
        },
        {
          entry: "ENTRADA 02",
          title: "Dos nuevos algoritmos",
          rows: [
            { label: "Algoritmos", value: "2" },
            { label: "Precisión", value: "90%+" },
            { label: "Individuos", value: "9 jaguares" },
          ],
        },
        {
          entry: "ENTRADA 03",
          title: "Plataforma y personas",
          rows: [
            { label: "Plataforma", value: "Primera en su tipo" },
            { label: "Reportes", value: "Abierto · ético" },
            { label: "Estudiantes", value: "12+" },
          ],
        },
      ],
      slideAriaLabel: (n: number) => `Diapositiva ${n}`,
    },
    bioscanner: {
      imgAlt: "Bioscanner",
      chipHtml: "Bioscanner <strong>BETA</strong>",
    },
    arbimon: {
      imgAlt: "Arbimon",
      chip: "ARBIMON",
    },
    transition: {
      cardImgAlt: "NaturaTech LAC",
      nextLabel: "Sigue...",
      nextTitle: "NaturaTech LAC",
      hintHtml: "¡Sigue <em>desplazándote</em>!",
    },
    partners: {
      tabs: {
        ledby: "LIDERADO POR",
        innovation: "SOCIOS DE INNOVACIÓN",
        supported: "CON EL APOYO DE",
      },
    },
    report: {
      closeAria: "Cerrar",
      chip: "FASE I",
      title: "Uso ético de sistemas de IA para la biodiversidad...",
      cta: "Descargar reporte",
    },
  },
} satisfies Record<Locale, unknown>;

export type TechForNatureCopy = (typeof copy)["en"];
