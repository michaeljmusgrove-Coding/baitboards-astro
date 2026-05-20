// Generate a proposed-change plan from the audit. CSV-only output.
// Does NOT touch Shopify. Owner reviews CSV before any changes are applied.
//
// Run: node scripts/seo/2-plan.mjs

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { saveText, SCRIPT_DIR, timestamp } from "./lib.mjs";

const auditPath = join(SCRIPT_DIR, `audit-${timestamp()}.json`);
const audit = JSON.parse(readFileSync(auditPath, "utf8"));
console.log(`[plan] loaded ${audit.length} products from ${auditPath}`);

// ─── Step 1: identify duplicate Bait-Board / Fillet-Table pairs ────────────
//
// Products fall into one of three groups:
//   A. Metric "Bait Board" line — canonical (matches AU search vocabulary)
//   B. Imperial "Fillet Table" line — duplicate of A, deprecate + redirect
//   C. Accessories or unique products — keep, no consolidation
//
// Explicit pair map: handle → canonical handle. Built from manual audit of the
// 41 products in Shopify on 2026-05-09. Easier to maintain than regex inference.

const PAIR_MAP = {
  // fillet-table handle → canonical bait-board handle
  "seaking-b01-fillet-table": "bait-board-b01",
  "seaking-b02-fillet-table": "bait-board-b02",
  "seaking-b03-fiberglass-fillet-table": "bait-board-b03",
  "seaking-b04-fiberglass-fillet-table": "bait-board-b04",
  "seaking-jj12-fiberglass-fillet-table": "bait-board-jj-12",
  "seaking-hh14-fiberglass-fillet-table": "bait-board-hh-14",
  "seaking-hj15-fiberglass-fillet-table": "bait-board-hj-15",
  "seaking-sq13-fiberglass-fillet-table": "bait-board-sq-13",
  "seaking-h10-white-fiberglass-fillet-table": "bait-board-sk-h10",
  "seaking-h10-black-fiberglass-fillet-table": "bait-board-sk-h10b",
  "seaking-e09-white-fiberglass-fillet-table": "bait-board-sk-e09",
  "seaking-e09-black-fiberglass-fillet-table": "bait-board-sk-e09-blk",
  "seaking-j07-fiberglass-fillet-table": "bait-board-sk-j07",
  "seaking-k08-fiberglass-fillet-table": "bait-board-sk-k08-blk",
  "seaking-leaning-post-white-fiberglass-fillet-table": "bait-boards-leaning-post-top-skl-11",
  "seaking-leaning-post-black-fiberglass-fillet-table": "leaning-post-top-only-blk",
};

// Tag the line based on title + handle.
// Order matters: PAIR_MAP check must come BEFORE accessory checks because
// some fillet-table products have "rod holders" in their titles.
function classifyLine(p) {
  const t = p.title.toLowerCase();
  const h = p.handle.toLowerCase();
  if (h === "test" || t === "test") return "TEST";
  if (h.includes("upgrades-optional-add-on")) return "UPGRADE_VARIANT";
  // Pair-map check first — definitive for known duplicate pairs
  if (PAIR_MAP[h]) return "FILLET_TABLE_LINE";
  if (Object.values(PAIR_MAP).includes(h)) return "BAIT_BOARD_LINE";
  // Then accessories (standalone, not paired)
  if (h === "pair-of-316-grade-stainless-steel-mounting-legs-and-bases-for-vessel") return "ACCESSORY_LEGS";
  if (h === "seaking-bases-and-legs" || t.includes("bases and legs")) return "ACCESSORY_LEGS";
  if (h === "rod-holders" || h === "2-x-game-rated-rod-holders-stainless-steel-316-grade") return "ACCESSORY_ROD_HOLDER";
  if (h === "seaking-game-rated-rod-holder") return "ACCESSORY_ROD_HOLDER";
  if (t.includes("rod holder") && !t.includes("bait board") && !t.includes("fillet table")) return "ACCESSORY_ROD_HOLDER";
  // Catch-all by title
  if (t.includes("bait board")) return "BAIT_BOARD_LINE";
  if (t.includes("fillet table")) return "FILLET_TABLE_LINE";
  if (t.includes("leaning post")) return "BAIT_BOARD_LINE";
  return "OTHER";
}

