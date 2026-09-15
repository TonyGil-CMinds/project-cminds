import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI for Biodiversity | C Minds",
  description:
    "AI for Climate is a global initiative that explores the use of today's most advanced technologies to mitigate the risk of environmental crises in the world.",
};

export default function AFBLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
