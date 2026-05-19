import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// JPGs that are referenced from src/ as background-image or <img>; OG-1 is
// excluded because social-platform crawlers don't support AVIF for og:image.
const TARGETS = [
  'public/images/wp-content/uploads/2020/02/tryaa.jpg',
  'public/images/wp-content/uploads/2020/02/qwwqwqwqwqwqwqewqewwqewqewq.jpg',
  'public/images/wp-content/uploads/2020/02/32233223.jpg',
  'public/images/wp-content/uploads/2020/02/45.jpg',
  'public/images/wp-content/uploads/2020/02/8998yuh.jpg',
  'public/images/wp-content/uploads/2020/02/ddg.jpg',
  'public/images/wp-content/uploads/2020/02/222344.jpg',
  'public/images/wp-content/uploads/2020/02/dff.jpg',
];

let totalSavedBytes = 0;
let processed = 0;

for (const jpg of TARGETS) {
  if (!fs.existsSync(jpg)) {
    console.warn(`SKIP (missing): ${jpg}`);
    continue;
  }

  const avifOut = jpg.replace(/\.(jpg|jpeg)$/i, '.avif');
  const webpOut = jpg.replace(/\.(jpg|jpeg)$/i, '.webp');

  const jpgSize = fs.statSync(jpg).size;

  // AVIF — quality 60 is a sensible AVIF default; visually indistinguishable
  // from quality 75 JPEG but ~50-60% smaller.
  if (!fs.existsSync(avifOut)) {
    await sharp(jpg).avif({ quality: 60, effort: 6 }).toFile(avifOut);
  }
  const avifSize = fs.statSync(avifOut).size;

  // WebP — already shipped per earlier convert-webp run, but confirm
  if (!fs.existsSync(webpOut)) {
    await sharp(jpg).webp({ quality: 80 }).toFile(webpOut);
  }
  const webpSize = fs.statSync(webpOut).size;

  const savedVsJpg = jpgSize - avifSize;
  totalSavedBytes += savedVsJpg;
  processed++;

  const fmt = (n) => `${(n / 1024).toFixed(1)} KB`;
  const pct = ((1 - avifSize / jpgSize) * 100).toFixed(1);
  console.log(
    `${path.basename(jpg).padEnd(40)} JPG ${fmt(jpgSize).padStart(9)} → WebP ${fmt(webpSize).padStart(9)} → AVIF ${fmt(avifSize).padStart(9)}  (-${pct}% vs JPG)`
  );
}

console.log(`\nProcessed ${processed} images; AVIF saves ~${(totalSavedBytes / 1024).toFixed(1)} KB total over JPG.`);
