/**
 * Builds INIT's two decks — the proposal sent after the first call and the
 * handover deck for the walkthrough — as .pptx files, in the site's design:
 * near-black canvas, Inter, the three-step text hierarchy, hairlines instead
 * of boxes, the `*>` mark, and the cube figures as the only illustrations.
 *
 * Every drawing is native PowerPoint geometry, so the decks stay editable
 * and crisp. Both decks carry worked example content for a fictional
 * Eksempel AS, with what to replace noted in each slide's speaker notes.
 *
 *   node build.js <output dir>
 */
const path = require("path");
const pptxgen = require("pptxgenjs");

const OUT = process.argv[2] || ".";

/* ---- Design tokens, from globals.css ------------------------------------ */
const BG = "08090A";
const FACE = "0C0D0E";
const PRIMARY = "F7F8F8";
const SECONDARY = "D0D6E0";
const TERTIARY = "8A8F98";
const LINE = "37393A";
const LINE_SOFT = "202122";
/* The figures' two line weights and the lit face, flattened onto the canvas. */
const LINE_STRONG = "353638";
const LINE_FAINT = "1C1D1E";
const FACE_LIT = "1F2021";

const FONT = "Inter";
const MONO = "Courier New";

const W = 10;
const H = 5.625;
const GUTTER = 0.6;
/* Content slides: title in a left column, body in a right one. */
const COL_TITLE = { x: GUTTER, w: 3.3 };
const COL_BODY = { x: 4.4, w: W - 4.4 - GUTTER };
const TOP = 0.7;
const FOOTER_Y = 5.1;

/* ---- Drawing helpers ------------------------------------------------------ */

/** A filled polygon from absolute points, in inches. */
function poly(pres, slide, pts, { fill, line, width = 0.75, dash } = {}) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  const w = Math.max(...xs) - x;
  const h = Math.max(...ys) - y;
  const points = pts.map(([px, py]) => ({ x: px - x, y: py - y }));
  points.push({ close: true });
  slide.addShape(pres.shapes.CUSTOM_GEOMETRY, {
    x,
    y,
    w,
    h,
    points,
    fill: fill ? { color: fill } : { type: "none" },
    line: line ? { color: line, width, dashType: dash || "solid" } : { type: "none" },
  });
}

/** A straight line between two absolute points. */
function line(pres, slide, x1, y1, x2, y2, { color = LINE_SOFT, width = 0.75, dash } = {}) {
  const x = Math.min(x1, x2);
  const y = Math.min(y1, y2);
  slide.addShape(pres.shapes.LINE, {
    x,
    y,
    w: Math.abs(x2 - x1),
    h: Math.abs(y2 - y1),
    flipV: (x2 - x1) * (y2 - y1) < 0,
    line: { color, width, dashType: dash || "solid" },
  });
}

/**
 * A unit cube as IsometricFigures.tsx draws it: `cx, cy` is the centre of the
 * bottom face, `w` the half-width of the top face; sides first, top last.
 */
function cube(pres, slide, cx, cy, w, { emphasis = false, lit = false } = {}) {
  const h = w / 2;
  const top = cy - 2 * h;
  const faces = [
    [[cx - w, top], [cx, top + h], [cx, cy + h], [cx - w, cy]],
    [[cx + w, top], [cx, top + h], [cx, cy + h], [cx + w, cy]],
    [[cx, top - h], [cx + w, top], [cx, top + h], [cx - w, top]],
  ];
  faces.forEach((pts, i) =>
    poly(pres, slide, pts, {
      fill: lit ? FACE_LIT : FACE,
      line: emphasis || i === 2 ? LINE_STRONG : LINE_FAINT,
    }),
  );
}

/** FigureStack at rest: three cubes, a little clear of each other, top marked. */
function figureStack(pres, slide, x, y, size) {
  const s = size / 230;
  const cx = x + 160 * s;
  const w = 42 * s;
  const step = (42 + 8) * s;
  const bottom = y + 186 * s;
  for (let i = 0; i < 3; i++) {
    cube(pres, slide, cx, bottom - i * step, w, { emphasis: i === 2, lit: i === 2 });
  }
}

