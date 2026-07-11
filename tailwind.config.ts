import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#12161c",
        "ink-muted": "#5c584f", // margin notes, secondary type on paper
        paper: "#fbfaf7",
        manila: "#efe7d6", // folder / card stock
        "manila-edge": "#e2d8c2", // folder edge / darker stock
        rule: "#d9d2c2", // hairline rules
        // Owner-type accents, used consistently across every view so the
        // legend a reader learns once holds everywhere. `pe` doubles as the
        // dossier evidence-red (redaction bars, stamps, the active stage).
        pe: "#b4472e", // private equity
        pension: "#2f6f7d", // pension fund
        family: "#7a6a3a", // family office
        other: "#6b7280",
        stamp: "#a5381f", // pressed-ink stamp red (slightly deeper than pe)
      },
      fontFamily: {
        // Editorial serif (display + long-form) and a precise mono for data.
        // Both self-hosted via next/font; variables set in app/layout.tsx.
        serif: ["var(--font-newsreader)", "Georgia", "Cambria", "serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        // A soft, printed drop for folders / exhibit cards on paper.
        folder: "0 1px 0 #e2d8c2, 0 8px 24px -12px rgba(18,22,28,0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
