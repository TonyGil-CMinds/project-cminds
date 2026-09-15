import type { Locale } from "./config";

/**
 * Chrome shared across every page: nav, search, footer, subscribe, 404.
 * Page-specific copy lives in a `copy.ts` next to that page.
 */
export const common = {
  en: {
    nav: {
      home: "Home",
      core: "Core",
      mindscope: "Mindscope ®",
      careers: "Careers",
      menu: "Menu",
      close: "Close",
    },
    language: {
      label: "Language",
      switchTo: "Switch language",
      en: "English",
      es: "Spanish",
    },
    search: {
      pill: "Search...",
      placeholder: "Search Anything...",
      open: "Open search",
      close: "Close search",
      clear: "Clear",
      empty: "No results for",
      sections: {
        pages: "Pages",
        getstarted: "Get Started",
        actions: "Actions",
        jobs: "Job Opportunity",
        reports: "Reports",
        publications: "Publications",
      },
      items: {
        privacy: "Privacy Policy",
        ethics: "Code of Ethics",
        contact: "Contact us",
        refresh: "Refresh page",
        browseArchive: "Browse The Archive",
        browseMindscope: "Browse Mindscope",
        untitled: "Untitled",
      },
    },
    footer: {
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      ethics: "Code of Ethics",
      contact: "Contact",
    },
    subscribe: {
      title: "Stay in the loop",
      cta: "Subscribe",
      email: "Email address",
      success: "You're subscribed.",
      error: "Something went wrong. Please try again.",
    },
    notFound: {
      title: "Page not found",
      body: "The page you are looking for does not exist or has moved.",
      cta: "Back home",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      core: "Core",
      mindscope: "Mindscope ®",
      careers: "Vacantes",
      menu: "Menú",
      close: "Cerrar",
    },
    language: {
      label: "Idioma",
      switchTo: "Cambiar de idioma",
      en: "Inglés",
      es: "Español",
    },
    search: {
      pill: "Buscar...",
      placeholder: "Busca lo que necesites...",
      open: "Abrir búsqueda",
      close: "Cerrar búsqueda",
      clear: "Limpiar",
      empty: "Sin resultados para",
      sections: {
        pages: "Páginas",
        getstarted: "Comienza aquí",
        actions: "Acciones",
        jobs: "Oportunidad laboral",
        reports: "Reportes",
        publications: "Publicaciones",
      },
      items: {
        privacy: "Aviso de Privacidad",
        ethics: "Código de Ética",
        contact: "Contáctanos",
        refresh: "Recargar página",
        browseArchive: "Explorar El Archivo",
        browseMindscope: "Explorar Mindscope",
        untitled: "Sin título",
      },
    },
    footer: {
      rights: "Todos los derechos reservados.",
      privacy: "Aviso de Privacidad",
      ethics: "Código de Ética",
      contact: "Contacto",
    },
    subscribe: {
      title: "Mantente al tanto",
      cta: "Suscribirme",
      email: "Correo electrónico",
      success: "Tu suscripción quedó lista.",
      error: "Algo salió mal. Inténtalo de nuevo.",
    },
    notFound: {
      title: "Página no encontrada",
      body: "La página que buscas no existe o cambió de dirección.",
      cta: "Volver al inicio",
    },
  },
} satisfies Record<Locale, unknown>;

export type CommonCopy = (typeof common)["en"];
