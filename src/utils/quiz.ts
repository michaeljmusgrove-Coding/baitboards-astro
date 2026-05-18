// Help-me-choose quiz recommendation engine.
// Three axes × three values = 27 combinations, each maps to one recommended product.
//
// Picks lean on Bait Boards Direct's known SeaKing range:
//   JJ-12 / HH-14    — small/compact, light tackle
//   B01 / B02 / B03 / B04  — flat-mount with rod holders, mid-range
//   SK-J07 / SK-K08  — sleek, mid-large
//   SK-H10 / SK-H10B — premium flat-mount, large
//   SK-E09           — premium ergonomic, large
//   HJ-15            — large with cup holders
//   SKL-S05 / SKL-L06 — heavy-duty leg-mount
//
// If a product handle ever falls out of the catalogue, the result page falls back
// gracefully — we render the user's answers + reasoning + a generic CTA.

export type Fishing = "offshore" | "inshore" | "estuary";
export type Boat = "small" | "medium" | "large";
export type Rods = "2" | "4" | "6plus";

export const FISHING_OPTIONS: { value: Fishing; label: string; hint: string }[] = [
  { value: "offshore", label: "Offshore / blue-water", hint: "Reef, gamefish, open ocean — heavy seas, big species" },
  { value: "inshore", label: "Inshore / coastal", hint: "Bays, headlands, sheltered coast — snapper, kingfish, flathead" },
  { value: "estuary", label: "Estuary / freshwater", hint: "Rivers, lakes, sheltered estuaries — bream, bass, jewfish" },
];

export const BOAT_OPTIONS: { value: Boat; label: string; hint: string }[] = [
  { value: "small", label: "Under 5 m", hint: "Tinnies, kayaks, small runabouts" },
  { value: "medium", label: "5 – 7 m", hint: "Centre consoles, mid-size runabouts" },
  { value: "large", label: "Over 7 m", hint: "Large centre consoles, offshore vessels" },
];

export const RODS_OPTIONS: { value: Rods; label: string; hint: string }[] = [
  { value: "2", label: "2 rods", hint: "Light to medium fishing setup" },
  { value: "4", label: "4 rods", hint: "Serious recreational, occasional charter" },
  { value: "6plus", label: "6+ rods", hint: "Tournament, charter, heavy game fishing" },
];

export const ALL_COMBOS: { fishing: Fishing; boat: Boat; rods: Rods }[] = (() => {
  const out: { fishing: Fishing; boat: Boat; rods: Rods }[] = [];
  for (const f of FISHING_OPTIONS) {
    for (const b of BOAT_OPTIONS) {
      for (const r of RODS_OPTIONS) {
        out.push({ fishing: f.value, boat: b.value, rods: r.value });
      }
    }
  }
  return out;
})();

export interface Recommendation {
  productHandle: string;
  reason: string;
  alternativeHandle?: string;
}

