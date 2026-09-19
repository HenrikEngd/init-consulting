import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingForm } from "@/components/sections/BookingForm";

export const metadata: Metadata = {
  title: "Book en samtale",
  description: "Velg tidspunkt for en innledende samtale om behov, omfang og mulige neste steg.",
};

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingForm />
    </Suspense>
  );
}
