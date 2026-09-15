import type { Locale } from "@/i18n/config";

export const copy = {
  en: {
    dock: {
      publications: "Publications",
      reports: "Reports",
      search: "Search",
    },
    hero: {
      line1: "Unfolds Multiple",
      line2: "Dimensions",
    },
    subscribe: {
      tooltip: "You will be notified about new releases.",
      subscribe: "Subscribe",
      subscribed: "Subscribed",
      cancel: "Cancel subscription",
    },
    reel: {
      date: "Date",
      title: "Title",
    },
    empty: {
      title: "Nothing here yet",
      body: "We haven't published anything in this language yet. Check back soon.",
    },
    post: {
      minRead: "min read",
      shareText: "Share with friends",
      copyTooltip: "Copy to share",
      copyLink: "Copy link",
      continueScroll: "Continue scrolling to",
      revealNext: "reveal next post",
      notFound: "Post not found.",
      backToMindscope: "← Back to Mindscope",
      breadcrumbAria: "Breadcrumb",
      breadcrumbHome: "Home",
      breadcrumbMindscope: "Mindscope",
      loading: "Loading article…",
      noContent: "No content available.",
    },
    archive: {
      headingThe: "The ",
      headingArchive: "Archive",
      scrollHint: "Scroll to arrange",
      saveAsPdf: "Save as PDF",
      close: "Close",
    },
  },
  es: {
    dock: {
      publications: "Publicaciones",
      reports: "Reportes",
      search: "Buscar",
    },
    hero: {
      line1: "Despliega Múltiples",
      line2: "Dimensiones",
    },
    subscribe: {
      tooltip: "Te avisaremos sobre nuevos lanzamientos.",
      subscribe: "Suscribirme",
      subscribed: "Suscrito",
      cancel: "Cancelar suscripción",
    },
    reel: {
      date: "Fecha",
      title: "Título",
    },
    empty: {
      title: "Todavía no hay nada aquí",
      body: "Aún no publicamos nada en este idioma. Vuelve pronto.",
    },
    post: {
      minRead: "min de lectura",
      shareText: "Comparte con tus amigos",
      copyTooltip: "Copiar para compartir",
      copyLink: "Copiar enlace",
      continueScroll: "Sigue bajando para",
      revealNext: "ver el siguiente artículo",
      notFound: "Artículo no encontrado.",
      backToMindscope: "← Volver a Mindscope",
      breadcrumbAria: "Ruta de navegación",
      breadcrumbHome: "Inicio",
      breadcrumbMindscope: "Mindscope",
      loading: "Cargando artículo…",
      noContent: "No hay contenido disponible.",
    },
    archive: {
      headingThe: "El ",
      headingArchive: "Archivo",
      scrollHint: "Desliza para acomodar",
      saveAsPdf: "Guardar como PDF",
      close: "Cerrar",
    },
  },
} satisfies Record<Locale, unknown>;

export type MindscopeCopy = (typeof copy)["en"];
