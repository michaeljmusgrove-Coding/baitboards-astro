---
title: Shopify Catalogue Snapshot (2026-05-09)
captured_at: 2026-05-10
purpose: Document the Shopify product catalogue structure so graphify can map products as graph nodes alongside the codebase that serves them.
---

# Shopify Catalogue Snapshot — 2026-05-09

This document is a structured snapshot of the live Bait Boards Direct Shopify catalogue, captured by `scripts/seo/1-audit.mjs`. It documents 41 products across two product lines (Bait Boards and Fillet Tables) and their relationships to the SEO update pipeline.

## Catalogue overview

- **Total products:** 41
- **Active:** 38
- **Out of stock:** 10
- **Test product:** 1 (handle `test`, scheduled for deletion)
- **Duplicate "Upgrades" products:** 2 (need owner consolidation decision)

## Two product lines (each item exists in both)

The catalogue currently has **two parallel listings for the same physical products**:

1. **"Bait Board" line** — metric measurements, AU search vocabulary
2. **"Fillet Table" line** — imperial measurements, US search vocabulary

The SEO plan (`scripts/seo/2-plan.mjs`) treats the Bait Board line as canonical and the Fillet Table line as duplicates to deprecate via 301 redirects.

### 16 consolidation pairs (Bait Board canonical ⇐ Fillet Table duplicate)

| Model | Canonical handle (kept) | Deprecated handle (redirected) |
|---|---|---|
| B01 | `bait-board-b01` | `seaking-b01-fillet-table` |
| B02 | `bait-board-b02` | `seaking-b02-fillet-table` |
| B03 | `bait-board-b03` | `seaking-b03-fiberglass-fillet-table` |
| B04 | `bait-board-b04` | `seaking-b04-fiberglass-fillet-table` |
| JJ-12 | `bait-board-jj-12` | `seaking-jj12-fiberglass-fillet-table` |
| HH-14 | `bait-board-hh-14` | `seaking-hh14-fiberglass-fillet-table` |
| HJ-15 | `bait-board-hj-15` | `seaking-hj15-fiberglass-fillet-table` |
| SQ-13 | `bait-board-sq-13` | `seaking-sq13-fiberglass-fillet-table` |
| SK-H10 white | `bait-board-sk-h10` | `seaking-h10-white-fiberglass-fillet-table` |
| SK-H10 black | `bait-board-sk-h10b` | `seaking-h10-black-fiberglass-fillet-table` |
| SK-E09 white | `bait-board-sk-e09` | `seaking-e09-white-fiberglass-fillet-table` |
| SK-E09 black | `bait-board-sk-e09-blk` | `seaking-e09-black-fiberglass-fillet-table` |
| SK-J07 | `bait-board-sk-j07` | `seaking-j07-fiberglass-fillet-table` |
| SK-K08 | `bait-board-sk-k08-blk` | `seaking-k08-fiberglass-fillet-table` |
| Leaning Post White | `bait-boards-leaning-post-top-skl-11` | `seaking-leaning-post-white-fiberglass-fillet-table` |
| Leaning Post Black | `leaning-post-top-only-blk` | `seaking-leaning-post-black-fiberglass-fillet-table` |

This consolidation is implemented by the `PAIR_MAP` constant in `scripts/seo/2-plan.mjs`, which produces 16 entries in `plan-redirects-2026-05-09.csv`. The `redirects.js` file at the project root contains a programmatic redirect map for runtime path lookup.

## Product types and their inferred categories

The SEO plan generator (`scripts/seo/2-plan.mjs`) assigns proposed product types and tags via the `inferProductType` and `inferTags` functions:

| Inferred product type | Count | Examples |
|---|---|---|
| Bait Board | ~32 | All B01-B04, JJ-12, HH-14, HJ-15, SQ-13, SK series, SKL series, leaning posts |
| Bait Board Accessory | ~7 | 2 x Game Rated Rod Holders, Mounting Legs, SeaKing Bases and Legs |
| Bait Board Component | ~2 | Standalone leaning post tops |

