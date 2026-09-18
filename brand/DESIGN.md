# INIT design system

A reference for anyone, human or AI, who adds to this site or makes something
that has to sit beside it: a page, a slide, a banner, an email. It records the
decisions and the reasons, so a new piece can be made in the same hand rather
than by copying one existing piece.

INIT is a one-person consultancy that removes one recurring manual task at a
time for small Norwegian service businesses, at a fixed price and with an
agreed delivery date. Everything below follows from that: sparse, exact,
nothing decorative, nothing that promises more than one problem at a time.

## 1. Canvas and colour

The site is dark only. There is no light theme and none should be added; a
light variant exists only for print (see §10).

| Token | Value | Use |
|---|---|---|
| `--background` | `#08090a` | The canvas, everywhere |
| `--bg-elevated` | `#0f1011` | Rarely; a surface one step up |
| `--bg-level-3` | `#191a1b` | Rarely; two steps up |
| `--fg-primary` | `#f7f8f8` | Headings, the current item, the important half of a sentence |
| `--fg-secondary` | `#d0d6e0` | Body that is being read now: FAQ questions, row values |
| `--fg-tertiary` | `#8a8f98` | Supporting copy, captions, the second half of a sentence |
| `--line-primary` | `#37393a` | Borders on outlined buttons and diagram boxes |
| `--line-secondary` | `#202122` | Hairline rules between rows |
| `--line-tertiary` | `#18191a` | The faintest rule; list dividers |
| `--border-translucent` | `#ffffff0d` | Section borders, header border |
| `--accent` | `#f7f8f8` | There is no colour accent. White is the accent. |

Rules:

- **One colour, three greys.** Hierarchy is done with the three text tones and
  with size, never with hue. Nothing on the page is coloured. Do not introduce
  a brand colour, a gradient, a coloured icon set or a status colour.
- **Light is the only emphasis.** Where something needs to stand out, it gets
  brighter: white text, a white fill at low opacity over a cube, a brighter
  ring on a card. It never gets a colour.
- **Cube faces** are `#0c0d0e`, a hair above the canvas, so a cube reads as a
  solid without a fill you can name.

## 2. Typography

- **Inter** for everything, loaded through `next/font` as `--font-inter`, with
  `font-feature-settings: "cv01", "ss03"` (open digits, the alternate `a`).
- **Geist Mono** (`--font-geist-mono`) only for small uppercase labels:
  figure numbers (`FIG 0.1`), the language toggle, price notes, footers on
  slides. 11px, letter-spacing 0.04–0.06em, tertiary grey.
- Weights are set by number, not by name: `510` for headings and emphasised
  text, `560` for the wordmark. Nothing is bold in the 700 sense.
- Negative tracking throughout: `-0.011em` on body, `-0.02em` on headings,
  `-0.022em` on prices.

Scale as used on the page:

| Role | Size | Weight | Tone |
|---|---|---|---|
| Section title | 32px, 40px from `sm` | 510 | primary |
| Statement (principles lead) | 28 / 36 / 40px | 510 | primary, then tertiary |
| Section subtitle | 15 / 17px | 400 | tertiary |
| Item title, FAQ question | 15 / 16px | 510 | primary or secondary |
| Body | 14 / 15px, line-height 1.6–1.65 | 400 | tertiary |
| Nav, footer links, buttons | 13px | 510 | tertiary, primary on hover |
| Mono label | 11px, uppercase | 400 | tertiary at 50–100% |

The **statement pattern** is the site's signature sentence: one sentence in
white that carries on in grey, as in the principles lead ("Problemet først."
white, the rest tertiary). Use it for one idea per section, never for lists.

## 3. Layout

- Content is centred in a **1340px** column with a **20px** gutter on phones
  and **32px** from `sm`. Sections take **96px** of vertical padding, **112px**
  from `sm`.
- Sections are separated by a hairline top border (`border-hairline`), not by
  background changes.
- **Section heading**: title on the left, supporting sentence in a right-hand
  column, a two-column grid from `lg`. No eyebrow or kicker above the title.
- Content that follows a heading may use the same two columns, for example
  the FAQ list (max 880px) with the mark in the free right-hand band from `xl`.
- Text columns are capped by character count (`max-w-[52ch]`, `[70ch]`), not
  by pixels, so they stay readable at every size.
- Breakpoints are Tailwind's: `sm` 640, `lg` 1024, `xl` 1280.

## 4. Surfaces

There are exactly two kinds of surface, and a strict budget for the second.

**Hairline lists.** The default. Rows separated by 1px rules in
`--line-tertiary` or `--line-secondary`, no background, no rounded box. Used
for the FAQ, process steps, pricing features, footer columns. When in doubt,
make a hairline list.

