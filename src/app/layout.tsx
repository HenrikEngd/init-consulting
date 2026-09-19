import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "INIT Consulting",
    template: "%s — INIT Consulting",
  },
  description:
    "INIT forbedrer arbeidsflyt, automatiserer rutinearbeid og kobler sammen systemene bedriften allerede bruker. Avgrensede oppdrag med avtalt pris og leveranse.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="no"
      className={`${inter.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-primary">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
