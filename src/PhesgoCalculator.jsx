import { useState } from "react";

export default function PhesgoCalculator() {
  // Defaulting to the study's exact parameters so the initial load matches the slide
  const [her2, setHer2] = useState(1965); 
  const [adopt, setAdopt] = useState(100);

  // =====================================================================
  // EXACT DATA FROM SLIDE: Shash E et al. Ann Oncol. 2025;36(Suppl 2):2321P
  // NCI-BCCC Cairo, Harmel Cancer Center, Sohag Cancer Center
  // n = 1,965 HER2+ patients
  // =====================================================================
  
  const STUDY_HER2_PTS = 1965;
  const STUDY_HRS_MO_100 = 7141; // Exact from slide
  const STUDY_VIS_MO_100 = 1888; // Exact from slide

  const IV_COMBO_CHAIR = 235;
  const SC_CHAIR = 23;
  const IV_NURSE = 169;
  const SC_NURSE = 17;
  const IV_PHARMA = 65;
  const SC_PHARMA = 4;
  const CYCLES_YR = 17;

  // Calculate the total study-level MONTHLY impact at the chosen adoption %
  const studyHrsMonth = Math.round((adopt / 100) * STUDY_HRS_MO_100);
  const studyVisMonth = Math.round((adopt / 100) * STUDY_VIS_MO_100);

  // Convert to ANNUAL for the study cohort
  const studyHrsYear = studyHrsMonth * 12;
  const studyVisYear = studyVisMonth * 12;

  // Calculate THIS center's share of the impact based on their patient volume
  const share = her2 / STUDY_HER2_PTS;
  const centerHrsMonth = Math.round(studyHrsMonth * share);
  const centerHrsYear = Math.round(studyHrsYear * share);
  const centerVisMonth = Math.round(studyVisMonth * share);
  const centerVisYear = Math.round(studyVisYear * share);

  // Nurse & pharmacist — direct per-cycle calculation
  const onSC = Math.round(her2 * (adopt / 100));
  const nurseFreedHrs = Math.round(onSC * (IV_NURSE - SC_NURSE) * CYCLES_YR / 60);
  const pharmaFreedHrs = Math.round(onSC * (IV_PHARMA - SC_PHARMA) * CYCLES_YR / 60);

  // For highlighting the closest bracket in the projections table
  const nearestIdx = adopt <= 62 ? 0 : adopt <= 87 ? 1 : 2;

  const STUDY_PROJECTIONS = [
    { pct: 50,  hrsMonth: Math.round(STUDY_HRS_MO_100 * 0.5), visMonth: Math.round(STUDY_VIS_MO_100 * 0.5) },
    { pct: 75,  hrsMonth: Math.round(STUDY_HRS_MO_100 * 0.75), visMonth: Math.round(STUDY_VIS_MO_100 * 0.75) },
    { pct: 100, hrsMonth: STUDY_HRS_MO_100, visMonth: STUDY_VIS_MO_100 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060e1a", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle at 1px 1px, #4488aa 1px, transparent 0)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
      <div style={{ position: "fixed", top: "-30%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,101,172,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,133,124,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "relative", background: "linear-gradient(135deg, #0065AC 0%, #003d6b 50%, #002a4a 100%)", padding: "14px 20px", borderBottom: "3px solid #00b8d4" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 580, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ fontSize: 9, color: "#70c8f0", letterSpacing: 3, fontWeight: 700 }}>PHESGO ENABLEMENT TOOL</div>
            <div style={{ fontSize: 19, fontWeight: 800, marginTop: 2 }}>Chair Capacity Calculator</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: 8, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "#70c8f0", letterSpacing: 1.5 }}>MVP v2.0 — ISL Field Tool</div>
            <div style={{ fontSize: 7, color: "#5098b8" }}>Aligned to ESMO 2025 Data</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "18px 16px 48px", position: "relative" }}>

        {/* Study Banner */}
        <div style={{
          borderRadius: 12, padding: "11px 16px", marginBottom: 16,
          background: "linear-gradient(135deg, rgba(232,163,23,0.08), rgba(232,163,23,0.03))",
          border: "1px solid rgba(232,163,23,0.2)", display: "flex", gap: 12, alignItems: "center"
        }}>
          <div style={{ fontSize: 20, lineHeight: 1 }}>📄</div>
          <div>
            <div style={{ fontSize: 9, color: "#d4b46a", fontWeight: 700, letterSpacing: 1 }}>POWERED BY PUBLISHED EGYPTIAN EVIDENCE</div>
            <div style={{ fontSize: 8, color: "#887755", marginTop: 2, lineHeight: 1.5 }}>
              Shash E et al. <em>Ann Oncol.</em> 2025;36(S2):2321P — n=1,965 patients
              <br/>NCI-BCCC Cairo | Harmel Cancer Center | Sohag Cancer Center
              <br/><strong>Slide Finding:</strong> 100% SC adoption frees 7,141 hrs & 1,888 visits/mo.
            </div>
          </div>
        </div>

        {/* Measured Times */}
        <div style={{ borderRadius: 12, padding: "14px 16px", marginBottom: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, color: "#6a7a8a", letterSpacing: 2, fontWeight: 700, marginBottom: 12 }}>MEASURED PER-CYCLE TIMES (from the study)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 0 }}>
            <div style={{ padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}></div>
            <div style={{ padding: "6px 8px", fontSize: 8, color: "#ff8a7a", fontWeight: 700, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>IV COMBO (P+H)</div>
            <div style={{ padding: "6px 8px", fontSize: 8, color: "#4ade80", fontWeight: 700, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>SC (PHESGO)</div>
            {[
              { label: "Chair time", iv: IV_COMBO_CHAIR, sc: SC_CHAIR },
              { label: "Nurse time", iv: IV_NURSE, sc: SC_NURSE },
              { label: "Pharmacist time", iv: IV_PHARMA, sc: SC_PHARMA },
            ].map((row, i) => (
              [
                <div key={`l${i}`} style={{ padding: "7px 8px", fontSize: 10, color: "#8899aa", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>{row.label}</div>,
                <div key={`iv${i}`} style={{ padding: "7px 8px", fontSize: 17, fontWeight: 900, color: "#ff8a7a", textAlign: "center", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>{row.iv}<span style={{ fontSize: 10, fontWeight: 600 }}> min</span></div>,
                <div key={`sc${i}`} style={{ padding: "7px 8px", fontSize: 17, fontWeight: 900, color: "#4ade80", textAlign: "center", background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent" }}>{row.sc}<span style={{ fontSize: 10, fontWeight: 600 }}> min</span></div>,
              ]
            )).flat()}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 10 }}>
            {[{ l: "Chair", p: 90 }, { l: "Nurse", p: 90 }, { l: "Pharmacist", p: 94 }].map(r => (
              <div key={r.l} style={{ padding: "3px 10px", borderRadius: 20, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", fontSize: 9, color: "#4ade80", fontWeight: 700 }}>
                {r.l} ↓{r.p}%
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <div style={{ borderRadius: 14, padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#6a7a8a", marginBottom: 8 }}>How many HER2+ patients per year at this center?</div>
          <input type="number" value={her2}
            onChange={e => setHer2(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: "100%", background: "transparent", border: "none", borderBottom: "2px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 32, fontWeight: 900, outline: "none", textAlign: "center", padding: "4px 0", fontVariantNumeric: "tabular-nums" }}
            onFocus={e => e.target.style.borderBottomColor = "#0085CA"}
            onBlur={e => e.target.style.borderBottomColor = "rgba(255,255,255,0.08)"}
          />
          <div style={{ fontSize: 8, color: "#5a6a7a", marginTop: 6, textAlign: "center" }}>
            This center's volume is equivalent to <strong>{(share * 100).toFixed(1)}%</strong> of the 3-center study cohort ({STUDY_HER2_PTS.toLocaleString()} pts)
          </div>
        </div>

        {/* Slider */}
        <div style={{
          position: "relative", borderRadius: 16, padding: "14px 20px", marginBottom: 22,
          background: "linear-gradient(135deg, rgba(0,133,124,0.08), rgba(0,101,172,0.08))",
          border: "1px solid rgba(0,184,170,0.2)", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: `${adopt}%`, height: "100%", background: "linear-gradient(90deg, rgba(0,133,124,0.06), rgba(0,212,200,0.1))", transition: "width 0.4s ease", pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div>
              <div style={{ fontSize: 10, color: "#6aaa9e", letterSpacing: 1.5, fontWeight: 600 }}>SC ADOPTION RATE</div>
              <div style={{ fontSize: 10, color: "#4a7872", marginTop: 1 }}>What if we switch this %?</div>
            </div>
            <div>
              <span style={{ fontSize: 38, fontWeight: 900, color: "#00e8d8", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{adopt}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#00b8a8" }}>%</span>
            </div>
          </div>
          <input type="range" min={10} max={100} step={5} value={adopt}
            onChange={e => setAdopt(Number(e.target.value))}
            style={{ position: "relative", width: "100%", marginTop: 10, height: 6, accentColor: "#00857C" }}
          />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 8, color: "#3a6662", marginTop: 3 }}>
            {[10, 25, 50, 75, 100].map(v => <span key={v} style={{ fontWeight: adopt === v ? 700 : 400, color: adopt === v ? "#00d4c8" : "#3a6662" }}>{v}%</span>)}
          </div>
        </div>

        {/* === RESULTS === */}
        <div style={{ fontSize: 9, color: "#6a7a8a", letterSpacing: 2.5, fontWeight: 700, marginBottom: 10 }}>THIS CENTER'S PROJECTED IMPACT</div>

        {/* Hero */}
        <div style={{
          position: "relative", borderRadius: 20, padding: "22px 20px", textAlign: "center", marginBottom: 12,
          background: "linear-gradient(160deg, #0a2a1c, #071e14, #0a1f10)",
          border: "1px solid rgba(74,222,128,0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: -20, right: -10, fontSize: 120, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>⏱</div>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(74,222,128,0.08), transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 9, color: "#4a9968", letterSpacing: 3, fontWeight: 700 }}>CHAIR-HOURS FREED PER YEAR</div>
            <div style={{
              fontSize: 62, fontWeight: 900, lineHeight: 1, marginTop: 8,
              background: "linear-gradient(180deg, #4ade80, #22c55e, #16a34a)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 8px rgba(74,222,128,0.3))",
              fontVariantNumeric: "tabular-nums"
            }}>{centerHrsYear.toLocaleString()}</div>
            
            <div style={{ fontSize: 11, color: "#4ade80", marginTop: 6, fontWeight: 600 }}>
              (Or <strong style={{color:"#fff"}}>{centerHrsMonth.toLocaleString()}</strong> hours per month)
            </div>

            <div style={{ fontSize: 8, color: "#4a7758", marginTop: 10, lineHeight: 1.6, borderTop: "1px solid rgba(74,222,128,0.1)", paddingTop: 8 }}>
              Study Cohort at {adopt}% adoption: {studyHrsMonth.toLocaleString()} hrs/month
              <br/>This center ({(share * 100).toFixed(1)}% of cohort) = {centerHrsMonth.toLocaleString()} hrs/month
            </div>
          </div>
        </div>

        {/* 3 Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Card icon="👥" label="ADDITIONAL VISITS / YEAR" bg="linear-gradient(160deg, #1a2a08, #101c05)" border="rgba(200,240,96,0.12)">
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginTop: 6, background: "linear-gradient(180deg, #d4f060, #a8d830)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>+{centerVisYear.toLocaleString()}</div>
            <div style={{ fontSize: 8, color: "#809040", marginTop: 3 }}>
              (+{centerVisMonth.toLocaleString()} / month)
            </div>
          </Card>

          <Card icon="👩‍⚕️" label="NURSE HOURS FREED / YEAR" bg="linear-gradient(160deg, #0d1a2a, #081220)" border="rgba(0,133,202,0.15)">
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginTop: 6, background: "linear-gradient(180deg, #60b8f0, #3090d0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>{nurseFreedHrs.toLocaleString()}</div>
            <div style={{ fontSize: 8, color: "#406878", marginTop: 3 }}>
              {onSC} pts × ({IV_NURSE}-{SC_NURSE}) min
            </div>
          </Card>

          <Card icon="💊" label="PHARMA HOURS FREED / YEAR" bg="linear-gradient(160deg, #1a0d20, #120818)" border="rgba(160,100,200,0.15)">
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, marginTop: 6, background: "linear-gradient(180deg, #c090f0, #9060d0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>{pharmaFreedHrs.toLocaleString()}</div>
            <div style={{ fontSize: 8, color: "#605080", marginTop: 3 }}>
              {onSC} pts × ({IV_PHARMA}-{SC_PHARMA}) min
            </div>
          </Card>
        </div>

        {/* Study Table */}
        <div style={{ borderRadius: 14, padding: "14px 16px", marginBottom: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, color: "#6a7a8a", letterSpacing: 2, fontWeight: 700, marginBottom: 10 }}>PUBLISHED STUDY PROJECTIONS (Monthly, 3 Centers Combined)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {STUDY_PROJECTIONS.map((s, i) => {
              const isActive = i === nearestIdx;
              return (
                <div key={s.pct} style={{
                  padding: "10px", borderRadius: 10, textAlign: "center",
                  background: isActive ? "rgba(0,133,124,0.1)" : "rgba(255,255,255,0.02)",
                  border: isActive ? "1px solid rgba(0,212,200,0.3)" : "1px solid rgba(255,255,255,0.04)",
                  transition: "all 0.3s ease"
                }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: isActive ? "#00e8d8" : "#556677" }}>{s.pct}%</div>
                  <div style={{ fontSize: 9, color: isActive ? "#4ade80" : "#445566", marginTop: 4 }}>
                    <strong>{s.hrsMonth.toLocaleString()}</strong> hrs/mo
                  </div>
                  <div style={{ fontSize: 9, color: isActive ? "#a0d830" : "#445566" }}>
                    <strong>+{s.visMonth.toLocaleString()}</strong> visits/mo
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 7, color: "#4a5a6a", marginTop: 8, textAlign: "center", fontStyle: "italic" }}>
            *100% data points (7,141 hrs / 1,888 visits) exact from ESMO slide.
          </div>
        </div>

        {/* ISL Script */}
        <div style={{ borderRadius: 14, padding: "14px 20px", marginBottom: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 8, color: "#c89830", letterSpacing: 2.5, fontWeight: 700, marginBottom: 8 }}>ISL TALKING POINT</div>
          <div style={{ fontSize: 12, color: "#a0b0c0", lineHeight: 1.8, fontStyle: "italic" }}>
            "Doctor, a 2025 Annals of Oncology study led by NCI Cairo tracked 1,965 patients. They found IV P+H takes 235 minutes of chair time versus just 23 minutes with SC. At full 100% adoption, their model projected <strong style={{ color: "#fff", fontStyle: "normal" }}>7,141 chair-hours freed per month</strong> across the three study centers. 
            <br/><br/>
            If we apply that same {adopt}% adoption rate to your center's volume of {her2} patients, that means roughly <strong style={{ color: "#4ade80", fontStyle: "normal" }}>{centerHrsMonth.toLocaleString()} chair-hours freed every single month</strong>, enabling <strong style={{ color: "#d4f060", fontStyle: "normal" }}>+{centerVisYear.toLocaleString()} additional treatment visits</strong> per year."
          </div>
        </div>

        {/* References */}
        <div style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}>
          <div style={{ fontSize: 7, color: "#2a3a4a", letterSpacing: 1.5, fontWeight: 700, marginBottom: 6 }}>REFERENCES & METHODOLOGY</div>
          <div style={{ fontSize: 7.5, color: "#3a5060", lineHeight: 2 }}>
            <strong style={{ color: "#4a6a7a" }}>[1]</strong> Shash E, Khorshid OMR, Amin HM, et al. <em>Ann Oncol.</em> 2025;36(S2):2321P. 
            <br/><strong style={{ color: "#4a6a7a" }}>Method:</strong> Chair-hours & visits are scaled linearly from the study's stated 100% maximums (7,141 hrs / 1,888 visits per month), then proportioned by the user's input patient volume vs the study's 1,965 patient cohort size. 
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"] { -webkit-appearance: none; appearance: none; background: linear-gradient(90deg, #0a2a2a, #142e2e); border-radius: 6px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #00c4b4, #00857C); cursor: pointer; border: 3px solid #c0f0e8; box-shadow: 0 0 16px rgba(0,196,180,0.35); }
        input[type="range"]::-webkit-slider-thumb:hover { box-shadow: 0 0 24px rgba(0,196,180,0.5); }
        input[type="number"] { font-variant-numeric: tabular-nums; }
        input[type="number"]::-webkit-inner-spin-button { opacity: 0.3; }
      `}</style>
    </div>
  );
}

function Card({ children, icon, label, bg, border }) {
  return (
    <div style={{ position: "relative", borderRadius: 14, padding: "16px 12px", textAlign: "center", background: bg, border: `1px solid ${border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -8, right: -4, fontSize: 65, opacity: 0.04, pointerEvents: "none", userSelect: "none" }}>{icon}</div>
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 8, color: "#7a8a9a", letterSpacing: 2, fontWeight: 700 }}>{label}</div>
        {children}
      </div>
    </div>
  );
}