"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/FadeIn";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * The questions a buyer asks between seeing what the work is and seeing what
 * it costs. Deliberately a hairline list rather than cards: the page already
 * carries three card surfaces, and a fourth would flatten the hierarchy.
 *
 * On wide screens the mark stands in the band the list leaves free on the
 * right, drawn in the same hairline as the figures further up the page.
 */
export function FaqSection() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="sporsmal" className="scroll-mt-20 border-t border-hairline">
      <div className="mx-auto max-w-[1340px] px-5 py-24 sm:px-8 sm:py-28">
        <SectionHeading title={t.faq.title} subtitle={t.faq.subtitle} />

        <div className="mt-14 xl:grid xl:grid-cols-[minmax(0,880px)_minmax(0,1fr)] xl:gap-x-16">
          <StaggerGroup className="max-w-[880px] border-t border-line-faint">
            {t.faq.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <StaggerItem
                  key={item.q}
                  className="border-b border-line-faint"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${i}`}
                      className="flex w-full items-start justify-between gap-6 py-5 text-left"
                    >
                      <span
                        className={`text-[15px] font-[510] tracking-[-0.011em] transition-colors duration-150 sm:text-[16px] ${
                          isOpen ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {item.q}
                      </span>
                      {/* A plus that becomes a minus: one bar rotates away. */}
                      <span
                        aria-hidden
                        className="relative mt-[7px] h-[11px] w-[11px] shrink-0 text-tertiary"
                      >
                        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
                        <span
                          className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-current transition-transform duration-200 ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        id={`faq-answer-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.24,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[70ch] pr-10 pb-6 text-[14px] leading-[1.65] tracking-[-0.011em] text-tertiary sm:text-[15px]">
                          {item.a}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </StaggerItem>
              );
            })}
          </StaggerGroup>

          {/* The mark, centred on the list and against the band's right edge. */}
          <div className="hidden xl:flex xl:items-center xl:justify-end">
            <LogoMark className="w-full max-w-[224px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
