"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { siteConfig } from "@/lib/site-config";
import { parseSlot } from "@/lib/booking";
import { LogoMark } from "@/components/ui/LogoMark";

const fieldClass =
  "w-full rounded-[10px] border border-line bg-background px-3.5 py-2.5 text-[14px] tracking-[-0.011em] text-primary outline-none transition-colors duration-150 placeholder:text-tertiary/60 focus:border-tertiary";

const labelClass =
  "block text-[13px] font-[510] tracking-[-0.011em] text-secondary";

export function BookingForm() {
  const { lang, t } = useLanguage();
  const params = useSearchParams();
  const slot = params.get("slot");
  const label = useMemo(() => parseSlot(slot, lang), [slot, lang]);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "taken" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot || !label) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slot,
          name,
          company,
          email,
          phone,
          message,
          website,
        }),
      });

      if (response.status === 409) {
        setStatus("taken");
        return;
      }
      if (!response.ok) throw new Error(`Booking failed: ${response.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto w-full max-w-[640px] px-5 pt-32 pb-24 sm:px-8 sm:pt-40">
      {/* The wordmark leads, the way back sits at the far edge of the same row. */}
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <LogoMark filled className="h-[17px] w-auto text-primary" />
          <span className="text-[15px] font-[560] tracking-[-0.011em] text-primary">
            {siteConfig.name}
          </span>
        </Link>

        <Link
          href="/#book"
          className="group inline-flex items-center gap-2 text-[13px] tracking-[-0.011em] text-tertiary transition-colors duration-150 hover:text-primary"
        >
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:-translate-x-1"
          >
            ←
          </span>
          {t.bookingPage.back}
        </Link>
      </div>

      <h1 className="mt-7 text-[32px] font-[510] leading-[1.1] tracking-[-0.022em] text-primary sm:text-[40px]">
        {t.bookingPage.heading}
      </h1>

      <div className="shine-card mt-6 rounded-[10px] px-4 py-3.5">
        <p className="text-[12px] uppercase tracking-[0.08em] text-tertiary">
          {t.bookingPage.selectedLabel}
        </p>
        <p className="mt-1 text-[16px] font-[510] tracking-[-0.011em] text-primary">
          {label ?? t.bookingPage.noSlot}
        </p>
      </div>

      <p className="mt-6 text-[15px] leading-[1.6] tracking-[-0.011em] text-tertiary">
        {t.bookingPage.intro}
      </p>

      {status === "success" ? (
        <div
          className="shine-card mt-8 rounded-[10px] px-5 py-5"
          role="status"
          aria-live="polite"
        >
          <h2 className="text-[18px] font-[510] tracking-[-0.011em] text-primary">
            {t.bookingPage.successTitle}
          </h2>
          <p className="mt-2 text-[14px] leading-[1.6] tracking-[-0.011em] text-tertiary">
            {t.bookingPage.successBody}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="absolute -left-[10000px]" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="name">
                {t.bookingPage.name}
              </label>
              <input
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-2 ${fieldClass}`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="company">
                {t.bookingPage.company}
              </label>
              <input
                id="company"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`mt-2 ${fieldClass}`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">
                {t.bookingPage.email}
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-2 ${fieldClass}`}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">
                {t.bookingPage.phone}
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-2 ${fieldClass}`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="message">
              {t.bookingPage.message}
            </label>
            <textarea
              id="message"
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.bookingPage.messagePlaceholder}
              className={`mt-2 resize-y ${fieldClass}`}
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || !slot || !label}
            className="inline-flex h-10 items-center justify-center self-start rounded-[10px] bg-primary px-5 text-[14px] font-[510] tracking-[-0.011em] text-background transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "submitting"
              ? t.bookingPage.submitting
              : t.bookingPage.submit}
          </button>

          {status === "taken" || status === "error" ? (
            <p
              className="text-[13px] leading-[1.6] tracking-[-0.011em] text-red-700"
              role="alert"
            >
              {status === "taken"
                ? t.bookingPage.takenError
                : t.bookingPage.genericError}
            </p>
          ) : null}

          <p className="text-[13px] leading-[1.6] tracking-[-0.011em] text-tertiary">
            {t.bookingPage.note}
          </p>
        </form>
      )}
    </main>
  );
}
