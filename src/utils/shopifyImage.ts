/**
 * Append Shopify CDN width transform to an image URL.
 *
 * Shopify CDN honours both `&width=N` query param and the `_WIDTHx` filename
 * pattern. We use the query param form because it composes cleanly with the
 * `?v=…` cache-busting param already on most URLs, with no regex on the file
 * extension.
 *
 * Pure URL transform — no API calls, no Shopify-side data changes.
 * Non-Shopify URLs (local /images/* etc.) pass through unchanged.
 */
export function shopifyImage(url: string | null | undefined, width: number): string {
  if (!url) return '';
  if (!url.includes('cdn.shopify.com')) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}width=${width}`;
}
