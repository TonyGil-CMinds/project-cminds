import type { Metadata } from "next";
import NotFoundClient from "../components/NotFoundClient";

export const metadata: Metadata = {
  title: "Not found",
};

export default function NotFound() {
  return <NotFoundClient />;
}
