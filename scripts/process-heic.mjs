#!/usr/bin/env node
/**
 * Convert HEIC files in /site/New Pics/ to web-ready WebP + AVIF in
 * /site/public/images/gallery/. Uses heic-convert (pure JS) because
 * sharp's Windows libvips isn't built with HEIF compression support.
 *
 * heic-convert decodes HEIC → JPEG buffer → sharp pipeline → WebP/AVIF.
 *
 * Run once after dropping new HEIC sources:
 *   node scripts/process-heic.mjs
 */
import heicConvert from 'heic-convert';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(__dirname, '..', 'New Pics');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'gallery');
const MAX_EDGE = 1600;

const HEIC_MAP = {
  'IMG_5305.heic': 'cleaning-onsite-detail-1',
  'IMG_5310.heic': 'cleaning-onsite-detail-2',
  'IMG_5313.heic': 'cleaning-onsite-detail-3',
  'IMG_5314.heic': 'cleaning-onsite-detail-4',
  'IMG_5315.HEIC': 'cleaning-onsite-detail-5',
  'IMG_5316.HEIC': 'cleaning-onsite-detail-6',
  'IMG_5317.HEIC': 'cleaning-onsite-detail-7',
  'IMG_5318.HEIC': 'cleaning-onsite-detail-8',
};

async function convert(srcFile, slug) {
  const srcPath = path.join(SRC_DIR, srcFile);
  const webpPath = path.join(OUT_DIR, `${slug}.webp`);
  const avifPath = path.join(OUT_DIR, `${slug}.avif`);

  const inputBuffer = await fs.readFile(srcPath);
  const jpegBuffer = await heicConvert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.92,
  });

  const meta = await sharp(jpegBuffer).metadata();
  const longest = Math.max(meta.width, meta.height);
  let pipeline = sharp(jpegBuffer).rotate();
  if (longest > MAX_EDGE) {
    pipeline = pipeline.resize({
      width:  meta.width >= meta.height ? MAX_EDGE : null,
      height: meta.height > meta.width  ? MAX_EDGE : null,
      withoutEnlargement: true,
    });
  }
  await pipeline.clone().webp({ quality: 80 }).toFile(webpPath);
  await pipeline.clone().avif({ quality: 60, effort: 6 }).toFile(avifPath);

  const [w, a] = await Promise.all([fs.stat(webpPath), fs.stat(avifPath)]);
  return { srcFile, slug, srcDims: `${meta.width}x${meta.height}`, srcBytes: inputBuffer.length, webpBytes: w.size, avifBytes: a.size };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let totalSrc = 0, totalW = 0, totalA = 0, count = 0;
  for (const [src, slug] of Object.entries(HEIC_MAP)) {
    try {
      const r = await convert(src, slug);
      console.log(`[ok] ${src.padEnd(20)} → ${slug}.{webp,avif}  ${r.srcDims}  ${(r.srcBytes/1024).toFixed(0)}→${(r.webpBytes/1024).toFixed(0)}KB webp / ${(r.avifBytes/1024).toFixed(0)}KB avif`);
      totalSrc += r.srcBytes; totalW += r.webpBytes; totalA += r.avifBytes; count++;
    } catch (e) {
      console.error(`[FAIL] ${src}: ${e.message.substring(0, 100)}`);
    }
  }
  console.log(`\n[totals] ${count} HEIC images converted`);
  console.log(`  source: ${(totalSrc/1024/1024).toFixed(2)} MB`);
  console.log(`  webp:   ${(totalW/1024/1024).toFixed(2)} MB (-${((1-totalW/totalSrc)*100).toFixed(0)}%)`);
  console.log(`  avif:   ${(totalA/1024/1024).toFixed(2)} MB (-${((1-totalA/totalSrc)*100).toFixed(0)}%)`);
}

main().catch(e => { console.error(e); process.exit(1); });
