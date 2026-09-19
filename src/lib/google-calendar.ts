import { createSign } from "node:crypto";
import type { BusyInterval } from "@/lib/availability";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FREEBUSY_URL = "https://www.googleapis.com/calendar/v3/freeBusy";
const SERVICE_ACCOUNT_SCOPE =
  "https://www.googleapis.com/auth/calendar.events.freebusy";

export interface CalendarAuth {
  accessToken: string;
  kind: "oauth" | "service-account";
}

async function exchangeRefreshToken(): Promise<CalendarAuth | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) return null;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google token refresh failed: ${response.status}`);
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Google token response had no token");
  return { accessToken: json.access_token, kind: "oauth" };
}

async function createServiceAccountToken(): Promise<CalendarAuth | null> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) return null;

  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({
    iss: email,
    scope: SERVICE_ACCOUNT_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  })}`;
  const signature = createSign("RSA-SHA256")
    .update(unsigned)
    .sign(privateKey, "base64url");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google service token failed: ${response.status}`);
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Google token response had no token");
  return { accessToken: json.access_token, kind: "service-account" };
}

/** OAuth is preferred because it can create events and invite the visitor. */
export async function getCalendarAuth(): Promise<CalendarAuth | null> {
  return (await exchangeRefreshToken()) ?? createServiceAccountToken();
}

export async function getCalendarOAuthToken(): Promise<string | null> {
  return (await exchangeRefreshToken())?.accessToken ?? null;
}

export async function fetchCalendarBusy(
  accessToken: string,
  calendarId: string,
  timeMin: Date,
  timeMax: Date,
): Promise<BusyInterval[]> {
  const response = await fetch(FREEBUSY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: "Europe/Oslo",
      items: [{ id: calendarId }],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Google free/busy request failed: ${response.status}`);
  }

  const json = (await response.json()) as {
    calendars?: Record<string, { busy?: BusyInterval[]; errors?: unknown[] }>;
  };
  const calendar = json.calendars?.[calendarId];
  if (!calendar || calendar.errors?.length) {
    throw new Error(`Calendar is not readable: ${JSON.stringify(calendar?.errors)}`);
  }

  return calendar.busy ?? [];
}
