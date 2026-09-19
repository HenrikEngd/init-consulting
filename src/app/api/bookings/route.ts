import { createHash, randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import {
  MEETING_MINUTES,
  SLOT_TIMES,
  TIME_ZONE,
  osloTimeToInstant,
  slotsFromHours,
} from "@/lib/availability";
import {
  fetchCalendarBusy,
  getCalendarOAuthToken,
} from "@/lib/google-calendar";

export const runtime = "nodejs";

interface BookingRequest {
  slot?: unknown;
  name?: unknown;
  company?: unknown;
  email?: unknown;
  phone?: unknown;
  message?: unknown;
  website?: unknown;
}

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

function bookingWindow(slot: string): { start: Date; end: Date } | null {
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/.exec(slot);
  if (!match || !SLOT_TIMES.includes(match[2])) return null;

  const [date, time] = [match[1], match[2]];
  const listedSlot = slotsFromHours()
    .find((day) => day.date === date)
    ?.slots.find((candidate) => candidate.time === time);
  if (!listedSlot?.available) return null;

  const start = osloTimeToInstant(date, time);
  if (!start) return null;
  return {
    start,
    end: new Date(start.getTime() + MEETING_MINUTES * 60_000),
  };
}

export async function POST(request: Request) {
  let body: BookingRequest;
  try {
    body = (await request.json()) as BookingRequest;
  } catch {
    return NextResponse.json({ code: "invalid" }, { status: 400 });
  }

  // Quietly accept the hidden honeypot so automated spam does not learn how
  // to get around it, but do not create a calendar event.
  if (text(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const slot = text(body.slot, 32);
  const name = text(body.name, 100);
  const company = text(body.company, 120);
  const email = text(body.email, 254).toLowerCase();
  const phone = text(body.phone, 50);
  const message = text(body.message, 2000);
  const window = bookingWindow(slot);

  if (
    !window ||
    !name ||
    !company ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json({ code: "invalid" }, { status: 400 });
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const accessToken = await getCalendarOAuthToken();
  if (!calendarId || !accessToken) {
    console.error("[bookings] Google Calendar OAuth is not configured");
    return NextResponse.json({ code: "unavailable" }, { status: 503 });
  }

  try {
    const busy = await fetchCalendarBusy(
      accessToken,
      calendarId,
      window.start,
      window.end,
    );
    const overlaps = busy.some(
      (interval) =>
        window.start.getTime() < new Date(interval.end).getTime() &&
        window.end.getTime() > new Date(interval.start).getTime(),
    );
    if (overlaps) {
      return NextResponse.json({ code: "taken" }, { status: 409 });
    }

    // A deterministic Google event ID makes two simultaneous requests for the
    // same slot collide instead of creating a double booking.
    const eventId = createHash("sha256")
      .update(`initconsulting:${slot}`)
      .digest("hex")
      .slice(0, 32);
    const endpoint = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    );
    endpoint.searchParams.set("sendUpdates", "all");
    endpoint.searchParams.set("conferenceDataVersion", "1");

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: eventId,
        summary: `Innledende samtale – ${name}${company ? `, ${company}` : ""}`,
        description: [
          `Navn: ${name}`,
          `Bedrift: ${company}`,
          `E-post: ${email}`,
          `Telefon: ${phone || "Ikke oppgitt"}`,
          "",
          "Hva ønsker de å forbedre?",
          message,
        ].join("\n"),
        start: { dateTime: window.start.toISOString(), timeZone: TIME_ZONE },
        end: { dateTime: window.end.toISOString(), timeZone: TIME_ZONE },
        attendees: [{ email, displayName: name }],
        guestsCanInviteOthers: false,
        guestsCanModify: false,
        conferenceData: {
          createRequest: {
            requestId: randomUUID(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        extendedProperties: {
          private: { source: "initconsulting.no", slot },
        },
      }),
      cache: "no-store",
    });

    if (response.status === 409) {
      return NextResponse.json({ code: "taken" }, { status: 409 });
    }
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Google event creation failed: ${response.status} ${detail}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[bookings] Could not create event", error);
    return NextResponse.json({ code: "unavailable" }, { status: 502 });
  }
}