Inferred tags (based on title + handle):
- `seaking` — applied to all SeaKing products
- `fibreglass` — applied to all bait-board-line products
- `transom-mount` — flat-mount boards (B01-B04, JJ-12, HH-14, HJ-15, SQ-13, SK-H10, SK-E09, SK-J07, SK-K08)
- `leg-mount` — SKL series + leaning posts
- `for-tinnies` — compact models (JJ-12, HH-14, B01, B02, SQ-13)
- `for-medium-boats` — mid-range (B03, B04, SK-H10, SK-E09)
- `for-offshore` — premium offshore (SK-E09, SK-H10, SKL-L06, SKL-S05)
- `with-rod-holders` — products with rod holders in title
- `with-cup-holders` — products with cup holders mentioned
- `black-gelcoat` — black variants
- `white-gelcoat` — default white finish

## Smart Collections (proposed)

Three new Smart Collections to create in Shopify (replacing hardcoded handle arrays in Astro pages):

1. **`bait-boards-with-legs`** — rule: tagged `leg-mount` (4 products: SKL-S05, SKL-L06, SKL-11, leaning-post-top-only-blk)
2. **`bait-boards-for-tinnies`** — rule: tagged `for-tinnies` (5 products)
3. **`transom-mount-bait-boards`** — rule: tagged `transom-mount` (14 products)

Once these collections exist, the corresponding Astro pages (`/bait-boards-for-tinnies`, `/collections/transom-mount-bait-boards`, `/collections/bait-boards-with-legs`) will swap their hardcoded handle arrays for live `getCollectionByHandle()` API calls, making the catalogue self-updating.

## Existing collections (already in Shopify)

- `bait-boards` — main collection, 20 products, primary category
- `boat-fillet-table` — second category, 16 products
- `on-sale` — automated (has compare_at_price), 30 products
- `frontpage` — internal Shopify, no public collection page

## Image inventory

- **181 product images** across 41 products
- **104 of 181** have `ScreenShot...png` filenames (need bulk rename)
- **176 of 181** have empty alt text (need bulk alt text)
- The SEO plan (`scripts/seo/2-plan.mjs`) generates proposed alt text and filenames for every image via `proposedAltText` and `proposedFilename` functions

## Connections to the codebase

The product catalogue is referenced by:

- `src/utils/shopify.ts` — `getProductByHandle`, `getCollectionByHandle`, `getAllProducts`, `getProductRecommendations` fetch products via Shopify Storefront API
- `src/utils/graphql.ts` — `productFragment`, `ProductByHandleQuery`, `ProductsQuery`, `ProductRecommendationsQuery`, `CollectionByHandleQuery` define the GraphQL queries
- `src/utils/schemas.ts` — Zod schemas validate Shopify API responses
- `src/components/ProductCard.astro` — renders a single product card in collection grids
- `src/pages/products/[...handle].astro` — dynamic PDP for any product handle
- `src/pages/collections/bait-boards.astro` — main bait boards collection page
- `src/pages/collections/on-sale.astro` — sale collection page
- `src/pages/collections/bait-boards-with-legs.astro` — leg-mount filtered view
- `src/pages/collections/transom-mount-bait-boards.astro` — transom-mount filtered view
- `src/pages/help-me-choose.astro` — quiz form that recommends a product
- `src/pages/help-me-choose/result/[combo].astro` — quiz result pages (27 combinations)
- `src/utils/quiz.ts` — recommendation logic mapping (fishing, boat, rods) → product handle
- `scripts/seo/1-audit.mjs` — fetches the catalogue snapshot via Shopify Admin API
- `scripts/seo/2-plan.mjs` — derives proposed SEO updates from the snapshot
- `scripts/seo/3-pdf-brief.mjs` — generates client-friendly preview brief from the plan

## SEO update pipeline data flow

```
Shopify Admin API
       ↓
1-audit.mjs writes audit-2026-05-09.json (this snapshot)
       ↓
2-plan.mjs reads audit-2026-05-09.json, writes plan-2026-05-09.json
       ↓
3-pdf-brief.mjs reads plan-2026-05-09.json, writes BBD-SEO-Plan-Client-Review.html (then chrome → PDF)
```

This data flow is the structural backbone of the SEO update workflow. `scripts/seo/2-plan.mjs` is the central orchestrator (god node — 14 graph edges) because it sits between audit and brief, calling 10+ helper functions (classifyLine, extractModelCode, inferTags, inferProductType, proposedSeoTitle, proposedSeoDescription, proposedFirstSentenceRewrite, proposedFilename, proposedAltText, csvEscape) plus saveText from lib.mjs.
