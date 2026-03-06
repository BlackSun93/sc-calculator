import { useState } from "react";

// Roche Light Theme Colors
const C = {
  pageBg: "#F7F8FA",
  cardBg: "#FFFFFF",
  cardBorder: "#E2E6EC",
  textPrimary: "#1B2A3D",
  textSecondary: "#4A5A6A",
  textMuted: "#6B7B8B",
  textDim: "#8A95A3",
  accentBlue: "#0065AC",
  accentTeal: "#00857C",
  successGreen: "#16A34A",
  alertCoral: "#E05252",
  amberGold: "#C48800",
  purple: "#7C3AED",
};

const CENTERS = [
  { name: "NCI Cairo", patients: 320, region: "Cairo" },
  { name: "Ain Shams Univ.", patients: 280, region: "Cairo" },
  { name: "Kasr Al Ainy", patients: 260, region: "Cairo" },
  { name: "Alexandria Onc.", patients: 240, region: "Alexandria" },
  { name: "Tanta Cancer Ctr", patients: 200, region: "Delta" },
  { name: "Mansoura Onc.", patients: 190, region: "Delta" },
  { name: "Assiut Univ.", patients: 170, region: "Upper Egypt" },
  { name: "Sohag Cancer Ctr", patients: 150, region: "Upper Egypt" },
  { name: "Zagazig Univ.", patients: 140, region: "Delta" },
  { name: "Minia Onc. Ctr", patients: 120, region: "Upper Egypt" },
];

const TOUCHPOINTS = [
  { id: "audit", short: "Capacity Audit", icon: "📊", desc: "ISL conducted chair capacity audit with HoD" },
  { id: "data", short: "Data Drop", icon: "📱", desc: "Personalized WhatsApp follow-up sent" },
  { id: "peer", short: "Peer Circle", icon: "👥", desc: "Oncologist attended peer KOL session" },
  { id: "nurse", short: "Nurse Training", icon: "👩‍⚕️", desc: "At least 1 nurse SC-trained" },
  { id: "story", short: "Patient Story", icon: "🎬", desc: "Video testimonial shared with HCP" },
  { id: "switch", short: "First Switch", icon: "💉", desc: "First patient switched to SC" },
  { id: "loop", short: "Feedback Loop", icon: "🔄", desc: "Monthly center spotlight active" },
];

const INITIAL_DATA = {
  "NCI Cairo":        [true, true, true, true, true, true, false],
  "Ain Shams Univ.":  [true, true, true, true, false, false, false],
  "Kasr Al Ainy":     [true, true, true, false, false, false, false],
  "Alexandria Onc.":  [true, true, false, false, false, false, false],
  "Tanta Cancer Ctr": [true, true, true, true, true, false, false],
  "Mansoura Onc.":    [true, false, false, false, false, false, false],
  "Assiut Univ.":     [true, true, true, true, false, false, false],
  "Sohag Cancer Ctr": [true, true, true, true, true, true, true],
  "Zagazig Univ.":    [true, false, false, false, false, false, false],
  "Minia Onc. Ctr":   [false, false, false, false, false, false, false],
};

function getScore(steps) { return steps.filter(Boolean).length; }
function getPhase(score) {
  if (score === 0) return { label: "NOT STARTED", color: "#6B7B8B", bg: "rgba(107,123,139,0.1)" };
  if (score <= 2) return { label: "AWARENESS", color: "#C48800", bg: "rgba(196,136,0,0.1)" };
  if (score <= 4) return { label: "ACTIVATION", color: "#0065AC", bg: "rgba(0,101,172,0.1)" };
  if (score <= 6) return { label: "ADOPTION", color: "#00857C", bg: "rgba(0,133,124,0.1)" };
  return { label: "CHAMPION", color: "#16A34A", bg: "rgba(22,163,74,0.1)" };
}