// Extract a stable model code from handle for display.
function extractModelCode(handle) {
  // Bait Board: bait-board-b01 → B01, bait-board-sk-e09-blk → SK-E09-BLK
  const baitMatch = handle.match(/^bait-board-(.+)$/);
  if (baitMatch) return baitMatch[1].toUpperCase();
  // Fillet Table: seaking-b01-fillet-table → B01, seaking-h10-white-fiberglass-fillet-table → H10-WHITE
  const filletMatch = handle.match(/^seaking-(.+?)-(?:fiberglass-)?fillet-table$/);
  if (filletMatch) return filletMatch[1].toUpperCase();
  // Leaning posts
  if (handle === "bait-boards-leaning-post-top-skl-11") return "LEANING-POST-WHITE";
  if (handle === "leaning-post-top-only-blk") return "LEANING-POST-BLACK";
  // Accessories
  if (handle === "rod-holders" || handle === "seaking-game-rated-rod-holder") return "ROD-HOLDER";
  if (handle === "2-x-game-rated-rod-holders-stainless-steel-316-grade") return "ROD-HOLDER-PAIR";
  if (handle === "pair-of-316-grade-stainless-steel-mounting-legs-and-bases-for-vessel") return "MOUNTING-LEGS";
  if (handle === "seaking-bases-and-legs") return "BASES-LEGS";
  if (handle === "test") return "TEST";
  if (handle.startsWith("upgrades-optional")) return "UPGRADE";
  return null;
}

const lines = audit.map((p) => ({
  ...p,
  model: extractModelCode(p.handle),
  line: classifyLine(p),
}));

// Build pairs from PAIR_MAP for the consolidation report.
console.log(`\n[plan] consolidation pairs (${Object.keys(PAIR_MAP).length} pairs):`);
for (const [filletHandle, canonicalHandle] of Object.entries(PAIR_MAP)) {
  const fillet = lines.find((p) => p.handle === filletHandle);
  const canonical = lines.find((p) => p.handle === canonicalHandle);
  if (fillet && canonical) {
    console.log(`  ✓ ${fillet.model.padEnd(20)} canonical=${canonicalHandle.padEnd(45)} ⇐ deprecate=${filletHandle}`);
  } else {
    console.log(`  ⚠ ${filletHandle} — fillet=${!!fillet} canonical=${!!canonical}`);
  }
}

// ─── Step 2: tag inference ─────────────────────────────────────────────────

function inferTags(p) {
  const tags = new Set();
  const t = p.title.toLowerCase();

  // Mounting type
  if (/skl[-\s]/i.test(p.title) || t.includes("leaning post")) tags.add("leg-mount");
  else if (p.line === "BAIT_BOARD_LINE" || p.line === "FILLET_TABLE_LINE") tags.add("transom-mount");

  // Brand (always)
  tags.add("seaking");

  // Material (default fibreglass for boards)
  if (p.line === "BAIT_BOARD_LINE" || p.line === "FILLET_TABLE_LINE") tags.add("fibreglass");

  // Boat-size suitability based on model code
  if (/JJ-?12|HH-?14|B0[12]\b|SQ-?13/i.test(p.title)) tags.add("for-tinnies");
  if (/JJ-?12|HH-?14|B0[12]\b|SQ-?13|HJ-?15|SK-J07|SK-K08/i.test(p.title)) tags.add("compact");
  if (/B0[34]\b|H10|E09|SKL-/i.test(p.title)) tags.add("for-medium-boats");
  if (/SK-E09|SK-H10|SKL-(L06|S05)/i.test(p.title)) tags.add("for-offshore");

  // Features
  if (t.includes("rod holder")) tags.add("with-rod-holders");
  if (/cup holder/i.test(p.body_html_first_sentence + " " + p.title)) tags.add("with-cup-holders");

  // Colour / finish
  if (/black|blk\b/i.test(p.title)) tags.add("black-gelcoat");
  else if (p.line === "BAIT_BOARD_LINE" || p.line === "FILLET_TABLE_LINE") tags.add("white-gelcoat");

  return [...tags].sort();
}

// ─── Step 3: product type inference ────────────────────────────────────────

