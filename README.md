# INIT

Marketing site for INIT, a Norwegian sole proprietorship that removes one
recurring manual task at a time for small service businesses: automation,
integrations, AI and small internal tools, at a fixed price and with an agreed
delivery date.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Framer Motion.
One page plus a booking page. The only server code is the availability route,
which reads free slots from a Google calendar when credentials are configured
and falls back to opening hours when they are not.

## Design

Dark only, one typeface, no colour: hierarchy comes from three greys and from
size, emphasis from light. Illustrations are line drawings of unit cubes on one
isometric grid. The mark is `*>`. The full system, with every value and the
reasoning behind it, is in [brand/DESIGN.md](brand/DESIGN.md); the tokens live
in `src/app/globals.css`.

## Structure

- `src/app/page.tsx` assembles the sections; `src/app/book/` is the booking
  page; `src/app/api/availability/` the calendar route.
- `src/components/sections/` holds one component per section: Header, Hero,
  Principles, Process, Projects, FAQ, Pricing, Booking, CTA, Footer.
- `src/components/ui/IsometricFigures.tsx` draws the hero platform and the
  three principle figures; `LogoMark.tsx` draws the mark.
- `src/components/motion/FadeIn.tsx` is the shared entrance animation.
- `src/lib/translations.ts` holds all copy in Norwegian (default) and English.
  Edit both when wording changes.
- `src/lib/site-config.ts` holds the contact email and LinkedIn URL.
- `src/lib/testimonials.ts` holds client quotes. It is empty on purpose and
  explains the rule.
- `brand/` holds exported logos and LinkedIn banners; `decks/` the proposal and
  handover PowerPoint templates and the script that builds them.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Copy `.env.example` to `.env.local` and fill in one of the two calendar
options to show real availability. Without it the site still runs.

## Deploy

Any host that runs Next.js. Vercel is the zero-config option: connect the
repository and set the calendar variables in the project settings.
