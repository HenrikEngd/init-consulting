export type Lang = "no" | "en";

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    work: string;
    process: string;
    pricing: string;
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
    title: "INIT — Automatisering og teknisk hjelp for småbedrifter",
    description:
      "INIT hjelper små norske tjenestebedrifter med automatisering, integrasjoner, AI og små tekniske forbedringer. Ett konkret problem av gangen, til avtalt pris.",
  },
  nav: {
    work: "Hva jeg kan hjelpe med",
    process: "Slik jobber jeg",
    pricing: "Priser",
    contact: "Kontakt",
    cta: "Ta en prat",
  },
  hero: {
    title: "Mindre manuelt arbeid. Enklere systemer.",
    subtitle:
      "Automatisering, integrasjoner og små tekniske forbedringer. Ett konkret problem av gangen.",
    ctaPrimary: "Fortell hva som tar tid",
  },
  principles: {
    titleLead: "Problemet først.",
    titleRest:
      "INIT finner den enkleste forbedringen som sparer tid eller får systemene til å fungere bedre sammen.",
    items: [
      {
        title: "Ett problem av gangen",
        desc: "Vi avgrenser oppgaven før noe bygges. Da blir både pris, fremdrift og forventet resultat tydelig.",
      },
      {
        title: "Riktig verktøy for jobben",
        desc: "Automatisering, integrasjon, AI eller et lite internt verktøy. Bare det som trengs.",
      },
      {
        title: "Én person hele veien",
        desc: "Du jobber med den samme personen fra første samtale til ferdig løsning, med avtalt pris og leveringsdato.",
      },
    ],
  },
  process: {
    title: "Slik foregår det",
    subtitle:
      "Du trenger ikke vite hva slags teknologi du trenger. Start med å fortelle hva som tar tid eller ikke fungerer.",
    steps: [
      {
        number: "01",
        title: "Kort prat",
        desc: "Du beskriver problemet. Sammen finner vi ut om det egner seg som et lite, avgrenset prosjekt.",
      },
      {
        number: "02",
        title: "Tydelig tilbud",
        desc: "Du får et konkret forslag med resultat, avgrensning, fast pris og leveringsdato.",
      },
      {
        number: "03",
        title: "Bygging og testing",
        desc: "Løsningen bygges rundt systemene du allerede bruker og testes med reelle eksempler.",
      },
      {
        number: "04",
        title: "Overlevering",
        desc: "Du får en gjennomgang, enkel dokumentasjon og 14 dager med justering og feilretting.",
      },
    ],
  },
  projects: {
    title: "Hva INIT kan hjelpe med",
    subtitle:
      "Eksempler på små, konkrete forbedringer, med tilbakemeldinger fra kundene de er levert til.",
    titleEmpty: "Hva INIT kan hjelpe med",
    subtitleEmpty:
      "Eksempler på små, konkrete forbedringer. Vi starter med problemet og velger den enkleste løsningen som gir mening.",
    metricLabel: "Mål",
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
    title: "Start med noe lite",
    subtitle:
      "Du får pris og leveringsdato før arbeidet starter. Ingen bindingstid eller overraskende fakturaer.",
    tiers: [
      {
        id: "sprint",
        name: "Første forbedring",
        price: "Fra 12 500 kr",
        priceNote: "Fast pris",
        desc: "For én liten og tydelig avgrenset automatisering, integrasjon eller teknisk forbedring.",
        features: [
          "Én klart definert forbedring",
          "Bygging og testing inkludert",
          "Enkel dokumentasjon på norsk",
          "Gjennomgang ved overlevering",
          "14 dager med justering og feilretting",
          "Større behov prises separat",
        ],
        cta: "Fortell hva som tar tid",
      },
      {
        id: "custom",
        name: "Trygg drift",
        price: "Fra 1 490 kr/mnd.",
        priceNote: "Valgfritt · ingen bindingstid",
        desc: "For løsninger som trenger overvåking og teknisk oppfølging etter levering.",
        features: [
          "Overvåking av løsningen",
          "Feilretting på det INIT har levert",
          "Mindre tekniske oppdateringer",
          "Svar innen tre arbeidsdager",
          "Videreutvikling avtales separat",
        ],
        cta: "Spør om oppfølging",
      },
    ],
  },
  faq: {
    title: "Spørsmål og svar",
    subtitle:
      "Det viktigste å vite før vi vurderer et lite teknisk prosjekt sammen.",
    items: [
      {
        q: "Hva kan INIT hjelpe med?",
        a: "Automatisering, integrasjoner, AI, rapportering, dataflyt og små interne verktøy. Du trenger ikke vite hvilken teknologi som passer. Beskriv hva som tar tid eller ikke fungerer.",
      },
      {
        q: "Hvor lang tid tar et prosjekt?",
        a: "En liten forbedring leveres vanligvis over tre til fem kalenderuker. Du får en konkret leveringsdato i tilbudet før arbeidet starter.",
      },
      {
        q: "Må vi bytte systemene vi bruker?",
        a: "Vanligvis ikke. Målet er å få mer ut av verktøyene dere allerede har, enten ved å koble dem sammen eller forenkle arbeidet rundt dem.",
      },
      {
        q: "Hvem jobber vi med?",
        a: "INIT er et enkeltpersonsforetak. Du jobber direkte med den samme personen fra første samtale til bygging, testing og overlevering. Derfor tas det inn få prosjekter samtidig.",
      },
      {
        q: "Hvem eier løsningen?",
        a: "Bedriften gjør det. Kontoer og tilganger settes så langt som mulig opp i bedriftens navn, og enkel dokumentasjon følger med ved overlevering.",
      },
      {
        q: "Hva skjer etter levering?",
        a: "Fjorten dager med justering og feilretting er inkludert. Dersom løsningen trenger løpende overvåking, kan Trygg drift avtales uten bindingstid. Nye funksjoner prises separat.",
      },
      {
        q: "Hva om problemet ikke er verdt å løse?",
        a: "Da sier jeg det før vi starter. Forbedringen skal være verdt mer enn den koster.",
      },
    ],
  },
  booking: {
    title: "Book en prat på 30 minutter",
    subtitle:
      "Fortell hva som tar tid eller ikke fungerer. Sammen finner vi ut om det kan løses som et lite, avgrenset prosjekt.",
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
      "Beskriv kort hva som tar tid hos dere. Da er agendaen klar på forhånd.",
    selectedLabel: "Valgt tidspunkt",
    noSlot: "Ingen tid valgt. Gå tilbake og velg et tidspunkt.",
    name: "Navn",
    company: "Bedrift",
    email: "E-post",
    phone: "Telefon (valgfritt)",
    message: "Hva tar mest tid hos dere i dag?",
    messagePlaceholder:
      "For eksempel: Vi kopierer de samme kundeopplysningene mellom to systemer, eller bruker flere timer på en rapport hver uke.",
    submit: "Send bookingforespørsel",
    note: "Knappen åpner e-postprogrammet ditt med forespørselen ferdig utfylt. Du får en bekreftelse med møtelenke i retur.",
  },
  cta: {
    titleLine1: "Hva tar unødvendig mye tid?",
    titleLine2: "La oss se om det kan gjøres enklere.",
    primary: "Fortell om problemet",
    secondary: "INIT på LinkedIn",
  },
  footer: {
    tagline:
      "Automatisering, integrasjoner og små tekniske forbedringer for norske tjenestebedrifter.",
    navTitle: "Sider",
    contactTitle: "Kontakt",
  },
};

