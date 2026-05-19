/**
 * Rehype plugin to add width, height, and loading="lazy" to inline blog images.
 * Images from Markdown (![alt](src)) render as bare <img> tags without these attributes,
 * causing CLS and eager loading of below-fold content.
 */
import { visit } from 'unist-util-visit';
import fs from 'node:fs';
import path from 'node:path';

const dimensionCache = new Map();

function getImageDimensions(src) {
  if (dimensionCache.has(src)) return dimensionCache.get(src);

  if (src.startsWith('http://') || src.startsWith('https://')) {
    dimensionCache.set(src, null);
    return null;
  }

  const filePath = path.join(process.cwd(), 'public', src);
  if (!fs.existsSync(filePath)) {
    dimensionCache.set(src, null);
    return null;
  }

  try {
    const buffer = Buffer.alloc(30);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 30, 0);
    fs.closeSync(fd);

    if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
      const format = buffer.toString('ascii', 12, 16);

      if (format === 'VP8 ') {
        const width = buffer.readUInt16LE(26) & 0x3FFF;
        const height = buffer.readUInt16LE(28) & 0x3FFF;
        const dims = { width, height };
        dimensionCache.set(src, dims);
        return dims;
      }

      if (format === 'VP8L') {
        const bits = buffer.readUInt32LE(21);
        const width = (bits & 0x3FFF) + 1;
        const height = ((bits >> 14) & 0x3FFF) + 1;
        const dims = { width, height };
        dimensionCache.set(src, dims);
        return dims;
      }

      if (format === 'VP8X') {
        const width = (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16)) + 1;
        const height = (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16)) + 1;
        const dims = { width, height };
        dimensionCache.set(src, dims);
        return dims;
      }
    }
  } catch {
    // Ignore read errors
  }

  dimensionCache.set(src, null);
  return null;
}

export default function rehypeImgAttrs() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;

      const props = node.properties || {};
      const src = props.src;
      if (!src) return;

      if (!props.loading) {
        props.loading = 'lazy';
      }

      if (!props.width || !props.height) {
        const dims = getImageDimensions(src);
        if (dims) {
          props.width = dims.width;
          props.height = dims.height;
        }
      }
    });
  };
}
