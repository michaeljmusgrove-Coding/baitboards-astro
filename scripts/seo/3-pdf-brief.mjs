// Generate a client-friendly PDF brief from the SEO plan.
// Renders to HTML first, then user converts to PDF via Chrome headless.
//
// Run: node scripts/seo/3-pdf-brief.mjs

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { saveText, SCRIPT_DIR, PROJECT_ROOT } from "./lib.mjs";

const planPath = join(SCRIPT_DIR, "plan-2026-05-09.json");
const fullPlan = JSON.parse(readFileSync(planPath, "utf8"));
const products = fullPlan.products;
const newCollections = fullPlan.newCollections;
const existingCollections = fullPlan.existingCollectionsToUpdate;

console.log(`[pdf-brief] loaded ${products.length} products from plan`);

// Resize Shopify CDN images via URL params: ?width=300
function shopifyImg(src, width = 300) {
  if (!src) return "";
  // Shopify image URLs end like ...filename.png?v=12345
  // We add &width= or replace existing ?width=
  if (src.includes("?")) return `${src}&width=${width}`;
  return `${src}?width=${width}`;
}

function esc(s) {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Categorise products for the brief
const canonicalProducts = products.filter((p) => p.consolidation === "CANONICAL");
const orphanBaitBoards = products.filter((p) => p.line === "BAIT_BOARD_LINE" && p.consolidation === "none");
const accessoryProducts = products.filter((p) => p.line === "ACCESSORY_ROD_HOLDER" || p.line === "ACCESSORY_LEGS");
const deprecateProducts = products.filter((p) => p.consolidation === "DEPRECATE_AND_REDIRECT");
const reviewProducts = products.filter((p) => p.consolidation === "REVIEW" || p.consolidation === "DELETE");
const outOfStockProducts = products.filter((p) => p.is_out_of_stock && p.consolidation !== "DEPRECATE_AND_REDIRECT");

const allProductsForFullReview = [...canonicalProducts, ...orphanBaitBoards, ...accessoryProducts];

// ─── Build per-product card HTML ───────────────────────────────────────────

function diffCell(current, proposed, opts = {}) {
  const { skipIfSame = true, label = "" } = opts;
  const cur = current || "(empty)";
  const prop = proposed || "(empty)";
  const same = (current || "") === (proposed || "");
  if (same && skipIfSame) {
    return `<div class="diff-row diff-unchanged"><div class="diff-label">${label}</div><div class="diff-current">${esc(cur)}</div><div class="diff-arrow">→</div><div class="diff-proposed">no change</div></div>`;
  }
  const proposedClass = current ? "diff-proposed-changed" : "diff-proposed-new";
  return `<div class="diff-row"><div class="diff-label">${label}</div><div class="diff-current">${esc(cur)}</div><div class="diff-arrow">→</div><div class="diff-proposed ${proposedClass}">${esc(prop)}</div></div>`;
}

function productCard(p) {
  const firstImg = p.images && p.images[0];
  const imgSrc = firstImg ? shopifyImg(firstImg.src, 320) : "";

  return `
    <div class="product-card">
      <div class="product-card-header">
        <div class="product-card-image">
          ${imgSrc ? `<img src="${imgSrc}" alt="${esc(p.title)}" />` : '<div class="img-placeholder">No image</div>'}
        </div>
        <div class="product-card-meta">
          <div class="stag">${esc(p.line.replace(/_/g, " "))}</div>
          <h3>${esc(p.title)}</h3>
          <div class="product-meta-grid">
            <span><strong>Handle:</strong> /products/${esc(p.handle)}</span>
            <span><strong>Status:</strong> ${esc(p.status)}</span>
            <span><strong>Stock:</strong> ${p.is_out_of_stock ? '<span class="badge-warn">OUT OF STOCK</span>' : `${p.total_inventory} in stock`}</span>
            <span><strong>Images:</strong> ${p.image_count}</span>
          </div>
        </div>
      </div>

      <div class="changes-block">
        <div class="changes-block-label">Search Engine Listing</div>
        ${diffCell(p.seo_title_tag, p.proposed_seo_title, { label: "SEO Title (in Google search results)" })}
        ${diffCell(p.seo_description_tag, p.proposed_seo_description, { label: "Meta Description (snippet under the title)" })}
      </div>

      <div class="changes-block">
        <div class="changes-block-label">Product Description</div>
        ${diffCell(p.body_html_first_sentence, p.proposed_first_sentence, { label: "First sentence (Google often quotes this)" })}
      </div>

      <div class="changes-block">
        <div class="changes-block-label">Internal Categorisation</div>
        ${diffCell(p.tags || "", p.proposed_tags, { label: "Tags (organise products by feature)" })}
        ${diffCell(p.product_type || "", p.proposed_product_type, { label: "Product Type" })}
      </div>

      ${p.image_count > 0 ? `
        <div class="changes-block">
          <div class="changes-block-label">Image Optimisation</div>
          <div class="diff-row">
            <div class="diff-label">Image alt text (helps Google understand photos)</div>
            <div class="diff-current">${p.images.every((i) => i.alt) ? "All set" : p.images.some((i) => i.alt) ? "Partial" : '<span class="badge-warn">None set</span>'}</div>
            <div class="diff-arrow">→</div>
            <div class="diff-proposed diff-proposed-changed">Set on all ${p.image_count} images</div>
          </div>
          <div class="diff-row">
            <div class="diff-label">Image filenames</div>
            <div class="diff-current">${p.images.filter((i) => /^ScreenShot/i.test(i.filename)).length} of ${p.image_count} are auto-generated screenshot names</div>
            <div class="diff-arrow">→</div>
            <div class="diff-proposed diff-proposed-changed">Renamed to descriptive product slugs</div>
          </div>
        </div>` : ""}
    </div>
  `;
}

function consolidationPair(canonicalProduct, deprecateProduct) {
  const cImg = canonicalProduct.images?.[0];
  const dImg = deprecateProduct.images?.[0];
  return `
    <div class="pair-card">
      <div class="pair-grid">
        <div class="pair-side pair-side-keep">
          <div class="pair-tag pair-tag-keep">KEEP — canonical</div>
          ${cImg ? `<img src="${shopifyImg(cImg.src, 220)}" alt="${esc(canonicalProduct.title)}" />` : ""}
          <div class="pair-title">${esc(canonicalProduct.title)}</div>
          <div class="pair-handle">/products/${esc(canonicalProduct.handle)}</div>
        </div>
        <div class="pair-arrow">←</div>
        <div class="pair-side pair-side-deprecate">
          <div class="pair-tag pair-tag-deprecate">ARCHIVE — duplicate</div>
          ${dImg ? `<img src="${shopifyImg(dImg.src, 220)}" alt="${esc(deprecateProduct.title)}" />` : ""}
          <div class="pair-title">${esc(deprecateProduct.title)}</div>
          <div class="pair-handle">/products/${esc(deprecateProduct.handle)}</div>
        </div>
      </div>
      <div class="pair-action">
        Anyone visiting <code>/products/${esc(deprecateProduct.handle)}</code> is automatically forwarded to <code>/products/${esc(canonicalProduct.handle)}</code>. No customer is lost.
      </div>
    </div>
  `;
}

// Build pair list
const pairs = canonicalProducts
  .map((c) => {
    const d = deprecateProducts.find((dp) => dp.consolidation_target === c.handle);
    return d ? { canonical: c, deprecate: d } : null;
  })
  .filter(Boolean);

// ─── HTML template ─────────────────────────────────────────────────────────

const html = `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8" />
<title>Bait Boards Direct — SEO Update Plan for Approval</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

:root {
  --teal: #00D4AA;
  --teal-dark: #007D63;
  --teal-bright: #00E8BF;
  --blue: #4A7AFF;
  --blue-dark: #2A56E0;
  --warn: #FFB347;
  --warn-text: #D97706;
  --text: #000000;
  --sub: #1a1a1a;
  --muted: #4B5563;
  --border: rgba(0,0,0,0.10);
  --border2: rgba(0,0,0,0.18);
  --kept-bg: rgba(0,212,170,0.06);
  --kept-border: rgba(0,212,170,0.30);
  --deprecate-bg: rgba(217,119,6,0.06);
  --deprecate-border: rgba(217,119,6,0.30);
  --new-bg: rgba(74,122,255,0.06);
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

@page { size: A4; margin: 14mm 12mm; }
html { font-size: 10pt; }
body {
  background: #ffffff;
  color: var(--text);
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 400;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.page { page-break-after: always; }
.page:last-child { page-break-after: auto; }

/* ── Cover ── */
.cover {
  height: 270mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}
.cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 60% at 5% 90%, rgba(0,212,170,0.12) 0%, transparent 55%),
    radial-gradient(ellipse 40% 50% at 95% 5%, rgba(74,122,255,0.10) 0%, transparent 50%);
  z-index: 0;
}
.cover > * { position: relative; z-index: 1; }

.cover-stripe {
  display: flex; align-items: center; gap: 14px;
  font-family: 'DM Mono', monospace;
  font-size: 10pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--teal-dark);
  margin-bottom: 25mm;
}
.cover-stripe::before {
  content: ''; display: inline-block;
  width: 28px; height: 3px;
  background: linear-gradient(90deg, var(--teal), var(--blue));
  border-radius: 2px;
}

.cover h1 {
  font-size: 38pt; font-weight: 900;
  letter-spacing: -0.03em; line-height: 1.05;
  margin-bottom: 10mm;
}
.cover h1 .accent {
  background: linear-gradient(90deg, var(--teal-dark), var(--blue));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.cover-sub {
  font-size: 13pt; color: var(--sub);
  max-width: 70%; line-height: 1.55;
  margin-bottom: auto;
}
.cover-meta {
  display: grid; grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--border);
  padding-top: 14px; margin-top: 25mm;
}
.cover-meta-item {
  font-family: 'DM Mono', monospace;
  border-right: 1px solid var(--border);
  padding: 0 16px;
}
.cover-meta-item:first-child { padding-left: 0; }
.cover-meta-item:last-child { border-right: none; padding-right: 0; }
.cover-meta-label {
  font-size: 8pt; letter-spacing: 0.16em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 3px;
}
.cover-meta-val { font-size: 10pt; font-weight: 500; }

/* ── Sections ── */
.stag {
  display: inline-block;
  font-family: 'DM Mono', monospace;
  font-size: 9pt;
  letter-spacing: 0.20em;
  text-transform: uppercase;
  color: var(--teal-dark);
  margin-bottom: 6px;
}
.stag.bl { color: var(--blue-dark); }
.stag.wn { color: var(--warn-text); }

h2 {
  font-size: 22pt; font-weight: 800;
  line-height: 1.1; letter-spacing: -0.025em;
  color: var(--text);
  margin-bottom: 5mm; padding-bottom: 8px;
  border-bottom: 2px solid var(--text);
}
h3 {
  font-size: 13pt; font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 6mm; margin-bottom: 3mm;
  display: flex; align-items: center; gap: 10px;
}
h3::before {
  content: ''; display: inline-block;
  width: 18px; height: 2px;
  background: linear-gradient(90deg, var(--teal), var(--blue));
  border-radius: 1px;
}
h4 {
  font-size: 11pt; font-weight: 700;
  margin-top: 4mm; margin-bottom: 2mm;
}

p {
  font-size: 10.5pt; line-height: 1.65;
  margin-bottom: 4mm;
}
p strong { font-weight: 700; }

ul {
  list-style: none; margin: 4mm 0 6mm 0; padding: 0;
}
ul li {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 10.5pt; line-height: 1.55;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid var(--border);
  border-left: 3px solid var(--teal);
  border-radius: 0 8px 8px 0;
  margin-bottom: 4px;
}
ul li::before {
  content: '\\2713';
  color: var(--teal-dark); font-weight: 700; font-size: 9pt;
  flex-shrink: 0; margin-top: 2px;
  width: 16px; height: 16px;
  background: rgba(0,212,170,0.12);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.tldr {
  background: #ffffff;
  border: 2px solid var(--text);
  border-radius: 14px;
  padding: 14px 18px;
  margin: 5mm 0;
}
.tldr-label {
  font-family: 'DM Mono', monospace;
  font-size: 9pt; letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--teal-dark); margin-bottom: 6px;
}
.tldr p { margin: 0; font-size: 11pt; font-weight: 500; }

.callout {
  background: #ffffff;
  border: 1px solid var(--border);
  border-left: 4px solid var(--blue);
  border-radius: 0 10px 10px 0;
  padding: 10px 16px;
  margin: 4mm 0;
}
.callout.warn { border-left-color: var(--warn-text); background: rgba(217,119,6,0.04); }
.callout.ok { border-left-color: var(--teal-dark); background: rgba(0,212,170,0.04); }
.callout p { margin: 0; font-size: 10pt; }

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5mm;
  margin: 4mm 0;
}
.card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 16px;
  position: relative;
  overflow: hidden;
}
.card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--teal), var(--blue));
}
.card h4 { font-size: 11pt; font-weight: 800; margin: 4px 0 6px 0; }
.card p { font-size: 9.5pt; line-height: 1.55; margin: 0; color: var(--text); }

/* ── Stat bar ── */
.stat-bar {
  background: #000000;
  padding: 16px 22px;
  border-radius: 14px;
  margin: 5mm 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.stat-item { padding: 0 16px; border-right: 1px solid rgba(255,255,255,0.12); }
.stat-item:first-child { padding-left: 0; }
.stat-item:last-child { border-right: none; padding-right: 0; }
.stat-val {
  font-size: 22pt; font-weight: 900;
  line-height: 1; letter-spacing: -0.03em;
  color: var(--teal-bright); margin-bottom: 4px;
}
.stat-val.blue { color: var(--blue); }
.stat-val.warn { color: var(--warn); }
.stat-label { font-size: 9pt; font-weight: 700; color: #ffffff; margin-bottom: 2px; }
.stat-sub {
  font-size: 8pt; color: rgba(255,255,255,0.55);
  font-family: 'DM Mono', monospace; letter-spacing: 0.04em;
}

/* ── Tables ── */
table {
  width: 100%;
  border-collapse: separate; border-spacing: 0;
  margin: 4mm 0 6mm 0;
  border-radius: 10px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  font-size: 9.5pt;
  border: 1px solid var(--border);
}
table thead tr { background: #000000; }
table thead th {
  font-family: 'DM Mono', monospace;
  font-size: 8.5pt; letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.85);
  padding: 10px 12px;
  text-align: left;
  font-weight: 500;
}
table tbody td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}
table tbody tr:last-child td { border-bottom: none; }
table tbody td:first-child { font-weight: 600; }

/* ── Product cards ── */
.product-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  margin-bottom: 6mm;
  page-break-inside: avoid;
  position: relative;
}
.product-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--teal), var(--blue));
  border-radius: 14px 14px 0 0;
}

.product-card-header {
  display: grid;
  grid-template-columns: 90px 1fr;
  gap: 14px;
  padding-bottom: 10px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border);
}
.product-card-image {
  width: 90px; height: 90px;
  border-radius: 8px;
  background: #f7f7f7;
  overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--border);
}
.product-card-image img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.img-placeholder {
  font-size: 8pt; color: var(--muted); font-family: 'DM Mono', monospace;
}
.product-card-meta h3 {
  margin: 4px 0 6px 0;
  font-size: 12pt; font-weight: 800;
  border: none; padding-bottom: 0;
}
.product-card-meta h3::before { display: none; }
.product-meta-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 4px 16px;
  font-size: 9pt; color: var(--muted);
}
.product-meta-grid strong { color: var(--text); font-weight: 600; }

.changes-block {
  margin: 8px 0;
  padding: 8px 10px;
  background: #fafafa;
  border-radius: 8px;
}
.changes-block-label {
  font-family: 'DM Mono', monospace;
  font-size: 8.5pt; letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--teal-dark);
  margin-bottom: 5px;
}
.diff-row {
  display: grid;
  grid-template-columns: 145px 1fr 18px 1fr;
  gap: 8px;
  align-items: start;
  padding: 5px 0;
  font-size: 9.5pt;
  line-height: 1.45;
  border-bottom: 1px dashed var(--border);
}
.diff-row:last-child { border-bottom: none; }
.diff-label {
  font-size: 8.5pt;
  font-weight: 600; color: var(--muted);
  padding-right: 4px;
}
.diff-current {
  color: var(--muted);
  font-size: 9pt;
}
.diff-arrow {
  text-align: center;
  color: var(--teal-dark);
  font-weight: 700;
  font-size: 11pt;
}
.diff-proposed {
  color: var(--text);
  font-weight: 500;
}
.diff-proposed-new {
  color: var(--teal-dark);
  font-weight: 600;
  background: var(--kept-bg);
  padding: 2px 6px;
  border-radius: 4px;
}
.diff-proposed-changed {
  color: var(--blue-dark);
  font-weight: 600;
  background: var(--new-bg);
  padding: 2px 6px;
  border-radius: 4px;
}
.diff-unchanged .diff-current,
.diff-unchanged .diff-proposed {
  color: var(--muted);
  font-style: italic;
}

.badge-warn {
  display: inline-block;
  background: rgba(217,119,6,0.15);
  color: var(--warn-text);
  padding: 1px 6px;
  border-radius: 4px;
  font-size: 8.5pt;
  font-weight: 600;
}

/* ── Pair cards (consolidation) ── */
.pair-card {
  background: #ffffff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 6mm;
  page-break-inside: avoid;
}
.pair-grid {
  display: grid;
  grid-template-columns: 1fr 30px 1fr;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.pair-side {
  background: var(--kept-bg);
  border: 1px solid var(--kept-border);
  border-radius: 10px;
  padding: 10px;
  text-align: center;
}
.pair-side-deprecate {
  background: var(--deprecate-bg);
  border-color: var(--deprecate-border);
}
.pair-side img {
  width: 100%; max-width: 140px;
  height: 100px; object-fit: cover;
  border-radius: 6px;
  margin-bottom: 6px;
}
.pair-tag {
  font-family: 'DM Mono', monospace;
  font-size: 8pt; letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}
.pair-tag-keep { color: var(--teal-dark); }
.pair-tag-deprecate { color: var(--warn-text); }
.pair-title {
  font-size: 9pt; font-weight: 600;
  line-height: 1.3;
  margin-bottom: 4px;
}
.pair-handle {
  font-family: 'DM Mono', monospace;
  font-size: 8pt;
  color: var(--muted);
}
.pair-arrow {
  text-align: center; font-size: 18pt;
  color: var(--teal-dark);
  font-weight: 800;
}
.pair-action {
  font-size: 9pt;
  background: #fafafa;
  padding: 6px 10px;
  border-radius: 6px;
  border-left: 3px solid var(--teal);
  color: var(--text);
  line-height: 1.5;
}
.pair-action code {
  font-family: 'DM Mono', monospace;
  font-size: 8.5pt;
  background: #ffffff;
  padding: 1px 4px;
  border-radius: 3px;
  border: 1px solid var(--border);
}

/* ── Approval block ── */
.approval-block {
  background: #000000;
  color: #ffffff;
  border-radius: 14px;
  padding: 22px 26px;
  margin: 6mm 0;
}
.approval-block h2 {
  color: #ffffff; border: none;
  font-size: 18pt; margin-bottom: 4mm; padding-bottom: 0;
}
.approval-block p { color: rgba(255,255,255,0.85); font-size: 10.5pt; margin-bottom: 4mm; }
.approval-block strong { color: var(--teal-bright); }
.signoff-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 8mm;
  margin-top: 6mm;
  padding-top: 6mm;
  border-top: 1px solid rgba(255,255,255,0.20);
}
.signoff-box {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 16px;
  min-height: 80px;
}
.signoff-label {
  font-family: 'DM Mono', monospace;
  font-size: 9pt; letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 30px;
}
.signoff-line {
  border-bottom: 1px solid rgba(255,255,255,0.4);
  margin-bottom: 8px;
}
.signoff-caption {
  font-family: 'DM Mono', monospace;
  font-size: 8pt;
  color: rgba(255,255,255,0.5);
}

.doc-footer {
  font-family: 'DM Mono', monospace;
  font-size: 8pt;
  color: var(--muted);
  text-align: center;
  padding: 4mm 0 2mm 0;
  border-top: 1px solid var(--border);
  margin-top: 6mm;
}

@media print {
  body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .pair-card, .product-card, .stat-bar, .approval-block, table, .callout, .tldr {
    page-break-inside: avoid;
  }
  h2, h3 { page-break-after: avoid; }
}
</style>
</head>
<body>

<!-- ═══════════════ COVER ═══════════════ -->
<div class="page cover">
  <div>
    <div class="cover-stripe">SEO Update Plan · Bait Boards Direct</div>
    <h1>
      Your Catalogue,<br>
      <span class="accent">Optimised for Google.</span><br>
      Reviewed Before<br>
      Anything Changes.
    </h1>
    <p class="cover-sub">
      A plain-English review of every proposed change to your Shopify products. 41 products, 181 product photos, 16 duplicate listings consolidated, 3 new auto-updating collections, 16 redirects to set up. Nothing happens until you sign off.
    </p>
  </div>

  <div class="cover-meta">
    <div class="cover-meta-item">
      <div class="cover-meta-label">Prepared for</div>
      <div class="cover-meta-val">Harry — Founder, Bait Boards Direct</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Date</div>
      <div class="cover-meta-val">May 2026</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Document type</div>
      <div class="cover-meta-val">SEO Plan Review &amp; Sign-Off</div>
    </div>
  </div>
</div>

<!-- ═══════════════ SECTION 1 — WHAT THIS IS ═══════════════ -->
<div class="page">
  <div class="stag">Section 01 · The Short Version</div>
  <h2>What This Document Is</h2>

  <div class="tldr">
    <div class="tldr-label">In one sentence</div>
    <p>
      This is a complete preview of every change we'd like to make to your 41 Shopify products to help them rank better in Google. <strong>Nothing has been changed yet.</strong> You review each proposed change, approve or skip what you want, and we apply only what you sign off.
    </p>
  </div>

  <h3>Why now</h3>
  <p>
    Right now, your 41 product listings on Shopify are missing most of the things Google needs to rank them well. We checked every product and found:
  </p>
  <ul>
    <li><strong>0 of 41</strong> products have a custom search-engine description (the snippet that appears under the title in Google)</li>
    <li><strong>1 of 41</strong> products has a custom search-engine title</li>
    <li><strong>176 of 181</strong> product photos have no description (Google can't understand them)</li>
    <li><strong>104 of 181</strong> photos have unhelpful filenames like <code>ScreenShot2023-06-16at9.14.44am.png</code></li>
    <li><strong>16 products are duplicates</strong> — the same physical bait board listed twice (once as "Bait Board", once as "Fillet Table")</li>
  </ul>

  <h3>What this fixes</h3>
  <p>
    The proposed changes do four things, and they compound:
  </p>

  <div class="grid-2">
    <div class="card">
      <h4>1. Tell Google what each product is</h4>
      <p>Every product gets a custom search title, description, category, and tags. So when someone searches "fibreglass bait board with rod holders", Google knows your listings match.</p>
    </div>
    <div class="card">
      <h4>2. Help Google read your photos</h4>
      <p>Every product photo gets a description (alt text). The 104 screenshot filenames get renamed to descriptive product slugs. Google Images becomes a real traffic source.</p>
    </div>
    <div class="card">
      <h4>3. Remove the duplicate listings</h4>
      <p>16 duplicate "Fillet Table" listings get archived and automatically forwarded to the matching "Bait Board" page. Google stops penalising you for duplicate content.</p>
    </div>
    <div class="card">
      <h4>4. Auto-organise your products</h4>
      <p>Three new self-updating collections get created (Tinnies, Transom-Mount, Leg-Mount). Add a new product with the right tag, it auto-appears on the right page.</p>
    </div>
  </div>

  <div class="callout ok">
    <p><strong>Safety:</strong> Before any change is applied, we save a complete backup of every product's current state. If anything goes wrong, we can roll back in under a minute. Your live site stays online throughout.</p>
  </div>
</div>

<!-- ═══════════════ SECTION 2 — THE NUMBERS ═══════════════ -->
<div class="page">
  <div class="stag bl">Section 02 · The Numbers</div>
  <h2>What's Changing, At a Glance</h2>

  <div class="stat-bar">
    <div class="stat-item">
      <div class="stat-val">41</div>
      <div class="stat-label">Products reviewed</div>
      <div class="stat-sub">Full Shopify catalogue</div>
    </div>
    <div class="stat-item">
      <div class="stat-val blue">${pairs.length}</div>
      <div class="stat-label">Duplicate pairs</div>
      <div class="stat-sub">Consolidated to one</div>
    </div>
    <div class="stat-item">
      <div class="stat-val">181</div>
      <div class="stat-label">Photos updated</div>
      <div class="stat-sub">Alt text + filenames</div>
    </div>
    <div class="stat-item">
      <div class="stat-val warn">3</div>
      <div class="stat-label">Decisions for you</div>
      <div class="stat-sub">See section 6</div>
    </div>
  </div>

  <h3>Summary table</h3>
  <table>
    <thead>
      <tr>
        <th>Change category</th>
        <th>Count</th>
        <th>What happens</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Products getting custom SEO title</td><td>${products.filter((p) => !p.proposed_seo_title.startsWith("[skip")).length}</td><td>The title that appears in Google search results</td></tr>
      <tr><td>Products getting meta description</td><td>${products.filter((p) => !p.proposed_seo_description.startsWith("[skip")).length}</td><td>The snippet under the title in Google</td></tr>
      <tr><td>Products getting tags</td><td>${products.filter((p) => p.proposed_tags && p.proposed_tags.length > 0).length}</td><td>Internal labels (invisible to customers, used for filtering)</td></tr>
      <tr><td>Products getting product type</td><td>${products.filter((p) => p.proposed_product_type).length}</td><td>"Bait Board" / "Bait Board Accessory"</td></tr>
      <tr><td>Photos getting alt text</td><td>176</td><td>Photo descriptions for Google + screen readers</td></tr>
      <tr><td>Photos getting renamed</td><td>104</td><td>Replace ScreenShot... with descriptive product slugs</td></tr>
      <tr><td>Duplicate products archived</td><td>${pairs.length}</td><td>Old "Fillet Table" listings hidden from public site</td></tr>
      <tr><td>Automatic redirects (301) created</td><td>${pairs.length}</td><td>Old URLs forward to canonical pages — no customer lost</td></tr>
      <tr><td>New Smart Collections created</td><td>${newCollections.length}</td><td>Self-updating: tagged products auto-appear</td></tr>
      <tr><td>Existing collections updated</td><td>${existingCollections.length}</td><td>Bait Boards + On Sale get keyword-rich SEO fields</td></tr>
    </tbody>
  </table>

  <div class="callout">
    <p><strong>Time to apply, once approved:</strong> ~10 minutes of automated API work. Your live site rebuilds within 90 seconds of completion. Customers see no downtime.</p>
  </div>
</div>

<!-- ═══════════════ SECTION 3 — DUPLICATE CONSOLIDATION ═══════════════ -->
<div class="page">
  <div class="stag wn">Section 03 · Duplicate Listings</div>
  <h2>Merging the ${pairs.length} Duplicate Pairs</h2>

  <p>
    Right now, you have <strong>${pairs.length} pairs</strong> of products that are physically the same item but listed twice on Shopify — once with metric measurements titled "Bait Board", once with imperial measurements titled "Fillet Table". Google sees them as duplicate content, which hurts both pages' rankings.
  </p>
  <p>
    The fix: keep the "Bait Board" version (which matches how Australians actually search), archive the "Fillet Table" version, and set up an automatic redirect so anyone visiting the old URL is forwarded to the new one. <strong>No customer is lost. No SEO equity is lost.</strong>
  </p>
</div>

${pairs.map((pair) => `
<div class="page">
  ${consolidationPair(pair.canonical, pair.deprecate)}
</div>
`).join("")}

<!-- ═══════════════ SECTION 4 — PER-PRODUCT CHANGES ═══════════════ -->
<div class="page">
  <div class="stag">Section 04 · Per-Product Updates</div>
  <h2>Every Active Product, Before vs After</h2>

  <p>
    The next ${allProductsForFullReview.length} pages show every product that's staying live, with the current state and the proposed update for each SEO field. The "Fillet Table" duplicates are not shown here — they're being archived per Section 03.
  </p>

  <div class="callout">
    <p><strong>How to read these:</strong> The grey text on the left is what's there now. The coloured text on the right is what we propose. <strong>Green = brand new (no current value)</strong>. <strong>Blue = changing from existing.</strong> "no change" rows show fields that are already optimal.</p>
  </div>
</div>

${allProductsForFullReview.map((p) => `
<div class="page">
  ${productCard(p)}
</div>
`).join("")}

<!-- ═══════════════ SECTION 5 — NEW COLLECTIONS ═══════════════ -->
<div class="page">
  <div class="stag bl">Section 05 · New Auto-Updating Collections</div>
  <h2>${newCollections.length} New Collections in Shopify</h2>

  <p>
    These three collections power three landing pages on the new website. Right now, those pages have hardcoded product lists — meaning if you add a new product, it doesn't auto-appear. After this update, the collections in Shopify do the work: tag a new product correctly and it appears on the matching landing page within ~90 seconds (no developer needed).
  </p>

  ${newCollections.map((c) => `
    <div class="card" style="margin-bottom: 5mm;">
      <h4>${esc(c.title)} <code style="font-family: 'DM Mono', monospace; font-size: 9pt; color: var(--muted); font-weight: normal; padding-left: 8px;">/collections/${esc(c.handle)}</code></h4>
      <p style="margin-bottom: 6px;"><strong>Auto-includes:</strong> ${esc(c.rule)}</p>
      <p style="margin-bottom: 6px;"><strong>Currently matches:</strong> ${c.target_products.length} products</p>
      <p style="margin-bottom: 6px;"><strong>SEO title:</strong> ${esc(c.seo_title)}</p>
      <p style="margin-bottom: 6px;"><strong>SEO description:</strong> ${esc(c.seo_description)}</p>
      <p style="margin: 0;"><strong>Backs the page:</strong> <code style="font-family: 'DM Mono', monospace; font-size: 9pt;">${esc(c.astro_page)}</code></p>
    </div>
  `).join("")}

  <h3>Plus — 2 existing collections get keyword-rich SEO fields</h3>

  ${existingCollections.map((c) => `
    <div class="card" style="margin-bottom: 4mm;">
      <h4>${esc(c.title)} <code style="font-family: 'DM Mono', monospace; font-size: 9pt; color: var(--muted); font-weight: normal; padding-left: 8px;">/collections/${esc(c.handle)}</code></h4>
      <p style="margin-bottom: 4px;"><strong>SEO title:</strong> ${esc(c.seo_title)}</p>
      <p style="margin: 0;"><strong>SEO description:</strong> ${esc(c.seo_description)}</p>
    </div>
  `).join("")}
</div>

<!-- ═══════════════ SECTION 6 — DECISIONS NEEDED ═══════════════ -->
<div class="page">
  <div class="stag wn">Section 06 · Decisions Needed</div>
  <h2>3 Things Only You Can Decide</h2>

  <p>
    Most of the plan is mechanical and doesn't need your input. These three things do:
  </p>

  <div class="callout warn">
    <p><strong>Decision 1 — The "test" product</strong></p>
    <p style="margin-top: 6px;">There is a product titled simply <code>test</code> live in your Shopify catalogue. It looks like a development leftover. The plan currently says <strong>delete it</strong>. Confirm or change to <strong>archive only</strong> if you want to keep it for any reason.</p>
  </div>

  <div class="callout warn">
    <p><strong>Decision 2 — Two duplicate "Upgrades (Optional Add on)" products</strong></p>
    <p style="margin-top: 6px;">There are two products with the same title — handles <code>upgrades-optional-add-on-1733631467365</code> and <code>upgrades-optional-add-on-1733631328749</code>. Likely one was created by accident. Tell us which to keep and which to archive.</p>
  </div>

  <div class="callout warn">
    <p><strong>Decision 3 — ${outOfStockProducts.length} out-of-stock products</strong></p>
    <p style="margin-top: 6px;">${outOfStockProducts.length} products are currently out of stock. For each, decide one of:</p>
    <p style="margin-top: 4px;"><strong>(a) Keep visible with "Sold Out" badge</strong> — recommended if restock is expected (preserves SEO equity).</p>
    <p style="margin-top: 4px;"><strong>(b) Archive (hide from sitemap)</strong> — recommended if discontinued.</p>
    <p style="margin-top: 4px;"><strong>(c) Delete permanently</strong> — only if absolutely certain it won't return.</p>
  </div>

  ${outOfStockProducts.length > 0 ? `
    <h3>Out-of-stock products</h3>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Handle</th>
          <th>Decision</th>
        </tr>
      </thead>
      <tbody>
        ${outOfStockProducts.map((p) => `
          <tr>
            <td>${esc(p.title)}</td>
            <td><code style="font-family: 'DM Mono', monospace; font-size: 8.5pt;">${esc(p.handle)}</code></td>
            <td>☐ Keep · ☐ Archive · ☐ Delete</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  ` : ""}
</div>

<!-- ═══════════════ SECTION 7 — APPROVAL ═══════════════ -->
<div class="page">
  <div class="stag">Section 07 · Sign-Off</div>
  <h2>Your Approval</h2>

  <p>
    By signing below, you authorise Bait Boards Direct's developer to apply the plan as described in this document, with the answers you've provided to the three decisions in Section 6.
  </p>

  <p>
    Once applied, all changes appear on your live site within ~2 minutes. The original Shopify state is backed up, so any change can be rolled back if needed.
  </p>

  <div class="approval-block">
    <h2>Approved Scope</h2>
    <p>I confirm I've reviewed this document and approve the plan to proceed with these scope items:</p>

    <ul style="margin: 4mm 0;">
      <li style="background: rgba(255,255,255,0.04); border-left-color: var(--teal); color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.10);"><span style="background: rgba(0,212,170,0.15); color: var(--teal-bright);">☐</span> All per-product SEO updates (titles, descriptions, tags, product types, alt text)</li>
      <li style="background: rgba(255,255,255,0.04); border-left-color: var(--teal); color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.10);"><span style="background: rgba(0,212,170,0.15); color: var(--teal-bright);">☐</span> Image filename renames (104 photos)</li>
      <li style="background: rgba(255,255,255,0.04); border-left-color: var(--teal); color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.10);"><span style="background: rgba(0,212,170,0.15); color: var(--teal-bright);">☐</span> Duplicate consolidation (${pairs.length} pairs archived + redirected)</li>
      <li style="background: rgba(255,255,255,0.04); border-left-color: var(--teal); color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.10);"><span style="background: rgba(0,212,170,0.15); color: var(--teal-bright);">☐</span> 3 new Smart Collections + 2 existing collection SEO updates</li>
      <li style="background: rgba(255,255,255,0.04); border-left-color: var(--teal); color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.10);"><span style="background: rgba(0,212,170,0.15); color: var(--teal-bright);">☐</span> Decisions in Section 6 (out-of-stock products, test product, upgrades duplicates)</li>
    </ul>

    <div class="signoff-grid">
      <div class="signoff-box">
        <div class="signoff-label">Approved by</div>
        <div class="signoff-line"></div>
        <div class="signoff-caption">Harry — Founder, Bait Boards Direct</div>
      </div>
      <div class="signoff-box">
        <div class="signoff-label">Date</div>
        <div class="signoff-line"></div>
        <div class="signoff-caption">DD / MM / YYYY</div>
      </div>
    </div>
  </div>

  <div class="doc-footer">
    Bait Boards Direct · SEO Update Plan · Generated 2026-05-09 · Source: scripts/seo/plan-2026-05-09.json
  </div>
</div>

</body>
</html>`;

const htmlPath = "C:/Users/micha/code/baitboards/BBD-SEO-Plan-Client-Review.html";
saveText("../../../baitboards/BBD-SEO-Plan-Client-Review.html", html);
console.log(`[pdf-brief] HTML written to ${htmlPath}`);
console.log(`[pdf-brief] Generate PDF with:`);
console.log(`  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless --disable-gpu --print-to-pdf="C:/Users/micha/code/baitboards/BBD-SEO-Plan-Client-Review.pdf" --no-pdf-header-footer --print-to-pdf-no-header "file:///${htmlPath}"`);
