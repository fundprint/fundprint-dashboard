// Regenerates the social share card (public/og.png) from the pinned snapshot,
// in the Dossier theme (paper, ink, evidence-red, a schematic engine strip).
//
// Static PNG (not @vercel/og): builds fast, works on every platform, and every
// OG consumer supports PNG where several reject SVG. Re-run when stats change:
//   node scripts/gen-og.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const snap = JSON.parse(readFileSync(join(root, "data/snapshot.json"), "utf8"));
const t = snap.totals;
const pePct = Math.round((t.pe_clinics / t.clinics) * 100);

const INK = "#201d17";
const PAPER = "#e6dbc2";
const SHEET = "#f4eedb";
const PE = "#8a1f1c";
const MUTE = "#5a5342";
const RULE = "#c3b48f";
const SERIF = "'Bitter', Georgia, serif";
const DISPLAY = "'Arial Narrow', 'Oswald', sans-serif";
const MONO = "'Courier New', monospace";

const stages = ["ACQUIRE", "STORE", "RESOLVE", "VALIDATE", "PUBLISH"];
const engineStrip = stages
  .map((s, i) => {
    const x = 80 + i * 158;
    return `
    <rect x="${x}" y="470" width="140" height="70" rx="2" fill="${SHEET}" stroke="${INK}" stroke-width="2"/>
    <text x="${x + 70}" y="512" font-family="${MONO}" font-size="16" fill="${INK}" text-anchor="middle" font-weight="700" letter-spacing="1">${s}</text>
    ${i < stages.length - 1 ? `<path d="M${x + 140} 505 h18 M${x + 152} 500 l6 5 l-6 5" fill="none" stroke="${PE}" stroke-width="2"/>` : ""}`;
  })
  .join("");

const stats = [
  [t.clinics.toLocaleString("en-US"), "CLINICS TRACED", 80],
  [`${pePct}%`, "PE-OWNED", 380],
  [String(t.acquirers), "OWNERS", 620],
  [String(t.states), "STATES", 820],
];
const statSvg = stats
  .map(
    ([num, label, x]) => `
    <text x="${x}" y="410" font-family="${MONO}" font-size="50" font-weight="700" fill="${x === 380 ? PE : INK}">${num}</text>
    <text x="${x}" y="438" font-family="${MONO}" font-size="16" fill="${MUTE}" letter-spacing="1.5">${label}</text>`,
  )
  .join("");

const line1 = `PRIVATE EQUITY OWNS ${t.pe_clinics.toLocaleString("en-US")} OF THE ${t.clinics.toLocaleString("en-US")}`;
const line2 = "AUTISM-THERAPY CLINICS WE TRACED.";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${PE}"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${RULE}" stroke-width="1"/>
  <rect x="34" y="34" width="1132" height="562" fill="none" stroke="${RULE}" stroke-width="1" opacity="0.5"/>

  <text x="80" y="92" font-family="${SERIF}" font-size="30" font-weight="700" fill="${INK}">Fundprint<tspan fill="${PE}">.</tspan></text>
  <text x="1120" y="92" font-family="${MONO}" font-size="16" fill="${MUTE}" text-anchor="end" letter-spacing="2">CASE NO. FP&#183;2026</text>

  <text font-family="${DISPLAY}" font-size="62" font-weight="700" fill="${INK}" letter-spacing="0.5">
    <tspan x="80" y="196">${line1}</tspan>
    <tspan x="80" y="262">${line2}</tspan>
  </text>
  <text x="80" y="312" font-family="${SERIF}" font-size="24" fill="${MUTE}">Every claim traces to a public source.  &#183;  whofundsmytherapist.com</text>

  ${statSvg}
  ${engineStrip}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, "public/og.png"));
const meta = await sharp(join(root, "public/og.png")).metadata();
console.log(`wrote public/og.png (${meta.width}x${meta.height})`);