function inferProductType(p) {
  if (p.line === "BAIT_BOARD_LINE" || p.line === "FILLET_TABLE_LINE") return "Bait Board";
  if (p.line === "ACCESSORY_ROD_HOLDER") return "Bait Board Accessory";
  if (p.line === "ACCESSORY_LEGS") return "Bait Board Accessory";
  if (p.line === "UPGRADE_VARIANT") return "Bait Board Accessory";
  if (p.line === "TEST") return "";
  return "Bait Board";
}

// ─── Step 4: SEO title and description templates ──────────────────────────

// Truncate at a word boundary without adding ellipsis.
// Google SERP truncation happens visually at ~580 pixels (~60 chars) for titles
// and ~155-160 chars for descriptions, but the full string is still indexed and
// ranks. We just keep it tidy under the safe length without ending mid-word.
function clamp(s, n) {
  return s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "");
}

function proposedSeoTitle(p) {
  if (p.line === "TEST") return "[skip — test product]";
  if (p.line === "FILLET_TABLE_LINE" && p.consolidation === "deprecate") return "[skip — deprecating]";

  const isLegMount = /skl[-\s]|leaning post/i.test(p.title);
  const qualifier = isLegMount ? "Leg-Mount Fibreglass Bait Board" : "Fibreglass Bait Board";
  const brand = "Bait Boards Direct";

  if (p.line === "ACCESSORY_ROD_HOLDER") return clamp(`${p.title} | 316 Stainless | ${brand}`, 60);
  if (p.line === "ACCESSORY_LEGS") return clamp(`${p.title} | 316 Marine Stainless | ${brand}`, 60);
  if (p.line === "UPGRADE_VARIANT") return clamp(`${p.title} | ${brand}`, 60);

  return clamp(`${p.title} | ${qualifier} Australia | ${brand}`, 60);
}

function proposedSeoDescription(p) {
  if (p.line === "TEST") return "[skip — test product]";
  if (p.line === "FILLET_TABLE_LINE" && p.consolidation === "deprecate") return "[skip — deprecating]";

  if (p.line === "ACCESSORY_ROD_HOLDER") {
    return clamp(`Game-rated 316 marine-grade stainless steel rod holder for SeaKing bait boards. Built for marlin, tuna, kingfish drag pressures. Free Australia-wide shipping.`, 155);
  }
  if (p.line === "ACCESSORY_LEGS") {
    return clamp(`Pair of 316 marine-grade stainless steel mounting legs for SeaKing bait boards. Universal fit. Free Australia-wide shipping, 1-year warranty.`, 155);
  }
  if (p.line === "UPGRADE_VARIANT") {
    return clamp(`Optional add-on for SeaKing bait boards — choose mounting legs or extra rod holders. 316 marine stainless. Free Australia-wide shipping.`, 155);
  }

  // Bait boards / leaning posts
  const isLegMount = /skl[-\s]|leaning post/i.test(p.title);
  const mountWord = isLegMount ? "leg-mount" : "premium";
  return clamp(
    `${mountWord} fibreglass bait board with 316 marine stainless hardware, integrated sink, UV-resistant cutting surface. Free Australia-wide shipping, 1-year warranty.`.replace(/^./, (c) => c.toUpperCase()),
    155
  );
}

// ─── Step 5a: first-sentence rewrite for product description ─────────────

function proposedFirstSentenceRewrite(p) {
  if (p.line === "TEST") return "[skip — test product]";
  if (p.line === "FILLET_TABLE_LINE" && p.consolidation === "DEPRECATE_AND_REDIRECT") {
    return "[skip — deprecating, will redirect to canonical]";
  }
  if (p.line === "ACCESSORY_ROD_HOLDER") {
    return `Game-rated 316 marine-grade stainless steel rod holder for SeaKing bait boards in Australia, built to handle marlin, tuna, and kingfish drag pressures.`;
  }
  if (p.line === "ACCESSORY_LEGS") {
    return `Pair of 316 marine-grade stainless steel mounting legs and bases for installing SeaKing bait boards on Australian fishing vessels.`;
  }
  if (p.line === "UPGRADE_VARIANT") {
    return `Optional add-on for SeaKing bait boards — choose between mounting legs or extra game-rated rod holders, both in 316 marine-grade stainless steel.`;
  }

  // Bait Board / leaning post: extract model and dimensions from the title
  const dimMatch = p.title.match(/\((\d{3,4}mm\s*[xX]\s*\d{3,4}mm)\)/i);
  const dims = dimMatch ? dimMatch[1].replace(/\s*[xX]\s*/, " × ").replace(/mm/g, "mm") : null;
  const modelMatch = p.title.match(/(SeaKing\s+(?:Bait Board\s+)?[A-Z0-9-]+)/);
  const model = modelMatch ? modelMatch[1].replace(/^SeaKing\s+Bait Board\s+/, "SeaKing ").trim() : `The ${p.title.split("(")[0].trim()}`;

  const isLegMount = /skl[-\s]|leaning post/i.test(p.title);
  const mountWord = isLegMount ? "leg-mount" : "flat-mount";

  if (dims) {
    return `The ${model} is a ${dims} ${mountWord} fibreglass bait board with 316 marine-grade stainless steel hardware, an integrated sink and drain, and a UV-resistant PE plastic cutting surface — built for Australian saltwater fishing.`;
  }
  return `${model} is a ${mountWord} fibreglass bait board with 316 marine-grade stainless steel hardware, integrated sink, and UV-resistant PE plastic cutting surface — built for Australian saltwater fishing.`;
}

