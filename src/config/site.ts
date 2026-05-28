export const site = {
  name: "Bait Boards Direct",
  shortName: "BBD",
  tagline: "Premium Bait Boards for Serious Anglers",
  description:
    "Bait Boards Direct supplies high-quality bait boards, rod holders, and fishing accessories for Australian recreational and professional anglers.",
  domain: "https://baitboardsdirect.com",
  shopifyDomain: "baitboardsdirect.myshopify.com",
  ogImage: "/images/hero-marina.webp",
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
    facebook: "https://www.facebook.com/p/Bait-Boards-Direct-100092450230150/",
  },

  analytics: {
    ga4: "G-GTL98BHGVW",
    clarityId: "nzuy3xur33",
    judgemeShopDomain: "d26601.myshopify.com",
  },

  seo: {
    googleVerification: "z2rC57o-AS-KbpyoHXeY-rZGYTYZlRKznqPXn_M9wz4",
  },

  founder: {
    name: "Harry",
    jobTitle: "Founder & Marine Composite Specialist",
    description:
      "Founder of Bait Boards Direct and a fibreglass boat builder with over 20 years of hands-on experience in marine composite construction. Specialises in composite lamination, transom and floor installation, gelcoat application, and finishing — the same materials and craftsmanship that go into every SeaKing bait board he supplies.",
    knowsAbout: [
      "Fibreglass boat building",
      "Composite lamination",
      "Marine-grade stainless hardware",
      "Bait board design and installation",
      "Recreational and offshore fishing",
      "Gelcoat finishing",
    ],
  },

  schema: {
    // OnlineStore is a valid Schema.org subtype of Organization (added 2022).
    // Correct primary type for an online-only retailer with no shopfront — avoids the
    // address-required signal that LocalBusiness subtypes (e.g. SportingGoodsStore) carry.
    type: "OnlineStore",
    currenciesAccepted: "AUD",
    paymentAccepted: "Credit Card, PayPal, Afterpay",
    priceRange: "$$",
  },
} as const;

export type Site = typeof site;
