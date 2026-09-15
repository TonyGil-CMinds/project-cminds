import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "C Minds | A new era",
  description: "C Minds — Systemic Innovation & Biodiversity Action Tank. Explore our initiatives, publications, and mission.",
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
