import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    hero: {
      title1: "Join the team",
      title2: "shaping what's next.",
      scroll: "Scroll down ↓",
      anchors: {
        positions: "Open positions",
        culture: "Culture",
        people: "People",
        benefits: "Benefits",
      },
    },
    positions: {
      label: "Positions",
      empty: "Not more positions available",
      statusLabels: {
        Closed: "Closed",
      },
      items: [
        { title: "Project Manager", type: "Full time", location: "LATAM", mode: "Remote", status: "Closed" as const },
      ],
    },
    culture: {
      label: "Culture",
      text: "We are a collaborative, growth-minded team that values curiosity, mentorship, meaningful work, and the people behind it.",
    },
    people: {
      label: "People",
      prev: "Previous",
      next: "Next",
      list: [
        {
          role: "Director, Vital Oceans",
          quote: "The ocean covers more than 70% of our planet, yet we understand so little of it. Every decision we make at Vital Oceans is a step toward closing that gap — before it's too late.",
        },
        {
          role: "Lead, Digital Product",
          quote: "A great digital product doesn't just work — it earns trust. The best interfaces are the ones people forget they're using because everything just flows.",
        },
        {
          role: "Lead, Interactive Design",
          quote: "Every great project starts with understanding people. Design isn't decoration — it's how we communicate what matters most and why it's worth building.",
        },
        {
          role: "Head, Exploration Studio",
          quote: "Exploration means being comfortable with not knowing the answer yet. The Exploration Studio exists to ask questions the rest of the world hasn't thought to ask — and to build what comes after.",
        },
        {
          role: "Editorial Design",
          quote: "Visual storytelling is how complex ideas become accessible. Good editorial design doesn't just present information — it makes people feel something before they've read a single word.",
        },
        {
          role: "Head of Impact",
          quote: "Impact without measurement is just intention. Our job is to make sure that what we do in rooms and boardrooms actually reaches the people and ecosystems we're working for.",
        },
        {
          role: "Head, ScaleUp Studio",
          quote: "Scaling an idea isn't just about growth — it's about making sure the right things grow in the right way. The ScaleUp Studio exists to make that distinction matter.",
        },
        {
          role: "Administration Lead",
          quote: "Every great initiative runs on trust and structure. Behind every launch, every partnership, every milestone — there's a foundation that makes it all possible.",
        },
        {
          role: "Communication",
          quote: "Telling the right story to the right audience at the right moment is a craft. Communication is how we turn our work into something the world can understand and believe in.",
        },
        {
          role: "Head, Nature Innovation Programs",
          quote: "Innovation for nature isn't a metaphor — it's a necessity. Every program we design has to meet the urgency of what's at stake and the ambition of what's possible.",
        },
        {
          role: "Lead, Branding",
          quote: "A brand is a promise. My job is to make sure C Minds keeps that promise consistently — in every color, every word, and every experience we put into the world.",
        },
      ],
    },
    benefits: {
      label: "Benefits",
      items: [
        {
          title: "Working your way",
          desc: "We're fully remote by design, not by default. That means no commute, more autonomy, and the freedom to do your best work — wherever that happens to be.",
        },
        {
          title: "Love to learn.",
          desc: "Curious minds thrive here. Use your $500 annual learning stipend on whatever helps you grow — design conferences, dev workshops, or something unexpected.",
        },
        {
          title: "Get Together.",
          desc: "Every month, we bring the whole team together — face-to-face, human-to-human. Expect good food, shared ideas, and the kind of conversations that don't happen on Zoom.",
        },
      ],
    },
  },
  es: {
    hero: {
      title1: "Únete al equipo",
      title2: "que construye lo que sigue.",
      scroll: "Desliza ↓",
      anchors: {
        positions: "Vacantes abiertas",
        culture: "Cultura",
        people: "Equipo",
        benefits: "Beneficios",
      },
    },
    positions: {
      label: "Vacantes",
      empty: "No hay más vacantes disponibles",
      statusLabels: {
        Closed: "Cerrada",
      },
      items: [
        { title: "Gerente de Proyecto", type: "Tiempo completo", location: "LATAM", mode: "Remoto", status: "Closed" as const },
      ],
    },
    culture: {
      label: "Cultura",
      text: "Somos un equipo colaborativo, enfocado en crecer, que valora la curiosidad, la mentoría, el trabajo con propósito y a las personas detrás de él.",
    },
    people: {
      label: "Equipo",
      prev: "Anterior",
      next: "Siguiente",
      list: [
        {
          role: "Directora, Vital Oceans",
          quote: "El océano cubre más del 70% de nuestro planeta y, sin embargo, sabemos tan poco de él. Cada decisión que tomamos en Vital Oceans es un paso para cerrar esa brecha — antes de que sea demasiado tarde.",
        },
        {
          role: "Líder de Producto Digital",
          quote: "Un gran producto digital no solo funciona: se gana la confianza. Las mejores interfaces son las que la gente olvida que está usando, porque todo simplemente fluye.",
        },
        {
          role: "Líder de Diseño Interactivo",
          quote: "Todo gran proyecto empieza por entender a las personas. El diseño no es decoración: es cómo comunicamos lo que realmente importa y por qué vale la pena construirlo.",
        },
        {
          role: "Jefe, Exploration Studio",
          quote: "Explorar significa estar cómodo sin tener aún la respuesta. El Exploration Studio existe para hacer las preguntas que el resto del mundo no se ha planteado — y construir lo que viene después.",
        },
        {
          role: "Diseño Editorial",
          quote: "La narrativa visual es lo que hace accesibles las ideas complejas. Un buen diseño editorial no solo presenta información: hace sentir algo a las personas antes de leer una sola palabra.",
        },
        {
          role: "Jefe de Impacto",
          quote: "El impacto sin medición es solo intención. Nuestro trabajo es asegurar que lo que hacemos en salas de juntas realmente llegue a las personas y los ecosistemas para los que trabajamos.",
        },
        {
          role: "Jefe, ScaleUp Studio",
          quote: "Escalar una idea no es solo crecer: es asegurar que las cosas correctas crezcan de la manera correcta. El ScaleUp Studio existe para que esa distinción importe.",
        },
        {
          role: "Líder de Administración",
          quote: "Toda gran iniciativa se sostiene con confianza y estructura. Detrás de cada lanzamiento, cada alianza, cada logro, hay una base que lo hace posible.",
        },
        {
          role: "Comunicación",
          quote: "Contar la historia correcta, a la audiencia correcta, en el momento correcto es un oficio. La comunicación es cómo convertimos nuestro trabajo en algo que el mundo puede entender y en lo que puede creer.",
        },
        {
          role: "Jefa de Programas de Innovación para la Naturaleza",
          quote: "La innovación para la naturaleza no es una metáfora: es una necesidad. Cada programa que diseñamos debe estar a la altura de la urgencia de lo que está en juego y de la ambición de lo posible.",
        },
        {
          role: "Líder de Branding",
          quote: "Una marca es una promesa. Mi trabajo es asegurar que C Minds cumpla esa promesa de forma constante — en cada color, cada palabra y cada experiencia que ponemos en el mundo.",
        },
      ],
    },
    benefits: {
      label: "Beneficios",
      items: [
        {
          title: "A tu manera",
          desc: "Somos remotos por diseño, no por default. Eso significa cero traslados, más autonomía y la libertad de dar tu mejor trabajo, estés donde estés.",
        },
        {
          title: "Ama aprender.",
          desc: "Aquí prosperan las mentes curiosas. Usa tu estímulo anual de $500 USD en lo que te ayude a crecer — conferencias de diseño, talleres de desarrollo o algo inesperado.",
        },
        {
          title: "Reunámonos.",
          desc: "Cada mes reunimos a todo el equipo — cara a cara, humano a humano. Habrá buena comida, ideas compartidas y conversaciones que no pasan por Zoom.",
        },
      ],
    },
  },
} satisfies Record<Locale, unknown>;

export type CareersCopy = (typeof copy)["en"];
