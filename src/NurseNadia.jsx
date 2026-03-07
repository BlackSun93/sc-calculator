import { useState, useRef, useEffect } from "react";
import { sendMessage } from "./nadiaApi";
import { getSystemPrompt } from "./nadiaSystemPrompt";

// Colors
const WA = {
  headerBg: "#075E54",
  headerText: "#FFFFFF",
  chatBg: "#ECE5DD",
  userBubble: "#DCF8C6",
  botBubble: "#FFFFFF",
  inputBg: "#F0F0F0",
  sendBtn: "#25D366",
  textPrimary: "#111B21",
  textSecondary: "#667781",
  timestamp: "#667781",
  chipBg: "#E1F3FB",
  chipText: "#075E54",
  chipBorder: "#B2D8E8",
  emergencyBg: "#FEE2E2",
  emergencyBorder: "#EF4444",
  emergencyText: "#991B1B",
};

const EMERGENCY_KEYWORDS = [
  "anaphylaxis", "cardiac arrest", "severe reaction", "patient unconscious",
  "breathing difficulty", "dosing error", "صدمة حساسية", "حساسية شديدة",
  "توقف القلب", "تفاعل شديد", "فاقد الوعي", "صعوبة في التنفس", "خطأ في الجرعة",
];

function parseQuickReplies(text) {
  const match = text.match(/\[QUICK_REPLIES:\s*(.+?)\]/);
  if (!match) return { cleanText: text, replies: [] };
  const replies = match[1].split("|").map(r => r.trim()).filter(Boolean);
  const cleanText = text.replace(/\[QUICK_REPLIES:\s*(.+?)\]/, "").trim();
  return { cleanText, replies };
}

