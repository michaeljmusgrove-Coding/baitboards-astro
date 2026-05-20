// Apply SEO title + description metafields to existing Shopify collections.
// Reads target collections + values from plan-collections-{date}.json (existingCollectionsToUpdate).
//
// Usage:
//   node scripts/seo/5-apply-collections.mjs [--confirm]
//
// Collections targeted (from 2-plan.mjs existingCollectionsToUpdate):
//   - bait-boards
//   - on-sale
//
// Backs up current state to scripts/seo/backups/collections-<handle>-<ts>.json.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { adminFetch, PROJECT_ROOT, SCRIPT_DIR } from "./lib.mjs";

const BACKUP_DIR = join(SCRIPT_DIR, "backups");
if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });

const PLAN_FILE = join(SCRIPT_DIR, "plan-2026-05-20.json");
const plan = JSON.parse(readFileSync(PLAN_FILE, "utf8"));
const targets = plan.existingCollectionsToUpdate || [];

const confirm = process.argv.includes("--confirm");

console.log(`[apply-collections] mode: ${confirm ? "LIVE APPLY" : "DRY RUN"}`);
console.log(`[apply-collections] collections to update: ${targets.length}`);
console.log("");

// Helper: find a collection by handle. Shopify splits into custom + smart;
// try custom first then smart.
async function findCollectionId(handle) {
  let resp = await adminFetch(`/custom_collections.json?handle=${encodeURIComponent(handle)}`);
  let data = await resp.json();
  if (data.custom_collections && data.custom_collections.length > 0) {
    return { id: data.custom_collections[0].id, kind: "custom", obj: data.custom_collections[0] };
  }
  resp = await adminFetch(`/smart_collections.json?handle=${encodeURIComponent(handle)}`);
  data = await resp.json();
  if (data.smart_collections && data.smart_collections.length > 0) {
    return { id: data.smart_collections[0].id, kind: "smart", obj: data.smart_collections[0] };
  }
  return null;
}

async function fetchCollectionMetafields(id) {
  const resp = await adminFetch(`/collections/${id}/metafields.json`);
  if (!resp.ok) return [];
  const data = await resp.json();
  return data.metafields || [];
}

async function upsertMetafield(collectionId, namespace, key, value, type) {
  // POST creates if absent; if a metafield with same ns+key exists, it updates.
  const body = {
    metafield: { namespace, key, value, type },
  };
  return await adminFetch(`/collections/${collectionId}/metafields.json`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const summary = [];

for (const target of targets) {
  console.log(`── collection: ${target.handle} ──`);
  const lookup = await findCollectionId(target.handle);
  if (!lookup) {
    console.error(`  ❌ not found in custom_collections or smart_collections`);
    summary.push({ handle: target.handle, status: "not_found" });
    continue;
  }
  const { id, kind, obj } = lookup;
  console.log(`  → id ${id} (${kind} collection)`);

  // Backup
  const existingMetas = await fetchCollectionMetafields(id);
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = join(BACKUP_DIR, `collection-${target.handle}-${ts}.json`);
  writeFileSync(
    backupPath,
    JSON.stringify({ handle: target.handle, id, kind, collection: obj, metafields: existingMetas }, null, 2),
    "utf8"
  );
  console.log(`  💾 backup → ${backupPath.replace(PROJECT_ROOT, ".")}`);

  const existingTitle = existingMetas.find((m) => m.namespace === "global" && m.key === "title_tag");
  const existingDesc = existingMetas.find((m) => m.namespace === "global" && m.key === "description_tag");

  const changes = [];
  if ((existingTitle?.value || "") !== target.seo_title) {
    changes.push({ field: "title_tag", from: existingTitle?.value || "(empty)", to: target.seo_title });
  }
  if ((existingDesc?.value || "") !== target.seo_description) {
    changes.push({ field: "description_tag", from: existingDesc?.value || "(empty)", to: target.seo_description });
  }

  if (changes.length === 0) {
    console.log(`  ✅ no changes (already matches)`);
    summary.push({ handle: target.handle, status: "no_changes" });
    continue;
  }

  for (const c of changes) {
    console.log(`  ✏️  ${c.field}:`);
    console.log(`     - from: ${(c.from || "").slice(0, 100)}`);
    console.log(`     + to:   ${c.to}`);
  }

  if (!confirm) {
    console.log(`  ⏸️  DRY RUN`);
    summary.push({ handle: target.handle, status: "dry_run", changes: changes.length });
    continue;
  }

  let allOk = true;
  if (changes.some((c) => c.field === "title_tag")) {
    const r = await upsertMetafield(id, "global", "title_tag", target.seo_title, "single_line_text_field");
    if (r.ok) console.log(`  ✅ title_tag applied`);
    else { console.error(`  ❌ title_tag failed: ${r.status} ${(await r.text()).slice(0, 200)}`); allOk = false; }
  }
  if (changes.some((c) => c.field === "description_tag")) {
    const r = await upsertMetafield(id, "global", "description_tag", target.seo_description, "multi_line_text_field");
    if (r.ok) console.log(`  ✅ description_tag applied`);
    else { console.error(`  ❌ description_tag failed: ${r.status} ${(await r.text()).slice(0, 200)}`); allOk = false; }
  }

  summary.push({ handle: target.handle, status: allOk ? "applied" : "partial", changes: changes.length, backup: backupPath });
  console.log("");
}

console.log("");
console.log("──── Summary ─────");
const counts = {};
for (const s of summary) counts[s.status] = (counts[s.status] || 0) + 1;
console.log("  by status:", JSON.stringify(counts));
for (const s of summary) console.log(`  ${s.status.padEnd(14)} ${s.handle}`);
