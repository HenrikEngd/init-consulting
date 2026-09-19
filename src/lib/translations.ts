export type Lang = "no" | "en";

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    work: string;
    process: string;
    pricing: string;
    about: string;
    contact: string;
    cta: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
  };
  principles: {
    /** Set in white; the rest of the sentence carries on in grey. */
    titleLead: string;
    titleRest: string;
    items: { title: string; desc: string }[];
  };
  process: {
    title: string;
    subtitle: string;
    steps: { number: string; title: string; desc: string }[];
  };
  projects: {
    title: string;
    subtitle: string;
    /** Used while there are no real client quotes, so the heading never promises feedback that is not on the page. */
    titleEmpty: string;
    subtitleEmpty: string;
    metricLabel: string;
    items: { id: string; title: string; desc: string; metric: string }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    tiers: {
      id: string;
      name: string;
      price: string;
      priceNote: string;
      desc: string;
      features: string[];
      cta: string;
    }[];
  };
  booking: {
    title: string;
    subtitle: string;
    pick: string;
    pickTime: string;
    unavailable: string;
    noTimes: string;
    loading: string;
    prevMonth: string;
    nextMonth: string;
    /** Shown when busy time has been subtracted from a connected calendar. */
    sourceCalendar: string;
    /** Shown when only the opening-hours rules have been applied. */
    sourceHours: string;
  };
  faq: {
    title: string;
    subtitle: string;
    items: { q: string; a: string }[];
  };
  bookingPage: {
    back: string;
    heading: string;
    intro: string;
    selectedLabel: string;
    noSlot: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    note: string;
  };
  /**
   * The about page. The one-pager says what the work is; this says who the
   * reader will be dealing with, which is the question a sole proprietorship
   * has to answer before anything else.
   */
  about: {
    back: string;
    heading: string;
    /** Describes the portrait for anyone who cannot see it. */
    portraitAlt: string;
    /** One sentence, set brighter than the body, as on the front page. */
    lead: string;
    /** Body paragraphs, in order. */
    body: string[];
    experienceTitle: string;
    /**
     * Prior roles, newest first. While this is empty the section is not
     * rendered at all: a page with no history on it is only thin, whereas an
     * invented one is a claim the reader can check.
     */
    experience: { role: string; org: string; period: string }[];
    contactTitle: string;
    contactBook: string;
  };
  cta: {
    titleLine1: string;
    titleLine2: string;
    primary: string;
    secondary: string;
  };
  footer: { tagline: string; navTitle: string; contactTitle: string };
}