/** FigureAgents at rest: four cubes around an empty centre cell on a dashed plane. */
function figureAgents(pres, slide, x, y, size) {
  const s = size / 230;
  const w = 40 * s;
  const h = w / 2;
  const ox = x + 160 * s;
  const oy = y + 60 * s;
  const cy = oy + 3 * h;
  poly(pres, slide, [[ox, cy - 3 * h], [ox + 3 * w, cy], [ox, cy + 3 * h], [ox - 3 * w, cy]], {
    line: LINE_FAINT,
    dash: "sysDot",
  });
  for (const [u, v] of [[1, 0], [0, 1], [2, 1], [1, 2]]) {
    cube(pres, slide, ox + (u - v) * w, oy + (u + v + 1) * h, w, { emphasis: true });
  }
}

/** FigureHours as it now stands: columns of one, two, three rising to the back right. */
function figureColumns(pres, slide, x, y, size) {
  const s = size / 230;
  const w = 28 * s;
  const h = w / 2;
  const x0 = x + 104 * s;
  const y0 = y + 185 * s;
  const heights = [1, 2, 3];
  const column = (i) => ({ cx: x0 + i * 2 * w, base: y0 - i * 2 * h });
  for (let i = 2; i >= 0; i--) {
    const { cx, base } = column(i);
    for (let level = 0; level < heights[i]; level++) {
      cube(pres, slide, cx, base - level * 2 * h, w, { emphasis: i === 0, lit: i === 0 });
    }
  }
  const tops = heights.map((height, i) => {
    const { cx, base } = column(i);
    return [cx, base - height * 2 * h - h];
  });
  for (let i = 1; i < tops.length; i++) {
    line(pres, slide, tops[i - 1][0], tops[i - 1][1], tops[i][0], tops[i][1], {
      color: LINE_STRONG,
      dash: "sysDash",
    });
  }
}

/* The mark `*>`, from LogoMark.tsx: six arms and a chevron, in a 98 x 64 box. */
function markPolygons() {
  const asterisk = (cx, cy, r, t) => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (-90 + 60 * i);
      const [ux, uy] = [Math.cos(a), Math.sin(a)];
      const [nx, ny] = [-uy, ux];
      const b = a + Math.PI / 6;
      pts.push(
        [cx + r * ux - (t / 2) * nx, cy + r * uy - (t / 2) * ny],
        [cx + r * ux + (t / 2) * nx, cy + r * uy + (t / 2) * ny],
        [cx + t * Math.cos(b), cy + t * Math.sin(b)],
      );
    }
    return pts;
  };
  const chevron = (px, py, x, t) => {
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
  };
  return [asterisk(26.5, 32, 21, 8), chevron(85, 32, 64, 9)];
}

/** The mark, filled, `height` inches tall with its top-left at (x, y). */
function mark(pres, slide, x, y, height, color = PRIMARY) {
  const s = height / 64;
  for (const pts of markPolygons()) {
    poly(pres, slide, pts.map(([px, py]) => [x + px * s, y + py * s]), { fill: color });
  }
}

/* ---- Text helpers --------------------------------------------------------- */

function text(slide, str, opts) {
  slide.addText(str, {
    isTextBox: true,
    margin: 0,
    fontFace: FONT,
    color: PRIMARY,
    valign: "top",
    ...opts,
  });
}

function label(slide, str, x, y, w, extra = {}) {
  text(slide, str.toUpperCase(), {
    x,
    y,
    w,
    h: 0.2,
    fontFace: MONO,
    fontSize: 8,
    color: TERTIARY,
    charSpacing: 1.5,
    ...extra,
  });
}

