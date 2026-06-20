// Activity feed — design-reference data layer.
// Mirrors the plan's `src/lib/activity/*` contract: one ActivityItem model + one pure
// adapter per ESI source + mergeActivity(). Mocks below are shaped like the REAL ESI
// payloads (verified against the swagger) so the adapters are honest ports.
//
//   ActivitySource : 'wallet' | 'industry' | 'contracts' | 'combat' | 'notification'
//   ActivityTone   : 'positive' | 'negative' | 'neutral' | 'alert'
//   ActivityItem   : { id, source, date(ISO), title, subtitle?, amount?, tone,
//                      target?, estimated? }

// ---- Source presentation map (glyph + tone→colour). Glyph = source, colour = tone. ----
const SOURCE_META = {
  wallet:       { label: "Wallet",        glyph: "arrowUpRight" }, // glyph overridden by sign
  industry:     { label: "Industry",      glyph: "factory" },
  contracts:    { label: "Contracts",     glyph: "fileText" },
  combat:       { label: "Combat",        glyph: "crosshair" },
  notification: { label: "Notifications", glyph: "bell" },
};
const TONE_COLOR = (C) => ({
  positive: C.green,
  negative: C.red,
  neutral:  C.cyan,
  alert:    C.amber,
});

// Relative-time label from an ISO date against a fixed `now` (pure; injected now).
function relTime(iso, now) {
  const ms = now - new Date(iso).getTime();
  const m = Math.round(ms / 60000);
  if (m < 1) return "now";
  if (m < 60) return m + "m";
  const h = Math.round(m / 60);
  if (h < 24) return h + "h";
  const d = Math.round(h / 24);
  return d + "d";
}

// ===========================================================================
//  RAW SOURCE FIXTURES — shaped exactly like the ESI responses.
// ===========================================================================
const NOW = new Date("2026-06-19T09:41:00Z").getTime();
const ago = (mins) => new Date(NOW - mins * 60000).toISOString();

// /characters/{id}/wallet/journal/  (have this scope today)
const RAW_JOURNAL = [
  { id: 901, date: ago(38),  ref_type: "bounty_prizes",   amount: 14_240_000,  balance: 2_847_301_450, second_party_id: 1000127 },
  { id: 902, date: ago(241), ref_type: "market_escrow",   amount: -168_100_000, balance: 2_833_061_450, second_party_id: 1000035 },
  { id: 903, date: ago(680), ref_type: "brokers_fee",     amount: -2_110_000,  balance: 2_835_171_450, second_party_id: 1000035 },
  { id: 904, date: ago(1490),ref_type: "agent_mission_reward", amount: 1_850_000, balance: 2_837_281_450, second_party_id: 3019494 },
];

// /characters/{id}/industry/jobs/?include_completed=true
// activity_id: 1 Manufacturing · 4 ME · 3 TE · 5 Copying · 8 Invention · 9 Reactions
const RAW_INDUSTRY = [
  { job_id: 5001, activity_id: 1, product_type_id: 2185, runs: 10, status: "delivered", end_date: ago(62),  facility_id: 60003760 }, // Hammerhead II
  { job_id: 5002, activity_id: 8, product_type_id: 2185, runs: 1,  status: "active",    end_date: ago(-410),  start_date: ago(420), facility_id: 60003760 }, // Invention started
];

// /characters/{id}/contracts/
// type: item_exchange | auction | courier | loan ; status drives the verb
const RAW_CONTRACTS = [
  { contract_id: 7001, type: "courier",       status: "in_progress",     title: "Haul to Amarr", date_accepted: ago(182), volume: 8400, reward: 12_000_000 },
  { contract_id: 7002, type: "item_exchange", status: "finished",        title: "Tengu — shield fit", date_completed: ago(540), reward: 250_000_000, price: 0 },
];

// /characters/{id}/killmails/recent/  → [{killmail_id, killmail_hash}]  (90d)
// then /killmails/{id}/{hash}/ (public) → victim/attackers/system/time.
// ISK value is NOT in ESI → estimated from /markets/prices/ → carries est.
const SELF_ID = 91000001;
const RAW_KILLMAILS = [
  { killmail_id: 110001, killmail_time: ago(14),  solar_system_id: 30045349, // Tama
    victim:   { character_id: SELF_ID, ship_type_id: 29984 },                 // Tengu (loss)
    attackers:[ {character_id: 95810944, final_blow:true, ship_type_id: 621}, {}, {}, {} ],
    _estValue: 412_600_000 },
  { killmail_id: 110002, killmail_time: ago(305), solar_system_id: 30000144, // Perimeter
    victim:   { character_id: 92796241, ship_type_id: 621 },                  // Caracal (kill)
    attackers:[ {character_id: SELF_ID, final_blow:true, ship_type_id: 29984} ],
    _estValue: 28_400_000 },
];

