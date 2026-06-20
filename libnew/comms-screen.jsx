// Comms screen + phone wrappers (design reference).
// CommsScreen is a PUSHED stack screen at (app)/comms, reached from the top-bar bell.
// It is NOT a new tab — the five status tabs stay full.
const { useState: useStateS } = React;

// Stack-style header (back chevron + title + online pill).
function CommsStackHeader({ title = "Comms", onBack }) {
  return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: C.surface, borderBottom: `1px solid ${C.borderStrong}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={onBack} style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,200,255,0.06)", border: `1px solid ${C.border}`, borderRadius: 4, cursor: "pointer" }}>
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

// The Comms screen body. `state`: 'loaded' | 'skeleton' | 'empty'. Defaults to the segment
// with unread (else Notifications). Each segment is scope-gated independently.
function CommsScreen({ segment, state = "loaded", notifMissing = false, mailMissing = false, onOpenMail, defaultOpenFirst }) {
  const data = buildComms({ notifMissing, mailMissing });
  const initial = segment || (data.unread.notifications >= data.unread.mail ? "notifications" : "mail");
  const [seg, setSeg] = useStateS(initial);
  const badges = { notifications: data.unread.notifications, mail: data.unread.mail };

  let body;
  if (seg === "notifications") {
    body = notifMissing ? <ScopeGate segment="notifications" />
      : state === "skeleton" ? <CommsSkeleton />
      : state === "empty" ? <CommsEmpty kind="notifications" />
      : <NotifList items={data.notifications} />;
  } else {
    body = mailMissing ? <ScopeGate segment="mail" />
      : state === "skeleton" ? <CommsSkeleton />
      : state === "empty" ? <CommsEmpty kind="mail" />
      : <MailList items={data.mail} onOpen={onOpenMail} />;
  }
  return (
    <div style={{ padding: "14px 16px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
      <CommsSegments value={seg} onChange={setSeg} badges={badges} />
      {body}
    </div>
  );
}

// ---- Phone wrappers ----
function commsFrame(children) {
  return (
    <div style={{ width: 380, flexShrink: 0, borderRadius: 44, padding: 11, background: "linear-gradient(160deg, #20262e, #0c0f13)", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)" }}>
      <div style={{ position: "relative", borderRadius: 34, overflow: "hidden", background: C.bg, height: 760, display: "flex", flexDirection: "column", border: "1px solid rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: 104, height: 26, background: "#000", borderRadius: 14, zIndex: 20 }} />
        {children}
      </div>
    </div>
  );
}

// Pushed-screen phone: StatusBar + CommsStackHeader + scroll + TabBar (Capsuleer stays active).
function CommsPhone({ title = "Comms", children }) {
  return commsFrame(
    <React.Fragment>
      <StatusBar refined />
      <CommsStackHeader title={title} />
      <div className="screen-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</div>
      <TabBar active="dashboard" refined />
    </React.Fragment>
  );
}

// Tab-style top nav WITH the bell (shows where the bell + badge live on the dashboard).
function CommsTopNav({ unread }) {
  return (
    <div style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: C.surface, borderBottom: `1px solid ${C.borderStrong}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <LogoMark />
        <span style={{ fontFamily: FONT.display, fontSize: 16, fontWeight: 700, color: C.fg, letterSpacing: "0.05em" }}>Overview</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <NotificationBell count={unread} />
        <Portrait size={30} glow={false} ring="rgba(0,200,255,0.4)" />
      </div>
    </div>
  );
}

// Dashboard phone that surfaces the bell in the top bar (entry point context).
function CommsBellContext({ children }) {
  const data = buildComms({});
  return commsFrame(
    <React.Fragment>
      <StatusBar refined />
      <CommsTopNav unread={data.unread.total} />
      <div className="screen-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>{children}</div>
      <TabBar active="dashboard" refined />
    </React.Fragment>
  );
}

// Mail detail pushed phone.
function MailDetailPhone({ mailId }) {
  const mail = mailBodyView(mailId);
  return commsFrame(
    <React.Fragment>
      <StatusBar refined />
      <CommsStackHeader title="Mail" />
      <div className="screen-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <MailDetail mail={mail} />
      </div>
      <TabBar active="dashboard" refined />
    </React.Fragment>
  );
}

Object.assign(window, { CommsStackHeader, CommsScreen, CommsPhone, CommsTopNav, CommsBellContext, MailDetailPhone, commsFrame });
