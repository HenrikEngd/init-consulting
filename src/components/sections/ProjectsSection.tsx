"use client";

import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/language-context";
import { testimonialFor, testimonials } from "@/lib/testimonials";
import type { Testimonial } from "@/lib/testimonials";
import type { Dictionary } from "@/lib/translations";

/** Number of times the card set is repeated. Must match `calc(-100% / 3)`. */
const SETS = 3;

type ProjectItem = Dictionary["projects"]["items"][number];

/** First letters of the first and last name, used when there is no photo. */
function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const picked = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return picked.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

/**
 * The client's photo, or their initials.
 *
 * Initials rather than a generic silhouette or a stock portrait: the circle has
 * to belong to the person being quoted, and a placeholder face would be the one
 * part of a real testimonial that is not real.
 */
function Avatar({ name, src }: { name: string; src?: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-hairline bg-[#ffffff0d]">
      {src ? (
        <Image
          src={src}
          alt=""
          width={72}
          height={72}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-mono text-[11px] tracking-[0.04em] text-tertiary">
          {initials(name)}
        </span>
      )}
    </span>
  );
}

function ProjectCard({
  item,
  quote,
  metricLabel,
}: {
  item: ProjectItem;
  quote: Testimonial | undefined;
  metricLabel: string;
}) {
  const { lang } = useLanguage();
  const text = quote ? (quote.quote[lang] ?? quote.quote.no) : null;

  return (
    /* `rail-card` carries the width, the right margin and the fade at the
       bottom — the margin is deliberate, a flex gap would break the loop, and
       the fade brings its own bottom padding so the attribution line always
       clears it; see globals.css. The surface and the lit edge come from
       `shine-card`.

       Same shape in both states: the work type as a small label, the statement
       set large, one 36px line on the baseline. A quote takes over the
       statement slot and the baseline, so a quoted card does not suddenly stand
       a head taller than the rest of the rail. */
    <article className="rail-card shine-card flex min-h-[416px] shrink-0 flex-col rounded-[14px] px-6 pt-7 sm:min-h-[456px] sm:px-7">
      <h3 className="text-[13px] font-[510] tracking-[-0.011em] text-tertiary">
        {item.title}
      </h3>

      {/* The statement sits centred in the body, so a two-line and a
          four-line quote both look placed rather than top-heavy. Both versions
          of the baseline under it are the height of the avatar, so the card's
          geometry — and with it where the fade starts — does not change when a
          quote arrives. */}
      {text && quote ? (
        <figure className="flex flex-1 flex-col">
          <blockquote className="flex flex-1 items-center py-7 text-[17px] leading-[1.45] tracking-[-0.016em] text-primary sm:text-[20px]">
            <p>&ldquo;{text}&rdquo;</p>
          </blockquote>

          <figcaption className="flex h-9 items-center gap-3">
            <Avatar name={quote.name} src={quote.avatar} />
            <span className="min-w-0 text-[13px] leading-[1.3] tracking-[-0.011em]">
              <span className="block truncate text-secondary">
                {quote.name}
              </span>
              <span className="block truncate text-tertiary">
                {quote.company}
              </span>
            </span>
          </figcaption>
        </figure>
      ) : (
        <>
          <div className="flex flex-1 items-center py-7">
            <p className="text-[17px] leading-[1.45] tracking-[-0.016em] text-secondary sm:text-[20px]">
              {item.desc}
            </p>
          </div>

          <p className="flex h-9 items-center font-mono text-[11px] tracking-[0.04em] text-tertiary/70">
            {metricLabel} · {item.metric}
          </p>
        </>
      )}
    </article>
  );
}

/**
 * Project types as a rail that scrolls on its own, held to the same content
 * column as the rest of the page and shadowed at both ends.
 *
 * Client feedback renders inside the card for the work it refers to, so the
 * rail becomes a testimonial carousel as soon as `testimonials.ts` has
 * entries, with no change here.
 */
export function ProjectsSection() {
  const { t } = useLanguage();
  const hasFeedback = testimonials.length > 0;

  return (
    <section
      id="prosjekter"
      className="scroll-mt-20 overflow-hidden border-t border-hairline py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[1340px] px-5 sm:px-8">
        <SectionHeading
          title={hasFeedback ? t.projects.title : t.projects.titleEmpty}
          subtitle={
            hasFeedback ? t.projects.subtitle : t.projects.subtitleEmpty
          }
        />

        {/* The reveal animation and the rail animation are on separate
            elements: both write `transform`, and Framer Motion's inline style
            would otherwise overwrite the keyframe and leave the rail still. */}
        <FadeIn className="mt-14">
          {/* The cards no longer cast a shadow — their own fade mask clips it
              — so this padding is now only breathing room around the rail. */}
          <div className="marquee-rail py-6">
            <div className="marquee-track">
              {Array.from({ length: SETS }, (_, setIndex) => (
                <div
                  key={setIndex}
                  className="flex"
                  aria-hidden={setIndex > 0 || undefined}
                >
                  {t.projects.items.map((item) => (
                    <ProjectCard
                      key={item.id}
                      item={item}
                      quote={testimonialFor(item.id)}
                      metricLabel={t.projects.metricLabel}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
