import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    orbitWords: [
      "TANGIBLE IMPACT",
      "INCUBATION",
      "REGIONAL STRATEGIES",
      "POLICIES",
      "GOVERNANCE FRAMEWORKS",
      "SCALE INITIATIVES",
      "EMERGING TECHNOLOGIES",
    ],
    hero: {
      // Short pair for the per-character GSAP hover-morph — keep both close
      // in length to the Spanish pair below.
      phraseA: "FROM POSSIBILITY",
      phraseB: "TO REALITY",
      mobilePhrase: "FROM POSSIBILITY TO REALITY",
      introLead: "Meaningful transformation requires new forms of collaboration,",
      introRest:
        " governance, and collective intelligence capable of bridging disciplines, sectors, cultures, and knowledge systems.",
      contactCta: "Get Involved",
      scrollDown: "Scroll down",
      newInMindscope: "New in Mindscope ®",
      dismissAria: "Dismiss",
    },
    core: {
      title: "Core",
      columns: [
        "C Minds catalyzes technological, financial, and entrepreneurship innovation for both people and the planet in Latin America. We play at the edge of possibility, where strategy meets action.",
        "We develop AI policies and ethical frameworks. We lead multi-sector and systems-based strategies. We incubate and scale local, national and regional initiatives.",
        "For over two decades we have been a partner of choice of our financial and impact partners. We contribute to shaping futures where innovation is routed in justice, access to opportunities and regeneration.",
      ],
      learnMore: "Learn more",
    },
    initiatives: {
      heading: "Featured Initiatives",
      subheading: "Some of our selected projects we launched",
      items: {
        ntl: { pills: ["Regenerative", "Innovation"], label: "Purposeful Tech for Biodiversity" },
        t4n: { pills: ["Conservation", "Local leadership"], label: "AI-powered biodiversity monitoring platform" },
        vo: { pills: ["Ocean", "Protection"], label: "Community-led Marine Protected Areas" },
        a4m: { pills: ["AI systems", "Conservation"], label: "A Machine Learning Approach" },
      },
    },
    bold: {
      // Independent per-word spans, in reading order across 3 lines.
      bold: "BOLD",
      and: " AND",
      meaningful: "MEANINGFUL",
      transformations: "TRANSFORMATIONS",
    },
    wwd: {
      pill: "What we do",
      phaseA: { we: "We", codesign: "codesign", visions: "visions", with: "with our partners" },
      phaseB: { line1: "We transform these into", tangible: "tangible ", impact: "impact" },
    },
    hww: {
      pill: "How we work",
      titleWe: "We",
      titleCollaborate: "collaborate",
      titleWith: "with",
      cyclingWords: ["governments", "civil society", "organizations", "local communities"],
      body: "We explore how technologies like GenAI, IoT, blockchain can help accelerate and scale impact contextually. We are rooted in the value of fairness. We prototype what doesn't yet exist—and scale what's already working.",
    },
    partners: {
      titleLine1: "Our partners",
      titleLine2: "in change",
    },
    awards: {
      pill: "Awards",
      titleLine1: "C Minds and our team",
      titleLine2: "have been awarded",
      items: {
        "paris-peace-forum": {
          title: "Scale-up Program\n2024-25",
          body: "Emerging technologies, new conditions for the planet",
        },
        forbes: {
          title: "Leaders of AI in\nMéxico 2024",
          body: "Honor for Contanza Gómez Mont, Founder of C Minds, Director of NaturaTech LAC",
        },
      },
    },
  },
  es: {
    orbitWords: [
      "IMPACTO TANGIBLE",
      "INCUBACIÓN",
      "ESTRATEGIAS REGIONALES",
      "POLÍTICAS",
      "MARCOS DE GOBERNANZA",
      "ESCALAR INICIATIVAS",
      "TECNOLOGÍAS EMERGENTES",
    ],
    hero: {
      phraseA: "DE LA IDEA",
      phraseB: "A LA REALIDAD",
      mobilePhrase: "DE LA IDEA A LA REALIDAD",
      introLead: "La transformación requiere nuevas formas de colaboración,",
      introRest:
        " gobernanza e inteligencia colectiva capaces de conectar disciplinas, sectores, culturas y sistemas de conocimiento.",
      contactCta: "Contáctanos",
      scrollDown: "Desplázate",
      newInMindscope: "Nuevo en Mindscope ®",
      dismissAria: "Cerrar",
    },
    core: {
      title: "Core",
      columns: [
        "C Minds impulsa la innovación tecnológica, financiera y de emprendimiento para las personas y el planeta en América Latina. Trabajamos en el límite de lo posible, donde la estrategia se encuentra con la acción.",
        "Desarrollamos políticas de IA y marcos éticos. Lideramos estrategias multisectoriales basadas en sistemas. Incubamos y escalamos iniciativas locales, nacionales y regionales.",
        "Por más de dos décadas hemos sido el aliado preferido de nuestros socios financieros y de impacto. Contribuimos a construir futuros donde la innovación está arraigada en la justicia, el acceso a oportunidades y la regeneración.",
      ],
      learnMore: "Conoce más",
    },
    initiatives: {
      heading: "Iniciativas destacadas",
      subheading: "Algunos de los proyectos que hemos lanzado",
      items: {
        ntl: { pills: ["Regenerativa", "Innovación"], label: "Tecnología con propósito para la biodiversidad" },
        t4n: { pills: ["Conservación", "Liderazgo local"], label: "Plataforma de monitoreo de biodiversidad con IA" },
        vo: { pills: ["Océano", "Protección"], label: "Áreas marinas protegidas lideradas por comunidades" },
        a4m: { pills: ["Sistemas de IA", "Conservación"], label: "Un enfoque de aprendizaje automático" },
      },
    },
    bold: {
      // "Transformación audaz y significativa" — Spanish leads with the noun, so
      // the bright first line carries one word and the pair moves down to line 2.
      // These keys are render slots, not meanings: line 1 = bold + and,
      // line 2 = meaningful, line 3 = transformations.
      bold: "TRANSFORMACIÓN",
      and: "",
      meaningful: "AUDAZ Y",
      transformations: "SIGNIFICATIVA",
    },
    wwd: {
      pill: "Qué hacemos",
      phaseA: { we: "Nosotros", codesign: "co-diseñamos", visions: "visiones", with: "con nuestros aliados" },
      phaseB: { line1: "Transformamos esto en", tangible: "impacto ", impact: "tangible" },
    },
    hww: {
      pill: "Cómo trabajamos",
      titleWe: "Nosotros",
      titleCollaborate: "colaboramos",
      titleWith: "con",
      cyclingWords: ["gobiernos", "sociedad civil", "organizaciones", "comunidades locales"],
      body: "Exploramos cómo tecnologías como la IA generativa, el IoT y blockchain pueden acelerar y escalar el impacto según el contexto. Nos guiamos por el valor de la equidad. Prototipamos lo que aún no existe, y escalamos lo que ya funciona.",
    },
    partners: {
      titleLine1: "Nuestros aliados",
      titleLine2: "de cambio",
    },
    awards: {
      pill: "Premios",
      titleLine1: "C Minds y nuestro equipo",
      titleLine2: "han sido reconocidos",
      items: {
        "paris-peace-forum": {
          title: "Programa Scale-up\n2024-25",
          body: "Tecnologías emergentes, nuevas condiciones para el planeta",
        },
        forbes: {
          title: "Líderes de IA en\nMéxico 2024",
          body: "Reconocimiento a Contanza Gómez Mont, Fundadora de C Minds, Directora de NaturaTech LAC",
        },
      },
    },
  },
} satisfies Record<Locale, unknown>;

export type HomeCopy = (typeof copy)["en"];
