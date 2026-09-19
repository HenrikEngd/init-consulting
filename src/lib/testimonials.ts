import type { Lang } from "@/lib/translations";

export interface Testimonial {
  /** Must match an id in `projects.items` so the quote renders on that card. */
  projectId: string;
  /** The quote itself. Keep it in the language the client actually said it in. */
  quote: Partial<Record<Lang, string>> & { no: string };
  /** Attribution. A quote without a real name and company reads as invented. */
  name: string;
  company: string;
  /**
   * Path to a square photo in `public/avatars/`, e.g. `/avatars/kari.jpg`. That
   * folder does not exist yet — create it with the first photo, and note that a
   * path pointing at a missing file is a 404, not an empty circle.
   *
   * Optional: without one the card draws the initials in the same circle, which
   * is better than a stock portrait of someone who is not the client.
   */
  avatar?: string;
}

/**
 * REAL CLIENT QUOTES ONLY.
 *
 * This is intentionally empty. Nothing here is invented, because a fabricated
 * testimonial is the fastest way to lose a Norwegian SMB buyer who checks, and
 * it is not something that can be added back credibly once spotted.
 *
 * The projects section renders perfectly well while this is empty: each card
 * shows the work type and a typical outcome on the attribution line. The moment
 * a quote is added, that line becomes the client's avatar, name and company.
 *
 * After the first sprint, ask the client two questions and paste the answers:
 *   1. "What did this actually save you, in hours or in kroner?"
 *   2. "What would you say to another owner considering it?"
 *
 * Keep the quote under about 170 characters. Every card in the rail is as tall
 * as the tallest one, so a long quote stretches all six and leaves the cards
 * without a quote looking hollow. Measured at the current card size, the phone
 * is the binding constraint: up to 170 characters the card stays at its
 * designed 416px on a 390px screen and 456px on a desktop; 180 takes the phone
 * to 440px, and 200 takes the desktop to 470px. Trim to the sentence that
 * carries the point, and ask the client to approve the trimmed version.
 *
 * Then add an entry. Get written permission to use the name, the company and
 * the photo — the photo separately, since agreeing to be quoted is not the same
 * as agreeing to appear:
 *
 *   {
 *     projectId: "report",
 *     quote: {
 *       no: "Mandagene gikk fra en halv arbeidsdag til en kopp kaffe.",
 *       en: "Mondays went from half a working day to a cup of coffee.",
 *     },
 *     name: "Kari Nordmann",
 *     company: "Eksempel AS",
 *     avatar: "/avatars/kari-nordmann.jpg",
 *   },
 */
const clientTestimonials: Testimonial[] = [];

export const testimonials: Testimonial[] = clientTestimonials;

export function testimonialFor(projectId: string): Testimonial | undefined {
  return testimonials.find((t) => t.projectId === projectId);
}
