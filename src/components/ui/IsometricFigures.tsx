"use client";

/**
 * Line figures for the principles section, and the hero platform.
 *
 * All are drawn on the same isometric grid — a 2:1 rhombus, so a horizontal
 * step of 2 units matches a vertical step of 1 — and share one stroke weight
 * and palette, and the three small figures are built from unit cubes in the
 * platform's own proportions (see `Cube`), which is what makes them read as
 * a set with it rather than as unrelated drawings. Purely decorative, so they carry no
 * title and are hidden from assistive technology by the caller.
 */

import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { SurfaceSparks } from "@/components/ui/SurfaceSparks";
import {
  CELLS_ACROSS,
  FACE_ROWS,
  PLATFORM,
  cellFade,
  cellDistance,
  cellGlow,
  cellPoints,
  platformPoint,
  type Cell,
  type Face,
} from "@/lib/platform";

interface FigureProps {
  className?: string;
  /** Seconds the figure waits before building, on top of its own start. */
  delay?: number;
}

const svgProps = {
  viewBox: "0 0 320 230",
  fill: "none",
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

const FACE = "#0c0d0e";

/** Stroke opacity of the stronger and the fainter line of the figures. */
const LINE_STRONG = 0.19;
const LINE_FAINT = 0.086;

/** Fill opacity of the white over a cube that is lit by the pointer. */
const CUBE_LIT = 0.14;

/** Fill opacity of the white over the cube a figure singles out at rest. */
const CUBE_MARKED = 0.08;

/** How a cube moves when it is drawn to another: quick, with a small settle. */
const PULL: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

/** How a cube's light comes up and goes down. */
const GLOW: Transition = { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] };

/**
 * When a figure starts building after it comes into view, in seconds: late
 * enough that its column has cleared its own entrance blur, so the cubes are
 * seen arriving, not smeared. And how long one part waits on the one before.
 */
const BUILD_START = 0.25;
const BUILD_STEP = 0.12;

/**
 * How a part settles into place as a figure builds: slower and softer than
 * `PULL`, which answers the pointer. Building is watched, not driven, so it
 * should flow rather than snap, and land without a bounce.
 */
const SETTLE: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 24,
  mass: 1,
};

/** How a part comes up to full opacity as it settles. */
const APPEAR: Transition = { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] };

/** How far into the viewport a figure is before it starts to build. */
const BUILD_MARGIN = "-64px";

/**
 * One part of a figure building itself. It is invisible and a little out of
 * place until the figure is in view; then, after the figure's own `delay`
 * and its turn in the order, it settles into place and comes up to full
 * opacity.
 * `from` is where it comes from, in the frame's units: negative from above,
 * as a cube set down, positive from below, as one rising; zero only fades.
 * Under reduced motion every part only fades, still in order.
 */
