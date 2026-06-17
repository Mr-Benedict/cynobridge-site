// Real-app screens: Wallet (segments + chart), Assets (grouping + breakdown),
// Planetary (PI colonies), Roster. New Eden HUD vocabulary; reuses shared bits.

// ---- shared bits ----
function Pips({ level, max = 5, training = false }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < level;
        const isTraining = training && i === level;
        return (
          <div key={i} style={{
            width: 9, height: 9,
            background: filled ? C.cyan : isTraining ? "rgba(0,200,255,0.25)" : "transparent",
            border: filled ? "none" : `1px solid ${isTraining ? C.cyan : "#21344c"}`,
            boxShadow: filled ? "0 0 4px rgba(0,200,255,0.45)" : "none",
          }} />
        );
      })}
    </div>
  );
}

function AreaChart({ data, w = 320, h = 70, color = C.green }) {
  const min = Math.min(...data), max = Math.max(...data);
  const nx = (i) => (i / (data.length - 1)) * w;
  const ny = (v) => h - ((v - min) / (max - min || 1)) * (h - 8) - 4;
  const line = data.map((v, i) => `${nx(i).toFixed(1)},${ny(v).toFixed(1)}`).join(" ");
  const area = `0,${h} ${line} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#wgrad)" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 3px " + color + "66)" }} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function SegControl({ items, active }) {
  return (
    <div style={{ display: "flex", gap: 3, padding: 3, borderRadius: 4, background: C.muted, border: `1px solid ${C.border}` }}>
      {items.map((it) => {
        const on = it === active;
        return (
          <div key={it} style={{
            flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 3, cursor: "pointer",
            fontFamily: FONT.body, fontSize: 11.5, fontWeight: on ? 600 : 400,
            color: on ? C.bg : C.mfg,
            background: on ? C.cyan : "transparent",
          }}>{it}</div>
        );
      })}
    </div>
  );
}

function FilterChips({ items, active }) {
  return (
    <div style={{ display: "flex", gap: 7 }}>
      {items.map((it) => {
        const on = it === active;
        return (
          <div key={it} style={{
            padding: "5px 11px", borderRadius: 99, cursor: "pointer",
            fontFamily: FONT.body, fontSize: 11, fontWeight: on ? 600 : 400,
            color: on ? C.cyan : C.mfg,
            background: on ? "rgba(0,200,255,0.1)" : "transparent",
            border: `1px solid ${on ? "rgba(0,200,255,0.4)" : C.border}`,
          }}>{it}</div>
        );
      })}
    </div>
  );
}

// CopyExport stub (visual only)
function CopyExport() {
  const pill = { display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 4, cursor: "pointer", fontFamily: FONT.body, fontSize: 11, background: "rgba(0,200,255,0.08)", border: "1px solid rgba(0,200,255,0.25)", color: C.cyan };
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <div style={pill}><Icon name="copy" size={12} color={C.cyan} />Copy</div>
      <div style={pill}><Icon name="share" size={12} color={C.cyan} />Export</div>
    </div>
  );
}

// =================== WALLET ===================
function RefinedWallet() {
  const w = WALLET2;
  const tot = w.income + w.expense;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 16px 20px" }}>
      {/* Hero */}
      <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", padding: 16, background: "linear-gradient(165deg,#0f1b2b,#0b1320)", border: `1px solid ${C.borderStrong}` }}>
        <Brackets color={C.amber} size={13} inset={6} opacity={0.5} />
        <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Wallet Balance</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 600, color: C.amber, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>{w.balanceExact}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 14, color: C.mfg }}>ISK</span>
        </div>
        <div style={{ marginTop: 9, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <Icon name="trendUp" size={12} color={C.green} />
          <span style={{ fontFamily: FONT.mono, fontSize: 12, color: C.green }}>{w.netChange} ISK</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 12, color: C.green }}>({w.netPct})</span>
          <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg }}>· {w.windowText}</span>
        </div>
      </div>

      {/* Balance chart */}
      <div style={{ borderRadius: 4, padding: "13px 14px 10px", background: C.surface, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: C.mfg, textTransform: "uppercase", letterSpacing: "0.14em" }}>Balance · 30D</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.mfg }}>{w.balanceRange}</span>
        </div>
        <AreaChart data={w.series} color={C.cyan} h={64} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim }}>30d ago</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim }}>today</span>
        </div>
      </div>

      {/* Cashflow summary */}
      <div style={{ borderRadius: 4, padding: "14px 16px", background: C.surface, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.mfg, textTransform: "uppercase", letterSpacing: "0.08em" }}>Income · {w.window}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 600, color: C.green, marginTop: 3 }}>+{iskShort(w.income)}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.mfg, textTransform: "uppercase", letterSpacing: "0.08em" }}>Expenses</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 600, color: C.red, marginTop: 3 }}>−{iskShort(w.expense)}</div>
          </div>
        </div>
        <div style={{ display: "flex", height: 8, borderRadius: 2, overflow: "hidden", background: C.secondary }}>
          <div style={{ width: `${(w.income / tot) * 100}%`, background: C.green }} />
          <div style={{ width: `${(w.expense / tot) * 100}%`, background: C.red, opacity: 0.85 }} />
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: FONT.body, fontSize: 11.5, color: C.mfg, textTransform: "uppercase", letterSpacing: "0.06em" }}>Net flow</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 600, color: C.green }}>+{iskShort(w.income - w.expense)} ISK</span>
        </div>
      </div>

      {/* Segments */}
      <SegControl items={["Journal", "Transactions", "Orders"]} active="Journal" />

      <div>
        <RSection action={<CopyExport />}>Journal</RSection>
        <div style={{ marginBottom: 10 }}><FilterChips items={["All", "Income", "Expense"]} active="All" /></div>
        <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
          {w.journal.map((grp, gi) => (
            <React.Fragment key={grp.day}>
              <div style={{ padding: "8px 12px", background: "#0A1220", borderTop: gi > 0 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}`, fontFamily: FONT.mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mfg }}>{grp.day}</div>
              {grp.entries.map((t, i) => {
                const pos = t.amt >= 0; const col = pos ? C.green : C.red;
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                    <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: col + "1f", border: `1px solid ${col}44` }}>
                      <Icon name={pos ? "trendUp" : "arrowRight"} size={14} color={col} style={pos ? {} : { transform: "rotate(45deg)" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.fg }}>{t.ref}</div>
                      <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.mfg, marginTop: 1 }}>{t.sub}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontFamily: FONT.mono, fontSize: 12.5, fontWeight: 500, color: col }}>{pos ? "+" : "−"}{iskShort(Math.abs(t.amt))}</div>
                      <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim, marginTop: 1 }}>{t.time}</div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// =================== ASSETS ===================