export default function OmnichannelTracker() {
  const [data, setData] = useState(INITIAL_DATA);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("grid");

  const toggleStep = (center, idx) => {
    setData(prev => {
      const updated = { ...prev };
      const steps = [...updated[center]];
      steps[idx] = !steps[idx];
      updated[center] = steps;
      return updated;
    });
  };

  const totalCenters = CENTERS.length;
  const avgScore = (CENTERS.reduce((sum, c) => sum + getScore(data[c.name]), 0) / totalCenters).toFixed(1);
  const centersWithSwitch = CENTERS.filter(c => data[c.name][5]).length;
  const centersChampion = CENTERS.filter(c => getScore(data[c.name]) === 7).length;
  const touchpointCompletion = TOUCHPOINTS.map((_, i) =>
    Math.round(CENTERS.filter(c => data[c.name][i]).length / totalCenters * 100)
  );

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.textPrimary }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0065AC, #004A82)", padding: "14px 20px", borderBottom: `3px solid ${C.accentBlue}`, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ fontSize: 9, color: "#a0d4f0", letterSpacing: 3, fontWeight: 700 }}>PHESGO POD DASHBOARD</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: "#fff" }}>Omnichannel Journey Tracker</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["grid", "funnel"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "5px 12px", borderRadius: 6, border: "1px solid",
                borderColor: view === v ? "#fff" : "rgba(255,255,255,0.2)",
                background: view === v ? "rgba(255,255,255,0.15)" : "transparent",
                color: view === v ? "#fff" : "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1, textTransform: "uppercase"
              }}>{v}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "16px 16px 48px" }}>

        {/* KPI Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          <KPI label="AVG READINESS" value={`${avgScore}/7`} sub="across 10 centers" color={C.accentBlue} />
          <KPI label="FIRST SWITCH DONE" value={`${centersWithSwitch}/${totalCenters}`} sub="centers with patients on SC" color={C.successGreen} />
          <KPI label="CHAMPION STATUS" value={`${centersChampion}`} sub="centers fully activated" color="#6B9900" />
          <KPI label="BIGGEST GAP" value={TOUCHPOINTS[touchpointCompletion.indexOf(Math.min(...touchpointCompletion))].short} sub={`${Math.min(...touchpointCompletion)}% completion`} color={C.alertCoral} small />
        </div>

        {/* Touchpoint Funnel */}
        {view === "funnel" && (
          <div style={{ borderRadius: 14, padding: "16px 18px", marginBottom: 18, background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, fontWeight: 700, marginBottom: 14 }}>TOUCHPOINT COMPLETION FUNNEL</div>
            {TOUCHPOINTS.map((tp, i) => (
              <div key={tp.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 14, width: 24, textAlign: "center" }}>{tp.icon}</div>
                <div style={{ width: 100, fontSize: 10, color: C.textSecondary }}>{tp.short}</div>
                <div style={{ flex: 1, height: 22, background: "#EEF0F4", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                  <div style={{
                    width: `${touchpointCompletion[i]}%`, height: "100%",
                    background: touchpointCompletion[i] >= 70 ? "linear-gradient(90deg, #16A34A, #22c55e)" :
                      touchpointCompletion[i] >= 40 ? "linear-gradient(90deg, #0065AC, #0085CA)" :
                      "linear-gradient(90deg, #C48800, #e0a820)",
                    borderRadius: 6, transition: "width 0.5s ease",
                    display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 8
                  }}>
                    {touchpointCompletion[i] >= 15 && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{touchpointCompletion[i]}%</span>
                    )}
                  </div>
                  {touchpointCompletion[i] < 15 && (
                    <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10, fontWeight: 700, color: C.textMuted }}>{touchpointCompletion[i]}%</span>
                  )}
                </div>
                <div style={{ width: 35, fontSize: 10, color: C.textSecondary, textAlign: "right" }}>
                  {CENTERS.filter(c => data[c.name][i]).length}/{totalCenters}
                </div>
              </div>
            ))}
            <div style={{ fontSize: 8, color: C.textDim, marginTop: 10, textAlign: "center" }}>
              Drop-off points indicate where POD support is needed most
            </div>
          </div>
        )}

        {/* Center Grid */}
        {view === "grid" && (
          <div style={{ borderRadius: 14, padding: "16px", background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>
              CENTER READINESS MAP — Click any cell to update status
            </div>

            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "140px repeat(7, 1fr) 80px", gap: 3, marginBottom: 6 }}>
              <div style={{ fontSize: 8, color: C.textSecondary, fontWeight: 700, padding: "4px 6px" }}>CENTER</div>
              {TOUCHPOINTS.map(tp => (
                <div key={tp.id} style={{ fontSize: 7, color: C.textSecondary, fontWeight: 700, textAlign: "center", padding: "4px 2px", lineHeight: 1.3 }}>
                  {tp.icon}<br/>{tp.short}
                </div>
              ))}
              <div style={{ fontSize: 8, color: C.textSecondary, fontWeight: 700, textAlign: "center", padding: "4px 2px" }}>STATUS</div>
            </div>

            {/* Center rows */}
            {CENTERS.map((center, ci) => {
              const steps = data[center.name];
              const score = getScore(steps);
              const phase = getPhase(score);
              const isSelected = selected === center.name;

              return (
                <div key={center.name}>
                  <div
                    onClick={() => setSelected(isSelected ? null : center.name)}
                    style={{
                      display: "grid", gridTemplateColumns: "140px repeat(7, 1fr) 80px", gap: 3,
                      padding: "6px 0", cursor: "pointer",
                      background: isSelected ? "rgba(0,101,172,0.06)" : ci % 2 ? "#F7F8FA" : "transparent",
                      borderRadius: 6, transition: "background 0.2s"
                    }}
                  >
                    {/* Center name */}
                    <div style={{ padding: "4px 6px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.textPrimary }}>{center.name}</div>
                      <div style={{ fontSize: 8, color: C.textMuted }}>{center.patients} pts/yr • {center.region}</div>
                    </div>

                    {/* Touchpoint cells */}
                    {steps.map((done, si) => (
                      <div key={si}
                        onClick={e => { e.stopPropagation(); toggleStep(center.name, si); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 4, cursor: "pointer", transition: "all 0.2s",
                          background: done ? "rgba(22,163,74,0.08)" : "#F7F8FA",
                          border: done ? "1px solid rgba(22,163,74,0.25)" : `1px solid ${C.cardBorder}`,
                        }}
                      >
                        <span style={{ fontSize: 14 }}>{done ? "✅" : "⬜"}</span>
                      </div>
                    ))}

                    {/* Phase badge */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{
                        fontSize: 7, fontWeight: 800, letterSpacing: 0.5,
                        padding: "3px 8px", borderRadius: 10,
                        background: phase.bg, color: phase.color, whiteSpace: "nowrap"
                      }}>{phase.label}</span>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isSelected && (
                    <div style={{
                      padding: "10px 16px", margin: "4px 0 8px", borderRadius: 8,
                      background: "rgba(0,101,172,0.04)", border: `1px solid rgba(0,101,172,0.15)`
                    }}>
                      <div style={{ fontSize: 9, color: C.accentBlue, fontWeight: 700, marginBottom: 8 }}>
                        {center.name} — READINESS DETAIL ({score}/7)
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {TOUCHPOINTS.map((tp, i) => (
                          <div key={tp.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10 }}>
                            <span>{steps[i] ? "✅" : "⬜"}</span>
                            <div>
                              <span style={{ color: steps[i] ? C.successGreen : C.textMuted }}>{tp.short}</span>
                              <div style={{ fontSize: 8, color: C.textDim }}>{tp.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {score < 7 && (
                        <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 6, background: "rgba(196,136,0,0.06)", border: "1px solid rgba(196,136,0,0.15)" }}>
                          <div style={{ fontSize: 9, color: C.amberGold, fontWeight: 700 }}>
                            NEXT ACTION: {TOUCHPOINTS[steps.indexOf(false)]?.short || "All complete"}
                          </div>
                          <div style={{ fontSize: 8, color: C.textMuted }}>
                            {TOUCHPOINTS[steps.indexOf(false)]?.desc || "Move to champion program"}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* POD Action Summary */}
        <div style={{
          borderRadius: 14, padding: "14px 18px", marginTop: 16,
          background: "rgba(0,101,172,0.03)",
          border: `1px solid ${C.cardBorder}`,
          borderLeft: `4px solid ${C.accentBlue}`
        }}>
          <div style={{ fontSize: 9, color: C.accentBlue, fontWeight: 700, letterSpacing: 1.5, marginBottom: 6 }}>POD WEEKLY PRIORITIES</div>
          <div style={{ fontSize: 11, color: C.textSecondary, lineHeight: 1.8 }}>
            {centersWithSwitch < 5 && <div>• <strong style={{ color: C.amberGold }}>Focus:</strong> {5 - centersWithSwitch} more centers need first patient switch — ISL to prioritize centers in ACTIVATION phase</div>}
            {touchpointCompletion[3] < 60 && <div>• <strong style={{ color: C.accentBlue }}>Nurse training gap:</strong> Only {touchpointCompletion[3]}% of centers have trained nurses — schedule workshops this week</div>}
            {touchpointCompletion[1] < 80 && <div>• <strong style={{ color: C.purple }}>Digital follow-up:</strong> {10 - CENTERS.filter(c => data[c.name][1]).length} centers missing WhatsApp data drop — Digital Enabler to send</div>}
            {centersChampion > 0 && <div>• <strong style={{ color: C.successGreen }}>Champion leverage:</strong> {centersChampion} center(s) at champion status — use for peer case studies</div>}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 8, color: C.textDim, lineHeight: 1.8 }}>
          MVP v1.0 — Internal POD tool. Data shown is illustrative for demonstration purposes.
          <br/>In production, this would connect to Veeva CRM for real-time ISL activity tracking.
        </div>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        button { transition: all 0.2s ease; }
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}

function KPI({ label, value, sub, color, small }) {
  return (
    <div style={{
      borderRadius: 12, padding: "14px 12px", textAlign: "center",
      background: C.cardBg, border: `1px solid ${C.cardBorder}`,
      borderTop: `3px solid ${color}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
    }}>
      <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 1.5, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: small ? 16 : 26, fontWeight: 900, color, marginTop: 4, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 8, color: C.textDim, marginTop: 3 }}>{sub}</div>
    </div>
  );
}
