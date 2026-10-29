"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/useLocale";
import { targetOf, toolkitHref } from "../data";

const KIND_LABEL: Record<string, string> = { E: "Etapa", P: "Plantilla", R: "Recurso" };
/** Clase de color de cada tipo de referencia. */
const KIND_CLASS: Record<string, string> = { E: "a", P: "t", R: "r" };

/** Chip de referencia (E1, P1, R01) que lleva a su página dentro del toolkit. */
export function Ref({ code }: { code: string }) {
  const locale = useLocale();
  const { slug, hash } = targetOf(code);
  const kind = code[0];
  return (
    <Link
      className={`tk-ref tk-ref--${KIND_CLASS[kind] ?? "r"}`}
      href={toolkitHref(locale, slug, hash)}
      data-ref={code}
      aria-label={`${KIND_LABEL[kind]} ${code.slice(1).replace(/^0/, "")}`}
    >
      {code}
    </Link>
  );
}

/** Enlace a una página del toolkit por slug. */
export function PageLink({
  slug,
  hash,
  className,
  children,
  ...rest
}: { slug: string; hash?: string; className?: string; children: ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  const locale = useLocale();
  return (
    <Link className={className} href={toolkitHref(locale, slug, hash)} {...rest}>
      {children}
    </Link>
  );
}
