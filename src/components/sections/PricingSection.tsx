"use client";

import { useLanguage } from "@/lib/language-context";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/FadeIn";

export function PricingSection() {
  const { t } = useLanguage();

  return (
    <section id="priser" className="scroll-mt-20 border-t border-hairline">
      <div className="mx-auto max-w-[1340px] px-5 py-24 sm:px-8 sm:py-28">
        <SectionHeading title={t.pricing.title} subtitle={t.pricing.subtitle} />

        <StaggerGroup className="mx-auto mt-14 grid max-w-[960px] grid-cols-1 gap-3 lg:grid-cols-2">
          {t.pricing.tiers.map((tier, index) => {
            const featured = tier.id === "sprint";
            return (
              <StaggerItem
                key={tier.id}
                /* The two cards are lit from the corners facing each other, so
                   the highlight carries across the gap between them. */
                className={`shine-card rounded-[14px] ${
                  index === 0 ? "shine-from-top-right" : "shine-from-top-left"
                }`}
              >
                <div className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <h3 className="text-[15px] font-[510] tracking-[-0.011em] text-primary">
                      {tier.name}
                    </h3>
                  </div>

                  <p className="mt-5 text-[28px] font-[510] leading-none tracking-[-0.022em] text-primary sm:text-[32px]">
                    {tier.price}
                  </p>
                  <p className="mt-2 font-mono text-[11px] tracking-[0.04em] text-tertiary">
                    {tier.priceNote}
                  </p>

                  <p className="mt-5 text-[14px] leading-[1.6] tracking-[-0.011em] text-tertiary">
                    {tier.desc}
                  </p>

                  <ul className="mt-7 flex flex-col gap-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[14px] leading-[1.5] tracking-[-0.011em] text-secondary"
                      >
                        <svg
                          className="mt-[3px] h-3.5 w-3.5 shrink-0 text-accent"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M5 10.5l3 3 7-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* `mt-auto` on the wrapper, not the link: the tiers hold
                      different numbers of features, and the buttons should
                      still line up across the cards. */}
                  <div className="mt-auto pt-8">
                    <a
                      href="#book"
                      className={`inline-flex h-10 w-full items-center justify-center rounded-[10px] px-5 text-[13px] font-[510] tracking-[-0.011em] transition-all duration-150 ${
                        featured
                          ? "bg-primary text-background hover:opacity-90"
                          : "border border-line text-secondary hover:border-tertiary hover:text-primary"
                      }`}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
