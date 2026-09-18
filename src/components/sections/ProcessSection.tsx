"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/motion/FadeIn";

/**
 * Share of each gap, at either end, that the charge spends inside a marker:
 * it is held there before it emerges towards the next one, and held again
 * once that one has caught it.
 */
const DWELL = 0.1;

/**
 * How strongly the markers hold the charge, as the steepness of the curve
 * between them. 1 is a constant speed; higher makes the charge linger near
 * the marker it is leaving and again near the one it is reaching, crossing
 * the wire between them quickly. The curve is the same read either way, so
 * scrolling back is the same journey in reverse — the charge is pulled free
 * of a marker slowly and settles into the next, in both directions.
 */
const HOLD = 2.4;

/** How far out of a marker the charge is before that marker goes dark, in gaps. */
const HANDOVER = 0.34;

/** How far ahead a marker starts to glow for the charge coming towards it, in gaps. */
const REACH = 0.9;

/** How far the text of a step is dimmed while the charge is elsewhere. */
const TEXT_DIM = 0.5;

/** How much of a gap the text takes to come up or go down, in gaps. */
const TEXT_FADE = 0.3;

/**
 * The longest the beam's tail gets, in pixels. Leaving a marker the beam is
 * rooted in it and grows out along the wire; once it is this long it lets
 * go and trails the head.
 */
const TAIL_MAX = 160;

/**
 * Where on the screen the charge sits, as a share of the viewport height
 * from the top. The wire scrolls past this line and the charge stays on it
 * — apart from the hold the markers have on it — so it is always where the
 * reader is looking, and a step's marker lights as the step arrives there.
 */
const FOCUS = "58%";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * The curve between two markers: 0 at one, 1 at the next, flat at both and
 * steep in the middle. Symmetric, and its own inverse with the exponent
 * inverted, which is what lets the beam read back how far it has scrolled
 * from where the charge is.
 */
function hold(run: number, k: number) {
  const a = run ** k;
  const b = (1 - run) ** k;
  return a + b === 0 ? run : a / (a + b);
}

/** Where the markers are, in pixels down the list, and how tall the list is. */
interface WireLayout {
  nodes: number[];
  height: number;
}

/**
 * Measures the markers. The steps take their natural height, so the gaps
 * between markers are not equal and the wire has to be told where they are.
 * Read from layout offsets, not from bounding boxes: the steps are moved by
 * their reveal animation, and offsets ignore transforms.
 */
function useWireLayout(listRef: React.RefObject<HTMLDivElement | null>) {
  const [layout, setLayout] = useState<WireLayout>({ nodes: [], height: 0 });

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const nodes = Array.from(
        list.querySelectorAll<HTMLElement>("[data-marker]"),
        (marker) => {
          let y = marker.offsetHeight / 2;
          for (
            let el: HTMLElement | null = marker;
            el && el !== list;
            el = el.offsetParent as HTMLElement | null
          ) {
            y += el.offsetTop;
          }
          return y;
        },
      );
      setLayout({ nodes, height: list.offsetHeight });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [listRef]);

  return layout;
}

/**
 * Where the charge is, in markers: 0 at the first, `gaps` at the last.
 *
 * Read from where the focus line crosses the list, then smoothed with an
 * overdamped spring, so the charge moves like a thing with mass rather than
 * in scroll steps, and never overshoots a marker: the spring has no bounce
 * in it.
 */
function useTravel(
  listRef: React.RefObject<HTMLDivElement | null>,
  layout: WireLayout,
  gaps: number,
) {
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: [`start ${FOCUS}`, `end ${FOCUS}`],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.8,
    restDelta: 0.0005,
  });

  return useTransform(smooth, (v) => {
    const { nodes, height } = layout;
    if (nodes.length < 2) return 0;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const along = clamp((clamp(v) * height - first) / (last - first));
    const t = along * gaps;
    const marker = Math.min(Math.floor(t), gaps - 1);
    const f = t - marker;
    const run = clamp((f - DWELL) / (1 - 2 * DWELL));
    return marker + hold(run, HOLD);
  });
}

/**
 * One step's marker: a small dot on the wire, with a soft light rather than a
 * point around it. The light gathers as the charge comes towards it — the
 * pull made visible — and fills out while the charge is held inside. All of
 * it is blurred; the marker should feel lit, not switched on.
 */
