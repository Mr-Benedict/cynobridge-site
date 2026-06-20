// Comms (Notifications + Mail) — design-reference data layer.
// Mirrors the plan's contract: src/lib/notifications.ts (parseNotification, groupNotifications,
// unreadCount) + src/lib/mail.ts (sanitizeMailBody, mailUnread) + the useComms() composing hook.
// Fixtures below are shaped EXACTLY like the real ESI payloads (verified against the swagger),
// so the helpers here are honest ports — drop-in logic for the RN lib files.
//
//   CharacterNotification : { notification_id, type, sender_id, sender_type, timestamp, is_read, text(YAML) }
//   MailHeader            : { mail_id, subject, from, timestamp, is_read, labels:[int], recipients:[{recipient_id,recipient_type}] }
//   MailBody              : { subject, from, timestamp, body(EVE-formatted), labels, read, recipients }
//   MailLabel             : { label_id, name, color, unread_count }
//   MailList              : { mailing_list_id, name }

const COMMS_TONE = (C) => ({ positive: C.green, negative: C.red, neutral: C.cyan, alert: C.amber });

// Relative-time label from an ISO date against a fixed `now` (pure; injected now).
function relTimeC(iso, now) {
  const ms = now - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return "now";
  if (m < 60) return m + "m";
  const h = Math.round(m / 60);
  if (h < 24) return h + "h";
  const d = Math.round(h / 24);
  if (d < 7) return d + "d";
  return Math.round(d / 7) + "w";
}
function fullTimeC(iso) {
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) + " EVE";
}

// ===========================================================================
//  RAW FIXTURES — shaped exactly like the ESI responses.
// ===========================================================================
const NOW_C = new Date("2026-06-19T09:41:00Z").getTime();
const agoC = (mins) => new Date(NOW_C - mins * 60000).toISOString();

// GET /characters/{id}/notifications/  (scope: esi-characters.read_notifications.v1)
// `text` is a YAML-ish block of `key: value` lines — parse defensively, never throw.
const RAW_NOTIFS = [
  { notification_id: 90001, type: "StructureUnderAttack", sender_id: 1000125, sender_type: "corporation", is_read: false, timestamp: agoC(38),
    text: "shieldPercentage: 64.3\narmorPercentage: 100.0\nhullPercentage: 100.0\nsolarsystemID: 30045349\nstructureID: 1035600000001\nstructureTypeID: 35832\n" },
  { notification_id: 90002, type: "KillReportFinalBlow", sender_id: 1000125, sender_type: "corporation", is_read: false, timestamp: agoC(96),
    text: "killMailID: 110002\nkillMailHash: a4b1c9\nvictimID: 92796241\nvictimShipTypeID: 621\nsolarSystemID: 30000144\n" },
  { notification_id: 90003, type: "WarDeclared", sender_id: 1000137, sender_type: "corporation", is_read: false, timestamp: agoC(255),
    text: "againstID: 98000001\ncost: 5000000.0\ndeclaredByID: 98765432\ndelayHours: 24\nhostileState: false\n" },
  { notification_id: 90004, type: "SkillTrainingCompleted", sender_id: 1000125, sender_type: "corporation", is_read: true, timestamp: agoC(362),
    text: "auraID: 1\nskillTypeID: 3330\n" },
  { notification_id: 90005, type: "MoonminingExtractionFinished", sender_id: 1000125, sender_type: "corporation", is_read: true, timestamp: agoC(640),
    text: "solarSystemID: 30045349\nstructureID: 1035600000044\nstructureTypeID: 35835\noreVolumeByType:\n  45494: 1480000.0\n" },
  { notification_id: 90006, type: "CorpAllBillMsg", sender_id: 1000132, sender_type: "corporation", is_read: true, timestamp: agoC(1180),
    text: "amount: 12500000.0\nbillTypeID: 2\ncreditorID: 1000132\ndebtorID: 98000001\ndueDate: 133612740000000000\n" },
  { notification_id: 90007, type: "InsuranceFirstShipMsg", sender_id: 1000125, sender_type: "corporation", is_read: true, timestamp: agoC(1520),
    text: "shipTypeID: 29984\nlevel: Platinum\n" },
  // An unmapped type — the API can literally return this. Show a humanized type, never a fake label.
  { notification_id: 90008, type: "unknown notification type (281)", sender_id: 1000125, sender_type: "corporation", is_read: true, timestamp: agoC(2010),
    text: "" },
];

