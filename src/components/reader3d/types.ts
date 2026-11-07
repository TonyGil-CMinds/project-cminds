/**
 * Formato del lector 3D («manifest»): describe una publicación para el visor.
 * Lo generará el conversor de PDF (fase 2); el de Vital Oceans se transcribió a mano.
 * Las coordenadas usan una página de referencia `ref` (origen arriba a la izquierda).
 */

/** Rectángulo en coordenadas de la página de referencia: [x0, y0, x1, y1]. */
export type Rect = [number, number, number, number];

/** Zona interactiva sobre una página. */
export type ReaderHotspot =
  | {
      /** Acerca la cámara a un pasaje de texto o a una foto y muestra su contenido. */
      kind: "text" | "photo";
      zone: Rect;
      /** Dónde va el punto; si falta, el centro de la zona. */
      dot?: [number, number];
      title: string;
      text: string;
    }
  | {
      /** Enlace interno: lleva a otra página (índice de `pages`). */
      kind: "link";
      zone: Rect;
      goto: number;
      title: string;
    }
  | {
      /** Enlace externo (http o https): se abre en una pestaña nueva. */
      kind: "url";
      zone: Rect;
      href: string;
      title: string;
    };

/** Efecto sobre una zona: 1 = agua (ondas al pasar el cursor), 2 = brillo con linterna, 3 = brillo por color. */
export type ReaderFx = {
  type: 1 | 2 | 3;
  rect: Rect;
  /** Para el tipo 3: color que se ilumina y su tolerancia. */
  key?: [number, number, number];
  tol?: number;
};

/** Barniz: [x0, y0, x1, y1, intensidad 0–255]. */
export type ReaderVarnish = [number, number, number, number, number];

export type ReaderPage = {
  /** Nombre de la sección (miniaturas, título central y lector de pantalla). */
  label: string | null;
  /** Página vacía (guardas, contraportada). */
  blank?: boolean;
  /** Color de fondo de una página vacía. */
  color?: string;
  /** Imagen de la página (ruta relativa al manifest o URL absoluta). */
  src?: string;
  /** Versión pequeña (≈420 px) para arrancar rápido y para las miniaturas. */
  low?: string;
  /** Texto accesible de la página. */
  head?: string;
  paras: string[];
  /** Descripción de las imágenes de la página. */
  alt?: string;
  varnish?: ReaderVarnish[];
  fx?: ReaderFx;
  hs: ReaderHotspot[];
};

/** Ambiente de cada doble página (sonido y color de las partículas). */
export type ReaderMood = "deep" | "calm" | "surface";

export type ReaderManifest = {
  version: 1;
  id: string;
  /** Idioma de la publicación (no de la interfaz). */
  lang: string;
  title: string;
  kicker?: string;
  subtitle?: string;
  /** Página de referencia para las coordenadas. */
  ref: [number, number];
  /** Alto ÷ ancho de la página. */
  aspect: number;
  /** Un ambiente por doble página (páginas ÷ 2 + 1). */
  moods?: ReaderMood[];
  /** Número de páginas par: portada a la derecha, contraportada a la izquierda. */
  pages: ReaderPage[];
  /** Reporte de origen en el Archive, para descargar el PDF original. */
  source?: { reportId: string; lang: string };
  /** PDF original cuando no está en el Archive (URL o ruta relativa al manifest). */
  pdf?: string;
  /** Datos de la conversión (los escribe el conversor). */
  build?: { tool: string; sha256: string; pdfPages: number; createdAt: string };
};
