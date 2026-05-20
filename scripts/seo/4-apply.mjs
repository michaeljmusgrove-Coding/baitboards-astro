// Apply SEO plan changes to a single product or a batch via Shopify Admin API.
// Reads plan-{date}.json — the canonical machine-readable plan from 2-plan.mjs.
//
// Usage:
//   node scripts/seo/4-apply.mjs --handle <product-handle> [--confirm]
//   node scripts/seo/4-apply.mjs --handles "<h1>,<h2>,<h3>" [--confirm]
//   node scripts/seo/4-apply.mjs --all-canonical [--confirm]
//   node scripts/seo/4-apply.mjs --all-active [--confirm]
//   node scripts/seo/4-apply.mjs --archive-deprecated [--confirm]
//
// Field handling per product:
//   seo_title_tag      : applied (full text, no ellipsis truncation)
//   seo_description_tag: applied
//   body_html          : replaced with proposed_body_html (full multi-section HTML)
//   tags               : replaced if proposed differs
//   product_type       : applied if proposed differs
//   image filename     : if needs_rename: POST new image (src=old.src, filename=new) → DELETE old
//   image alt          : applied either via PUT or as part of POST-new during rename
//
// DEPRECATE_AND_REDIRECT products (--archive-deprecated): set status=archived only;
// 301 redirects are already deployed via worker.js + redirects.js.
//
// Always backs up the current product+metafields+images to scripts/seo/backups/ before applying.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { adminFetch, PROJECT_ROOT, SCRIPT_DIR, sleep } from "./lib.mjs";

const BACKUP_DIR = join(SCRIPT_DIR, "backups");
const PLAN_FILE = join(SCRIPT_DIR, "plan-2026-05-20.json");

const args = process.argv.slice(2);
const handleArg = arg("--handle");
const handlesArg = arg("--handles");
const allCanonical = args.includes("--all-canonical");
const allActive = args.includes("--all-active");
const archiveDeprecated = args.includes("--archive-deprecated");
const confirm = args.includes("--confirm");

function arg(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}

if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });

const plan = JSON.parse(readFileSync(PLAN_FILE, "utf8"));
const planByHandle = new Map(plan.products.map((p) => [p.handle, p]));

// Determine handle set
let handles = [];
if (allCanonical) {
  handles = plan.products.filter((p) => p.consolidation === "CANONICAL").map((p) => p.handle);
} else if (allActive) {
  // All active, NOT deprecated, NOT test
  handles = plan.products
    .filter((p) => p.status === "active" && p.consolidation !== "DEPRECATE_AND_REDIRECT" && p.line !== "TEST")
    .map((p) => p.handle);
} else if (archiveDeprecated) {
  handles = plan.products.filter((p) => p.consolidation === "DEPRECATE_AND_REDIRECT").map((p) => p.handle);
} else if (handlesArg) {
  handles = handlesArg.split(",").map((s) => s.trim()).filter(Boolean);
} else if (handleArg) {
  handles = [handleArg];
}

if (handles.length === 0) {
  console.error("error: must pass --handle <h> or --handles \"<h1>,<h2>\" or --all-canonical / --all-active / --archive-deprecated");
  process.exit(1);
}

console.log(`[apply] mode: ${confirm ? "LIVE APPLY" : "DRY RUN"}`);
console.log(`[apply] action: ${archiveDeprecated ? "ARCHIVE DEPRECATED" : "FULL SEO UPDATE"}`);
console.log(`[apply] handles: ${handles.length}`);
console.log("");

const summary = [];

