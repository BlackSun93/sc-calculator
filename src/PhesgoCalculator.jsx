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

export default function PhesgoCalculator({ her2, setHer2, adopt, setAdopt }) {

  const STUDY_HER2_PTS = 1965;
  const STUDY_HRS_MO_100 = 7141;
  const STUDY_VIS_MO_100 = 1888;

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

  return (
    <div style={{ minHeight: "100vh", background: C.pageBg, fontFamily: "'Segoe UI', system-ui, sans-serif", color: C.textPrimary, position: "relative", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ position: "relative", background: "linear-gradient(135deg, #0065AC 0%, #004A82 100%)", padding: "12px 20px", borderBottom: `3px solid ${C.accentBlue}` }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 580, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ fontSize: 9, color: "#a0d4f0", letterSpacing: 3, fontWeight: 700 }}>PHESGO ENABLEMENT TOOL</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2, color: "#fff" }}>Chair Capacity Calculator</div>
          </div>
          <div style={{ background: "rgba(0,0,0,0.15)", borderRadius: 8, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.15)", textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "#a0d4f0", letterSpacing: 1.5 }}>MVP v2.0 — PJP Field Tool</div>
            <div style={{ fontSize: 7, color: "#80b8d8" }}>Aligned to ESMO 2025 Data</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 580, margin: "0 auto", padding: "14px 14px 32px", position: "relative" }}>

        {/* Patient Input */}
        <div style={{
          borderRadius: 12, padding: "12px 14px", marginBottom: 10,
          background: C.cardBg, border: `2px solid ${C.accentBlue}`,
          boxShadow: "0 2px 8px rgba(0,101,172,0.08)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,101,172,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🏥</div>
            <div style={{ fontSize: 10, color: C.textPrimary, fontWeight: 700 }}>HER2+ patients per year at this center</div>
          </div>
          <input type="text" inputMode="numeric" pattern="[0-9]*" value={her2}
            onChange={e => { const v = e.target.value.replace(/[^0-9]/g, ''); setHer2(Number(v) || 1); }}
            style={{ width: "100%", background: "#F7F8FA", border: `2px solid ${C.cardBorder}`, borderRadius: 10, color: C.textPrimary, fontSize: "clamp(22px, 6vw, 32px)", fontWeight: 900, outline: "none", textAlign: "center", padding: "6px 0", fontVariantNumeric: "tabular-nums", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = C.accentBlue}
            onBlur={e => e.target.style.borderColor = C.cardBorder}
          />
        </div>

        {/* Adoption Slider */}
        <div style={{
          position: "relative", borderRadius: 12, padding: "12px 16px", marginBottom: 16,
          background: C.cardBg, border: `2px solid ${C.accentTeal}`,
          boxShadow: "0 2px 8px rgba(0,133,124,0.08)", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: `${adopt}%`, height: "100%", background: "linear-gradient(90deg, rgba(0,133,124,0.03), rgba(0,133,124,0.08))", transition: "width 0.4s ease", pointerEvents: "none" }} />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,133,124,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>📈</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: C.textPrimary, fontWeight: 700 }}>SC Adoption Rate</div>
            </div>
            <div>
              <span style={{ fontSize: "clamp(26px, 8vw, 38px)", fontWeight: 900, color: C.accentTeal, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{adopt}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.accentTeal }}>%</span>
            </div>
          </div>
          <input type="range" min={10} max={100} step={5} value={adopt}
            onChange={e => setAdopt(Number(e.target.value))}
            style={{ position: "relative", width: "100%", marginTop: 2, height: 6, accentColor: "#00857C" }}
          />
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", fontSize: 8, color: C.textDim, marginTop: 4 }}>
            {[10, 25, 50, 75, 100].map(v => <span key={v} style={{ fontWeight: adopt === v ? 700 : 400, color: adopt === v ? C.accentTeal : C.textDim }}>{v}%</span>)}
          </div>
        </div>

        {/* === RESULTS === */}
        <div style={{ fontSize: 8, color: C.textMuted, letterSpacing: 2.5, fontWeight: 700, marginBottom: 8 }}>PROJECTED IMPACT</div>

        {/* Hero */}
        <div style={{
          position: "relative", borderRadius: 16, padding: "16px 16px", textAlign: "center", marginBottom: 10,
          background: C.cardBg, borderTop: `4px solid ${C.successGreen}`,
          border: `1px solid ${C.cardBorder}`,
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)", overflow: "hidden"
        }}>
          <div style={{ position: "relative" }}>
            <div style={{ fontSize: 8, color: C.successGreen, letterSpacing: 2.5, fontWeight: 700 }}>CHAIR-HOURS FREED PER YEAR</div>
            <div style={{
              fontSize: "clamp(36px, 10vw, 58px)", fontWeight: 900, lineHeight: 1, marginTop: 6,
              background: "linear-gradient(180deg, #16A34A, #138a3e, #0f7233)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 1px 4px rgba(22,163,74,0.2))",
              fontVariantNumeric: "tabular-nums"
            }}>{centerHrsYear.toLocaleString()}</div>

          </div>
        </div>

        {/* 3 Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          <Card icon="👥" label="EXTRA VISITS / YR" borderColor="#8CB800" bg={C.cardBg} borderC={C.cardBorder}>
            <div style={{ fontSize: "clamp(22px, 7vw, 36px)", fontWeight: 900, lineHeight: 1.1, marginTop: 4, background: "linear-gradient(180deg, #6B9900, #4A7700)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>+{centerVisYear.toLocaleString()}</div>
            <div style={{ fontSize: 7, color: C.textMuted, marginTop: 2 }}>+{centerVisMonth.toLocaleString()}/mo</div>
          </Card>

          <Card icon="👩‍⚕️" label="NURSE HRS / YR" borderColor={C.accentBlue} bg={C.cardBg} borderC={C.cardBorder}>
            <div style={{ fontSize: "clamp(22px, 7vw, 36px)", fontWeight: 900, lineHeight: 1.1, marginTop: 4, background: "linear-gradient(180deg, #0065AC, #004A82)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>{nurseFreedHrs.toLocaleString()}</div>
            <div style={{ fontSize: 7, color: C.textMuted, marginTop: 2 }}>freed</div>
          </Card>

          <Card icon="💊" label="PHARMA HRS / YR" borderColor={C.purple} bg={C.cardBg} borderC={C.cardBorder}>
            <div style={{ fontSize: "clamp(22px, 7vw, 36px)", fontWeight: 900, lineHeight: 1.1, marginTop: 4, background: "linear-gradient(180deg, #7C3AED, #5B21B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontVariantNumeric: "tabular-nums" }}>{pharmaFreedHrs.toLocaleString()}</div>
            <div style={{ fontSize: 7, color: C.textMuted, marginTop: 2 }}>freed</div>
          </Card>
        </div>

        {/* References */}
        <div style={{ padding: "10px 12px", borderRadius: 10, background: "#F0F2F5", border: `1px solid ${C.cardBorder}` }}>
          <div style={{ fontSize: 7, color: C.textDim, letterSpacing: 1.5, fontWeight: 700, marginBottom: 4 }}>REFERENCE</div>
          <div style={{ fontSize: 7, color: C.textMuted, lineHeight: 1.8 }}>
            Shash E et al. <em>Ann Oncol.</em> 2025;36(S2):2321P — n=1,965 pts across 3 Egyptian centers.
            Projections scaled linearly from study's 100% maximums (7,141 hrs / 1,888 visits per month).
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"] { -webkit-appearance: none; appearance: none; background: #E2E6EC; border-radius: 6px; outline: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #00857C, #006B64); cursor: pointer; border: 3px solid #fff; box-shadow: 0 0 8px rgba(0,133,124,0.3); }
        input[type="range"]::-webkit-slider-thumb:hover { box-shadow: 0 0 16px rgba(0,133,124,0.4); }
      `}</style>
    </div>
  );
}

function Card({ children, icon, label, borderColor, bg, borderC }) {
  return (
    <div style={{ position: "relative", borderRadius: 12, padding: "12px 8px", textAlign: "center", background: bg, border: `1px solid ${borderC}`, borderTop: `3px solid ${borderColor}`, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -6, right: -2, fontSize: 50, opacity: 0.05, pointerEvents: "none", userSelect: "none" }}>{icon}</div>
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 7, color: "#6B7B8B", letterSpacing: 1.5, fontWeight: 700 }}>{label}</div>
        {children}
      </div>
    </div>
  );
}
