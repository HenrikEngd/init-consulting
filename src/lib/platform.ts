/**
 * Geometry of the hero platform, shared with the sparks that run across it.
 *
 * The top surface is a rhombus centred on (cx, cy) with grid coordinates
 * `u` and `v` each running -gridExtent..gridExtent; (8, 8) is the front corner,
 * (-8, -8) the rear one, and the two front faces hang from the (u, 8) and
 * (8, v) edges down to `voidBottom`.
 */
export const PLATFORM = {
  cx: 560,
  cy: 150,
  surfaceW: 520,
  surfaceH: 264,
  gridExtent: 8,
  voidBottom: 720,
  viewW: 1120,
  viewH: 520,
} as const;

const CELL_W = PLATFORM.surfaceW / (PLATFORM.gridExtent * 2);
const CELL_H = PLATFORM.surfaceH / (PLATFORM.gridExtent * 2);

/** Where grid coordinates (u, v) land on the top surface. */
export function platformPoint(u: number, v: number) {
  return {
    x: PLATFORM.cx + (u - v) * CELL_W,
    y: PLATFORM.cy + (u + v) * CELL_H,
  };
}

export type Face = "top" | "left" | "right";

/**
 * One square of the grid. `a` is the column along the rim: the u-cell on the
 * top and left face, the v-cell on the right face. `b` is the v-cell on the
 * top, and the row down from the rim on either face.
 */
export interface Cell {
  face: Face;
  a: number;
  b: number;
}

/** Cells along one edge of the top surface. */
export const CELLS_ACROSS = PLATFORM.gridExtent * 2;

/**
 * Vertical offsets of the row lines on the front faces, below the rim. The
 * last band runs to the void, where the mask has long since taken it.
 */
export const FACE_ROWS = [
  0,
  33,
  66,
  99,
  132,
  165,
  198,
  231,
  264,
  297,
  330,
  363,
  396,
  PLATFORM.voidBottom - PLATFORM.cy,
];

