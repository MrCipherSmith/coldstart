/**
 * The phone mockups arrive centred on a wide dark field. This trims the field
 * away by scanning in from each edge for the first row or column that differs
 * from the background colour sampled at a corner, leaving just the device.
 *
 *   bun run scripts/crop-mockups.ts <file.png> <name>
 */
import sharp from "sharp";

const [input, name] = process.argv.slice(2);
if (!input || !name) throw new Error("usage: crop-mockups.ts <file> <out-name>");

const DIR = new URL("../assets/shots-src/", import.meta.url).pathname;
const src = input.includes("/") ? input : DIR + input;

const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;
const px = (x: number, y: number) => {
  const i = (y * info.width + x) * ch;
  return [data[i], data[i + 1], data[i + 2]];
};
const [br, bg, bb] = px(2, 2);
const differs = (x: number, y: number) => {
  const [r, g, b] = px(x, y);
  return Math.abs(r - br) + Math.abs(g - bg) + Math.abs(b - bb) > 24;
};
const rowHas = (y: number) => {
  for (let x = 0; x < info.width; x += 2) if (differs(x, y)) return true;
  return false;
};
const colHas = (x: number) => {
  for (let y = 0; y < info.height; y += 2) if (differs(x, y)) return true;
  return false;
};

let top = 0;
let bottom = info.height - 1;
let left = 0;
let right = info.width - 1;
while (top < bottom && !rowHas(top)) top++;
while (bottom > top && !rowHas(bottom)) bottom--;
while (left < right && !colHas(left)) left++;
while (right > left && !colHas(right)) right--;

const out = `${DIR}${name}.png`;
await sharp(src)
  .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
  .toFile(out);

console.log(`${name}.png — ${right - left + 1}x${bottom - top + 1}`);
