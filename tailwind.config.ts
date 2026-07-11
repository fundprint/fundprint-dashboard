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
        ink: "#201d17", // warm typewriter near-black
        "ink-muted": "#5a5342",
        paper: "#e6dbc2", // the desk: kraft / manila
        sheet: "#f4eedb", // aged white filing paper (cards)
        manila: "#dccfad", // folder stock
        "manila-edge": "#c7b992", // folder edge / shadow line
        rule: "#c3b48f", // hairline rules on kraft
        // Owner-type legend, learned once and used everywhere. `pe` is the
        // classified stamp / redaction red; `pen` is the annotation ink-blue.
        pe: "#8a1f1c", // private equity (oxblood stamp)
        pension: "#2b4a62", // pension fund (ink blue)
        family: "#6a5c2e", // family office (olive)
        other: "#4b4740", // other institutional (graphite)
        stamp: "#8a1f1c",
        pen: "#2b4a62",
      },
      fontFamily: {
        // Condensed gothic headers, slab-serif body, typewriter for labels/data.
        display: ["var(--font-display)", "Oswald", "Arial Narrow", "sans-serif"],
        serif: ["var(--font-body)", "Georgia", "Cambria", "serif"],
        mono: ["var(--font-typwr)", "Courier New", "monospace"],
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        folder: "0 1px 0 #c7b992, 0 10px 22px -14px rgba(32,29,23,0.5)",
        sheet: "0 1px 0 rgba(0,0,0,0.05), 0 12px 26px -16px rgba(32,29,23,0.45)",
      },
      rotate: {
        "1.5": "1.5deg",
        "2.5": "2.5deg",
      },
    },
  },
  plugins: [],
};

export default config;