**Shine cards** (`.shine-card`). A rounded (14px) surface with a vertical
gradient from `#15161a` to `#0c0d0e`, a soft white radial glow near the top
edge, a 1px ring that is bright (`rgba(255,255,255,0.36)`) at the top and
fades to almost nothing at the bottom, and a deep soft shadow. The ring
brightens on hover. Two cards side by side are lit from the corners that face
each other (`.shine-from-top-right`, `.shine-from-top-left`) so the light
reads as one source between them.

The page carries **three** card surfaces: project cards, pricing cards, the
booking card. That number is the budget. A fourth card flattens the hierarchy,
which is why the FAQ is a list and the principles are flat columns. Cards are
for things the reader acts on: a project, a price, a time slot.

Buttons: 10px radius, white fill with dark text for the primary action,
1px `--line-primary` border for the secondary. Never two primary buttons.

## 5. The mark

The mark is `*>`, an asterisk and a chevron: the "anything" and the "next".
It is drawn, not typed, in `src/components/ui/LogoMark.tsx`, on a 98 × 64
grid:

- **Asterisk**: six arms of width 8 and reach 21 from centre (26.5, 32); the
  bar-and-two-diagonals form, since a five-by-five pixel grid cannot draw eight
  arms without filling in.
- **Chevron**: one line wide (9), point at (85, 32), opening to x = 64, arms at
  45°, flat ends, sharp point.
- Every corner is softened by a radius of **1.4** units, on both glyphs. This
  is why the glyphs are filled outlines and not strokes: a stroke's ends are
  either square or fully round, and these are only slightly rounded.
- The gap between the glyphs is set so the pair is centred in its box.

Two variants, and only two:

