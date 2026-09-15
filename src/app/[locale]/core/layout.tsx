import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Core",
};

export default function CoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
