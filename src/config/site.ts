export const site = {
  name: "Bait Boards Direct",
  shortName: "BBD",
  tagline: "Premium Bait Boards for Serious Anglers",
  description:
    "Bait Boards Direct supplies high-quality bait boards, rod holders, and fishing accessories for Australian recreational and professional anglers.",
  domain: "https://www.baitboardsdirect.com",
  shopifyDomain: "baitboardsdirect.myshopify.com",
  ogImage: "/og-default.jpg",
  brandColor: "#272d45",

  contact: {
    phone: "__TODO__",
    email: "__TODO__",
    address: "__TODO__",
    suburb: "__TODO__",
    state: "__TODO__",
    postcode: "__TODO__",
    country: "AU",
  },

  social: {
    instagram: "__TODO__",
    facebook: "__TODO__",
    youtube: "__TODO__",
  },

  analytics: {
    gtm: "GTM-MMB4D7LX",
    ga4: "__TODO__",
    clarityId: "nzuy3xur33",
    okendoStoreId: "__TODO__",
  },

  seo: {
    googleVerification: "z2rC57o-AS-KbpyoHXeY-rZGYTYZlRKznqPXn_M9wz4",
  },

  schema: {
    type: "OnlineStore",
    currenciesAccepted: "AUD",
    paymentAccepted: "Credit Card, PayPal, Afterpay",
    priceRange: "$$",
  },
} as const;

export type Site = typeof site;
