/**
 * The mark: `*>` as an outline.
 *
 * Only a line — one hairline of white, as the platform grid and the figures
 * are drawn, over nothing — so it reads as a piece of the same drawing
 * rather than a logo pasted in. The line keeps to one pixel whatever size
 * the mark is shown at, as the grid lines do. The glyphs are drawn, not
 * typed: six
 * heavy arms for the asterisk and an open chevron, as filled outlines with
 * every corner softened by the same small radius, so they keep one weight at
 * any size and do not depend on the font's asterisk. Outlines rather than
 * strokes because a stroke's ends and joins are either square or fully
 * round, and these should be only slightly rounded.
 *
 * Small, as in the header, a one-pixel outline is only a smudge, so there
 * the same shapes are filled in the current text colour instead.
 *
 * Decorative: the name is set beside it in the header, so this carries no
 * accessible name.
 */

type Point = [number, number];

/** How far each corner is softened, in the drawing's units. */
const CORNER = 1.4;

/** Opacity of the white line: the platform's rim, the strongest line it has. */
const LINE = 0.34;

/**
 * A closed path through `points`, with every corner replaced by a curve
 * that starts `radius` before it along one edge and ends `radius` after it
 * along the next.
 */
function rounded(points: Point[], radius: number) {
  const n = points.length;
  return (
    points
      .map(([x, y], i) => {
        const [px, py] = points[(i - 1 + n) % n];
        const [nx, ny] = points[(i + 1) % n];
        const toPrev = Math.hypot(px - x, py - y);
        const toNext = Math.hypot(nx - x, ny - y);
        const r = Math.min(radius, toPrev / 2, toNext / 2);
        const from = [x + ((px - x) / toPrev) * r, y + ((py - y) / toPrev) * r];
        const to = [x + ((nx - x) / toNext) * r, y + ((ny - y) / toNext) * r];
        return `${i === 0 ? "M" : "L"} ${from[0]} ${from[1]} Q ${x} ${y} ${to[0]} ${to[1]}`;
      })
      .join(" ") + " Z"
  );
}

/**
 * The outline of six arms of width `t` and reach `r` from `[cx, cy]`, one
 * pointing up. Around the edge, each arm's two tip corners are followed by
 * the notch where its side meets the next arm's — on the bisector between
 * them, a distance `t` out, since the arms are sixty degrees apart.
 */
function asterisk([cx, cy]: Point, r: number, t: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (-90 + 60 * i);
    const [ux, uy] = [Math.cos(a), Math.sin(a)];
    const [nx, ny] = [-uy, ux];
    const b = a + Math.PI / 6;
    points.push(
      [cx + r * ux - (t / 2) * nx, cy + r * uy - (t / 2) * ny],
      [cx + r * ux + (t / 2) * nx, cy + r * uy + (t / 2) * ny],
      [cx + t * Math.cos(b), cy + t * Math.sin(b)],
    );
  }
  return points;
}

/**
 * The outline of a chevron of line width `t` with its point at `[px, py]`,
 * opening leftwards to `x`, arms at forty-five degrees. Flat ends, a sharp
 * point outside and in.
 */
function chevron([px, py]: Point, x: number, t: number): Point[] {
  const reach = px - x;
  const end = (t / 2) * Math.SQRT1_2;
  const tip = (t / 2) * Math.SQRT2;
  return [
    [x + end, py - reach - end],
    [px + tip, py],
    [x + end, py + reach + end],
    [x - end, py + reach - end],
    [px - tip, py],
    [x - end, py - reach + end],
  ];
}

export function LogoMark({
  className,
  filled = false,
}: {
  className?: string;
  /** Solid in the current text colour, for small sizes; else the outline. */
  filled?: boolean;
}) {
  const paint = filled
    ? { fill: "currentColor" }
    : {
        fill: "none",
        stroke: "#ffffff",
        strokeOpacity: LINE,
        strokeWidth: 1,
        strokeLinejoin: "round" as const,
      };
  return (
    <svg aria-hidden viewBox="0 0 98 64" {...paint} className={className}>
      <path
        d={rounded(asterisk([26.5, 32], 21, 8), CORNER)}
        vectorEffect="non-scaling-stroke"
      />
      <path
        d={rounded(chevron([85, 32], 64, 9), CORNER)}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
