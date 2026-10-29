"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/useLocale";
import { targetOf, toolkitHref } from "../data";

const KIND_LABEL: Record<string, string> = { A: "Acción", T: "Plantilla", R: "Recurso", E: "Evidencia" };

/** Chip de referencia (A01, T01, R01, E01) que lleva a su página dentro del toolkit. */
export function Ref({ code }: { code: string }) {
  const locale = useLocale();
  const { slug, hash } = targetOf(code);
  const kind = code[0];
  return (
    <Link
      className={`tk-ref tk-ref--${kind.toLowerCase()}`}
      href={toolkitHref(locale, slug, hash)}
      data-ref={code}
      aria-label={`${KIND_LABEL[kind]} ${code}`}
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
