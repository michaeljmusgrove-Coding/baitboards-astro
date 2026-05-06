export const site = {
  name: "Bait Boards Direct",
  shortName: "BBD",
  tagline: "Premium Bait Boards for Serious Anglers",
  description:
    "Bait Boards Direct supplies high-quality bait boards, rod holders, and fishing accessories for Australian recreational and professional anglers.",
  domain: "https://www.baitboardsdirect.com",
  shopifyDomain: "baitboardsdirect.myshopify.com",
  ogImage: "/images/hero-marina.jpg",
  brandColor: "#272d45",

  contact: {
    phone: "0474 332 034",
    email: "info@baitboardsdirect.com.au",
    address: "__TODO__",
    suburb: "South East Melbourne",
    state: "VIC",
    postcode: "__TODO__",
    country: "AU",
  },

  social: {
    instagram: "__TODO__",
    facebook: "__TODO__",
    youtube: "__TODO__",
  },

  analytics: {
    ga4: "__TODO__",
    clarityId: "nzuy3xur33",
    okendoStoreId: "__TODO__",
  },

  seo: {
    googleVerification: "z2rC57o-AS-KbpyoHXeY-rZGYTYZlRKznqPXn_M9wz4",
  },

  schema: {
    type: "SportingGoodsStore",
    currenciesAccepted: "AUD",
    paymentAccepted: "Credit Card, PayPal, Afterpay",
    priceRange: "$$",
  },
} as const;

export type Site = typeof site;
