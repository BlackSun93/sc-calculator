import { useState } from 'react'
import PhesgoCalculator from './PhesgoCalculator'
import PhesgoEmail from './PhesgoEmail'
import NurseNadia from './NurseNadia'

function App() {
  const [tab, setTab] = useState("calculator")
  const [her2, setHer2] = useState("")
  const [adopt, setAdopt] = useState(100)

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
          { id: "nadia", label: "Nurse Nadia" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 20px", borderRadius: 8,
            border: "none",
            background: tab === t.id ? "#0065AC" : "#E2E6EC",
            color: tab === t.id ? "#fff" : "#4A5A6A",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            letterSpacing: 0.5, fontFamily: "'Segoe UI', system-ui, sans-serif",
            transition: "all 0.2s ease"
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      {tab === "calculator" && <PhesgoCalculator her2={her2} setHer2={setHer2} adopt={adopt} setAdopt={setAdopt} />}
      {tab === "emailer" && <PhesgoEmail her2={her2} adopt={adopt} />}
      {tab === "nadia" && <NurseNadia />}
    </div>
  )
}

export default App