// /characters/{id}/notifications/ → {notification_id,type,sender_id,sender_type,timestamp,is_read,text}
const RAW_NOTIFICATIONS = [
  { notification_id: 8001, type: "StructureUnderAttack",   timestamp: ago(122), is_read: false, text: "structureName: Home Sweet Home\nsolarsystemID: 30045349\n" },
  { notification_id: 8002, type: "SkillTrainingCompleted", timestamp: ago(362), is_read: true,  text: "skillTypeID: 3330\n" },
  { notification_id: 8003, type: "WarDeclared",            timestamp: ago(840), is_read: false, text: "againstID: 98000001\ndeclaredByID: 98765432\n" },
  { notification_id: 8004, type: "unknown notification type (281)", timestamp: ago(1300), is_read: true, text: "" },
];

// ===========================================================================
//  PURE ADAPTERS — raw[] → ActivityItem[]  (each independent, scope-gated upstream)
// ===========================================================================
const REF_LABEL = {
  bounty_prizes: "Bounty prizes", market_escrow: "Market escrow", brokers_fee: "Broker's fee",
  transaction_tax: "Sales tax", agent_mission_reward: "Mission reward",
  contract_reward: "Contract reward", player_donation: "Player donation",
};
function walletJournalToActivity(entries, names) {
  return entries.map((e) => {
    const pos = e.amount >= 0;
    return {
      id: "wallet:" + e.id, source: "wallet", date: e.date,
      title: REF_LABEL[e.ref_type] || e.ref_type.replace(/_/g, " "),
      subtitle: (names[e.second_party_id] || "—"),
      amount: e.amount, tone: pos ? "positive" : "negative",
      target: { route: "/(app)/(tabs)/wallet" },
    };
  });
}

const ACTIVITY_VERB = { 1: "Manufacturing", 4: "Material research", 3: "Time research", 5: "Copying", 8: "Invention", 9: "Reaction" };
function industryJobsToActivity(jobs, typeNames) {
  return jobs.map((j) => {
    const done = j.status === "delivered" || j.status === "ready";
    const verb = ACTIVITY_VERB[j.activity_id] || "Industry job";
    return {
      id: "industry:" + j.job_id, source: "industry",
      date: done ? j.end_date : j.start_date,
      title: done
        ? `${verb} complete: ${j.runs}× ${typeNames[j.product_type_id] || "item"}`
        : `${verb} started: ${typeNames[j.product_type_id] || "item"}`,
      subtitle: typeNames["facility:" + j.facility_id] || "Industry facility",
      tone: done ? "positive" : "neutral",
      target: { route: "/(app)/industry" },
    };
  });
}

const CONTRACT_STATUS_VERB = { outstanding: "issued", in_progress: "accepted", finished: "completed", finished_contractor: "completed", failed: "failed", cancelled: "cancelled", rejected: "rejected", expired: "expired" };
function contractsToActivity(contracts) {
  return contracts.map((c) => {
    const verb = CONTRACT_STATUS_VERB[c.status] || c.status;
    const reward = c.reward > 0 ? c.reward : null;
    const date = c.date_completed || c.date_accepted || c.date_expired || c.date_issued;
    return {
      id: "contracts:" + c.contract_id, source: "contracts", date,
      title: `Contract ${verb}: ${c.title || c.type.replace("_", " ") + " contract"}`,
      subtitle: c.type.replace("_", " ") + (c.volume ? ` · ${c.volume.toLocaleString()} m³` : ""),
      amount: c.status.startsWith("finished") ? reward : null,
      tone: c.status.startsWith("finished") && reward ? "positive" : "neutral",
      target: { route: "/(app)/contracts" },
    };
  });
}