function generateSessionId() {
  return "s_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── Sub-components ─────────────────────────────────────────

function WelcomeScreen({ onStart }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "80vh", padding: 24,
      background: "linear-gradient(180deg, #075E54 0%, #128C7E 50%, #ECE5DD 100%)",
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: "50%", background: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 52, marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}>👩‍⚕️</div>
      <h1 style={{
        color: "#fff", fontSize: 28, fontWeight: 700, margin: "0 0 4px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>Nurse Nadia</h1>
      <p style={{
        color: "rgba(255,255,255,0.85)", fontSize: 14, margin: "0 0 24px",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>ممرضة نادية — Phesgo SC Guide</p>

      <div style={{
        background: "rgba(255,255,255,0.95)", borderRadius: 16, padding: 20,
        maxWidth: 360, width: "100%", marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      }}>
        <p style={{
          fontSize: 12, color: WA.textSecondary, margin: "0 0 10px",
          lineHeight: 1.5, fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>
          I'm your Phesgo SC administration guide. I can help with injection
          preparation, step-by-step technique, and common questions. I don't
          replace hands-on training or your medical team. For emergencies,
          contact your medical team immediately.
        </p>
        <p style={{
          fontSize: 12, color: WA.textSecondary, margin: 0,
          lineHeight: 1.5, direction: "rtl", textAlign: "right",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>
          أنا دليلك لحقن Phesgo SC. أقدر أساعدك في تحضير الحقنة وخطوات
          الإعطاء والأسئلة الشائعة. أنا مش بديل عن التدريب العملي أو الفريق
          الطبي. في حالات الطوارئ، تواصلي مع فريقك الطبي فوراً.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, width: "100%", maxWidth: 360 }}>
        <button onClick={() => onStart("ar")} style={{
          flex: 1, padding: "14px 12px", borderRadius: 12, border: "none",
          background: "#25D366", color: "#fff", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>ابدأ بالعربي</button>
        <button onClick={() => onStart("en")} style={{
          flex: 1, padding: "14px 12px", borderRadius: 12, border: "none",
          background: "#fff", color: "#075E54", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Segoe UI', system-ui, sans-serif",
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}>Start in English</button>
      </div>
    </div>
  );
}

const SAFETY_GUARDRAILS = {
  en: {
    header: "AI Safety & Guardrails",
    subtitle: "How Nurse Nadia protects against incorrect medical information",
    sections: [
      {
        title: "Approved Sources Only",
        icon: "shield",
        color: "#0D7C66",
        bg: "#E8F5E9",
        points: [
          "Every response traces back to 5 pre-approved clinical sources only",
          "Phesgo Prescribing Information (PI), Genentech/Roche 2024",
          "FeDeriCa trial — Tan AR et al. Lancet Oncol. 2021",
          "PHranceSCa — O'Shaughnessy J et al. Eur J Cancer. 2021",
          "Shash E et al. Ann Oncol. 2025 (Egyptian time-motion study)",
          "Phesgo SC Administration Guide for HCPs",
        ],
        materials: [],
      },
      {
        title: "Strict Knowledge Boundary",
        icon: "boundary",
        color: "#1565C0",
        bg: "#E3F2FD",
        points: [
          "AI can ONLY discuss 14 pre-defined topics about Phesgo SC administration",
          "Any question outside scope triggers automatic escalation to medical team",
          "Will never attempt to answer questions beyond its approved content",
        ],
        materials: [],
      },
      {
        title: "Blocked Actions",
        icon: "block",
        color: "#C62828",
        bg: "#FFEBEE",
        points: [
          "Never recommends whether to treat a patient",
          "Never suggests patient selection criteria",
          "Never modifies or suggests dosing changes",
          "Never discusses off-label use or drug interactions",
          "Never discusses competitor products",
          "Never provides pregnancy/lactation or pediatric guidance",
          "Never invents or hallucinates clinical information",
        ],
        materials: [],
      },
      {
        title: "Emergency Escalation",
        icon: "emergency",
        color: "#E65100",
        bg: "#FFF3E0",
        points: [
          "Detects emergency keywords in both Arabic and English",
          "Triggers: anaphylaxis, cardiac arrest, severe reaction, breathing difficulty, dosing error",
          "Immediately shows emergency protocol — never provides clinical emergency guidance",
          "Visual warning banner persists until session ends",
        ],
        materials: [],
      },
      {
        title: "AI Model Controls",
        icon: "settings",
        color: "#6A1B9A",
        bg: "#F3E5F5",
        points: [
          "Temperature set to 0.3 — minimizes creative/random responses",
          "System prompt with 200+ lines of clinical guardrails",
          "Max 1000 tokens per response — prevents verbose hallucination",
          "Context window limited to last 20 messages for relevance",
        ],
        materials: [],
      },
      {
        title: "Transparency & Audit",
        icon: "audit",
        color: "#37474F",
        bg: "#ECEFF1",
        points: [
          "All conversations logged to localStorage with anonymous session IDs",
          "Disclaimer shown on welcome screen and at top of every chat session",
          "Clearly states it does not replace hands-on training or medical team",
          "Content version number enables traceability when PI is updated",
        ],
        materials: [],
      },
    ],
  },
};

const ICON_MAP = {
  shield: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  boundary: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  block: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>,
  emergency: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  settings: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  audit: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
};

const MAT_ICONS = { video: "▶️", article: "📄", infographic: "🖼️" };

function QuickRefPanel({ lang, onClose }) {
  const isAr = lang === "ar";
  const data = SAFETY_GUARDRAILS.en;
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 60, display: "flex", flexDirection: "column",
      background: "#F4F6F8",
    }}>
      <div style={{
        display: "flex", alignItems: "center", padding: "10px 12px",
        background: WA.headerBg, color: "#fff", flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#fff",
          fontSize: 22, cursor: "pointer", marginRight: 8, padding: "2px 6px",
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 15, fontWeight: 700,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>{data.header}</div>
          <div style={{
            fontSize: 10, opacity: 0.8,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>{data.subtitle}</div>
        </div>
      </div>
      <div style={{
        flex: 1, overflowY: "auto", padding: "12px 12px 24px",
      }}>
        {data.sections.map((sec, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 14, padding: 0,
            marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}>
            {/* Section header with icon */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", background: sec.bg,
              borderBottom: `2px solid ${sec.color}20`,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "#fff", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0,
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}>{ICON_MAP[sec.icon](sec.color)}</div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: sec.color,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}>{sec.title}</div>
            </div>
            {/* Points */}
            <div style={{ padding: "10px 14px" }}>
              {sec.points.map((p, j) => (
                <div key={j} style={{
                  display: "flex", alignItems: "flex-start", gap: 8,
                  marginBottom: j < sec.points.length - 1 ? 6 : 0,
                }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: sec.color, marginTop: 6, flexShrink: 0,
                    opacity: 0.6,
                  }} />
                  <div style={{
                    fontSize: 12.5, color: WA.textPrimary, lineHeight: 1.55,
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}>{p}</div>
                </div>
              ))}
            </div>
            {/* Supplementary materials */}
            {sec.materials.length > 0 && (
              <div style={{
                padding: "8px 14px 12px",
                borderTop: "1px solid #E2E6EC",
                display: "flex", flexWrap: "wrap", gap: 6,
              }}>
                {sec.materials.map((m, k) => (
                  <a key={k} href={m.url} target="_blank" rel="noopener noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "5px 10px", borderRadius: 16,
                    background: m.type === "video" ? "#FFEBEE" : m.type === "article" ? "#E3F2FD" : "#F3E5F5",
                    color: m.type === "video" ? "#C62828" : m.type === "article" ? "#1565C0" : "#7B1FA2",
                    fontSize: 11, fontWeight: 600, textDecoration: "none",
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                  }}>{MAT_ICONS[m.type]} {m.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatHeader({ lang, onToggleLang, onOpenRef }) {
  const isAr = lang === "ar";
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      display: "flex", alignItems: "center", padding: "10px 12px",
      background: WA.headerBg, color: WA.headerText,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginRight: 10, flexShrink: 0,
      }}>👩‍⚕️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 700,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>Nurse Nadia</div>
        <div style={{
          fontSize: 11, opacity: 0.8,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>Phesgo SC Guide</div>
      </div>
      <button onClick={onOpenRef} style={{
        padding: "6px 12px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.15)", color: "#fff",
        fontSize: 11, fontWeight: 600, cursor: "pointer",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        marginRight: 6,
      }}>{isAr ? "الحماية" : "Safety"}</button>
      <button onClick={onToggleLang} style={{
        padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.3)",
        background: "rgba(255,255,255,0.1)", color: "#fff",
        fontSize: 12, fontWeight: 600, cursor: "pointer",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>{isAr ? "EN" : "عربي"}</button>
    </div>
  );
}

function ChatBubble({ message, isUser, lang }) {
  const isAr = lang === "ar";
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      padding: "2px 12px",
    }}>
      <div style={{
        maxWidth: "82%", padding: "8px 12px", borderRadius: 10,
        background: isUser ? WA.userBubble : WA.botBubble,
        borderTopRightRadius: isUser ? 2 : 10,
        borderTopLeftRadius: isUser ? 10 : 2,
        boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
        direction: isAr ? "rtl" : "ltr",
        textAlign: isAr ? "right" : "left",
      }}>
        <p style={{
          margin: 0, fontSize: 14, lineHeight: 1.55,
          color: WA.textPrimary, whiteSpace: "pre-wrap", wordBreak: "break-word",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>{message.text}</p>
        <div style={{
          fontSize: 10, color: WA.timestamp, marginTop: 4,
          textAlign: isUser ? "right" : "left", direction: "ltr",
        }}>{time}</div>
      </div>
    </div>
  );
}

function QuickReplyChips({ replies, onTap, lang }) {
  if (!replies.length) return null;
  const isAr = lang === "ar";
  return (
    <div style={{
      display: "flex", gap: 8, padding: "8px 12px",
      overflowX: "auto", direction: isAr ? "rtl" : "ltr",
    }}>
      {replies.map((r, i) => (
        <button key={i} onClick={() => onTap(r)} style={{
          padding: "8px 16px", borderRadius: 20,
          border: `1px solid ${WA.chipBorder}`,
          background: WA.chipBg, color: WA.chipText,
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          whiteSpace: "nowrap", flexShrink: 0,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>{r}</button>
      ))}
    </div>
  );
}

function TypingIndicator() {
  return (
    <>
      <style>{`
        @keyframes nadiaBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>
      <div style={{
        display: "flex", justifyContent: "flex-start", padding: "2px 12px",
      }}>
        <div style={{
          background: WA.botBubble, borderRadius: 10,
          borderTopLeftRadius: 2, padding: "12px 16px",
          display: "flex", gap: 5, alignItems: "center",
          boxShadow: "0 1px 1px rgba(0,0,0,0.06)",
        }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#90A4AE",
              animation: `nadiaBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
            }} />
          ))}
        </div>
      </div>
    </>
  );
}

function EmergencyBanner({ lang }) {
  const isAr = lang === "ar";
  return (
    <div style={{
      margin: "8px 12px", padding: "10px 14px", borderRadius: 10,
      background: WA.emergencyBg, border: `1px solid ${WA.emergencyBorder}`,
      direction: isAr ? "rtl" : "ltr",
    }}>
      <p style={{
        margin: 0, fontSize: 13, fontWeight: 700, color: WA.emergencyText,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        {isAr
          ? "⚠️ لو في حالة طوارئ فعلية، اتبعي بروتوكول القسم فوراً واتصلي بالطبيب المناوب."
          : "⚠️ If this is an actual emergency, follow your unit's protocol immediately and contact the on-call physician."}
      </p>
    </div>
  );
}

function ChatInput({ value, onChange, onSend, lang, disabled }) {
  const isAr = lang === "ar";
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 100) + "px";
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 8,
      padding: "8px 12px", background: WA.inputBg,
      borderTop: "1px solid #ddd",
    }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={isAr ? "اكتبي رسالتك..." : "Type your message..."}
        rows={1}
        style={{
          flex: 1, resize: "none", border: "none", outline: "none",
          borderRadius: 20, padding: "10px 16px",
          fontSize: 14, background: "#fff",
          direction: isAr ? "rtl" : "ltr",
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          maxHeight: 100, lineHeight: 1.4,
        }}
      />
      <button onClick={onSend} disabled={disabled || !value.trim()} style={{
        width: 42, height: 42, borderRadius: "50%", border: "none",
        background: disabled || !value.trim() ? "#A8D5BA" : WA.sendBtn,
        color: "#fff", fontSize: 20, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "background 0.2s",
      }}>➤</button>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────

export default function NurseNadia() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [sessionId] = useState(generateSessionId);
  const [quickReplies, setQuickReplies] = useState([]);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, quickReplies]);

  // Log to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(`nadia_${sessionId}`, JSON.stringify({
          sessionId, lang, messages, updatedAt: Date.now(),
        }));
      } catch { /* storage full — ignore */ }
    }
  }, [messages, sessionId, lang]);

  const isEmergency = (text) =>
    EMERGENCY_KEYWORDS.some(kw => text.toLowerCase().includes(kw.toLowerCase()));

  async function handleSend(text) {
    const content = (text || input).trim();
    if (!content || isLoading) return;
    setInput("");
    setQuickReplies([]);

    const userMsg = { role: "user", text: content, content, timestamp: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);

    if (isEmergency(content)) setShowEmergency(true);

    setIsLoading(true);
    try {
      // Send last 20 messages max
      const apiMessages = newMessages.slice(-20).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content || m.text,
      }));

      const systemPrompt = getSystemPrompt(lang);
      const rawReply = await sendMessage(apiMessages, systemPrompt);
      const { cleanText, replies } = parseQuickReplies(rawReply);

      const botMsg = {
        role: "assistant", text: cleanText, content: rawReply, timestamp: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
      setQuickReplies(replies);
    } catch (err) {
      console.error("Nadia API error:", err);
      const errorText = lang === "ar"
        ? "معلش، حصل مشكلة تقنية. جربي تاني كمان شوية."
        : "Sorry, something went wrong. Please try again in a moment.";
      const errorMsg = {
        role: "assistant",
        text: errorText,
        content: errorText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
      setQuickReplies([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleStart(selectedLang) {
    setLang(selectedLang);
    setShowWelcome(false);
    // Send initial greeting by triggering the bot
    const initMsg = { role: "user", text: selectedLang === "ar" ? "ابدأ" : "Start", content: selectedLang === "ar" ? "ابدأ" : "Start", timestamp: Date.now() };
    setMessages([initMsg]);
    setIsLoading(true);

    const systemPrompt = getSystemPrompt(selectedLang);
    sendMessage([{ role: "user", content: initMsg.content }], systemPrompt)
      .then(rawReply => {
        const { cleanText, replies } = parseQuickReplies(rawReply);
        setMessages(prev => [...prev, {
          role: "assistant", text: cleanText, content: rawReply, timestamp: Date.now(),
        }]);
        setQuickReplies(replies);
      })
      .catch(() => {
        const fallbackText = selectedLang === "ar"
          ? "أهلاً! أنا نادية، ممرضة أورام زيك بالظبط 😊 أنا هنا أساعدك تحسي بثقة في إعطاء Phesgo SC. إيه اللي تحبي نبدأ بيه؟"
          : "Hi! I'm Nadia, an oncology nurse just like you 😊 I'm here to help you feel confident giving Phesgo SC. What would you like to start with?";
        setMessages(prev => [...prev, {
          role: "assistant", text: fallbackText, content: fallbackText, timestamp: Date.now(),
        }]);
        setQuickReplies(selectedLang === "ar"
          ? ["خطوات الحقن", "تحضير الجرعة", "أسئلة شائعة", "تدريب عملي"]
          : ["Injection Steps", "Dose Preparation", "Common Questions", "Practice Mode"]);
      })
      .finally(() => setIsLoading(false));
  }

  function toggleLang() {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    const langText = newLang === "ar"
      ? "تم التحويل للعربي. أنا نادية، كملي اسألي أي حاجة 😊"
      : "Switched to English. I'm Nadia, feel free to ask anything 😊";
    const sysMsg = {
      role: "assistant",
      text: langText, content: langText, timestamp: Date.now(),
    };
    setMessages(prev => [...prev, sysMsg]);
    setQuickReplies(newLang === "ar"
      ? ["خطوات الحقن", "أسئلة شائعة", "تدريب عملي"]
      : ["Injection Steps", "Common Questions", "Practice Mode"]);
  }

  if (showWelcome) return <WelcomeScreen onStart={handleStart} />;

  const isAr = lang === "ar";

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 49px)", background: WA.chatBg,
    }}>
      <ChatHeader lang={lang} onToggleLang={toggleLang} onOpenRef={() => setShowRef(true)} />

      {showRef && <QuickRefPanel lang={lang} onClose={() => setShowRef(false)} />}

      {showEmergency && <EmergencyBanner lang={lang} />}

      <div ref={scrollRef} style={{
        flex: 1, overflowY: "auto", paddingTop: 8, paddingBottom: 8,
      }}>
        {/* Disclaimer card */}
        <div style={{
          margin: "8px 12px 12px", padding: "10px 14px", borderRadius: 10,
          background: "rgba(255,255,255,0.85)", textAlign: "center",
        }}>
          <p style={{
            margin: 0, fontSize: 11, color: WA.textSecondary, lineHeight: 1.5,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>
            {isAr
              ? "أنا مش بديل عن التدريب العملي أو الفريق الطبي. في حالات الطوارئ، تواصلي مع فريقك الطبي فوراً."
              : "I don't replace hands-on training or your medical team. For emergencies, contact your medical team immediately."}
          </p>
        </div>

        {messages.map((msg, i) => (
          <ChatBubble key={i} message={msg} isUser={msg.role === "user"} lang={lang} />
        ))}

        {isLoading && <TypingIndicator />}

        <QuickReplyChips replies={quickReplies} onTap={handleSend} lang={lang} />
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={() => handleSend()}
        lang={lang}
        disabled={isLoading}
      />
    </div>
  );
}
