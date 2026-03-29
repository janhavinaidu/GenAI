import { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

const QUICK_QUESTIONS = [
  "What's the best entry point?",
  "What's the stop loss?",
  "Is this a good time to buy?",
  "What does RSI indicate?",
  "Price target for this week?",
];

export default function MarketGPT({ ticker, context }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const sendMessage = async (message) => {
    if (!message || loading) return;

    const userMsg = { role: "user", content: message };
    setHistory((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/chat`, {
        ticker,
        message,
        history,
        context,
      });
      setHistory((prev) => [...prev, { role: "ai", content: res.data.response }]);
    } catch (e) {
      setHistory((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Could not reach Market GPT. Check the backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass chat-container" style={{ height: "auto", gap: 0 }}>
      <div className="card-title">
        <Bot size={14} /> Market GPT Intelligence
      </div>

      {/* Chat messages */}
      <div
        className="chat-messages"
        ref={scrollRef}
        style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "0.75rem" }}
      >
        {history.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              padding: "1rem 0",
            }}
          >
            Ask PatternIQ anything about <strong style={{ color: "var(--primary)" }}>{ticker}</strong>
          </div>
        )}
        {history.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="chat-bubble ai" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
            Thinking...
          </div>
        )}
      </div>

      {/* Quick suggestion chips — shown when no history */}
      {history.length === 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "0.75rem",
          }}
        >
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                background: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: "100px",
                padding: "5px 12px",
                color: "var(--primary)",
                fontSize: "0.72rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.background = "rgba(56, 189, 248, 0.2)")}
              onMouseOut={(e) => (e.target.style.background = "rgba(56, 189, 248, 0.08)")}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <input
          className="chat-input"
          placeholder="Ask about entry, stop loss, target..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
        />
        <button
          onClick={() => sendMessage(input)}
          style={{
            background: "var(--primary)",
            border: "none",
            borderRadius: "10px",
            padding: "0 14px",
            cursor: "pointer",
            color: "#020617",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
