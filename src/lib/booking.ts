import type { Lang } from "@/lib/translations";

/**
 * Reading a chosen slot back out of the /book URL.
 *
 * Generating slots is no longer done here — that moved to `availability.ts`
 * and the `/api/availability` route, which subtract real busy time from the
 * opening hours. This file only turns the id the calendar links to back into
 * something a person can read on the confirmation page.
 */

const LOCALE: Record<Lang, string> = { no: "nb-NO", en: "en-GB" };

/** "mandag 22. september" / "Monday 22 September" */
export function formatDayLong(date: Date, lang: Lang): string {
  return date.toLocaleDateString(LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Turns a slot id ("2026-09-22T09:00") into a label, or null if malformed. */
export function parseSlot(slot: string | null, lang: Lang): string | null {
  if (!slot) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(slot);
  if (!match) return null;
  const [, y, m, d, hh, mm] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(date.getTime())) return null;
  return `${formatDayLong(date, lang)}, ${hh}:${mm}`;
}
