#!/usr/bin/env node
/**
 * Bulk convert all raster images in /public/images/ to WebP.
 * Originals are retained alongside (so JPG/PNG remain available
 * via redirect compatibility for legacy embeds).
 *
 * Usage:  node scripts/convert-to-webp.js
 *
 * Pattern adapted from /code/TCM/site/scripts/convert-to-webp.js.
 */

import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

const RASTER_EXTS = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (RASTER_EXTS.has(extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

async function convertFile(filePath) {
  const ext = extname(filePath);
  const webpPath = filePath.slice(0, -ext.length) + '.webp';
  if (existsSync(webpPath)) return { skipped: true };

  const origStat = await stat(filePath);

  // Defensive: large hero images should be capped at 1920px wide
  const meta = await sharp(filePath).metadata();
  const pipeline = sharp(filePath);
  if ((meta.width ?? 0) > 1920) pipeline.resize({ width: 1920, withoutEnlargement: true });

  await pipeline.webp({ quality: 82, effort: 6 }).toFile(webpPath);
  const newStat = await stat(webpPath);
  return {
    ok: true,
    saving: origStat.size - newStat.size,
    origSize: origStat.size,
    newSize: newStat.size,
  };
}

async function main() {
  if (!existsSync(imagesDir)) {
    console.warn(`No images dir at ${imagesDir} — run fetch-assets first.`);
    return;
  }

  const files = await walk(imagesDir);
  console.log(`Found ${files.length} raster files to consider.`);

  let converted = 0;
  let skipped = 0;
  let saved = 0;

  for (const file of files) {
    const r = await convertFile(file);
    if (r.skipped) {
      skipped++;
    } else {
      converted++;
      saved += r.saving;
      const pct = ((r.saving / r.origSize) * 100).toFixed(0);
      console.log(`  ✓ ${file.replace(imagesDir, '')}  (${pct}% saved)`);
    }
  }

  console.log(`\n${converted} converted, ${skipped} already had WebP, total saved: ${(saved / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
