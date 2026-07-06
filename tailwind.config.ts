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
        paper: "#fbfaf7",
        // Owner-type accents, used consistently across every view so the
        // legend a reader learns once holds everywhere.
        pe: "#b4472e", // private equity
        pension: "#2f6f7d", // pension fund
        family: "#7a6a3a", // family office
        other: "#6b7280",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