// ─── Step 5c: full body HTML template ────────────────────────────────────

function proposedBodyHtml(p) {
  if (p.line === "TEST") return "";
  if (p.line === "FILLET_TABLE_LINE" && p.consolidation === "DEPRECATE_AND_REDIRECT") {
    // Leave body alone — these products get archived (status=archived) at apply time
    return "";
  }

  // Helpers — derive product attributes
  const dimMatch = p.title.match(/\((\d{3,4}mm\s*[xX]\s*\d{3,4}mm)\)/i);
  const dims = dimMatch ? dimMatch[1].replace(/\s*[xX]\s*/, " × ").replace(/mm/g, "mm") : null;
  const isBlack = /black|blk\b/i.test(p.title);
  const colorWord = isBlack ? "black" : "white";
  const isLegMount = /skl[-\s]|leaning post/i.test(p.title);
  const mountWord = isLegMount ? "leg-mount" : "flat-mount";
  const mountDesc = isLegMount
    ? "Permanent leg-mount on deck or transom shelf"
    : "Transom or gunnel rail flat-mount with stainless brackets";
  const modelMatch = p.title.match(/(SeaKing\s+(?:Bait Board\s+)?[A-Z0-9-]+)/);
  const model = modelMatch ? modelMatch[1].replace(/^SeaKing\s+Bait Board\s+/, "SeaKing ").trim() : `The ${p.title.split("(")[0].trim()}`;
  const tags = (p.proposed_tags || "").split(", ");
  const boatTypes = [];
  if (tags.includes("for-tinnies")) boatTypes.push("tinnies");
  if (tags.includes("for-medium-boats")) boatTypes.push("medium runabouts");
  if (tags.includes("for-offshore")) boatTypes.push("offshore boats");
  const boatTypesStr = boatTypes.length ? boatTypes.join(", ") : "Australian fishing vessels of all sizes";

  // Accessories
  if (p.line === "ACCESSORY_ROD_HOLDER") {
    return `<p>Game-rated 316 marine-grade stainless steel rod holder for SeaKing bait boards in Australia, built to handle marlin, tuna, and kingfish drag pressures.</p>
<h3>Specifications</h3>
<ul>
<li><strong>Material:</strong> 316 marine-grade stainless steel</li>
<li><strong>Compatibility:</strong> SeaKing bait board mounting holes (universal fit)</li>
<li><strong>Rod capacity:</strong> Game-rated for large pelagic fishing</li>
<li><strong>Finish:</strong> Mirror-polished, salt-corrosion resistant</li>
</ul>
<h3>Shipping &amp; warranty</h3>
<p>Free Australia-wide shipping. 1-year manufacturer warranty. Ships from South East Melbourne within 1-3 business days.</p>`;
  }
  if (p.line === "ACCESSORY_LEGS") {
    return `<p>Pair of 316 marine-grade stainless steel mounting legs and bases for installing SeaKing bait boards on Australian fishing vessels.</p>
<h3>Specifications</h3>
<ul>
<li><strong>Material:</strong> 316 marine-grade stainless steel</li>
<li><strong>Compatibility:</strong> Universal — fits all SeaKing bait board models</li>
<li><strong>Includes:</strong> Pair of legs + 2 base brackets + mounting hardware</li>
<li><strong>Finish:</strong> Mirror-polished, salt-corrosion resistant</li>
</ul>
<h3>Shipping &amp; warranty</h3>
<p>Free Australia-wide shipping. 1-year manufacturer warranty.</p>`;
  }
  if (p.line === "UPGRADE_VARIANT") {
    return `<p>Optional add-on for SeaKing bait boards — choose between extra game-rated rod holders or mounting legs, both in 316 marine-grade stainless steel.</p>
<p>This product is an add-on only and is not sold separately from a SeaKing bait board.</p>`;
  }

  // Bait Board / Leaning Post — full structured body
  const opener = dims
    ? `<p>The ${model} is a ${dims} ${mountWord} fibreglass bait board with 316 marine-grade stainless steel hardware, an integrated sink and drain, and a UV-resistant PE plastic cutting surface — built for Australian saltwater fishing.</p>`
    : `<p>${model} is a ${mountWord} fibreglass bait board with 316 marine-grade stainless steel hardware, integrated sink, and UV-resistant PE plastic cutting surface — built for Australian saltwater fishing.</p>`;

  return `${opener}
<h3>Specifications</h3>
<ul>
${dims ? `<li><strong>Dimensions:</strong> ${dims}</li>` : ""}
<li><strong>Construction:</strong> Hand-laminated fibreglass with ${colorWord} gelcoat finish</li>
<li><strong>Hardware:</strong> 316 marine-grade stainless steel rod holders + mounting brackets</li>
<li><strong>Cutting surface:</strong> UV-resistant PE plastic insert</li>
<li><strong>Sink:</strong> Integrated with drain plug</li>
<li><strong>Mount type:</strong> ${mountDesc}</li>
<li><strong>Suitable for:</strong> ${boatTypesStr}</li>
</ul>
<h3>What's included</h3>
<ul>
<li>SeaKing ${p.model || ""} fibreglass bait board</li>
<li>2 × game-rated 316 stainless steel rod holders</li>
<li>Integrated sink with drain plug</li>
<li>Mounting hardware${isLegMount ? " (including stainless legs and base brackets)" : " (stainless brackets for transom or rail mount)"}</li>
</ul>
<h3>Shipping &amp; warranty</h3>
<p>Free Australia-wide shipping. 1-year manufacturer warranty. Ships from South East Melbourne within 1-3 business days.</p>`.replace(/\n<li>\s*<\/li>/g, "");
}

