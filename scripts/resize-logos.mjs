// One-shot logo resize via buffer to avoid Windows file-lock issues.
// PSI audit flagged oversized logos:
//   - logo.webp:        2541×670, displayed 180×47  → target 360×~93
//   - shark-logo.webp:  1000×1000, displayed 265×70 → target 540×540
// We pipe through Sharp to a buffer (closing the read handle), then write
// back to the same path via writeFileSync.

import sharp from "sharp";
import { writeFileSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PUBLIC = join("public", "images");

// Write to NEW filenames (avoids Windows file-lock from sharp's read handle).
// Code references are then updated to point at the -sm.webp versions.
const TARGETS = [
  { src: "logo.webp", out: "logo-sm.webp", width: 360, quality: 85 },
  { src: "shark-logo.webp", out: "shark-logo-sm.webp", width: 540, quality: 85 },
];

for (const t of TARGETS) {
  const inPath = join(PUBLIC, t.src);
  const outPath = join(PUBLIC, t.out);
  if (!existsSync(inPath)) {
    console.log(`[skip] ${t.src} — not found`);
    continue;
  }
  const beforeSize = statSync(inPath).size;
  const beforeMeta = await sharp(inPath).metadata();

  await sharp(inPath)
    .resize({ width: t.width, withoutEnlargement: true })
    .webp({ quality: t.quality, effort: 6 })
    .toFile(outPath);

  const afterSize = statSync(outPath).size;
  const afterMeta = await sharp(outPath).metadata();
  const pct = ((1 - afterSize / beforeSize) * 100).toFixed(1);
  console.log(
    `[resize] ${t.src} → ${t.out}: ${beforeMeta.width}x${beforeMeta.height} → ${afterMeta.width}x${afterMeta.height}, ` +
      `${(beforeSize / 1024).toFixed(1)} KB → ${(afterSize / 1024).toFixed(1)} KB (-${pct}%)`
  );
}
console.log("");
console.log("Originals untouched. Update code refs to /images/logo-sm.webp and /images/shark-logo-sm.webp.");
