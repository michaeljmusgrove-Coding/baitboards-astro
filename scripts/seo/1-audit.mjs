// Audit current SEO state of all products in Shopify.
// Read-only. Saves a baseline JSON for later rollback.
//
// Run: node scripts/seo/1-audit.mjs

import {
  fetchAllProducts,
  fetchProductMetafields,
  saveJSON,
  timestamp,
  sleep,
} from "./lib.mjs";

console.log("[audit] fetching all products...");
const products = await fetchAllProducts();
console.log(`[audit] got ${products.length} products`);

const audit = [];
for (let i = 0; i < products.length; i++) {
  const p = products[i];
  process.stdout.write(`[audit] ${i + 1}/${products.length}: ${p.title.slice(0, 50)}...                \r`);

  // Get product-level metafields (where SEO title/description live)
  let metafields = [];
  try {
    metafields = await fetchProductMetafields(p.id);
  } catch (err) {
    console.warn(`\n[audit] metafields fetch failed for ${p.id}: ${err.message}`);
  }

  const seoTitle = metafields.find((m) => m.namespace === "global" && m.key === "title_tag");
  const seoDesc = metafields.find((m) => m.namespace === "global" && m.key === "description_tag");

  audit.push({
    id: p.id,
    handle: p.handle,
    status: p.status,
    title: p.title,
    body_html: p.body_html || "",
    body_html_first_sentence: extractFirstSentence(p.body_html || ""),
    body_html_length: (p.body_html || "").length,
    vendor: p.vendor,
    product_type: p.product_type,
    tags: p.tags,
    image_count: (p.images || []).length,
    images: (p.images || []).map((img) => ({
      id: img.id,
      position: img.position,
      alt: img.alt,
      filename: img.src.split("/").pop().split("?")[0],
      src: img.src,
    })),
    seo_title_tag: seoTitle?.value || null,
    seo_description_tag: seoDesc?.value || null,
    variant_count: (p.variants || []).length,
    variants: (p.variants || []).map((v) => ({
      id: v.id,
      sku: v.sku,
      price: v.price,
      compare_at_price: v.compare_at_price,
      inventory_quantity: v.inventory_quantity,
      inventory_management: v.inventory_management,
      inventory_policy: v.inventory_policy,
    })),
    total_inventory: (p.variants || []).reduce((sum, v) => sum + (v.inventory_quantity || 0), 0),
    is_out_of_stock: (p.variants || []).every((v) => (v.inventory_quantity || 0) <= 0 && v.inventory_management === "shopify"),
    has_compare_at_price: (p.variants || []).some((v) => v.compare_at_price),
  });

  // Be polite with rate limits — Shopify Standard plan = 2 req/sec.
  await sleep(150);
}
process.stdout.write("\n");

const outputPath = saveJSON(`audit-${timestamp()}.json`, audit);
console.log(`[audit] saved ${audit.length} products to ${outputPath}`);

// Quick summary
const stats = {
  total: audit.length,
  active: audit.filter((p) => p.status === "active").length,
  with_seo_title: audit.filter((p) => p.seo_title_tag).length,
  with_seo_description: audit.filter((p) => p.seo_description_tag).length,
  with_alt_text_all_images: audit.filter((p) => p.image_count > 0 && p.images.every((i) => i.alt && i.alt.length > 0)).length,
  with_some_alt_text: audit.filter((p) => p.image_count > 0 && p.images.some((i) => i.alt && i.alt.length > 0)).length,
  no_alt_text: audit.filter((p) => p.image_count > 0 && p.images.every((i) => !i.alt)).length,
  empty_tags: audit.filter((p) => !p.tags || p.tags.trim() === "").length,
  empty_product_type: audit.filter((p) => !p.product_type || p.product_type.trim() === "").length,
};
console.log("\n[audit] summary:");
for (const [k, v] of Object.entries(stats)) {
  console.log(`  ${k}: ${v}`);
}

// First-pass image filename audit
const imgFilenames = audit.flatMap((p) => p.images.map((i) => i.filename));
const screenshotPattern = /^ScreenShot/i.test;
const screenshotCount = imgFilenames.filter((f) => /^ScreenShot/i.test(f)).length;
console.log(`  total_images: ${imgFilenames.length}`);
console.log(`  screenshot_filenames: ${screenshotCount}`);

function extractFirstSentence(html) {
  // Strip HTML, take first sentence (up to first . ! or ?)
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const m = text.match(/^[^.!?]+[.!?]/);
  return (m ? m[0] : text.slice(0, 200)).trim();
}
