// Opus Drinks — demo aggregator dataset.
// IMPORTANT: This is Phase 1 demonstration data. No live partner feeds are
// connected. Every record retains an internal `sourceId` (auction house) per
// the platform's compliance rules. `sourceId` is NEVER shown on public
// surfaces — only in admin views and transaction documents.

export type BiddingMode = "integrated" | "external";

export type AuctionHouseId =
  | "sothebys-wine"
  | "christies-wine"
  | "acker"
  | "iron-gate";

export type AuctionCategory = "wine" | "spirits" | "mixed";

export type AuctionStatus = "live" | "upcoming" | "closing-soon" | "past";

export type Auction = {
  id: string;
  sourceId: AuctionHouseId; // internal only
  title: string;
  category: AuctionCategory;
  location: string; // city, country
  format: "live" | "online" | "hybrid";
  startsAtUtc: string; // ISO
  endsAtUtc: string;   // ISO
  registrationDeadlineUtc: string;
  currency: "USD" | "EUR" | "GBP" | "HKD" | "CHF";
  buyersPremiumPct: number;
  lotCount: number;
  coverImage: string;
  summary: string;
  biddingMode: BiddingMode; // integrated => can bid inside Opus; external => concierge/partner site
  partnerUrl: string;       // where an external bid must be placed
  status: AuctionStatus;
  featured?: boolean;
};

export type Lot = {
  id: string;
  auctionId: string;
  lotNumber: string;
  producer: string;
  wineName: string;
  vintage?: number;
  region?: string;
  country?: string;
  appellation?: string;
  classification?: string;
  bottleSize: string; // "750ml", "1.5L Magnum"
  bottleCount: number;
  packaging?: string; // "OWC", "Original Carton"
  fillLevel?: string;
  labelCondition?: string;
  capsuleCondition?: string;
  provenance?: string;
  storageHistory?: string;
  description: string;
  criticScores?: { critic: string; score: string }[];
  drinkingWindow?: string;
  estimateLow: number;
  estimateHigh: number;
  bidIncrement: number;
  shippingEligible: boolean;
  collectionLocation?: string;
  image: string;
};

// Bottle imagery from existing assets (Phase 1 — no partner-supplied images).
import bottleA from "@/assets/hero-bottle.jpg";
import bottleB from "@/assets/cellar-detail.jpg";
import bottleC from "@/assets/drop-denise.jpg";
import bottleD from "@/assets/drop-champagne-lux.jpg";
import bottleE from "@/assets/drop-cabernet.jpg";
import bottleF from "@/assets/celeb-mouton.jpg";
import bottleG from "@/assets/celeb-pappy.jpg";
import bottleH from "@/assets/celeb-sancerre.jpg";

const DAY = 86_400_000;

// Build auctions per call so dates stay fresh. On serverless runtimes
// (Cloudflare Workers / Nitro isolates) module-scope `Date.now()` freezes
// at isolate startup and countdowns drift to 00h 00m 00s. Recompute here.
function buildAuctions(): Auction[] {
  const now = Date.now();
  const iso = (offsetMs: number) => new Date(now + offsetMs).toISOString();
  return _auctionsFactory(iso);
}

export function getAuctions(): Auction[] {
  return buildAuctions();
}

