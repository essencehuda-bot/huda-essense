import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '../../public/images');

// Skip non-product images
const skipPatterns = ['base_', 'huda_', 'khamrah_master', 'libre_master'];

const pngFiles = fs.readdirSync(imagesDir)
  .filter(f => f.endsWith('.png') && !skipPatterns.some(p => f.startsWith(p)));

console.log(`Found ${pngFiles.length} product PNG files to process...\n`);

let updated = 0;
let skipped = 0;
let failed = 0;

for (const filename of pngFiles) {
  const filePath = path.join(imagesDir, filename);
  
  try {
    const { data, info } = await sharp(filePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixels = new Uint8Array(data);
    let modified = false;

    for (let i = 0; i < pixels.length; i += channels) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // Detect white/near-white sticker pixels
      const isNearWhite = r > 200 && g > 200 && b > 200;
      const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
      const isNeutral = maxDiff < 30;

      if (isNearWhite && isNeutral) {
        const brightness = (r + g + b) / 3;
        // Feathered alpha — pure white = fully transparent
        const alpha = Math.max(0, Math.min(255, Math.round((255 - brightness) * 2.5)));
        pixels[i + 3] = alpha;
        modified = true;
      }
    }

    if (modified) {
      const tmpFile = filePath + '.tmp.png';
      await sharp(Buffer.from(pixels), { raw: { width, height, channels } })
        .png({ compressionLevel: 8 })
        .toFile(tmpFile);
      
      // Replace original with temp file
      fs.unlinkSync(filePath);
      fs.renameSync(tmpFile, filePath);
      
      console.log(`OK: ${filename}`);
      updated++;
    } else {
      console.log(`SKIP: ${filename}`);
      skipped++;
    }
  } catch (err) {
    console.error(`FAIL: ${filename} -- ${err.message}`);
    failed++;
  }
}

console.log(`\nDone! Updated: ${updated}  Skipped: ${skipped}  Failed: ${failed}  Total: ${pngFiles.length}`);
