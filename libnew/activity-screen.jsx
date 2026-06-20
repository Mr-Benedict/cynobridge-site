// Activity screen + dashboard-in-context wrappers (design reference).
// The Activity screen is a PUSHED stack screen at (app)/activity — reached from the
// dashboard "Recent Activity → All" and the record tiles. It is NOT a new tab.

// Stack-style header (back chevron + title), distinct from the tab TopNav.
function StackHeader({ title }) {
  return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: C.surface, borderBottom: `1px solid ${C.borderStrong}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,200,255,0.06)", border: `1px solid ${C.border}`, borderRadius: 4, cursor: "pointer" }}>
          <Icon name="chevRight" size={16} color={C.cyan} stroke={2.2} style={{ transform: "scaleX(-1)" }} />
        </button>
        <span style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.fg, letterSpacing: "0.05em" }}>{title}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 2, background: "rgba(0,229,160,0.1)", border: "1px solid rgba(0,229,160,0.25)" }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, boxShadow: "0 0 5px " + C.green }} />
        <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.green }}>ONLINE</span>
      </div>
    </div>
  );
}

// Phone wrapper for a pushed screen: StatusBar + StackHeader + scroll + TabBar (Capsuleer
// stays active — the stack sits above the tabs).
function ActivityPhone({ title = "Activity", children }) {
  return (
    <div style={{ width: 380, flexShrink: 0, borderRadius: 44, padding: 11, background: "linear-gradient(160deg, #20262e, #0c0f13)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)" }}>
      <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", background: C.bg, height: 760, display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: 104, height: 26, background: "#000", borderRadius: 14, zIndex: 20 }} />
        <StatusBar refined />
        <StackHeader title={title} />
        <div className="screen-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</div>
        <TabBar active="dashboard" refined />
      </div>
    </div>
  );
}

// The Activity screen body. `state`: 'loaded' | 'skeleton' | 'empty'.
// Search + source filter both run client-side over the merged feed (no refetch).
// Order: search narrows first → chip narrows → day-group. Chip counts always reflect
// the *searched* set so the chips stay honest while typing.
function ActivityScreen({ filter = "all", missing = [], state = "loaded", query = "" }) {
  const all = buildFeed({ missing });
  const searched = matchActivity(all, query);
  const items = filter === "all" ? searched : searched.filter((it) => it.source === filter);
  const counts = { all: searched.length };
  FILTERS.forEach(([k]) => { if (k !== "all") counts[k] = searched.filter((it) => it.source === k).length; });
  return (
    <div style={{ padding: "14px 16px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      <ActivitySearchBar value={query} onChange={() => {}} resultCount={searched.length} />
      <ActivityFilterChips value={filter} onChange={() => {}} counts={counts} />
      <ReloginNotice missing={missing} />
      {state === "skeleton" ? <ActivitySkeleton />
        : state === "empty" ? <EmptyActivity />
        : items.length === 0 && query ? <NoSearchResults query={query} />
        : <ActivityList items={items} />}
    </div>
  );
}

// ---- Dashboard, lower portion: record tiles (entry points) + Recent Activity card. ----
function RecordTile({ glyph, label, value, sub, color }) {
  return (
    <div style={{ flex: 1, minWidth: 0, position: "relative", borderRadius: 4, padding: "12px 12px 13px", background: C.surface, border: `1px solid ${C.border}`, cursor: "pointer" }}>
      <Icon name={glyph} size={17} color={color} stroke={2} />
      <div style={{ fontFamily: FONT.body, fontSize: 9.5, color: C.mfg, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 9 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 3 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 18, fontWeight: 600, color: C.fg, lineHeight: 1 }}>{value}</span>
        <span style={{ fontFamily: FONT.body, fontSize: 9.5, color: C.dim }}>{sub}</span>
      </div>
    </div>
  );
}

function DashboardActivityContext() {
  const preview = buildFeed({ limit: 5 });
  return (
    <ActivityPhoneAsTab>
      <div style={{ padding: "16px 16px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: C.mfg, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Records</div>
          <div style={{ display: "flex", gap: 10 }}>
            <RecordTile glyph="factory" label="Industry" value="2" sub="active" color={C.cyan} />
            <RecordTile glyph="fileText" label="Contracts" value="1" sub="open" color={C.green} />
            <RecordTile glyph="crosshair" label="Killmails" value="2" sub="recent" color={C.red} />
          </div>
        </div>
        <DashRecentActivity items={preview} />
      </div>
    </ActivityPhoneAsTab>
  );
}

// Tab-style phone (Overview header + tab bar) for the dashboard context shot.
function ActivityPhoneAsTab({ children }) {
  return (
    <div style={{ width: 380, flexShrink: 0, borderRadius: 44, padding: 11, background: "linear-gradient(160deg, #20262e, #0c0f13)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)" }}>
      <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", background: C.bg, height: 760, display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: 104, height: 26, background: "#000", borderRadius: 14, zIndex: 20 }} />
        <StatusBar refined />
        <TopNav tab="dashboard" refined />
        <div className="screen-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</div>
        <TabBar active="dashboard" refined />
      </div>
    </div>
  );
}

Object.assign(window, { StackHeader, ActivityPhone, ActivityScreen, DashboardActivityContext, RecordTile });
