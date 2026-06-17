// Shared refined-screen building blocks: progress ring, section label, SP allocation bar.

function Ring({ value, size = 64, stroke = 6, color = C.cyan, track = "#16263c", children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ * (1 - value);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
          style={{ filter: "drop-shadow(0 0 4px rgba(0,200,255,0.5))", transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function RSection({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: C.mfg, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
      {action}
    </div>
  );
}

// Figure block: big mono number with label + optional delta.
function Figure({ label, value, unit, color, delta, deltaColor }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3, whiteSpace: "nowrap" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 23, fontWeight: 600, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ fontFamily: FONT.mono, fontSize: 12, color: C.mfg, flexShrink: 0 }}>{unit}</span>}
      </div>
      {delta && (
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 5 }}>
          <Icon name="trendUp" size={11} color={deltaColor} />
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: deltaColor }}>{delta}</span>
        </div>
      )}
    </div>
  );
}

function SPAllocBar() {
  const total = SP_DIST.reduce((s, d) => s + d.sp, 0);
  return (
    <div>
      <div style={{ display: "flex", height: 10, borderRadius: 2, overflow: "hidden", border: `1px solid ${C.borderStrong}` }}>
        {SP_DIST.map((d) => (
          <div key={d.cat} title={d.cat} style={{ width: `${(d.sp / total) * 100}%`, background: d.color, opacity: 0.85 }} />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 12 }}>
        {SP_DIST.slice(0, 6).map((d) => (
          <div key={d.cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 1, background: d.color }} />
            <span style={{ fontFamily: FONT.body, fontSize: 11.5, color: C.fg }}>{d.cat}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.mfg }}>{spM(d.sp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Ring, RSection, Figure, SPAllocBar });
