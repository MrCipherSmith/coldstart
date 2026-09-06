/**
 * Re-shoots the keryx dashboard and records the numbers it shows.
 *
 * The screenshot on the site used to carry hand-typed figures in its caption,
 * which drifted the moment the project moved. Both now come out of the same
 * run: the picture and the caption cannot disagree, because they are read from
 * one render.
 *
 *   bun run scripts/shoot-dashboard.ts <path-to-keryx-dashboard.html>
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

const source = process.argv[2];
if (!source) throw new Error("usage: shoot-dashboard.ts <keryx-dashboard.html>");

const WIDTH = 1440;
const HEIGHT = 960;
const OUT_IMAGE = new URL("../public/shots/dashboard.webp", import.meta.url).pathname;
const OUT_STATS = new URL("../data/dashboard.json", import.meta.url).pathname;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});
await page.goto(`file://${source}`, { waitUntil: "networkidle" });

/** Read the header strip the same way a visitor does — off the rendered page. */
const stats = await page.evaluate(() => {
  const text = (document.body.innerText || "").replace(/\s+/g, " ");
  const grab = (label: string) => {
    const m = text.match(new RegExp(`([\\d,]+)\\s+${label}`, "i"));
    return m ? Number(m[1].replace(/,/g, "")) : null;
  };
  const health = text.match(/(\d+)\s*HEALTH/i);
  return {
    health: health ? Number(health[1]) : null,
    findings: grab("findings"),
    graphFiles: grab("graph files"),
    wikiPages: grab("wiki pages"),
    memoryEntries: grab("memory entries"),
    modules: grab("modules"),
  };
});

const png = await page.screenshot({ type: "png" });
await browser.close();

const missing = Object.entries(stats).filter(([, v]) => v === null).map(([k]) => k);
if (missing.length) {
  throw new Error(
    `the dashboard rendered without: ${missing.join(", ")} — ` +
      "run `keryx gdgraph build` and `keryx health run` before building it",
  );
}

// Re-rendering can differ byte for byte while showing the same thing. Writing
// only when a number actually moved keeps the nightly job from producing an
// empty commit — and a rebuild — every single night.
let previous: Record<string, unknown> = {};
try {
  previous = JSON.parse(await readFile(OUT_STATS, "utf8"));
} catch {
  /* first run */
}
const same = Object.entries(stats).every(([k, v]) => previous[k] === v);
if (same) {
  console.log("dashboard unchanged, nothing written:", stats);
  process.exit(0);
}

await sharp(png).resize({ width: 1280 }).webp({ quality: 82, effort: 6 }).toFile(OUT_IMAGE);
await writeFile(
  OUT_STATS,
  JSON.stringify(
    { shotAt: new Date().toISOString(), source: "keryx dashboard build", ...stats },
    null,
    2,
  ) + "\n",
);

console.log("dashboard re-shot:", stats);
