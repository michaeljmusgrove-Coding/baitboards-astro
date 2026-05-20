// HOTFIX: Restore the "bait boards" tag on canonical bait-board products.
// The Smart Collection rule for /collections/bait-boards filters by
// tag == "bait boards" (lowercase, two words). Today's SEO apply replaced
// the tag list entirely and dropped this one, emptying the collection.
//
// Also restore "on sale" tag if the on-sale collection uses a tag rule.
//
// Usage:
//   node scripts/seo/fix-collection-tags.mjs        (dry run)
//   node scripts/seo/fix-collection-tags.mjs --confirm

import { adminFetch } from "./lib.mjs";

const confirm = process.argv.includes("--confirm");

// 1. Identify Smart Collection rules so we know which legacy tags are needed
const baitBoardsResp = await adminFetch("/smart_collections/495386198332.json");
const baitBoardsData = await baitBoardsResp.json();
console.log("=== bait-boards Smart Collection rule ===");
console.log(JSON.stringify(baitBoardsData.smart_collection.rules));

const onSaleResp = await adminFetch("/smart_collections/499269796156.json");
const onSaleData = await onSaleResp.json();
console.log("=== on-sale Smart Collection rule ===");
console.log(JSON.stringify(onSaleData.smart_collection.rules));
console.log("disjunctive:", onSaleData.smart_collection.disjunctive);
console.log("");

// 2. Identify which legacy tag we need to add back
const baitBoardsRule = baitBoardsData.smart_collection.rules.find((r) => r.column === "tag");
const requiredTag = baitBoardsRule?.condition;
if (!requiredTag) {
  console.error("Could not determine required tag from bait-boards rule");
  process.exit(1);
}
console.log(`[fix] required tag for bait-boards collection: "${requiredTag}"`);

// 3. Get all products matching the CANONICAL bait board pattern (handle starts with bait-board-)
const productsResp = await adminFetch("/products.json?limit=250&fields=id,handle,tags,product_type,status");
const productsData = await productsResp.json();
const canonicalBoards = productsData.products.filter(
  (p) => /^bait-board[s]?-/i.test(p.handle) && p.status === "active"
);

console.log(`[fix] found ${canonicalBoards.length} active canonical bait-board products`);
console.log("");

const updates = [];
for (const p of canonicalBoards) {
  const tagList = (p.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const hasTag = tagList.some((t) => t.toLowerCase() === requiredTag.toLowerCase());
  if (hasTag) {
    console.log(`  ✅ ${p.handle.padEnd(45)} already has "${requiredTag}"`);
    continue;
  }
  const newTags = [...tagList, requiredTag].join(", ");
  console.log(`  ✏️  ${p.handle.padEnd(45)} ADD "${requiredTag}" → tags: ${newTags}`);
  updates.push({ id: p.id, handle: p.handle, newTags });
}

console.log("");
console.log(`[fix] ${updates.length} products need the tag added`);

if (!confirm) {
  console.log("DRY RUN — re-run with --confirm to apply");
  process.exit(0);
}

console.log("[fix] applying...");
for (const u of updates) {
  const r = await adminFetch(`/products/${u.id}.json`, {
    method: "PUT",
    body: JSON.stringify({ product: { id: u.id, tags: u.newTags } }),
  });
  if (r.ok) {
    console.log(`  ✅ ${u.handle}`);
  } else {
    const text = await r.text();
    console.error(`  ❌ ${u.handle}: ${r.status} ${text.slice(0, 200)}`);
  }
  await new Promise((r) => setTimeout(r, 300));
}
console.log("");
console.log("[fix] done. Smart Collection refreshes automatically (~30s).");
