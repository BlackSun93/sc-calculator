import { useState } from 'react'
import PhesgoCalculator from './PhesgoCalculator'
import PhesgoEmail from './PhesgoEmail'
import OmnichannelTracker from './OmnichannelTracker'

function App() {
  const [tab, setTab] = useState("calculator")

  return (
    <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>
      {/* Tab Navigation */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", justifyContent: "center", gap: 4,
        padding: "8px 16px",
        background: "rgba(247,248,250,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #E2E6EC"
      }}>
        {[
          { id: "calculator", label: "Chair Capacity Calculator" },
          { id: "emailer", label: "Complementary Emailer" },
          { id: "tracker", label: "Omnichannel Tracker" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 20px", borderRadius: 8,
            border: tab === t.id ? "1px solid #0065AC" : "1px solid #E2E6EC",
            background: tab === t.id ? "rgba(0,101,172,0.08)" : "transparent",
            color: tab === t.id ? "#0065AC" : "#6B7B8B",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            letterSpacing: 0.5, fontFamily: "'Segoe UI', system-ui, sans-serif",
            transition: "all 0.2s ease"
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      {tab === "calculator" && <PhesgoCalculator />}
      {tab === "emailer" && <PhesgoEmail />}
      {tab === "tracker" && <OmnichannelTracker />}
    </div>
  )
}

export default App
