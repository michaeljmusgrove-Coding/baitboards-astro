/**
 * Programmatic redirect map — populated from content audit (6 May 2026).
 * Exact entries: { from: '/path', to: '/new-path', status: 301 }
 * Prefix entries: { fromPrefix: '/prefix', to: '/new-path', status: 301 }
 */
const redirects = [
  // Shopify /pages/* → flat routes
  { from: '/pages/about-us',             to: '/about',                      status: 301 },
  { from: '/pages/contact',              to: '/contact',                    status: 301 },
  { from: '/pages/faqs',                 to: '/faqs',                       status: 301 },
  { from: '/pages/privacy-policy',       to: '/privacy-policy',             status: 301 },
  { from: '/pages/return-refund-policy', to: '/returns',                    status: 301 },
  { from: '/pages/shipping-policy',      to: '/shipping',                   status: 301 },
  { from: '/pages/terms-of-service',     to: '/terms',                      status: 301 },

  // Shopify collections not present in Astro build
  { from: '/collections/boat-fillet-table',          to: '/collections/bait-boards', status: 301 },
  { from: '/collections/black-friday-early-access-sale', to: '/collections/on-sale', status: 301 },
  { from: '/collections/all',                        to: '/collections/bait-boards', status: 301 },
  { from: '/collections/frontpage',                  to: '/',                        status: 301 },

  // Sitemap conventional path — crawlers expect /sitemap.xml
  { from: '/sitemap.xml', to: '/sitemap-index.xml', status: 301 },

  // Shopify system pages with no equivalent
  { from: '/cart',     to: '/', status: 301 },
  { from: '/search',   to: '/collections/bait-boards', status: 301 },
  { from: '/password', to: '/', status: 301 },

  // Help-me-choose quiz removed 2026-05-20 (CRO audit — quiz output noise
  // until per-product recommendation logic is properly defined).
  // Catch any inbound traffic + GSC-cached URLs.
  { fromPrefix: '/help-me-choose', to: '/collections/bait-boards', status: 301 },

  // Shopify account pages — no account system in Astro build
  { fromPrefix: '/account', to: '/', status: 301 },

  // Shopify blog — no blog in Astro build (store has no published blog)
  { fromPrefix: '/blogs',   to: '/', status: 301 },

  // Legacy SeaKing product handles (pre-rename to bait-board-* short handles).
  // Shopify auto-redirected these while it owned the domain; once the CF
  // Worker owns baitboardsdirect.com, those auto-redirects no longer fire —
  // these explicit 301s preserve inbound links + indexed URLs. Mapping
  // confirmed against live Shopify product list (2026-05-18).
  { from: '/products/seaking-b01-fillet-table',                              to: '/products/bait-board-b01',                       status: 301 },
  { from: '/products/seaking-b02-fillet-table',                              to: '/products/bait-board-b02',                       status: 301 },
  { from: '/products/seaking-b03-fiberglass-fillet-table',                   to: '/products/bait-board-b03',                       status: 301 },
  { from: '/products/seaking-b04-fiberglass-fillet-table',                   to: '/products/bait-board-b04',                       status: 301 },
  { from: '/products/seaking-jj12-fiberglass-fillet-table',                  to: '/products/bait-board-jj-12',                     status: 301 },
  { from: '/products/seaking-hh14-fiberglass-fillet-table',                  to: '/products/bait-board-hh-14',                     status: 301 },
  { from: '/products/seaking-hj15-fiberglass-fillet-table',                  to: '/products/bait-board-hj-15',                     status: 301 },
  { from: '/products/seaking-sq13-fiberglass-fillet-table',                  to: '/products/bait-board-sq-13',                     status: 301 },
  { from: '/products/seaking-j07-fiberglass-fillet-table',                   to: '/products/bait-board-sk-j07',                    status: 301 },
  { from: '/products/seaking-k08-fiberglass-fillet-table',                   to: '/products/bait-board-sk-k08-blk',                status: 301 },
  { from: '/products/seaking-h10-white-fiberglass-fillet-table',             to: '/products/bait-board-sk-h10',                    status: 301 },
  { from: '/products/seaking-h10-black-fiberglass-fillet-table',             to: '/products/bait-board-sk-h10b',                   status: 301 },
  { from: '/products/seaking-e09-white-fiberglass-fillet-table',             to: '/products/bait-board-sk-e09',                    status: 301 },
  { from: '/products/seaking-e09-black-fiberglass-fillet-table',             to: '/products/bait-board-sk-e09-blk',                status: 301 },
  { from: '/products/seaking-leaning-post-white-fiberglass-fillet-table',    to: '/products/bait-boards-leaning-post-top-skl-11',  status: 301 },
  { from: '/products/seaking-leaning-post-black-fiberglass-fillet-table',    to: '/products/leaning-post-top-only-blk',            status: 301 },
];

export function matchRedirect(pathname) {
  // Exact match first
  const exact = redirects.find((r) => r.from === pathname);
  if (exact) return exact;
  // Prefix match (fromPrefix must match start of pathname, followed by / or end)
  return redirects.find((r) => r.fromPrefix && (pathname === r.fromPrefix || pathname.startsWith(r.fromPrefix + '/'))) ?? null;
}