/** A content slide's title column: the title, and a lead sentence under it. */
function titleColumn(slide, title, lead) {
  text(slide, title, {
    x: COL_TITLE.x,
    y: TOP,
    w: COL_TITLE.w,
    h: 1.2,
    fontSize: 24,
    bold: false,
    color: PRIMARY,
    lineSpacingMultiple: 1.1,
  });
  if (lead) {
    text(slide, lead, {
      x: COL_TITLE.x,
      y: TOP + 1.25,
      w: COL_TITLE.w,
      h: 1.6,
      fontSize: 11.5,
      color: TERTIARY,
      lineSpacingMultiple: 1.35,
    });
  }
}

/**
 * Rows divided by hairlines, as the FAQ and the pricing features are: each
 * row is a small label on the left and a value on the right, or one text
 * across the row.
 */
/**
 * How many lines a string takes at a given width and size. Inter's average
 * character is a little over half an em wide; the estimate errs long, so a
 * row is never too short for its text.
 */
function lines(str, w, fontSize) {
  const perLine = Math.max(8, Math.floor((w * 72) / (fontSize * 0.53)));
  return Math.max(1, Math.ceil(str.length / perLine));
}

function rows(pres, slide, x, y, w, items, { labelW = 1.3, fontSize = 12 } = {}) {
  const lineH = (fontSize * 1.3) / 72;
  let cy = y;
  line(pres, slide, x, cy, x + w, cy);
  for (const item of items) {
    const [head, body] = Array.isArray(item) ? item : [null, item];
    const bodyW = head ? w - labelW : w;
    const rowH = 0.26 + lines(body, bodyW, fontSize) * lineH;
    if (head) {
      label(slide, head, x, cy + 0.15, labelW);
    }
    text(slide, body, {
      x: head ? x + labelW : x,
      y: cy + 0.12,
      w: bodyW,
      h: rowH - 0.12,
      fontSize,
      color: SECONDARY,
      lineSpacingMultiple: 1.3,
    });
    cy += rowH;
    line(pres, slide, x, cy, x + w, cy);
  }
  return cy;
}

/** Everything every slide has: the canvas, the mark, the running footer. */
function base(pres, slide, footer, number) {
  slide.background = { color: BG };
  mark(pres, slide, GUTTER, FOOTER_Y + 0.02, 0.12, TERTIARY);
  label(slide, footer, GUTTER + 0.3, FOOTER_Y, 6);
  label(slide, String(number).padStart(2, "0"), W - GUTTER - 0.6, FOOTER_Y, 0.6, { align: "right" });
}

/* ---- Slide kinds ---------------------------------------------------------- */

function cover(pres, footer, n, { kicker, title, sub, figure, notes }) {
  const slide = pres.addSlide();
  base(pres, slide, footer, n);
  label(slide, kicker, GUTTER, 1.4, 4);
  text(slide, title, {
    x: GUTTER,
    y: 1.75,
    w: 5.4,
    h: 1.6,
    fontSize: 34,
    color: PRIMARY,
    lineSpacingMultiple: 1.08,
  });
  text(slide, sub, {
    x: GUTTER,
    y: 3.5,
    w: 4.6,
    h: 0.9,
    fontSize: 12,
    color: TERTIARY,
    lineSpacingMultiple: 1.4,
  });
  figure(pres, slide, 6.3, 1.5, 2.8);
  if (notes) slide.addNotes(notes);
  return slide;
}

/** One sentence in white that carries on in grey, as the principles lead does. */
function statement(pres, footer, n, { lead, rest, notes }) {
  const slide = pres.addSlide();
  base(pres, slide, footer, n);
  slide.addText(
    [
      { text: lead + " ", options: { color: PRIMARY } },
      { text: rest, options: { color: TERTIARY } },
    ],
    {
      isTextBox: true,
      margin: 0,
      x: GUTTER,
      y: 1.5,
      w: W - 2 * GUTTER,
      h: 2.6,
      fontFace: FONT,
      fontSize: 28,
      valign: "top",
      lineSpacingMultiple: 1.15,
    },
  );
  if (notes) slide.addNotes(notes);
  return slide;
}

function content(pres, footer, n, { title, lead, notes }, draw) {
  const slide = pres.addSlide();
  base(pres, slide, footer, n);
  titleColumn(slide, title, lead);
  draw(slide);
  if (notes) slide.addNotes(notes);
  return slide;
}

