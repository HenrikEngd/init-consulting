"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/motion/FadeIn";
import { figures } from "@/components/ui/IsometricFigures";

/**
 * Seconds between one figure starting to build and the next, when the three
 * stand side by side and so come into view together. Stacked on a phone each
 * comes into view on its own and builds at once.
 */
const FIGURE_OFFSET = 0.2;

/** Whether the three columns are side by side: Tailwind's `lg`. */
function useSideBySide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 64rem)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}

/**
 * The section that answers "why would this work at all", directly under the
 * hero: one long sentence that starts in white and continues in grey, then
 * three columns divided by hairlines.
 *
 * No cards here on purpose. The cards further down the page are things a
 * reader acts on — a project, a price, a time slot — and keeping this section
 * flat is what makes those read as interactive.
 */
export function PrinciplesSection() {
  const { t } = useLanguage();
  const sideBySide = useSideBySide();

  return (
    <section id="tilnaermingen" className="scroll-mt-20">
      <div className="mx-auto max-w-[1340px] px-5 py-24 sm:px-8 sm:py-28">
        <FadeIn>
          <p className="max-w-[26ch] text-[28px] font-[510] leading-[1.18] tracking-[-0.02em] text-tertiary sm:max-w-[42ch] sm:text-[36px] lg:text-[40px]">
            <span className="text-primary">{t.principles.titleLead}</span>{" "}
            {t.principles.titleRest}
          </p>
        </FadeIn>

        <StaggerGroup className="mt-20 grid grid-cols-1 sm:mt-24 lg:grid-cols-3">
          {t.principles.items.map((item, i) => {
            const Figure = figures[i];
            return (
              <StaggerItem
                key={item.title}
                className="border-t border-line-faint pt-5 first:border-t-0 first:pt-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="font-mono text-[11px] tracking-[0.06em] text-tertiary/50">
                  {`FIG 0.${i + 1}`}
                </span>

                {Figure ? (
                  <Figure
                    className="mt-6 h-[210px] w-full max-w-[320px] sm:mt-8"
                    delay={sideBySide ? i * FIGURE_OFFSET : 0}
                  />
                ) : null}

                <h3 className="mt-6 text-[15px] font-[510] tracking-[-0.011em] text-primary sm:mt-8">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[34ch] pb-8 text-[14px] leading-[1.6] tracking-[-0.011em] text-tertiary lg:pb-0">
                  {item.desc}
                </p>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
