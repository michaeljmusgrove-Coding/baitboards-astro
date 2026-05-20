// Restore a product from a backup snapshot (produced by 4-apply.mjs).
// Reverts product fields + SEO metafields + image alt text back to the backed-up values.
//
// Usage:
//   node scripts/seo/restore.mjs --backup scripts/seo/backups/<handle>-<ts>.json [--confirm]

import { readFileSync, existsSync } from "node:fs";
import { adminFetch, PROJECT_ROOT } from "./lib.mjs";

const args = process.argv.slice(2);
const backupPath = arg("--backup");
const confirm = args.includes("--confirm");

if (!backupPath) {
  console.error("error: --backup <path-to-backup-json> required");
  process.exit(1);
}
if (!existsSync(backupPath)) {
  console.error(`error: backup file not found: ${backupPath}`);
  process.exit(1);
}

function arg(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}

const backup = JSON.parse(readFileSync(backupPath, "utf8"));
const { handle, id, product, metafields } = backup;

console.log(`[restore] handle: ${handle} (id ${id})`);
console.log(`[restore] backup saved at: ${backup.saved_at}`);
console.log(`[restore] mode: ${confirm ? "LIVE RESTORE" : "DRY RUN"}`);
console.log("");

// What will be restored
const seoTitleMeta = metafields.find((m) => m.namespace === "global" && m.key === "title_tag");
const seoDescMeta = metafields.find((m) => m.namespace === "global" && m.key === "description_tag");

console.log("Restoring to:");
console.log(`  title:               ${product.title}`);
console.log(`  body_html:           ${truncate(product.body_html || "(empty)", 100)}`);
console.log(`  tags:                ${product.tags || "(empty)"}`);
console.log(`  product_type:        ${product.product_type || "(empty)"}`);
console.log(`  seo_title_tag:       ${seoTitleMeta?.value || "(empty)"}`);
console.log(`  seo_description_tag: ${truncate(seoDescMeta?.value || "(empty)", 100)}`);
console.log(`  image alt texts:`);
for (const img of product.images || []) {
  console.log(`    img ${img.position}: ${img.alt || "(empty)"}`);
}
console.log("");

if (!confirm) {
  console.log("DRY RUN — not applying. Re-run with --confirm to restore.");
  process.exit(0);
}

// Apply product fields + metafields atomically
const productBody = {
  product: {
    id,
    body_html: product.body_html || "",
    tags: product.tags || "",
    product_type: product.product_type || "",
    metafields: [
      {
        namespace: "global",
        key: "title_tag",
        value: seoTitleMeta?.value || "",
        type: "single_line_text_field",
      },
      {
        namespace: "global",
        key: "description_tag",
        value: seoDescMeta?.value || "",
        type: "multi_line_text_field",
      },
    ],
  },
};

const updResp = await adminFetch(`/products/${id}.json`, {
  method: "PUT",
  body: JSON.stringify(productBody),
});

if (!updResp.ok) {
  const text = await updResp.text();
  console.error(`❌ product restore failed: ${updResp.status} ${text.slice(0, 300)}`);
  process.exit(1);
}
console.log(`✅ product fields + SEO metafields restored`);

// Restore image alt texts
for (const img of product.images || []) {
  const altResp = await adminFetch(`/products/${id}/images/${img.id}.json`, {
    method: "PUT",
    body: JSON.stringify({ image: { id: img.id, alt: img.alt || "" } }),
  });
  if (altResp.ok) {
    console.log(`✅ image ${img.position} alt restored`);
  } else {
    const text = await altResp.text();
    console.error(`❌ image ${img.position} alt failed: ${altResp.status} ${text.slice(0, 200)}`);
  }
}

console.log("");
console.log("Restore complete.");

function truncate(s, n) {
  s = String(s ?? "").replace(/\n/g, " ");
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