function StepMarker({
  travel,
  index,
}: {
  travel: MotionValue<number>;
  index: number;
}) {
  const lit = useTransform(travel, (v) =>
    clamp(1 - Math.abs(v - index) / HANDOVER),
  );
  const pull = useTransform(travel, (v) => {
    const near = clamp(1 - Math.abs(v - index) / REACH);
    return near * near;
  });
  const coreOpacity = useTransform(lit, (l) => 0.9 * l);
  const coreScale = useTransform(lit, (l) => 0.8 + 0.6 * l);
  const haloOpacity = useTransform(pull, (p) => 0.6 * p);
  const haloScale = useTransform(lit, (l) => 0.7 + 0.8 * l);

  return (
    <span
      data-marker
      className="relative mt-[5px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full sm:mt-[7px]"
    >
      <span className="h-[5px] w-[5px] rounded-full bg-tertiary/50" />
      <motion.span
        aria-hidden
        style={{ opacity: haloOpacity, scale: haloScale }}
        className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[11px]"
      />
      <motion.span
        aria-hidden
        style={{ opacity: coreOpacity, scale: coreScale }}
        className="absolute top-1/2 left-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/80 blur-[3px]"
      />
    </span>
  );
}

/** A step's text, brought up while the charge belongs to that step. */
function StepText({
  travel,
  index,
  isLast,
  dimmed,
  children,
}: {
  travel: MotionValue<number>;
  index: number;
  isLast: boolean;
  dimmed: boolean;
  children: React.ReactNode;
}) {
  const opacity = useTransform(
    travel,
    isLast
      ? [index - TEXT_FADE, index]
      : [index - TEXT_FADE, index, index + 1 - TEXT_FADE, index + 1],
    isLast ? [TEXT_DIM, 1] : [TEXT_DIM, 1, 1, TEXT_DIM],
  );

  return (
    <motion.div
      style={
        dimmed ? ({ "--step-lit": opacity } as React.CSSProperties) : undefined
      }
      className="flex flex-col opacity-[var(--step-lit,1)]"
    >
      {children}
    </motion.div>
  );
}

/**
 * The light on the wire: a beam with its bright end at the charge and a tail
 * fading away behind it. Scrolling away from a marker draws the beam out of
 * it down the wire, rooted there until the tail is as long as it gets; then
 * it trails the head to the next marker, where the head — never anything
 * ahead of it — arrives, and the beam is taken in as the marker's own light
 * comes up. The beam is what the charge looks like; there is no separate
 * point of light to overshoot.
 *
 * The tail is always behind: scrolling back, the beam grows out of the
 * marker the charge has just left, which is now the one below. Two beams
 * are drawn, one facing each way, and which is shown follows the direction
 * the charge is moving in — through a short spring, so a change of
 * direction is a crossfade, and the last direction is kept while the charge
 * is still, so nothing flips when scrolling stops.
 */
