import { NextResponse } from "next/server";
import {
  HORIZON_DAYS,
  TIME_ZONE,
  slotsFromHours,
  subtractBusy,
  type Availability,
} from "@/lib/availability";
import { fetchCalendarBusy, getCalendarAuth } from "@/lib/google-calendar";

/** `node:crypto` signs the service-account assertion, so not the edge runtime. */
export const runtime = "nodejs";
/** Availability depends on the current time and on a live calendar. */
export const dynamic = "force-dynamic";

/**
 * Bookable times for the next few weeks.
 *
 * Falls back to the opening hours whenever the calendar cannot be read, and
 * says so in `source`, so the page can tell the visitor which of the two it is
 * looking at instead of presenting rules as confirmed availability.
 */
export async function GET() {
  const hours = slotsFromHours();
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  let payload: Availability = {
    source: "hours",
    timeZone: TIME_ZONE,
    days: hours,
  };

  if (calendarId) {
    try {
        const auth = await getCalendarAuth();
        if (auth) {
          const timeMin = new Date();
          const timeMax = new Date(timeMin);
          timeMax.setDate(timeMax.getDate() + HORIZON_DAYS + 1);
          const busy = await fetchCalendarBusy(
            auth.accessToken,
            calendarId,
            timeMin,
            timeMax,
          );
        payload = {
          source: "calendar",
          timeZone: TIME_ZONE,
          days: subtractBusy(hours, busy),
        };
      }
    } catch (error) {
      // Logged, not surfaced: the visitor gets working hours either way, but
      // a broken credential must be visible in the server logs.
      console.error("[availability] calendar lookup failed:", error);
    }
  }

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
