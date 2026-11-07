"use client";

import type { ComponentPropsWithRef } from "react";
import { common } from "@/i18n/common";
import { useLocale } from "@/i18n/useLocale";

type EcosNavLinkProps = Pick<
  ComponentPropsWithRef<"a">,
  "ref" | "onMouseEnter" | "onFocus" | "onBlur"
>;

export default function EcosNavLink(props: EcosNavLinkProps) {
  const locale = useLocale();

  return (
    <a
      {...props}
      className="nav-item nav-item--ecos"
      href="https://ecos.naturatech.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      {common[locale].mobileMenu.ecos}
    </a>
  );
}
