import { DocumentTitle } from "@/components/DocumentTitle";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { PrinciplesSection } from "@/components/sections/PrinciplesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { BookingSection } from "@/components/sections/BookingSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <DocumentTitle />
      <Header />
      <main>
        <Hero />
        <PrinciplesSection />
        <ProcessSection />
        <ProjectsSection />
        <FaqSection />
        <PricingSection />
        <BookingSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
