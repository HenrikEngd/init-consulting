"use client";

import { useLanguage } from "@/lib/language-context";
import { siteConfig } from "@/lib/site-config";
import { navAnchors } from "@/lib/nav";
import { FadeIn } from "@/components/motion/FadeIn";
import { LogoMark } from "@/components/ui/LogoMark";

const linkClass =
  "text-[13px] tracking-[-0.011em] text-tertiary transition-colors duration-150 hover:text-primary";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#23252a]">
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8 py-16">
        <FadeIn className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-[1fr_auto_auto] lg:gap-x-24">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2.5">
              <LogoMark filled className="h-[17px] w-auto text-primary" />
              <span className="text-[15px] font-[560] tracking-[-0.011em] text-primary">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 max-w-[34ch] text-[13px] leading-[1.6] tracking-[-0.011em] text-tertiary">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-[510] tracking-[-0.011em] text-primary">
              {t.footer.navTitle}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {navAnchors.map(({ key, id }) => (
                <li key={key}>
                  <a href={`#${id}`} className={linkClass}>
                    {t.nav[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-[510] tracking-[-0.011em] text-primary">
              {t.footer.contactTitle}
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
