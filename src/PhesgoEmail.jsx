import { useState } from "react";

export default function PhesgoEmail({ her2, adopt }) {
  const [centerName, setCenterName] = useState("National Cancer Institute — Cairo");
  const [doctorName, setDoctorName] = useState("Prof. Ahmed");

  // Study constants
  const IV_MIN = 235, SC_MIN = 23, IV_NURSE = 169, SC_NURSE = 17;
  const STUDY_HER2_PTS = 1965, CY = 17;
  const STUDY_HRS_MO_100 = 7141, STUDY_VIS_MO_100 = 1888;

  // Calculations using shared her2 & adopt from calculator
  const share = her2 / STUDY_HER2_PTS;
  const studyHrsMonth = Math.round((adopt / 100) * STUDY_HRS_MO_100);
  const studyVisMonth = Math.round((adopt / 100) * STUDY_VIS_MO_100);
  const freedHrsYr = Math.round(studyHrsMonth * 12 * share);
  const extraVisYr = Math.round(studyVisMonth * 12 * share);
  const onSC = Math.round(her2 * adopt / 100);
  const nurseHrsSaved = Math.round(onSC * (IV_NURSE - SC_NURSE) * CY / 60);

  return (
    <div style={{ minHeight: "100vh", background: "#e8ecf0", fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "20px 16px" }}>

      {/* Editor Controls */}
      <div style={{ maxWidth: 620, margin: "0 auto 16px", background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #d0d8e0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#0065AC", letterSpacing: 2, marginBottom: 10 }}>PERSONALIZATION FIELDS</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Doctor Name" value={doctorName} onChange={setDoctorName} />
          <Field label="Center Name" value={centerName} onChange={setCenterName} />
        </div>
        <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "#f0f6fc", border: "1px solid #d0e0f0", fontSize: 9, color: "#4A5A6A" }}>
          Using calculator inputs: <strong style={{ color: "#0065AC" }}>{her2.toLocaleString()}</strong> patients, <strong style={{ color: "#00857C" }}>{adopt}%</strong> adoption
        </div>
      </div>

      {/* === THE EMAIL === */}
      <div style={{ maxWidth: 620, margin: "0 auto", background: "#ffffff", borderRadius: 0, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>

        {/* Roche Blue Header Bar */}
        <div style={{ background: "#0065AC", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", letterSpacing: -0.3 }}>PHESGO</div>
            <div style={{ fontSize: 8, color: "#a0d0f0", letterSpacing: 2, fontWeight: 600, marginTop: 2 }}>CAPACITY INSIGHTS</div>
          </div>
          <div style={{ fontSize: 9, color: "#80b8e0", textAlign: "right", lineHeight: 1.5 }}>
            Personalized for<br/><span style={{ color: "#ffffff", fontWeight: 700 }}>{centerName}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "28px 28px 20px" }}>

          {/* Greeting */}
          <div style={{ fontSize: 15, color: "#1a2b3c", lineHeight: 1.7, marginBottom: 20 }}>
            Dear <strong>{doctorName}</strong>,
            <br/><br/>
            Thank you for your time discussing infusion capacity at <strong>{centerName}</strong>. Based on our conversation, here's a summary of the potential impact of transitioning to Phesgo SC for your HER2+ patients.
          </div>

          {/* Divider */}
          <div style={{ height: 2, background: "linear-gradient(90deg, #0065AC, #00857C)", borderRadius: 2, marginBottom: 24 }} />

          {/* THE KEY FINDING */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: "#0065AC", fontWeight: 700, letterSpacing: 2.5, marginBottom: 8 }}>PUBLISHED EGYPTIAN EVIDENCE</div>
            <div style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: "#D4574B", fontFamily: "Georgia, serif" }}>{IV_MIN}</span>
              <span style={{ fontSize: 16, color: "#8a9aaa" }}>min</span>
              <span style={{ fontSize: 24, color: "#c0c8d0", margin: "0 8px" }}>→</span>
              <span style={{ fontSize: 52, fontWeight: 900, color: "#2E8B57", fontFamily: "Georgia, serif" }}>{SC_MIN}</span>
              <span style={{ fontSize: 16, color: "#8a9aaa" }}>min</span>
            </div>
            <div style={{ fontSize: 12, color: "#5a6a7a", marginTop: 4 }}>
              IV combo chair time → Phesgo SC chair time per cycle
            </div>
            <div style={{ fontSize: 9, color: "#8a9aaa", marginTop: 4 }}>
              Measured at NCI Cairo, Harmel & Sohag — Shash et al. <em>Ann Oncol.</em> 2025
            </div>
          </div>

          {/* YOUR CENTER'S PROJECTION — HIGHLIGHTED */}
          <div style={{ background: "#0065AC", borderRadius: 14, padding: "22px 22px", marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: "#80c0f0", fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
              PROJECTED IMPACT FOR {centerName.toUpperCase()}
            </div>
            <div style={{ fontSize: 11, color: "#c0ddf0", marginBottom: 16 }}>
              At <strong style={{ color: "#fff" }}>{adopt}% SC adoption</strong> across your <strong style={{ color: "#fff" }}>{her2.toLocaleString()}</strong> HER2+ patients per year:
            </div>

            {/* 3 Metric Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <MetricBox value={freedHrsYr.toLocaleString()} unit="hrs/year" label="Chair-hours freed" />
              <MetricBox value={`+${extraVisYr.toLocaleString()}`} unit="visits/year" label="Additional visits" />
              <MetricBox value={nurseHrsSaved.toLocaleString()} unit="hrs/year" label="Nurse hours freed" />
            </div>
          </div>

          {/* WHAT THIS MEANS */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: "#0065AC", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>WHAT THIS MEANS FOR YOUR CENTER</div>

            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 12px" }}>
              <Bullet icon="⏱" />
              <div style={{ fontSize: 12, color: "#2a3a4a", lineHeight: 1.6 }}>
                <strong>Same dual blockade, 90% less chair time</strong> — Phesgo delivers pertuzumab + trastuzumab in a single SC injection (Lancet Oncol 2021: pCR 59.7% SC vs 59.5% IV)
              </div>
              <Bullet icon="👥" />
              <div style={{ fontSize: 12, color: "#2a3a4a", lineHeight: 1.6 }}>
                <strong>Capacity to serve more patients</strong> — freed chair-hours can absorb the growing demand from the Presidential screening initiative
              </div>
              <Bullet icon="👩‍⚕️" />
              <div style={{ fontSize: 12, color: "#2a3a4a", lineHeight: 1.6 }}>
                <strong>Nurse time recovered</strong> — {nurseHrsSaved.toLocaleString()} hours of skilled nursing time redirected to higher-value patient care
              </div>
              <Bullet icon="💊" />
              <div style={{ fontSize: 12, color: "#2a3a4a", lineHeight: 1.6 }}>
                <strong>Fixed dose, zero wastage</strong> — no weight-based calculation needed, eliminating drug wastage in our patient population
              </div>
            </div>
          </div>

          {/* PATIENT PREFERENCE */}
          <div style={{
            background: "linear-gradient(135deg, #f0fdf4, #f5f8fb)", borderRadius: 10, padding: "16px 18px",
            marginBottom: 22, border: "1px solid #d0e8d8", display: "flex", alignItems: "center", gap: 16
          }}>
            <div style={{ flexShrink: 0, width: 56, height: 56, borderRadius: "50%", background: "#2E8B57", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#ffffff", fontFamily: "Georgia, serif" }}>85%</span>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#1a3a2a", fontWeight: 700 }}>of patients preferred SC over IV</div>
              <div style={{ fontSize: 10, color: "#5a7a6a", marginTop: 2 }}>
                PHranceSCa trial — most common reason: less time in clinic
                <br/><span style={{ fontSize: 9, color: "#8aaa9a" }}>O'Shaughnessy J et al. Eur J Cancer. 2021;152:223-232</span>
              </div>
            </div>
          </div>

          {/* NEXT STEPS */}
          <div style={{ background: "#0065AC", borderRadius: 10, padding: "18px 20px", marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: "#80c0f0", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>SUGGESTED NEXT STEPS</div>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 10px" }}>
              {[
                "Review these projections with your infusion unit team",
                "Identify 3-5 stable maintenance patients as initial candidates",
                "Schedule a 30-minute nurse SC training session at your center",
                "I can arrange a brief peer call with a colleague already using Phesgo SC"
              ].map((step, i) => (
                <StepRow key={i} num={i + 1} text={step} />
              ))}
            </div>
          </div>

          {/* CLOSING */}
          <div style={{ fontSize: 13, color: "#1a2b3c", lineHeight: 1.7, marginBottom: 20 }}>
            {doctorName}, I'm available to discuss any of these projections in more detail or to arrange a peer consultation at your convenience.
            <br/><br/>
            Best regards,
          </div>

          {/* Digital Enabler Signature */}
          <div style={{ borderTop: "1px solid #e4eaf0", paddingTop: 14, marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a2b3c" }}>[Digital Enabler Name]</div>
            <div style={{ fontSize: 10, color: "#5a6a7a", marginTop: 2, lineHeight: 1.5 }}>
              Digital Enabler — Breast Cancer POD
              <br/>Roche Egypt
              <br/>[Phone] | [Email]
            </div>
          </div>
        </div>

        {/* Email Footer */}
        <div style={{ background: "#f5f8fb", padding: "16px 28px", borderTop: "1px solid #e4eaf0" }}>
          <div style={{ fontSize: 7.5, color: "#8a9aaa", lineHeight: 1.8, textAlign: "center" }}>
            <strong>References:</strong> [1] Shash E et al. Ann Oncol. 2025;36(S2):2321P [2] Tan AR et al. Lancet Oncol. 2021;22(1):85-97
            [3] O'Shaughnessy J et al. Eur J Cancer. 2021;152:223-232 [4] Phesgo PI, Genentech 2024
            <br/>Projections are center-specific estimates based on published national model. For HCP use only. Not for distribution.
            <br/>© Roche Egypt {new Date().getFullYear()} | This communication is for healthcare professionals only
          </div>
        </div>
      </div>

      {/* MVP Note */}
      <div style={{ maxWidth: 620, margin: "16px auto 0", textAlign: "center", fontSize: 9, color: "#8a9aaa", lineHeight: 1.8 }}>
        MVP — Personalized Email Template | Data auto-synced from Calculator tab
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: "#6a7a8a", marginBottom: 3 }}>{label}</div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "6px 10px", borderRadius: 6,
          border: "1px solid #d0d8e0", fontSize: 12, color: "#1a2b3c",
          outline: "none", fontFamily: "'Segoe UI', system-ui, sans-serif"
        }}
        onFocus={e => e.target.style.borderColor = "#0065AC"}
        onBlur={e => e.target.style.borderColor = "#d0d8e0"}
      />
    </div>
  );
}

function MetricBox({ value, unit, label }) {
  return (
    <div style={{ textAlign: "center", padding: "14px 8px", borderRadius: 10, background: "rgba(255,255,255,0.12)" }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", fontFamily: "Georgia, serif" }}>{value}</div>
      <div style={{ fontSize: 8, color: "#a0d0f0", marginTop: 1 }}>{unit}</div>
      <div style={{ fontSize: 8, color: "#80b8e0", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function Bullet({ icon }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", background: "#f0f5fa",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, flexShrink: 0, marginTop: 2
    }}>{icon}</div>
  );
}

function StepRow({ num, text }) {
  return (
    <>
      <div style={{
        width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 800, color: "#ffffff", flexShrink: 0, marginTop: 2
      }}>{num}</div>
      <div style={{ fontSize: 11, color: "#d0e0f0", lineHeight: 1.5, paddingTop: 2 }}>{text}</div>
    </>
  );
}
