// REFINED Dashboard — stronger hero, dominant "Now Training" module, bigger type, HUD framing.

function RefinedDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 16px 20px" }}>
      {/* Capsuleer hero */}
      <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "linear-gradient(165deg,#0f1b2b,#0b1320)", border: `1px solid ${C.borderStrong}`, boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,200,255,0.25)" }}>
        <div style={{ position: "absolute", top: -40, left: -10, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,200,255,0.18), transparent 70%)", pointerEvents: "none" }} />
        <Brackets color={C.cyan} size={14} inset={6} opacity={0.55} />
        <div style={{ display: "flex", gap: 14, padding: "16px 16px 14px", position: "relative" }}>
          <Portrait size={76} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <h2 style={{ margin: 0, fontFamily: FONT.display, color: C.fg, fontSize: 20, fontWeight: 700, letterSpacing: "0.01em", lineHeight: 1.1 }}>{CHAR.name}</h2>
                <p style={{ margin: "5px 0 0", fontFamily: FONT.body, color: C.cyan, fontSize: 12.5, fontWeight: 500 }}>{CHAR.corp}</p>
                <p style={{ margin: "1px 0 0", fontFamily: FONT.body, color: C.mfg, fontSize: 11.5 }}>{CHAR.alliance}</p>
              </div>
              <div style={{ flexShrink: 0, textAlign: "center", padding: "4px 9px", borderRadius: 3, background: "rgba(0,229,160,0.1)", border: `1px solid rgba(0,229,160,0.4)` }}>
                <div style={{ fontFamily: FONT.mono, color: C.green, fontSize: 15, fontWeight: 600, lineHeight: 1 }}>+{CHAR.security.toFixed(1)}</div>
                <div style={{ fontFamily: FONT.body, color: C.mfg, fontSize: 8.5, letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>Sec</div>
              </div>
            </div>
          </div>
        </div>
        {/* Figures */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: `1px solid ${C.border}` }}>
          <div style={{ padding: "12px 16px", borderRight: `1px solid ${C.border}` }}>
            <Figure label="Skill Points" value="87.4" unit="M SP" color={C.cyan} />
          </div>
          <div style={{ padding: "12px 16px" }}>
            <Figure label="Net Worth" value="2.85" unit="B ISK" color={C.amber} />
          </div>
        </div>
        {/* Location */}
        <div style={{ padding: "9px 16px", display: "flex", alignItems: "center", gap: 9, background: "#0A1220", borderTop: `1px solid ${C.border}` }}>
          <Icon name="mapPin" size={13} color={C.green} />
          <span style={{ fontFamily: FONT.body, fontSize: 11.5, color: C.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{CHAR.location}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.mfg, flexShrink: 0 }}>1.0</span>
        </div>
      </div>

      {/* NOW TRAINING — dominant module */}
      <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "linear-gradient(135deg, rgba(0,200,255,0.1), rgba(0,200,255,0.03))", border: `1px solid rgba(0,200,255,0.35)` }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: C.cyan, boxShadow: "0 0 10px rgba(0,200,255,0.7)" }} />
        <div style={{ padding: "14px 16px 14px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
              <Icon name="zap" size={13} color={C.cyan} />
              <span style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: C.cyan, letterSpacing: "0.14em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Now Training</span>
            </div>
            <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.mfg, whiteSpace: "nowrap", flexShrink: 0 }}>+1,847 SP/h</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Ring value={0.673} size={76} stroke={7} color={C.cyan}>
              <span style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 600, color: C.fg, lineHeight: 1 }}>67%</span>
              <span style={{ fontFamily: FONT.body, fontSize: 8.5, color: C.mfg, letterSpacing: "0.08em", marginTop: 2 }}>LVL V</span>
            </Ring>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontFamily: FONT.display, fontSize: 16, fontWeight: 600, color: C.fg, lineHeight: 1.2 }}>Advanced Spaceship Command</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8, whiteSpace: "nowrap" }}>
                <span style={{ fontFamily: FONT.mono, fontSize: 19, fontWeight: 600, color: C.fg }}>4d 16h</span>
                <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg }}>remaining</span>
              </div>
              <div style={{ marginTop: 8, fontFamily: FONT.mono, fontSize: 11, color: C.mfg }}>
                Queue · <span style={{ color: C.fg }}>6 skills</span> · <span style={{ color: C.amber }}>21d 6h</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[
          { label: "Active Ship", value: CHAR.ship, sub: "Strategic Cruiser", icon: "rocket", color: C.cyan },
          { label: "Home Clone", value: "Jita IV - M4", sub: null, icon: "shield", color: C.green },
          { label: "PI Colonies", value: "5", sub: "Active", icon: "layers", color: C.amber },
        ].map((s) => (
          <div key={s.label} style={{ position: "relative", borderRadius: 4, padding: "11px 11px 12px", background: C.surface, border: `1px solid ${C.border}`, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: s.color, opacity: 0.7 }} />
            <Icon name={s.icon} size={15} color={s.color} />
            <div style={{ fontFamily: FONT.body, fontSize: 9.5, fontWeight: 500, color: C.mfg, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 9 }}>{s.label}</div>
            <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 700, color: C.fg, marginTop: 3 }}>{s.value}</div>
            {s.sub && <div style={{ fontFamily: FONT.body, fontSize: 9.5, color: C.dim, marginTop: 1 }}>{s.sub}</div>}
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div>
        <RSection action={<button style={{ display: "flex", alignItems: "center", gap: 3, background: "transparent", border: "none", color: C.cyan, fontFamily: FONT.body, fontSize: 11.5, cursor: "pointer" }}>All<Icon name="chevRight" size={13} color={C.cyan} /></button>}>Recent Activity</RSection>
        <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
          {ACTIVITY.map((a, i) => {
            const tone = a.amount == null || a.amount === 0 ? C.mfg : a.amount > 0 ? C.green : C.red;
            const ic = a.amount == null || a.amount === 0 ? "activity" : a.amount > 0 ? "trendUp" : "trendDown";
            return (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: tone + "1f", border: `1px solid ${tone}44` }}>
                  <Icon name={ic} size={14} color={tone} />
                </div>
                <span style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.fg, flex: 1, lineHeight: 1.3 }}>{a.text}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg, flexShrink: 0 }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.RefinedDashboard = RefinedDashboard;
