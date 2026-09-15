import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
};

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
