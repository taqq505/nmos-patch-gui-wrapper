// Rasterizes the upstream app's SVG favicon into a 1024x1024 PNG so
// `tauri icon` can generate the full Windows icon set from it.
// Usage: node scripts/make-icon.mjs <source.svg> <out.png>
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const src = process.argv[2] ?? 'webapp/favicon.svg';
const out = process.argv[3] ?? 'icon-source.png';

if (!existsSync(src)) {
  console.error(`Source icon not found: ${src}`);
  process.exit(1);
}

await sharp(src, { density: 384 })
  .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toFile(out);

console.log(`Wrote ${out}`);
