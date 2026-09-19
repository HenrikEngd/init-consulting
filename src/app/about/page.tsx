import type { Metadata } from "next";
import { About } from "@/components/sections/About";
import { Header } from "@/components/sections/Header";

export const metadata: Metadata = {
  title: "Henrik Engdal",
  description:
    "Henrik Engdal arbeider med digitale produkter, programvareutvikling, data og AI, automatisering og integrasjoner, med erfaring fra rådgivning, onboarding, support og testing.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <About />
    </>
  );
}