// GET /characters/{id}/mail/  (scope: esi-mail.read_mail.v1) — header list (subjects only).
const RAW_MAIL = [
  { mail_id: 84001, from: 91000010, sender_type: "character", subject: "STRAT OP 20:00 — Muninn fleet", is_read: false, timestamp: agoC(54), labels: [4], recipients: [{ recipient_id: 98000001, recipient_type: "corporation" }] },
  { mail_id: 84003, from: 145678, sender_type: "mailing_list", subject: "Thera connections — daily digest", is_read: false, timestamp: agoC(210), labels: [1], recipients: [{ recipient_id: 145678, recipient_type: "mailing_list" }] },
  { mail_id: 84002, from: 91000011, sender_type: "character", subject: "Re: Tengu shield fit", is_read: true, timestamp: agoC(700), labels: [1], recipients: [{ recipient_id: 91000001, recipient_type: "character" }] },
  { mail_id: 84004, from: 91000012, sender_type: "character", subject: "Sov timer — KFIE-Z @ 02:13", is_read: true, timestamp: agoC(1340), labels: [8], recipients: [{ recipient_id: 99000002, recipient_type: "alliance" }] },
  { mail_id: 84005, from: 91000013, sender_type: "character", subject: "Contract delivered — o7", is_read: true, timestamp: agoC(2600), labels: [1], recipients: [{ recipient_id: 91000001, recipient_type: "character" }] },
];

// GET /characters/{id}/mail/{mail_id}/  → EVE-formatted body (HTML-ish; sanitize before render).
const RAW_MAIL_BODY = {
  84001: '<font size="14" color="#bfffffff">Form up at <a href="showinfo:35833//1035600000077">Keepstar - Home Sweet Home</a> by <b>20:00 EVE</b>.<br><br>Doctrine: <b>Muninn</b> + <a href="showinfo:11985">Guardian</a> logi. Bring tackle + a bubble alt.<br><br>Comms on Mumble. Don\'t be late.<br>-- o7</font>',
  84003: '<font size="12" color="#bfffffff">Theracartography auto-digest.<br><br>Inbound from Thera to <a href="showinfo:5//30045349">Tama</a>: HS, frig-size, EOL in ~3h.<br>Outbound to nullsec: <a href="showinfo:5//30004759">1DH-SX</a>, stable.<br><br>Reply STOP to leave this list.</font>',
  84002: '<font size="14" color="#bfffffff">Your fit looks solid. Swap one <a href="showinfo:2281">Adaptive Invuln</a> for an <a href="showinfo:1422">EM ward</a> for the gank you\'re flying into.<br><br>Cap stable at 41%. Good luck.</font>',
  84004: '<font size="12" color="#bfffffff">Reinforcement timer exits at <b>02:13 EVE</b>.<br>Form 01:30 in <a href="showinfo:5//30004759">staging</a>. Subcap ping to follow.</font>',
  84005: '<font size="14" color="#bfffffff">Cargo received in <a href="showinfo:60003760">Jita IV - Moon 4</a>. Reward released. Fly safe.<br>o7</font>',
};

// GET /characters/{id}/mail/labels/  → { labels:[...], total_unread_count }
const RAW_LABELS = {
  total_unread_count: 2,
  labels: [
    { label_id: 1, name: "Inbox", color: "#ffffff", unread_count: 1 },
    { label_id: 2, name: "Sent", color: "#ffffff", unread_count: 0 },
    { label_id: 4, name: "Corp", color: "#ffd000", unread_count: 1 },
    { label_id: 8, name: "Alliance", color: "#00ffff", unread_count: 0 },
  ],
};
// GET /characters/{id}/mail/lists/  → resolve mailing-list senders
const RAW_LISTS = [{ mailing_list_id: 145678, name: "EvE-Scout Rescue" }];

// One batched POST /universe/names/ + bundled SDE resolves every id → name.
const NAMES_C = {
  // characters / corps / alliances
  91000010: "Koris Vaelan", 91000011: "Haruki Sato", 91000012: "Diplo — The Initiative",
  91000013: "M''Tara Khan", 98000001: "Kaalakiota Vanguard", 98765432: "Hostile Holdings Inc",
  1000132: "CONCORD", 99000002: "Pandemic Horde",
  // mailing lists
  145678: "EvE-Scout Rescue",
  // type / system ids surfaced in notification subtitles
  3330: "Caldari Cruiser", 621: "Caracal", 29984: "Tengu", 35832: "Astrahus", 35835: "Athanor",
  "sys:30045349": "Tama", "sys:30000144": "Perimeter", "sys:30004759": "1DH-SX",
  // label ids → names (for the row's label tag)
  "label:1": "Inbox", "label:2": "Sent", "label:4": "Corp", "label:8": "Alliance",
};

// ===========================================================================
//  src/lib/notifications.ts  — pure, fully tested.
// ===========================================================================

