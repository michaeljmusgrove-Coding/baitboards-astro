import { z } from "zod";
import { CartResult, ProductResult, CollectionResult } from "./schemas";
import { config } from "./config";
import {
  ProductsQuery,
  ProductByHandleQuery,
  CreateCartMutation,
  AddCartLinesMutation,
  GetCartQuery,
  RemoveCartLinesMutation,
  ProductRecommendationsQuery,
  CollectionByHandleQuery,
} from "./graphql";

// Make a request to Shopify's GraphQL API  and return the data object from the response body as JSON data.
const makeShopifyRequest = async (
  query: string,
  variables: Record<string, unknown> = {},
  buyerIP: string = ""
) => {
  const isSSR = import.meta.env.SSR;
  const apiUrl = `https://${config.shopifyShop}/api/${config.apiVersion}/graphql.json`;

  function getOptions() {
    const { privateShopifyAccessToken, publicShopifyAccessToken } = config;
    const options = {
      method: "POST",
      headers: {},
      body: JSON.stringify({ query, variables }),
    };

    // Use the private token path only when a distinct delegate token is configured.
    // Headless channel tokens are public tokens — sending them as Shopify-Storefront-Private-Token
    // returns 403 ACCESS_DENIED. Fall through to the public header in that case.
    if (
      isSSR &&
      privateShopifyAccessToken &&
      privateShopifyAccessToken !== publicShopifyAccessToken
    ) {
      options.headers = {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": privateShopifyAccessToken,
        "Shopify-Storefront-Buyer-IP": buyerIP,
      };
      return options;
    }

    options.headers = {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": publicShopifyAccessToken,
    };
    return options;
  }

  const response = await fetch(apiUrl, getOptions());

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${response.status} ${body}`);
  }

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
  }

  return json.data;
};

// ─── Normalized product type ─────────────────────────────────────────────────
// Flat shape used by all pages. Prices are plain AUD numbers; use formatPrice().

export type NormalizedProduct = {
  handle: string;
  shopifyId: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  image2?: string;
  description: string;
  variantId: string;
  availableForSale: boolean;
  quantityAvailable: number;
  seo?: {
    title: string | null;
    description: string | null;
  };
};

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
  }).format(amount);
}

type RawProduct = NonNullable<z.infer<typeof ProductResult>>;

function normalizeProduct(raw: RawProduct): NormalizedProduct {
  const v0 = raw.variants.nodes[0];
  const price = v0 ? parseFloat(v0.price.amount) : 0;
  const compareAtRaw = v0?.compareAtPrice
    ? parseFloat(v0.compareAtPrice.amount)
    : null;
  const imgs = raw.images.nodes.filter(
    (n): n is NonNullable<typeof n> => n !== null
  );
  return {
    handle: raw.handle,
    shopifyId: raw.id.split('/').pop() ?? '',
    title: raw.title,
    price,
    compareAtPrice: compareAtRaw && compareAtRaw > price ? compareAtRaw : null,
    image: raw.featuredImage?.url ?? imgs[0]?.url ?? "",
    image2: imgs[1]?.url,
    description: raw.description ?? "",
    variantId: v0?.id ?? "",
    availableForSale: raw.availableForSale ?? false,
    quantityAvailable: v0?.quantityAvailable ?? 99,
    seo: raw.seo
      ? {
          title: raw.seo.title ?? null,
          description: raw.seo.description ?? null,
        }
      : undefined,
  };
}

// ─── Build-time catalogue helpers ────────────────────────────────────────────

export const getAllProducts = async (
  limit = 250
): Promise<NormalizedProduct[]> => {
  const data = await makeShopifyRequest(ProductsQuery, { first: limit });
  const raw = data.products.edges.map((e: any) => e.node);
  const parsed = z.array(ProductResult).parse(raw);
  return parsed
    .filter((p): p is RawProduct => p !== null)
    .map(normalizeProduct);
};

export const getCollectionByHandle = async (options: {
  handle: string;
  limit?: number;
  buyerIP?: string;
}): Promise<NormalizedProduct[]> => {
  const { handle, limit = 250, buyerIP = "" } = options;
  const data = await makeShopifyRequest(
    CollectionByHandleQuery,
    { handle, first: limit },
    buyerIP
  );
  const parsed = CollectionResult.parse(data.collection);
  if (!parsed) return [];
  return parsed.products.nodes
    .filter((p): p is RawProduct => p !== null)
    .map(normalizeProduct);
};

// Fetches the collection's products AND its metadata (title, SEO fields).
// Use on collection landing pages so the rendered <title> / <meta description>
// match the Shopify-side SEO title_tag / description_tag metafields
// (managed via scripts/seo/5-apply-collections.mjs).
export type CollectionWithMeta = {
  title: string;
  description: string;
  seo: { title: string | null; description: string | null };
  products: NormalizedProduct[];
};

export const getCollectionWithMeta = async (options: {
  handle: string;
  limit?: number;
  buyerIP?: string;
}): Promise<CollectionWithMeta | null> => {
  const { handle, limit = 250, buyerIP = "" } = options;
  const data = await makeShopifyRequest(
    CollectionByHandleQuery,
    { handle, first: limit },
    buyerIP
  );
  const parsed = CollectionResult.parse(data.collection);
  if (!parsed) return null;
  return {
    title: parsed.title,
    description: parsed.description || "",
    seo: {
      title: parsed.seo?.title ?? null,
      description: parsed.seo?.description ?? null,
    },
    products: parsed.products.nodes
      .filter((p): p is RawProduct => p !== null)
      .map(normalizeProduct),
  };
};

// ─── Legacy per-product helpers ──────────────────────────────────────────────

// Get all products or a limited number of products (default: 10)
export const getProducts = async (options: {
  limit?: number;
  buyerIP: string;
}) => {
  const { limit = 10, buyerIP } = options;

  const data = await makeShopifyRequest(
    ProductsQuery,
    { first: limit },
    buyerIP
  );
  const { products } = data;

  if (!products) {
    throw new Error("No products found");
  }

  const productsList = products.edges.map((edge: any) => edge.node);
  const ProductsResult = z.array(ProductResult);
  const parsedProducts = ProductsResult.parse(productsList);

  return parsedProducts;
};

// Get a product by its handle (slug)
export const getProductByHandle = async (options: {
  handle: string;
  buyerIP: string;
}) => {
  const { handle, buyerIP } = options;

  const data = await makeShopifyRequest(
    ProductByHandleQuery,
    { handle },
    buyerIP
  );
  const { product } = data;

  const parsedProduct = ProductResult.parse(product);

  return parsedProduct;
};

export const getProductRecommendations = async (options: {
  productId: string;
  buyerIP: string;
}) => {
  const { productId, buyerIP } = options;
  const data = await makeShopifyRequest(
    ProductRecommendationsQuery,
    {
      productId,
    },
    buyerIP
  );
  const { productRecommendations } = data;

  const ProductsResult = z.array(ProductResult);
  const parsedProducts = ProductsResult.parse(productRecommendations);

  return parsedProducts;
};

// Create a cart and add a line item to it and return the cart object
export const createCart = async (id: string, quantity: number) => {
  const data = await makeShopifyRequest(CreateCartMutation, { id, quantity });
  const { cartCreate } = data;
  const { cart } = cartCreate;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Add a line item to an existing cart (by ID) and return the updated cart object
export const addCartLines = async (
  id: string,
  merchandiseId: string,
  quantity: number
) => {
  const data = await makeShopifyRequest(AddCartLinesMutation, {
    cartId: id,
    merchandiseId,
    quantity,
  });
  const { cartLinesAdd } = data;
  const { cart } = cartLinesAdd;

  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Remove line items from an existing cart (by IDs) and return the updated cart object
export const removeCartLines = async (id: string, lineIds: string[]) => {
  const data = await makeShopifyRequest(RemoveCartLinesMutation, {
    cartId: id,
    lineIds,
  });
  const { cartLinesRemove } = data;
  const { cart } = cartLinesRemove;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};

// Get a cart by its ID and return the cart object
export const getCart = async (id: string) => {
  const data = await makeShopifyRequest(GetCartQuery, { id });

  const { cart } = data;
  const parsedCart = CartResult.parse(cart);

  return parsedCart;
};
