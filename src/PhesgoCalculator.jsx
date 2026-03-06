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

export default function PhesgoCalculator() {
  const [her2, setHer2] = useState(1965);
  const [adopt, setAdopt] = useState(100);

  const STUDY_HER2_PTS = 1965;
  const STUDY_HRS_MO_100 = 7141;
  const STUDY_VIS_MO_100 = 1888;

  const IV_COMBO_CHAIR = 235;
  const SC_CHAIR = 23;
  const IV_NURSE = 169;
  const SC_NURSE = 17;
  const IV_PHARMA = 65;
  const SC_PHARMA = 4;
  const CYCLES_YR = 17;

  const studyHrsMonth = Math.round((adopt / 100) * STUDY_HRS_MO_100);
  const studyVisMonth = Math.round((adopt / 100) * STUDY_VIS_MO_100);
  const studyHrsYear = studyHrsMonth * 12;
  const studyVisYear = studyVisMonth * 12;

  const share = her2 / STUDY_HER2_PTS;
  const centerHrsMonth = Math.round(studyHrsMonth * share);
  const centerHrsYear = Math.round(studyHrsYear * share);
  const centerVisMonth = Math.round(studyVisMonth * share);
  const centerVisYear = Math.round(studyVisYear * share);

  const onSC = Math.round(her2 * (adopt / 100));
  const nurseFreedHrs = Math.round(onSC * (IV_NURSE - SC_NURSE) * CYCLES_YR / 60);
  const pharmaFreedHrs = Math.round(onSC * (IV_PHARMA - SC_PHARMA) * CYCLES_YR / 60);

  const nearestIdx = adopt <= 62 ? 0 : adopt <= 87 ? 1 : 2;

  const STUDY_PROJECTIONS = [
    { pct: 50,  hrsMonth: Math.round(STUDY_HRS_MO_100 * 0.5), visMonth: Math.round(STUDY_VIS_MO_100 * 0.5) },
    { pct: 75,  hrsMonth: Math.round(STUDY_HRS_MO_100 * 0.75), visMonth: Math.round(STUDY_VIS_MO_100 * 0.75) },
    { pct: 100, hrsMonth: STUDY_HRS_MO_100, visMonth: STUDY_VIS_MO_100 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.textPrimary, position: "relative", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ position: "relative", background: "linear-gradient(135deg, #0065AC 0%, #004A82 100%)", padding: "14px 20px", borderBottom: `3px solid ${C.accentBlue}` }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 580, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ fontSize: 9, color: "#a0d4f0", letterSpacing: 3, fontWeight: 700 }}>PHESGO ENABLEMENT TOOL</div>
            <div style={{ fontSize: 19, fontWeight: 800, marginTop: 2, color: "#fff" }}>Chair Capacity Calculator</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 8, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.15)", textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "#a0d4f0", letterSpacing: 1.5 }}>MVP v2.0 — PJP Field Tool</div>
            <div style={{ fontSize: 7, color: "#80b8d8" }}>Aligned to ESMO 2025 Data</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "18px 16px 48px", position: "relative" }}>

        {/* === INPUTS AT TOP === */}
        {/* Patient Input */}
        <div style={{
          borderRadius: 14, padding: "16px 18px", marginBottom: 12,
          background: C.cardBg, border: `2px solid ${C.accentBlue}`,
          boxShadow: "0 2px 12px rgba(0,101,172,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,101,172,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🏥</div>
            <div style={{ fontSize: 11, color: C.textPrimary, fontWeight: 700 }}>How many HER2+ patients per year at this center?</div>
          </div>
          <input type="number" value={her2}
            onChange={e => setHer2(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: "100%", background: "#F7F8FA", border: `2px solid ${C.cardBorder}`, borderRadius: 10, color: C.textPrimary, fontSize: 32, fontWeight: 900, outline: "none", textAlign: "center", padding: "8px 0", fontVariantNumeric: "tabular-nums", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = C.accentBlue}
            onBlur={e => e.target.style.borderColor = C.cardBorder}
          />
          <div style={{ fontSize: 9, color: C.textDim, marginTop: 8, textAlign: "center" }}>
            This center's volume is equivalent to <strong style={{ color: C.accentBlue }}>{(share * 100).toFixed(1)}%</strong> of the 3-center study cohort ({STUDY_HER2_PTS.toLocaleString()} pts)
          </div>
        </div>

        {/* Adoption Slider */}
        <div style={{
          position: "relative", borderRadius: 14, padding: "16px 20px", marginBottom: 22,
          background: C.cardBg, border: `2px solid ${C.accentTeal}`,
          boxShadow: "0 2px 12px rgba(0,133,124,0.1)", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: `${adopt}%`, height: "100%", background: "linear-gradient(90deg, rgba(0,133,124,0.03), rgba(0,133,124,0.08))", transition: "width 0.4s ease", pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,133,124,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>📈</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: C.textPrimary, fontWeight: 700 }}>SC Adoption Rate</div>
              <div style={{ fontSize: 9, color: C.textMuted }}>What if we switch this %?</div>
            </div>
            <div>
              <span style={{ fontSize: 38, fontWeight: 900, color: C.accentTeal, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{adopt}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.accentTeal }}>%</span>
            </div>
          </div>
          <input type="range" min={10} max={100} step={5} value={adopt}
            onChange={e => setAdopt(Number(e.target.value))}
            style={{ position: "relative", width: "100%", marginTop: 4, height: 6, accentColor: "#00857C" }}
          />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 8, color: C.textDim, marginTop: 5 }}>
            {[10, 25, 50, 75, 100].map(v => <span key={v} style={{ fontWeight: adopt === v ? 700 : 400, color: adopt === v ? C.accentTeal : C.textDim }}>{v}%</span>)}
          </div>
        </div>

        {/* === RESULTS === */}
        <div style={{ fontSize: 9, color: C.textMuted, letterSpacing: 2.5, fontWeight: 700, marginBottom: 10 }}>THIS CENTER'S PROJECTED IMPACT</div>

        {/* Hero */}
        <div style={{
          position: "relative", borderRadius: 20, padding: "22px 20px", textAlign: "center", marginBottom: 12,
          background: C.cardBg, borderTop: `4px solid ${C.successGreen}`,
          border: `1px solid ${C.cardBorder}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -20, right: -10, fontSize: 120, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>⏱</div>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 9, color: C.successGreen, letterSpacing: 3, fontWeight: 700 }}>CHAIR-HOURS FREED PER YEAR</div>
            <div style={{
              fontSize: 62, fontWeight: 900, lineHeight: 1, marginTop: 8,
              background: "linear-gradient(180deg, #16A34A, #138a3e, #0f7233)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 1px 4px rgba(22,163,74,0.2))",
              fontVariantNumeric: "tabular-nums"
            }}>{centerHrsYear.toLocaleString()}</div>

            <div style={{ fontSize: 11, color: C.successGreen, marginTop: 6, fontWeight: 600 }}>
              (Or <strong style={{color: C.textPrimary}}>{centerHrsMonth.toLocaleString()}</strong> hours per month)
            </div>

            <div style={{ fontSize: 8, color: C.textDim, marginTop: 10, lineHeight: 1.6, borderTop: `1px solid ${C.cardBorder}`, paddingTop: 8 }}>
              Study Cohort at {adopt}% adoption: {studyHrsMonth.toLocaleString()} hrs/month
              <br/>This center ({(share * 100).toFixed(1)}% of cohort) = {centerHrsMonth.toLocaleString()} hrs/month
            </div>
          </div>
        </div>

        {/* 3 Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Card icon="👥" label="ADDITIONAL VISITS / YEAR" borderColor="#8CB800" bg={C.cardBg} borderC={C.cardBorder}>
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginTop: 6, background: "linear-gradient(180deg, #6B9900, #4A7700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>+{centerVisYear.toLocaleString()}</div>
            <div style={{ fontSize: 8, color: C.textMuted, marginTop: 3 }}>
              (+{centerVisMonth.toLocaleString()} / month)
            </div>
          </Card>

          <Card icon="👩‍⚕️" label="NURSE HOURS FREED / YEAR" borderColor={C.accentBlue} bg={C.cardBg} borderC={C.cardBorder}>
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginTop: 6, background: "linear-gradient(180deg, #0065AC, #004A82)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>{nurseFreedHrs.toLocaleString()}</div>
            <div style={{ fontSize: 8, color: C.textMuted, marginTop: 3 }}>
              {onSC} pts × ({IV_NURSE}-{SC_NURSE}) min
            </div>
          </Card>

          <Card icon="💊" label="PHARMA HOURS FREED / YEAR" borderColor={C.purple} bg={C.cardBg} borderC={C.cardBorder}>
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginTop: 6, background: "linear-gradient(180deg, #7C3AED, #5B21B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>{pharmaFreedHrs.toLocaleString()}</div>
            <div style={{ fontSize: 8, color: C.textMuted, marginTop: 3 }}>
              {onSC} pts × ({IV_PHARMA}-{SC_PHARMA}) min
            </div>
          </Card>
        </div>

        {/* PJP Talking Point */}
        <div style={{ borderRadius: 14, padding: "14px 20px", marginBottom: 14, background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 8, color: C.amberGold, letterSpacing: 2.5, fontWeight: 700, marginBottom: 8 }}>PJP TALKING POINT</div>
          <div style={{ fontSize: 12, color: C.textSecondary, lineHeight: 1.8, fontStyle: "italic" }}>
            "Doctor, a 2025 Annals of Oncology study led by NCI Cairo tracked 1,965 patients. They found IV P+H takes 235 minutes of chair time versus just 23 minutes with SC. At full 100% adoption, their model projected <strong style={{ color: C.textPrimary, fontStyle: "normal" }}>7,141 chair-hours freed per month</strong> across the three study centers.
            <br/><br/>
            If we apply that same {adopt}% adoption rate to your center's volume of {her2} patients, that means roughly <strong style={{ color: C.successGreen, fontStyle: "normal" }}>{centerHrsMonth.toLocaleString()} chair-hours freed every single month</strong>, enabling <strong style={{ color: "#6B9900", fontStyle: "normal" }}>+{centerVisYear.toLocaleString()} additional treatment visits</strong> per year."
          </div>
        </div>

        {/* Study Table */}
        <div style={{ borderRadius: 14, padding: "14px 16px", marginBottom: 14, background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>PUBLISHED STUDY PROJECTIONS (Monthly, 3 Centers Combined)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {STUDY_PROJECTIONS.map((s, i) => {
              const isActive = i === nearestIdx;
              return (
                <div key={s.pct} style={{
                  padding: "10px", borderRadius: 10, textAlign: "center",
                  background: isActive ? "rgba(0,101,172,0.06)" : "#F7F8FA",
                  border: isActive ? `1px solid rgba(0,101,172,0.3)` : `1px solid ${C.cardBorder}`,
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: isActive ? C.accentBlue : C.textDim }}>{s.pct}%</div>
                  <div style={{ fontSize: 9, color: isActive ? C.successGreen : C.textSecondary, marginTop: 4 }}>
                    <strong>{s.hrsMonth.toLocaleString()}</strong> hrs/mo
                  </div>
                  <div style={{ fontSize: 9, color: isActive ? "#6B9900" : C.textSecondary }}>
                    <strong>+{s.visMonth.toLocaleString()}</strong> visits/mo
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 7, color: C.textDim, marginTop: 8, textAlign: "center", fontStyle: "italic" }}>
            *100% data points (7,141 hrs / 1,888 visits) exact from ESMO slide.
          </div>
        </div>

        {/* === STUDY DATA (bottom) === */}
        {/* Measured Times */}
        <div style={{ borderRadius: 12, padding: "14px 16px", marginBottom: 14, background: C.cardBg, border: `1px solid ${C.cardBorder}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>MEASURED PER-CYCLE TIMES (from the study)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 0 }}>
            <div style={{ padding: "6px 8px", borderBottom: `1px solid ${C.cardBorder}` }}></div>
            <div style={{ padding: "6px 8px", fontSize: 8, color: C.alertCoral, fontWeight: 700, textAlign: "center", borderBottom: `1px solid ${C.cardBorder}` }}>IV COMBO (P+H)</div>
            <div style={{ padding: "6px 8px", fontSize: 8, color: C.successGreen, fontWeight: 700, textAlign: "center", borderBottom: `1px solid ${C.cardBorder}` }}>SC (PHESGO)</div>
            {[
              { label: "Chair time", iv: IV_COMBO_CHAIR, sc: SC_CHAIR },
              { label: "Nurse time", iv: IV_NURSE, sc: SC_NURSE },
              { label: "Pharmacist time", iv: IV_PHARMA, sc: SC_PHARMA },
            ].map((row, i) => (
              [
                <div key={`l${i}`} style={{ padding: "7px 8px", fontSize: 10, color: C.textSecondary, background: i % 2 ? "#F7F8FA" : "transparent" }}>{row.label}</div>,
                <div key={`iv${i}`} style={{ padding: "7px 8px", fontSize: 17, fontWeight: 900, color: C.alertCoral, textAlign: "center", background: i % 2 ? "#F7F8FA" : "transparent" }}>{row.iv}<span style={{ fontSize: 10, fontWeight: 600 }}> min</span></div>,
                <div key={`sc${i}`} style={{ padding: "7px 8px", fontSize: 17, fontWeight: 900, color: C.successGreen, textAlign: "center", background: i % 2 ? "#F7F8FA" : "transparent" }}>{row.sc}<span style={{ fontSize: 10, fontWeight: 600 }}> min</span></div>,
              ]
            )).flat()}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            {[{ l: "Chair", p: 90 }, { l: "Nurse", p: 90 }, { l: "Pharmacist", p: 94 }].map(r => (
              <div key={r.l} style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", fontSize: 9, color: C.successGreen, fontWeight: 700 }}>
                {r.l} ↓{r.p}%
              </div>
            ))}
          </div>
        </div>

        {/* Study Banner */}
        <div style={{
          borderRadius: 12, padding: "11px 16px", marginBottom: 14,
          background: "linear-gradient(135deg, rgba(196,136,0,0.06), rgba(196,136,0,0.02))",
          border: `1px solid rgba(196,136,0,0.2)`, display: "flex", gap: 12, alignItems: "center"
        }}>
          <div style={{ fontSize: 20, lineHeight: 1 }}>📄</div>
          <div>
            <div style={{ fontSize: 9, color: C.amberGold, fontWeight: 700, letterSpacing: 1 }}>POWERED BY PUBLISHED EGYPTIAN EVIDENCE</div>
            <div style={{ fontSize: 8, color: C.textMuted, marginTop: 2, lineHeight: 1.5 }}>
              Shash E et al. <em>Ann Oncol.</em> 2025;36(S2):2321P — n=1,965 patients
              <br/>NCI-BCCC Cairo | Harmel Cancer Center | Sohag Cancer Center
              <br/><strong>Slide Finding:</strong> 100% SC adoption frees 7,141 hrs & 1,888 visits/mo.
            </div>
          </div>
        </div>

        {/* References */}
        <div style={{ padding: "12px 14px", borderRadius: 12, background: "#F0F2F5", border: `1px solid ${C.cardBorder}` }}>
          <div style={{ fontSize: 7, color: C.textDim, letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>REFERENCES & METHODOLOGY</div>
          <div style={{ fontSize: 7.5, color: C.textMuted, lineHeight: 2 }}>
            <strong style={{ color: C.textSecondary }}>[1]</strong> Shash E, Khorshid OMR, Amin HM, et al. <em>Ann Oncol.</em> 2025;36(S2):2321P.
            <br/><strong style={{ color: C.textSecondary }}>Method:</strong> Chair-hours & visits are scaled linearly from the study's stated 100% maximums (7,141 hrs / 1,888 visits per month), then proportioned by the user's input patient volume vs the study's 1,965 patient cohort size.
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"] { -webkit-appearance: none; appearance: none; background: #E2E6EC; border-radius: 6px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #00857C, #006B64); cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 8px rgba(0,133,124,0.3); }
        input[type="range"]::-webkit-slider-thumb:hover { box-shadow: 0 0 16px rgba(0,133,124,0.4); }
        input[type="number"] { font-variant-numeric: tabular-nums; }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.3; }
      `}</style>
    </div>
  );
}

function Card({ children, icon, label, borderColor, bg, borderC }) {
  return (
    <div style={{ position: "relative", borderRadius: 14, padding: "16px 12px", textAlign: "center", background: bg, border: `1px solid ${borderC}`, borderTop: `4px solid ${borderColor}`, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -8, right: -4, fontSize: 65, opacity: 0.06, pointerEvents: "none", userSelect: "none" }}>{icon}</div>
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 8, color: "#6B7B8B", letterSpacing: 2, fontWeight: 700 }}>{label}</div>
        {children}
      </div>
    </div>
  );
}
