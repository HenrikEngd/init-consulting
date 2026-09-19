"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { siteConfig } from "@/lib/site-config";
import { navItems, navSectionIds } from "@/lib/nav";
import { LogoMark } from "@/components/ui/LogoMark";

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export function Header() {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const active = useActiveSection(navSectionIds);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1340px] items-center justify-between px-5 sm:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-[15px] font-[560] tracking-[-0.011em] text-primary"
        >
          <LogoMark filled className="h-[17px] w-auto" />
          {siteConfig.name}
        </a>

        {/* Nav, language and CTA form one right-aligned group. */}
        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map(({ key, href, id }) => (
              <a
                key={key}
                href={href}
                className={`text-[13px] font-[510] tracking-[-0.011em] transition-colors duration-150 ${
                  active === id
                    ? "text-primary"
                    : "text-tertiary hover:text-primary"
                }`}
              >
                {t.nav[key]}
              </a>
            ))}
          </nav>

          <span className="hidden h-4 w-px bg-line md:block" />

          <button
            type="button"
            onClick={toggleLang}
            aria-label="Change language"
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.04em] text-tertiary transition-colors hover:text-primary"
          >
            <span className={lang === "no" ? "text-primary" : ""}>NO</span>
            <span className="text-line">/</span>
            <span className={lang === "en" ? "text-primary" : ""}>EN</span>
          </button>

          <a
            href="#book"
            className="hidden rounded-[10px] bg-primary px-3.5 py-[7px] text-[13px] font-[510] tracking-[-0.011em] text-background transition-opacity duration-150 hover:opacity-90 sm:inline-flex"
          >
            {t.nav.cta}
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="-mr-1.5 flex h-8 w-8 items-center justify-center text-primary md:hidden"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-[18px] w-[18px]"
              aria-hidden
            >
              {mobileOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 7h14M3 13h14"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden border-t border-hairline bg-background md:hidden"
          >
            <nav className="flex flex-col px-5 py-2 sm:px-8">
              {navItems.map(({ key, href }) => (
                <a
                  key={key}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-line-faint py-3.5 text-[14px] font-[510] text-secondary last:border-b-0"
                >
                  {t.nav[key]}
                </a>
              ))}
              <a
                href="#book"
                onClick={() => setMobileOpen(false)}
                className="my-3 rounded-[10px] bg-primary px-4 py-2.5 text-center text-[13px] font-[510] text-background"
              >
                {t.nav.cta}
              </a>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
