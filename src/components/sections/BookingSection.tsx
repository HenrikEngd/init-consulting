"use client";

import { useLanguage } from "@/lib/language-context";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { BookingCalendar } from "@/components/ui/BookingCalendar";

export function BookingSection() {
  const { t } = useLanguage();

  return (
    <section id="book" className="scroll-mt-20 border-t border-hairline">
      <div className="mx-auto max-w-[1340px] px-5 py-24 sm:px-8 sm:py-28">
        <SectionHeading title={t.booking.title} subtitle={t.booking.subtitle} />

        <FadeIn delay={0.1} className="mt-14">
          {/* Narrower than the content column: a calendar reads as an object,
              not as a band across the page. */}
          <div className="shine-card mx-auto max-w-[960px] overflow-hidden rounded-[14px]">
            <BookingCalendar />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
