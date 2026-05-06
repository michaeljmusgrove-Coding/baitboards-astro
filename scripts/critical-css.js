#!/usr/bin/env node
/**
 * Post-build: inline critical above-the-fold CSS into every HTML page,
 * defer the full stylesheet via <link media="print" onload="this.media='all'">.
 *
 * Run after `astro build`:  node scripts/critical-css.js
 * Pattern adapted from /code/TCM/site/scripts/critical-css.js.
 */

import Critters from 'critters';
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve script's own directory (NOT the script's parent — common pitfall).
// The trailing-slash + extra dirname() pattern previously over-resolved to
// the project root, breaking dist/ lookup on both Windows and Linux CI.
const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');

async function collectHtml(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectHtml(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

async function run() {
  try { await stat(DIST_DIR); } catch {
    console.error('ERROR: dist/ directory not found. Run `npx astro build` first.');
    process.exit(1);
  }

  const files = await collectHtml(DIST_DIR);
  console.log(`Inlining critical CSS for ${files.length} HTML files...`);

  const critters = new Critters({
    path: DIST_DIR,
    preload: 'media',
    inlineFonts: false,
    compress: true,
    logLevel: 'warn',
    reduceInlineStyles: true,
    mergeStylesheets: true,
  });

  let processed = 0;
  let errors = 0;
  for (const file of files) {
    try {
      const original = await readFile(file, 'utf8');
      let result = await critters.process(original);
      // Critters bug fix: strip media/onload from <noscript><link> so JS-disabled
      // browsers still get the stylesheet
      result = result.replace(
        /<noscript><link rel="stylesheet" href="([^"]+)"[^>]*><\/noscript>/g,
        '<noscript><link rel="stylesheet" href="$1"></noscript>'
      );
      await writeFile(file, result);
      processed++;
    } catch (err) {
      errors++;
      console.warn(`  ✗ ${file}: ${err.message ?? err}`);
    }
  }

  console.log(`Done. ${processed} processed, ${errors} errors.`);
}

run().catch((err) => { console.error(err); process.exit(1); });
