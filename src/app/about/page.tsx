import type { Metadata } from "next";
import { About } from "@/components/sections/About";

export const metadata: Metadata = {
  title: "Om meg",
  description:
    "INIT er et enkeltpersonsforetak. Hvem du jobber med, hvordan arbeidet foregår og hvordan du får tak i meg.",
};

export default function AboutPage() {
  return <About />;
}
