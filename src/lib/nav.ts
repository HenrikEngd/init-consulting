/**
 * The navigation shared by the header and the footer.
 *
 * Kept in one place, and in the order the items appear on the page: the two
 * navs had their own copies, which is how the order drifted out of step with
 * the page in the first place. `key` indexes `nav` in the dictionaries.
 *
 * Most items are anchors into the one-pager and carry the `id` of the section
 * they point at, which is also what the header watches to highlight the
 * current one. An item without an `id` is a page of its own.
 */
export const navItems = [
  { key: "process", href: "#prosessen", id: "prosessen" },
  { key: "work", href: "#prosjekter", id: "prosjekter" },
  { key: "pricing", href: "#priser", id: "priser" },
  { key: "about", href: "/about", id: null },
  { key: "contact", href: "#kontakt", id: "kontakt" },
] as const;

/**
 * The section ids the header observes, in page order. Built once at module
 * level so the observer is not torn down and rebuilt on every render.
 */
export const navSectionIds: string[] = navItems.flatMap((item) =>
  item.id ? [item.id] : [],
);
