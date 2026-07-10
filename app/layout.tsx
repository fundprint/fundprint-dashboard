import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import "./globals.css";

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
    <html lang="en">
      <body className="min-h-screen font-sans">
        <header className="border-b border-black/10 bg-white/60 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
            <Link href="/" className="font-mono text-sm font-bold tracking-tight">
              fundprint<span className="text-pe">.</span>
            </Link>
            <nav className="flex gap-5 text-sm text-black/70">
              <Link href="/" className="hover:text-black">
                Look up a clinic
              </Link>
              <Link href="/acquirers/" className="hover:text-black">
                Acquirers
              </Link>
              <Link href="/map/" className="hover:text-black">
                Map
              </Link>
              <Link href="/methodology/" className="hover:text-black">
                Methodology
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
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
