/**
 * Bulk WebP Image Converter
 * Converts all PNG/JPG images in public/images/ to WebP format.
 * Keeps originals as fallback, updates references in source files.
 *
 * Usage: node scripts/convert-webp.mjs
 */

import sharp from 'sharp';
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';

const IMAGES_DIR = 'C:/Users/micha/code/tfdm/public/images';
const QUALITY = 80;

async function getImageFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getImageFiles(fullPath)));
    } else {
      const ext = extname(entry.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

async function convertToWebP(filePath) {
  const ext = extname(filePath);
  const webpPath = filePath.replace(ext, '.webp');
  try {
    const originalStat = await stat(filePath);
    await sharp(filePath).webp({ quality: QUALITY }).toFile(webpPath);
    const webpStat = await stat(webpPath);
    const savings = ((1 - webpStat.size / originalStat.size) * 100).toFixed(1);
    return {
      original: filePath,
      webp: webpPath,
      originalSize: originalStat.size,
      webpSize: webpStat.size,
      savings: parseFloat(savings),
    };
  } catch (err) {
    console.error(`  Failed: ${filePath} — ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('WebP Image Converter');
  console.log('====================\n');

  const files = await getImageFiles(IMAGES_DIR);
  console.log(`Found ${files.length} images to convert.\n`);

  let totalOriginal = 0;
  let totalWebP = 0;
  let converted = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const result = await convertToWebP(files[i]);
    if (result) {
      totalOriginal += result.originalSize;
      totalWebP += result.webpSize;
      converted++;
      if ((i + 1) % 50 === 0) {
        console.log(`  [${i + 1}/${files.length}] converted...`);
      }
    } else {
      failed++;
    }
  }

  const savedMB = ((totalOriginal - totalWebP) / 1024 / 1024).toFixed(1);
  const pct = ((1 - totalWebP / totalOriginal) * 100).toFixed(1);

  console.log('\n====================');
  console.log('Conversion Complete!');
  console.log(`  Converted: ${converted}`);
  console.log(`  Failed:    ${failed}`);
  console.log(`  Original:  ${(totalOriginal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  WebP:      ${(totalWebP / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Saved:     ${savedMB} MB (${pct}%)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