function RefinedAssets() {
  const a = ASSETS2;
  const [open, setOpen] = React.useState("Jita IV - Moon 4");
  const btot = a.breakdown.reduce((s, b) => s + b.value, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 16px 20px" }}>
      {/* Summary hero */}
      <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", padding: 16, background: "linear-gradient(165deg,#0f1b2b,#0b1320)", border: `1px solid ${C.borderStrong}` }}>
        <Brackets color={C.amber} size={13} inset={6} opacity={0.5} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase" }}>Estimated Value</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 8.5, letterSpacing: "0.1em", color: C.mfg, padding: "2px 6px", borderRadius: 3, border: `1px solid ${C.border}`, background: C.muted }}>EST</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 600, color: C.amber, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>≈ {a.totalShort}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 14, color: C.mfg }}>ISK</span>
        </div>
        <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.mfg, marginTop: 8 }}>CCP average price · {a.pricedPct}% of items priced</div>
        <div style={{ display: "flex", marginTop: 15, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          {[["Items", a.itemCount.toLocaleString(), ""], ["Locations", String(a.locations.length), ""], ["Volume", a.volume, "m³"]].map((st, i) => (
            <React.Fragment key={st[0]}>
              {i > 0 && <div style={{ width: 1, alignSelf: "stretch", background: C.border, margin: "0 14px" }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 9.5, color: C.mfg, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{st[0]}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 600, color: C.fg }}>{st[1]}</span>
                  {st[2] && <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.mfg }}>{st[2]}</span>}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* breakdown bar */}
      <div style={{ borderRadius: 4, padding: "13px 14px", background: C.surface, border: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.mfg, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 9 }}>Value by location</div>
        <div style={{ display: "flex", height: 9, borderRadius: 2, overflow: "hidden", border: `1px solid ${C.borderStrong}` }}>
          {a.breakdown.map((b) => <div key={b.label} style={{ width: `${(b.value / btot) * 100}%`, background: b.color, opacity: 0.85 }} />)}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 11 }}>
          {a.breakdown.map((b) => (
            <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 1, background: b.color }} />
              <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.fg }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* grouping toggle + search */}
      <SegControl items={["By Location", "By Category"]} active="By Location" />
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 13px", borderRadius: 4, background: C.surface, border: `1px solid ${C.border}` }}>
        <Icon name="target" size={15} color={C.mfg} />
        <span style={{ flex: 1, fontFamily: FONT.body, fontSize: 12.5, color: C.dim }}>Search items…</span>
        <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg }}>Value ▾</span>
      </div>

      {/* location groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {a.locations.map((loc) => {
          const isOpen = open === loc.name;
          return (
            <div key={loc.name} style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${isOpen ? C.borderStrong : C.border}`, background: C.surface }}>
              <button onClick={() => setOpen(isOpen ? null : loc.name)} style={{ width: "100%", padding: "12px 13px", background: "transparent", border: "none", cursor: "pointer", display: "block" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="mapPin" size={16} color={C.cyan} />
                  <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                    <div style={{ fontFamily: FONT.display, fontSize: 13.5, fontWeight: 600, color: C.fg }}>{loc.name}</div>
                    <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.mfg, marginTop: 1 }}>{loc.region}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: FONT.mono, fontSize: 12.5, fontWeight: 500, color: C.amber }}>{iskShort(loc.value)}</div>
                    <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.mfg, marginTop: 1 }}>{loc.count} items</div>
                  </div>
                  <Icon name={isOpen ? "chevUp" : "chevDown"} size={15} color={C.mfg} />
                </div>
              </button>
              {isOpen && loc.items.length > 0 && (
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  {loc.items.map((it, i) => (
                    <div key={it.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 13px 9px 16px", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                      <Icon name={it.kind} size={14} color={C.mfg} />
                      <span style={{ flex: 1, fontFamily: FONT.body, fontSize: 12, color: C.fg }}>{it.name}</span>
                      <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg }}>×{it.qty.toLocaleString()}</span>
                      <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.amber, width: 50, textAlign: "right" }}>{it.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =================== PLANETARY ===================
function StatusBadge({ status }) {
  const meta = { extracting: ["Extracting", C.green], idle: ["Idle", C.mfg], expired: ["Expired", C.red] }[status];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 3, background: meta[1] + "1a", border: `1px solid ${meta[1]}55` }}>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: meta[1], boxShadow: status === "extracting" ? `0 0 5px ${meta[1]}` : "none" }} />
      <span style={{ fontFamily: FONT.mono, fontSize: 9.5, letterSpacing: "0.06em", textTransform: "uppercase", color: meta[1] }}>{meta[0]}</span>
    </div>
  );
}

function PlanetChip({ type, tint }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "2px 8px 2px 7px", borderRadius: 99, background: tint + "1a", border: `1px solid ${tint}55`, flexShrink: 0 }}>
      <span style={{ width: 7, height: 7, borderRadius: 99, background: tint, boxShadow: `0 0 5px ${tint}` }} />
      <span style={{ fontFamily: FONT.body, fontSize: 10.5, fontWeight: 500, color: tint }}>{type}</span>
    </div>
  );
}

function OutputChip({ out }) {
  const dot = out.kind === "extracted" ? C.cyan : C.amber;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 99, background: C.muted, border: `1px solid ${C.border}` }}>
      <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.fg }}>{out.name}</span>
      <span style={{ width: 5, height: 5, borderRadius: 99, background: dot }} />
    </div>
  );
}

function ExpiryBand({ col }) {
  // col = colony
  if (col.status === "expired") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 4, background: "rgba(255,51,85,0.1)", border: "1px solid rgba(255,51,85,0.45)" }}>
        <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,51,85,0.14)", border: "1px solid rgba(255,51,85,0.5)" }}>
          <Icon name="alert" size={18} color={C.red} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 600, color: C.red }}>EXPIRED</div>
          <div style={{ fontFamily: FONT.body, fontSize: 11, color: "#E08597", marginTop: 2 }}>ended {col.endedAgo} ago · re-arm in-game</div>
        </div>
      </div>
    );
  }
  if (col.status === "idle") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 4, background: C.muted, border: `1px solid ${C.border}` }}>
        <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(90,122,154,0.12)", border: `1px solid ${C.border}` }}>
          <Icon name="alert" size={16} color={C.mfg} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 600, color: C.mfg }}>No active program</div>
          <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.dim, marginTop: 2 }}>Extractor idle · not extracting</div>
        </div>
      </div>
    );
  }
  const urgent = col.urgent;
  const c = urgent ? C.amber : C.cyan;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 4, background: urgent ? "rgba(240,165,0,0.07)" : "rgba(0,200,255,0.05)", border: `1px solid ${urgent ? "rgba(240,165,0,0.3)" : C.border}` }}>
      <Ring value={col.fraction} size={42} stroke={4} color={c}>
        <Icon name="clock" size={13} color={c} />
      </Ring>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT.body, fontSize: 9.5, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>Expires in</div>
        <div style={{ fontFamily: FONT.mono, fontSize: 18, fontWeight: 600, color: c }}>{col.expiresIn}</div>
      </div>
    </div>
  );
}

function ColonyCard({ col }) {
  const [open, setOpen] = React.useState(!!col.open);
  return (
    <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", border: `1px solid ${open ? C.borderStrong : C.border}`, background: C.surface }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: col.tint, opacity: col.status === "expired" ? 0.9 : 0.7 }} />
      <button onClick={() => setOpen(!open)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", padding: "12px 13px 13px 16px", display: "block" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{ flex: 1, minWidth: 0, fontFamily: FONT.display, fontSize: 15, fontWeight: 600, color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{col.planet}</span>
          <PlanetChip type={col.type} tint={col.tint} />
          <Icon name={open ? "chevUp" : "chevDown"} size={15} color={C.mfg} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 9, marginBottom: 12 }}>
          <Pips level={col.upgrade} />
          <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg }}>Lv {col.upgrade}</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.dim }}>·</span>
          <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg }}>{col.pins} pins</span>
          <span style={{ marginLeft: "auto" }}><StatusBadge status={col.status} /></span>
        </div>
        <div style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}><ExpiryBand col={col} /></div>
          <div style={{ flexShrink: 0, minWidth: 84, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-end" }}>
            <span style={{ fontFamily: FONT.body, fontSize: 9, color: C.mfg, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Stored</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 600, color: col.stored == null ? C.dim : C.amber }}>{iskShort(col.stored)}</span>
          </div>
        </div>
        {col.outputs.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 12 }}>
            {col.outputs.map((o) => <OutputChip key={o.name} out={o} />)}
          </div>
        )}
      </button>
      {open && col.extractor && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: "13px 13px 13px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><Icon name="target" size={12} color={C.cyan} /><span style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, color: C.mfg, letterSpacing: "0.12em", textTransform: "uppercase" }}>Extractor</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT.body, fontSize: 12, color: C.fg }}>
              <span>{col.extractor.product}</span>
              <span style={{ fontFamily: FONT.mono, color: C.cyan }}>{col.extractor.rate}</span>
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg, marginTop: 3 }}>{col.extractor.heads} extractor heads</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><Icon name="cpu" size={12} color={C.amber} /><span style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, color: C.mfg, letterSpacing: "0.12em", textTransform: "uppercase" }}>Factories</span></div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{col.factories.map((f) => <OutputChip key={f} out={{ name: f, kind: "produced" }} />)}</div>
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}><Icon name="package" size={12} color={C.green} /><span style={{ fontFamily: FONT.display, fontSize: 11, fontWeight: 700, color: C.mfg, letterSpacing: "0.12em", textTransform: "uppercase" }}>Storage</span></div>
            {col.storage.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ flex: 1, fontFamily: FONT.body, fontSize: 12, color: C.fg }}>{s.name}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg }}>×{s.qty}</span>
                <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.amber, width: 50, textAlign: "right" }}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RefinedPlanetary() {
  const p = PLANETARY, s = p.summary;
  const atot = p.alloc.reduce((x, a) => x + a.value, 0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 16px 20px" }}>
      {/* summary */}
      <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", padding: 16, background: "linear-gradient(165deg,#0f1b2b,#0b1320)", border: `1px solid ${C.borderStrong}` }}>
        <Brackets color={C.amber} size={13} inset={6} opacity={0.5} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <Icon name="clock" size={12} color={C.amber} />
              <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Next extractor expiry</span>
            </div>
            <div style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 600, color: s.urgent ? C.amber : C.fg, lineHeight: 1 }}>{s.nextExpiry}</div>
            <div style={{ marginTop: 7, fontFamily: FONT.body, fontSize: 10.5, color: C.mfg }}>
              <span style={{ color: C.red }}>{s.expired} expired</span> · {s.extracting} of {s.colonyCount} extracting
            </div>
          </div>
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 5 }}>Stored</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, justifyContent: "flex-end" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 20, fontWeight: 600, color: C.amber }}>{iskShort(s.totalStored)}</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 12, color: C.mfg }}>ISK</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 15, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          {[["Colonies", s.colonyCount, C.fg], ["Extracting", s.extracting, C.green], ["Expired", s.expired, C.red], ["Pins", s.totalPins, C.fg]].map((st, i) => (
            <React.Fragment key={st[0]}>
              {i > 0 && <div style={{ width: 1, alignSelf: "stretch", background: C.border, margin: "0 14px" }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 9.5, color: C.mfg, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{st[0]}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 600, color: st[2] }}>{st[1]}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* allocation */}
      <div>
        <RSection action={<span style={{ fontFamily: FONT.mono, fontSize: 8.5, letterSpacing: "0.1em", color: C.mfg, padding: "2px 6px", borderRadius: 3, border: `1px solid ${C.border}`, background: C.muted, textTransform: "uppercase" }}>Est</span>}>Stored value by colony</RSection>
        <div style={{ display: "flex", height: 9, borderRadius: 2, overflow: "hidden", border: `1px solid ${C.borderStrong}` }}>
          {p.alloc.map((a) => <div key={a.label} style={{ width: `${(a.value / atot) * 100}%`, background: a.color, opacity: 0.85 }} />)}
        </div>
      </div>

      {/* colonies */}
      <div>
        <RSection action={<CopyExport />}>Colonies</RSection>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {p.colonies.map((col) => <ColonyCard key={col.planet} col={col} />)}
        </div>
      </div>
    </div>
  );
}