function WireBeam({
  travel,
  layout,
}: {
  travel: MotionValue<number>;
  layout: WireLayout;
}) {
  const { nodes } = layout;
  const first = nodes[0] ?? 0;
  const last = nodes[nodes.length - 1] ?? 0;

  /* The gap the charge is in, how far along it is, and where that is. */
  const place = (v: number) => {
    const m = Math.max(0, Math.min(Math.floor(v), nodes.length - 2));
    const p = nodes.length < 2 ? 0 : v - m;
    const gap = nodes.length < 2 ? 0 : nodes[m + 1] - nodes[m];
    return { p, gap, y: (nodes[m] ?? 0) + p * gap };
  };
  const head = useTransform(travel, (v) => place(v).y);
  const litHeight = useTransform(head, (y) => Math.max(0, y - first));

  const velocity = useVelocity(travel);
  const lastDirection = useRef(1);
  const direction = useTransform(velocity, (vel) => {
    if (Math.abs(vel) > 0.02) lastDirection.current = Math.sign(vel);
    return lastDirection.current;
  });
  const facing = useSpring(direction, { stiffness: 220, damping: 30 });
  const forwardShare = useTransform(facing, (d) => clamp(d));
  const backwardShare = useTransform(facing, (d) => clamp(-d));

  const tailForward = useTransform(travel, (v) => {
    const { p, gap } = place(v);
    return Math.min(p * gap, TAIL_MAX);
  });
  const tailBackward = useTransform(travel, (v) => {
    const { p, gap } = place(v);
    return Math.min((1 - p) * gap, TAIL_MAX);
  });
  /* Fades key off how far the charge has scrolled from a marker, not how
     far it has moved: it lingers, so the two differ. */
  const visible = useTransform(travel, (v) => {
    const r = hold(place(v).p, 1 / HOLD);
    return clamp(Math.min(r / 0.1, (1 - r) / 0.1));
  });
  const forwardOpacity = useTransform(
    [visible, forwardShare],
    ([o, d]) => (o as number) * (d as number),
  );
  const backwardOpacity = useTransform(
    [visible, backwardShare],
    ([o, d]) => (o as number) * (d as number),
  );

  if (nodes.length < 2) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 bottom-0 left-0 w-4"
    >
      {/* The wire, and the stretch of it the charge has covered. */}
      <span
        style={{ top: first, height: last - first }}
        className="absolute left-1/2 w-px -translate-x-1/2 bg-line-faint"
      />
      <motion.span
        style={{ top: first, height: litHeight }}
        className="absolute left-1/2 w-px -translate-x-1/2 bg-[#ffffff2e]"
      />

      {/* Facing down: the head at the bottom end, the tail above it. */}
      <motion.span
        style={{ top: head, height: tailForward, opacity: forwardOpacity }}
        className="absolute left-0 w-4 -translate-y-full"
      >
        <span className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,transparent,rgba(247,248,248,0.5))] blur-[6px]" />
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,transparent,#f7f8f8)]" />
      </motion.span>

      {/* Facing up: the head at the top end, the tail trailing below. */}
      <motion.span
        style={{ top: head, height: tailBackward, opacity: backwardOpacity }}
        className="absolute left-0 w-4"
      >
        <span className="absolute inset-y-0 left-1/2 w-[7px] -translate-x-1/2 rounded-full bg-[linear-gradient(0deg,transparent,rgba(247,248,248,0.5))] blur-[6px]" />
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(0deg,transparent,#f7f8f8)]" />
      </motion.span>
    </div>
  );
}

/**
 * The steps as a vertical roadmap: one wire down the left, a marker on it
 * for each step, the step's text beside it. Reading down the page is
 * following the wire, and the charge on it keeps pace with the reader.
 */
export function ProcessSection() {
  const { t } = useLanguage();
  const listRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const layout = useWireLayout(listRef);

  const count = t.process.steps.length;
  const gaps = Math.max(count - 1, 1);
  const travel = useTravel(listRef, layout, gaps);

  return (
    <section id="prosessen" className="scroll-mt-20 border-t border-hairline">
      <div className="mx-auto max-w-[1340px] px-5 py-24 sm:px-8 sm:py-28">
        <SectionHeading title={t.process.title} subtitle={t.process.subtitle} />

        <div ref={listRef} className="relative mt-16 max-w-[720px] sm:mt-24">
          {reducedMotion ? (
            layout.nodes.length > 1 ? (
              <span
                aria-hidden
                style={{
                  top: layout.nodes[0],
                  height:
                    layout.nodes[layout.nodes.length - 1] - layout.nodes[0],
                }}
                className="absolute left-2 w-px -translate-x-1/2 bg-line-faint"
              />
            ) : null
          ) : (
            <WireBeam travel={travel} layout={layout} />
          )}

          <StaggerGroup>
            {t.process.steps.map((step, i) => (
              <StaggerItem
                key={step.number}
                className="grid grid-cols-[16px_1fr] gap-x-6 pb-20 last:pb-0 sm:gap-x-10 sm:pb-28"
              >
                <div aria-hidden>
                  {reducedMotion ? (
                    <span
                      data-marker
                      className="relative mt-[5px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full sm:mt-[7px]"
                    >
                      <span className="h-[5px] w-[5px] rounded-full bg-tertiary/50" />
                    </span>
                  ) : (
                    <StepMarker travel={travel} index={i} />
                  )}
                </div>

                <StepText
                  travel={travel}
                  index={i}
                  isLast={i === count - 1}
                  dimmed={!reducedMotion}
                >
                  <h3 className="text-[20px] font-[510] leading-[1.25] tracking-[-0.016em] text-primary sm:text-[24px]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.6] tracking-[-0.011em] text-tertiary sm:text-[17px]">
                    {step.desc}
                  </p>
                  <p className="mt-6 font-mono text-[12px] tracking-[0.06em] text-tertiary/50">
                    {step.number}
                  </p>
                </StepText>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
