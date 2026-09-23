// One-off/rerunnable generator for the PWA icon set (`npm run icons`). The
// fictional brand has no logo artwork, so the source is the same leaf glyph the
// BrandMark uses (the "leaf" paths in app/components/AppIcon.vue), drawn in the
// on-dark token over the eucalyptus primary.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.dirname(fileURLToPath(import.meta.url));
const iconsDir = path.join(root, "..", "public", "icons");

// --color-primary and --color-on-dark in app/assets/css/main.css.
const BACKGROUND = "#3f5b4c";
const GLYPH = "#f6f4ee";

const LEAF_PATHS = [
  "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10Z",
  "M2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12",
];

// Renders the glyph centred on a square, opaque canvas. `glyphRatio` is the share
// of the canvas the 24×24 glyph box occupies.
function iconSvg(size, glyphRatio) {
  const glyphSize = size * glyphRatio;
  const offset = (size - glyphSize) / 2;
  const scale = glyphSize / 24;
  const paths = LEAF_PATHS.map((d) => `<path d="${d}"/>`).join("");

  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="${BACKGROUND}"/>
      <g transform="translate(${offset} ${offset}) scale(${scale})"
         fill="none" stroke="${GLYPH}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        ${paths}
      </g>
    </svg>
  `);
}

async function render(size, glyphRatio, fileName) {
  await sharp(iconSvg(size, glyphRatio)).png().toFile(path.join(iconsDir, fileName));
}

async function main() {
  await mkdir(iconsDir, { recursive: true });

  await render(192, 0.62, "icon-192.png");
  await render(512, 0.62, "icon-512.png");

  // Maskable: glyph confined to a ~50% safe zone so circular/squircle OS masks
  // never clip it.
  await render(512, 0.5, "maskable-icon-512.png");

  // iOS applies its own rounded mask and renders transparency as black, so the
  // opaque square canvas above is exactly what it needs.
  await render(180, 0.6, "apple-touch-icon.png");

  console.log("Generated PWA icons in public/icons/");
}

main();
