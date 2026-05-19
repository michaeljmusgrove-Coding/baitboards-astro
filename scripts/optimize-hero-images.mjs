import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const IMG_DIR = 'public/images';

const jobs = [
  {
    file: 'banner-2.webp',
    width: 1200,
    height: 349,
    quality: 58,
  },
  {
    file: 'Logo-Main.webp',
    width: 400,
    height: 204,
    quality: 78,
  },
  {
    file: '24_7_service.webp',
    width: 420,
    height: 360,
    quality: 70,
  },
  {
    file: 'carpet-flood-and-water-damage-melbourne.webp',
    width: 1200,
    height: 401,
    quality: 58,
  },
  {
    file: 'flood_and_water_damage.webp',
    width: 1200,
    height: 453,
    quality: 58,
  },
];

for (const job of jobs) {
  const src = join(IMG_DIR, job.file);
  const before = statSync(src).size;
  const input = readFileSync(src);
  const out = await sharp(input)
    .resize(job.width, job.height, { fit: 'cover', position: 'center', withoutEnlargement: true })
    .webp({ quality: job.quality, effort: 6, smartSubsample: true })
    .toBuffer();
  writeFileSync(src, out);
  const after = statSync(src).size;
  const savedKiB = ((before - after) / 1024).toFixed(1);
  console.log(
    `${job.file}: ${(before / 1024).toFixed(1)} KiB -> ${(after / 1024).toFixed(1)} KiB (saved ${savedKiB} KiB) @ ${job.width}x${job.height}`
  );
}