const no: Dictionary = {
  meta: {
    title: "INIT Consulting",
    description:
      "INIT forbedrer arbeidsflyt, automatiserer rutinearbeid og kobler sammen systemene bedriften allerede bruker. Avgrensede oppdrag med avtalt pris og leveranse.",
  },
  nav: {
    work: "Eksempler",
    process: "Slik foregår det",
    pricing: "Priser",
    about: "Om",
    contact: "Kontakt",
    cta: "Avtal en samtale",
  },
  hero: {
    title: "Praktiske forbedringer i systemene dere allerede bruker.",
    subtitle:
      "INIT kobler sammen verktøy, automatiserer rutinearbeid og bygger enkle interne løsninger. Ett avgrenset oppdrag om gangen, med avtalt pris og leveranse.",
    ctaPrimary: "Avtal en innledende samtale",
  },
  principles: {
    titleLead: "Tydelig avgrenset.",
    titleRest:
      "Hvert oppdrag har én prioritert leveranse, en avtalt tidsramme og en pris dere kjenner før arbeidet starter.",
    items: [
      {
        title: "Arbeidet forstås først",
        desc: "Vi går gjennom rutinen med dem som bruker den og avklarer hvor en forbedring vil ha størst verdi.",
      },
      {
        title: "Det eksisterende er utgangspunktet",
        desc: "Løsningen bygges rundt verktøyene og dataene dere allerede har, så langt det er teknisk og økonomisk fornuftig.",
      },
      {
        title: "Leveransen er konkret",
        desc: "Omfang, pris og tidspunkt avtales på forhånd. Ved levering får dere gjennomgang og nødvendig dokumentasjon.",
      },
    ],
  },
  process: {
    title: "Slik arbeider vi",
    subtitle:
      "Vi avklarer behovet før oppstart og følger arbeidet tett sammen med dem som skal bruke løsningen.",
    steps: [
      {
        number: "01",
        title: "Avklaring",
        desc: "Vi går gjennom dagens arbeidsflyt, ønsket resultat og eventuelle tekniske avhengigheter.",
      },
      {
        number: "02",
        title: "Oppstart",
        desc: "Tilganger og ansvar avklares. Leveransen brytes ned i konkrete steg med en tydelig prioritering.",
      },
      {
        number: "03",
        title: "Utvikling og testing",
        desc: "Løsningen bygges og testes fortløpende. Tilbakemeldinger fra brukerne tas inn underveis.",
      },
      {
        number: "04",
        title: "Levering",
        desc: "Dere får en gjennomgang av løsningen, nødvendig dokumentasjon og en anbefaling for videre forvaltning. De neste 30 dagene er justering og feilretting inkludert.",
      },
    ],
  },
  projects: {
    title: "Typiske oppdrag",
    subtitle:
      "Eksempler på leveranser, med tilbakemeldinger fra virksomhetene de er utviklet for.",
    titleEmpty: "Typiske oppdrag",
    subtitleEmpty:
      "Eksempler på avgrensede forbedringer i arbeidsflyt, data og interne systemer.",
    metricLabel: "Resultat",
    items: [
      {
        id: "report",
        title: "Rapporter",
        desc: "Tall hentes fra systemene som allerede brukes og samles i en rapport som er klar når den trengs.",
        metric: "Mindre sammenstilling",
      },
      {
        id: "crm",
        title: "Mellom systemer",
        desc: "Informasjon flyttes dit den skal, uten at noen må kopiere og lime inn de samme opplysningene.",
        metric: "Mindre dobbeltarbeid",
      },
      {
        id: "documents",
        title: "Dokumenter til data",
        desc: "Informasjon i PDF-er og andre dokumenter leses ut, kontrolleres og sendes videre i riktig format.",
        metric: "Mindre manuell registrering",
      },
      {
        id: "inbox",
        title: "Innboks og henvendelser",
        desc: "Innkommende meldinger sorteres, oppsummeres eller sendes videre til riktig person.",
        metric: "Raskere håndtering",
      },
      {
        id: "meetings",
        title: "Etter møtet",
        desc: "Notater kan bli til oppgaver, frister, CRM-oppdateringer og et utkast til oppfølging.",
        metric: "Bedre oppfølging",
      },
      {
        id: "systems",
        title: "Små interne verktøy",
        desc: "En enkel intern side eller funksjon kan erstatte regneark, omveier og tungvinte rutiner.",
        metric: "Enklere arbeidsflyt",
      },
    ],
  },
  pricing: {
    title: "Priser",
    subtitle:
      "Omfang og tidsramme varierer med behovet. Pris og leveringsdato avtales før oppstart.",
    tiers: [
      {
        id: "sprint",
        name: "Avgrenset oppdrag",
        price: "Fra 12 490 kr",
        priceNote: "Fast pris",
        desc: "Ett prioritert behov, fra avklaring til ferdig leveranse. Omfang og tidsramme avtales før oppstart.",
        features: [
          "Omfang og leveringsdato avtalt på forhånd",
          "Bygging og testing i deres egne systemer",
          "Løpende kontakt med dem som skal bruke løsningen",
          "Gjennomgang og dokumentasjon ved levering",
          "30 dager med justering og feilretting inkludert",
          "Videre arbeid avtales separat",
        ],
        cta: "Avtal en samtale",
      },
      {
        id: "custom",
        name: "Større oppdrag",
        price: "Etter avtale",
        priceNote: "Tilbud etter kartlegging",
        desc: "For behov som går ut over ett avgrenset oppdrag, med flere leveranser eller lengre oppfølging.",
        features: [
          "Omfanget kartlegges før pris settes",
          "Arbeidet deles opp i tydelige steg",
          "Skriftlig tilbud med pris og fremdrift",
          "Drift og vedlikehold kan inngå",
          "Videreutvikling planlegges sammen",
        ],
        cta: "Ta en prat om omfanget",
      },
    ],
  },
  faq: {
    title: "Spørsmål og svar",
    subtitle: "Praktisk informasjon om samarbeid, levering og eierskap.",
    items: [
      {
        q: "Hva inngår i et oppdrag?",
        a: "Et avgrenset oppdrag dekker ett prioritert behov, fra avklaring og utvikling til testing, gjennomgang og nødvendig dokumentasjon. De første 30 dagene etter levering er justering og feilretting inkludert.",
      },
      {
        q: "Hva kan INIT hjelpe med?",
        a: "Typiske oppdrag er automatisering, integrasjoner, rapportering, dataflyt, bruk av AI og mindre interne verktøy. Vi starter med behovet og vurderer teknologien deretter.",
      },
      {
        q: "Hvor lang tid tar et oppdrag?",
        a: "Det varierer med behovet. Et avgrenset oppdrag leveres vanligvis i løpet av noen uker, mens små endringer kan gjøres raskere. Omfang og leveringsdato avtales før oppstart.",
      },
      {
        q: "Må arbeidet gjøres hos oss?",
        a: "Nei. Oppdraget kan gjennomføres hos dere, på nett eller som en kombinasjon. Formen avtales ut fra behovet og hvem som skal involveres.",
      },
      {
        q: "Må vi bytte systemene vi bruker?",
        a: "Vanligvis ikke. Målet er å få mer ut av verktøyene dere allerede har, enten ved å koble dem sammen eller forenkle arbeidet rundt dem.",
      },
      {
        q: "Hvem eier det som bygges?",
        a: "Det gjør dere. Kontoer og tilganger settes så langt som mulig opp i deres navn, og nødvendig dokumentasjon følger leveransen.",
      },
      {
        q: "Hva om behovet er større enn ett oppdrag?",
        a: "Da kartlegges omfanget først, og arbeidet deles opp i tydelige steg. Dere får et skriftlig tilbud med pris og fremdrift før noe settes i gang.",
      },
    ],
  },
  booking: {
    title: "Avtal en innledende samtale",
    subtitle:
      "På 30 minutter går vi gjennom behovet og vurderer et passende omfang for et første oppdrag.",
    pick: "Velg dag",
    pickTime: "Velg tidspunkt",
    unavailable: "Ikke tilgjengelig",
    noTimes: "Ingen ledige tider denne dagen.",
    loading: "Henter ledige tider",
    prevMonth: "Forrige måned",
    nextMonth: "Neste måned",
    sourceCalendar: "Ledige tider hentet fra kalenderen.",
    sourceHours: "Standard åpningstider. Tidspunktet bekreftes på e-post.",
  },
  bookingPage: {
    back: "Tilbake til forsiden",
    heading: "Bekreft tidspunktet",
    intro:
      "Beskriv kort hva dere ønsker å forbedre, så kan samtalen forberedes på forhånd.",
    selectedLabel: "Valgt tidspunkt",
    noSlot: "Ingen tid valgt. Gå tilbake og velg et tidspunkt.",
    name: "Navn",
    company: "Bedrift",
    email: "E-post",
    phone: "Telefon (valgfritt)",
    message: "Hva ønsker dere å forbedre?",
    messagePlaceholder:
      "For eksempel: Vi kopierer de samme kundeopplysningene mellom to systemer, eller bruker flere timer på en rapport hver uke.",
    submit: "Send bookingforespørsel",
    note: "Knappen åpner e-postprogrammet ditt med forespørselen ferdig utfylt. Du får en bekreftelse med møtelenke i retur.",
  },
  about: {
    back: "Tilbake til forsiden",
    heading: "Om meg",
    portraitAlt: "Henrik Engdal",
    lead: "INIT er et enkeltpersonsforetak. Det er meg, Henrik Engdal, du snakker med i den første samtalen, og det er meg som bygger og leverer.",
    body: [
      "Jeg jobber alene og tar få oppdrag av gangen. Dere har én kontakt gjennom hele leveransen, fra avklaring til overlevering, og slipper å forklare det samme på nytt til nye folk.",
      "Arbeidet starter med å forstå rutinen før noe bygges. Jeg går gjennom hvordan jobben gjøres i dag, sammen med dem som gjør den, og bygger videre på verktøyene og dataene dere allerede har.",
      "Bakgrunnen min er teknisk. Jeg bygger løsningene selv, og jeg sier fra når en forbedring ikke er verdt det den koster.",
    ],
    experienceTitle: "Bakgrunn",
    experience: [],
    contactTitle: "Ta kontakt",
    contactBook: "Book en innledende samtale",
  },
  cta: {
    titleLine1: "Start med en kort samtale.",
    titleLine2: "Vi avklarer omfang, pris og tidspunkt.",
    primary: "Send en forespørsel",
    secondary: "INIT på LinkedIn",
  },
  footer: {
    tagline:
      "Utvikling og automatisering for norske virksomheter. Avgrensede oppdrag med avtalt pris og leveranse.",
    navTitle: "Sider",
    contactTitle: "Kontakt",
  },
};