for (const handle of handles) {
  const planEntry = planByHandle.get(handle);
  if (!planEntry) {
    console.error(`❌ ${handle}: not in plan, skipping`);
    summary.push({ handle, status: "not_in_plan" });
    continue;
  }

  console.log(`── ${handle} (id ${planEntry.id}, ${planEntry.line}, ${planEntry.consolidation}) ──`);

  // 1. Fetch current product state
  const fetchResp = await adminFetch(`/products/${planEntry.id}.json`);
  if (!fetchResp.ok) {
    console.error(`  ❌ fetch failed: ${fetchResp.status}`);
    summary.push({ handle, status: "fetch_failed" });
    continue;
  }
  const fetchData = await fetchResp.json();
  const current = fetchData.product;

  const metaResp = await adminFetch(`/products/${planEntry.id}/metafields.json`);
  const metaData = metaResp.ok ? await metaResp.json() : { metafields: [] };
  const existingSeoTitle = metaData.metafields.find((m) => m.namespace === "global" && m.key === "title_tag");
  const existingSeoDesc = metaData.metafields.find((m) => m.namespace === "global" && m.key === "description_tag");

  // 2. Backup
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = join(BACKUP_DIR, `${handle}-${ts}.json`);
  writeFileSync(
    backupPath,
    JSON.stringify({
      handle,
      id: planEntry.id,
      saved_at: new Date().toISOString(),
      product: current,
      metafields: metaData.metafields,
    }, null, 2),
    "utf8"
  );
  console.log(`  💾 backup → ${backupPath.replace(PROJECT_ROOT, ".")}`);

  // SPECIAL CASE: ARCHIVE deprecated products
  if (archiveDeprecated || planEntry.consolidation === "DEPRECATE_AND_REDIRECT") {
    if (current.status === "archived") {
      console.log(`  ⏭️  already archived`);
      summary.push({ handle, status: "already_archived", backup: backupPath });
      continue;
    }
    console.log(`  ✏️  status: ${current.status} → archived (redirect already live in worker.js)`);
    if (!confirm) {
      console.log(`  ⏸️  DRY RUN`);
      summary.push({ handle, status: "dry_run_archive", backup: backupPath });
      continue;
    }
    const archResp = await adminFetch(`/products/${planEntry.id}.json`, {
      method: "PUT",
      body: JSON.stringify({ product: { id: planEntry.id, status: "archived" } }),
    });
    if (archResp.ok) {
      console.log(`  ✅ archived`);
      summary.push({ handle, status: "archived", backup: backupPath });
    } else {
      console.error(`  ❌ archive failed: ${archResp.status}`);
      summary.push({ handle, status: "archive_failed", backup: backupPath });
    }
    await sleep(300); // polite throttle
    continue;
  }

  // FULL SEO UPDATE path
  const changes = [];
  const productPatch = { id: planEntry.id };
  const metafieldUpserts = [];

  // SEO title
  if (planEntry.proposed_seo_title && !planEntry.proposed_seo_title.startsWith("[skip")) {
    const cur = existingSeoTitle?.value || "";
    if (planEntry.proposed_seo_title !== cur) {
      changes.push({ field: "seo_title_tag", from: cur, to: planEntry.proposed_seo_title });
      metafieldUpserts.push({
        namespace: "global", key: "title_tag",
        value: planEntry.proposed_seo_title,
        type: "single_line_text_field",
      });
    }
  }

  // SEO description
  if (planEntry.proposed_seo_description && !planEntry.proposed_seo_description.startsWith("[skip")) {
    const cur = existingSeoDesc?.value || "";
    if (planEntry.proposed_seo_description !== cur) {
      changes.push({ field: "seo_description_tag", from: cur, to: planEntry.proposed_seo_description });
      metafieldUpserts.push({
        namespace: "global", key: "description_tag",
        value: planEntry.proposed_seo_description,
        type: "multi_line_text_field",
      });
    }
  }

  // body_html — replace with full proposed version
  if (planEntry.proposed_body_html && planEntry.proposed_body_html !== current.body_html) {
    changes.push({ field: "body_html", from: `(${(current.body_html || "").length} chars)`, to: `(${planEntry.proposed_body_html.length} chars full HTML)` });
    productPatch.body_html = planEntry.proposed_body_html;
  }

  // tags
  if (planEntry.proposed_tags) {
    const curTags = (current.tags || "").split(",").map((t) => t.trim()).filter(Boolean).sort().join(", ");
    const propTags = planEntry.proposed_tags.split(",").map((t) => t.trim()).filter(Boolean).sort().join(", ");
    if (curTags !== propTags) {
      changes.push({ field: "tags", from: curTags || "(empty)", to: propTags });
      productPatch.tags = planEntry.proposed_tags;
    }
  }

  // product_type
  if (planEntry.proposed_product_type && planEntry.proposed_product_type !== (current.product_type || "")) {
    changes.push({ field: "product_type", from: current.product_type || "(empty)", to: planEntry.proposed_product_type });
    productPatch.product_type = planEntry.proposed_product_type;
  }

  // Image alt + filename plan
  const imageOps = [];
  for (const planImg of planEntry.proposed_images || []) {
    const curImg = current.images?.find((i) => String(i.id) === String(planImg.id));
    if (!curImg) continue;
    const altChanged = (curImg.alt || "") !== planImg.proposed_alt;
    if (planImg.needs_rename) {
      imageOps.push({ kind: "rename", oldImage: curImg, new: planImg });
    } else if (altChanged) {
      imageOps.push({ kind: "alt_only", oldImage: curImg, new: planImg });
    }
  }

  if (changes.length === 0 && imageOps.length === 0) {
    console.log(`  ✅ no changes needed (already matches plan)`);
    summary.push({ handle, status: "no_changes", backup: backupPath });
    continue;
  }

  // Print diff
  for (const c of changes) {
    console.log(`  ✏️  ${c.field}:`);
    console.log(`     - from: ${truncate(c.from, 100)}`);
    console.log(`     + to:   ${truncate(c.to, 100)}`);
  }
  for (const op of imageOps) {
    if (op.kind === "rename") {
      console.log(`  🖼️  image pos ${op.new.position} RENAME: ${op.new.current_filename} → ${op.new.proposed_filename}`);
      console.log(`     alt: "${truncate(op.new.proposed_alt, 80)}"`);
    } else {
      console.log(`  🖼️  image pos ${op.new.position} alt-only update:`);
      console.log(`     "${truncate(op.new.proposed_alt, 100)}"`);
    }
  }

  if (!confirm) {
    console.log(`  ⏸️  DRY RUN`);
    summary.push({ handle, status: "dry_run", changes: changes.length, image_ops: imageOps.length, backup: backupPath });
    continue;
  }

  // Apply product fields + metafields atomically
  let allOk = true;
  if (Object.keys(productPatch).length > 1 || metafieldUpserts.length > 0) {
    const body = {
      product: {
        ...productPatch,
        ...(metafieldUpserts.length > 0 ? { metafields: metafieldUpserts } : {}),
      },
    };
    const updResp = await adminFetch(`/products/${planEntry.id}.json`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (updResp.ok) {
      console.log(`  ✅ product fields + metafields applied`);
    } else {
      const text = await updResp.text();
      console.error(`  ❌ product update failed: ${updResp.status} ${text.slice(0, 300)}`);
      allOk = false;
    }
    await sleep(400); // throttle between major calls
  }

  // Apply image operations — order matters: process by position ascending,
  // for renames: POST new image with src=old.src + new filename, then DELETE old.
  for (const op of imageOps) {
    if (op.kind === "alt_only") {
      const altResp = await adminFetch(`/products/${planEntry.id}/images/${op.oldImage.id}.json`, {
        method: "PUT",
        body: JSON.stringify({ image: { id: op.oldImage.id, alt: op.new.proposed_alt } }),
      });
      if (altResp.ok) {
        console.log(`  ✅ image pos ${op.new.position} alt updated`);
      } else {
        const text = await altResp.text();
        console.error(`  ❌ image pos ${op.new.position} alt failed: ${altResp.status} ${text.slice(0, 200)}`);
        allOk = false;
      }
    } else if (op.kind === "rename") {
      // POST new image
      const postResp = await adminFetch(`/products/${planEntry.id}/images.json`, {
        method: "POST",
        body: JSON.stringify({
          image: {
            src: op.oldImage.src,
            filename: op.new.proposed_filename,
            position: op.oldImage.position,
            alt: op.new.proposed_alt,
          },
        }),
      });
      if (!postResp.ok) {
        const text = await postResp.text();
        console.error(`  ❌ image pos ${op.new.position} re-upload failed: ${postResp.status} ${text.slice(0, 200)}`);
        allOk = false;
        continue;
      }
      const newImg = (await postResp.json()).image;
      console.log(`  ✅ image pos ${op.new.position} re-uploaded as id=${newImg.id} (${op.new.proposed_filename})`);
      await sleep(400); // brief pause before delete

      // DELETE old image
      const delResp = await adminFetch(`/products/${planEntry.id}/images/${op.oldImage.id}.json`, {
        method: "DELETE",
      });
      if (delResp.ok || delResp.status === 200) {
        console.log(`  ✅ image old id=${op.oldImage.id} deleted`);
      } else {
        const text = await delResp.text();
        console.error(`  ⚠️  old image delete failed (new one is in place though): ${delResp.status} ${text.slice(0, 200)}`);
      }
      await sleep(400);
    }
  }

  summary.push({
    handle,
    status: allOk ? "applied" : "partial",
    changes: changes.length,
    image_ops: imageOps.length,
    backup: backupPath,
  });
  console.log("");
}

console.log("");
console.log("──── Summary ─────────────────────────────────────────────────────");
const counts = {};
for (const s of summary) counts[s.status] = (counts[s.status] || 0) + 1;
console.log("  by status:", JSON.stringify(counts));
console.log("");
for (const s of summary) {
  console.log(`  ${s.status.padEnd(20)} ${s.handle}`);
}

function truncate(s, n) {
  s = String(s ?? "").replace(/\n/g, " ");
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}