- **Outline** (`LogoMark`): no fill, a **1px** white line at opacity **0.34**
  (the platform rim's opacity) that stays 1px at any size via
  `vector-effect: non-scaling-stroke`. Used large, alone, as a drawing, for
  example beside the FAQ at 224px wide, vertically centred on the list.
- **Filled** (`LogoMark filled`): solid in the current text colour. Used small,
  where a hairline would smudge: the header, the footer and the booking page
  at **17px** tall, with a 10px gap to the wordmark "INIT" (15px, weight 560).

The mark never sits on a tile, in a circle, or on a card. The mark is never
coloured. Do not redraw it with a font's asterisk.

## 6. The isometric figures

The illustrations are line drawings of unit cubes on one isometric grid. They
are the only illustration style on the site; there are no photos, icons or
stock graphics. All of it lives in `src/components/ui/IsometricFigures.tsx`
and `src/lib/platform.ts`.

**The grid.** A 2:1 rhombus: a horizontal step of 2 units matches a vertical
step of 1. Two axes, `u` running down-right and `v` down-left; a point at grid
`(u, v)` lands at `x = ox + (u − v)·w`, `y = oy + (u + v)·h` with `h = w/2`.
The depth axis, what is nearer the viewer, is `u + v + z`; draw in that order,
back to front, lower before higher.

**The unit cube.** Top face a 2:1 rhombus of half-width `w`; vertical edges as
long as the rhombus is wide from centre to corner (`2h = w`). Drawn sides
first, top last, so the top covers the sides' upper edges. This is the
proportion of the hero platform's cells, so every figure is made of the same
brick the platform is tiled with.

**Lines.** 1px white at two opacities: **0.19** (strong) and **0.086** (faint).
A cube at rest draws its top in the strong line and its sides in the faint
one, as the platform's rim reads and its faces recede. A cube given
*emphasis* draws every edge strong. Faces are filled `#0c0d0e`. Dashed
lines (`2 5` for planes, `2 4` for the tops line) use the same opacities.

**Light.** A cube is lit by a white fill over all three visible faces:
**0.08** for the cube a figure singles out at rest ("marked"), **0.14** under
the pointer ("lit"). Light comes up and goes down in 0.28s. Light is the only
emphasis; nothing changes colour.

**The three principle figures**, each in a 320 × 230 frame:

1. *Stack*: three cubes of `w = 42`, 8 units clear of each other, bottom at
   y = 186, the top one marked. Hover closes the stack around the pointed
   cube.
2. *Agents*: a 3 × 3 dashed plane with cubes (`w = 40`) on the four cells
   touching the centre; one lights for a moment now and then. Hover lights and
   holds.
3. *Columns*: columns of one, two and three cubes (`w = 28`) two cells apart
   along `v`, rising from the front left to the back right, a dashed line
   over the tops. The single-cube column is marked. Hover moves the crest to
   the pointed column.

**The hero platform**: a 16 × 16 cell surface in a 1120 × 520 frame, rear grid
fading into the distance, front faces descending into the void, sparks running
along grid lines and over the rim; a click ripples out across the surface.

**Adding a figure.** Use `Cube`, keep to the grid, keep the two line
opacities, light at most one thing, and give it one idea and one hover
behaviour. A figure that needs a caption to be understood is too complex.

## 7. Motion

Motion is used to show things arriving and responding, never to decorate.

- **Entrance** (`FadeIn`): opacity 0→1, 12px rise, 8px blur clearing, 0.7s on
  the ease-out-quart curve `[0.165, 0.84, 0.44, 1]`. Each element watches the
  viewport itself with a 64px margin. On first load, elements lower on the
  screen wait proportionally longer (up to 0.28s), so the page arrives top to
  bottom; once the page has been scrolled that cascade is off.
- **Hero copy** lands line by line, 0.1s apart, blurred and a little low,
  ahead of the platform.
- **Figures build themselves** when scrolled into view: each part is invisible
  and displaced until its turn, then settles with the `SETTLE` spring
  (stiffness 150, damping 24, mass 1: no bounce) while opacity comes up over
  0.5s. The build starts 0.25s after the column's own entrance so cubes are
  seen arriving, not smeared. Parts are 0.12s apart; the columns figure starts
  a column one step after the previous and stacks within a column at half
  steps. Side by side, the three figures start 0.2s apart, in order.
- **Pointer response** uses the `PULL` spring (stiffness 260, damping 24,
  mass 0.8): quick, with a small settle.
- **Idle**: dashed planes drift, sparks cross the platform at random, a wire
  current runs the process timeline, one agent cube speaks now and then. Idle
  motion is random, slow and faint, never a loop you can notice.
- **Reduced motion** is honoured everywhere: entrances only fade, builds only
  fade in order, hovers light without moving, sparks and drifts stop. A blur
  clearing counts as movement and is removed too.
- Disclosure (FAQ) opens over 0.24s with `[0.25, 0.46, 0.45, 0.94]`.

## 8. Copy

- **Norwegian (bokmål) is the default**; English is a toggle. Write the
  Norwegian first and translate, not the other way round.
- **Positioning phrases** to keep verbatim: "Mindre manuelt arbeid. Enklere
  systemer.", "Ett konkret problem av gangen", "Fortell hva som tar tid",
  "Trygg drift", "Første forbedring", "Problemet først."
- Sentences are short and concrete: what takes time, what changes, what it
  costs, when it is delivered. Numbers are given plainly (12 500 kr, 14 dager,
  tre til fem uker).
- **Never**: em dashes as a pivot, "not X but Y" constructions, "from X to Y"
  titles, paired adjectives as titles ("simple and straightforward"), trailing
  "making ... clear" clauses, "seamless", "unlock", "empower", "leverage",
  exclamation marks, rhetorical questions in body text. The copy was swept for
  these once and should stay clean.
- The voice is first person singular ("jeg") where a person speaks, INIT where
  the company does. Testimonials are real quotes only; the file
  `src/lib/testimonials.ts` explains the rule and the stand-ins.

## 9. Assets in this folder

| File | What |
|---|---|
| `init-mark-white.png` | The mark, solid white, 1024² on the canvas colour |
| `init-mark-outline.png` | The mark as an outline, 1024² |
| `init-lockup-white.png` | Mark + "INIT", solid, 1024² |
| `init-lockup-outline.png` | Mark + "INIT" outlined, 1024² |
| `init-linkedin-banner-profile.png` | 1584 × 396 |
| `init-linkedin-banner-company.png` | 1128 × 191 |

Export rules, because an export is seen smaller and compressed:

- Outline exports use a **3px** line at opacity **0.7**, not the site's 1px at
  0.34, which vanishes in a thumbnail.
- Banner figures use line opacities **0.3** and **0.14**, lifted from the
  site's 0.19 and 0.086, and no cube is lit.
- The mark spans 60% of a square export, so it survives a circular crop.
- The LinkedIn banner keeps its left half empty (the profile photo overlays
  it), sets the headline in the right half, and carries only the columns
  figure, oriented as on the site.

## 10. Beyond the site

- **Slides** (`../decks/`): 16:9, the same canvas, Inter, three layouts (cover
  with a figure, a statement, title-left content-right), hairline rows, mono
  labels, the mark in the footer. Every drawing is native geometry. Eight
  slides is the ceiling; the decks mirror the site's four-step process.
- **Print**: the only place a light variant is allowed. Same type and
  hairlines on white, the mark filled black.
- **Email**: plain text, no images, no attachments. The mark is not needed
  there; the wordmark "INIT" and the domain are enough.

## 11. Do not

- Add colour, gradients as decoration, icons, photos, illustrations that are
  not cubes on the grid.
- Put the mark on a tile, in a circle, on a card, or set it in a font.
- Add a fourth card surface to the page.
- Use accent bars, underlines beneath titles, eyebrow labels above titles.
- Light more than one cube at rest in a figure.
- Loop an idle animation on a fixed cycle.
- Ship an entrance, a build or a hover without a reduced-motion form.
- Write with the tells listed in §8.