// ─── Step 5b: image filename rename template ─────────────────────────────

function proposedFilename(p, image, index) {
  const fn = image.filename || "";
  // If filename is already descriptive (not a screenshot), keep it
  if (!/^ScreenShot/i.test(fn)) return fn;

  // Build a slug from the product handle + position
  const slug = p.handle.replace(/^bait-board[s]?-/i, "seaking-bait-board-")
    .replace(/^seaking-/i, "seaking-")
    .replace(/-fiberglass-fillet-table$/, "-fiberglass-bait-board");
  const ext = (fn.match(/\.(png|jpg|jpeg|webp|gif)$/i) || ["", "png"])[1].toLowerCase();
  return `${slug}-${index + 1}.${ext}`;
}

// ─── Step 5: alt text template ─────────────────────────────────────────────

function proposedAltText(p, image, index) {
  // Hint from filename — sometimes the screenshot timestamp doesn't help, but if there's "side" / "front" / "angle" we can use it
  const fn = (image.filename || "").toLowerCase();
  let view = "";
  if (/front|main/i.test(fn)) view = "front view";
  else if (/side|profile/i.test(fn)) view = "side view";
  else if (/back|rear/i.test(fn)) view = "back view";
  else if (/angle/i.test(fn)) view = "angle view";
  else if (/detail|close/i.test(fn)) view = "detail";
  else if (/mount|install/i.test(fn)) view = "mounted on boat";
  else if (index === 0) view = "main product photo";
  else view = `view ${index + 1}`;

  // Use product title (without the long "& 2 Game Rated Rod Holders" suffix if present)
  const cleaned = p.title.replace(/\s*&\s*\d+\s*Game Rated Rod Holders\s*/i, "").trim();
  return clamp(`${cleaned} — ${view}`, 125);
}

// ─── Step 6: build the plan ────────────────────────────────────────────────

