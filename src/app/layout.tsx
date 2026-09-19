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
    "En uke på innsiden: en utvikler jobber en hel arbeidsuke i systemene bedriften allerede bruker, til fast pris og med et avtalt resultat. For små norske tjenestebedrifter.",
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