function Build({
  on,
  order,
  delay: figureDelay = 0,
  from = 0,
  children,
}: {
  on: boolean;
  order: number;
  delay?: number;
  from?: number;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  const delay = BUILD_START + figureDelay + order * BUILD_STEP;
  return (
    <motion.g
      initial={{ opacity: 0, y: reducedMotion ? 0 : from }}
      animate={on ? { opacity: 1, y: 0 } : undefined}
      transition={{
        y: { ...SETTLE, delay },
        opacity: { ...APPEAR, delay },
      }}
    >
      {children}
    </motion.g>
  );
}

/** Half-width and half-height of the isometric rhombus used throughout. */
const W = 78;
const H = 39;

/** The top face of a box centred on (cx, cy). */
function rhombus(cx: number, cy: number, w = W, h = H) {
  return `${cx},${cy - h} ${cx + w},${cy} ${cx},${cy + h} ${cx - w},${cy}`;
}

/**
 * A unit cube in the hero platform's proportions: a 2:1 rhombus on top and a
 * vertical edge as long as the rhombus is wide from centre to corner — which
 * is what the platform's face rows use, so its cells are the tops of cubes
 * exactly like these. `cx, cy` is the centre of the bottom face; `w` is the
 * half-width of the top face and sets the size.
 *
 * Drawn sides first, top last, so the top covers the sides' upper edges.
 * Sides are the faint line, the top the stronger one, as on the platform,
 * where the rim reads and the faces recede. A lit cube takes the same white
 * over all three visible sides, which is how the platform lights a cube.
 * Light and emphasis are animated, so a cube responding to the pointer
 * comes up rather than snaps.
 */
function Cube({
  cx,
  cy,
  w,
  lit = 0,
  emphasis = false,
}: {
  cx: number;
  cy: number;
  w: number;
  /** Fill opacity of the white over the three visible sides. */
  lit?: number;
  /** Draw every edge in the stronger line; otherwise only the top's. */
  emphasis?: boolean;
}) {
  const h = w / 2;
  const height = 2 * h;
  const top = cy - height;
  const faces = [
    `M ${cx - w} ${top} L ${cx} ${top + h} L ${cx} ${cy + h} L ${cx - w} ${cy} Z`,
    `M ${cx + w} ${top} L ${cx} ${top + h} L ${cx} ${cy + h} L ${cx + w} ${cy} Z`,
    `M ${cx} ${top - h} L ${cx + w} ${top} L ${cx} ${top + h} L ${cx - w} ${top} Z`,
  ];
  return (
    <g>
      {faces.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill={FACE}
          stroke="#ffffff"
          strokeWidth="1"
          initial={false}
          animate={{ strokeOpacity: emphasis ? LINE_STRONG : LINE_FAINT }}
          transition={GLOW}
        />
      ))}
      {faces.map((d, i) => (
        <motion.path
          key={`lit-${i}`}
          d={d}
          fill="#ffffff"
          initial={false}
          animate={{ fillOpacity: lit }}
          transition={GLOW}
          style={{ pointerEvents: "none" }}
        />
      ))}
    </g>
  );
}

/**
 * A stack of cubes: the same task, arriving again every week.
 *
 * Each cube stands a little clear of the one beneath it rather than fused
 * into a column, so they count as separate units — one arrival each — and
 * the top one, the one being dealt with now, is the one marked.
 *
 * Under the pointer the stack closes up around the cube pointed at: the
 * middle cube is drawn to the top or the bottom one, and the top and bottom
 * both to the middle, and the cubes that meet light together. Under reduced
 * motion they light without moving.
 *
 * The pointer is read from fixed regions — each cube's outline where it
 * rests, stretched to meet its neighbours' halfway across the gaps — not
 * from the cubes, which move. A cube drawn towards the pointer would
 * otherwise slide under it and take the hover with it, and the stack would
 * flicker between two states.
 *
 * Coming into view the stack builds itself: the cubes are set down from
 * above one at a time, bottom first.
 */
