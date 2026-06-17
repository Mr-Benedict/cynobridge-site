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
  trendDown: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7.5l6 6 4-4 7.5 7.5" />
      <path d="M16 17h4.5v-4.5" />
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
  globe: (c, sw) => (
    <g fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
