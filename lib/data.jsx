// Shared design tokens, mock data (ported from the Figma prototype), and helpers.
const C = {
  bg: "#060A10",
  surface: "#0D1520",
  raised: "#142030",
  secondary: "#1A2840",
  muted: "#111D2E",
  fg: "#C8D8E8",
  mfg: "#5A7A9A",
  dim: "#3A5A7A",
  cyan: "#00C8FF",
  amber: "#F0A500",
  green: "#00E5A0",
  red: "#FF3355",
  purple: "#9B59B6",
  border: "rgba(0,200,255,0.12)",
  borderStrong: "rgba(0,200,255,0.24)",
  glow: "rgba(0,200,255,0.15)",
};
const FONT = {
  display: "'Exo 2', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const CHAR = {
  name: "Aura Veldaris",
  corp: "Kaalakiota Corporation",
  alliance: "The Caldari State",
  race: "Caldari",
  security: 2.4,
  sp: 87_430_221,
  isk: 2_847_301_450,
  ship: "Tengu",
  location: "Jita IV - Moon 4 - Caldari Navy Assembly Plant",
  clone: "Alpha-5 Neural Stack",
};

// Recent Activity on the Dashboard = the 5 most recent wallet-journal entries
// (journalToActivity in lib/dashboard.ts). Each row shows description + relative time;
// the icon/colour is derived purely from the ISK sign (credit/debit/neutral) — no amount shown.
const ACTIVITY = [
  { id: 1, text: "Bounty Prizes", time: "14m", amount: 14_240_000 },
  { id: 2, text: "Market Escrow", time: "1h", amount: -84_000_000 },
  { id: 3, text: "Market Transaction", time: "3h", amount: 11_640_000 },
  { id: 4, text: "Corporation Dividend", time: "5h", amount: 45_000_000 },
  { id: 5, text: "Brokers Fee", time: "8h", amount: -2_410_000 },
];

const QUEUE = [
  { id: 1, name: "Advanced Spaceship Command", level: 5, progress: 0.673, remaining: "4d 16h", sp: 768_000, sphr: 1847, active: true },
  { id: 2, name: "Caldari Defensive Systems", level: 4, progress: 0, remaining: "1d 8h", sp: 181_020, sphr: 1847, active: false },
  { id: 3, name: "Signature Analysis", level: 5, progress: 0, remaining: "6d 2h", sp: 1_024_000, sphr: 1847, active: false },
  { id: 4, name: "Long Range Targeting", level: 5, progress: 0, remaining: "5d 19h", sp: 896_000, sphr: 1847, active: false },
  { id: 5, name: "Tactical Shield Manipulation", level: 4, progress: 0, remaining: "2d 11h", sp: 362_040, sphr: 1847, active: false },
  { id: 6, name: "Thermodynamics", level: 4, progress: 0, remaining: "1d 22h", sp: 226_275, sphr: 1847, active: false },
];

const SKILLS_BY_CAT = [
  {
    cat: "Spaceship Command",
    sp: 24_300_000,
    skills: [
      { name: "Caldari Cruiser", level: 5, maxLevel: 5 },
      { name: "Caldari Battlecruiser", level: 4, maxLevel: 5 },
      { name: "Advanced Spaceship Command", level: 4, maxLevel: 5, training: true },
      { name: "Interceptors", level: 4, maxLevel: 5 },
    ],
  },
  {
    cat: "Navigation",
    sp: 9_400_000,
    skills: [
      { name: "Warp Drive Operation", level: 5, maxLevel: 5 },
      { name: "Navigation", level: 5, maxLevel: 5 },
      { name: "Afterburner", level: 5, maxLevel: 5 },
      { name: "Micro Jump Drive Operation", level: 3, maxLevel: 5 },
    ],
  },
  {
    cat: "Gunnery",
    sp: 18_100_000,
    skills: [
      { name: "Gunnery", level: 5, maxLevel: 5 },
      { name: "Small Hybrid Turret", level: 5, maxLevel: 5 },
      { name: "Medium Hybrid Turret", level: 5, maxLevel: 5 },
      { name: "Large Hybrid Turret", level: 4, maxLevel: 5 },
    ],
  },
];

// SP distribution for the refined Skills data-viz (sums ~ to total SP).
const SP_DIST = [
  { cat: "Spaceship Cmd", sp: 24_300_000, color: C.cyan },
  { cat: "Gunnery", sp: 18_100_000, color: C.amber },
  { cat: "Engineering", sp: 12_700_000, color: C.green },
  { cat: "Shields", sp: 11_200_000, color: C.purple },
  { cat: "Navigation", sp: 9_400_000, color: "#4FB0E0" },
  { cat: "Drones", sp: 6_800_000, color: "#E08A4F" },
  { cat: "Other", sp: 4_930_221, color: C.dim },
];

function formatISK(n) {
  const abs = Math.abs(n);
  if (abs >= 1e9) return (abs / 1e9).toFixed(2) + "b";
  if (abs >= 1e6) return (abs / 1e6).toFixed(1) + "m";
  if (abs >= 1e3) return (abs / 1e3).toFixed(0) + "k";
  return abs.toLocaleString();
}
function spM(n) {
  return (n / 1e6).toFixed(1) + "M";
}

// Offline-safe capsuleer portrait placeholder (stands in for the ESI portrait).
function Portrait({ size = 64, ring = C.cyan, glow = true }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        border: `1px solid ${ring}`,
        boxShadow: glow ? "0 0 14px rgba(0,200,255,0.3)" : "none",
        background:
          "radial-gradient(120% 90% at 50% 18%, #1d3a55 0%, #122236 45%, #08111c 100%)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,200,255,0.05) 0, rgba(0,200,255,0.05) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <svg viewBox="0 0 24 24" width={size * 0.78} height={size * 0.78} style={{ position: "relative", marginBottom: -size * 0.06 }}>
        <circle cx="12" cy="9" r="4.2" fill="none" stroke={ring} strokeWidth="1.3" opacity="0.85" />
        <path d="M4.5 21c0-4.2 3.6-6.4 7.5-6.4s7.5 2.2 7.5 6.4" fill="none" stroke={ring} strokeWidth="1.3" opacity="0.85" />
      </svg>
    </div>
  );
}

Object.assign(window, { C, FONT, CHAR, ACTIVITY, QUEUE, SKILLS_BY_CAT, SP_DIST, formatISK, spM, Portrait });