/**
 * The flow the improvement makes: the systems on either side, the solution
 * between them, drawn as one cube, and what passes along the dashed lines.
 */
function flowDiagram(pres, slide, x, y, w, { from, to, middle, caption }) {
  const boxW = 1.55;
  const boxH = 0.62;
  const cy = y + 0.45;
  const leftX = x;
  const rightX = x + w - boxW;
  const midX = x + w / 2;
  for (const [bx, name] of [[leftX, from], [rightX, to]]) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: bx,
      y: cy - boxH / 2,
      w: boxW,
      h: boxH,
      rectRadius: 0.08,
      fill: { color: FACE },
      line: { color: LINE, width: 0.75 },
    });
    text(slide, name, {
      x: bx,
      y: cy - boxH / 2,
      w: boxW,
      h: boxH,
      fontSize: 11,
      color: SECONDARY,
      align: "center",
      valign: "middle",
    });
  }
  const cw = 0.34;
  cube(pres, slide, midX, cy + cw / 2, cw, { emphasis: true, lit: true });
  line(pres, slide, leftX + boxW + 0.08, cy, midX - cw - 0.08, cy, { color: LINE_STRONG, dash: "sysDash" });
  line(pres, slide, midX + cw + 0.08, cy, rightX - 0.08, cy, { color: LINE_STRONG, dash: "sysDash" });
  label(slide, middle, midX - 1.5, cy + cw + 0.28, 3, { align: "center" });
  text(slide, caption, {
    x: x,
    y: cy + cw + 0.52,
    w,
    h: 0.3,
    fontSize: 10,
    color: TERTIARY,
    align: "center",
  });
  return cy + cw + 1.0;
}

/* ---- Deck 1: Forslag ------------------------------------------------------ */

