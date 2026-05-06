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

  // Shopify account pages — no account system in Astro build
  { fromPrefix: '/account', to: '/', status: 301 },

  // Shopify blog — no blog in Astro build (store has no published blog)
  { fromPrefix: '/blogs',   to: '/', status: 301 },
];

export function matchRedirect(pathname) {
  // Exact match first
  const exact = redirects.find((r) => r.from === pathname);
  if (exact) return exact;
  // Prefix match (fromPrefix must match start of pathname, followed by / or end)
  return redirects.find((r) => r.fromPrefix && (pathname === r.fromPrefix || pathname.startsWith(r.fromPrefix + '/'))) ?? null;
}