// =================== ROSTER ===================
function RefinedRoster() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {ROSTER.map((c) => (
          <div key={c.id} style={{ borderRadius: 4, border: `1px solid ${c.active ? C.cyan : C.border}`, background: C.surface, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <Portrait size={48} ring={c.active ? C.cyan : "rgba(0,200,255,0.25)"} glow={c.active} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, color: C.fg }}>{c.name}</div>
              <div style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg, marginTop: 2 }}>ID: {c.id}</div>
            </div>
            {c.active && (
              <div style={{ padding: "2px 9px", borderRadius: 4, background: "rgba(0,200,255,0.12)", border: `1px solid ${C.cyan}` }}>
                <span style={{ fontFamily: FONT.body, fontSize: 11, fontWeight: 600, color: C.cyan }}>Active</span>
              </div>
            )}
            <span style={{ fontFamily: FONT.body, fontSize: 15, color: C.mfg, padding: "0 4px" }}>✕</span>
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${C.border}` }}>
        <div style={{ border: `1px solid ${C.cyan}`, borderRadius: 4, padding: "13px 0", textAlign: "center", minHeight: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: FONT.body, fontSize: 15, fontWeight: 500, color: C.cyan }}>+ Add character</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RefinedWallet, RefinedAssets, RefinedPlanetary, RefinedRoster });
