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
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-b02',
    title: 'SeaKing Bait Board B02 (650mm x 430mm) & 2 Game Rated Rod Holders',
    price: 575,
    compareAtPrice: 1150,
    image: `${CDN}/bait-board-b02-4.png?v=1725592095`,
    image2: `${CDN}/ScreenShot2023-06-16at11.54.54am.png?v=1725592878`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-b03',
    title: 'SeaKing Bait Board B03 (830mm x 430mm) & 2 Game Rated Rod Holders',
    price: 625,
    compareAtPrice: 1250,
    image: `${CDN}/ScreenShot2023-06-16at11.58.03am.png?v=1686880755`,
    image2: `${CDN}/ScreenShot2023-06-16at11.58.10am.png?v=1686880755`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-b04',
    title: 'SeaKing Bait Board B04 (830mm x 430mm) & 2 Game Rated Rod Holders',
    price: 700,
    compareAtPrice: 850,
    image: `${CDN}/bait-board-b04.png?v=1725592095`,
    image2: `${CDN}/bait-board-b04-4.png?v=1725592095`,
    collections: ['bait-boards', 'on-sale'],
  },
  {
    handle: 'bait-board-sk-h10',
    title: 'SeaKing Bait Board H10 (830mm x 400mm)',
    price: 632,
    compareAtPrice: 1280,
    image: `${CDN}/bait-board-h10-10.png?v=1725592075`,
    image2: `${CDN}/bait-board-h10-5.png?v=1725592075`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-h10b',
    title: 'SeaKing Bait Board H10B (830mm x 400mm)',
    price: 585,
    compareAtPrice: 1170,
    image: `${CDN}/ScreenShot2023-06-16at2.16.18pm.png?v=1686889032`,
    image2: `${CDN}/ScreenShot2023-06-16at2.16.23pm.png?v=1686889032`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-hh-14',
    title: 'SeaKing Bait Board HH-14 (625mm x 390mm)',
    price: 495,
    compareAtPrice: 990,
    image: `${CDN}/ScreenShot2023-06-16at2.23.26pm.png?v=1686889496`,
    image2: `${CDN}/ScreenShot2023-06-16at2.23.32pm.png?v=1686889495`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-hj-15',
    title: 'SeaKing Bait Board HJ-15 (700mm x 415mm)',
    price: 525,
    compareAtPrice: 1050,
    image: `${CDN}/bait-board-hj15.png?v=1725592075`,
    image2: `${CDN}/ScreenShot2023-06-16at2.29.42pm.png?v=1725597456`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-jj-12',
    title: 'SeaKing Bait Board JJ-12 (600mm X 350mm)',
    price: 544,
    compareAtPrice: 1088,
    image: `${CDN}/bait-board-jj12-3.png?v=1725592075`,
    image2: `${CDN}/ScreenShot2023-06-16at2.19.27pm.png?v=1725596385`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-e09',
    title: 'SeaKing Bait Board SK-E09 (820mm x 460mm)',
    price: 635,
    compareAtPrice: 1270,
    image: `${CDN}/bait-board-b09-5.png?v=1725592095`,
    image2: `${CDN}/ScreenShot2023-06-16at12.50.34pm.png?v=1725599272`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-e09-blk',
    title: 'SeaKing Bait Board SK-E09 - Black (820mm x 460mm)',
    price: 685,
    compareAtPrice: 1370,
    image: `${CDN}/ScreenShot2023-06-16at12.57.00pm.png?v=1686884252`,
    image2: `${CDN}/ScreenShot2023-06-16at12.57.08pm.png?v=1686884259`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-j07',
    title: 'SeaKing Bait Board SK-J07 (700mm x 420mm)',
    price: 515,
    compareAtPrice: 1030,
    image: `${CDN}/bait-board-j07-2.png?v=1725592075`,
    image2: `${CDN}/bait-board-j07-5.png?v=1725592075`,
    collections: ['bait-boards'],
  },
  {
    handle: 'bait-board-sk-k08-blk',
    title: 'SeaKing Bait Board SK-K08 - BLK (700mm x 420mm)',
    price: 565,
    compareAtPrice: 1130,
    image: `${CDN}/ScreenShot2023-06-16at12.29.28pm.png?v=1686882671`,
    image2: `${CDN}/ScreenShot2023-06-16at12.29.39pm.png?v=1686882671`,
    collections: ['bait-boards', 'on-sale'],
  },
  {
    handle: 'bait-board-skl-l06',
    title: 'SeaKing Bait Board SKL-L06 (900mm x 500mm)',
    price: 908.05,
    compareAtPrice: 1225,
    image: `${CDN}/ScreenShot2023-06-16at12.08.49pm.png?v=1686881396`,
    image2: `${CDN}/ScreenShot2023-06-16at12.09.00pm.png?v=1686881396`,
    collections: ['bait-boards', 'bait-boards-with-legs'],
  },
  {
    handle: 'bait-board-skl-s05',
    title: 'SeaKing Bait Board SKL-S05 (720mm x 500mm)',
    price: 740,
    compareAtPrice: 1040,
    image: `${CDN}/ScreenShot2023-06-16at12.02.51pm.png?v=1686881056`,
    image2: `${CDN}/ScreenShot2023-06-16at12.02.59pm.png?v=1686881055`,
    collections: ['bait-boards', 'bait-boards-with-legs'],
  },
  {
    handle: 'bait-board-sq-13',
    title: 'SeaKing Bait Board SQ-13 (700mm x 350mm)',
    price: 408,
    compareAtPrice: 840,
    image: `${CDN}/ScreenShot2023-06-16at2.21.13pm.png?v=1686889317`,
    image2: `${CDN}/ScreenShot2023-06-16at2.21.19pm.png?v=1686889317`,
    collections: ['bait-boards', 'on-sale'],
  },
  {
    handle: 'bait-boards-leaning-post-top-skl-11',
    title: 'SeaKing Bait Boards Leaning Post Top SKL-11 (700mm x 280mm)',
    price: 590,
    compareAtPrice: null,
    image: `${CDN}/ScreenShot2023-06-16at2.33.05pm.png?v=1686890030`,
    image2: `${CDN}/ScreenShot2023-06-16at2.33.13pm.png?v=1686890030`,
    collections: ['bait-boards', 'bait-boards-with-legs'],
  },
  {
    handle: 'rod-holders',
    title: 'SeaKing Game Rated Rod Holder',
    price: 90,
    compareAtPrice: 120,
    image: `${CDN}/ScreenShot2023-06-16at2.37.08pm.png?v=1686890275`,
    collections: ['on-sale'],
  },
];

export function getByCollection(collection: string) {
  return products.filter((p) => p.collections.includes(collection));
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(cents);
}