export function FigureStack({ className, delay }: FigureProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: BUILD_MARGIN });
  const [hover, setHover] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const cx = 160;
  const w = 42;
  const h = w / 2;
  const gap = 8;
  const step = w + gap;
  const count = 3;
  const bottom = 186;
  const top = count - 1;

  /* Which cubes a hover joins: the pointed one and the middle; from the
     middle, all three. */
  const joined = (i: number) =>
    hover !== null && (hover === 1 || i === hover || i === 1);
  /* Where a joined cube goes: the middle towards whichever end is pointed
     at; the ends towards the middle, and only when it is the middle that is
     pointed at. */
  const shift = (i: number) => {
    if (hover === null || reducedMotion || !joined(i)) return 0;
    if (i === 1) return hover === top ? -gap : hover === 0 ? gap : 0;
    if (hover !== 1) return 0;
    return i === top ? gap : -gap;
  };
  /* The resting outline of cube `i`, reaching half a gap above and below. */
  const region = (i: number) => {
    const cy = bottom - i * step;
    const t = cy - 2 * h;
    const reach = gap / 2;
    return `${cx},${t - h - reach} ${cx + w},${t - reach} ${cx + w},${cy + reach} ${cx},${cy + h + reach} ${cx - w},${cy + reach} ${cx - w},${t - reach}`;
  };

  return (
    <svg
      {...svgProps}
      ref={ref}
      className={className}
      aria-hidden
      onPointerLeave={() => setHover(null)}
    >
      {/* Bottom up, so a higher cube covers the top of the one under it. */}
      {Array.from({ length: count }, (_, i) => (
        <Build key={i} on={inView} delay={delay} order={i} from={-16}>
          <motion.g
            initial={false}
            animate={{ y: shift(i) }}
            transition={PULL}
            style={{ pointerEvents: "none" }}
          >
            <Cube
              cx={cx}
              cy={bottom - i * step}
              w={w}
              emphasis={hover === null ? i === top : joined(i)}
              lit={
                joined(i)
                  ? CUBE_LIT
                  : hover === null && i === top
                    ? CUBE_MARKED
                    : 0
              }
            />
          </motion.g>
        </Build>
      ))}
      {Array.from({ length: count }, (_, i) => (
        <polygon
          key={`region-${i}`}
          points={region(i)}
          fill="transparent"
          onPointerEnter={() => setHover(i)}
        />
      ))}
    </svg>
  );
}

/**
 * Four cubes on the same plane: separate agents, one system.
 *
 * The plane is a 3 × 3 patch of the platform's grid and the cubes sit on
 * its cells — the four that touch the centre one — so they stand where the
 * grid would put them, meeting at their corners: parts of one thing.
 *
 * Left alone, one of them lights for a moment now and then, never the same
 * one twice running — a word passing between them. The dashes of the plane
 * drift slowly the same way (see `.plane-drift`). Under the pointer a cube
 * lights and holds.
 *
 * Coming into view the plane appears first, and the cubes rise onto it one
 * at a time, back to front.
 */
