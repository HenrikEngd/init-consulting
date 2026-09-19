"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { siteConfig } from "@/lib/site-config";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * The about page.
 *
 * A one-person business has to answer "who am I actually dealing with" before
 * anything else, and the front page cannot carry that without becoming about
 * the person rather than the work. So it lives here, in the same narrow column
 * and the same chrome as the booking page: the wordmark home, a way back, and
 * one column of text. No figures; there is nothing here to draw.
 *
 * No entrance animation, as on the booking page. `FadeIn` waits for its
 * element to cross into the viewport, which is the wrong bargain for a
 * short page whose whole content is above the fold and may never be
 * scrolled.
 */
const linkClass =
  "text-[13px] tracking-[-0.011em] text-tertiary transition-colors duration-150 hover:text-primary";

export function About() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto w-full max-w-[640px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <Link href="/" className="inline-flex items-center gap-2.5">
        <LogoMark filled className="h-[17px] w-auto text-primary" />
        <span className="text-[15px] font-[560] tracking-[-0.011em] text-primary">
          {siteConfig.name}
        </span>
      </Link>

      <Link
        href="/"
        className="group mt-10 inline-flex items-center gap-2 text-[13px] tracking-[-0.011em] text-tertiary transition-colors duration-150 hover:text-primary"
      >
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:-translate-x-1"
        >
          ←
        </span>
        {t.about.back}
      </Link>

      <div>
        <h1 className="mt-7 text-[32px] font-[510] leading-[1.1] tracking-[-0.022em] text-primary sm:text-[40px]">
          {t.about.heading}
        </h1>

        <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.6] tracking-[-0.011em] text-secondary">
          {t.about.lead}
        </p>

        <div className="mt-7 flex flex-col gap-5">
          {t.about.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="max-w-[70ch] text-[15px] leading-[1.65] tracking-[-0.011em] text-tertiary"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-14 border-t border-hairline pt-8">
        <h2 className="text-[13px] font-[510] tracking-[-0.011em] text-primary">
          {t.about.contactTitle}
        </h2>
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
          <li>
            <Link href="/#book" className={linkClass}>
              {t.about.contactBook}
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