/** The corners of a cell, as a polygon's `points`. */
export function cellPoints(cell: Cell): string {
  const { gridExtent } = PLATFORM;

  if (cell.face === "top") {
    const u = cell.a - gridExtent;
    const v = cell.b - gridExtent;
    return [
      platformPoint(u, v),
      platformPoint(u + 1, v),
      platformPoint(u + 1, v + 1),
      platformPoint(u, v + 1),
    ]
      .map((p) => `${p.x},${p.y}`)
      .join(" ");
  }

  /* A face column hangs straight down from its stretch of rim. */
  const rim = (k: number) =>
    cell.face === "left"
      ? platformPoint(k - gridExtent, gridExtent)
      : platformPoint(gridExtent, k - gridExtent);
  const l = rim(cell.a);
  const r = rim(cell.a + 1);
  const y0 = FACE_ROWS[cell.b];
  const y1 = FACE_ROWS[cell.b + 1];
  return `${l.x},${l.y + y0} ${r.x},${r.y + y0} ${r.x},${r.y + y1} ${l.x},${l.y + y1}`;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * How much of a cell's light survives the platform's fades — the top surface
 * dissolving into the distance, the faces into the void. These are the same
 * ramps as the `surface-distance-fade` and `platform-void-fade` gradients in
 * the figure, sampled at the cell's centre, so a cell lit outside those masks
 * looks exactly as it would inside them. Outside is the point: a change to a
 * child of a masked group re-rasterises the whole group, and a ripple across
 * 170 cells inside one ran at 25 fps.
 */
export function cellFade(cell: Cell): number {
  const y =
    cellPoints(cell)
      .split(" ")
      .map((pair) => Number(pair.split(",")[1]))
      .reduce((sum, v) => sum + v, 0) / 4;
  const t = y / PLATFORM.viewH;

  if (cell.face === "top") {
    if (t <= 0) return 0;
    if (t <= 0.2) return lerp(0, 0.22, t / 0.2);
    if (t <= 0.48) return lerp(0.22, 1, (t - 0.2) / 0.28);
    return 1;
  }
  if (t <= 0.62) return lerp(1, 0.55, t / 0.62);
  if (t <= 1) return lerp(0.55, 0, (t - 0.62) / 0.38);
  return 0;
}

/**
 * A cell's coordinates laid flat in another face's plane. Each face is
 * unfolded onto its neighbour along the edge they share: the left face
 * hangs off the top's far-v edge, the right face off its far-u edge, and the
 * two faces meet at the front seam, each at its last column. Indexed as
 * `UNFOLD[plane][face](cell) → [x, y]`, with `x` along the plane's `a` and
 * `y` along its `b`.
 */
const UNFOLD: Record<
  Face,
  Record<Face, (a: number, b: number) => [number, number]>
> = {
  top: {
    top: (a, b) => [a, b],
    left: (a, b) => [a, CELLS_ACROSS + b],
    right: (a, b) => [CELLS_ACROSS + b, a],
  },
  left: {
    left: (a, b) => [a, b],
    top: (a, b) => [a, b - CELLS_ACROSS],
    right: (a, b) => [2 * CELLS_ACROSS - 1 - a, b],
  },
  right: {
    right: (a, b) => [a, b],
    top: (a, b) => [b, a - CELLS_ACROSS],
    left: (a, b) => [2 * CELLS_ACROSS - 1 - a, b],
  },
};

const FACES: Face[] = ["top", "left", "right"];

/**
 * How many cells apart two cells are, counted across the rim and the front
 * seam as well as within a face, so a cell on the edge of the top surface
 * has neighbours on the face below it.
 *
 * Every route is tried, not only the direct one: from one face to the other
 * a cell can be reached across the seam or up over the rim, across the top
 * and down again, and from the top a face cell can be reached over its own
 * rim or over the other face and round the seam. The unfoldings are affine,
 * so folding through a third face is one applied to the other. The shortest
 * route counts, which is what lets a wave that has climbed onto the surface
 * carry on down the far face when it gets there, instead of measuring those
 * cells the long way round.
 */
export function cellSteps(h: Cell, c: Cell): { dx: number; dy: number } {
  let best = { dx: Infinity, dy: Infinity };
  for (const via of FACES) {
    const [x, y] = UNFOLD[h.face][via](...UNFOLD[via][c.face](c.a, c.b));
    const dx = Math.abs(x - h.a);
    const dy = Math.abs(y - h.b);
    const ring = Math.max(dx, dy);
    const bestRing = Math.max(best.dx, best.dy);
    if (ring < bestRing || (ring === bestRing && dx + dy < best.dx + best.dy)) {
      best = { dx, dy };
    }
  }
  return best;
}

/**
 * The visible sides of the unit cube a cell belongs to, the cell included.
 *
 * A cell on a front edge of the top surface is the lid of a cube whose side
 * is the face cell directly beneath it; at the front corner the cube shows
 * three sides. Down the front seam, the left and right face cells in the
 * same row are two sides of one cube. Everywhere else a cube shows one side
 * only. The sides of one cube are lit as one, by hover and by ripple.
 */
export function cubeCells(cell: Cell): Cell[] {
  const last = CELLS_ACROSS - 1;
  const cells: Cell[] = [cell];

  if (cell.face === "top") {
    if (cell.b === last) cells.push({ face: "left", a: cell.a, b: 0 });
    if (cell.a === last) cells.push({ face: "right", a: cell.b, b: 0 });
    return cells;
  }

  if (cell.b === 0) {
    cells.push(
      cell.face === "left"
        ? { face: "top", a: cell.a, b: last }
        : { face: "top", a: last, b: cell.a },
    );
  }
  if (cell.a === last) {
    cells.push({
      face: cell.face === "left" ? "right" : "left",
      a: last,
      b: cell.b,
    });
  }
  return cells;
}

/**
 * How far a cell is from a cube: the ring it sits on, counted between the
 * nearest visible sides of the two cubes, and the number of steps to it —
 * which separates, within a ring, the cells that share an edge with the
 * ring before from those that only touch it at a corner.
 *
 * Both cubes' sides are tried, not only the origin's, so the two sides of a
 * cube on the seam or on the rim sit on the same ring: a cube is lit as one
 * whether it is the origin or the cell being lit.
 */
export function cellDistance(
  origin: Cell,
  cell: Cell,
): { ring: number; steps: number } {
  let best = { ring: Infinity, steps: Infinity };
  for (const from of cubeCells(origin)) {
    for (const to of cubeCells(cell)) {
      const { dx, dy } = cellSteps(from, to);
      const ring = Math.max(dx, dy);
      const steps = dx + dy;
      if (ring < best.ring || (ring === best.ring && steps < best.steps)) {
        best = { ring, steps };
      }
    }
  }
  return best;
}

/**
 * How strongly a cell responds to the cube under the pointer: 1 for the
 * cube's own sides, then two rings of falloff. Within a ring the cells that
 * share an edge with the previous ring sit a little above those that only
 * touch at a corner, so the glow reads as round rather than as a square with
 * a square around it.
 */
export function cellGlow(hover: Cell | null, cell: Cell): number {
  if (!hover) return 0;
  const { ring, steps } = cellDistance(hover, cell);
  if (ring === 0) return 1;
  if (ring === 1) return steps === 1 ? 0.45 : 0.3;
  if (ring === 2) return steps === 2 ? 0.16 : steps === 3 ? 0.12 : 0.08;
  return 0;
}
