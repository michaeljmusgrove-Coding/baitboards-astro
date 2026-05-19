import sharp from 'sharp';
import fs from 'node:fs';

const SVG = fs.readFileSync('public/favicon.svg');

// Apple touch icon: 180×180 PNG
await sharp(SVG, { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('public/apple-touch-icon.png written');

// favicon.ico: stack 32×32 + 16×16. Sharp can't write ICO directly,
// so write a 32x32 PNG and rename — most browsers accept PNG-as-ICO.
await sharp(SVG, { density: 600 }).resize(32, 32).png().toFile('public/favicon.ico');
console.log('public/favicon.ico written (32x32 PNG-as-ICO)');

// Also 192 + 512 for PWA
await sharp(SVG, { density: 600 }).resize(192, 192).png().toFile('public/icon-192.png');
await sharp(SVG, { density: 600 }).resize(512, 512).png().toFile('public/icon-512.png');
console.log('public/icon-192.png, public/icon-512.png written');
