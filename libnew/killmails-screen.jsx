// Killmails screen (design reference, browser/React-DOM) — built to match the store
// screenshot. Reuses C, FONT, formatISK (data.jsx), Icon (icons.jsx), Brackets (shell.jsx),
// StackHeader (activity-screen.jsx). A read-only combat log: kills + losses, est. ISK value.

// EVE security-status colour.
function secColor(sec) {
  if (sec >= 0.5) return "#4FD675";
  if (sec > 0.0) return C.amber;
  return C.red;
}

// --- Fixtures shaped like the killmails feed (recent/ + public detail + est. value). ---
const KM_NOW = "fixed";
const KILLMAILS = [
  { id: 1, kind: "kill", ship: "Caracal",          sys: "Perimeter", sec: 1.0, value: "32.2m",  time: "14m", involved: 3,  finalBlow: "you",        day: "TODAY" },
  { id: 2, kind: "kill", ship: "Vexor Navy Issue", sys: "Tama",      sec: 0.3, value: "81.6m",  time: "2h",  involved: 12, finalBlow: "Vel Tannor",  day: "TODAY" },
  { id: 3, kind: "kill", ship: "Machariel",        sys: "1DH-SX",    sec: 0.0, value: "268.0m", time: "6h",  involved: 28, finalBlow: "Mara Quill",  day: "TODAY" },
  { id: 4, kind: "loss", ship: "Tengu",            sys: "Tama",      sec: 0.3, value: "535.9m", time: "7h",  involved: 5,  finalBlow: "Unknown",     day: "TODAY" },
  { id: 5, kind: "loss", ship: "Caracal",          sys: "Perimeter", sec: 1.0, value: "30.9m",  time: "21h", involved: 1,  finalBlow: "Unknown",     day: "YESTERDAY" },
  { id: 6, kind: "kill", ship: "Drake",            sys: "Tama",      sec: 0.3, value: "43.7m",  time: "1d",  involved: 9,  finalBlow: "you",         day: "YESTERDAY" },
];

const KM_SUMMARY = { kills: 4, losses: 2, efficiency: 43, destroyed: "425.4m", lost: "566.8m" };