const en: Dictionary = {
  meta: {
    title: "INIT — Automation and technical help for small businesses",
    description:
      "INIT helps small Norwegian service businesses with automation, integrations, AI and focused technical improvements. One concrete problem at a time, at an agreed price.",
  },
  nav: {
    work: "What I can help with",
    process: "How I work",
    pricing: "Pricing",
    contact: "Contact",
    cta: "Have a chat",
  },
  hero: {
    title: "Less manual work. Simpler systems.",
    subtitle:
      "Automation, integrations and focused technical improvements. One concrete problem at a time.",
    ctaPrimary: "Tell me what takes time",
  },
  principles: {
    titleLead: "The problem first.",
    titleRest:
      "INIT finds the simplest improvement that saves time or helps your systems work better together.",
    items: [
      {
        title: "One problem at a time",
        desc: "The task is scoped before anything is built. Then the price, timeline and expected result are clear.",
      },
      {
        title: "The right tool for the job",
        desc: "Automation, integration, AI or a small internal tool. Only what is needed.",
      },
      {
        title: "One person throughout",
        desc: "You work with the same person from the first conversation to the finished solution, with an agreed price and delivery date.",
      },
    ],
  },
  process: {
    title: "How it works",
    subtitle:
      "You do not need to know what technology you need. Start by describing what takes time or does not work.",
    steps: [
      {
        number: "01",
        title: "Short call",
        desc: "You describe the problem. Together we decide whether it suits a small, clearly scoped project.",
      },
      {
        number: "02",
        title: "Clear proposal",
        desc: "You receive a concrete proposal with the result, scope, fixed price and delivery date.",
      },
      {
        number: "03",
        title: "Build and test",
        desc: "The solution is built around the systems you already use and tested with real examples.",
      },
      {
        number: "04",
        title: "Handover",
        desc: "You get a walkthrough, simple documentation and 14 days of adjustments and bug fixes.",
      },
    ],
  },
  projects: {
    title: "What INIT can help with",
    subtitle:
      "Examples of small, concrete improvements, with feedback from the companies they were delivered to.",
    titleEmpty: "What INIT can help with",
    subtitleEmpty:
      "Examples of small, concrete improvements. We start with the problem and choose the simplest solution that makes sense.",
    metricLabel: "Goal",
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
    title: "Start small",
    subtitle:
      "You receive a price and delivery date before work begins. No lock-in or surprise invoices.",
    tiers: [
      {
        id: "sprint",
        name: "First improvement",
        price: "From 12,500 NOK",
        priceNote: "Fixed price",
        desc: "For one small, clearly scoped automation, integration or technical improvement.",
        features: [
          "One clearly defined improvement",
          "Build and testing included",
          "Simple written documentation",
          "Walkthrough at handover",
          "14 days of adjustments and bug fixes",
          "Larger needs priced separately",
        ],
        cta: "Tell me what takes time",
      },
      {
        id: "custom",
        name: "Reliable operation",
        price: "From 1,490 NOK/month",
        priceNote: "Optional · no lock-in",
        desc: "For solutions that need monitoring and technical follow-up after delivery.",
        features: [
          "Monitoring of the solution",
          "Bug fixes for work delivered by INIT",
          "Minor technical updates",
          "A response within three business days",
          "Further development agreed separately",
        ],
        cta: "Ask about follow-up",
      },
    ],
  },
  faq: {
    title: "Questions and answers",
    subtitle:
      "The main things to know before we consider a small technical project together.",
    items: [
      {
        q: "What can INIT help with?",
        a: "Automation, integrations, AI, reporting, data flows and small internal tools. You do not need to know which technology fits. Describe what takes time or does not work.",
      },
      {
        q: "How long does a project take?",
        a: "A small improvement is usually delivered over three to five calendar weeks. You receive a specific delivery date in the proposal before work begins.",
      },
      {
        q: "Do we have to replace our current systems?",
        a: "Usually not. The aim is to get more from the tools you already have, either by connecting them or simplifying the work around them.",
      },
      {
        q: "Who will we work with?",
        a: "INIT is a sole proprietorship. You work directly with the same person from the first conversation through building, testing and handover. For that reason, only a few projects are taken on at a time.",
      },
      {
        q: "Who owns the solution?",
        a: "Your company does. Accounts and access are set up in the company's name wherever possible, and simple documentation is included at handover.",
      },
      {
        q: "What happens after delivery?",
        a: "Fourteen days of adjustments and bug fixes are included. If the solution needs ongoing monitoring, Reliable operation can be added without lock-in. New features are priced separately.",
      },
      {
        q: "What if the problem is not worth solving?",
        a: "I will say so before we begin. The improvement has to be worth more than it costs.",
      },
    ],
  },
  booking: {
    title: "Book a 30-minute call",
    subtitle:
      "Describe what takes time or does not work. Together we will decide whether it can be solved as a small, clearly scoped project.",
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
      "Briefly describe what takes time at your company. That sets the agenda in advance.",
    selectedLabel: "Selected time",
    noSlot: "No time selected. Go back and pick one.",
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "Phone (optional)",
    message: "What takes the most time at your company today?",
    messagePlaceholder:
      "For example: we copy the same customer details between two systems, or spend several hours on a report each week.",
    submit: "Send booking request",
    note: "The button opens your email client with the request filled in. You will get a confirmation with a meeting link in return.",
  },
  cta: {
    titleLine1: "What takes more time than it should?",
    titleLine2: "Let us see if it can be made simpler.",
    primary: "Describe the problem",
    secondary: "INIT on LinkedIn",
  },
  footer: {
    tagline:
      "Automation, integrations and focused technical improvements for Norwegian service businesses.",
    navTitle: "Pages",
    contactTitle: "Contact",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { no, en };
