import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingForm } from "@/components/sections/BookingForm";

export const metadata: Metadata = {
  title: "Book en samtale — INIT",
  description: "Bekreft tidspunkt for en uforpliktende prat om automatisering.",
};

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingForm />
    </Suspense>
  );
}
