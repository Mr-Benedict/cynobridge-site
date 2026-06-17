// Extended demo data for the real-app screens — Wallet, Assets, Planetary, Roster.
// Polished, store-ready EVE values. Reuses C / FONT / formatISK from data.jsx.

function iskShort(n) {
  if (n == null) return "—";
  const a = Math.abs(n);
  if (a >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (a >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (a >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return String(n);
}

// ---------- WALLET ----------
const WALLET2 = {
  balance: "2.85",
  balanceUnit: "B ISK",
  balanceExact: "2,847,301,450",
  netChange: "+247.0M",
  netPct: "+9.4%",
  windowText: "last 30 days",
  balanceRange: "2.61B – 2.85B",
  window: "30d",
  series: [38, 41, 39, 44, 43, 48, 46, 52, 49, 55, 53, 59, 57, 64, 62, 60, 68, 66, 71, 74],
  income: 412_400_000,
  expense: 168_120_000,
  // cash-flow breakdown (top categories, 30d)
  breakdown: [
    { label: "Bounty Prizes", amt: 184_000_000, color: "#00E5A0", dir: "in" },
    { label: "Market Sales", amt: 142_400_000, color: "#00C8FF", dir: "in" },
    { label: "Mission Rewards", amt: 86_000_000, color: "#9B59B6", dir: "in" },
    { label: "Market Escrow", amt: 118_120_000, color: "#F0A500", dir: "out" },
    { label: "Insurance & Fees", amt: 50_000_000, color: "#FF3355", dir: "out" },
  ],
  // journal grouped by day
  journal: [
    {
      day: "Today",
      entries: [
        { ref: "Bounty Prizes", sub: "Guristas · Tama", amt: 14_240_000, time: "12:48" },
        { ref: "Market Escrow", sub: "Buy · Tengu Subsystem", amt: -84_000_000, time: "11:02" },
        { ref: "Market Transaction", sub: "Sold 2,000× Tritanium", amt: 11_640_000, time: "09:30" },
      ],
    },
    {
      day: "Yesterday",
      entries: [
        { ref: "Corporation Dividend", sub: "Kaalakiota Corp", amt: 45_000_000, time: "22:14" },
        { ref: "Insurance Payout", sub: "Platinum · Caracal", amt: 6_400_000, time: "18:51" },
        { ref: "Mission Reward", sub: "The Blockade · L4", amt: 6_120_000, time: "16:09" },
        { ref: "Brokers Fee", sub: "Jita IV - Moon 4", amt: -2_410_000, time: "15:40" },
      ],
    },
  ],
};

// ---------- ASSETS ----------
const ASSETS2 = {
  total: "4.22",
  totalUnit: "B ISK",
  totalShort: "4.22B",
  pricedPct: 94,
  volume: "276k",
  itemCount: 1149,
  locations: [
    {
      name: "Jita IV - Moon 4", region: "The Forge · 1.0", count: 847, value: 2_640_000_000, open: true,
      items: [
        { name: "Caldari Navy Raven", qty: 1, kind: "rocket", val: "642.0M" },
        { name: "Tengu", qty: 1, kind: "rocket", val: "198.4M" },
        { name: "PLEX", qty: 412, kind: "star", val: "2.23B" },
        { name: "Tritanium", qty: 2_400_000, kind: "layers", val: "14.0M" },
        { name: "Large Skill Injector", qty: 3, kind: "cpu", val: "2.52B" },
      ],
    },
    { name: "Amarr VIII (Oris)", region: "Domain · 1.0", count: 213, value: 1_120_000_000, open: false, items: [] },
    { name: "Dodixie IX - 20", region: "Sinq Laison · 0.9", count: 89, value: 458_400_000, open: false, items: [] },
  ],
  // breakdown bar (value share by location)
  breakdown: [
    { label: "Jita IV - Moon 4", value: 2_640_000_000, color: "#00C8FF" },
    { label: "Amarr VIII (Oris)", value: 1_120_000_000, color: "#F0A500" },
    { label: "Dodixie IX - 20", value: 458_400_000, color: "#00E5A0" },
  ],
};

// ---------- PLANETARY ----------
const PLANETARY = {
  summary: { nextExpiry: "14h 22m", urgent: true, expired: 1, extracting: 3, colonyCount: 5, totalStored: 384_000_000, totalPins: 38 },
  alloc: [
    { label: "Reblsupport VI", value: 142_000_000, color: "#B89B6E" },
    { label: "Oicx IV", value: 118_000_000, color: "#6FBF8E" },
    { label: "Oicx V", value: 84_000_000, color: "#4FB8C9" },
    { label: "Akiainavas III", value: 40_000_000, color: "#E07A4F" },
  ],
  colonies: [
    {
      planet: "Reblsupport VI", type: "Barren", tint: "#B89B6E", upgrade: 4, pins: 9,
      status: "extracting", urgent: true, expiresIn: "14h 22m", fraction: 0.81, stored: 142_000_000,
      outputs: [{ name: "Toxic Metals", kind: "extracted" }, { name: "Mechanical Parts", kind: "produced" }],
      open: true,
      extractor: { product: "Toxic Metals", rate: "1,840 / hr", heads: 6 },
      factories: ["Mechanical Parts", "Consumer Electronics"],
      storage: [{ name: "Mechanical Parts", qty: "8,420", val: "62.0M" }, { name: "Toxic Metals", qty: "21,900", val: "44.0M" }],
    },
    {
      planet: "Oicx IV", type: "Temperate", tint: "#6FBF8E", upgrade: 5, pins: 11,
      status: "extracting", urgent: false, expiresIn: "2d 6h", fraction: 0.42, stored: 118_000_000,
      outputs: [{ name: "Aqueous Liquids", kind: "extracted" }, { name: "Coolant", kind: "produced" }],
      open: false,
    },
    {
      planet: "Oicx V", type: "Gas", tint: "#4FB8C9", upgrade: 4, pins: 8,
      status: "extracting", urgent: false, expiresIn: "3d 11h", fraction: 0.27, stored: 84_000_000,
      outputs: [{ name: "Ionic Solutions", kind: "extracted" }, { name: "Oxygen", kind: "produced" }],
      open: false,
    },
    {
      planet: "Akiainavas III", type: "Lava", tint: "#E07A4F", upgrade: 3, pins: 6,
      status: "expired", endedAgo: "2d", stored: 40_000_000,
      outputs: [{ name: "Construction Blocks", kind: "produced" }],
      open: false,
    },
    {
      planet: "Sobaseki IX", type: "Ice", tint: "#8FB8E0", upgrade: 4, pins: 4,
      status: "idle", stored: null, outputs: [],
      open: false,
    },
  ],
};

// ---------- ROSTER ----------
const ROSTER = [
  { name: "Aura Veldaris", id: "2114328694", active: true },
  { name: "Dryn Kovash", id: "2118552340", active: false },
  { name: "Sef Tannoryn", id: "2117001923", active: false },
];

Object.assign(window, { iskShort, WALLET2, ASSETS2, PLANETARY, ROSTER });
