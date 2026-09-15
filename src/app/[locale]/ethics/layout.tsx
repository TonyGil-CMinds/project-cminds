import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code of Ethics",
};

export default function EthicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
