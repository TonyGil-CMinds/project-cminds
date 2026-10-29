import type { ReactNode } from "react";
import { toLocale } from "@/i18n/config";
import ToolkitShell from "./_components/ToolkitShell";
import { PREFS_SCRIPT } from "./_components/prefs-script";
import "./toolkit.css";

/**
 * El marco del toolkit (barra superior, índice, columna de avance) vive en el
 * layout para que persista entre páginas; cada capítulo es su propia URL.
 */
export default async function ToolkitLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      {/* Aplica tema y tamaño de letra guardados antes de pintar, para evitar parpadeos. */}
      <script dangerouslySetInnerHTML={{ __html: PREFS_SCRIPT }} />
      <ToolkitShell locale={toLocale(locale)}>{children}</ToolkitShell>
    </>
  );
}
