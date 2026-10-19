// Renders the square brand mark (brand/fundprint-logo-500.png) used as the GitHub
// org avatar and anywhere a square logo is needed. Same palette as the share card
// (gen-og.mjs): putty paper, ink, and the one red, with the wordmark's red full stop.
// Georgia stands in for the display serif, as in gen-og.mjs, because the web fonts
// are not installed on the build host.
import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SERIF = "Georgia, 'Times New Roman', serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500">
  <rect width="500" height="500" fill="#d7d6c8"/>
  <rect width="500" height="14" fill="#b3241c"/>
  <text x="138" y="352" font-family="${SERIF}" font-size="300" font-weight="700" fill="#1b1c1a">f</text>
  <circle cx="332" cy="330" r="34" fill="#b3241c"/>
</svg>`;

mkdirSync(join(root, "brand"), { recursive: true });
await sharp(Buffer.from(svg)).png().toFile(join(root, "brand/fundprint-logo-500.png"));
console.log("wrote brand/fundprint-logo-500.png (500x500)");
