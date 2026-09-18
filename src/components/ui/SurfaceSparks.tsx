"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { PLATFORM, platformPoint } from "@/lib/platform";

/**
 * Charges running across the hero platform: out of the distance, along a
 * grid line, over the rim and down the face into the void — or the same
 * journey the other way. The same light as the one that travels the wire in
 * the process timeline, let loose on a surface.
 *
 * Nothing about them is fixed. Every spark picks its own line, direction and
 * speed when it is spawned, and the pause before the next one is random too,
 * so no two viewings show the same pattern and there is no cycle to notice.
 * The picture it should make is of systems on the surface signalling each
 * other, not a lighting rig on a loop.
 *
 * The sparks are drawn straight into the DOM and driven with the Web
 * Animations API rather than rendered through React: a spark is a handful of
 * paths that live for three seconds, and the page has nothing to say about
 * them. It also keeps the per-spark numbers (path length, duration) out of
 * CSS keyframes, which cannot take them.
 */

/** Length of the lit stretch, in the platform's user units — head to the end of the tail. */
const SPARK_LEN = 180;

/**
 * A spark is a comet: a bright head with a tail that fades behind it. It is
 * drawn as dashes stacked on one line, each shorter than the one under it and
 * all ending at the same point — the head — so the light ramps up along the
 * tail and peaks there. The tail is long and faint on purpose: at the far end
 * it is barely brighter than the grid line it runs on, so the light reads as
 * the line itself lighting up rather than as something laid on top of it.
 *
 * Widths match the grid's own stroke for the same reason; only the two halo
 * layers around the head are wider. They are stroked, not blurred — a blur
 * filter has to re-rasterise its region every frame for every spark, and
 * with a dozen running that cost 16 fps. Wide strokes cost nothing.
 */
const LAYERS = [
  { len: 1, opacity: 0.05, width: 1 },
  { len: 0.78, opacity: 0.06, width: 1 },
  { len: 0.58, opacity: 0.08, width: 1 },
  { len: 0.42, opacity: 0.11, width: 1 },
  { len: 0.29, opacity: 0.15, width: 1 },
  { len: 0.18, opacity: 0.22, width: 1 },
  { len: 0.1, opacity: 0.34, width: 1 },
  { len: 0.05, opacity: 0.55, width: 1 },
  { len: 0.02, opacity: 1, width: 1.2 },
  { len: 0.14, opacity: 0.06, width: 7 },
  { len: 0.07, opacity: 0.1, width: 3 },
] as const;

/** Units per second. The spread is what keeps a pair of sparks from pacing each other. */
const SPEED = { min: 150, max: 250 };

/** Pause between spawns, in milliseconds. */
const SPAWN_GAP = { min: 300, max: 1000 };

/** Chance that a spawn is answered by a second one straight away. */
const REPLY_CHANCE = 0.35;

/**
 * Sparks alive at once, at most. The spawn rate is set so the mean sits
 * comfortably under this: once the cap is what governs, a new spark starts
 * the moment an old one ends and the rhythm turns regular again.
 */
const MAX_LIVE = 14;

/**
 * Where the descent ends. Just past the bottom of the frame: the mask has
 * taken the light to nothing by 97% of the height, so anything beyond that is
 * travel the viewer cannot see.
 */
const FACE_END_Y = PLATFORM.viewH + 20;

const SVG_NS = "http://www.w3.org/2000/svg";

const between = (min: number, max: number) => min + Math.random() * (max - min);

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/**
 * The dash pattern that puts a dash `len` long at the head end of the spark's
 * full length: a zero-length dash, a gap to the dash, the dash, then enough
 * gap that the pattern cannot repeat anywhere on a path of `pathLength`.
 * Every layer sharing the same total is what lets one offset move them all
 * in step, and every dash ending at the same point is what makes it a comet.
 */
function dashes(len: number, pathLength: number) {
  const total = pathLength + 2 * SPARK_LEN;
  const lead = SPARK_LEN - len;
  return `0 ${lead} ${len} ${total - lead - len}`;
}

/**
 * One random journey. A line is chosen on either axis, short of the rhombus'
 * own edges (those are the rim, drawn separately); the path is the grid line
 * from the far corner to the rim, then straight down the face column beneath
 * that point. Half the time it is walked the other way.
 */
function randomJourney() {
  const { gridExtent } = PLATFORM;
  const axis = Math.random() < 0.5 ? "u" : "v";
  const at = Math.floor(between(-gridExtent + 1, gridExtent));
  const toFront = Math.random() < 0.5;

  const rear =
    axis === "u"
      ? platformPoint(at, -gridExtent)
      : platformPoint(-gridExtent, at);
  const rim =
    axis === "u"
      ? platformPoint(at, gridExtent)
      : platformPoint(gridExtent, at);
  const foot = { x: rim.x, y: FACE_END_Y };

  const points = toFront ? [rear, rim, foot] : [foot, rim, rear];
  return {
    d: points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
    length: distance(rear, rim) + distance(rim, foot),
    label: `${axis}${at}${toFront ? "↓" : "↑"}`,
  };
}

function spawn(host: SVGGElement, onDone: () => void) {
  const { d, length, label } = randomJourney();
  const duration = (length / between(SPEED.min, SPEED.max)) * 1000;

  const group = document.createElementNS(SVG_NS, "g");
  group.dataset.spark = label;

  const finished: Promise<unknown>[] = [];
  for (const layer of LAYERS) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#f7f8f8");
    path.setAttribute("stroke-width", String(layer.width));
    path.setAttribute("stroke-opacity", String(layer.opacity));
    /* Butt caps, not round: the pattern starts with a zero-length dash to
       place each layer, and a round cap would draw that as a dot. */
    path.setAttribute("stroke-linecap", "butt");
    path.setAttribute(
      "stroke-dasharray",
      dashes(layer.len * SPARK_LEN, length),
    );
    group.appendChild(path);

    /* From one dash before the start to one past the end, so the dash is off
       the path at both bounds and nothing shows before or after the run. */
    const animation = path.animate(
      [{ strokeDashoffset: SPARK_LEN }, { strokeDashoffset: -length }],
      { duration, easing: "cubic-bezier(0.3, 0, 0.7, 1)", fill: "forwards" },
    );
    finished.push(animation.finished);
  }

  host.appendChild(group);
  Promise.all(finished)
    .catch(() => undefined) // cancelled on unmount; nothing to do
    .finally(() => {
      group.remove();
      onDone();
    });
}

export function SurfaceSparks() {
  const hostRef = useRef<SVGGElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (reducedMotion || !host || !host.ownerSVGElement) return;

    let live = 0;
    let visible = false;
    let timer: number | undefined;

    /* Only while the platform is on screen. Sparks already running are left
       to finish; new ones simply stop being scheduled, so scrolling back up
       does not meet a pile-up. */
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(host.ownerSVGElement);

    const tick = () => {
      if (visible && live < MAX_LIVE) {
        live += 1;
        spawn(host, () => (live -= 1));
        if (Math.random() < REPLY_CHANCE && live < MAX_LIVE) {
          live += 1;
          spawn(host, () => (live -= 1));
        }
      }
      timer = window.setTimeout(tick, between(SPAWN_GAP.min, SPAWN_GAP.max));
    };
    /* A short first wait so the first light lands as the hero has faded in. */
    timer = window.setTimeout(tick, 500);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      for (const path of host.querySelectorAll("path")) {
        for (const animation of path.getAnimations()) animation.cancel();
      }
      host.replaceChildren();
    };
  }, [reducedMotion]);

  return <g ref={hostRef} aria-hidden />;
}