const _auctionsFactory = (iso: (ms: number) => string): Auction[] => [

  {
    id: "opus-a-001",
    sourceId: "sothebys-wine",
    title: "First Growth Bordeaux · Winter Release",
    category: "wine",
    location: "London, United Kingdom",
    format: "hybrid",
    startsAtUtc: iso(-2 * DAY),
    endsAtUtc: iso(1 * DAY + 4 * 3_600_000),
    registrationDeadlineUtc: iso(0.5 * DAY),
    currency: "GBP",
    buyersPremiumPct: 22.5,
    lotCount: 148,
    coverImage: bottleA,
    summary:
      "A curated selection of first-growth Bordeaux with strong provenance, spanning 1982–2010 vintages, offered by a leading international auction partner.",
    biddingMode: "external",
    partnerUrl: "https://www.sothebys.com/en/buy/wine",
    status: "closing-soon",
    featured: true,
  },
  {
    id: "opus-a-002",
    sourceId: "christies-wine",
    title: "Burgundy: Domaines de la Côte d'Or",
    category: "wine",
    location: "Geneva, Switzerland",
    format: "online",
    startsAtUtc: iso(-4 * DAY),
    endsAtUtc: iso(3 * DAY),
    registrationDeadlineUtc: iso(1 * DAY),
    currency: "CHF",
    buyersPremiumPct: 25,
    lotCount: 212,
    coverImage: bottleB,
    summary:
      "Grand cru allocations from Vosne-Romanée, Chambolle-Musigny and Puligny-Montrachet, direct from private European cellars.",
    biddingMode: "external",
    partnerUrl: "https://www.christies.com/en/departments/wine-15",
    status: "live",
    featured: true,
  },
  {
    id: "opus-a-003",
    sourceId: "acker",
    title: "Rare Burgundy & Rhône Cellar",
    category: "wine",
    location: "Hong Kong, HK SAR",
    format: "live",
    startsAtUtc: iso(6 * DAY),
    endsAtUtc: iso(7 * DAY),
    registrationDeadlineUtc: iso(5 * DAY),
    currency: "HKD",
    buyersPremiumPct: 24.5,
    lotCount: 96,
    coverImage: bottleC,
    summary:
      "A single-owner Asian collection of DRC, Leroy, Rousseau and Guigal La Landonne verticals, professionally stored since acquisition.",
    biddingMode: "external",
    partnerUrl: "https://www.ackerwines.com/",
    status: "upcoming",
  },
  {
    id: "opus-a-004",
    sourceId: "iron-gate",
    title: "American Icons: Napa Cult Cabernet",
    category: "wine",
    location: "Chicago, United States",
    format: "online",
    startsAtUtc: iso(-1 * DAY),
    endsAtUtc: iso(2 * DAY + 6 * 3_600_000),
    registrationDeadlineUtc: iso(0.25 * DAY),
    currency: "USD",
    buyersPremiumPct: 20,
    lotCount: 74,
    coverImage: bottleE,
    summary:
      "Screaming Eagle, Harlan Estate, Scarecrow, Bond and Colgin — verticals and large formats from a Midwestern private cellar.",
    biddingMode: "external",
    partnerUrl: "https://www.irongatewine.com/",
    status: "live",
    featured: true,
  },
  {
    id: "opus-a-005",
    sourceId: "sothebys-wine",
    title: "Champagne: Prestige Cuvées 1996–2012",
    category: "wine",
    location: "New York, United States",
    format: "hybrid",
    startsAtUtc: iso(12 * DAY),
    endsAtUtc: iso(13 * DAY + 3 * 3_600_000),
    registrationDeadlineUtc: iso(11 * DAY),
    currency: "USD",
    buyersPremiumPct: 22.5,
    lotCount: 132,
    coverImage: bottleD,
    summary:
      "Krug Clos d'Ambonnay, Salon S, Dom Pérignon P2 and Cristal Rosé — provenance-verified prestige cuvées across two exceptional decades.",
    biddingMode: "external",
    partnerUrl: "https://www.sothebys.com/en/buy/wine",
    status: "upcoming",
  },
  {
    id: "opus-a-006",
    sourceId: "christies-wine",
    title: "Rare Spirits: Whisky, Cognac & Agave",
    category: "spirits",
    location: "Hong Kong, HK SAR",
    format: "live",
    startsAtUtc: iso(20 * DAY),
    endsAtUtc: iso(21 * DAY),
    registrationDeadlineUtc: iso(18 * DAY),
    currency: "HKD",
    buyersPremiumPct: 25,
    lotCount: 168,
    coverImage: bottleG,
    summary:
      "Macallan Fine & Rare, Yamazaki 55, Karuizawa vintages, Louis XIII Rare Cask and single-estate Oaxacan mezcal.",
    biddingMode: "external",
    partnerUrl: "https://www.christies.com/en/departments/wine-15",
    status: "upcoming",
  },
  {
    id: "opus-a-007",
    sourceId: "acker",
    title: "Piedmont Legends: Barolo & Barbaresco",
    category: "wine",
    location: "New York, United States",
    format: "online",
    startsAtUtc: iso(-14 * DAY),
    endsAtUtc: iso(-6 * DAY),
    registrationDeadlineUtc: iso(-8 * DAY),
    currency: "USD",
    buyersPremiumPct: 24.5,
    lotCount: 88,
    coverImage: bottleH,
    summary:
      "Completed. Giacomo Conterno Monfortino verticals, Gaja Sorì San Lorenzo, Bruno Giacosa Riservas.",
    biddingMode: "external",
    partnerUrl: "https://www.ackerwines.com/",
    status: "past",
  },
  {
    id: "opus-a-008",
    sourceId: "iron-gate",
    title: "Tuscany & Super Tuscans",
    category: "wine",
    location: "Chicago, United States",
    format: "online",
    startsAtUtc: iso(4 * DAY),
    endsAtUtc: iso(9 * DAY),
    registrationDeadlineUtc: iso(3 * DAY),
    currency: "USD",
    buyersPremiumPct: 20,
    lotCount: 104,
    coverImage: bottleF,
    summary:
      "Sassicaia, Ornellaia, Masseto, Tignanello and Brunello di Montalcino Riservas from single-owner Italian cellars.",
    biddingMode: "external",
    partnerUrl: "https://www.irongatewine.com/",
    status: "upcoming",
  },
];

