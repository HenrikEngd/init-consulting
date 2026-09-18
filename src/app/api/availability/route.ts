import { createSign } from "node:crypto";
import { NextResponse } from "next/server";
import {
  HORIZON_DAYS,
  TIME_ZONE,
  slotsFromHours,
  subtractBusy,
  type Availability,
  type BusyInterval,
} from "@/lib/availability";

/** `node:crypto` signs the service-account assertion, so not the edge runtime. */
export const runtime = "nodejs";
/** Availability depends on the current time and on a live calendar. */
export const dynamic = "force-dynamic";

const SCOPE = "https://www.googleapis.com/auth/calendar.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";

/**
 * An access token for the calendar, by whichever route is configured.
 *
 * Two are supported on purpose. A service account is the tidier setup, but it
 * only works if the calendar can be shared with the service account's address,
 * and a Workspace domain may forbid exactly that. The refresh-token path is
 * the fallback: it acts as the account itself, so nothing needs sharing.
 *
 * Returns null when neither is configured, which is not an error — it is the
 * state the site ships in until the keys are added.
 */
async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });
    if (!res.ok) throw new Error(`token refresh failed: ${res.status}`);
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Stored with literal "\n" so it survives a single-line environment variable.
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (email && privateKey) {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claims = {
      iss: email,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    };

    const encode = (value: object) =>
      Buffer.from(JSON.stringify(value)).toString("base64url");
    const unsigned = `${encode(header)}.${encode(claims)}`;
    const signature = createSign("RSA-SHA256")
      .update(unsigned)
      .sign(privateKey, "base64url");

    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${unsigned}.${signature}`,
      }),
    });
    if (!res.ok) throw new Error(`service account token failed: ${res.status}`);
    const json = (await res.json()) as { access_token?: string };
    return json.access_token ?? null;
  }

  return null;
}

async function fetchBusy(token: string, calendarId: string) {
  const timeMin = new Date();
  const timeMax = new Date(timeMin);
  timeMax.setDate(timeMax.getDate() + HORIZON_DAYS + 1);

  const res = await fetch(FREEBUSY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: TIME_ZONE,
      items: [{ id: calendarId }],
    }),
  });
  if (!res.ok) throw new Error(`freeBusy failed: ${res.status}`);

  const json = (await res.json()) as {
    calendars?: Record<string, { busy?: BusyInterval[]; errors?: unknown[] }>;
  };
  const calendar = json.calendars?.[calendarId];

  // A calendar that is not shared with the credential comes back as an error
  // entry rather than an HTTP failure — treat it as a failure, not as "free".
  if (!calendar || calendar.errors?.length) {
    throw new Error(`calendar not readable: ${JSON.stringify(calendar?.errors)}`);
  }
  return calendar.busy ?? [];
}

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
      const token = await getAccessToken();
      if (token) {
        const busy = await fetchBusy(token, calendarId);
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
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
