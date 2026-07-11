import type { Metadata } from "next";
import { Oswald, Bitter, Courier_Prime } from "next/font/google";
import Footer from "@/components/Footer";
import Masthead from "@/components/dossier/Masthead";
import "./globals.css";

// Self-hosted at build time by next/font: no runtime request to Google, which
// keeps the static export clean and CSP-safe. Three distinct voices for a case
// file: a condensed gothic for report headers, a slab serif for the body, and a
// typewriter for labels, figures, and stamps.
const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});
const bitter = Bitter({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-body",
});
const courier = Courier_Prime({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-typwr",
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
    <html
      lang="en"
      className={`${oswald.variable} ${bitter.variable} ${courier.variable}`}
    >
      <body className="min-h-screen bg-paper font-serif text-ink antialiased">
        <Masthead />
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
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
