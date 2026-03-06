import { useState } from 'react'
import PhesgoCalculator from './PhesgoCalculator'
import OmnichannelTracker from './OmnichannelTracker'

function App() {
  const [tab, setTab] = useState("calculator")

  return (
    <div style={{ minHeight: "100vh", background: "#060e1a" }}>
      {/* Tab Navigation */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", justifyContent: "center", gap: 4,
        padding: "8px 16px",
        background: "rgba(6,14,26,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}>
        {[
          { id: "calculator", label: "Chair Capacity Calculator" },
          { id: "tracker", label: "Omnichannel Tracker" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 20px", borderRadius: 8,
            border: tab === t.id ? "1px solid #00b8d4" : "1px solid rgba(255,255,255,0.08)",
            background: tab === t.id ? "rgba(0,184,212,0.15)" : "transparent",
            color: tab === t.id ? "#00e8d8" : "#6a7a8a",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            letterSpacing: 0.5, fontFamily: "'Segoe UI', system-ui, sans-serif",
            transition: "all 0.2s ease"
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      {tab === "calculator" ? <PhesgoCalculator /> : <OmnichannelTracker />}
    </div>
  )
}

export default App
