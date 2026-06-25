import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mindscope®",
};

export default function MindScopeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
