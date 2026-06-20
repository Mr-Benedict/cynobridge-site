// Lightweight geometric icon set — lucide-style strokes, EVE HUD flavor.
// Exposed on window for the other Babel scripts.
const ICONS = {
  user: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </g>
  ),
  cpu: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.5" y="9.5" width="5" height="5" />
      <path d="M9 6V3M15 6V3M9 21v-3M15 21v-3M6 9H3M6 15H3M21 9h-3M21 15h-3" />
    </g>
  ),
  wallet: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14" r="1.1" fill={c} stroke="none" />
    </g>
  ),
  package: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8l-9-5-9 5v8l9 5 9-5z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </g>
  ),
  bars: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="20" x2="6" y2="11" />
      <line x1="12" y1="20" x2="12" y2="5" />
      <line x1="18" y1="20" x2="18" y2="14" />
    </g>
  ),
  shield: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
    </g>
  ),
  zap: (c) => (
    <g fill={c} stroke="none">
      <path d="M13.5 2L4 14h6l-1.5 8L19 9.5h-6.2z" />
    </g>
  ),
  clock: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </g>
  ),
  chevRight: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5l7 7-7 7" />
    </g>
  ),
  chevDown: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9l7 7 7-7" />
    </g>
  ),
  chevUp: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 15l7-7 7 7" />
    </g>
  ),
  alert: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5l9 16H3z" />
      <line x1="12" y1="9.5" x2="12" y2="14" />
      <circle cx="12" cy="16.8" r="0.7" fill={c} stroke="none" />
    </g>
  ),
  plus: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </g>
  ),
  trendUp: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 16.5l6-6 4 4 7.5-7.5" />
      <path d="M16 7h4.5v4.5" />
    </g>
  ),
  mapPin: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21c5-5 7-8 7-11a7 7 0 10-14 0c0 3 2 6 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </g>
  ),
  target: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" fill={c} stroke="none" />
    </g>
  ),
  activity: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l3 8 4-16 3 8h4" />
    </g>
  ),
  flame: (c) => (
    <g fill={c} stroke="none">
      <path d="M12 2.5c2.4 3.2 4.6 5.3 4.6 8.6a4.6 4.6 0 11-8.7-2c.3 1.4 1.2 2 2 2.1-.5-2.7.6-5.8 2.1-8.7z" />
    </g>
  ),
  arrowRight: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="12" x2="19" y2="12" />
      <path d="M13 6l6 6-6 6" />
    </g>
  ),
  layers: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </g>
  ),
  gauge: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16a8 8 0 0116 0" />
      <line x1="12" y1="16" x2="15.5" y2="10.5" />
      <circle cx="12" cy="16" r="1.3" fill={c} stroke="none" />
    </g>
  ),
  check: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5l4.5 4.5L19 6.5" />
    </g>
  ),
  star: (c) => (
    <g fill={c} stroke="none">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1.1 6.1L12 17.1 6.4 20l1.1-6.1L3.1 9.5l6.1-.9z" />
    </g>
  ),
  grid: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </g>
  ),
  rocket: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c3.5 2 5 5 5 9l-2.5 2.5h-5L7 12c0-4 1.5-7 5-9z" />
      <circle cx="12" cy="9" r="1.6" />
      <path d="M9.5 17c-1 1.5-1 3.5-1 4 0 0 2 0 3.5-1M14.5 17c1 1.5 1 3.5 1 4" />
    </g>
  ),
  copy: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5" />
    </g>
  ),
  share: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </g>
  ),
  globe: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <ellipse cx="12" cy="12" rx="3.6" ry="8.5" />
      <path d="M3.5 12h17M4.7 7.5h14.6M4.7 16.5h14.6" />
    </g>
  ),
  cube: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </g>
  ),
  factory: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21V10l6 4V10l6 4V6l3 1.5V21z" />
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="7.5" y1="17.5" x2="7.5" y2="17.5" />
    </g>
  ),
  fileText: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="16.5" x2="13" y2="16.5" />
    </g>
  ),
  bell: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </g>
  ),
  crosshair: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="7" />
      <line x1="12" y1="2.5" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="21.5" y2="12" />
      <circle cx="12" cy="12" r="1.2" fill={c} stroke="none" />
    </g>
  ),
  arrowUpRight: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M9 7h8v8" />
    </g>
  ),
  arrowDownLeft: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 7L7 17M15 17H7V9" />
    </g>
  ),
  search: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16" y1="16" x2="21" y2="21" />
    </g>
  ),
  x: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </g>
  ),
  filter: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5h18l-7 8v5l-4 2v-7z" />
    </g>
  ),
  refresh: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" />
      <path d="M4 20v-4h4" />
    </g>
  ),
  // ---- comms additions ----
  mail: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </g>
  ),
  mailOpen: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 10l9 6 9-6" />
    </g>
  ),
  inbox: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13l2.5-8h11L20 13" />
      <path d="M4 13h5l1.5 3h3L14 13h6v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </g>
  ),
  shieldAlert: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4-3 7-7 9-4-2-7-5-7-9V6z" />
      <line x1="12" y1="8.5" x2="12" y2="12.5" />
      <circle cx="12" cy="15.4" r="0.6" fill={c} stroke="none" />
    </g>
  ),
  swords: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 3.5H19V8l-8.5 8.5" />
      <path d="M9.5 3.5H5V8l8.5 8.5" />
      <line x1="4" y1="20" x2="7.5" y2="16.5" />
      <line x1="20" y1="20" x2="16.5" y2="16.5" />
    </g>
  ),
  gradCap: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 8.5L12 4l9.5 4.5L12 13z" />
      <path d="M6.5 10.5V16c0 1 2.5 2.5 5.5 2.5s5.5-1.5 5.5-2.5v-5.5" />
      <line x1="21.5" y1="8.5" x2="21.5" y2="13" />
    </g>
  ),
  receipt: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 3h14v18l-2.5-1.5L14 21l-2-1.5L10 21l-2.5-1.5L5 21z" />
      <line x1="8.5" y1="8" x2="15.5" y2="8" />
      <line x1="8.5" y1="11.5" x2="15.5" y2="11.5" />
    </g>
  ),
  skull: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c4.5 0 7.5 3 7.5 7 0 2.4-1.2 3.7-2 4.4V18H6.5v-3.6c-.8-.7-2-2-2-4.4 0-4 3-7 7.5-7z" />
      <circle cx="9" cy="11" r="1.3" fill={c} stroke="none" />
      <circle cx="15" cy="11" r="1.3" fill={c} stroke="none" />
      <line x1="9.5" y1="18" x2="9.5" y2="20.5" />
      <line x1="12" y1="18" x2="12" y2="20.5" />
      <line x1="14.5" y1="18" x2="14.5" y2="20.5" />
    </g>
  ),
  megaphone: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11v2a1 1 0 0 0 1 1h2l7 4V6l-7 4H4a1 1 0 0 0-1 1z" />
      <path d="M16 8.5a4 4 0 0 1 0 7" />
    </g>
  ),
  pickaxe: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 9.5c4-3 9.5-3 15 0" />
      <path d="M9 7.5c-1-1.5-3-2.5-5-2.5M15 7.5c1-1.5 3-2.5 5-2.5" />
      <line x1="11" y1="9.5" x2="11" y2="20" />
      <line x1="13" y1="9.5" x2="13" y2="20" />
    </g>
  ),
};

function Icon({ name, size = 18, color = "currentColor", stroke = 2, style }) {
  const render = ICONS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      {render ? render(color, stroke) : null}
    </svg>
  );
}

window.Icon = Icon;
