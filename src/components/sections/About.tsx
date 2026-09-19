"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { siteConfig } from "@/lib/site-config";
import { FadeIn } from "@/components/motion/FadeIn";
import { LogoMark } from "@/components/ui/LogoMark";

/**
 * The about page.
 *
 * A one-person business has to answer "who am I actually dealing with" before
 * anything else, and the front page cannot carry that without becoming about
 * the person rather than the work. So it lives here, with the same restrained
 * chrome as the rest of the site: the shared navigation and a portrait beside
 * a concise professional biography.
 *
 * The portrait is the one photograph on the site. It is information, not
 * decoration: the reader is deciding whether to let a stranger into their
 * systems, and a face is part of that. Nothing else here is illustrated.
 *
 * The portrait and copy arrive in a short sequence. The shared `FadeIn`
 * primitive keeps that motion consistent with the front page and respects the
 * reader's reduced-motion preference.
 */
const linkClass =
  "text-[13px] tracking-[-0.011em] text-tertiary transition-colors duration-150 hover:text-primary";

/** A two-times intrinsic size keeps the portrait sharp at its 280px maximum. */
const PORTRAIT = 560;

export function About() {
  const { t } = useLanguage();
  const experience = t.about.experience;

  return (
    <main className="mx-auto w-full max-w-[960px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      <div className="grid items-start gap-10 sm:grid-cols-[240px_minmax(0,1fr)] sm:gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
        <FadeIn y={8} duration={0.65}>
          {siteConfig.portrait ? (
            <Image
              src={siteConfig.portrait}
              alt={t.about.portraitAlt}
              width={PORTRAIT}
              height={PORTRAIT}
              sizes="(max-width: 639px) 280px, (max-width: 1023px) 240px, 280px"
              className="aspect-square w-full max-w-[280px] rounded-[14px] border border-hairline object-cover"
            />
          ) : (
            /* No photograph yet. The mark holds the block so the page keeps its
               shape, rather than a path that would 404. */
            <div
              aria-hidden
              className="flex aspect-square w-full max-w-[280px] items-center justify-center rounded-[14px] border border-hairline"
            >
              <LogoMark className="w-[88px]" />
            </div>
          )}
        </FadeIn>

        <div>
          <FadeIn y={10} duration={0.65}>
            <h1 className="text-[32px] font-[510] leading-[1.1] tracking-[-0.022em] text-primary sm:text-[40px]">
              {t.about.heading}
            </h1>
          </FadeIn>

          <FadeIn delay={0.06} y={10} duration={0.65}>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.6] tracking-[-0.011em] text-secondary">
              {t.about.lead}
            </p>
          </FadeIn>

          <FadeIn delay={0.12} y={10} duration={0.65}>
            <div className="mt-6 flex flex-col gap-4">
              {t.about.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="max-w-[70ch] text-[15px] leading-[1.65] tracking-[-0.011em] text-tertiary"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {experience.length > 0 ? (
        <FadeIn className="mt-14">
          <section className="border-t border-hairline pt-8">
            <h2 className="text-[13px] font-[510] tracking-[-0.011em] text-primary">
              {t.about.experienceTitle}
            </h2>
            <ul className="mt-4">
              {experience.map((item) => (
                <li
                  key={`${item.org}-${item.period}`}
                  className="flex items-baseline justify-between gap-6 border-b border-line-faint py-3.5 last:border-b-0"
                >
                  <span className="text-[14px] tracking-[-0.011em] text-secondary">
                    <span className="text-primary">{item.role}</span>
                    {item.org ? `, ${item.org}` : ""}
                  </span>
                  <span className="shrink-0 font-mono text-[11px] tracking-[0.04em] text-tertiary">
                    {item.period}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>
      ) : null}

      <FadeIn className="mt-14">
        <section className="border-t border-hairline pt-8">
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
        </section>
      </FadeIn>
    </main>
  );
}
