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

const QUICK_REF = {
  en: [
    {
      title: "Dosing",
      icon: "💉",
      points: ["Loading: pertuzumab 1200mg + trastuzumab 600mg (~8 min)", "Maintenance: 600/600mg (~5 min)", "Every 3 weeks — FIXED dose, no weight calculation"],
      materials: [
        { type: "video", label: "SC Injection Technique", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { type: "article", label: "Phesgo Prescribing Information", url: "https://www.gene.com/download/pdf/phesgo_prescribing.pdf" },
      ],
    },
    {
      title: "Storage",
      icon: "🧊",
      points: ["2-8°C refrigerated, do not freeze", "Protect from light", "Once out of fridge: use within 24 hours"],
      materials: [
        { type: "infographic", label: "Storage Quick Card", url: "https://www.phesgo.com/hcp/storage-handling" },
      ],
    },
    {
      title: "Injection Sites",
      icon: "🎯",
      points: ["Thigh preferred", "Alternate left and right", "Avoid scars, bruises, or moles", "18G transfer needle, 25G injection needle"],
      materials: [
        { type: "video", label: "Injection Site Selection Guide", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { type: "infographic", label: "Site Rotation Diagram", url: "https://www.phesgo.com/hcp/injection-sites" },
      ],
    },
    {
      title: "Observation Times",
      icon: "⏱️",
      points: ["30 min after first dose", "15 min after subsequent doses", "Monitor for injection site reactions"],
      materials: [
        { type: "article", label: "FeDeriCa Trial — Lancet Oncol.", url: "https://doi.org/10.1016/S1470-2045(20)30458-0" },
      ],
    },
    {
      title: "Key Evidence",
      icon: "📊",
      points: ["pCR 59.7% SC vs 59.5% IV (FeDeriCa)", "85% patients preferred SC (PHranceSCa)", "Chair time: 23 min SC vs 235 min IV (Shash 2025)"],
      materials: [
        { type: "article", label: "FeDeriCa Trial Results", url: "https://doi.org/10.1016/S1470-2045(20)30458-0" },
        { type: "article", label: "PHranceSCa Patient Preference", url: "https://doi.org/10.1016/j.ejca.2021.04.002" },
        { type: "article", label: "Egyptian Time-Motion Study", url: "https://doi.org/10.1093/annonc/mdac437.048" },
      ],
    },
    {
      title: "12 Admin Steps",
      icon: "📋",
      points: ["1. Verify prescription & patient ID", "2. Check vial integrity & expiry", "3. Room temp ~5 min", "4. Don't shake — swirl gently", "5. Withdraw full contents", "6. Select thigh site, alternate sides", "7. Clean with antiseptic", "8. Insert at 45° subcutaneously", "9. Inject slowly (8 min load / 5 min maint)", "10. Withdraw, gentle pressure, don't rub", "11. Observe (30/15 min)", "12. Document everything"],
      materials: [
        { type: "video", label: "Full Admin Walkthrough", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { type: "infographic", label: "Step-by-Step Poster", url: "https://www.phesgo.com/hcp/admin-guide" },
      ],
    },
  ],
  ar: [
    {
      title: "الجرعات",
      icon: "💉",
      points: ["Loading: pertuzumab 1200mg + trastuzumab 600mg (~8 دقايق)", "Maintenance: 600/600mg (~5 دقايق)", "كل 3 أسابيع — جرعة ثابتة، مش محتاجة حساب وزن"],
      materials: [
        { type: "video", label: "طريقة حقن SC", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { type: "article", label: "نشرة Phesgo الدوائية", url: "https://www.gene.com/download/pdf/phesgo_prescribing.pdf" },
      ],
    },
    {
      title: "التخزين",
      icon: "🧊",
      points: ["2-8 درجة مئوية في التلاجة، متتجمدش", "بعيد عن الضوء", "بعد ما تطلع من التلاجة: تُستخدم خلال 24 ساعة"],
      materials: [
        { type: "infographic", label: "كارت التخزين السريع", url: "https://www.phesgo.com/hcp/storage-handling" },
      ],
    },
    {
      title: "أماكن الحقن",
      icon: "🎯",
      points: ["الفخذ هو الأفضل", "بدّلي بين اليمين والشمال", "ابعدي عن الندبات والكدمات والشامات", "إبرة 18G للسحب، 25G للحقن"],
      materials: [
        { type: "video", label: "دليل اختيار مكان الحقن", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { type: "infographic", label: "رسم توضيحي لتبديل الأماكن", url: "https://www.phesgo.com/hcp/injection-sites" },
      ],
    },
    {
      title: "أوقات المراقبة",
      icon: "⏱️",
      points: ["30 دقيقة بعد أول جرعة", "15 دقيقة بعد الجرعات اللي بعدها", "راقبي أي تفاعلات في مكان الحقن"],
      materials: [
        { type: "article", label: "دراسة FeDeriCa — Lancet Oncol.", url: "https://doi.org/10.1016/S1470-2045(20)30458-0" },
      ],
    },
    {
      title: "الأدلة العلمية",
      icon: "📊",
      points: ["pCR 59.7% SC مقابل 59.5% IV (دراسة FeDeriCa)", "85% من المرضى فضّلوا SC (دراسة PHranceSCa)", "وقت الكرسي: 23 دقيقة SC مقابل 235 دقيقة IV (دراسة Shash 2025)"],
      materials: [
        { type: "article", label: "نتائج دراسة FeDeriCa", url: "https://doi.org/10.1016/S1470-2045(20)30458-0" },
        { type: "article", label: "دراسة تفضيل المرضى PHranceSCa", url: "https://doi.org/10.1016/j.ejca.2021.04.002" },
        { type: "article", label: "الدراسة المصرية للوقت", url: "https://doi.org/10.1093/annonc/mdac437.048" },
      ],
    },
    {
      title: "12 خطوة للإعطاء",
      icon: "📋",
      points: ["1. تأكدي من الوصفة وهوية المريض", "2. افحصي سلامة الزجاجة والصلاحية", "3. سيبيها ~5 دقايق بره التلاجة", "4. متهزيهاش — لفيها برفق", "5. اسحبي كل المحتوى", "6. اختاري الفخذ، بدّلي الجهات", "7. نظفي بالمطهر", "8. ادخلي الإبرة بزاوية 45° تحت الجلد", "9. احقني ببطء (8 دقايق loading / 5 دقايق maintenance)", "10. اسحبي الإبرة، اضغطي برفق، متفركيش", "11. راقبي (30/15 دقيقة)", "12. سجّلي كل حاجة"],
      materials: [
        { type: "video", label: "شرح كامل لخطوات الإعطاء", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
        { type: "infographic", label: "بوستر الخطوات", url: "https://www.phesgo.com/hcp/admin-guide" },
      ],
    },
  ],
};

const MAT_ICONS = { video: "▶️", article: "📄", infographic: "🖼️" };

function QuickRefPanel({ lang, onClose }) {
  const isAr = lang === "ar";
  const items = QUICK_REF[isAr ? "ar" : "en"];
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 60, display: "flex", flexDirection: "column",
      background: WA.chatBg,
    }}>
      <div style={{
        display: "flex", alignItems: "center", padding: "10px 12px",
        background: WA.headerBg, color: "#fff", flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#fff",
          fontSize: 22, cursor: "pointer", marginRight: 8, padding: "2px 6px",
        }}>←</button>
        <div style={{
          fontSize: 16, fontWeight: 700,
          fontFamily: "'Segoe UI', system-ui, sans-serif",
        }}>{isAr ? "مرجع سريع" : "Quick Reference"}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 24px" }}>
        {items.map((item, i) => (
          <div key={i} style={{
            background: "#fff", borderRadius: 12, padding: 14,
            marginBottom: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            direction: isAr ? "rtl" : "ltr",
          }}>
            <div style={{
              fontSize: 15, fontWeight: 700, marginBottom: 8,
              color: WA.textPrimary, fontFamily: "'Segoe UI', system-ui, sans-serif",
            }}>{item.icon} {item.title}</div>
            {item.points.map((p, j) => (
              <div key={j} style={{
                fontSize: 13, color: WA.textPrimary, lineHeight: 1.6,
                paddingLeft: isAr ? 0 : 8, paddingRight: isAr ? 8 : 0,
                fontFamily: "'Segoe UI', system-ui, sans-serif",
              }}>• {p}</div>
            ))}
            {item.materials.length > 0 && (
              <div style={{
                marginTop: 10, paddingTop: 8,
                borderTop: "1px solid #E2E6EC",
                display: "flex", flexWrap: "wrap", gap: 6,
              }}>
                {item.materials.map((m, k) => (
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
      }}>{isAr ? "مرجع" : "Quick Ref"}</button>
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
