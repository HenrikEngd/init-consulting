/**
 * The anchors shared by the header and the footer.
 *
 * Kept in one place, and in the order the sections appear on the page: the
 * two navs had their own copies, which is how the order drifted out of step
 * with the page in the first place. `key` indexes `nav` in the dictionaries.
 */
export const navAnchors = [
  { key: "process", id: "prosessen" },
  { key: "work", id: "prosjekter" },
  { key: "pricing", id: "priser" },
  { key: "contact", id: "kontakt" },
] as const;
