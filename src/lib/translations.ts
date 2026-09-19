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
    title: "INIT Consulting",
    description:
      "INIT er en forward deployed engineer for små norske tjenestebedrifter. En utvikler som jobber på innsiden, i systemene dere allerede bruker, en uke av gangen til fast pris.",
  },
  nav: {
    work: "Hva jeg gjør",
    process: "Slik jobber jeg",
    pricing: "Priser",
    contact: "Kontakt",
    cta: "Ta en prat",
  },
  hero: {
    title: "Forward deployed engineer. På innsiden hos dere.",
    subtitle:
      "En utvikler som jobber i systemene dere allerede bruker, sammen med folkene som bruker dem. En uke av gangen, til fast pris.",
    ctaPrimary: "Fortell hva som tar tid",
  },
  principles: {
    titleLead: "På innsiden.",
    titleRest:
      "INIT jobber der arbeidet gjøres, i bedriftens egne systemer, og bygger det som trengs mens dere ser på.",
    items: [
      {
        title: "Jeg sitter der jobben gjøres",
        desc: "Den første dagen går med til å se hvordan dere faktisk jobber. Det som tar tid, viser seg i rutinene, sjelden i et kravdokument.",
      },
      {
        title: "Arbeid i systemene dere har",
        desc: "Jeg bygger inni verktøyene dere allerede betaler for. Regnskap, CRM, e-post, regneark og det som ellers står i veien.",
      },
      {
        title: "En uke av gangen",
        desc: "Hver uke har fast pris og et avtalt resultat. Dere bestemmer fredag om det blir en uke til.",
      },
    ],
  },
  process: {
    title: "Slik foregår en uke",
    subtitle:
      "Du trenger ikke vite hva slags teknologi du trenger. Start med å fortelle hva som tar tid eller ikke fungerer.",
    steps: [
      {
        number: "01",
        title: "Kort prat",
        desc: "Du beskriver hva som tar tid. Vi avtaler hvilken uke jeg kommer, og hva uken skal ende med.",
      },
      {
        number: "02",
        title: "Mandag hos dere",
        desc: "Jeg sitter sammen med dem som gjør jobben, går gjennom systemer og tilganger, og vi blir enige om hva som fikses først.",
      },
      {
        number: "03",
        title: "Bygging midt i driften",
        desc: "Det som bygges, testes samme dag av dem som skal bruke det. Du ser fremdriften hver ettermiddag.",
      },
      {
        number: "04",
        title: "Fredag",
        desc: "Det som virker, står i drift. Du får gjennomgang, enkel dokumentasjon og en ærlig anbefaling om en uke til er verdt det.",
      },
    ],
  },
  projects: {
    title: "Hva jeg gjør på innsiden",
    subtitle:
      "Eksempler på arbeid som gjøres i løpet av en uke, med tilbakemeldinger fra kundene det er levert til.",
    titleEmpty: "Hva jeg gjør på innsiden",
    subtitleEmpty:
      "Eksempler på arbeid som gjøres i løpet av en uke. Vi starter med det som koster mest tid akkurat nå.",
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
    title: "Start med én uke",
    subtitle:
      "Du får pris og dato før uken starter. Ingen bindingstid eller overraskende fakturaer.",
    tiers: [
      {
        id: "sprint",
        name: "En uke på innsiden",
        price: "Fra 24 000 kr",
        priceNote: "Fast pris per uke",
        desc: "For en uke der jeg jobber i deres systemer og tar det som koster mest tid akkurat nå.",
        features: [
          "Fem arbeidsdager, hos dere eller på nett",
          "Daglig kontakt med dem som gjør jobben",
          "Bygging og testing i deres egne systemer",
          "Enkel dokumentasjon på norsk",
          "Gjennomgang og overlevering fredag",
          "Ny uke avtales bare hvis den er verdt det",
        ],
        cta: "Fortell hva som tar tid",
      },
      {
        id: "custom",
        name: "Trygg drift",
        price: "Fra 1 490 kr/mnd.",
        priceNote: "Valgfritt · ingen bindingstid",
        desc: "For løsninger som trenger overvåking og teknisk oppfølging etter at uken er over.",
        features: [
          "Overvåking av løsningen",
          "Feilretting på det INIT har bygget",
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
    subtitle: "Det viktigste å vite før den første uken.",
    items: [
      {
        q: "Hva betyr forward deployed engineer?",
        a: "Det er en utvikler som jobber inne i virksomheten som har problemet. Jeg sitter sammen med dere, i deres systemer og rutiner, og bygger det som trengs der og da. Begrepet kommer fra teknologiselskaper som sender ingeniørene sine ut til kundene for å bygge på stedet.",
      },
      {
        q: "Hva kan INIT hjelpe med?",
        a: "Automatisering, integrasjoner, AI, rapportering, dataflyt og små interne verktøy. Du trenger ikke vite hvilken teknologi som passer. Beskriv hva som tar tid eller ikke fungerer.",
      },
      {
        q: "Hvor mye rekker du på en uke?",
        a: "Vanligvis én til tre konkrete forbedringer som står i drift fredag. Rekkefølgen avtales mandag, og du ser fremdriften hver dag.",
      },
      {
        q: "Må du sitte hos oss hele uken?",
        a: "Nei. Uken kan kjøres hos dere, på nett eller delt. De fleste velger én til to dager på kontoret i starten og resten på nett.",
      },
      {
        q: "Må vi bytte systemene vi bruker?",
        a: "Vanligvis ikke. Målet er å få mer ut av verktøyene dere allerede har, enten ved å koble dem sammen eller forenkle arbeidet rundt dem.",
      },
      {
        q: "Hvem jobber vi med?",
        a: "INIT er et enkeltpersonsforetak. Du jobber direkte med den samme personen hele uken. Derfor tas det bare inn én uke av gangen.",
      },
      {
        q: "Hvem eier det som bygges?",
        a: "Bedriften gjør det. Kontoer og tilganger settes så langt som mulig opp i bedriftens navn, og enkel dokumentasjon følger med fredag.",
      },
      {
        q: "Hva om en hel uke er for mye?",
        a: "Da sier jeg det før vi starter. Noen problemer er små nok til å løses på en dag eller to, og da avtaler vi det i stedet.",
      },
    ],
  },
  booking: {
    title: "Book en prat på 30 minutter",
    subtitle:
      "Fortell hva som tar tid eller ikke fungerer. Sammen finner vi ut om en uke på innsiden er riktig sted å starte.",
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
    titleLine2: "La oss ta én uke på det.",
    primary: "Fortell om problemet",
    secondary: "INIT på LinkedIn",
  },
  footer: {
    tagline:
      "En forward deployed engineer for norske tjenestebedrifter. På innsiden, i systemene dere allerede bruker.",
    navTitle: "Sider",
    contactTitle: "Kontakt",
  },
};

const en: Dictionary = {
  meta: {
    title: "INIT Consulting",
    description:
      "INIT is a forward deployed engineer for small Norwegian service businesses. A developer who works on the inside, in the systems you already use, one week at a time at a fixed price.",
  },
  nav: {
    work: "What I do",
    process: "How I work",
    pricing: "Pricing",
    contact: "Contact",
    cta: "Have a chat",
  },
  hero: {
    title: "Forward deployed engineer. On the inside with you.",
    subtitle:
      "A developer working in the systems you already use, alongside the people who use them. One week at a time, at a fixed price.",
    ctaPrimary: "Tell me what takes time",
  },
  principles: {
    titleLead: "On the inside.",
    titleRest:
      "INIT works where the work happens, in your own systems, and builds what is needed while you watch.",
    items: [
      {
        title: "I sit where the work happens",
        desc: "The first day goes on seeing how you actually work. What takes time shows up in the routines, rarely in a requirements document.",
      },
      {
        title: "Work in the systems you have",
        desc: "I build inside the tools you already pay for. Accounting, CRM, email, spreadsheets and whatever else is in the way.",
      },
      {
        title: "One week at a time",
        desc: "Every week has a fixed price and an agreed result. On Friday you decide whether there is another one.",
      },
    ],
  },
  process: {
    title: "How a week runs",
    subtitle:
      "You do not need to know what technology you need. Start by describing what takes time or does not work.",
    steps: [
      {
        number: "01",
        title: "Short call",
        desc: "You describe what takes time. We agree which week I come, and what the week should end with.",
      },
      {
        number: "02",
        title: "Monday with you",
        desc: "I sit with the people doing the work, go through systems and access, and we agree what gets fixed first.",
      },
      {
        number: "03",
        title: "Building inside the day job",
        desc: "What is built is tested the same day by the people who will use it. You see progress every afternoon.",
      },
      {
        number: "04",
        title: "Friday",
        desc: "What works is running. You get a walkthrough, simple documentation and an honest recommendation on whether another week is worth it.",
      },
    ],
  },
  projects: {
    title: "What I do on the inside",
    subtitle:
      "Examples of work done inside a week, with feedback from the companies it was delivered to.",
    titleEmpty: "What I do on the inside",
    subtitleEmpty:
      "Examples of work done inside a week. We start with whatever costs the most time right now.",
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
    title: "Start with one week",
    subtitle:
      "You get the price and the date before the week starts. No lock-in or surprise invoices.",
    tiers: [
      {
        id: "sprint",
        name: "A week on the inside",
        price: "From 24,000 NOK",
        priceNote: "Fixed price per week",
        desc: "For a week where I work in your systems and take on whatever costs the most time right now.",
        features: [
          "Five working days, on site or remote",
          "Daily contact with the people doing the work",
          "Building and testing in your own systems",
          "Simple written documentation",
          "Walkthrough and handover on Friday",
          "Another week only if it is worth it",
        ],
        cta: "Tell me what takes time",
      },
      {
        id: "custom",
        name: "Reliable operation",
        price: "From 1,490 NOK/month",
        priceNote: "Optional · no lock-in",
        desc: "For solutions that need monitoring and technical follow-up once the week is over.",
        features: [
          "Monitoring of the solution",
          "Bug fixes for what INIT built",
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
    subtitle: "The main things to know before the first week.",
    items: [
      {
        q: "What does forward deployed engineer mean?",
        a: "It is a developer who works inside the business that has the problem. I sit with you, in your systems and routines, and build what is needed on the spot. The term comes from technology companies that send their engineers out to customers to build on site.",
      },
      {
        q: "What can INIT help with?",
        a: "Automation, integrations, AI, reporting, data flows and small internal tools. You do not need to know which technology fits. Describe what takes time or does not work.",
      },
      {
        q: "How much fits into a week?",
        a: "Usually one to three concrete improvements that are running by Friday. The order is agreed on Monday, and you see progress every day.",
      },
      {
        q: "Do you have to sit with us all week?",
        a: "No. The week can run at your offices, remotely or split between the two. Most choose one or two days in the office at the start and the rest remote.",
      },
      {
        q: "Do we have to replace our current systems?",
        a: "Usually not. The aim is to get more from the tools you already have, either by connecting them or simplifying the work around them.",
      },
      {
        q: "Who will we work with?",
        a: "INIT is a sole proprietorship. You work directly with the same person all week. For that reason, only one week is taken on at a time.",
      },
      {
        q: "Who owns what gets built?",
        a: "Your company does. Accounts and access are set up in the company's name wherever possible, and simple documentation is included on Friday.",
      },
      {
        q: "What if a whole week is too much?",
        a: "I will say so before we begin. Some problems are small enough to solve in a day or two, and then we agree on that instead.",
      },
    ],
  },
  booking: {
    title: "Book a 30-minute call",
    subtitle:
      "Describe what takes time or does not work. Together we will decide whether a week on the inside is the right place to start.",
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
    titleLine2: "Let us put a week on it.",
    primary: "Describe the problem",
    secondary: "INIT on LinkedIn",
  },
  footer: {
    tagline:
      "A forward deployed engineer for Norwegian service businesses. On the inside, in the systems you already use.",
    navTitle: "Pages",
    contactTitle: "Contact",
  },
};

export const dictionaries: Record<Lang, Dictionary> = { no, en };
