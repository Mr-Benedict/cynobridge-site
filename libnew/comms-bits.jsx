// Comms presentational components (design reference, browser/React-DOM).
// Reuses C, FONT (data.jsx), Icon (icons.jsx), Brackets (shell.jsx),
// COMMS_TONE / relTimeC / fullTimeC / parseNotification / groupNotifications (comms-data.jsx).
const { useState: useStateB } = React;

// ---- Top-bar NotificationBell — glyph + unread badge. Hidden count when zero. ----
function NotificationBell({ count = 0, active }) {
  return (
    <button style={{ position: "relative", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "rgba(0,200,255,0.1)" : "rgba(0,200,255,0.05)", border: `1px solid ${active ? "rgba(0,200,255,0.4)" : C.border}`, borderRadius: 4, cursor: "pointer" }}>
      <Icon name="bell" size={17} color={active ? C.cyan : C.mfg} stroke={1.9} />
      {count > 0 ? (
        <span style={{ position: "absolute", top: -6, right: -6, minWidth: 16, height: 16, padding: "0 4px", display: "flex", alignItems: "center", justifyContent: "center", background: C.amber, color: "#1A1200", fontFamily: FONT.mono, fontSize: 9.5, fontWeight: 600, borderRadius: 99, border: "1.5px solid " + C.surface, boxShadow: "0 0 6px rgba(240,165,0,0.6)" }}>{count > 99 ? "99+" : count}</span>
      ) : null}
    </button>
  );
}

