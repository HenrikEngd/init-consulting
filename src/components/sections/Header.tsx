"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
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
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const active = useActiveSection(navSectionIds);
  const pathname = usePathname();
  const onHome = pathname === "/";
  const fromCurrentPage = (href: string) =>
    href.startsWith("#") && !onHome ? `/${href}` : href;

  useEffect(() => {
    if (!languageOpen) return;

    const closeOnPointerDown = (event: PointerEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLanguageOpen(false);
    };

    document.addEventListener("pointerdown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [languageOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1340px] items-center justify-between px-5 sm:px-8">
        <a
          href={onHome ? "#top" : "/"}
          className="flex items-center gap-2.5 text-[15px] font-[560] tracking-[-0.011em] text-primary"
        >
          <LogoMark filled className="h-[17px] w-auto" />
          {siteConfig.name}
        </a>

        {/* Nav, language and CTA form one right-aligned group. */}
        <div className="flex items-center gap-5">
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map(({ key, href, id }) => {
              const current = id ? active === id : pathname === href;
              return (
                <a
                  key={key}
                  href={fromCurrentPage(href)}
                  className={`text-[13px] font-[510] tracking-[-0.011em] transition-colors duration-150 ${
                    current
                      ? "text-primary"
                      : "text-tertiary hover:text-primary"
                  }`}
                >
                  {t.nav[key]}
                </a>
              );
            })}
          </nav>

          <span className="hidden h-4 w-px bg-line md:block" />

          <div ref={languageRef} className="relative">
            <button
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setLanguageOpen(true);
                }
              }}
              aria-label={lang === "no" ? "Velg språk" : "Choose language"}
              aria-haspopup="menu"
              aria-expanded={languageOpen}
              aria-controls="language-menu"
              className="flex items-center gap-2 rounded-[6px] py-1 text-primary outline-none transition-colors hover:text-secondary focus-visible:ring-1 focus-visible:ring-primary/60"
            >
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className="h-3.5 w-3.5 text-tertiary"
                aria-hidden
              >
                <circle
                  cx="8"
                  cy="8"
                  r="5.75"
                  stroke="currentColor"
                  strokeWidth="1.15"
                />
                <path
                  d="M2.6 8h10.8M8 2.25c1.45 1.55 2.2 3.47 2.2 5.75S9.45 12.2 8 13.75C6.55 12.2 5.8 10.28 5.8 8S6.55 3.8 8 2.25Z"
                  stroke="currentColor"
                  strokeWidth="1.15"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-mono text-[11px] tracking-[0.04em]">
                {lang.toUpperCase()}
              </span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className={`h-3 w-3 text-tertiary transition-transform duration-200 ${
                  languageOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              >
                <path
                  d="m4.5 6.25 3.5 3.5 3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <AnimatePresence>
              {languageOpen ? (
                <motion.div
                  id="language-menu"
                  role="menu"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.16, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute top-full right-0 mt-2 w-[124px] overflow-hidden rounded-[10px] border border-line bg-[#101113] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.45)]"
                >
                  {(
                    [
                      ["no", "Norsk"],
                      ["en", "English"],
                    ] as const
                  ).map(([code, label]) => (
                    <button
                      key={code}
                      type="button"
                      role="menuitemradio"
                      aria-checked={lang === code}
                      onClick={() => {
                        setLang(code);
                        setLanguageOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[7px] px-3 py-2 text-left text-[12px] tracking-[-0.011em] transition-colors ${
                        lang === code
                          ? "bg-level-3 text-primary"
                          : "text-tertiary hover:bg-level-3 hover:text-primary"
                      }`}
                    >
                      {label}
                      <span className="font-mono text-[10px] tracking-[0.04em] text-tertiary">
                        {code.toUpperCase()}
                      </span>
                    </button>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <span className="hidden h-4 w-px bg-line sm:block" />

          <a
            href={onHome ? "#book" : "/#book"}
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
                  href={fromCurrentPage(href)}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-line-faint py-3.5 text-[14px] font-[510] text-secondary last:border-b-0"
                >
                  {t.nav[key]}
                </a>
              ))}
              <a
                href={onHome ? "#book" : "/#book"}
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