// Tiny safe YAML reader: the `text` blob is simple `key: value` lines. Never throws.
function readYaml(text) {
  const out = {};
  if (!text || typeof text !== "string") return out;
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (m && m[2] !== "") out[m[1]] = m[2].trim();
  }
  return out;
}
// "StructureUnderAttack" → "Structure under attack"; passes through "unknown notification type (281)".
function humanizeType(type) {
  if (/^unknown notification/i.test(type)) return type.charAt(0).toUpperCase() + type.slice(1);
  return type
    .replace(/Msg$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

// Known types → friendly title + tone + icon + group, and which YAML keys to surface.
// Unknown types fall through to { title: humanize(type), body: rawText } — never fabricated.
const NOTIF_META = {
  StructureUnderAttack:        { title: "Structure under attack",   tone: "alert",    icon: "shieldAlert", group: "Structures" },
  StructureLostShields:        { title: "Structure lost shields",   tone: "alert",    icon: "shieldAlert", group: "Structures" },
  KillReportFinalBlow:         { title: "Final blow",               tone: "neutral",  icon: "skull",       group: "Combat" },
  KillReportVictim:            { title: "Ship destroyed",           tone: "negative", icon: "skull",       group: "Combat" },
  WarDeclared:                 { title: "War declared",             tone: "alert",    icon: "swords",      group: "War" },
  AllWarDeclaredMsg:           { title: "War declared",             tone: "alert",    icon: "swords",      group: "War" },
  SkillTrainingCompleted:      { title: "Skill training complete",  tone: "neutral",  icon: "gradCap",     group: "Character" },
  MoonminingExtractionFinished:{ title: "Moon extraction ready",    tone: "neutral",  icon: "pickaxe",     group: "Industry" },
  CorpAllBillMsg:              { title: "Corporation bill",         tone: "neutral",  icon: "receipt",     group: "Corp" },
  InsuranceFirstShipMsg:       { title: "Ship insured",             tone: "neutral",  icon: "shield",      group: "Character" },
};
const sysName = (id, names) => names["sys:" + id] || ("System " + id);

// Per-type detail builder: returns { subtitle, body }. subtitle = the row's second line;
// body = the expanded (accordion) text. Only parses keys for types we explicitly support.
function notifDetail(type, y, names) {
  switch (type) {
    case "StructureUnderAttack":
    case "StructureLostShields": {
      const sys = sysName(y.solarsystemID || y.solarSystemID, names);
      const sh = y.shieldPercentage != null ? `shields ${Math.round(+y.shieldPercentage)}%` : "";
      return { subtitle: [sys, sh].filter(Boolean).join(" · "),
        body: `${names[y.structureTypeID] || "Structure"} in ${sys} is under attack.` + (sh ? `\nShields ${(+y.shieldPercentage).toFixed(1)}% · Armor ${(+y.armorPercentage).toFixed(0)}% · Hull ${(+y.hullPercentage).toFixed(0)}%.` : "") };
    }
    case "KillReportFinalBlow":
    case "KillReportVictim": {
      const ship = names[y.victimShipTypeID] || "ship";
      const sys = sysName(y.solarSystemID, names);
      return { subtitle: `${ship} · ${sys}`,
        body: `${type === "KillReportVictim" ? "You lost a" : "Final blow on a"} ${ship} in ${sys}.` };
    }
    case "WarDeclared":
    case "AllWarDeclaredMsg": {
      const by = names[y.declaredByID] || "A corporation";
      const against = names[y.againstID] || "your corporation";
      const delay = y.delayHours ? ` Fighting begins in ${y.delayHours}h.` : "";
      return { subtitle: `${by} → ${against}`, body: `${by} has declared war on ${against}.${delay}` };
    }
    case "SkillTrainingCompleted": {
      const skill = names[y.skillTypeID] || "A skill";
      return { subtitle: skill, body: `${skill} finished training.` };
    }
    case "MoonminingExtractionFinished": {
      const sys = sysName(y.solarSystemID, names);
      return { subtitle: `${names[y.structureTypeID] || "Refinery"} · ${sys}`, body: `Moon extraction is ready to fracture at your ${names[y.structureTypeID] || "refinery"} in ${sys}.` };
    }
    case "CorpAllBillMsg": {
      const amt = y.amount ? formatISK(+y.amount) + " ISK" : "";
      const to = names[y.creditorID] || "creditor";
      return { subtitle: amt ? `${amt} due` : "Bill issued", body: `A corporation bill of ${amt || "an amount"} is payable to ${to}.` };
    }
    case "InsuranceFirstShipMsg": {
      const ship = names[y.shipTypeID] || "your ship";
      return { subtitle: `${ship} · ${y.level || "insured"}`, body: `${ship} has been insured (${y.level || "standard"} — complimentary).` };
    }
    default:
      return { subtitle: "", body: "" };
  }
}

// parseNotification(n) → { id, type, title, subtitle, body, tone, icon, group, time, read }
function parseNotification(n, names = NAMES_C) {
  const meta = NOTIF_META[n.type];
  const y = readYaml(n.text);
  const detail = notifDetail(n.type, y, names);
  const body = (detail.body || "").trim() || (n.text ? n.text.trim() : "No further detail provided by ESI.");
  return {
    id: "notif:" + n.notification_id,
    type: n.type,
    title: meta ? meta.title : humanizeType(n.type),
    subtitle: detail.subtitle || "",
    body,
    tone: meta ? meta.tone : "neutral",
    icon: meta ? meta.icon : "bell",
    group: meta ? meta.group : "Other",
    time: n.timestamp,
    read: !!n.is_read,
  };
}

// Day-grouping (TODAY / YESTERDAY / date), mirrors the journal/activity shape.
function dayLabelC(iso, now) {
  const d = new Date(iso), n = new Date(now);
  const days = Math.floor((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) / 86400000);
  if (days <= 0) return "TODAY";
  if (days === 1) return "YESTERDAY";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}
function groupNotifications(list, now = NOW_C) {
  const out = [], idx = {};
  list.forEach((it) => {
    const lbl = dayLabelC(it.time, now);
    if (idx[lbl] === undefined) { idx[lbl] = out.length; out.push({ label: lbl, items: [] }); }
    out[idx[lbl]].items.push(it);
  });
  return out;
}
const unreadCount = (list) => list.filter((n) => !n.read).length;

// ===========================================================================
//  src/lib/mail.ts  — pure, fully tested.
// ===========================================================================

// EVE body → plain text: <br>→\n, showinfo links → their label, strip <font>/<b>/tags, decode entities.
function sanitizeMailBody(body) {
  if (!body) return "";
  return body
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<a [^>]*href="showinfo:[^"]*"[^>]*>(.*?)<\/a>/gi, "$1")
    .replace(/<a [^>]*>(.*?)<\/a>/gi, "$1")
    .replace(/<\/?(font|b|i|u|span|color)[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
const mailUnread = (labels) => (labels && labels.labels ? labels.labels.filter((l) => l.label_id === 1 || l.label_id >= 4).reduce((s, l) => s + (l.unread_count || 0), 0) : 0);

// Header view-model: resolve sender name + a primary label tag.
function mailRowView(h, names = NAMES_C, lists = RAW_LISTS) {
  let sender = names[h.from] || "Unknown";
  if (h.sender_type === "mailing_list") {
    const l = lists.find((x) => x.mailing_list_id === h.from);
    sender = (l && l.name) || sender;
  }
  const labelId = h.labels && h.labels.find((id) => id !== 1);
  return {
    id: "mail:" + h.mail_id, mail_id: h.mail_id, subject: h.subject || "(no subject)",
    sender, isList: h.sender_type === "mailing_list", read: !!h.is_read, time: h.timestamp,
    label: labelId ? names["label:" + labelId] : null,
  };
}

// ===========================================================================
//  useComms(characterId) — composing hook shape (drives BOTH the bell badge and the screen).
// ===========================================================================
function buildComms({ notifMissing = false, mailMissing = false } = {}) {
  const notifications = notifMissing ? [] : RAW_NOTIFS.map((n) => parseNotification(n));
  const mail = mailMissing ? [] : RAW_MAIL.map((h) => mailRowView(h));
  const unread = {
    notifications: notifMissing ? 0 : unreadCount(notifications),
    mail: mailMissing ? 0 : mailUnread(RAW_LABELS),
  };
  unread.total = unread.notifications + unread.mail;
  return {
    notifications, mail, labels: mailMissing ? null : RAW_LABELS, lists: RAW_LISTS,
    unread, notifScopeMissing: notifMissing, mailScopeMissing: mailMissing,
  };
}
function mailBodyView(mailId) {
  const h = RAW_MAIL.find((m) => m.mail_id === mailId);
  if (!h) return null;
  const v = mailRowView(h);
  return { ...v, body: sanitizeMailBody(RAW_MAIL_BODY[mailId]) };
}

Object.assign(window, {
  COMMS_TONE, relTimeC, fullTimeC, NOW_C,
  RAW_NOTIFS, RAW_MAIL, RAW_LABELS, RAW_LISTS, NAMES_C,
  readYaml, humanizeType, NOTIF_META, parseNotification, groupNotifications, unreadCount,
  sanitizeMailBody, mailUnread, mailRowView, buildComms, mailBodyView,
});
