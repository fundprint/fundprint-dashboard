// Regenerates the social share card (public/og.png) from the pinned snapshot.
//
// We render a static PNG rather than Next's dynamic opengraph-image route
// because @vercel/og mangles file:// paths on Windows at build time. A static
// PNG also builds faster, works on every platform, and every OG consumer
// (Facebook, LinkedIn, Twitter, Slack, iMessage) supports PNG where several
// reject SVG. Re-run this whenever the headline stats change:
//   node scripts/gen-og.mjs
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const snap = JSON.parse(readFileSync(join(root, "data/snapshot.json"), "utf8"));
const t = snap.totals;

const INK = "#12161c";
const CREAM = "#fbfaf7";
const PE = "#b4472e";
const MUTE = "#5b6470";
const FONT = "Arial, Helvetica, sans-serif";

const stats = [
  [t.clinics.toLocaleString("en-US"), "clinics tracked", 80],
  [String(t.acquirers), "owners", 400],
  [String(t.states), "states", 600],
  [t.pe_clinics.toLocaleString("en-US"), "PE-owned", 800],
];

const statSvg = stats
  .map(
    ([num, label, x]) => `
    <text x="${x}" y="512" font-family="${FONT}" font-size="58" font-weight="800" fill="${PE}">${num}</text>
    <text x="${x}" y="548" font-family="${FONT}" font-size="24" fill="${MUTE}">${label}</text>`,
  )
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${CREAM}"/>
  <rect x="0" y="0" width="1200" height="10" fill="${PE}"/>

  <text x="80" y="108" font-family="${FONT}" font-size="34" font-weight="700" fill="${INK}">fundprint<tspan fill="${PE}">.</tspan></text>

  <text font-family="${FONT}" font-size="64" font-weight="800" fill="${INK}" letter-spacing="-1">
    <tspan x="80" y="248">Is your child&#8217;s autism</tspan>
    <tspan x="80" y="324">therapy clinic owned by</tspan>
    <tspan x="80" y="400">private equity?</tspan>
  </text>

  ${statSvg}

  <text x="80" y="600" font-family="${FONT}" font-size="23" fill="${MUTE}">Free public dataset. Every claim traces to a public source.  &#183;  whofundsmytherapist.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, "public/og.png"));
const meta = await sharp(join(root, "public/og.png")).metadata();
console.log(`wrote public/og.png (${meta.width}x${meta.height})`);
