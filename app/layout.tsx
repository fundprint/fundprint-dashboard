import type { Metadata } from "next";
import { Fraunces, Archivo } from "next/font/google";
import Footer from "@/components/Footer";
import Masthead from "@/components/dossier/Masthead";
import MarginPapers from "@/components/dossier/MarginPapers";
import "./globals.css";

// Self-hosted at build time by next/font (no runtime Google request, so the
// static export stays CSP-clean). Two voices: Fraunces, an old-style serif with
// real character, for display; Archivo, a clean grotesque, for body, UI, labels,
// and figures. No monospace: typewriter faces read as a default.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-display",
});
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const SITE_URL = "https://whofundsmytherapist.com";
const TITLE = "Fundprint: Who owns your autism therapy clinic?";
const DESCRIPTION =
  "The first free, public dataset of private-equity ownership of U.S. ABA / autism therapy clinics. Every claim traces to a public source.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Fundprint",
  keywords: [
    "private equity",
    "autism therapy",
    "ABA therapy",
    "clinic ownership",
    "healthcare private equity",
    "public records",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Fundprint",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Fundprint: is your child's autism therapy clinic owned by private equity?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const plausible = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  return (
    <html lang="en" className={`${fraunces.variable} ${archivo.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <MarginPapers />
        <Masthead />
        <main className="relative mx-auto max-w-5xl px-5 py-10">{children}</main>
        <Footer />
        {plausible ? (
          // Privacy-respecting analytics: no cookies, no per-user profiles,
          // searches are never logged against a person (docs/deployment.md).
          <script
            defer
            data-domain={plausible}
            src="https://plausible.io/js/script.js"
          />
        ) : null}
      </body>
    </html>
  );
}