function KmEst() {
  return (
    <span style={{ fontFamily: FONT.mono, fontSize: 8.5, color: C.amber, letterSpacing: "0.06em", padding: "1px 4px", borderRadius: 3, background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.3)", textTransform: "uppercase" }}>est.</span>
  );
}

// Ship thumbnail — framed render-style box, tinted by kill/loss.
function ShipThumb({ kind }) {
  const tone = kind === "kill" ? C.green : C.red;
  return (
    <div style={{ position: "relative", width: 50, height: 50, flexShrink: 0, borderRadius: 5, overflow: "hidden", border: `1px solid ${tone}66`, background: "linear-gradient(150deg, #16222f 0%, #0b131d 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 30% 20%, ${tone}22, transparent 70%)` }} />
      <Icon name="rocket" size={22} color={tone} stroke={1.6} style={{ transform: "rotate(45deg)", opacity: 0.85 }} />
    </div>
  );
}

function KmTag({ kind }) {
  const kill = kind === "kill";
  const tone = kill ? C.green : C.red;
  return (
    <span style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", color: tone, textTransform: "uppercase", padding: "2px 7px", borderRadius: 3, background: tone + "14", border: `1px solid ${tone}44` }}>{kill ? "KILL" : "LOSS"}</span>
  );
}

function KillmailRow({ k, first }) {
  const kill = k.kind === "kill";
  const tone = kill ? C.green : C.red;
  return (
    <div style={{ display: "flex", gap: 12, padding: "13px 13px", borderTop: first ? "none" : `1px solid ${C.border}`, alignItems: "flex-start", cursor: "pointer" }}>
      <ShipThumb kind={k.kind} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
            <KmTag kind={k.kind} />
            <span style={{ fontFamily: FONT.display, fontSize: 15, fontWeight: 600, color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.ship}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 500, color: tone }}>{k.value}</span>
            <KmEst />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            <Icon name="mapPin" size={12} color={C.mfg} stroke={2} />
            <span style={{ fontFamily: FONT.body, fontSize: 12, color: C.mfg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{k.sys}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 12, fontWeight: 600, color: secColor(k.sec) }}>{k.sec.toFixed(1)}</span>
          </div>
          <span style={{ fontFamily: FONT.mono, fontSize: 11, color: C.dim, flexShrink: 0 }}>{k.time}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6 }}>
          <Icon name="crosshair" size={11} color={C.dim} stroke={2} />
          <span style={{ fontFamily: FONT.body, fontSize: 11.5, color: C.dim }}>
            {k.involved} involved · final blow <span style={{ color: k.finalBlow === "you" ? C.cyan : C.mfg }}>{k.finalBlow}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function KmSummaryStat({ label, value, unit, color }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginTop: 6 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 600, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</span>
        {unit ? <span style={{ fontFamily: FONT.mono, fontSize: 13, color: C.mfg }}>{unit}</span> : null}
      </div>
    </div>
  );
}

function KmValueBox({ label, glyph, value, tone }) {
  return (
    <div style={{ flex: 1, minWidth: 0, position: "relative", borderRadius: 5, padding: "11px 13px", background: tone + "0d", border: `1px solid ${tone}33` }}>
      <div style={{ fontFamily: FONT.body, fontSize: 9.5, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 6 }}>
        <Icon name={glyph} size={15} color={tone} stroke={2} />
        <span style={{ fontFamily: FONT.mono, fontSize: 17, fontWeight: 600, color: tone }}>{value}</span>
        <KmEst />
      </div>
    </div>
  );
}

function KillmailsSummary() {
  const s = KM_SUMMARY;
  return (
    <div style={{ position: "relative", borderRadius: 6, border: `1px solid ${C.borderStrong}`, background: C.surface, padding: "18px 16px 16px" }}>
      <Brackets color={C.cyan} size={13} inset={6} opacity={0.6} />
      <div style={{ display: "flex", gap: 10 }}>
        <KmSummaryStat label="Kills" value={s.kills} color={C.green} />
        <KmSummaryStat label="Losses" value={s.losses} color={C.red} />
        <KmSummaryStat label="ISK Efficiency" value={s.efficiency} unit="%" color={C.fg} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <KmValueBox label="Destroyed" glyph="crosshair" value={s.destroyed} tone={C.green} />
        <KmValueBox label="Lost" glyph="skull" value={s.lost} tone={C.red} />
      </div>
    </div>
  );
}

function KmFilterChips({ value = "all" }) {
  const chips = [["all", "All", 6], ["kill", "Kills", 4], ["loss", "Losses", 2]];
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {chips.map(([k, lbl, n]) => {
        const on = value === k;
        return (
          <button key={k} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, cursor: "pointer", fontFamily: FONT.body, fontSize: 12, fontWeight: on ? 600 : 400, background: on ? "rgba(0,200,255,0.14)" : "transparent", border: `1px solid ${on ? "rgba(0,200,255,0.45)" : C.border}`, color: on ? C.cyan : C.mfg }}>
            {lbl}<span style={{ fontFamily: FONT.mono, fontSize: 10, color: on ? C.cyan : C.dim }}>{n}</span>
          </button>
        );
      })}
    </div>
  );
}

function KillmailsScreen({ filter = "all" }) {
  const items = filter === "all" ? KILLMAILS : KILLMAILS.filter((k) => k.kind === filter);
  const days = [];
  const idx = {};
  items.forEach((k) => { if (idx[k.day] === undefined) { idx[k.day] = days.length; days.push({ label: k.day, items: [] }); } days[idx[k.day]].items.push(k); });
  return (
    <div style={{ padding: "14px 16px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
      <KillmailsSummary />
      <KmFilterChips value={filter} />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {days.map((g) => (
          <div key={g.label}>
            <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, paddingLeft: 2 }}>{g.label}</div>
            <div style={{ borderRadius: 5, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
              {g.items.map((k, i) => <KillmailRow key={k.id} k={k} first={i === 0} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pushed-screen phone: StatusBar + StackHeader("Killmails") + scroll + TabBar.
function KillmailsPhone() {
  return (
    <div style={{ width: 380, flexShrink: 0, borderRadius: 44, padding: 11, background: "linear-gradient(160deg, #20262e, #0c0f13)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)" }}>
      <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", background: C.bg, height: 760, display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: 104, height: 26, background: "#000", borderRadius: 14, zIndex: 20 }} />
        <StatusBar refined />
        <StackHeader title="Killmails" />
        <div className="screen-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <KillmailsScreen />
        </div>
        <TabBar active="dashboard" refined />
      </div>
    </div>
  );
}

Object.assign(window, { KillmailsScreen, KillmailsPhone });
