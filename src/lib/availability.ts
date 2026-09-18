/**
 * Booking availability: the rules, and the shape the calendar UI reads.
 *
 * The rules live here rather than in the route handler so the client and the
 * server agree on what a bookable slot is. Times are Europe/Oslo wall-clock
 * throughout — the visitor's own timezone is deliberately not used, because a
 * meeting is agreed in the time the business actually works in.
 */

/** Length of the meeting, used when checking a slot against busy time. */
export const MEETING_MINUTES = 30;

/** The working window, Europe/Oslo. */
export const DAY_START = "08:00";
export const DAY_END = "16:00";

/**
 * Every half hour in the working window, as start times. The last slot starts
 * early enough for the meeting to finish inside the window, so 16:00 is the
 * end of the day rather than the start of another meeting.
 */
export const SLOT_TIMES = buildSlotTimes();

function buildSlotTimes(): string[] {
  const toMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const times: string[] = [];
  const last = toMinutes(DAY_END) - MEETING_MINUTES;
  for (let m = toMinutes(DAY_START); m <= last; m += MEETING_MINUTES) {
    times.push(
      `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
    );
  }
  return times;
}

/** Monday through Friday. `Date#getDay` numbering. */
export const WORK_DAYS = [1, 2, 3, 4, 5];

/** Nothing bookable closer than this, so a slot is never taken by surprise. */
export const LEAD_TIME_HOURS = 20;

/** How far ahead the calendar offers slots. */
export const HORIZON_DAYS = 45;

export const TIME_ZONE = "Europe/Oslo";

/** One time in the working day, whether it can currently be booked or not. */
export interface AvailabilitySlot {
  time: string;
  available: boolean;
}

/** One working day. `date` is "YYYY-MM-DD". */
export interface AvailableDay {
  date: string;
  slots: AvailabilitySlot[];
}

export interface Availability {
  /**
   * Where the times came from. `calendar` means busy time was subtracted from
   * a real calendar; `hours` means only the opening-hours rules were applied,
   * because no calendar is connected or the lookup failed. The UI says which,
   * so the page never claims more than it knows.
   */
  source: "calendar" | "hours";
  timeZone: string;
  days: AvailableDay[];
}

export interface BusyInterval {
  /** ISO timestamps. */
  start: string;
  end: string;
}

/** "2026-09-22" for a local calendar date. */
export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Europe/Oslo's UTC offset in minutes at a given instant.
 *
 * Read from `Intl` rather than hardcoded, so the summer/winter change is
 * handled by the platform's own tz data instead of by an assumption here.
 */
function zoneOffsetMinutes(instant: Date): number {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "longOffset",
  }).format(instant);

  const match = /GMT([+-])(\d{2}):(\d{2})/.exec(formatted);
  if (!match) return 0; // "GMT" with no offset means UTC.
  const [, sign, hours, minutes] = match;
  const total = Number(hours) * 60 + Number(minutes);
  return sign === "-" ? -total : total;
}

/**
 * "CET" or "CEST" for a given day. Norway is the only zone this site offers,
 * so the two names can be derived from the offset instead of pulled from
 * `Intl`, which reports Oslo as "GMT+2" rather than by name.
 */
export function zoneAbbreviation(dayKey?: string): string {
  const instant = dayKey ? osloTimeToInstant(dayKey, "12:00") : new Date();
  return zoneOffsetMinutes(instant ?? new Date()) === 120 ? "CEST" : "CET";
}

/**
 * The instant at which a given Oslo wall-clock time occurs.
 *
 * The offset is resolved twice because the first guess is made with the offset
 * of the wrong side of a daylight-saving change on the two days a year that
 * matters; the second pass lands on the right one.
 */
export function osloTimeToInstant(
  dayKey: string,
  time: string,
): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match || !timeMatch) return null;

  const [, y, m, d] = match.map(Number) as unknown as number[];
  const [, hh, mm] = timeMatch.map(Number) as unknown as number[];

  const naive = Date.UTC(y, m - 1, d, hh, mm);
  const firstPass = new Date(naive - zoneOffsetMinutes(new Date(naive)) * 60000);
  return new Date(naive - zoneOffsetMinutes(firstPass) * 60000);
}

/**
 * Every working day and time between now and the horizon, before any calendar
 * is consulted. Times inside the lead-time window stay in the result but are
 * marked unavailable, so the calendar can show a complete day rather than
 * making occupied times disappear.
 */
export function slotsFromHours(now: Date = new Date()): AvailableDay[] {
  const earliest = now.getTime() + LEAD_TIME_HOURS * 3600_000;
  const days: AvailableDay[] = [];

  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i <= HORIZON_DAYS; i++) {
    const day = new Date(cursor);
    day.setDate(cursor.getDate() + i);
    if (!WORK_DAYS.includes(day.getDay())) continue;

    const key = dateKey(day);
    const slots = SLOT_TIMES.map((time) => {
      const instant = osloTimeToInstant(key, time);
      return {
        time,
        available: instant !== null && instant.getTime() >= earliest,
      };
    });

    days.push({ date: key, slots });
  }

  return days;
}

/**
 * Marks any slot that overlaps busy time as unavailable. A slot counts as
 * taken when the meeting would run into a busy interval at all, not only when
 * it starts inside one. Nothing is removed: unavailable times remain visible
 * in the booking calendar.
 */
export function subtractBusy(
  days: AvailableDay[],
  busy: BusyInterval[],
): AvailableDay[] {
  const intervals = busy
    .map((b) => ({
      start: new Date(b.start).getTime(),
      end: new Date(b.end).getTime(),
    }))
    .filter((b) => Number.isFinite(b.start) && Number.isFinite(b.end));

  return days.map(({ date, slots }) => ({
    date,
    slots: slots.map((slot) => {
      if (!slot.available) return slot;

      const start = osloTimeToInstant(date, slot.time);
      if (!start) return { ...slot, available: false };
      const from = start.getTime();
      const to = from + MEETING_MINUTES * 60_000;
      const overlaps = intervals.some((b) => from < b.end && to > b.start);

      return { ...slot, available: !overlaps };
    }),
  }));
}
