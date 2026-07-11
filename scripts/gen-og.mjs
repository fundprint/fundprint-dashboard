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

const INK = "#12161c";
const PAPER = "#fbfaf7";
const PE = "#b4472e";
const MUTE = "#5c584f";
const RULE = "#d9d2c2";
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', monospace";

const stages = ["ACQUIRE", "STORE", "RESOLVE", "VALIDATE", "PUBLISH"];
const engineStrip = stages
  .map((s, i) => {
    const x = 80 + i * 158;
    return `
    <rect x="${x}" y="470" width="140" height="70" rx="4" fill="#ffffff" stroke="${INK}" stroke-width="2"/>
    <text x="${x + 70}" y="512" font-family="${MONO}" font-size="17" fill="${INK}" text-anchor="middle" font-weight="700">${s}</text>
    ${i < stages.length - 1 ? `<path d="M${x + 140} 505 h18 M${x + 152} 500 l6 5 l-6 5" fill="none" stroke="${PE}" stroke-width="2"/>` : ""}`;
  })
  .join("");

const stats = [
  [t.clinics.toLocaleString("en-US"), "clinics traced", 80],
  [`${pePct}%`, "PE-owned", 380],
  [String(t.acquirers), "owners", 620],
  [String(t.states), "states", 820],
];
const statSvg = stats
  .map(
    ([num, label, x]) => `
    <text x="${x}" y="410" font-family="${SERIF}" font-size="52" font-weight="700" fill="${x === 380 ? PE : INK}">${num}</text>
    <text x="${x}" y="438" font-family="${MONO}" font-size="19" fill="${MUTE}">${label}</text>`,
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${PE}"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${RULE}" stroke-width="1"/>

  <text x="80" y="92" font-family="${SERIF}" font-size="30" font-weight="700" fill="${INK}">Fundprint<tspan fill="${PE}">.</tspan></text>
  <text x="1120" y="92" font-family="${MONO}" font-size="17" fill="${MUTE}" text-anchor="end" letter-spacing="2">CASE NO. FP&#183;2026</text>

  <text font-family="${SERIF}" font-size="55" font-weight="700" fill="${INK}">
    <tspan x="80" y="192">Private equity owns ${t.pe_clinics.toLocaleString("en-US")} of the ${t.clinics.toLocaleString("en-US")}</tspan>
    <tspan x="80" y="258">autism-therapy clinics we traced.</tspan>
  </text>
  <text x="80" y="316" font-family="${SERIF}" font-size="26" fill="${MUTE}">Every claim traces to a public source.  &#183;  whofundsmytherapist.com</text>

  ${statSvg}
  ${engineStrip}
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, "public/og.png"));
const meta = await sharp(join(root, "public/og.png")).metadata();
console.log(`wrote public/og.png (${meta.width}x${meta.height})`);
