import { Suspense } from "react";
import type { Metadata } from "next";
import { BookingForm } from "@/components/sections/BookingForm";

export const metadata: Metadata = {
  title: "Book en samtale",
  description: "Bekreft tidspunkt for en uforpliktende prat om en uke på innsiden.",
};

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookingForm />
    </Suspense>
  );
}