export function FigureAgents({ className, delay }: FigureProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: BUILD_MARGIN });
  const [hover, setHover] = useState<number | null>(null);
  const [signal, setSignal] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const w = 40;
  const h = w / 2;
  const origin = { x: 160, y: 60 };
  /* Grid to frame: `u` runs down-right, `v` down-left, in cells. */
  const at = (u: number, v: number) => ({
    x: origin.x + (u - v) * w,
    y: origin.y + (u + v) * h,
  });
  /* Cell centres, back to front, so a nearer cube covers what is behind. */
  const cells = [
    [1, 0],
    [0, 1],
    [2, 1],
    [1, 2],
  ] as const;

  useEffect(() => {
    if (reducedMotion) return;
    let timer: number | undefined;
    let last = -1;
    const speak = () => {
      let next = last;
      while (next === last) next = Math.floor(Math.random() * cells.length);
      last = next;
      setSignal(next);
      timer = window.setTimeout(() => {
        setSignal(null);
        timer = window.setTimeout(speak, 900 + Math.random() * 1800);
      }, 650);
    };
    timer = window.setTimeout(speak, 1200);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, cells.length]);

  return (
    <svg
      {...svgProps}
      ref={ref}
      className={className}
      aria-hidden
      onPointerLeave={() => setHover(null)}
    >
      {/* The plane the cubes stand on. */}
      <Build on={inView} delay={delay} order={0}>
        <polygon
          points={rhombus(origin.x, origin.y + 3 * h, 3 * w, 3 * h)}
          stroke="#ffffff"
          strokeOpacity={LINE_FAINT}
          strokeWidth="1"
          strokeDasharray="2 5"
          className="plane-drift"
        />
      </Build>

      {cells.map(([u, v], i) => {
        const centre = at(u + 0.5, v + 0.5);
        return (
          <g key={`${u}-${v}`} onPointerEnter={() => setHover(i)}>
            <Build on={inView} delay={delay} order={i + 1} from={12}>
              <Cube
                cx={centre.x}
                cy={centre.y}
                w={w}
                emphasis
                lit={hover === i ? CUBE_LIT : signal === i ? CUBE_MARKED : 0}
              />
            </Build>
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Columns rising away: the hours the task used to take, week by week.
 *
 * Three columns of unit cubes — one, two, three — on cells two apart along
 * `v`, so they climb from the front left towards the back right and the
 * whole figure keeps the platform's geometry. The same orientation as on
 * the LinkedIn banner.
 *
 * The pointer moves the crest: whichever column it is over grows to three
 * and the others fall away from it, a cube at a time, so the tops make a
 * wave with the pointer at its peak. Cubes rise out of the column beneath
 * and sink back into it; the dashed line follows the tops.
 *
 * Coming into view the columns build themselves the same way, a cube at a
 * time from the ground up, the one-cube column first and the three-cube
 * column last, and the line is drawn over the tops once they are there.
 */
export function FigureHours({ className, delay }: FigureProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: BUILD_MARGIN });
  const [hover, setHover] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const w = 28;
  const h = w / 2;
  const levels = 3;
  /* Column heights with the crest at each column in turn. */
  const waves = [
    [3, 2, 1],
    [2, 3, 2],
    [1, 2, 3],
  ];
  const heights = waves[hover ?? waves.length - 1];
  const marked = hover ?? 0;
  /* The build's timing: each column starts a step after the one before,
     and within a column the cubes stack at half steps, so a column is up
     almost as soon as it is begun. The line follows the last column. */
  const turn = (i: number, level: number) => i + level / 2;
  const lastTurn = turn(heights.length - 1, levels - 1);
  const start = { x: 104, y: 185 };
  /* Two cells along `v` per column, away from the viewer: one cell of grid
     between neighbours, and each column a step further back. */
  const stepX = 2 * w;
  const stepY = 2 * h;
  const column = (i: number) => ({
    cx: start.x + i * stepX,
    base: start.y - i * stepY,
  });

  const tops = heights
    .map((height, i) => {
      const { cx, base } = column(i);
      return `${i === 0 ? "M" : "L"} ${cx} ${base - height * 2 * h - h}`;
    })
    .join(" ");

  return (
    <svg
      {...svgProps}
      ref={ref}
      className={className}
      aria-hidden
      onPointerLeave={() => setHover(null)}
    >
      {/* Back column first, so a nearer column covers what is behind it;
          the build order is the other way round, so it still runs one, two,
          three. */}
      {[...heights.keys()].reverse().map((i) => {
        const height = heights[i];
        const { cx, base } = column(i);
        return (
          <g key={i}>
            {Array.from({ length: levels }, (_, level) => {
              const up = level < height;
              return (
                <Build
                  key={level}
                  on={inView}
                  delay={delay}
                  order={turn(i, level)}
                  from={2 * h}
                >
                  <motion.g
                    initial={false}
                    animate={{
                      opacity: up ? 1 : 0,
                      y: up || reducedMotion ? 0 : 2 * h,
                    }}
                    transition={PULL}
                  >
                    <Cube
                      cx={cx}
                      cy={base - level * 2 * h}
                      w={w}
                      emphasis={i === marked}
                      lit={i === marked ? CUBE_MARKED : 0}
                    />
                  </motion.g>
                </Build>
              );
            })}
            {/* The whole column's reach takes the pointer, cubes or not, so
                the crest can be called to a column that is one cube tall. */}
            <rect
              x={cx - w}
              y={base - levels * 2 * h - h}
              width={2 * w}
              height={levels * 2 * h + 2 * h}
              fill="transparent"
              onPointerEnter={() => setHover(i)}
            />
          </g>
        );
      })}

      {/* The line the tops climb along. */}
      <Build on={inView} delay={delay} order={lastTurn + 1 / 2}>
        <motion.path
          initial={false}
          animate={{ d: tops }}
          transition={PULL}
          stroke="#ffffff"
          strokeOpacity={LINE_STRONG}
          strokeWidth="1"
          strokeDasharray="2 4"
          style={{ pointerEvents: "none" }}
        />
      </Build>
    </svg>
  );
}

/** Fill opacity of the cell under the pointer; the rings around it take a share. */
const CELL_LIT = 0.14;

/** Fill opacity of a clicked cube at the crest of the ripple. */
const RIPPLE_PEAK = 0.8;

/** Fill opacity of the first ring's crest; the wave sets out from here. */
const RIPPLE_WAVE = 0.35;

/**
 * How much of the crest each ring keeps of the ring before it. Slow on
 * purpose: the wave should still be visible when it reaches the far edges of
 * the platform, which from a corner is 31 rings away. At the 31st the crest is
 * 1.5% — just short of nothing.
 */
const RIPPLE_DECAY = 0.9;

/**
 * Below this a cell's crest cannot be seen, so it is not animated. It is what
 * bounds the ripple — there is no fixed radius; the wave runs until it is
 * gone — and what leaves the face cells the void has already taken alone.
 */
const RIPPLE_FLOOR = 0.004;

/** Time for the crest to move one ring outwards, in milliseconds. */
const RIPPLE_STEP_MS = 80;

/**
 * How long any one cell takes to rise and fall back, in milliseconds. Short
 * against the step, so that at any moment only a ring or two is near its
 * crest and the wave reads as a band moving out, not as a plateau filling in.
 */
const RIPPLE_CELL_MS = 480;

/** A cell key as written to `data-cell`, and read back on hover. */
const cellKey = (cell: Cell) => `${cell.face}:${cell.a}:${cell.b}`;

function parseCellKey(key: string | null): Cell | null {
  if (!key) return null;
  const [face, a, b] = key.split(":");
  return { face: face as Face, a: Number(a), b: Number(b) };
}

/**
 * One square of the grid. Memoised so that a hover only touches the DOM of
 * the nine cells whose brightness actually changed, not all 670.
 */
const GridCell = memo(function GridCell({
  cell,
  glow,
}: {
  cell: Cell;
  glow: number;
}) {
  const fade = cellFade(cell);
  return (
    <polygon
      points={cellPoints(cell)}
      data-cell={cellKey(cell)}
      data-fade={fade}
      className="grid-cell"
      fill="#ffffff"
      style={{ fillOpacity: glow * CELL_LIT * fade }}
    />
  );
});

/** Every cell of one face, lit according to what the pointer is over. */
function GridCells({ face, hover }: { face: Face; hover: Cell | null }) {
  const rows = face === "top" ? CELLS_ACROSS : FACE_ROWS.length - 1;
  const cells: Cell[] = [];
  for (let a = 0; a < CELLS_ACROSS; a++) {
    for (let b = 0; b < rows; b++) cells.push({ face, a, b });
  }
  return (
    <>
      {cells.map((cell) => (
        <GridCell
          key={cellKey(cell)}
          cell={cell}
          glow={cellGlow(hover, cell)}
        />
      ))}
    </>
  );
}

/**
 * A ripple out from a clicked cube: its sides light fully, and the crest runs
 * outwards one ring at a time, each ring dimmer than the last, until there is
 * nothing left to see — which by design is past the far edges of the platform.
 * The rings are counted with `cellDistance`, so the wave carries over the rim
 * and down the faces the same as the hover does.
 *
 * Driven with the Web Animations API on the polygons directly. Each cell
 * rises from whatever brightness it has at that moment (its hover share) and
 * settles back to it, and the animation gives control back to the inline
 * style when it ends. Under reduced motion only the clicked cell flashes —
 * a response to the click without a wave crossing the surface.
 */
function rippleFrom(svg: SVGSVGElement, origin: Cell, travel: boolean) {
  for (const polygon of svg.querySelectorAll<SVGPolygonElement>(".grid-cell")) {
    const cell = parseCellKey(polygon.dataset.cell ?? null);
    if (!cell) continue;
    const { ring } = cellDistance(origin, cell);
    if (!travel && ring > 0) continue;

    const resting = polygon.style.fillOpacity || "0";
    const fade = Number(polygon.dataset.fade ?? 1);
    const crest =
      (ring === 0 ? RIPPLE_PEAK : RIPPLE_WAVE * RIPPLE_DECAY ** (ring - 1)) *
      fade;
    if (crest < RIPPLE_FLOOR) continue;

    polygon.animate(
      [
        { fillOpacity: resting, easing: "cubic-bezier(0.2, 0, 0.4, 1)" },
        {
          fillOpacity: crest,
          offset: 0.3,
          easing: "cubic-bezier(0.4, 0, 0.6, 1)",
        },
        { fillOpacity: resting },
      ],
      { delay: ring * RIPPLE_STEP_MS, duration: RIPPLE_CELL_MS },
    );
  }
}

/**
 * An empty modular surface suspended above the surrounding void.
 *
 * This is the large counterpart to the three principle figures. It uses the
 * same 2:1 isometric grid, line weights and near-black faces. The rear grid
 * fades into the distance while the front and side edges descend into space.
 */
export function FigureGridPlatform({ className }: FigureProps) {
  const { cx, cy, surfaceW, surfaceH, gridExtent, voidBottom } = PLATFORM;
  const [hover, setHover] = useState<Cell | null>(null);
  const reducedMotion = useReducedMotion();
  const gridValues = [
    -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8,
  ];
  const faceRows = [0, 33, 66, 99, 132, 165, 198, 231, 264, 297, 330, 363, 396];
  const faceColumns = Array.from(
    { length: gridExtent * 2 + 1 },
    (_, index) => index,
  );
  const gridPoint = platformPoint;

  return (
    /* The svg itself takes no pointer events; only the grid cells do (see
       `.grid-cell`). So `pointerleave` fires the moment the pointer is off
       the platform, not only when it is off the whole frame, and a hover
       never sticks to the last cell it crossed. */
    <svg
      viewBox="0 0 1120 520"
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={`pointer-events-none ${className ?? ""}`}
      aria-hidden
      onPointerOver={(event) => {
        const key = (event.target as Element).getAttribute("data-cell");
        if (key) setHover(parseCellKey(key));
      }}
      onPointerLeave={() => setHover(null)}
      onPointerDown={(event) => {
        const origin = parseCellKey(
          (event.target as Element).getAttribute("data-cell"),
        );
        if (origin) rippleFrom(event.currentTarget, origin, !reducedMotion);
      }}
    >
      <defs>
        <linearGradient id="surface-distance-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.2" stopColor="white" stopOpacity="0.22" />
          <stop offset="0.48" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="surface-distance-mask">
          <rect width="1120" height="520" fill="url(#surface-distance-fade)" />
        </mask>
        <linearGradient id="platform-void-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="1" />
          <stop offset="0.62" stopColor="white" stopOpacity="0.55" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="platform-void-mask">
          <rect width="1120" height="520" fill="url(#platform-void-fade)" />
        </mask>
        {/* A spark crosses both fades in one run — out of the distance, across
            the surface, over the rim and down into the void — so it gets a
            mask of its own that is the two joined: the surface's distance fade
            at the top, then full, then out to nothing just inside the bottom
            edge of the frame, so the light is gone before the frame cuts it. */}
        <linearGradient id="spark-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.2" stopColor="white" stopOpacity="0.22" />
          <stop offset="0.48" stopColor="white" stopOpacity="1" />
          <stop offset="0.76" stopColor="white" stopOpacity="1" />
          <stop offset="0.97" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="spark-fade-mask">
          <rect width="1120" height="520" fill="url(#spark-fade)" />
        </mask>
      </defs>

      {/* The platform continues below the frame. Its grid carries down both
          front faces before dissolving into the surrounding void. */}
      <g mask="url(#platform-void-mask)">
        <polygon
          points={`${cx - surfaceW},${cy} ${cx},${cy + surfaceH} ${cx},${voidBottom} ${cx - surfaceW},${voidBottom}`}
          fill="#070809"
          stroke="#ffffff12"
          strokeWidth="1"
        />
        <polygon
          points={`${cx},${cy + surfaceH} ${cx + surfaceW},${cy} ${cx + surfaceW},${voidBottom} ${cx},${voidBottom}`}
          fill="#060708"
          stroke="#ffffff12"
          strokeWidth="1"
        />

        {faceRows.map((offset) => (
          <g key={`face-row-${offset}`}>
            <line
              x1={cx - surfaceW}
              y1={cy + offset}
              x2={cx}
              y2={cy + surfaceH + offset}
              stroke="#ffffff12"
            />
            <line
              x1={cx}
              y1={cy + surfaceH + offset}
              x2={cx + surfaceW}
              y2={cy + offset}
              stroke="#ffffff12"
            />
          </g>
        ))}

        {faceColumns.map((index) => {
          const ratio = index / (gridExtent * 2);
          const leftX = cx - surfaceW + surfaceW * ratio;
          const leftY = cy + surfaceH * ratio;
          const rightX = cx + surfaceW * ratio;
          const rightY = cy + surfaceH * (1 - ratio);

          return (
            <g key={`face-column-${index}`}>
              <line
                x1={leftX}
                y1={leftY}
                x2={leftX}
                y2={voidBottom}
                stroke="#ffffff12"
              />
              <line
                x1={rightX}
                y1={rightY}
                x2={rightX}
                y2={voidBottom}
                stroke="#ffffff12"
              />
            </g>
          );
        })}

        {/* The three drops define the platform's left edge, front seam and
            right edge before they disappear into the void. */}
        {[
          [cx - surfaceW, cy],
          [cx, cy + surfaceH],
          [cx + surfaceW, cy],
        ].map(([x, y]) => (
          <line
            key={`platform-drop-${x}`}
            x1={x}
            y1={y}
            x2={x}
            y2={voidBottom}
            stroke="#ffffff"
            strokeOpacity="0.34"
            strokeWidth="1.1"
          />
        ))}
      </g>

      {/* The tiled top extends beyond the frame and fades into the distance,
          so no rear edge is visible. */}
      <g mask="url(#surface-distance-mask)">
        <polygon points={rhombus(cx, cy, surfaceW, surfaceH)} fill="#090a0b" />

        <path
          d={`M ${cx - surfaceW} ${cy} L ${cx} ${cy - surfaceH} L ${cx + surfaceW} ${cy}`}
          stroke="#ffffff"
          strokeOpacity="0.34"
          strokeWidth="1.1"
        />

        {gridValues.map((u) => {
          const start = gridPoint(u, -gridExtent);
          const end = gridPoint(u, gridExtent);
          return (
            <line
              key={`u-${u}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#ffffff1a"
              strokeWidth="1"
            />
          );
        })}
        {gridValues.map((v) => {
          const start = gridPoint(-gridExtent, v);
          const end = gridPoint(gridExtent, v);
          return (
            <line
              key={`v-${v}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#ffffff1a"
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* The cells sit outside the masked groups on purpose — each carries
          the fade as a factor of its own (see `cellFade`) — because a change
          inside a masked group repaints the whole group, and a ripple is a
          hundred and some cells changing at once. Over the lines rather than
          under them for the same reason; at hover strength the lines still
          show through. */}
      <g>
        <GridCells face="top" hover={hover} />
        <GridCells face="left" hover={hover} />
        <GridCells face="right" hover={hover} />
      </g>

      <g mask="url(#spark-fade-mask)">
        <SurfaceSparks />
      </g>

      {/* Only the front rim remains defined; the rear perimeter is allowed to disappear. */}
      <path
        d={`M ${cx - surfaceW} ${cy} L ${cx} ${cy + surfaceH} L ${cx + surfaceW} ${cy}`}
        stroke="#ffffff"
        strokeOpacity="0.34"
        strokeWidth="1.1"
      />
    </svg>
  );
}

export const figures = [FigureStack, FigureAgents, FigureHours];
