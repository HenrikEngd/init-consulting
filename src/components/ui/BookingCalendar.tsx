"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import {
  dateKey,
  zoneAbbreviation,
  type Availability,
} from "@/lib/availability";

const LOCALE = { no: "nb-NO", en: "en-GB" } as const;

/** Monday-first, which is what both locales use. */
function weekdayInitials(lang: keyof typeof LOCALE): string[] {
  const formatter = new Intl.DateTimeFormat(LOCALE[lang], { weekday: "short" });
  // 2024-01-01 was a Monday; any Monday works as the starting point.
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(2024, 0, 1 + i)),
  );
}

/** The days to render for a month, padded so the 1st lands on its weekday. */
function monthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay() is Sunday-first; shift so Monday is column 0.
  const lead = (first.getDay() + 6) % 7;

  return [
    ...Array.from({ length: lead }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];
}

/**
 * Month view of bookable days, with the times for the selected day beside it.
 *
 * Availability is fetched rather than generated here, because the slots depend
 * on a calendar the browser cannot read. Until that calendar is connected the
 * endpoint answers with the opening hours and says so, and the line under the
 * grid changes accordingly — the page never presents rules as confirmed
 * availability.
 */
export function BookingCalendar() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<Availability | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [month, setMonth] = useState<{ year: number; month: number } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    fetch("/api/availability")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<Availability>;
      })
      .then((availability) => {
        if (cancelled) return;
        setData(availability);
        const firstDay = availability.days[0];
        if (firstDay) {
          const [y, m] = firstDay.date.split("-").map(Number);
          setMonth({ year: y, month: m - 1 });
          setSelected(firstDay.date);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const byDate = useMemo(
    () => new Map((data?.days ?? []).map((d) => [d.date, d.slots])),
    [data],
  );

  const slots = selected ? (byDate.get(selected) ?? []) : [];
  const availableSlots = slots.filter((slot) => slot.available);
  const chosenTime = availableSlots.some((slot) => slot.time === selectedTime)
    ? selectedTime
    : (availableSlots[0]?.time ?? "");

  // Months are only reachable while they hold at least one bookable day.
  const bounds = useMemo(() => {
    const days = data?.days ?? [];
    if (days.length === 0) return null;
    const toMonth = (key: string) => {
      const [y, m] = key.split("-").map(Number);
      return y * 12 + (m - 1);
    };
    return {
      first: toMonth(days[0].date),
      last: toMonth(days[days.length - 1].date),
    };
  }, [data]);

  const current = month ? month.year * 12 + month.month : null;
  const canGoBack =
    bounds !== null && current !== null && current > bounds.first;
  const canGoForward =
    bounds !== null && current !== null && current < bounds.last;

  function shiftMonth(delta: number) {
    setMonth((prev) => {
      if (!prev) return prev;
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  if (failed) {
    return (
      <p className="px-5 py-8 text-[14px] leading-[1.6] tracking-[-0.011em] text-tertiary sm:px-6">
        {t.booking.noTimes}
      </p>
    );
  }

  if (!data || !month) {
    return (
      <p className="px-5 py-8 text-[14px] tracking-[-0.011em] text-tertiary sm:px-6">
        {t.booking.loading}
      </p>
    );
  }

  const grid = monthGrid(month.year, month.month);
  const monthLabel = new Intl.DateTimeFormat(LOCALE[lang], {
    month: "long",
    year: "numeric",
  }).format(new Date(month.year, month.month, 1));
  const todayKey = dateKey(new Date());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[364px_minmax(0,1fr)]">
      {/* Month grid */}
      <div className="border-b border-line-soft px-4 py-4 sm:px-6 sm:py-5 lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-[510] tracking-[-0.011em] text-primary first-letter:uppercase">
            {monthLabel}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canGoBack}
              aria-label={t.booking.prevMonth}
              className="flex h-7 w-7 items-center justify-center rounded-[8px] text-tertiary transition-colors duration-150 hover:bg-level-3 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden
              >
                <path
                  d="M12 5l-5 5 5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              disabled={!canGoForward}
              aria-label={t.booking.nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded-[8px] text-tertiary transition-colors duration-150 hover:bg-level-3 hover:text-primary disabled:pointer-events-none disabled:opacity-30"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden
              >
                <path
                  d="M8 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1 sm:mt-4">
          {weekdayInitials(lang).map((day) => (
            <span
              key={day}
              className="pb-1 text-center font-mono text-[10px] tracking-[0.06em] text-tertiary/70 uppercase"
            >
              {day.slice(0, 2)}
            </span>
          ))}

          {grid.map((date, i) => {
            if (!date) return <span key={`pad-${i}`} />;

            const key = dateKey(date);
            const open = byDate.has(key);
            const isSelected = key === selected;

            return (
              <button
                key={key}
                type="button"
                disabled={!open}
                onClick={() => setSelected(key)}
                aria-pressed={isSelected}
                className={`flex h-9 items-center justify-center rounded-[8px] text-[13px] tracking-[-0.011em] transition-colors duration-150 sm:h-11 ${
                  isSelected
                    ? "bg-primary font-[510] text-background"
                    : open
                      ? "text-primary hover:bg-level-3"
                      : "text-tertiary/35"
                } ${key === todayKey && !isSelected ? "ring-1 ring-line" : ""}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[12px] leading-[1.5] tracking-[-0.011em] text-tertiary/70 sm:mt-4">
          {data.source === "calendar"
            ? t.booking.sourceCalendar
            : t.booking.sourceHours}
        </p>
      </div>

      {/* Times for the selected day */}
      <div className="flex flex-col px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[12px] tracking-[0.08em] text-tertiary uppercase">
            {t.booking.pickTime}
          </p>
          {/* Resolved from the selected day, so it follows the DST change
              rather than reporting whatever is true today. */}
          <span className="font-mono text-[11px] tracking-[0.04em] text-tertiary/70">
            {zoneAbbreviation(selected ?? undefined)}
          </span>
        </div>

        {slots.length > 0 ? (
          <>
            {/* A compact native picker keeps the booking card short and easy
                to scan on a phone. The complete grid remains on larger screens. */}
            <div className="mt-3 sm:hidden">
              <div className="relative">
                <select
                  value={chosenTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                  disabled={availableSlots.length === 0}
                  aria-label={t.booking.pickTime}
                  className="h-11 w-full appearance-none rounded-[10px] border border-line bg-level-2 px-3.5 pr-10 text-[14px] font-[510] tracking-[-0.011em] text-primary outline-none focus:border-tertiary disabled:text-tertiary"
                >
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {slot.time}
                      </option>
                    ))
                  ) : (
                    <option>{t.booking.noTimes}</option>
                  )}
                </select>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-tertiary"
                >
                  <path
                    d="m6 8 4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {selected && chosenTime ? (
                <Link
                  href={`/book?slot=${selected}T${chosenTime}`}
                  className="mt-2.5 flex h-11 w-full items-center justify-center rounded-[10px] bg-primary text-[14px] font-[510] tracking-[-0.011em] text-background transition-opacity duration-150 hover:opacity-90"
                >
                  {t.booking.continue}
                </Link>
              ) : null}
            </div>

            <div className="mt-4 hidden flex-1 grid-cols-4 content-center gap-2 sm:grid">
              {slots.map((slot) =>
                slot.available ? (
                  <Link
                    key={slot.time}
                    href={`/book?slot=${selected}T${slot.time}`}
                    className="flex h-11 items-center justify-center rounded-[10px] border border-line text-[14px] font-[510] tracking-[-0.011em] text-primary transition-colors duration-150 hover:border-transparent hover:bg-primary hover:text-background"
                  >
                    {slot.time}
                  </Link>
                ) : (
                  <span
                    key={slot.time}
                    aria-label={`${slot.time}, ${t.booking.unavailable}`}
                    className="flex h-11 cursor-not-allowed items-center justify-center rounded-[10px] border border-line-soft text-[14px] font-[510] tracking-[-0.011em] text-tertiary/30 line-through decoration-tertiary/40"
                  >
                    {slot.time}
                  </span>
                ),
              )}
            </div>
          </>
        ) : (
          <p className="mt-3 text-[13px] leading-[1.6] tracking-[-0.011em] text-tertiary">
            {t.booking.noTimes}
          </p>
        )}
      </div>
    </div>
  );
}