const plan = lines.map((p) => {
  // Determine consolidation action
  let consolidation = "none";
  let consolidationTarget = "";
  let consolidationNotes = "";

  if (p.line === "FILLET_TABLE_LINE" && PAIR_MAP[p.handle]) {
    const targetHandle = PAIR_MAP[p.handle];
    consolidation = "DEPRECATE_AND_REDIRECT";
    consolidationTarget = targetHandle;
    consolidationNotes = `Imperial-units duplicate of ${targetHandle}. Set status=archived; create 301 redirect /products/${p.handle} → /products/${targetHandle}.`;
  } else if (p.line === "BAIT_BOARD_LINE") {
    const filletPair = Object.entries(PAIR_MAP).find(([_, canonical]) => canonical === p.handle);
    if (filletPair) {
      consolidation = "CANONICAL";
      consolidationTarget = filletPair[0];
      consolidationNotes = `Canonical for model ${p.model}. Receives 301 redirect from /products/${filletPair[0]}.`;
    }
  } else if (p.line === "TEST") {
    consolidation = "DELETE";
    consolidationNotes = `Test product — should be deleted or set to draft/archived.`;
  } else if (p.line === "UPGRADE_VARIANT" && (p.handle === "upgrades-optional-add-on-1733631467365" || p.handle === "upgrades-optional-add-on-1733631328749")) {
    consolidation = "REVIEW";
    consolidationNotes = `Two duplicate "Upgrades" products exist. Likely one was intended; review and consolidate.`;
  }

  p.consolidation = consolidation;

  const proposedTags = inferTags(p).join(", ");
  // Stash on p so proposedBodyHtml can read it
  p.proposed_tags = proposedTags;

  return {
    ...p,
    proposed_seo_title: proposedSeoTitle(p),
    proposed_seo_description: proposedSeoDescription(p),
    proposed_tags: proposedTags,
    proposed_product_type: inferProductType(p),
    proposed_first_sentence: proposedFirstSentenceRewrite(p),
    proposed_body_html: proposedBodyHtml(p),
    proposed_images: (p.images || []).map((img, i) => ({
      id: img.id,
      position: img.position,
      current_alt: img.alt || "",
      current_filename: img.filename,
      proposed_alt: proposedAltText(p, img, i),
      proposed_filename: proposedFilename(p, img, i),
      needs_rename: proposedFilename(p, img, i) !== img.filename,
      needs_alt_set: !img.alt,
      src: img.src,
    })),
    consolidation,
    consolidation_target: consolidationTarget,
    consolidation_notes: consolidationNotes,
  };
});

// ─── Step 7: write CSV + JSON ──────────────────────────────────────────────

function csvEscape(v) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const headers = [
  "row",
  "id",
  "handle",
  "status",
  "current_title",
  "line",
  "model",
  "consolidation",
  "consolidation_target",
  "stock_status",
  "current_seo_title",
  "proposed_seo_title",
  "current_seo_description",
  "proposed_seo_description",
  "current_tags",
  "proposed_tags",
  "current_product_type",
  "proposed_product_type",
  "current_first_sentence",
  "proposed_first_sentence",
  "image_count",
  "alt_text_status",
  "filenames_screenshot_count",
  "consolidation_notes",
];

const rows = plan.map((p, i) => [
  i + 1,
  p.id,
  p.handle,
  p.status,
  p.title,
  p.line,
  p.model || "",
  p.consolidation,
  p.consolidation_target,
  p.is_out_of_stock ? "OUT_OF_STOCK" : `in stock (${p.total_inventory})`,
  p.seo_title_tag || "",
  p.proposed_seo_title,
  p.seo_description_tag || "",
  p.proposed_seo_description,
  p.tags || "",
  p.proposed_tags,
  p.product_type || "",
  p.proposed_product_type,
  p.body_html_first_sentence,
  p.proposed_first_sentence,
  p.image_count,
  p.image_count > 0
    ? p.images.every((i) => i.alt) ? "all set"
      : p.images.some((i) => i.alt) ? "partial" : "none"
    : "n/a",
  p.images.filter((i) => /^ScreenShot/i.test(i.filename)).length,
  p.consolidation_notes,
]);

const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
const csvPath = saveText(`plan-${timestamp()}.csv`, csv);

