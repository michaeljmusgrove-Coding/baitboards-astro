// GA4 Enhanced Ecommerce dataLayer helpers.
// Closes the funnel-inversion finding from the Day 3 GA4 audit
// (add_to_cart 1 < begin_checkout 4 < purchase 5 was structurally impossible —
// root cause was the Astro storefront not pushing the events that Shopify
// Custom Pixel was pushing checkout-side). Wiring these 6 events on the
// browse + cart side restores a measurable funnel and unblocks A/B testing.
//
// Currency is hardcoded AUD because the store is AU-only headless;
// re-evaluate when the NZ market expansion ships.

export interface GA4Item {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_brand?: string;
  item_category?: string;
  index?: number;
  item_list_id?: string;
  item_list_name?: string;
}

interface GA4DataLayer {
  push: (event: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    dataLayer?: GA4DataLayer;
  }
}

function push(event: string, payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || ([] as unknown as GA4DataLayer);
  // GA4 spec — `ecommerce` MUST be reset to null before any subsequent ecom event
  // so the payload from the previous event doesn't carry over (GTM/gtag.js otherwise
  // merges and creates phantom items).
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce: payload });
}

export function viewItem(item: GA4Item, value?: number): void {
  push('view_item', {
    currency: 'AUD',
    value: value ?? item.price ?? 0,
    items: [item],
  });
}

export function viewItemList(items: GA4Item[], listId: string, listName: string): void {
  push('view_item_list', {
    item_list_id: listId,
    item_list_name: listName,
    items: items.map((it, i) => ({ ...it, index: i, item_list_id: listId, item_list_name: listName })),
  });
}

export function selectItem(item: GA4Item, listId: string, listName: string): void {
  push('select_item', {
    item_list_id: listId,
    item_list_name: listName,
    items: [{ ...item, item_list_id: listId, item_list_name: listName }],
  });
}

export function addToCart(item: GA4Item, value?: number): void {
  push('add_to_cart', {
    currency: 'AUD',
    value: value ?? (item.price ?? 0) * (item.quantity ?? 1),
    items: [item],
  });
}

export function removeFromCart(item: GA4Item, value?: number): void {
  push('remove_from_cart', {
    currency: 'AUD',
    value: value ?? (item.price ?? 0) * (item.quantity ?? 1),
    items: [item],
  });
}

export function viewCart(items: GA4Item[], value: number): void {
  push('view_cart', {
    currency: 'AUD',
    value,
    items,
  });
}