// Recommendation matrix — keyed by fishing-boat-rods.
// Reasoning is written to be re-usable as content the user can act on, not just
// "this product." If the chosen handle is sold out at build time, the result
// page surfaces the alternative.
const MATRIX: Record<string, Recommendation> = {
  // ─── OFFSHORE ─────────────────────────────────────────────
  "offshore-small-2": {
    productHandle: "bait-board-sk-j07",
    alternativeHandle: "bait-board-jj-12",
    reason: "Offshore conditions on a small boat call for a board that handles serious work without overwhelming the deck. The SK-J07 gives you a knife tray and a deep storage sink in a footprint that won't crowd a small centre console.",
  },
  "offshore-small-4": {
    productHandle: "bait-board-sk-h10",
    alternativeHandle: "bait-board-sk-j07",
    reason: "For offshore fishing on a smaller vessel with four rods in the water, the SK-H10 packs a big working surface into a compact, premium fibreglass build with a generously-sized integrated sink and rear knife tray.",
  },
  "offshore-small-6plus": {
    productHandle: "bait-board-sk-h10b",
    alternativeHandle: "bait-board-sk-h10",
    reason: "Six-plus rods on a small offshore boat is an aggressive setup. The SK-H10B (black gelcoat) gives you the premium working space of the H10 line — large sink, knife tray, room for serious bait prep — without going to a leg-mount that won't fit a small craft.",
  },
  "offshore-medium-2": {
    productHandle: "bait-board-sk-h10",
    reason: "A 5–7m offshore boat with a light rod setup is the sweet spot for the SK-H10. Premium fibreglass, big integrated sink with drain, dedicated knife tray — built for serious offshore work but right-sized for a mid-size vessel.",
  },
  "offshore-medium-4": {
    productHandle: "bait-board-sk-h10b",
    alternativeHandle: "bait-board-sk-h10",
    reason: "Four rods on a 5–7m offshore vessel calls for the SK-H10B — the black gelcoat variant of our flagship H10 series. Large sink, ergonomic knife tray placement, full composite fibreglass shell, all the working room you need for serious offshore bait prep.",
  },
  "offshore-medium-6plus": {
    productHandle: "bait-board-sk-e09",
    alternativeHandle: "bait-board-sk-e09-blk",
    reason: "Heavy rod setup on a mid-size offshore boat means the SK-E09. Spacious knife tray at the front for fast access, deep storage sink, and a raised retention lip around the sides and back — no items washing off in offshore swell. The premium pick for serious anglers.",
  },
  "offshore-large-2": {
    productHandle: "bait-board-sk-h10",
    alternativeHandle: "bait-board-sk-e09",
    reason: "A large offshore vessel with a light tackle setup is unusual but well-served by the SK-H10. Premium offshore-grade construction with integrated sink and knife tray — gives you future room to scale your rod setup without changing the board.",
  },
  "offshore-large-4": {
    productHandle: "bait-board-sk-e09",
    alternativeHandle: "bait-board-sk-e09-blk",
    reason: "A 7m+ offshore vessel running four rods is built for the SK-E09. Ergonomic front knife tray, deep storage sink with drain, raised retention lip — handles heavy game-fishing days without washing gear over the side. Premium build, premium feel.",
  },
  "offshore-large-6plus": {
    productHandle: "bait-board-skl-l06",
    alternativeHandle: "bait-board-skl-s05",
    reason: "The setup the SKL-L06 was built for. Heavy-duty offshore vessel, six-plus rods, integrated cup holders, a knife tray, and a sink that runs nearly the full length of the board. The most mounting-point options in the SeaKing range — bolts onto the largest offshore consoles cleanly.",
  },

  // ─── INSHORE ──────────────────────────────────────────────
  "inshore-small-2": {
    productHandle: "bait-board-jj-12",
    alternativeHandle: "bait-board-b01",
    reason: "Compact inshore fishing on a tinnie or small runabout. The JJ-12 (600mm × 350mm) is the most compact board in our range with an integrated cup holder, knife tray, and full sink — everything you need without consuming the deck.",
  },
  "inshore-small-4": {
    productHandle: "bait-board-b01",
    alternativeHandle: "bait-board-b02",
    reason: "Inshore fishing on a smaller boat with four rods in the holders calls for the SK-B01. Classic flat-mount design, integrated 316 stainless rod holders, UV-resistant PE cutting surface, and a sink with drain. A reliable everyday inshore setup.",
  },
  "inshore-small-6plus": {
    productHandle: "bait-board-b03",
    alternativeHandle: "bait-board-b01",
    reason: "Six-plus rods on a small inshore boat means you need the working space of the SK-B03 — same trusted construction as the B01, sized at 830mm wide for serious rod density. Integrated rod holders, sink with drain, premium fibreglass shell.",
  },
  "inshore-medium-2": {
    productHandle: "bait-board-sk-j07",
    alternativeHandle: "bait-board-b01",
    reason: "Mid-size inshore boat with a light rod setup. The SK-J07 brings a sleek, durable design with a spacious knife tray and storage sink — meticulously handcrafted in white gelcoat finish, ready for years of inshore work.",
  },
  "inshore-medium-4": {
    productHandle: "bait-board-b03",
    alternativeHandle: "bait-board-b04",
    reason: "Inshore fishing on a 5–7m boat with four rods means the SK-B03. Classic SeaKing build, 830mm × 430mm footprint, integrated game-rated rod holders and sink. The most popular configuration for serious recreational inshore anglers.",
  },
  "inshore-medium-6plus": {
    productHandle: "bait-board-b04",
    alternativeHandle: "bait-board-b03",
    reason: "Six-plus rods on a mid-size inshore vessel rewards the SK-B04 — same robust features as the B03 with the added convenience of moulded cup holders. Functionality and a touch of luxury for your time on the water.",
  },
  "inshore-large-2": {
    productHandle: "bait-board-sk-h10",
    alternativeHandle: "bait-board-b03",
    reason: "Large inshore vessel with a light tackle setup. The SK-H10 gives you premium construction and a full working surface — generous integrated sink, knife tray, room to scale your rod setup over time. Built to last on a serious vessel.",
  },
  "inshore-large-4": {
    productHandle: "bait-board-b03",
    alternativeHandle: "bait-board-sk-h10",
    reason: "A 7m+ inshore vessel running four rods is well-served by the SK-B03. Classic, robust SeaKing build — full composite fibreglass, 316 marine stainless rod holders, deep sink with drain. Handles long days on a large vessel without flexing.",
  },
  "inshore-large-6plus": {
    productHandle: "bait-board-skl-l06",
    alternativeHandle: "bait-board-skl-s05",
    reason: "Six-plus rods on a large inshore vessel calls for the SKL-L06. Integrated mounting legs, cup holders, knife tray, and a sink that runs nearly the full length of the board. The most flexible mounting options in the range — bolts onto large consoles, cabin tops, or transom shelves.",
  },

  // ─── ESTUARY ──────────────────────────────────────────────
  "estuary-small-2": {
    productHandle: "bait-board-jj-12",
    alternativeHandle: "bait-board-hh-14",
    reason: "Estuary fishing in a small craft is what the JJ-12 was built for. Compact 600mm × 350mm board with integrated cup holder, knife tray, and a sink — handles bream and flathead prep cleanly without consuming the deck of a tinnie or kayak.",
  },
  "estuary-small-4": {
    productHandle: "bait-board-hh-14",
    alternativeHandle: "bait-board-b01",
    reason: "Estuary fishing on a small boat with four rods. The HH-14 (625mm × 390mm) is a compact version of the SK-H10 with cup holders on each side, a knife compartment, and a spacious sink — high-end build in a footprint that suits small vessels.",
  },
  "estuary-small-6plus": {
    productHandle: "bait-board-b01",
    alternativeHandle: "bait-board-b02",
    reason: "Six-plus rods is a heavy setup for a small estuary boat — the SK-B01 keeps the working surface manageable while giving you integrated game-rated rod holders, a sink with drain, and a UV-resistant PE cutting surface.",
  },
  "estuary-medium-2": {
    productHandle: "bait-board-hh-14",
    alternativeHandle: "bait-board-sk-j07",
    reason: "Estuary fishing on a 5–7m boat with light rods. The HH-14 gives you cup holders, a knife compartment, and a spacious sink — premium feel without going overboard on a vessel that's also used for casual day trips.",
  },
  "estuary-medium-4": {
    productHandle: "bait-board-b02",
    alternativeHandle: "bait-board-b04",
    reason: "Mid-size estuary boat running four rods. The SK-B02 is identical to our trusted B01 platform with the upgrade of integrated moulded cup holders — added comfort for long sessions while keeping the same robust construction.",
  },
  "estuary-medium-6plus": {
    productHandle: "bait-board-b03",
    alternativeHandle: "bait-board-b04",
    reason: "Six-plus rods on a mid-size estuary boat is unusual but well-served by the SK-B03 — 830mm × 430mm working surface, integrated rod holders, sink with drain. Plenty of room to land bigger species when the estuary throws up a surprise.",
  },
  "estuary-large-2": {
    productHandle: "bait-board-sk-j07",
    alternativeHandle: "bait-board-hj-15",
    reason: "A 7m+ estuary boat with a light rod setup. The SK-J07 brings a sleek SeaKing build with knife tray and storage sink — premium materials for years of saltwater duty without overcommitting on rod holder count.",
  },
  "estuary-large-4": {
    productHandle: "bait-board-hj-15",
    alternativeHandle: "bait-board-b03",
    reason: "Large estuary vessel with four rods. The HJ-15 builds on the SK-J07 platform with integrated cup holders, a large sink, and a dedicated knife compartment — full SeaKing build quality with the conveniences a larger vessel deserves.",
  },
  "estuary-large-6plus": {
    productHandle: "bait-board-b03",
    alternativeHandle: "bait-board-skl-l06",
    reason: "Six-plus rods on a large estuary boat is a serious setup. The SK-B03 gives you 830mm × 430mm of working surface with integrated rod holders, sink with drain, and full composite fibreglass construction — more than enough capacity for any estuary scenario.",
  },
};

export function getRecommendation(fishing: Fishing, boat: Boat, rods: Rods): Recommendation {
  const key = `${fishing}-${boat}-${rods}`;
  return MATRIX[key] ?? {
    productHandle: "bait-board-sk-h10",
    reason: "The SK-H10 is the most versatile board in our range — premium fibreglass, integrated sink and knife tray, suits the broadest set of fishing scenarios.",
  };
}

export function describeAnswers(fishing: Fishing, boat: Boat, rods: Rods): string {
  const f = FISHING_OPTIONS.find(o => o.value === fishing)?.label.toLowerCase();
  const b = BOAT_OPTIONS.find(o => o.value === boat)?.label.toLowerCase();
  const r = RODS_OPTIONS.find(o => o.value === rods)?.label.toLowerCase();
  return `${f}, ${b} boat, ${r}`;
}
