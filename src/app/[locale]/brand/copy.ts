import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    nav: {
      logo: "Logo",
      "primary-logo": "Primary logo",
      hexagone: "Hexagone",
      clearspace: "Clearspace",
      partnership: "Partnership",
      "color-usage": "Color usage",
      "incorrect-usage": "Incorrect usage",
    },
    mediaKitBtn: "Download MediaKit",
    burgerOpen: "Open navigation",
    burgerClose: "Close menu",
    modal: {
      title: "Coming soon",
      body: "The Media Kit will be available for download shortly. Check back soon.",
      close: "Got it",
    },
    hero: { title: "Brand Guidelines" },
    logo: {
      desc: "The logo is a brand's primary identifier. It contains both the symbol and our name in wordmark form. It should be used most often to represent our brand, especially to audiences unfamiliar with it.",
      download: "Download logo",
    },
    primaryLogo: {
      title: "Primary logo",
      desc: 'Our logo is our first impression. Its symbol, a dotted hexagone, embodies "C Minds" and the wordmark complements this symbol with its neutral and organic look.',
      alt: "C Minds primary logo",
    },
    hexagone: {
      title: "Hexagone",
      desc: "The hexagon is one of nature's most efficient and resilient structures, appearing across living systems from honeycombs to cellular networks. For C Minds, it symbolizes the power of interconnectedness, collaboration, and systems thinking—core principles that have guided our work for over two decades. Its evolution reflects our continued commitment to building bridges across sectors, disciplines, and knowledge systems to help shape more equitable and bioprosperous futures.",
      alt: "C Minds hexagone symbol",
    },
    clearspace: {
      title: "Clearspace",
      desc: 'Be sure not to crowd the logo. When placing elements nearby, use the letter "C" in the wordmark as a guide for spacing.',
      alt: "C Minds logo clearspace guide",
    },
    partnership: {
      title: "Partnership",
      desc: "When positioning dual logos in brand partnerships, apply the same clearspace principles. Use a 1.5 px line that extends from the top to the bottom of the symbol's height as a divider between the two logos.",
      alt: "C Minds partnership logo usage",
    },
    colorUsage: {
      title: "Color usage",
      desc1: "Our logo should only appear in black, white, or C Minds Blue 600 from the core palette. When placing the logo over imagery, ensure there is enough contrast to maintain clear legibility.",
      desc2: "Monochrome versions can be used in the following cases:",
      list: [
        "The background color or image clashes with C Minds Blue.",
        "Printing is limited to black, white, or one color.",
        "The logo appears alongside a partner logo.",
      ],
      bgLabels: ["white", "blue", "black", "gradient"],
      altTemplate: "Logo on {bg} background",
    },
    incorrectUsage: {
      title: "Incorrect usage",
      intro: "Do not alter the logo. Avoid the following treatments.",
      captions: [
        "Do not use the old logo",
        "Do not stretch/squeeze the hexagone",
        "Do not create custom logos",
        "Do not alter the logo type",
        "Do not apply multiple colors to the logo",
        "Do not use unapproved colors",
      ],
    },
  },
  es: {
    nav: {
      logo: "Logo",
      "primary-logo": "Logo principal",
      hexagone: "Hexágono",
      clearspace: "Espacio libre",
      partnership: "Alianzas",
      "color-usage": "Uso de color",
      "incorrect-usage": "Uso incorrecto",
    },
    mediaKitBtn: "Descargar MediaKit",
    burgerOpen: "Abrir navegación",
    burgerClose: "Cerrar menú",
    modal: {
      title: "Próximamente",
      body: "El Media Kit estará disponible para descargar muy pronto. Vuelve a visitarnos.",
      close: "Entendido",
    },
    hero: { title: "Guía de marca" },
    logo: {
      desc: "El logo es el identificador principal de una marca. Contiene tanto el símbolo como nuestro nombre en forma de logotipo. Úsalo con más frecuencia para representar nuestra marca, sobre todo ante públicos que aún no la conocen.",
      download: "Descargar logo",
    },
    primaryLogo: {
      title: "Logo principal",
      desc: 'Nuestro logo es nuestra primera impresión. Su símbolo, un hexágono punteado, encarna "C Minds", y el logotipo complementa este símbolo con un estilo neutral y orgánico.',
      alt: "Logo principal de C Minds",
    },
    hexagone: {
      title: "Hexágono",
      desc: "El hexágono es una de las estructuras más eficientes y resilientes de la naturaleza, presente en sistemas vivos que van desde los panales hasta las redes celulares. Para C Minds, simboliza el poder de la interconexión, la colaboración y el pensamiento sistémico: principios centrales que han guiado nuestro trabajo por más de dos décadas. Su evolución refleja nuestro compromiso continuo de construir puentes entre sectores, disciplinas y sistemas de conocimiento para ayudar a construir futuros más equitativos y bioprósperos.",
      alt: "Símbolo del hexágono de C Minds",
    },
    clearspace: {
      title: "Espacio libre",
      desc: 'Evita saturar el logo con otros elementos. Al colocar elementos cercanos, usa la letra "C" del logotipo como referencia de espaciado.',
      alt: "Guía de espacio libre del logo de C Minds",
    },
    partnership: {
      title: "Alianzas",
      desc: "Al posicionar dos logos en alianzas de marca, aplica los mismos principios de espacio libre. Usa una línea de 1.5 px que se extienda de arriba a abajo de la altura del símbolo como divisor entre ambos logos.",
      alt: "Uso del logo de C Minds en alianzas",
    },
    colorUsage: {
      title: "Uso de color",
      desc1: "Nuestro logo solo debe aparecer en negro, blanco o C Minds Blue 600 de la paleta central. Al colocar el logo sobre una imagen, asegúrate de tener suficiente contraste para mantener una buena legibilidad.",
      desc2: "Las versiones monocromáticas pueden usarse en los siguientes casos:",
      list: [
        "El color o la imagen de fondo choca con el azul de C Minds.",
        "La impresión está limitada a blanco, negro o un solo color.",
        "El logo aparece junto al logo de un socio.",
      ],
      bgLabels: ["blanco", "azul", "negro", "degradado"],
      altTemplate: "Logo sobre fondo {bg}",
    },
    incorrectUsage: {
      title: "Uso incorrecto",
      intro: "No alteres el logo. Evita los siguientes tratamientos.",
      captions: [
        "No uses el logo anterior",
        "No estires ni comprimas el hexágono",
        "No crees logos personalizados",
        "No alteres el tipo de logo",
        "No apliques varios colores al logo",
        "No uses colores no autorizados",
      ],
    },
  },
} satisfies Record<Locale, unknown>;

export type BrandCopy = (typeof copy)["en"];
