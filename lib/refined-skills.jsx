// REFINED Skills — SP-allocation viz, dominant training hero, clearer queue, bigger pips.

function RLevelPips({ level, max = 5, training = false }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < level;
        const isTraining = training && i === level;
        return (
          <div
            key={i}
            style={{
              width: 11,
              height: 11,
              background: filled ? C.cyan : isTraining ? "rgba(0,200,255,0.25)" : "transparent",
              border: filled ? "none" : `1px solid ${isTraining ? C.cyan : "#21344c"}`,
              boxShadow: filled ? "0 0 5px rgba(0,200,255,0.45)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function romanLvl(n) {
  return ["", "I", "II", "III", "IV", "V"][n] || String(n);
}
function buildQueueExport() {
  const header = "Cyno Bridge — " + CHAR.name + " skill queue (as of 2026-06-15)";
  const labels = QUEUE.map((q, i) => `${i + 1}. ${q.name} ${romanLvl(q.level)}`);
  const w = Math.max(...labels.map((l) => l.length));
  const lines = QUEUE.map((q, i) => `${labels[i].padEnd(w)}  ${q.remaining}`);
  return [header, ...lines, "Total queue time: 21d 6h 44m"].join("\n");
}
function buildSkillsExport() {
  const header = "Cyno Bridge — " + CHAR.name + " skills (Total SP: 87.4M)";
  const blocks = SKILLS_BY_CAT.map((cat) =>
    [`[${cat.cat}]`, ...cat.skills.map((s) => `  ${s.name} ${romanLvl(s.level)}`)].join("\n")
  );
  return [header, ...blocks].join("\n");
}

// Mirrors the real skills.tsx header actions: Copy (flips to "Copied") + Export (Share2).
function QueueActions({ getText = buildQueueExport }) {
  const [copied, setCopied] = React.useState(false);
  const [shared, setShared] = React.useState(false);
  const tref = React.useRef(null);
  React.useEffect(() => () => tref.current && clearTimeout(tref.current), []);

  const flash = (set) => {
    set(true);
    if (tref.current) clearTimeout(tref.current);
    tref.current = setTimeout(() => set(false), 1500);
  };
  const onCopy = async () => {
    try { await navigator.clipboard.writeText(getText()); } catch (e) { /* clipboard blocked */ }
    flash(setCopied);
  };
  const onExport = async () => {
    try {
      if (navigator.share) await navigator.share({ text: getText() });
      else flash(setShared);
    } catch (e) { /* dismissed */ }
  };

  const pill = (active) => ({
    display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 4,
    cursor: "pointer", fontFamily: FONT.body, fontSize: 11.5,
    background: active ? "rgba(0,229,160,0.1)" : "rgba(0,200,255,0.08)",
    border: `1px solid ${active ? "rgba(0,229,160,0.3)" : "rgba(0,200,255,0.25)"}`,
    color: active ? C.green : C.cyan,
  });

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={onCopy} style={pill(copied)} aria-label="Copy queue to clipboard">
        <Icon name={copied ? "check" : "copy"} size={12} color={copied ? C.green : C.cyan} />
        {copied ? "Copied" : "Copy"}
      </button>
      <button onClick={onExport} style={pill(shared)} aria-label="Export queue">
        <Icon name={shared ? "check" : "share"} size={12} color={shared ? C.green : C.cyan} />
        {shared ? "Exported" : "Export"}
      </button>
    </div>
  );
}

function RefinedSkills() {
  const [openCat, setOpenCat] = React.useState("Spaceship Command");
  const next = QUEUE[1];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "16px 16px 20px" }}>
      {/* SP overview + allocation viz */}
      <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", padding: "16px 16px 15px", background: "linear-gradient(165deg,#0f1b2b,#0b1320)", border: `1px solid ${C.borderStrong}` }}>
        <Brackets color={C.cyan} size={13} inset={6} opacity={0.5} />
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Total Skill Points</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 600, color: C.cyan, letterSpacing: "-0.02em", lineHeight: 1 }}>87.4</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 14, color: C.mfg }}>M</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT.mono, fontSize: 14, fontWeight: 600, color: C.green }}>1,847</div>
            <div style={{ fontFamily: FONT.body, fontSize: 10, color: C.mfg, letterSpacing: "0.06em", textTransform: "uppercase" }}>SP / hour</div>
          </div>
        </div>
        <SPAllocBar />
      </div>

      {/* NOW TRAINING hero */}
      <div>
        <RSection action={<QueueActions />}>Training Queue</RSection>
        <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "linear-gradient(135deg, rgba(0,200,255,0.1), rgba(0,200,255,0.03))", border: `1px solid rgba(0,200,255,0.35)`, marginBottom: 8 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: C.cyan, boxShadow: "0 0 10px rgba(0,200,255,0.7)" }} />
          <div style={{ padding: "14px 16px 14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
            <Ring value={0.673} size={72} stroke={7} color={C.cyan}>
              <span style={{ fontFamily: FONT.mono, fontSize: 15, fontWeight: 600, color: C.fg, lineHeight: 1 }}>67%</span>
            </Ring>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <Icon name="zap" size={12} color={C.cyan} />
                <span style={{ fontFamily: FONT.body, fontSize: 10, color: C.cyan, letterSpacing: "0.12em", textTransform: "uppercase" }}>Active</span>
              </div>
              <p style={{ margin: 0, fontFamily: FONT.display, fontSize: 15, fontWeight: 600, color: C.fg, lineHeight: 1.2 }}>Advanced Spaceship Command</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7 }}>
                <RLevelPips level={4} training />
                <span style={{ fontFamily: FONT.mono, fontSize: 13, color: C.fg, whiteSpace: "nowrap" }}>4d 16h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Up-next queue */}
        <div style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}`, background: C.surface }}>
          {QUEUE.slice(1).map((skill, i) => (
            <div key={skill.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 12, color: C.dim, width: 16, textAlign: "center", flexShrink: 0 }}>{i + 2}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONT.body, fontSize: 13, color: C.fg }}>{skill.name}</div>
                <div style={{ fontFamily: FONT.mono, fontSize: 10.5, color: C.mfg, marginTop: 2 }}>{(skill.sp / 1000).toFixed(0)}k SP</div>
              </div>
              <RLevelPips level={skill.level} />
              <span style={{ fontFamily: FONT.mono, fontSize: 11.5, color: C.mfg, flexShrink: 0, width: 46, textAlign: "right" }}>{skill.remaining}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderTop: `1px solid ${C.border}`, background: "rgba(240,165,0,0.05)" }}>
            <span style={{ fontFamily: FONT.body, fontSize: 11, color: C.mfg, letterSpacing: "0.06em", textTransform: "uppercase" }}>Total queue time</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 600, color: C.amber }}>21d 6h 44m</span>
          </div>
        </div>
      </div>

      {/* Skills by category */}
      <div>
        <RSection action={<QueueActions getText={buildSkillsExport} />}>Trained Skills</RSection>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {SKILLS_BY_CAT.map((cat) => {
            const open = openCat === cat.cat;
            const pct = Math.round((cat.sp / 30_000_000) * 100);
            return (
              <div key={cat.cat} style={{ borderRadius: 4, overflow: "hidden", border: `1px solid ${open ? C.borderStrong : C.border}`, background: C.surface }}>
                <button onClick={() => setOpenCat(open ? null : cat.cat)} style={{ width: "100%", padding: "12px 13px", background: "transparent", border: "none", cursor: "pointer", display: "block" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: FONT.display, fontSize: 13.5, fontWeight: 600, color: C.fg }}>{cat.cat}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontFamily: FONT.mono, fontSize: 11.5, color: C.amber }}>{spM(cat.sp)}</span>
                      <Icon name={open ? "chevUp" : "chevDown"} size={15} color={C.mfg} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 9 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 99, overflow: "hidden", background: C.secondary }}>
                      <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: "linear-gradient(90deg,#0088CC,#00C8FF)" }} />
                    </div>
                    <span style={{ fontFamily: FONT.mono, fontSize: 10, color: C.mfg, flexShrink: 0 }}>{cat.skills.length} skills</span>
                  </div>
                </button>
                {open && (
                  <div style={{ borderTop: `1px solid ${C.border}` }}>
                    {cat.skills.map((sk, i) => (
                      <div key={sk.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 13px", borderTop: i > 0 ? `1px solid ${C.border}` : "none", background: sk.training ? "rgba(0,200,255,0.05)" : "transparent" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {sk.training && <Icon name="zap" size={11} color={C.cyan} />}
                          <span style={{ fontFamily: FONT.body, fontSize: 12.5, color: sk.training ? C.fg : "#9DBACF" }}>{sk.name}</span>
                        </div>
                        <RLevelPips level={sk.level} max={sk.maxLevel} training={sk.training} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

window.RefinedSkills = RefinedSkills;