const en: Dictionary = {
  meta: {
    title: "INIT Consulting",
    description:
      "INIT improves workflows, automates routine work and connects the systems your business already uses. Clearly scoped engagements with an agreed price and deliverable.",
  },
  nav: {
    work: "Examples",
    process: "How it works",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
    cta: "Book a call",
  },
  hero: {
    title: "Practical improvements to the systems you already use.",
    subtitle:
      "INIT connects tools, automates routine work and builds focused internal solutions. One clearly scoped engagement at a time, with an agreed price and deliverable.",
    ctaPrimary: "Book an introductory call",
  },
  principles: {
    titleLead: "Clearly scoped.",
    titleRest:
      "Each engagement has one priority, a defined timeframe and a price agreed before work begins.",
    items: [
      {
        title: "Understand the work first",
        desc: "We review the workflow with the people who use it and identify where an improvement will have the most value.",
      },
      {
        title: "Build on what is already there",
        desc: "The solution is designed around your existing tools and data wherever that is technically and economically sensible.",
      },
      {
        title: "Deliver something specific",
        desc: "Scope, price and timing are agreed in advance. Delivery includes a walkthrough and the documentation you need.",
      },
    ],
  },
  process: {
    title: "How we work",
    subtitle:
      "We define the need before starting and work closely with the people who will use the solution.",
    steps: [
      {
        number: "01",
        title: "Scoping",
        desc: "We review the current workflow, the intended outcome and any technical dependencies.",
      },
      {
        number: "02",
        title: "Start",
        desc: "Access and responsibilities are confirmed. The deliverable is divided into concrete steps with a clear priority.",
      },
      {
        number: "03",
        title: "Development and testing",
        desc: "The solution is developed and tested continuously, with feedback from users incorporated along the way.",
      },
      {
        number: "04",
        title: "Delivery",
        desc: "You receive a walkthrough of the solution, the necessary documentation and a recommendation for ongoing ownership. Adjustments and bug fixes are included for the next 30 days.",
      },
    ],
  },
  projects: {
    title: "Typical engagements",
    subtitle:
      "Examples of deliverables, with feedback from the businesses they were developed for.",
    titleEmpty: "Typical engagements",
    subtitleEmpty:
      "Examples of focused improvements to workflows, data and internal systems.",
    metricLabel: "Outcome",
    items: [
      {
        id: "report",
        title: "Reports",
        desc: "Numbers are collected from the systems already in use and assembled into a report when it is needed.",
        metric: "Less manual assembly",
      },
      {
        id: "crm",
        title: "Between systems",
        desc: "Information moves where it needs to go without anyone copying and pasting the same details.",
        metric: "Less duplicate work",
      },
      {
        id: "documents",
        title: "Documents to data",
        desc: "Information in PDFs and other documents is extracted, checked and sent on in the right format.",
        metric: "Less manual entry",
      },
      {
        id: "inbox",
        title: "Inbox and enquiries",
        desc: "Incoming messages are sorted, summarised or routed to the right person.",
        metric: "Faster handling",
      },
      {
        id: "meetings",
        title: "After the meeting",
        desc: "Notes can become tasks, deadlines, CRM updates and a draft follow-up message.",
        metric: "Better follow-up",
      },
      {
        id: "systems",
        title: "Small internal tools",
        desc: "A simple internal page or function can replace spreadsheets, workarounds and cumbersome routines.",
        metric: "A simpler workflow",
      },
    ],
  },
  pricing: {
    title: "Pricing",
    subtitle:
      "Scope and timeframe vary with the need. The price and the delivery date are agreed before work begins.",
    tiers: [
      {
        id: "sprint",
        name: "Scoped engagement",
        price: "From 12,490 NOK",
        priceNote: "Fixed price",
        desc: "One priority, from scoping to a completed deliverable. The scope and the timeframe are agreed before work begins.",
        features: [
          "Scope and delivery date agreed in advance",
          "Building and testing in your own systems",
          "Ongoing contact with the people who will use it",
          "Walkthrough and documentation at delivery",
          "30 days of adjustments and bug fixes included",
          "Further work agreed separately",
        ],
        cta: "Book a call",
      },
      {
        id: "custom",
        name: "Larger engagement",
        price: "By agreement",
        priceNote: "Quote after scoping",
        desc: "For needs that go beyond a single engagement, with several deliverables or longer follow-up.",
        features: [
          "The scope is mapped before a price is set",
          "The work is split into clear stages",
          "A written quote with price and schedule",
          "Operations and maintenance can be included",
          "Further development planned together",
        ],
        cta: "Talk about the scope",
      },
    ],
  },
  faq: {
    title: "Questions and answers",
    subtitle: "Practical information about the engagement, delivery and ownership.",
    items: [
      {
        q: "What is included in an engagement?",
        a: "A scoped engagement covers one priority, from scoping and development through testing, a walkthrough and the necessary documentation. Adjustments and bug fixes are included for the first 30 days after delivery.",
      },
      {
        q: "What can INIT help with?",
        a: "Typical engagements include automation, integrations, reporting, data flows, applied AI and small internal tools. We start with the need and assess the technology from there.",
      },
      {
        q: "How long does an engagement take?",
        a: "It varies with the need. A scoped engagement is usually delivered within a few weeks, while small changes can be done faster. The scope and the delivery date are agreed before work begins.",
      },
      {
        q: "Does the work have to happen at our offices?",
        a: "No. The engagement can be completed on site, remotely or as a combination. The format depends on the need and who should be involved.",
      },
      {
        q: "Do we have to replace our current systems?",
        a: "Usually not. The aim is to get more from the tools you already have, either by connecting them or simplifying the work around them.",
      },
      {
        q: "Who owns what gets built?",
        a: "You do. Accounts and access are set up in your name wherever possible, and the necessary documentation is included with delivery.",
      },
      {
        q: "What if the need is larger than one engagement?",
        a: "Then the scope is mapped first and the work is split into clear stages. You receive a written quote with the price and the schedule before anything starts.",
      },
    ],
  },
  booking: {
    title: "Book an introductory call",
    subtitle:
      "In 30 minutes, we will review the need and assess a suitable scope for an initial engagement.",
    pick: "Pick a day",
    pickTime: "Pick a time",
    unavailable: "Unavailable",
    noTimes: "No times available on this day.",
    loading: "Loading available times",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    sourceCalendar: "Times taken from the live calendar.",
    sourceHours: "Standard opening hours. The time is confirmed by email.",
  },
  bookingPage: {
    back: "Back to the front page",
    heading: "Confirm the time",
    intro:
      "Briefly describe what you would like to improve so the call can be prepared in advance.",
    selectedLabel: "Selected time",
    noSlot: "No time selected. Go back and pick one.",
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone (optional)",
    message: "What would you like to improve?",
    messagePlaceholder:
      "For example: we copy the same customer details between two systems, or spend several hours on a report each week.",
    submit: "Send booking request",
    note: "The button opens your email client with the request filled in. You will get a confirmation with a meeting link in return.",
  },
  about: {
    back: "Back to the front page",
    heading: "About me",
    portraitAlt: "Henrik Engdal",
    lead: "INIT is a sole proprietorship. I am Henrik Engdal, the person you speak to in the first conversation and the person who builds and delivers.",
    body: [
      "I work alone and take on few engagements at a time. You have one point of contact from scoping through to handover, and never have to explain the same thing again to someone new.",
      "The work starts by understanding the routine before anything is built. I go through how the job is done today, together with the people who do it, and build on the tools and the data you already have.",
      "My background is technical. I build the solutions myself, and I say so when an improvement is not worth what it costs.",
    ],
    experienceTitle: "Background",
    experience: [],
    contactTitle: "Get in touch",
    contactBook: "Book an initial call",
  },
  cta: {
    titleLine1: "Start with a short conversation.",
    titleLine2: "We define the scope, price and timing.",
    primary: "Send an enquiry",
    secondary: "INIT on LinkedIn",
  },
  footer: {
    tagline:
      "Development and automation for Norwegian businesses. Clearly scoped engagements with an agreed price and deliverable.",
    navTitle: "Pages",
    contactTitle: "Contact",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { no, en };
