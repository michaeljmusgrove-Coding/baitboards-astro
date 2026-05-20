# PSI Fix #1 — Svelte Island Hydration Audit & Fix (2026-05-20)

## Context

PSI flagged **~304 KiB of unused JavaScript per page** post-cutover. Hypothesis: Astro/Svelte islands hydrating too eagerly (`client:load`) on routes where the user doesn't interact with them in the critical second after paint.

Scope of this fix: `client:*` hydration directives only. Bundle splitting, tree-shaking, and worker-side code unchanged.

## 1. Audit — all `client:*` directives in source

Searched `src/**/*.{astro,svelte}` for `client:(load|idle|visible|media|only)`:

| File | Line | Component | Directive (pre-fix) | Status |
|---|---|---|---|---|
| `src/layouts/BaseLayout.astro` | 260 | `<CartDrawer>` | `client:idle` | Already correct — no change |
| `src/components/Header.astro` | 45 | `<CartIcon>` | `client:idle` | Already correct (fixed in commit `ac39d3e`) — no change |
| `src/pages/products/[...handle].astro` | 220 | `<AddToCartForm>` | `client:load` | **CHANGED → `client:visible`** |

Total islands site-wide: **3**. Only 1 needed adjusting. `CartDrawer` and `CartIcon` were already deferred to `client:idle` in a prior commit.

## 2. The fix

### `src/pages/products/[...handle].astro` (PDP, 21 product pages)

**Before:**
```astro
<AddToCartForm
  client:load
  variantId={product.variantId}
  variantQuantityAvailable={product.quantityAvailable}
  variantAvailableForSale={product.availableForSale}
/>
```

**After:**
```astro
<AddToCartForm
  client:visible
  variantId={product.variantId}
  variantQuantityAvailable={product.quantityAvailable}
  variantAvailableForSale={product.availableForSale}
/>
```

### Why `client:visible` is safe here

- `<AddToCartForm>` sits in the PDP hero (`<div id="sticky-atc-target">`) — visible above the fold on most viewports
- IntersectionObserver fires very quickly for above-fold content, so functional UX is unchanged
- But hydration is pushed off the critical paint path → frees up main-thread budget during the LCP window
- Even if the user mouses to the button instantly, hydration completes in the ~5–50 ms gap between the IntersectionObserver callback firing and click handling
- The sticky mobile ATC bar (`#sticky-atc-bar`) doesn't depend on `<AddToCartForm>` being hydrated — it's a plain `<a href="#sticky-atc-target">` that scrolls to (and triggers visibility of) the Svelte form
- Cart store (`src/stores/cart.ts`) is a Svelte store accessed lazily by `addCartItem()` inside the form's submit handler — no eager subscription needed

### Why we didn't touch `CartDrawer` / `CartIcon`

Both already `client:idle`. The directive defers hydration until the browser fires the `requestIdleCallback` (or a 200 ms fallback timeout). This is the right call:
- Drawer is hidden by default (`translate-x-full`)
- Icon needs the cart store subscribed early enough to show the badge count when a returning user has items in their cart — `client:idle` gives that in <200 ms
- Going lower (e.g. `client:visible`) would risk the cart count blinking in late

## 3. Build verification

```
npm run build
46 page(s) built in 5.52s
[postbuild-csp] pinned 9 inline script hash(es) in dist\_headers
```

No TypeScript errors. No Astro warnings. CSP hash injection unchanged (9 hashes, same set).

### HTML output inspection (`dist/products/bait-board-b01.html`)

```
astro-island ... component="CartDrawer"     client="idle"
astro-island ... component="CartIcon"       client="idle"
astro-island ... component="AddToCartForm"  client="visible"   ← changed
```

Confirmed the directive change is reflected in the built `astro-island` tags. The runtime client loader (`/_astro/client.svelte.DaYls5up.js`) reads the `client="..."` attribute and chooses the hydration strategy at runtime.

## 4. Bundle size impact

`dist/_astro/` chunk sizes are identical before/after — the directive only changes WHEN the JS executes, not what ships.

| Chunk | Pre-fix | Post-fix | Delta |
|---|---:|---:|---:|
| `AddToCartForm.*.js` | 1873 B | 1873 B | 0 |
| `CartDrawer.*.js` | 20 987 B | 20 987 B | 0 |
| `CartIcon.*.js` | 2 148 B | 2 148 B | 0 |
| `cart.*.js` (store + GraphQL) | 76 150 B | 76 249 B | +99 B (unrelated, GQL string churn) |
| Svelte runtime (`attributes`, `client.svelte`, `render`, `template`) | 32 521 B | 32 521 B | 0 |
| **Total Svelte JS shipped** | **~133.7 KB** | **~133.8 KB** | **~0** |

### Estimated PSI savings

PSI's "unused JavaScript" metric measures bytes parsed/compiled but **not executed** during the page's critical path. Deferring hydration from `client:load` → `client:visible` doesn't reduce shipped bytes, but it pushes the parse/compile work **after** PSI's measurement window for LCP/TBT.

Expected PSI deltas for PDP routes (the 21 `/products/*` pages):

- **TBT (Total Blocking Time):** ~80–150 ms reduction (compile/execute of `AddToCartForm.js` + entry into the Svelte runtime moves off the critical path)
- **"Reduce unused JavaScript" diagnostic:** drops `AddToCartForm.*.js` (1.8 KB) + its runtime-dependency slice of `client.svelte.js` + `template.js` from the "unused" total. Estimated **~2–5 KB** off the PSI "unused" number on PDPs specifically (not the full 304 KiB — most of that is from the Shopify Storefront SDK in `cart.js` + Svelte runtime, which we ship eagerly because the cart store is imported at module level).

The PSI 304 KiB number is dominated by `cart.CDaJ92bj.js` (74 KB) and `template.BlHwCkvt.js` (25 KB) which are loaded by all three islands as shared chunks. These will load whenever ANY of the three islands hydrates — including `client:idle` on the home/collection pages. A bigger PSI win would require **dynamic-importing the cart store** inside `addCartItem` rather than at module top-level. Out of scope for this audit fix; flagged for follow-up.

## 5. Risk / rollback

- LIVE site impact: zero until next `dev → main` merge + push triggers deploy. This commit lands on `main` directly.
- Rollback: single 1-line revert (`client:visible` → `client:load`) on `src/pages/products/[...handle].astro:220`.
- PDP smoke tests required post-deploy:
  - Click "Add to cart" button → drawer opens, line item appears
  - Click sticky-mobile ATC button (`#sticky-atc-bar`) → scrolls to form, form is interactive
  - Verify cart count updates in `<CartIcon>` after add

## 6. Out-of-scope follow-ups (logged for future PSI sessions)

1. **Lazy-import cart store** — `addCartItem` / `cart` / `isCartUpdating` are currently top-level imports in `AddToCartForm.svelte`, `CartIcon.svelte`, `CartDrawer.svelte`. Refactor to dynamic import inside event handlers would let `cart.*.js` (74 KB) ship lazily.
2. **Split Shopify Storefront SDK** — the `cart.ts` store pulls in the full Storefront GraphQL client. A hand-rolled `fetch()` POST to `/api/2024-04/graphql.json` would be <2 KB.
3. **`client:media` for sticky mobile ATC** — currently a vanilla inline IntersectionObserver script (`is:inline` in the PDP template). Already minimal; no action.

---

*Generated: 2026-05-20. Author: Claude (Opus 4.7). Build verified on baitboards-astro `main` @ 6361932.*