export const lots: Lot[] = [
  {
    id: "lot-001",
    auctionId: "opus-a-001",
    lotNumber: "Lot 014",
    producer: "Château Mouton Rothschild",
    wineName: "Château Mouton Rothschild",
    vintage: 1982,
    region: "Pauillac",
    country: "France",
    appellation: "Pauillac AOC",
    classification: "1er Grand Cru Classé",
    bottleSize: "750ml",
    bottleCount: 12,
    packaging: "Original Wooden Case (OWC)",
    fillLevel: "Into Neck",
    labelCondition: "Excellent — minor scuffing on 2 bottles",
    capsuleCondition: "Intact, original",
    provenance: "Ex-château, purchased on release; single-owner European cellar",
    storageHistory: "Professional temperature-controlled storage since 1983",
    description:
      "One of the great vintages of the twentieth century. Twelve bottles in original wooden case, offered by a single-owner European collector with unbroken storage history.",
    criticScores: [
      { critic: "Robert Parker", score: "100/100" },
      { critic: "Vinous (Galloni)", score: "98/100" },
    ],
    drinkingWindow: "Now – 2050",
    estimateLow: 52_000,
    estimateHigh: 68_000,
    bidIncrement: 1_000,
    shippingEligible: true,
    collectionLocation: "London, UK",
    image: bottleF,
  },
  {
    id: "lot-002",
    auctionId: "opus-a-002",
    lotNumber: "Lot 087",
    producer: "Domaine de la Romanée-Conti",
    wineName: "La Tâche Grand Cru",
    vintage: 1996,
    region: "Vosne-Romanée",
    country: "France",
    appellation: "La Tâche Grand Cru Monopole",
    classification: "Grand Cru",
    bottleSize: "750ml",
    bottleCount: 3,
    packaging: "Individual bottles",
    fillLevel: "Base of neck",
    labelCondition: "Very good",
    capsuleCondition: "Intact",
    provenance: "Private European cellar",
    storageHistory: "Cellar-stored since release",
    description:
      "1996 La Tâche — a classic structured Vosne vintage, still on a long ascending curve.",
    criticScores: [{ critic: "Vinous", score: "97/100" }],
    drinkingWindow: "Now – 2040",
    estimateLow: 34_000,
    estimateHigh: 42_000,
    bidIncrement: 500,
    shippingEligible: true,
    collectionLocation: "Geneva, CH",
    image: bottleB,
  },
  {
    id: "lot-003",
    auctionId: "opus-a-004",
    lotNumber: "Lot 022",
    producer: "Screaming Eagle",
    wineName: "Cabernet Sauvignon",
    vintage: 2013,
    region: "Napa Valley — Oakville",
    country: "United States",
    bottleSize: "750ml",
    bottleCount: 1,
    fillLevel: "Into neck",
    labelCondition: "Pristine",
    provenance: "Direct from mailing list allocation",
    description:
      "A benchmark Napa Cabernet vintage. Single bottle, mailing-list provenance.",
    criticScores: [{ critic: "Robert Parker", score: "100/100" }],
    drinkingWindow: "Now – 2045",
    estimateLow: 4_200,
    estimateHigh: 5_500,
    bidIncrement: 100,
    shippingEligible: true,
    collectionLocation: "Chicago, IL",
    image: bottleE,
  },
  {
    id: "lot-004",
    auctionId: "opus-a-004",
    lotNumber: "Lot 041",
    producer: "Harlan Estate",
    wineName: "Proprietary Red",
    vintage: 2007,
    region: "Napa Valley — Oakville",
    country: "United States",
    bottleSize: "1.5L Magnum",
    bottleCount: 1,
    packaging: "Original wooden box",
    fillLevel: "Into neck",
    labelCondition: "Excellent",
    provenance: "Single-owner Midwestern cellar",
    description: "Magnum format of the celebrated 2007 vintage.",
    criticScores: [{ critic: "Robert Parker", score: "99/100" }],
    drinkingWindow: "Now – 2040",
    estimateLow: 3_800,
    estimateHigh: 4_800,
    bidIncrement: 100,
    shippingEligible: true,
    collectionLocation: "Chicago, IL",
    image: bottleC,
  },
  {
    id: "lot-005",
    auctionId: "opus-a-002",
    lotNumber: "Lot 156",
    producer: "Domaine Leflaive",
    wineName: "Puligny-Montrachet Les Pucelles 1er Cru",
    vintage: 2014,
    region: "Puligny-Montrachet",
    country: "France",
    bottleSize: "750ml",
    bottleCount: 6,
    packaging: "OWC",
    fillLevel: "Into neck",
    labelCondition: "Excellent",
    provenance: "Domaine-direct allocation",
    description:
      "Six bottles OWC — precise, saline, still very youthful.",
    drinkingWindow: "Now – 2032",
    estimateLow: 3_400,
    estimateHigh: 4_200,
    bidIncrement: 100,
    shippingEligible: true,
    collectionLocation: "Geneva, CH",
    image: bottleH,
  },
  {
    id: "lot-006",
    auctionId: "opus-a-006",
    lotNumber: "Lot 003",
    producer: "The Macallan",
    wineName: "Fine & Rare 1950",
    vintage: 1950,
    region: "Speyside",
    country: "Scotland",
    bottleSize: "700ml",
    bottleCount: 1,
    packaging: "Original presentation box",
    fillLevel: "High shoulder",
    labelCondition: "Very good — minor age-related wear",
    provenance: "Private Asian collection",
    description: "A cornerstone bottling of the Fine & Rare series.",
    drinkingWindow: "Drink or hold",
    estimateLow: 180_000,
    estimateHigh: 240_000,
    bidIncrement: 2_500,
    shippingEligible: false,
    collectionLocation: "Hong Kong",
    image: bottleG,
  },
];