// Also write a separate image CSV (one row per image) — covers BOTH alt text and filename rename proposals.
const imgHeaders = ["product_id", "product_handle", "image_id", "image_position", "current_alt", "proposed_alt", "current_filename", "proposed_filename", "needs_rename", "needs_alt_set"];
const imgRows = [];
for (const p of plan) {
  for (let i = 0; i < p.images.length; i++) {
    const img = p.images[i];
    const newFilename = proposedFilename(p, img, i);
    imgRows.push([
      p.id,
      p.handle,
      img.id,
      img.position,
      img.alt || "",
      proposedAltText(p, img, i),
      img.filename,
      newFilename,
      newFilename !== img.filename ? "YES" : "no",
      img.alt ? "no" : "YES",
    ]);
  }
}
const imgCsv = [imgHeaders, ...imgRows].map((row) => row.map(csvEscape).join(",")).join("\n");
const altPath = saveText(`plan-images-${timestamp()}.csv`, imgCsv);

// 301 redirects CSV — for each fillet-table → bait-board pair
const redirectHeaders = ["from_path", "to_path", "from_handle", "to_handle", "consolidation_action", "model"];
const redirectRows = plan
  .filter((p) => p.consolidation === "DEPRECATE_AND_REDIRECT" && p.consolidation_target)
  .map((p) => [
    `/products/${p.handle}`,
    `/products/${p.consolidation_target}`,
    p.handle,
    p.consolidation_target,
    "301 redirect",
    p.model || "",
  ]);
const redirectCsv = [redirectHeaders, ...redirectRows].map((row) => row.map(csvEscape).join(",")).join("\n");
const redirectPath = saveText(`plan-redirects-${timestamp()}.csv`, redirectCsv);

// ─── Step 8: propose Shopify collections for landing pages ────────────────
//
// Three Astro landing pages currently use hardcoded handle arrays:
//   /bait-boards-for-tinnies
//   /collections/transom-mount-bait-boards
//   /collections/bait-boards-with-legs (existing)
//
// Once tags are applied, these can become Smart Collections that auto-update.
// The Astro pages then swap from getAllProducts(...).filter() to
// getCollectionByHandle({ handle }).

const collectionPlan = [
  {
    handle: "bait-boards-with-legs",
    title: "Bait Boards with Legs",
    type: "smart",
    rule: "products tagged leg-mount",
    seo_title: "Bait Boards with Legs — Leg-Mount Fibreglass Models Australia | Bait Boards Direct",
    seo_description: "Heavy-duty leg-mount fibreglass bait boards Australia. SeaKing SKL series with integrated mounting legs, 316 marine stainless hardware, generous sinks. Free shipping.",
    target_products: plan
      .filter((p) => p.proposed_tags.split(", ").includes("leg-mount") && p.line === "BAIT_BOARD_LINE")
      .map((p) => p.handle),
    astro_page: "src/pages/collections/bait-boards-with-legs.astro",
    astro_action: "Already exists — replace WITH_LEGS_HANDLES array with getCollectionByHandle call",
  },
  {
    handle: "bait-boards-for-tinnies",
    title: "Bait Boards for Tinnies",
    type: "smart",
    rule: "products tagged for-tinnies",
    seo_title: "Bait Boards for Tinnies — Compact Fibreglass for Small Boats | Bait Boards Direct",
    seo_description: "Compact 600-700mm fibreglass bait boards for tinnies, kayaks, small runabouts. SeaKing range with integrated sinks, free Australia-wide shipping.",
    target_products: plan
      .filter((p) => p.proposed_tags.split(", ").includes("for-tinnies") && p.line === "BAIT_BOARD_LINE")
      .map((p) => p.handle),
    astro_page: "src/pages/bait-boards-for-tinnies.astro",
    astro_action: "Already exists — replace TINNIE_HANDLES array with getCollectionByHandle call",
  },
  {
    handle: "transom-mount-bait-boards",
    title: "Transom Mount Bait Boards",
    type: "smart",
    rule: "products tagged transom-mount",
    seo_title: "Transom & Rail Mount Bait Boards — Fibreglass for Australian Boats | Bait Boards Direct",
    seo_description: "Flat-mount fibreglass bait boards for transom shelf or gunnel rail. SeaKing range, 316 marine stainless hardware. Free Australia-wide shipping.",
    target_products: plan
      .filter((p) => p.proposed_tags.split(", ").includes("transom-mount") && p.line === "BAIT_BOARD_LINE")
      .map((p) => p.handle),
    astro_page: "src/pages/collections/transom-mount-bait-boards.astro",
    astro_action: "Already exists — replace TRANSOM_HANDLES array with getCollectionByHandle call",
  },
];

