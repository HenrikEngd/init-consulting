"use client";

import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { HeroVisual } from "@/components/ui/HeroVisual";

/** Reference site's ease-out-quart curve. */
const EASE = [0.165, 0.84, 0.44, 1] as const;

/** Seconds between one piece of the hero copy arriving and the next. */
const STEP = 0.1;

/**
 * One piece of the hero copy arriving: it starts a little low, blurred and
 * invisible, and settles sharp into place — the reference's entrance, which
 * splits its headline into lines and lands them one after the other rather
 * than fading the block in as a whole. `order` is the piece's place in that
 * sequence.
 *
 * `inline-block` so the transform and blur have a box to act on without
 * taking the text out of the line it wraps in. With reduced motion the piece
 * only fades: a blur that clears is movement too.
 */
function Reveal({
  order,
  className,
  children,
}: {
  order: number;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      initial={
        reducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: "20%", filter: "blur(10px)" }
      }
      animate={
        reducedMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      transition={{ duration: 0.8, delay: 0.05 + order * STEP, ease: EASE }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.span>
  );
}

export function Hero() {
  const { t } = useLanguage();

  /* The headline is two sentences and is set to break between them, so a
     sentence is a line: each gets its own entrance. */
  const lines = t.hero.title.split(/(?<=[.!?])\s+/);

  return (
    <section id="top" className="relative scroll-mt-20 overflow-hidden">
      <div className="mx-auto max-w-[1340px] px-5 pt-[120px] pb-28 sm:px-8 sm:pt-[144px] lg:pt-[168px]">
        <h1 className="max-w-[20ch] text-balance text-[40px] font-[510] leading-[1.05] tracking-[-0.022em] text-primary sm:text-[56px] lg:text-[64px]">
          {/* The split copy is presentation; assistive tech reads the title
              whole, once, from the hidden span. */}
          <span aria-hidden>
            {lines.map((line, i) => (
              <Fragment key={i}>
                <Reveal order={i}>{line}</Reveal>
                {i < lines.length - 1 ? " " : null}
              </Fragment>
            ))}
          </span>
          <span className="sr-only">{t.hero.title}</span>
        </h1>

        {/* One row: short supporting line left, actions hugging the right.
            Both continue the sequence the headline started. */}
        <div className="mt-8 flex flex-col items-start gap-6 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <p className="text-[15px] leading-[1.6] tracking-[-0.011em] text-tertiary sm:text-[17px]">
            <Reveal order={lines.length}>{t.hero.subtitle}</Reveal>
          </p>

          <Reveal order={lines.length + 1} className="shrink-0">
            <a
              href="#book"
              className="group inline-flex items-center gap-2 text-[15px] font-[510] tracking-[-0.011em] text-primary transition-colors duration-150 hover:text-secondary sm:text-[17px]"
            >
              {t.hero.ctaPrimary}
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </Reveal>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
