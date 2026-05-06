// Static product catalogue — sourced from baitboardsdirect.myshopify.com/products.json (2026-05-06).
// Used for pre-credential builds; swap for live Shopify Storefront API in Week 1.

const CDN = 'https://cdn.shopify.com/s/files/1/0779/7529/0172/files';

export interface Product {
  handle: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string;
  image2?: string;
  description: string;
  variantId: string;
  collections: string[];
}

export const products: Product[] = [
  {
    handle: 'bait-board-b01',
    title: 'SeaKing Bait Board B01 (650mm x 430mm) & 2 Game Rated Rod Holders',
    price: 550,
    compareAtPrice: 1100,
    image: `${CDN}/ScreenShot2023-06-16at9.14.44am.png?v=1686871362`,
    image2: `${CDN}/ScreenShot2023-06-16at9.14.56am.png?v=1686871362`,
    description: 'The SeaKing SK-B01 is a classic fiberglass bait board designed for durability and functionality on the water. Crafted with premium composite materials, it features a UV resistant PE plastic cutting board, a built-in sink with drain for convenient storage, and robust 316 marine grade stainless steel hardware. Ideal for anglers seeking a reliable and practical bait board solution.',
    variantId: 'gid://shopify/ProductVariant/49207450272060',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-b02',
    title: 'SeaKing Bait Board B02 (650mm x 430mm) & 2 Game Rated Rod Holders',
    price: 575,
    compareAtPrice: 1150,
    image: `${CDN}/bait-board-b02-4.png?v=1725592095`,
    image2: `${CDN}/ScreenShot2023-06-16at11.54.54am.png?v=1725592878`,
    description: 'The SeaKing SK-B02 is identical to our traditional B01 and B03 models but enhanced with integrated moulded cup holders for added convenience. Experience the same quality craftsmanship and functionality of our classic models, now with the luxury of built-in cup holders, perfect for enjoying your time on the water with added comfort and practicality.',
    variantId: 'gid://shopify/ProductVariant/49209924157756',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-b03',
    title: 'SeaKing Bait Board B03 (830mm x 430mm) & 2 Game Rated Rod Holders',
    price: 625,
    compareAtPrice: 1250,
    image: `${CDN}/ScreenShot2023-06-16at11.58.03am.png?v=1686880755`,
    image2: `${CDN}/ScreenShot2023-06-16at11.58.10am.png?v=1686880755`,
    description: 'Crafted for anglers who appreciate tradition and quality, the SeaKing SK-B03 fiberglass bait board features a UV resistant PE plastic cutting board, a convenient sink with drain for storage, and robust 316 marine grade stainless steel hardware. Meticulously handmade using top-grade composite materials for durability and reliability on the water.',
    variantId: 'gid://shopify/ProductVariant/49211385479484',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-b04',
    title: 'SeaKing Bait Board B04 (830mm x 430mm) & 2 Game Rated Rod Holders',
    price: 700,
    compareAtPrice: 850,
    image: `${CDN}/bait-board-b04.png?v=1725592095`,
    image2: `${CDN}/bait-board-b04-4.png?v=1725592095`,
    description: 'The SeaKing SK-B04 offers the same robust features as our classic B01 and B03 models, now enhanced with integrated moulded cup holders for added convenience. Designed for those who appreciate functionality with a touch of luxury — ensuring you have everything you need for a successful fishing trip, with the practicality of built-in cup holders for added comfort on the water.',
    variantId: 'gid://shopify/ProductVariant/49211422015804',
    collections: ['bait-boards', 'on-sale'],
  },
  {
    handle: 'bait-board-sk-h10',
    title: 'SeaKing Bait Board H10 (830mm x 400mm)',
    price: 632,
    compareAtPrice: 1280,
    image: `${CDN}/bait-board-h10-10.png?v=1725592075`,
    image2: `${CDN}/bait-board-h10-5.png?v=1725592075`,
    description: 'The SeaKing SK-H10 is a premium fiberglass bait board, handcrafted from full composite materials. Featuring a UV-resistant PE plastic cutting board, a large integrated sink and drain, with optional rod holders and cup holders for added versatility. A spacious rear knife tray keeps tools within easy reach.',
    variantId: 'gid://shopify/ProductVariant/49211657355580',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-h10b',
    title: 'SeaKing Bait Board H10B (830mm x 400mm)',
    price: 585,
    compareAtPrice: 1170,
    image: `${CDN}/ScreenShot2023-06-16at2.16.18pm.png?v=1686889032`,
    image2: `${CDN}/ScreenShot2023-06-16at2.16.23pm.png?v=1686889032`,
    description: 'The SeaKing SK-H10B is the black gelcoat variant of our premium H10 lineup. Crafted with high-quality composite materials, featuring a UV-resistant PE plastic surface. Includes a generously sized sink with drain fitting and hose. The rear boasts a spacious knife tray, maximising cutting space while minimising onboard footprint.',
    variantId: 'gid://shopify/ProductVariant/49211688223036',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-hh-14',
    title: 'SeaKing Bait Board HH-14 (625mm x 390mm)',
    price: 495,
    compareAtPrice: 990,
    image: `${CDN}/ScreenShot2023-06-16at2.23.26pm.png?v=1686889496`,
    image2: `${CDN}/ScreenShot2023-06-16at2.23.32pm.png?v=1686889495`,
    description: 'The SeaKing HH-14 is a compact version of our SeaKing H-10, offering the luxury of built-in cup holders on each side. This model also features a knife compartment and a spacious sink compartment. Designed as a high-end board suitable for both large and small vessels, constructed from premium composite materials with a UV-resistant PE plastic cutting board.',
    variantId: 'gid://shopify/ProductVariant/50023517847868',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-hj-15',
    title: 'SeaKing Bait Board HJ-15 (700mm x 415mm)',
    price: 525,
    compareAtPrice: 1050,
    image: `${CDN}/bait-board-hj15.png?v=1725592075`,
    image2: `${CDN}/ScreenShot2023-06-16at2.29.42pm.png?v=1725597456`,
    description: 'The SeaKing HJ-15 builds on the SK-J07 with the added luxury of integrated cup holders, a large sink, and a dedicated knife compartment. Made of full composite material of the highest quality with a UV resistant PE plastic cutting board — everything you need for efficient bait prep on the water.',
    variantId: 'gid://shopify/ProductVariant/49211481850172',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-jj-12',
    title: 'SeaKing Bait Board JJ-12 (600mm X 350mm)',
    price: 544,
    compareAtPrice: 1088,
    image: `${CDN}/bait-board-jj12-3.png?v=1725592075`,
    image2: `${CDN}/ScreenShot2023-06-16at2.19.27pm.png?v=1725596385`,
    description: 'The SeaKing JJ-12 bait board is a compact and capable model featuring an integrated cup holder, knife tray, and large sink. Handmade with full composite material of the highest quality with a UV resistant PE plastic cutting board — a great option for smaller vessels or as a secondary board.',
    variantId: 'gid://shopify/ProductVariant/49211549778236',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-e09',
    title: 'SeaKing Bait Board SK-E09 (820mm x 460mm)',
    price: 635,
    compareAtPrice: 1270,
    image: `${CDN}/bait-board-b09-5.png?v=1725592095`,
    image2: `${CDN}/ScreenShot2023-06-16at12.50.34pm.png?v=1725599272`,
    description: 'The SeaKing SK-E09 stands out as a premium option in the SeaKing range, characterised by its ergonomic design. It includes a spacious knife tray positioned at the front for quick and easy access, along with a deep storage sink featuring a drain. A distinctive raised lip around the sides and back ensures secure retention of items even in rough offshore conditions.',
    variantId: 'gid://shopify/ProductVariant/49211567472956',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-e09-blk',
    title: 'SeaKing Bait Board SK-E09 - Black (820mm x 460mm)',
    price: 685,
    compareAtPrice: 1370,
    image: `${CDN}/ScreenShot2023-06-16at12.57.00pm.png?v=1686884252`,
    image2: `${CDN}/ScreenShot2023-06-16at12.57.08pm.png?v=1686884259`,
    description: 'The SeaKing SK-E09 (Black) is now available in a sleek black gel coat finish. Crafted with an emphasis on ergonomic design, this premium model boasts a spacious knife tray at the front for quick access and a deep storage sink complete with a drain. A raised lip around the sides and back ensures secure retention of items even in rough conditions.',
    variantId: 'gid://shopify/ProductVariant/49211629044028',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-j07',
    title: 'SeaKing Bait Board SK-J07 (700mm x 420mm)',
    price: 515,
    compareAtPrice: 1030,
    image: `${CDN}/bait-board-j07-2.png?v=1725592075`,
    image2: `${CDN}/bait-board-j07-5.png?v=1725592075`,
    description: 'The SeaKing SK-J07 boasts a sophisticated and durable design, featuring a sleek appearance complemented by a spacious knife tray and storage sink. Available in white gelcoat finish, meticulously handcrafted using premium composite materials including a UV resistant PE plastic cutting board for lasting performance on the water.',
    variantId: 'gid://shopify/ProductVariant/49211827618108',
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-k08-blk',
    title: 'SeaKing Bait Board SK-K08 - BLK (700mm x 420mm)',
    price: 565,
    compareAtPrice: 1130,
    image: `${CDN}/ScreenShot2023-06-16at12.29.28pm.png?v=1686882671`,
    image2: `${CDN}/ScreenShot2023-06-16at12.29.39pm.png?v=1686882671`,
    description: 'The SeaKing SK-K08 (Black) is an elegant yet very durable bait board, with a sleek design, large knife tray and storage sink. This black gelcoat variant of the SK-J07 is handmade with full composite materials of the highest quality, featuring our UV resistant PE plastic cutting board.',
    variantId: 'gid://shopify/ProductVariant/49211717058876',
    collections: ['bait-boards', 'on-sale'],
  },
  {
    handle: 'bait-board-skl-l06',
    title: 'SeaKing Bait Board SKL-L06 (900mm x 500mm)',
    price: 908.05,
    compareAtPrice: 1225,
    image: `${CDN}/ScreenShot2023-06-16at12.08.49pm.png?v=1686881396`,
    image2: `${CDN}/ScreenShot2023-06-16at12.09.00pm.png?v=1686881396`,
    description: 'The SeaKing SKL-L06 is a heavy-duty bait board designed for serious anglers, featuring integrated cup holders, a knife tray, and a generously sized storage sink that spans nearly the entire length of the board. With the widest variety of mounting points available, these boards accommodate vessels of all sizes. Handcrafted using premium composite materials with a UV resistant PE plastic cutting board.',
    variantId: 'gid://shopify/ProductVariant/45423515140412',
    collections: ['bait-boards', 'bait-boards-with-legs'],
  },
  {
    handle: 'bait-board-skl-s05',
    title: 'SeaKing Bait Board SKL-S05 (720mm x 500mm)',
    price: 740,
    compareAtPrice: 1040,
    image: `${CDN}/ScreenShot2023-06-16at12.02.51pm.png?v=1686881056`,
    image2: `${CDN}/ScreenShot2023-06-16at12.02.59pm.png?v=1686881055`,
    description: 'The SeaKing SKL-S05 is a robust bait board featuring integrated cup holders, a knife tray, and a spacious storage sink that extends nearly the entire length of the board. Designed with the largest variety of mounting points to accommodate vessels of any size. Handcrafted from top-quality composite materials with a UV resistant PE plastic cutting board.',
    variantId: 'gid://shopify/ProductVariant/45423489974588',
    collections: ['bait-boards', 'bait-boards-with-legs'],
  },
  {
    handle: 'bait-board-sq-13',
    title: 'SeaKing Bait Board SQ-13 (700mm x 350mm)',
    price: 408,
    compareAtPrice: 840,
    image: `${CDN}/ScreenShot2023-06-16at2.21.13pm.png?v=1686889317`,
    image2: `${CDN}/ScreenShot2023-06-16at2.21.19pm.png?v=1686889317`,
    description: 'The SeaKing SQ-13 is a unique bait board, featuring a knife tray, large sink and 2 tackle compartments on either side. Made of full composite material of the highest quality with an included UV resistant PE plastic cutting board — ideal for anglers who need organised tackle storage alongside their bait prep area.',
    variantId: 'gid://shopify/ProductVariant/49211766374716',
    collections: ['bait-boards', 'on-sale'],
  },
  {
    handle: 'bait-boards-leaning-post-top-skl-11',
    title: 'SeaKing Bait Boards Leaning Post Top SKL-11 (700mm x 280mm)',
    price: 590,
    compareAtPrice: null,
    image: `${CDN}/ScreenShot2023-06-16at2.33.05pm.png?v=1686890030`,
    image2: `${CDN}/ScreenShot2023-06-16at2.33.13pm.png?v=1686890030`,
    description: 'The Leaning Post Top SKL-11 is built for the dedicated offshore game fisherman. This heavy-duty leaning post features an aluminum plate fiberglassed in for secure post mounting, providing the stability and peace of mind needed when battling large pelagic fish in challenging offshore environments. Handmade with full composite materials of the highest quality.',
    variantId: 'gid://shopify/ProductVariant/45424537731388',
    collections: ['bait-boards', 'bait-boards-with-legs'],
  },
  {
    handle: 'rod-holders',
    title: 'SeaKing Game Rated Rod Holder',
    price: 90,
    compareAtPrice: 120,
    image: `${CDN}/ScreenShot2023-06-16at2.37.08pm.png?v=1686890275`,
    description: 'Our SeaKing Rod Holder is designed for serious anglers, keeping your gear secure during intense fishing sessions. Game-rated and built to handle the tough demands of game fishing and high drag pressures. Made from 316 marine-grade stainless steel for superior strength and corrosion resistance in saltwater environments.',
    variantId: 'gid://shopify/ProductVariant/45424556310844',
    collections: ['on-sale'],
  },
];

export function getByCollection(collection: string) {
  return products.filter((p) => p.collections.includes(collection));
}

export function getByHandle(handle: string) {
  return products.find((p) => p.handle === handle) ?? null;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(cents);
}