// Existing collections to update SEO fields on (already in Shopify):
const existingCollectionsToUpdate = [
  {
    handle: "bait-boards",
    title: "Bait Boards",
    type: "existing — update SEO only",
    seo_title: "Bait Boards Australia — Premium Fibreglass Range with Rod Holders | Bait Boards Direct",
    seo_description: "Shop premium fibreglass bait boards in Australia. SeaKing range with integrated sinks, 316 marine stainless rod holders, free Australia-wide shipping.",
  },
  {
    handle: "on-sale",
    title: "On Sale",
    type: "existing — update SEO only",
    seo_title: "Bait Boards on Sale Australia — Discounted Fibreglass Models | Bait Boards Direct",
    seo_description: "Discounted SeaKing fibreglass bait boards. Premium quality at sale prices. Free Australia-wide shipping. While stocks last.",
  },
];

// Write collections CSV
const colHeaders = ["handle", "title", "type", "rule", "seo_title", "seo_description", "target_product_count", "target_products", "astro_page", "astro_action"];
const colRows = [
  ...collectionPlan.map((c) => [
    c.handle, c.title, c.type, c.rule, c.seo_title, c.seo_description,
    c.target_products.length, c.target_products.join("; "),
    c.astro_page, c.astro_action,
  ]),
  ...existingCollectionsToUpdate.map((c) => [
    c.handle, c.title, c.type, "", c.seo_title, c.seo_description,
    "", "",
    "", "Update collection.seo metafields in Shopify admin",
  ]),
];
const colCsv = [colHeaders, ...colRows].map((row) => row.map(csvEscape).join(",")).join("\n");
const colPath = saveText(`plan-collections-${timestamp()}.csv`, colCsv);

console.log("\n[plan] proposed Shopify collections:");
for (const c of collectionPlan) {
  console.log(`  ${c.handle.padEnd(30)} → ${c.target_products.length} products (rule: ${c.rule})`);
  for (const h of c.target_products) console.log(`      • ${h}`);
}

// Save the full plan as JSON for the apply step to consume
const fullPlan = { products: plan, newCollections: collectionPlan, existingCollectionsToUpdate };
const planPath = saveText(`plan-${timestamp()}.json`, JSON.stringify(fullPlan, null, 2));

console.log(`\n[plan] CSV summary:        ${csvPath}`);
console.log(`[plan] Images CSV:         ${altPath}  (alt text + filename rename)`);
console.log(`[plan] Collections CSV:    ${colPath}`);
console.log(`[plan] Redirects CSV:      ${redirectPath}`);
console.log(`[plan] Plan JSON (apply):  ${planPath}`);

// Summary stats
const stats = {
  total: plan.length,
  CANONICAL: plan.filter((p) => p.consolidation === "CANONICAL").length,
  DEPRECATE_AND_REDIRECT: plan.filter((p) => p.consolidation === "DEPRECATE_AND_REDIRECT").length,
  ORPHAN_FILLET_TABLE: plan.filter((p) => p.consolidation === "ORPHAN_FILLET_TABLE").length,
  DELETE: plan.filter((p) => p.consolidation === "DELETE").length,
  REVIEW: plan.filter((p) => p.consolidation === "REVIEW").length,
  none: plan.filter((p) => p.consolidation === "none").length,
};
console.log("\n[plan] consolidation summary:");
for (const [k, v] of Object.entries(stats)) console.log(`  ${k}: ${v}`);
const imagesNeedingRename = imgRows.filter((r) => r[8] === "YES").length;
const imagesNeedingAlt = imgRows.filter((r) => r[9] === "YES").length;
console.log(`\n[plan] total images: ${imgRows.length}`);
console.log(`[plan] images needing filename rename: ${imagesNeedingRename}`);
console.log(`[plan] images needing alt text set: ${imagesNeedingAlt}`);
console.log(`[plan] 301 redirects to create: ${redirectRows.length}`);
const oosCount = plan.filter((p) => p.is_out_of_stock).length;
console.log(`[plan] out-of-stock products (decision needed): ${oosCount}`);
console.log("\n⚠️  NO CHANGES WERE MADE TO SHOPIFY. This is a planning-only run.");
