// Activity presentational components (design reference, browser/React-DOM).
// Reuses C, FONT, formatISK (data.jsx), Icon (icons.jsx), Brackets (shell.jsx),
// SOURCE_META / TONE_COLOR / relTime (activity-data.jsx).

function iskAbbr(n) { return formatISK(Math.abs(n)); }

// "est." qualifier pill — reuse the shared EstChip look.
function EstChip() {
  return (
    <span style={{ fontFamily: FONT.mono, fontSize: 8.5, color: C.amber, letterSpacing: "0.06em", padding: "1px 4px", borderRadius: 3, background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.3)", textTransform: "uppercase" }}>est.</span>
  );
}

// Source icon chip — glyph identifies the source, tone colour the valence.
function SourceChip({ item, size = 30 }) {
  const tone = TONE_COLOR(C)[item.tone];
  let glyph = SOURCE_META[item.source].glyph;
  if (item.source === "wallet") glyph = item.amount >= 0 ? "arrowUpRight" : "arrowDownLeft";
  return (
    <div style={{ width: size, height: size, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: tone + "1f", border: `1px solid ${tone}44` }}>
      <Icon name={glyph} size={size * 0.5} color={tone} stroke={2} />
    </div>
  );
}

// One activity row. `compact` trims the dashboard preview a touch.
function ActivityRow({ item, first, compact }) {
  const tone = TONE_COLOR(C)[item.tone];
  const hasAmount = item.amount !== undefined && item.amount !== null;
  const pos = hasAmount && item.amount >= 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: compact ? "9px 12px" : "10px 12px", borderTop: first ? "none" : `1px solid ${C.border}`, cursor: "pointer" }}>
      <SourceChip item={item} size={compact ? 28 : 30} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
        {item.subtitle ? (
          <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.mfg, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.subtitle}</div>
        ) : null}
      </div>
      <div style={{ textAlign: "right", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
        {hasAmount ? (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {item.estimated ? <EstChip /> : null}
            <span style={{ fontFamily: FONT.mono, fontSize: 12.5, fontWeight: 500, color: pos ? C.green : C.red }}>{pos ? "+" : "−"}{iskAbbr(item.amount)}</span>
          </div>
        ) : (
          <span style={{ fontFamily: FONT.mono, fontSize: 10.5, color: SOURCE_META[item.source] ? C.mfg : C.mfg, textTransform: "uppercase", letterSpacing: "0.04em" }}>{SOURCE_META[item.source].label}</span>
        )}
        <span style={{ fontFamily: FONT.mono, fontSize: 9.5, color: C.dim }}>{relTime(item.date, NOW)}</span>
      </div>
    </div>
  );
}

// Source filter chips — All · Wallet · Industry · Contracts · Combat · Notifications.
// Client-side filter over the merged list (no refetch). Active = cyan tint + source glyph.
const FILTERS = [
  ["all", "All", null],
  ["wallet", "Wallet", "arrowUpRight"],
  ["industry", "Industry", "factory"],
  ["contracts", "Contracts", "fileText"],
  ["combat", "Combat", "crosshair"],
  ["notification", "Comms", "bell"],
];
function ActivityFilterChips({ value, onChange, counts }) {
  return (
    <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 2, msOverflowStyle: "none", scrollbarWidth: "none" }}>
      {FILTERS.map(([k, lbl, glyph]) => {
        const on = value === k;
        const n = counts ? counts[k] : undefined;
        return (
          <button key={k} onClick={() => onChange(k)} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0, padding: "5px 12px", borderRadius: 99, cursor: "pointer", fontFamily: FONT.body, fontSize: 11.5, fontWeight: on ? 600 : 400, background: on ? "rgba(0,200,255,0.14)" : "transparent", border: `1px solid ${on ? "rgba(0,200,255,0.45)" : C.border}`, color: on ? C.cyan : C.mfg, whiteSpace: "nowrap" }}>
            {glyph ? <Icon name={glyph} size={12} color={on ? C.cyan : C.mfg} stroke={1.9} /> : null}
            {lbl}
            {n !== undefined ? <span style={{ fontFamily: FONT.mono, fontSize: 9.5, color: on ? C.cyan : C.dim }}>{n}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

// Inline "some sources need a re-login" affordance (ReloginNotice). Non-fatal: the
// feed still shows everything it can; this just offers to bring the missing ones in.
function ReloginNotice({ missing }) {
  if (!missing || missing.length === 0) return null;
  const labels = missing.map((s) => SOURCE_META[s].label).join(" · ");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 4, background: "rgba(240,165,0,0.07)", border: "1px solid rgba(240,165,0,0.28)", marginBottom: 12 }}>
      <Icon name="alert" size={16} color={C.amber} stroke={2} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT.body, fontSize: 11.5, color: C.fg }}>Some sources need a re-login</div>
        <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.mfg, marginTop: 1 }}>{labels} aren't in this feed yet.</div>
      </div>
      <button style={{ flexShrink: 0, padding: "5px 11px", borderRadius: 4, cursor: "pointer", fontFamily: FONT.body, fontSize: 11, fontWeight: 600, background: "rgba(240,165,0,0.14)", border: "1px solid rgba(240,165,0,0.4)", color: C.amber }}>Re-login</button>
    </div>
  );
}

