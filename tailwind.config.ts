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
        ink: "#1b1c1a",
        "ink-muted": "#565851", // cool gray
        paper: "#d7d6c8", // cool putty ground (not yellow)
        sheet: "#f6f5ef", // crisp near-white document
        manila: "#d0cfbf",
        "manila-edge": "#bbbaa8",
        rule: "#c4c3b4",
        // Owner-type legend, learned once, used everywhere. `pe` is the one
        // restrained red; `pen`/slate is the secondary annotation ink.
        pe: "#b3241c",
        pension: "#45525a", // slate
        family: "#6d6a3c", // olive
        other: "#83837a", // grey
        stamp: "#b3241c",
        pen: "#45525a",
      },
      fontFamily: {
        // Libre Caslon Text (legal / broadsheet serif) for display; Archivo
        // (grotesque) for body, UI, labels and figures. `mono` is remapped to
        // Archivo so no typewriter face survives anywhere.
        display: ["var(--font-display)", "Libre Caslon Text", "Georgia", "serif"],
        serif: ["var(--font-display)", "Libre Caslon Text", "Georgia", "serif"],
        sans: ["var(--font-body)", "Archivo", "system-ui", "sans-serif"],
        mono: ["var(--font-body)", "Archivo", "system-ui", "sans-serif"],
      },
      boxShadow: {
        folder: "0 1px 0 #bbbaa8, 0 12px 26px -18px rgba(27,28,26,0.45)",
        sheet: "0 1px 0 rgba(0,0,0,0.04), 0 14px 30px -20px rgba(27,28,26,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
