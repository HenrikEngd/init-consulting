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

/**
 * Stand-ins, so the attribution line can be seen and judged before there is a
 * client to put on it.
 *
 * They never reach a production build: the export below hands them out only
 * while `NODE_ENV` is development, and they disappear the moment
 * `clientTestimonials` has a single real entry. `npm run build` ships the real
 * list, which today means the cards fall back to their outcome line.
 *
 * Nordmann is the Norwegian John Doe and every company here says Eksempel or
 * Demo, so if one of these is ever seen by someone it reads as a page that is
 * not finished rather than as a claim about work that was done.
 */
const previewTestimonials: Testimonial[] = [
  {
    projectId: "report",
    quote: {
      no: "Mandagene gikk fra en halv arbeidsdag med regneark til en rapport som allerede ligger i innboksen.",
    },
    name: "Kari Nordmann",
    company: "Eksempel AS",
  },
  {
    projectId: "crm",
    quote: {
      no: "Ingen taster inn de samme opplysningene to ganger lenger, og vi finner igjen det vi leter etter.",
    },
    name: "Ola Nordmann",
    company: "Demo Bygg AS",
  },
  {
    projectId: "documents",
    quote: {
      no: "Fakturaene leses inn og kontrolleres av seg selv. Vi ser bare på de som faktisk trenger et blikk.",
    },
    name: "Marte Nordmann",
    company: "Eksempel Handel AS",
  },
  {
    projectId: "inbox",
    quote: {
      no: "Henvendelsene havner hos riktig person med en gang, uten at noen må sortere innboksen hver morgen.",
    },
    name: "Per Nordmann",
    company: "Demo Regnskap AS",
  },
  {
    projectId: "meetings",
    quote: {
      no: "Oppfølgingen etter møtene skjer nå av seg selv. Ingenting blir liggende igjen i notatblokka.",
    },
    name: "Ingrid Nordmann",
    company: "Eksempel Logistikk AS",
  },
  {
    projectId: "systems",
    quote: {
      no: "Systemene snakker endelig sammen. Det som før tok en ettermiddag i uka, tar nå ingen tid.",
    },
    name: "Jonas Nordmann",
    company: "Demo Teknikk AS",
  },
];

export const testimonials: Testimonial[] =
  clientTestimonials.length === 0 && process.env.NODE_ENV === "development"
    ? previewTestimonials
    : clientTestimonials;

export function testimonialFor(projectId: string): Testimonial | undefined {
  return testimonials.find((t) => t.projectId === projectId);
}
