import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Guidelines | C Minds",
  description: "C Minds brand guidelines — logo usage, clearspace, partnership, and color usage.",
};

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