function buildProposal() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "INIT";
  pres.title = "Forslag – Eksempel AS";
  const footer = "INIT · Forslag · Eksempel AS · September 2026";
  let n = 0;

  cover(pres, footer, ++n, {
    kicker: "Forslag · 22. september 2026",
    title: "Ukesrapporten, klar mandag morgen.",
    sub: "Et konkret forslag til Eksempel AS etter samtalen 18. september: hva som bygges, hva det koster og når det er levert.",
    figure: figureColumns,
    notes:
      "Bytt ut: kundens navn, datoen, og tittelen. Tittelen er forbedringen i én setning, sett fra kundens side – ikke teknologien. Undertittelen viser til samtalen dere hadde, med dato.",
  });

  content(
    pres,
    footer,
    ++n,
    {
      title: "Problemet, slik jeg forsto det",
      lead: "Slik ble det beskrevet i samtalen. Si fra om noe er feil eller mangler, så oppdaterer jeg forslaget.",
      notes:
        "Bruk kundens egne ord fra samtalen. Rader: hva oppgaven er, hvem som gjør den, hvor ofte, og hva den koster i tid. Denne siden er der kunden avgjør om du hørte etter.",
    },
    (slide) => {
      rows(pres, slide, COL_BODY.x, TOP, COL_BODY.w, [
        ["Hva", "Ukesrapporten til ledermøtet settes sammen fra regnskapssystemet og et regneark med salgstall."],
        ["Hvem", "Daglig leder, med hjelp fra regnskapsfører når tallene ikke stemmer."],
        ["Hvor ofte", "Hver mandag, før møtet klokken 10."],
        ["Tidsbruk", "Rundt fire timer i uken. Oftere når en kolonne er flyttet i regnearket."],
        ["Konsekvens", "Møtet starter uten ferske tall, eller starter sent."],
      ], {});
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Forslaget",
      lead: "Rapporten lages av seg selv natt til mandag og ligger i innboksen klokken 07. Systemene dere har i dag beholdes som de er.",
      notes:
        "Én setning som sier hva som blir annerledes for kunden, og diagrammet som viser hvor løsningen sitter mellom systemene de allerede bruker. Ikke beskriv teknologien mer enn kunden spør om.",
    },
    (slide) => {
      const after = flowDiagram(pres, slide, COL_BODY.x, TOP, COL_BODY.w, {
        from: "Regnskapssystem",
        to: "Rapport i innboksen",
        middle: "INIT-løsningen",
        caption: "Henter ukens tall, kontrollerer dem og sender rapporten som PDF og regneark, mandag 07:00.",
      });
      rows(pres, slide, COL_BODY.x, after, COL_BODY.w, [
        "Salgstallene hentes fra det samme regnearket som i dag, så ingen må endre arbeidsmåte.",
        "Avvik mellom kildene markeres i rapporten i stedet for å stoppe den.",
      ], { fontSize: 11 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Avgrensning",
      lead: "Ett problem av gangen. Det som står til høyre er det som gjør fastprisen mulig.",
      notes:
        "To kolonner med like mye plass. Kolonnen «ikke inkludert» er den viktigste på siden: den beskytter fastprisen og gjør det tydelig hva som eventuelt blir et nytt lite prosjekt.",
    },
    (slide) => {
      const half = (COL_BODY.w - 0.4) / 2;
      label(slide, "Inkludert", COL_BODY.x, TOP, half);
      rows(pres, slide, COL_BODY.x, TOP + 0.3, half, [
        "Henting av ukens tall fra regnskapssystemet",
        "Innlesing av salgstall fra regnearket",
        "Rapport som PDF og regneark, sendt på e-post",
        "Kontroll som markerer avvik",
        "Testing med fire reelle uker",
      ], { fontSize: 11 });
      const rx = COL_BODY.x + half + 0.4;
      label(slide, "Ikke inkludert", rx, TOP, half);
      rows(pres, slide, rx, TOP + 0.3, half, [
        "Endringer i regnskapssystemet eller regnearket",
        "Nye nøkkeltall utover dagens rapport",
        "Rapporter for andre avdelinger",
        "Dashbord eller innlogging",
        "Drift og overvåking etter 14 dager (se Trygg drift)",
      ], { fontSize: 11 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Resultat og mål",
      lead: "Det ene tallet vi sjekker ved overlevering, og hvordan vi sjekker det.",
      notes:
        "Ett mål, formulert som på nettsiden («Mindre sammenstilling»), og ett tall før og etter. Si også hvordan det måles ved overlevering, med reelle eksempler.",
    },
    (slide) => {
      label(slide, "Mål", COL_BODY.x, TOP, 2);
      text(slide, "Mindre sammenstilling", {
        x: COL_BODY.x, y: TOP + 0.25, w: COL_BODY.w, h: 0.5, fontSize: 20, color: PRIMARY,
      });
      const half = (COL_BODY.w - 0.4) / 2;
      for (const [i, [head, big, small]] of [
        ["I dag", "4 timer", "hver mandag, før møtet"],
        ["Etter", "15 min", "til å lese rapporten og sjekke avvik"],
      ].entries()) {
        const x = COL_BODY.x + i * (half + 0.4);
        line(pres, slide, x, TOP + 1.0, x + half, TOP + 1.0);
        label(slide, head, x, TOP + 1.15, half);
        text(slide, big, { x, y: TOP + 1.4, w: half, h: 0.7, fontSize: 32, color: i === 1 ? PRIMARY : SECONDARY });
        text(slide, small, { x, y: TOP + 2.12, w: half, h: 0.5, fontSize: 10.5, color: TERTIARY, lineSpacingMultiple: 1.3 });
      }
      rows(pres, slide, COL_BODY.x, TOP + 2.85, COL_BODY.w, [
        ["Slik måles det", "Fire uker kjøres på ekte tall før overlevering, og rapporten sammenlignes med den som ble laget for hånd."],
      ], { labelW: 1.5, fontSize: 11 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Plan og leveringsdato",
      lead: "Levert tirsdag 20. oktober. Datoene forutsetter at jeg får det som står nederst innen 29. september.",
      notes:
        "De fire stegene fra nettsiden med datoer, og det du trenger fra kunden: tilganger, eksempler, én kontaktperson. For et enkeltpersonsforetak er dette siden som hindrer forsinkelser.",
    },
    (slide) => {
      const steps = [
        ["01", "Kort prat", "18. sep", "Gjort"],
        ["02", "Tilbud", "22. sep", "Dette dokumentet"],
        ["03", "Bygging og testing", "29. sep – 17. okt", "Fire uker på ekte tall"],
        ["04", "Overlevering", "20. okt", "Gjennomgang og 14 dager"],
      ];
      const colW = COL_BODY.w / steps.length;
      line(pres, slide, COL_BODY.x, TOP + 0.55, COL_BODY.x + COL_BODY.w, TOP + 0.55, { color: LINE_STRONG, dash: "sysDash" });
      steps.forEach(([num, name, date, note], i) => {
        const x = COL_BODY.x + i * colW;
        cube(pres, slide, x + 0.12, TOP + 0.62, 0.11, { emphasis: true, lit: i === 1 });
        label(slide, num, x, TOP, colW);
        text(slide, name, { x, y: TOP + 0.85, w: colW - 0.15, h: 0.5, fontSize: 12, color: PRIMARY, lineSpacingMultiple: 1.2 });
        text(slide, date, { x, y: TOP + 1.4, w: colW - 0.15, h: 0.3, fontSize: 10.5, color: SECONDARY });
        text(slide, note, { x, y: TOP + 1.7, w: colW - 0.15, h: 0.6, fontSize: 9.5, color: TERTIARY, lineSpacingMultiple: 1.3 });
      });
      label(slide, "Det jeg trenger fra dere", COL_BODY.x, TOP + 2.3, COL_BODY.w);
      rows(pres, slide, COL_BODY.x, TOP + 2.55, COL_BODY.w, [
        "Lesetilgang til regnskapssystemet, i Eksempel AS sitt navn",
        "Regnearket for salgstall og de fire siste ukesrapportene",
        "Én kontaktperson som kan svare innen en dag i byggeperioden",
      ], { fontSize: 10.5 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Pris",
      lead: "Fast pris, avtalt før arbeidet starter. Ingen bindingstid og ingen fakturaer dere ikke har sett komme.",
      notes:
        "Fastprisen stort, det som er inkludert som rader, og Trygg drift som et valg – ikke et vilkår. Eierskap står her fordi det er det spørsmålet som oftest kommer etterpå.",
    },
    (slide) => {
      label(slide, "Første forbedring · fast pris", COL_BODY.x, TOP, 3);
      text(slide, "12 500 kr", { x: COL_BODY.x, y: TOP + 0.25, w: 3, h: 0.7, fontSize: 32, color: PRIMARY });
      text(slide, "eks. mva. Faktureres ved overlevering.", { x: COL_BODY.x, y: TOP + 0.98, w: 3, h: 0.3, fontSize: 10, color: TERTIARY });
      rows(pres, slide, COL_BODY.x, TOP + 1.4, COL_BODY.w, [
        "Én klart definert forbedring, som avgrenset på side 4",
        "Bygging og testing på ekte tall",
        "Enkel dokumentasjon på norsk og gjennomgang ved overlevering",
        "14 dager med justering og feilretting",
        "Kontoer og tilganger i Eksempel AS sitt navn. Dere eier løsningen.",
      ], { fontSize: 10.5 });
      label(slide, "Valgfritt", COL_TITLE.x, 3.35, COL_TITLE.w);
      rows(pres, slide, COL_TITLE.x, 3.6, COL_TITLE.w, [
        "Trygg drift fra 1 490 kr/mnd.: overvåking, feilretting og mindre oppdateringer. Ingen bindingstid.",
      ], { fontSize: 10.5 });
    },
  );

  statement(pres, footer, ++n, {
    lead: "Neste steg: svar på denne e-posten med «ok».",
    rest: "Da sender jeg en kort avtale og en liste over tilgangene, og byggingen starter 29. september.",
    notes:
      "Én handling, og hva som skjer når kunden gjør den. Ikke flere valg enn ett.",
  });

  return pres.writeFile({ fileName: path.join(OUT, "INIT-forslag.pptx") });
}

/* ---- Deck 2: Overlevering ------------------------------------------------- */

function buildHandover() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = "INIT";
  pres.title = "Overlevering – Eksempel AS";
  const footer = "INIT · Overlevering · Eksempel AS · Oktober 2026";
  let n = 0;

  cover(pres, footer, ++n, {
    kicker: "Overlevering · 20. oktober 2026",
    title: "Ukesrapporten, klar mandag morgen.",
    sub: "Gjennomgang av det som er levert til Eksempel AS: slik virker det, slik brukes det, og hva som skjer de neste 14 dagene.",
    figure: figureStack,
    notes:
      "Samme tittel som på forslaget, med vilje: kunden skal se at det som ble lovet er det som ble levert. Bytt dato.",
  });

  content(
    pres,
    footer,
    ++n,
    {
      title: "Dette ble levert",
      lead: "Mot forslaget fra 22. september, punkt for punkt.",
      notes:
        "Forslagets «inkludert»-liste, med status. Alt skal stå som «Levert» – står det noe annet, er ikke overleveringen klar.",
    },
    (slide) => {
      rows(pres, slide, COL_BODY.x, TOP, COL_BODY.w, [
        ["Levert", "Henting av ukens tall fra regnskapssystemet"],
        ["Levert", "Innlesing av salgstall fra regnearket"],
        ["Levert", "Rapport som PDF og regneark, sendt mandag 07:00"],
        ["Levert", "Kontroll som markerer avvik mellom kildene"],
        ["Levert", "Testet på fire reelle uker, sammenlignet med de manuelle rapportene"],
      ], { labelW: 1.0, fontSize: 11.5 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Slik virker det",
      lead: "Det som skjer av seg selv, og det ene stedet et menneske fortsatt ser over.",
      notes:
        "Diagrammet fra forslaget, nå med hva som går automatisk og hvor en person fortsatt sjekker. Hold det på ett nivå: kunden skal kunne forklare dette videre selv.",
    },
    (slide) => {
      const after = flowDiagram(pres, slide, COL_BODY.x, TOP, COL_BODY.w, {
        from: "Regnskapssystem",
        to: "Rapport i innboksen",
        middle: "INIT-løsningen",
        caption: "Kjører natt til mandag klokken 04. Rapporten er i innboksen klokken 07.",
      });
      rows(pres, slide, COL_BODY.x, after, COL_BODY.w, [
        ["Automatisk", "Henting, sammenstilling, kontroll og utsending."],
        ["Menneske", "Avvik markert i gult i rapporten sjekkes av daglig leder før møtet."],
      ], { labelW: 1.2, fontSize: 11 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Slik bruker dere det",
      lead: "Rutinen på mandag, og hva dere gjør når noe ser feil ut.",
      notes:
        "Dagsrutinen som en kort liste, og hva kunden gjør når noe ser galt ut. Skriv den som en oppskrift; det er denne siden som ender som utskrift ved pulten.",
    },
    (slide) => {
      rows(pres, slide, COL_BODY.x, TOP, COL_BODY.w, [
        ["07:00", "Rapporten ligger i innboksen til daglig leder og regnskapsfører."],
        ["Før møtet", "Se over rader markert i gult. De betyr at kildene ikke stemte overens."],
        ["Kommer ikke", "Sjekk at regnearket ligger på samme sted og har samme kolonner. Send meg en melding hvis det er i orden."],
        ["Feil tall", "Svar på rapport-e-posten med hvilken rad. Jeg svarer innen én arbeidsdag i de 14 dagene."],
      ], { labelW: 1.2, fontSize: 11 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Resultat",
      lead: "Målt mot målet i forslaget, på de fire ukene løsningen ble testet på.",
      notes:
        "Samme mål og samme før-tall som i forslaget, og det målte etter-tallet. Denne siden er også kilden til et LinkedIn-innlegg og, etter 14 dager, til spørsmålet om et sitat.",
    },
    (slide) => {
      label(slide, "Mål", COL_BODY.x, TOP, 2);
      text(slide, "Mindre sammenstilling", {
        x: COL_BODY.x, y: TOP + 0.25, w: COL_BODY.w, h: 0.5, fontSize: 20, color: PRIMARY,
      });
      const half = (COL_BODY.w - 0.4) / 2;
      for (const [i, [head, big, small]] of [
        ["Før", "4 timer", "hver mandag, satt sammen for hånd"],
        ["Etter", "15 min", "målt over fire mandager"],
      ].entries()) {
        const x = COL_BODY.x + i * (half + 0.4);
        line(pres, slide, x, TOP + 1.0, x + half, TOP + 1.0);
        label(slide, head, x, TOP + 1.15, half);
        text(slide, big, { x, y: TOP + 1.4, w: half, h: 0.7, fontSize: 32, color: i === 1 ? PRIMARY : SECONDARY });
        text(slide, small, { x, y: TOP + 2.12, w: half, h: 0.5, fontSize: 10.5, color: TERTIARY, lineSpacingMultiple: 1.3 });
      }
      rows(pres, slide, COL_BODY.x, TOP + 2.85, COL_BODY.w, [
        ["Avvik funnet", "Tre av fire uker hadde en rad der regnearket og regnskapet ikke stemte. To av dem var feil i regnearket."],
      ], { labelW: 1.5, fontSize: 11 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "Eierskap og tilganger",
      lead: "Alt står i Eksempel AS sitt navn. Dere kan ta det videre uten meg.",
      notes:
        "Hvor alt ligger, hvem som eier hver konto, og hvor dokumentasjonen er. Ingen tilganger skal stå i INITs navn etter denne siden.",
    },
    (slide) => {
      rows(pres, slide, COL_BODY.x, TOP, COL_BODY.w, [
        ["Kjøring", "Automatiseringskontoen, opprettet på post@eksempel.no. Passord er sendt til daglig leder."],
        ["Regnskap", "Lesetilgang for automatiseringskontoen. Kan fjernes av dere når som helst."],
        ["Regneark", "Uendret. Løsningen leser fra samme fil som før."],
        ["Dokumentasjon", "Én side på norsk: hva løsningen gjør, hvor den kjører, og hva man gjør når den stopper. Ligger i den delte mappen."],
      ], { labelW: 1.4, fontSize: 11 });
    },
  );

  content(
    pres,
    footer,
    ++n,
    {
      title: "De neste 14 dagene",
      lead: "Justering og feilretting er inkludert til 3. november. Deretter velger dere.",
      notes:
        "Hvordan de melder feil, Trygg drift som valg, og listen over ting du la merke til underveis som var utenfor avgrensningen. Den siste listen er ditt neste prosjekt – men det er kunden som velger.",
    },
    (slide) => {
      const after = rows(pres, slide, COL_BODY.x, TOP, COL_BODY.w, [
        ["Til 3. nov", "Svar på rapport-e-posten eller send en melding. Jeg svarer innen én arbeidsdag."],
        ["Etterpå", "Trygg drift fra 1 490 kr/mnd.: overvåking, feilretting og mindre oppdateringer. Ingen bindingstid. Eller ingenting: løsningen kjører videre som den er."],
      ], { labelW: 1.2, fontSize: 11 });
      label(slide, "Lagt merke til underveis, utenfor avgrensningen", COL_BODY.x, after + 0.3, COL_BODY.w);
      rows(pres, slide, COL_BODY.x, after + 0.55, COL_BODY.w, [
        "Salgstallene legges inn for hånd i regnearket fra kassesystemet. Det kan hentes direkte.",
        "Regnskapsfører lager en lignende rapport for styret hver måned.",
      ], { fontSize: 10.5 });
      figureAgents(pres, slide, COL_TITLE.x - 0.15, 3.05, 1.6);
    },
  );

  return pres.writeFile({ fileName: path.join(OUT, "INIT-overlevering.pptx") });
}

Promise.all([buildProposal(), buildHandover()]).then((files) => {
  for (const f of files) console.log("wrote", f);
});