// ---- Two-up segmented control: Notifications | Mail (ports WalletSegments) ----
function CommsSegments({ value, onChange, badges }) {
  const segs = [["notifications", "Notifications", "bell"], ["mail", "Mail", "mail"]];
  return (
    <div style={{ display: "flex", padding: 3, gap: 3, background: C.muted, borderRadius: 5, border: `1px solid ${C.border}` }}>
      {segs.map(([k, lbl, glyph]) => {
        const on = value === k, n = badges ? badges[k] : 0;
        return (
          <button key={k} onClick={() => onChange && onChange(k)} style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "8px 0", borderRadius: 3, cursor: "pointer", background: on ? "rgba(0,200,255,0.14)" : "transparent", border: on ? "1px solid rgba(0,200,255,0.45)" : "1px solid transparent", fontFamily: FONT.body, fontSize: 12.5, fontWeight: on ? 600 : 400, color: on ? C.cyan : C.mfg }}>
            <Icon name={glyph} size={14} color={on ? C.cyan : C.mfg} stroke={1.9} />
            {lbl}
            {n > 0 ? <span style={{ fontFamily: FONT.mono, fontSize: 9.5, color: on ? "#1A1200" : C.amber, background: on ? C.amber : "rgba(240,165,0,0.14)", borderRadius: 99, minWidth: 15, height: 15, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>{n}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

// ---- NotificationRow — type icon + tone, title, relative time, unread dot.
// Tap expands the parsed body in place (Skills accordion interaction). ----
function NotificationRow({ n, first, defaultOpen }) {
  const [open, setOpen] = useStateB(!!defaultOpen);
  const tone = COMMS_TONE(C)[n.tone];
  return (
    <div style={{ borderTop: first ? "none" : `1px solid ${C.border}` }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: tone + "1f", border: `1px solid ${tone}44` }}>
          <Icon name={n.icon} size={15} color={tone} stroke={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            {!n.read ? <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, flexShrink: 0, boxShadow: "0 0 5px " + C.cyan }} /> : null}
            <span style={{ fontFamily: FONT.body, fontSize: 12.5, fontWeight: n.read ? 400 : 600, color: n.read ? C.mfg : C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</span>
          </div>
          {n.subtitle ? <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.mfg, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingLeft: n.read ? 0 : 13 }}>{n.subtitle}</div> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
          <span style={{ fontFamily: FONT.mono, fontSize: 9.5, color: C.dim }}>{relTimeC(n.time, NOW_C)}</span>
          <Icon name={open ? "chevUp" : "chevDown"} size={13} color={C.dim} stroke={2} />
        </div>
      </button>
      {open ? (
        <div style={{ padding: "0 12px 13px 53px" }}>
          <div style={{ borderLeft: `2px solid ${tone}55`, paddingLeft: 11, fontFamily: FONT.body, fontSize: 12, color: C.fg, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{n.body}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 9 }}>
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: C.dim }}>{fullTimeC(n.time)}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 9, color: C.dim, padding: "1px 6px", borderRadius: 3, background: "rgba(0,200,255,0.06)", border: `1px solid ${C.border}` }}>{n.group}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NotifList({ items }) {
  if (!items.length) return <CommsEmpty kind="notifications" />;
  const groups = groupNotifications(items);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {groups.map((g) => (
        <div key={g.label}>
          <div style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.dim, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 7, paddingLeft: 2 }}>{g.label}</div>
          <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
            {g.items.map((it, i) => <NotificationRow key={it.id} n={it} first={i === 0} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- MailRow — unread dot, subject, "from ‹sender›", label tag, relative time. Tap → detail. ----
function MailRow({ m, first, onOpen }) {
  return (
    <button onClick={() => onOpen && onOpen(m)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "11px 12px", borderTop: first ? "none" : `1px solid ${C.border}`, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
      <div style={{ width: 30, height: 30, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: m.read ? "rgba(90,122,154,0.1)" : "rgba(0,200,255,0.12)", border: `1px solid ${m.read ? C.border : "rgba(0,200,255,0.4)"}` }}>
        <Icon name={m.isList ? "megaphone" : m.read ? "mailOpen" : "mail"} size={15} color={m.read ? C.mfg : C.cyan} stroke={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {!m.read ? <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, flexShrink: 0, boxShadow: "0 0 5px " + C.cyan }} /> : null}
          <span style={{ fontFamily: FONT.body, fontSize: 12.5, fontWeight: m.read ? 400 : 600, color: m.read ? C.mfg : C.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.subject}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, paddingLeft: m.read ? 0 : 13 }}>
          <span style={{ fontFamily: FONT.body, fontSize: 10.5, color: C.mfg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>from {m.sender}</span>
          {m.label ? <span style={{ fontFamily: FONT.mono, fontSize: 8.5, color: C.cyan, textTransform: "uppercase", letterSpacing: "0.04em", padding: "1px 5px", borderRadius: 3, background: "rgba(0,200,255,0.08)", border: `1px solid ${C.border}`, flexShrink: 0 }}>{m.label}</span> : null}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: 9.5, color: C.dim }}>{relTimeC(m.time, NOW_C)}</span>
        <Icon name="chevRight" size={13} color={C.dim} stroke={2} />
      </div>
    </button>
  );
}

function MailList({ items, onOpen }) {
  if (!items.length) return <CommsEmpty kind="mail" />;
  return (
    <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
      {items.map((m, i) => <MailRow key={m.id} m={m} first={i === 0} onOpen={onOpen} />)}
    </div>
  );
}

// ---- MailDetail — subject, from, date, sanitized selectable body. Read-only (no reply). ----
function MailDetail({ mail, onBack }) {
  return (
    <div style={{ padding: "14px 16px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ position: "relative", borderRadius: 4, border: `1px solid ${C.borderStrong}`, background: C.surface, padding: "15px 15px 16px", overflow: "hidden" }}>
        <Brackets color={C.cyan} size={12} inset={6} opacity={0.5} />
        <div style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.fg, lineHeight: 1.25, letterSpacing: "0.01em" }}>{mail.subject}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 11 }}>
          <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,200,255,0.1)", border: `1px solid ${C.border}` }}>
            <Icon name={mail.isList ? "megaphone" : "user"} size={14} color={C.cyan} stroke={2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: FONT.body, fontSize: 12.5, color: C.fg }}>{mail.sender}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 9.5, color: C.dim }}>{fullTimeC(mail.time)}{mail.label ? " · " + mail.label : ""}</div>
          </div>
        </div>
      </div>
      <div style={{ borderRadius: 4, border: `1px solid ${C.border}`, background: C.surface, padding: "16px 15px", fontFamily: FONT.body, fontSize: 13, color: C.fg, lineHeight: 1.65, whiteSpace: "pre-wrap", userSelect: "text" }}>{mail.body}</div>
      <CopyExport />
      <div style={{ fontFamily: FONT.mono, fontSize: 9.5, color: C.dim, textAlign: "center" }}>Read-only — Cyno Bridge never sends, replies, or marks mail in-game.</div>
    </div>
  );
}

// ---- Per-segment scope gate (ReloginNotice) — block ONLY this segment, never the app. ----
function ScopeGate({ segment }) {
  const label = segment === "mail" ? "Mail" : "Notifications";
  const glyph = segment === "mail" ? "mail" : "bell";
  return (
    <div style={{ borderRadius: 4, border: `1px dashed rgba(240,165,0,0.4)`, background: "rgba(240,165,0,0.06)", padding: "30px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 11 }}>
      <div style={{ width: 44, height: 44, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(240,165,0,0.12)", border: "1px solid rgba(240,165,0,0.3)" }}>
        <Icon name={glyph} size={20} color={C.amber} />
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 600, color: C.fg }}>{label} needs a re-login</div>
      <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.mfg, maxWidth: 250, lineHeight: 1.5 }}>Grant the {label.toLowerCase()} scope to read this here. The rest of Comms keeps working.</div>
      <button style={{ marginTop: 2, padding: "7px 16px", borderRadius: 4, cursor: "pointer", fontFamily: FONT.body, fontSize: 12, fontWeight: 600, background: "rgba(240,165,0,0.14)", border: "1px solid rgba(240,165,0,0.4)", color: C.amber }}>Re-login to enable {label}</button>
    </div>
  );
}

// ---- Empty / Skeleton / Copy ----
function CommsEmpty({ kind }) {
  const isMail = kind === "mail";
  return (
    <div style={{ borderRadius: 4, border: `1px dashed ${C.borderStrong}`, background: C.surface, padding: "38px 24px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
      <div style={{ width: 44, height: 44, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,200,255,0.08)", border: `1px solid ${C.border}` }}>
        <Icon name={isMail ? "inbox" : "bell"} size={20} color={C.mfg} />
      </div>
      <div style={{ fontFamily: FONT.display, fontSize: 14, fontWeight: 600, color: C.fg }}>{isMail ? "No mail" : "No notifications"}</div>
      <div style={{ fontFamily: FONT.body, fontSize: 12, color: C.mfg, maxWidth: 230, lineHeight: 1.5 }}>{isMail ? "Your EVEMail inbox is empty for this window. Pull to refresh." : "Nothing new from New Eden in the last few weeks. Pull to refresh."}</div>
    </div>
  );
}

function CopyExport() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 4, cursor: "pointer", background: "rgba(0,200,255,0.08)", border: `1px solid ${C.border}`, fontFamily: FONT.body, fontSize: 11.5, fontWeight: 600, color: C.cyan }}>
        <Icon name="copy" size={12} color={C.cyan} stroke={2} /> Copy
      </button>
      <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 4, cursor: "pointer", background: "rgba(0,200,255,0.08)", border: `1px solid ${C.border}`, fontFamily: FONT.body, fontSize: 11.5, fontWeight: 600, color: C.cyan }}>
        <Icon name="share" size={12} color={C.cyan} stroke={2} /> Export
      </button>
    </div>
  );
}

function CommsSkelRow({ first }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 12px", borderTop: first ? "none" : `1px solid ${C.border}` }}>
      <div style={{ width: 30, height: 30, borderRadius: 3, background: C.secondary }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 9, width: "58%", borderRadius: 2, background: C.secondary }} />
        <div style={{ height: 7, width: "38%", borderRadius: 2, background: C.muted, marginTop: 6 }} />
      </div>
      <div style={{ height: 8, width: 26, borderRadius: 2, background: C.secondary }} />
    </div>
  );
}
function CommsSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[0, 1].map((g) => (
        <div key={g}>
          <div style={{ height: 8, width: 70, borderRadius: 2, background: C.muted, marginBottom: 8, marginLeft: 2 }} />
          <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
            {[0, 1, 2].map((i) => <CommsSkelRow key={i} first={i === 0} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  NotificationBell, CommsSegments, NotificationRow, NotifList,
  MailRow, MailList, MailDetail, ScopeGate, CommsEmpty, CopyExport, CommsSkeleton,
});
