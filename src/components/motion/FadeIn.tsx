"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/** Reference site's ease-out-quart curve. */
const EASE = [0.165, 0.84, 0.44, 1] as const;

/**
 * How far out of focus content starts. The same entrance as the hero copy:
 * a little low, blurred and invisible, settling sharp into place. With
 * reduced motion only the opacity moves — a blur clearing is movement too.
 */
const BLUR = "blur(8px)";

/**
 * How far into the viewport an element is before it comes in. Enough that
 * it is seen arriving, not so much that a short element near the bottom of
 * a screen waits.
 */
const MARGIN = "-64px";

/**
 * How much later something at the bottom of the screen comes in than
 * something at the top, in seconds — for what is on screen when the page
 * loads, so it arrives top to bottom rather than all at once. Once the
 * page has been scrolled the cascade is off: an element scrolled into view
 * comes in as it arrives, at once, and is not made to wait for being near
 * the bottom edge, which is where everything scrolled into view is.
 */
const CASCADE = 0.28;

/** Whether the page has been scrolled since it loaded; see `CASCADE`. */
let scrolled = false;
let watching = false;
function watchScroll() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  window.addEventListener("scroll", () => (scrolled = true), {
    once: true,
    passive: true,
  });
}

const clamp = (v: number) => Math.min(1, Math.max(0, v));

function reveal(y: number, reducedMotion: boolean): Variants {
  return reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y, filter: BLUR },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
}

/**
 * How long an element waits before coming in, once it has entered the
 * viewport: its own delay plus its share of the cascade, from where it is
 * on the screen at that moment.
 */
function entryDelay(element: HTMLElement | null, delay: number) {
  if (scrolled) return delay;
  const top = element?.getBoundingClientRect().top ?? 0;
  return delay + CASCADE * clamp(top / window.innerHeight);
}

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

export function FadeIn({
  children,
  delay = 0,
  y = 12,
  duration = 0.7,
  className,
  once = true,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  /* Each element watches the viewport for itself, so whatever is scrolled
     into view comes in as it arrives — not earlier, when some ancestor's
     top edge did. */
  const [entry, setEntry] = useState({ on: false, delay });
  useEffect(watchScroll, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={entry.on ? "visible" : "hidden"}
      viewport={{ once, margin: MARGIN }}
      onViewportEnter={() =>
        setEntry({ on: true, delay: entryDelay(ref.current, delay) })
      }
      onViewportLeave={() => setEntry({ on: false, delay })}
      variants={reveal(y, Boolean(reducedMotion))}
      transition={{ duration, delay: entry.delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A set of items that come in as they arrive. The group itself is only a
 * box now — each item watches the viewport for itself — but keeping it in
 * the markup keeps the sections readable: the group is the thing that is
 * laid out, the items are the things that come in.
 */
export function StaggerGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <FadeIn className={className} duration={0.6}>
      {children}
    </FadeIn>
  );
}