function killmailsToActivity(kms, selfId, typeNames) {
  return kms.map((k) => {
    const loss = k.victim.character_id === selfId;
    const ship = typeNames[k.victim.ship_type_id] || "ship";
    const others = k.attackers.length;
    return {
      id: "combat:" + k.killmail_id, source: "combat", date: k.killmail_time,
      title: loss ? `Lost a ${ship}` : `Killed a ${ship}`,
      subtitle: (typeNames["sys:" + k.solar_system_id] || "—") + (loss ? ` · ${others} attackers` : " · final blow"),
      amount: loss ? -k._estValue : k._estValue,
      tone: loss ? "negative" : "neutral",
      estimated: true, // ISK value is a /markets/prices/ estimate, never from ESI
      target: { route: "/(app)/killmails", params: { id: String(k.killmail_id) } },
    };
  });
}

// Known notification types → honest label. Unknown → humanized raw type (never fabricated).
const NOTIF_LABEL = {
  StructureUnderAttack: { title: "Structure under attack", tone: "alert" },
  SkillTrainingCompleted: { title: "Skill training complete", tone: "neutral" },
  WarDeclared: { title: "War declared", tone: "alert" },
};
function notificationsToActivity(notifs, names) {
  return notifs.map((n) => {
    const meta = NOTIF_LABEL[n.type];
    return {
      id: "notification:" + n.notification_id, source: "notification", date: n.timestamp,
      title: meta ? meta.title : n.type.replace(/(?<!^)([A-Z])/g, " $1"),
      subtitle: names["notif:" + n.notification_id] || (meta ? "" : "Notification"),
      tone: meta ? meta.tone : "neutral",
      target: { route: "/(app)/comms", params: { id: String(n.notification_id) } },
    };
  });
}

// ===========================================================================
//  MERGE — concat, drop future-dated, sort desc, dedupe by id, slice.
// ===========================================================================
function mergeActivity(lists, opts) {
  const limit = (opts && opts.limit) || Infinity;
  const now = (opts && opts.now) || Date.now();
  const seen = new Set();
  return []
    .concat(...lists)
    .filter((it) => new Date(it.date).getTime() <= now)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter((it) => (seen.has(it.id) ? false : (seen.add(it.id), true)))
    .slice(0, limit);
}

// Resolved-name lookups the adapters need (one batched /universe/names/ + bundled SDE).
const NAMES = {
  1000127: "Guristas", 1000035: "Caldari Navy", 3019494: "Sister Alitura",
  2185: "Hammerhead II", 29984: "Tengu", 621: "Caracal", 3330: "Caldari Cruiser",
  "facility:60003760": "Jita IV-4 · CNAP", "sys:30045349": "Tama", "sys:30000144": "Perimeter",
  "notif:8001": "Tama · Home Sweet Home", "notif:8003": "Hostile Corp vs Kaalakiota",
  "notif:8002": "Caldari Cruiser V",
};

// Build the full merged feed from all sources. `missing` = array of source keys
// whose scope is absent (those sources are dropped — feed still renders the rest).
function buildFeed({ limit, missing = [] } = {}) {
  const has = (s) => !missing.includes(s);
  const lists = [];
  if (has("wallet"))       lists.push(walletJournalToActivity(RAW_JOURNAL, NAMES));
  if (has("industry"))     lists.push(industryJobsToActivity(RAW_INDUSTRY, NAMES));
  if (has("contracts"))    lists.push(contractsToActivity(RAW_CONTRACTS));
  if (has("combat"))       lists.push(killmailsToActivity(RAW_KILLMAILS, SELF_ID, NAMES));
  if (has("notification")) lists.push(notificationsToActivity(RAW_NOTIFICATIONS, NAMES));
  return mergeActivity(lists, { limit, now: NOW });
}

// Free-text search over a merged feed (pure). Case-insensitive, whitespace-tokenized;
// every token must hit somewhere in the item's searchable text (title + subtitle +
// source label + signed amount). AND across tokens so "tengu tama" narrows.
function activitySearchText(it) {
  const parts = [it.title, it.subtitle || "", SOURCE_META[it.source].label];
  if (it.amount !== undefined && it.amount !== null) parts.push(String(it.amount));
  return parts.join(" ").toLowerCase();
}
function matchActivity(items, query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return items;
  const tokens = q.split(/\s+/);
  return items.filter((it) => {
    const hay = activitySearchText(it);
    return tokens.every((t) => hay.includes(t));
  });
}

Object.assign(window, {
  SOURCE_META, TONE_COLOR, relTime, NOW, SELF_ID,
  walletJournalToActivity, industryJobsToActivity, contractsToActivity,
  killmailsToActivity, notificationsToActivity, mergeActivity, buildFeed, NAMES,
  matchActivity, activitySearchText,
});