// Search field — debounced free-text filter over the merged list (client-side, no
// refetch). Leading magnifier, trailing clear (x) once non-empty. `count` shows live
// result tally to the right of the placeholder context.
function ActivitySearchBar({ value, onChange, resultCount, focused }) {
  const active = value.length > 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 12px", height: 40, borderRadius: 4, background: C.surface, border: `1px solid ${focused || active ? "rgba(0,200,255,0.45)" : C.border}`, transition: "border-color 0.12s" }}>
      <Icon name="search" size={15} color={active || focused ? C.cyan : C.mfg} stroke={2} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search activity — ship, system, type…"
        style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: C.fg, fontFamily: FONT.body, fontSize: 12.5, padding: 0 }}
      />
      {active ? (
        <React.Fragment>
          <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.dim, whiteSpace: "nowrap" }}>{resultCount}</span>
          <button onClick={() => onChange("")} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 3, background: "rgba(0,200,255,0.08)", border: "none", cursor: "pointer", flexShrink: 0 }}>
            <Icon name="x" size={12} color={C.mfg} stroke={2.2} />
          </button>
        </React.Fragment>
      ) : null}
    </div>
  );
}

// No-results state for a query that matches nothing (distinct from the cold empty feed).
function NoSearchResults({ query }) {
  return (
    <div style={{ borderRadius: 4, border: `1px dashed ${C.borderStrong}`, background: C.surface, padding: "34px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 9 }}>
      <div style={{ width: 42, height: 42, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,200,255,0.08)", border: `1px solid ${C.border}` }}>
        <Icon name="search" size={18} color={C.mfg} />
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 600, color: C.fg }}>No matches</div>
      <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.mfg, maxWidth: 240, lineHeight: 1.5 }}>
        Nothing in the current feed matches “<span style={{ color: C.cyan }}>{query}</span>”. Try a ship, system, or source name.
      </div>
    </div>
  );
}

// Day-grouped list (TODAY / YESTERDAY / date) — mirrors groupJournalByDay.
function dayLabel(iso) {
  const d = new Date(iso), n = new Date(NOW);
  const days = Math.floor((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if (days <= 0) return "TODAY";
  if (days === 1) return "YESTERDAY";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}
function groupByDay(items) {
  const out = [], idx = {};
  items.forEach((it) => {
    const lbl = dayLabel(it.date);
    if (idx[lbl] === undefined) { idx[lbl] = out.length; out.push({ label: lbl, items: [] }); }
    out[idx[lbl]].items.push(it);
  });
  return out;
}

function ActivityList({ items }) {
  if (items.length === 0) return <EmptyActivity />;
  const groups = groupByDay(items);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {groups.map((g) => (
        <div key={g.label}>
          <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, paddingLeft: 2 }}>{g.label}</div>
          <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
            {g.items.map((it, i) => <ActivityRow key={it.id} item={it} first={i === 0} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyActivity() {
  return (
    <div style={{ borderRadius: 4, border: `1px dashed ${C.borderStrong}`, background: C.surface, padding: "38px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
      <div style={{ width: 44, height: 44, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,200,255,0.08)", border: `1px solid ${C.border}` }}>
        <Icon name="activity" size={20} color={C.mfg} />
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 600, color: C.fg }}>No recent activity</div>
      <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.mfg, maxWidth: 230, lineHeight: 1.5 }}>Nothing has happened across your sources in the last while. Pull to refresh.</div>
    </div>
  );
}

// Dashboard "Recent Activity" card (the existing slot, richer multi-source input).
function DashRecentActivity({ items }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontFamily: FONT.display, fontSize: 12, fontWeight: 700, color: C.mfg, letterSpacing: "0.14em", textTransform: "uppercase" }}>Recent Activity</span>
        <button style={{ display: "flex", alignItems: "center", gap: 3, background: "transparent", border: "none", cursor: "pointer", fontFamily: FONT.body, fontSize: 12, fontWeight: 600, color: C.cyan }}>
          All <Icon name="chevRight" size={13} color={C.cyan} stroke={2.2} />
        </button>
      </div>
      <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
        {items.map((it, i) => <ActivityRow key={it.id} item={it} first={i === 0} compact />)}
      </div>
    </div>
  );
}

// Skeleton rows (first paint).
function SkelRow({ first }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderTop: first ? "none" : `1px solid ${C.border}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 3, background: C.secondary }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 9, width: "62%", borderRadius: 2, background: C.secondary }} />
        <div style={{ height: 7, width: "40%", borderRadius: 2, background: C.muted, marginTop: 6 }} />
      </div>
      <div style={{ height: 9, width: 44, borderRadius: 2, background: C.secondary }} />
    </div>
  );
}
function ActivitySkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[0, 1].map((g) => (
        <div key={g}>
          <div style={{ height: 8, width: 70, borderRadius: 2, background: C.muted, marginBottom: 8, marginLeft: 2 }} />
          <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
            {[0, 1, 2].map((i) => <SkelRow key={i} first={i === 0} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  EstChip, SourceChip, ActivityRow, ActivityFilterChips, ReloginNotice,
  ActivityList, EmptyActivity, DashRecentActivity, ActivitySkeleton, groupByDay,
  ActivitySearchBar, NoSearchResults,
});
