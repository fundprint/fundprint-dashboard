// Regenerates the social share card (public/og.png) from the pinned snapshot,
// in the Cold Case theme (cool putty, one red, a serif display, a schematic
// engine strip). Static PNG (not @vercel/og): builds fast, works everywhere.
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

const INK = "#1b1c1a";
const PAPER = "#d7d6c8";
const SHEET = "#f6f5ef";
const PE = "#b3241c";
const MUTE = "#565851";
const RULE = "#c4c3b4";
// Fraunces / Archivo are not installed on the build host, so the card renders
// in the closest system stand-ins: a serif for display, a grotesque for labels.
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Arial, Helvetica, sans-serif";

const stages = ["ACQUIRE", "STORE", "RESOLVE", "VALIDATE", "PUBLISH"];
const engineStrip = stages
  .map((s, i) => {
    const x = 80 + i * 158;
    return `
    <rect x="${x}" y="474" width="140" height="62" rx="3" fill="${SHEET}" stroke="${INK}" stroke-width="1.5"/>
    <text x="${x + 70}" y="510" font-family="${SANS}" font-size="15" fill="${INK}" text-anchor="middle" font-weight="700" letter-spacing="1">${s}</text>
    ${i < stages.length - 1 ? `<path d="M${x + 140} 505 h18 M${x + 152} 500 l6 5 l-6 5" fill="none" stroke="${PE}" stroke-width="2"/>` : ""}`;
  })
  .join("");

const stats = [
  [t.clinics.toLocaleString("en-US"), "CLINICS TRACED", 80],
  [`${pePct}%`, "PRIVATE-EQUITY OWNED", 360],
  [String(t.acquirers), "OWNERS", 700],
  [String(t.states), "STATES", 860],
];
const statSvg = stats
  .map(
    ([num, label, x]) => `
    <text x="${x}" y="414" font-family="${SERIF}" font-size="54" font-weight="700" fill="${x === 360 ? PE : INK}">${num}</text>
    <text x="${x}" y="440" font-family="${SANS}" font-size="14" fill="${MUTE}" letter-spacing="1.2">${label}</text>`,
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="7" fill="${PE}"/>

  <text x="80" y="92" font-family="${SERIF}" font-size="30" font-weight="700" fill="${INK}">Fundprint<tspan fill="${PE}">.</tspan></text>
  <text x="1120" y="92" font-family="${SANS}" font-size="15" fill="${MUTE}" text-anchor="end" letter-spacing="2">CASE NO. FP&#183;2026</text>
  <line x1="80" y1="118" x2="1120" y2="118" stroke="${RULE}" stroke-width="1"/>

  <text font-family="${SERIF}" font-size="52" font-weight="700" fill="${INK}">
    <tspan x="80" y="206">Private equity owns ${t.pe_clinics.toLocaleString("en-US")} of the ${t.clinics.toLocaleString("en-US")}</tspan>
    <tspan x="80" y="268">autism-therapy clinics we traced.</tspan>
  </text>
  <text x="80" y="330" font-family="${SANS}" font-size="22" fill="${MUTE}">Every claim traces to a public source.  &#183;  whofundsmytherapist.com</text>

  ${statSvg}
  ${engineStrip}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, "public/og.png"));
const meta = await sharp(join(root, "public/og.png")).metadata();
console.log(`wrote public/og.png (${meta.width}x${meta.height})`);
