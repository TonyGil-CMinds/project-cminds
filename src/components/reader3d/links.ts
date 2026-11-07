/** Lector disponible para un reporte del Archive (de /api/readers). */
export type ReaderRef = { slug: string; langs: string[] };

/** Enlace al lector de un reporte en el idioma pedido o, si no lo tiene, en el primero disponible. */
export function readerHref(locale: string, reader: ReaderRef, lang?: string): string {
  const want = lang?.toLowerCase();
  const l = want && reader.langs.includes(want) ? want : reader.langs[0];
  return `/${locale}/lector/${reader.slug}?lang=${l}`;
}