// Public house label — intentionally generic, no partner logos/names publicly.
// House id remains on record internally for compliance and reconciliation.
export function houseLabel(_id: AuctionHouseId): string {
  return "Authorised Auction Partner";
}

export function currencySymbol(c: Auction["currency"]): string {
  return { USD: "$", EUR: "€", GBP: "£", HKD: "HK$", CHF: "CHF " }[c];
}

export function formatMoney(n: number, c: Auction["currency"]): string {
  return `${currencySymbol(c)}${n.toLocaleString("en-US")}`;
}

export function findAuction(id: string): Auction | undefined {
  return auctions.find((a) => a.id === id);
}

export function lotsForAuction(auctionId: string): Lot[] {
  return lots.filter((l) => l.auctionId === auctionId);
}

export function findLot(id: string): Lot | undefined {
  return lots.find((l) => l.id === id);
}

export function timeRemaining(endsAtUtc: string): {
  ended: boolean;
  d: number; h: number; m: number; s: number;
} {
  const diff = new Date(endsAtUtc).getTime() - Date.now();
  if (diff <= 0) return { ended: true, d: 0, h: 0, m: 0, s: 0 };
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  return { ended: false, d, h, m, s };
}

export function formatCountdown(endsAtUtc: string): string {
  const t = timeRemaining(endsAtUtc);
  if (t.ended) return "Auction closed";
  if (t.d > 0) return `${t.d}d ${String(t.h).padStart(2, "0")}h ${String(t.m).padStart(2, "0")}m`;
  return `${String(t.h).padStart(2, "0")}h ${String(t.m).padStart(2, "0")}m ${String(t.s).padStart(2, "0")}s`;
}

// Feature flag — integrated bidding is OFF until a real partner API is wired.
// When true, Mode 1 (in-platform bidding) becomes available for auctions where
// biddingMode === "integrated". Never flip in code without a signed integration.
export const FEATURE_INTEGRATED_BIDDING = false;
