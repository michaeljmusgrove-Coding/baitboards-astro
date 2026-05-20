# Pre-SEO Audit — Product Issues at Cutover

**Snapshot:** 2026-05-20 (cutover day, post-rebuild, pre-SEO product update)
**Source:** `scripts/seo/audit-2026-05-20.json` (read-only audit of Shopify Admin API)
**Total products:** 42 (38 active, 4 draft)

## SEO field completeness — pre-update

| Field | Set | Missing | % missing |
|---|---:|---:|---:|
| **SEO title (`global.title_tag` metafield)** | 1 / 42 | 41 | **97.6%** |
| **SEO description (`global.description_tag` metafield)** | 0 / 42 | 42 | **100%** |
| **Product type** | 5 / 42 | 37 | **88.1%** |
| **Tags** | 39 / 42 | 3 | 7.1% |

## Image alt text — pre-update

| Field | Count | % |
|---|---:|---:|
| Products with alt text on **all** images | 2 / 42 | 4.8% |
| Products with alt text on **some** images | 2 / 42 | 4.8% |
| Products with **no** alt text on any image | 38 / 42 | **90.5%** |
| **Total images** | 181 | 100% |
| Images with **screenshot filenames** (`ScreenShot2023-06-...png`) | 104 | **57.5%** |
| Images with semantic filenames | ~66 | ~36.5% |
| Images with generic filenames (`image0.jpg` etc.) | ~8 | ~4.4% |

## Why these matter for SEO

- **Empty SEO title metafield** → Google falls back to the Shopify default `{Product Title} | {Store Name}` template, which is verbose, often >70 chars (SERP-truncated), and ranks for whatever keywords happen to be in the product title alone. Custom `title_tag` lets us inject the high-intent keyword formula `{Model} | {Category} {Country} | {Brand}`.
- **Empty SEO description metafield** → Google generates a description snippet by scraping the body HTML's opening text. For products with empty `body_html` (very common pre-cutover), Google has nothing to work with and may show site-wide fallback or refuse to display a snippet.
- **No image alt text** → Image search invisibility. Also accessibility violation (WCAG 2.2 SC 1.1.1). Image-based product search is a non-trivial inbound funnel for fishing-gear queries.
- **Screenshot filenames** (`ScreenShot2023-06-16at9.14.44am.png`) → Google's image search algorithm uses filename as a secondary ranking signal. A semantic filename (`seaking-bait-board-b01-main.png`) reinforces the product identity; a screenshot timestamp is pure noise.
- **Empty product type** → Affects Shopify's own internal navigation and filterable collection pages. Also feeds into Google Merchant Center / Shopping feed quality.

## Methodology being applied

The SEO update workflow follows a four-step plan-and-apply pattern reusable across the e-commerce portfolio:

1. **`1-audit.mjs`** — read-only baseline of every product's current state via Shopify Admin REST API. Output: `audit-{date}.json`.
2. **`2-plan.mjs`** — generates proposed changes per product from the audit, applying templated SEO best practices (keyword-rich titles, structured body HTML, alt text per image position, semantic filenames). Output: `plan-{date}.json` + CSVs for human review.
3. **`4-apply.mjs`** — applies the planned changes to Shopify via Admin REST API, with mandatory per-product backup (to enable rollback), dry-run by default (writes only with `--confirm`).
4. **`restore.mjs`** — reverts a product to its pre-apply state from any saved backup.

This same pattern will run on Site 2+ in the portfolio to deliver predictable SEO uplift at cutover time.

## Next: apply changes, re-audit, document end-state

After applying the planned changes, a post-state audit will be captured at `scripts/seo/whitepaper/audit-post-seo-2026-05-20.json` and the comparison report at `scripts/seo/whitepaper/results-post-seo-2026-05-20.md`.
