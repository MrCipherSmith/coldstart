/**
 * The keryx screenshots ship as PNG in their own repository. Static export turns
 * off Next.js image optimization, so they are converted once, here: the sources
 * stay in assets/shots-src/ (never served) and the WebP files land in public/,
 * which is what the page actually loads.
 *
 *   bun run scripts/optimize-shots.ts
 */
import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";

const SRC = new URL("../assets/shots-src/", import.meta.url).pathname;
const OUT = new URL("../public/shots/", import.meta.url).pathname;
const MAX_WIDTH = 1280;

const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/.test(f));
let before = 0;
let after = 0;

for (const file of files) {
  const src = SRC + file;
  const out = OUT + file.replace(/\.(png|jpe?g)$/, ".webp");
  before += (await stat(src)).size;
  await sharp(src)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(out);
  const size = (await stat(out)).size;
  after += size;
  console.log(`${file} -> ${(size / 1024).toFixed(0)} KB`);
}

console.log(
  `\n${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB ` +
    `(${(100 - (after / before) * 100).toFixed(0)}% smaller)`,
);
