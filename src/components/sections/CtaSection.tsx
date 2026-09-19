"use client";

import { useLanguage } from "@/lib/language-context";
import { siteConfig } from "@/lib/site-config";
import { FadeIn } from "@/components/motion/FadeIn";

/**
 * Closing statement. Centred, no supporting paragraph — the headline and
 * single contact action carry the whole section.
 */
export function CtaSection() {
  const { lang, t } = useLanguage();
  const mailtoHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    siteConfig.emailSubject[lang]
  )}`;

  return (
    <section
      id="kontakt"
      className="scroll-mt-20 border-t border-hairline"
    >
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 py-32 text-center sm:py-40">
        <FadeIn>
          <h2 className="mx-auto text-[32px] font-[510] leading-[1.08] tracking-[-0.022em] text-primary text-pretty sm:text-[48px] lg:text-[64px] lg:leading-[1.02]">
            {t.cta.titleLine1}
            <br />
            {t.cta.titleLine2}
          </h2>

          <div className="mt-10 flex justify-center">
            <a
              href={mailtoHref}
              className="inline-flex h-10 items-center justify-center rounded-[10px] bg-primary px-5 text-[14px] font-[510] tracking-[-0.011em] text-background transition-opacity duration-150 hover:opacity-90"
            >
              {t.cta.primary}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
