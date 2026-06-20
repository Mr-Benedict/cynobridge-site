// Phone frame + chrome shared by both the current and refined screens.
const TABS = [
  { id: "dashboard", label: "Capsuleer", icon: "user" },
  { id: "skills", label: "Skills", icon: "cpu" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "assets", label: "Assets", icon: "package" },
  { id: "planetary", label: "Planetary", icon: "globe" },
];
const TITLES = { dashboard: "Overview", skills: "Skill Queue", wallet: "Wallet", assets: "Assets", planetary: "Planetary" };

// HUD corner brackets — EVE-style angular framing for hero cards.
function Brackets({ color = C.cyan, size = 13, w = 1.5, inset = -1, opacity = 0.9 }) {
  const base = { position: "absolute", width: size, height: size, pointerEvents: "none", opacity };
  return (
    <React.Fragment>
      <div style={{ ...base, top: inset, left: inset, borderTop: `${w}px solid ${color}`, borderLeft: `${w}px solid ${color}` }} />
      <div style={{ ...base, top: inset, right: inset, borderTop: `${w}px solid ${color}`, borderRight: `${w}px solid ${color}` }} />
      <div style={{ ...base, bottom: inset, left: inset, borderBottom: `${w}px solid ${color}`, borderLeft: `${w}px solid ${color}` }} />
      <div style={{ ...base, bottom: inset, right: inset, borderBottom: `${w}px solid ${color}`, borderRight: `${w}px solid ${color}` }} />
    </React.Fragment>
  );
}

function StatusBar({ refined }) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px 4px",
        background: C.bg,
      }}
    >
      <span style={{ fontFamily: FONT.mono, fontSize: 12, color: refined ? C.fg : C.mfg }}>09:41</span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: FONT.body,
          fontSize: 9,
          color: C.cyan,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.cyan, boxShadow: "0 0 5px " + C.cyan }} />
        New Eden
      </div>
      <svg width="16" height="11" viewBox="0 0 14 10" fill="none">
        <rect x="0" y="5" width="2.5" height="5" rx="0.5" fill={C.mfg} />
        <rect x="3.5" y="3" width="2.5" height="7" rx="0.5" fill={C.mfg} />
        <rect x="7" y="1" width="2.5" height="9" rx="0.5" fill={C.cyan} />
        <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill={C.cyan} />
      </svg>
    </div>
  );
}

function LogoMark({ size = 24 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,200,255,0.1)",
        border: "1px solid rgba(0,200,255,0.35)",
      }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 12 12" fill="none">
        <polygon points="6,1 11,4 11,8 6,11 1,8 1,4" stroke={C.cyan} strokeWidth="1" fill="none" />
        <polygon points="6,3.5 8.5,5 8.5,7 6,8.5 3.5,7 3.5,5" fill={C.cyan} fillOpacity="0.4" />
      </svg>
    </div>
  );
}

function TopNav({ tab, refined }) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: refined ? "12px 16px" : "12px 16px",
        background: C.surface,
        borderBottom: `1px solid ${refined ? C.borderStrong : C.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <LogoMark />
        <span
          style={{
            fontFamily: FONT.display,
            fontSize: refined ? 16 : 15,
            fontWeight: 700,
            color: C.fg,
            letterSpacing: "0.05em",
          }}
        >
          {TITLES[tab]}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {refined && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: 2,
              background: "rgba(0,229,160,0.1)",
              border: "1px solid rgba(0,229,160,0.25)",
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, boxShadow: "0 0 5px " + C.green }} />
            <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.green }}>ONLINE</span>
          </div>
        )}
        <div style={{ position: "relative", width: refined ? 30 : 28, height: refined ? 30 : 28 }}>
          <Portrait size={refined ? 30 : 28} glow={false} ring="rgba(0,200,255,0.4)" />
        </div>
      </div>
    </div>
  );
}

function TabBar({ active, refined }) {
  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "stretch",
        background: C.surface,
        borderTop: `1px solid ${refined ? C.borderStrong : C.border}`,
      }}
    >
      {TABS.map((t) => {
        const isActive = t.id === active;
        const color = isActive ? C.cyan : refined ? "#46688a" : C.dim;
        return (
          <button
            key={t.id}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              padding: refined ? "9px 0 11px" : "8px 0",
              minHeight: refined ? 56 : 48,
              position: "relative",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isActive && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 24,
                  height: 2,
                  background: C.cyan,
                  boxShadow: "0 0 8px rgba(0,200,255,0.8)",
                  borderRadius: "0 0 2px 2px",
                }}
              />
            )}
            <Icon
              name={t.icon}
              size={refined ? 21 : 18}
              color={color}
              stroke={isActive ? 2.2 : 1.9}
              style={{ filter: isActive ? "drop-shadow(0 0 4px rgba(0,200,255,0.6))" : "none" }}
            />
            <span
              style={{
                fontFamily: FONT.body,
                fontSize: refined ? 10.5 : 9,
                fontWeight: isActive ? 600 : 400,
                color,
                letterSpacing: "0.02em",
              }}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// The device. children = scrollable screen content.
function PhoneFrame({ tab, refined, children }) {
  return (
    <div
      style={{
        width: 380,
        flexShrink: 0,
        borderRadius: 44,
        padding: 11,
        background: "linear-gradient(160deg, #20262e, #0c0f13)",
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: 34,
          overflow: "hidden",
          background: C.bg,
          height: 760,
          display: "flex",
          flexDirection: "column",
          border: "1px solid rgba(0,0,0,0.8)",
        }}
      >
        {/* notch */}
        <div
          style={{
            position: "absolute",
            top: 9,
            left: "50%",
            transform: "translateX(-50%)",
            width: 104,
            height: 26,
            background: "#000",
            borderRadius: 14,
            zIndex: 20,
          }}
        />
        <StatusBar refined={refined} />
        <TopNav tab={tab} refined={refined} />
        <div className="screen-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </div>
        <TabBar active={tab} refined={refined} />
      </div>
    </div>
  );
}

Object.assign(window, { Brackets, PhoneFrame, TopNav, TabBar, StatusBar, LogoMark, TABS });
