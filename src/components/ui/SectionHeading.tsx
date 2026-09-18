import { FadeIn } from "@/components/motion/FadeIn";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

/**
 * Title on the left, supporting copy in a right-hand column.
 * Deliberately has no kicker/eyebrow label above the heading.
 */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <FadeIn>
      <div className="grid grid-cols-1 gap-x-16 gap-y-5 lg:grid-cols-2">
        <h2 className="max-w-[24ch] text-[32px] font-[510] leading-[1.1] tracking-[-0.02em] text-primary sm:text-[40px]">
          {title}
        </h2>
        {subtitle ? (
          <p className="max-w-[52ch] self-start text-[15px] leading-[1.6] tracking-[-0.011em] text-tertiary sm:text-[17px] lg:pt-2">
            {subtitle}
          </p>
        ) : null}
      </div>
    </FadeIn>
  );
}
