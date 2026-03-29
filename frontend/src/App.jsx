import { useState, useEffect } from "react";
import axios from "axios";
import { Zap, RefreshCw, Search, Activity, BarChart2, Brain, Play, Radar } from "lucide-react";
import CandlestickChart from "./components/CandlestickChart";
import PatternCard from "./components/PatternCard";
import AgentLog from "./components/AgentLog";
import AlertFeed from "./components/AlertFeed";
import StatsBar from "./components/StatsBar";
import HowItWorks from "./components/HowItWorks";
import MarketGPT from "./components/MarketGPT";
import OpportunityRadar from "./components/OpportunityRadar";
import CinemaMode from "./components/CinemaMode";

const API_BASE = "http://localhost:8000";
const QUICK_STOCKS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "WIPRO"];

export default function App() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [error, setError] = useState("");
  const [cinemaOpen, setCinemaOpen] = useState(false);
  const [currentTicker, setCurrentTicker] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Re-fetch when timeframe changes (only if we have a stock loaded)
  useEffect(() => {
    if (currentTicker) {
      handleSearch(currentTicker, timeframe);
    }
  }, [timeframe]);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/alerts`);
      setAlerts(res.data.alerts || []);
    } catch (e) {
      console.log("Alerts fetch failed", e);
    }
  };

  const handleSearch = async (symbol, tf) => {
    const searchTicker = symbol || ticker;
    if (!searchTicker) return;
    setLoading(true);
    setError("");
    if (!symbol) setData(null); // only clear on new search, not timeframe change
    const usedTimeframe = tf || timeframe;

    try {
      const res = await axios.post(`${API_BASE}/api/analyze`, {
        ticker: searchTicker.toUpperCase(),
        timeframe: usedTimeframe,
      });
      setData(res.data);
      setCurrentTicker(searchTicker.toUpperCase());
    } catch (e) {
      setError("Failed to analyse. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getActionClass = (action) => {
    if (!action) return "action-wait";
    const a = action.toLowerCase();
    if (a.includes("buy")) return "action-buy";
    if (a.includes("sell")) return "action-sell";
    return "action-wait";
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon"><Zap size={20} fill="white" /></div>
          <div className="logo-text">
            <h1>PatternIQ</h1>
            <p>Next-Gen Investment Intelligence</p>
          </div>
        </div>
        <div className="nav-right">
          <div className="live-badge live-pulse">
            <div className="pulse-dot" />
            NSE Real-Time
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <h2>Turn Market Data into<br />Actionable Alpha</h2>
        <p>
          Multi-agent AI monitoring corporate filings, insider trades,
          and chart patterns — explained in plain English.
        </p>
        <div className="search-container glass">
          <input
            className="search-input"
            placeholder="Search NSE stock... e.g. RELIANCE, TCS"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            <Search size={20} />
          </button>
        </div>
        <div className="chips">
          {QUICK_STOCKS.map((s) => (
            <div
              key={s}
              className="chip glass"
              onClick={() => { setTicker(s); handleSearch(s); }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      <StatsBar />

      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 600 }}>
            Orchestrating AI Agents for {currentTicker || ticker}...
          </p>
        </div>
      )}

      {error && (
        <div className="card glass" style={{ margin: "2rem auto", maxWidth: "600px", textAlign: "center", color: "var(--sell)" }}>
          {error}
        </div>
      )}

      {data && !loading && (
        <div className="dashboard">
          {/* Main Analysis Column */}
          <div className="main-content">
            {/* Chart Card */}
            <div className="card glass" style={{ marginBottom: "0" }}>
              <div className="chart-header">
                <div>
                  <div className="stock-name">{data.stock_info?.name || data.ticker}</div>
                  <div className="stock-price">
                    ₹{data.stock_info?.current_price?.toFixed(2)}{" "}
                    <span className={data.stock_info?.change_percent >= 0 ? "change-positive" : "change-negative"}>
                      {data.stock_info?.change_percent >= 0 ? "+" : ""}
                      {data.stock_info?.change_percent?.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="timeframe-btns">
                  {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
                    <button
                      key={tf}
                      className={`tf-btn ${timeframe === tf ? "active" : ""}`}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <CandlestickChart candles={data.candles} timeframe={timeframe} />

              <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                <div className="badge-bullish" style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.8rem" }}>
                  Support: ₹{data.support_resistance?.support}
                </div>
                <div className="badge-bearish" style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "0.8rem" }}>
                  Resistance: ₹{data.support_resistance?.resistance}
                </div>
              </div>
            </div>

            {/* AI Synthesis + Opportunity Radar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <OpportunityRadar signals={data.intel_signals} />
              <div className="card glass">
                <div className="card-title"><Brain size={14} /> AI Synthesis</div>
                <p className="explanation-text" style={{ fontSize: "0.95rem", color: "#e2e8f0", lineHeight: 1.7 }}>
                  {data.explanation || "Generating analysis..."}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.25rem" }}>
                  <span
                    style={{
                      padding: "6px 16px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      background: data.action?.toLowerCase().includes("buy") ? "rgba(16,185,129,0.15)" : data.action?.toLowerCase().includes("sell") ? "rgba(239,68,68,0.15)" : "rgba(148,163,184,0.1)",
                      color: data.action?.toLowerCase().includes("buy") ? "var(--buy)" : data.action?.toLowerCase().includes("sell") ? "var(--sell)" : "var(--text-muted)",
                      border: `1px solid ${data.action?.toLowerCase().includes("buy") ? "var(--buy)" : data.action?.toLowerCase().includes("sell") ? "var(--sell)" : "var(--surface-border)"}`,
                    }}
                  >
                    {data.action}
                  </span>
                  <span style={{ padding: "6px 16px", borderRadius: "8px", fontSize: "0.8rem", background: "rgba(56,189,248,0.1)", color: "var(--primary)", border: "1px solid var(--primary)" }}>
                    {data.confidence} Confidence
                  </span>
                </div>
              </div>
            </div>

            {/* NSE Scan + V-IQ side by side in MAIN CONTENT */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem", marginTop: "2rem" }}>
              <div className="card glass">
                <div className="card-title">
                  <BarChart2 size={14} /> NSE Opportunity Scan
                  <RefreshCw size={12} style={{ cursor: "pointer", marginLeft: "auto" }} onClick={fetchAlerts} />
                </div>
                <AlertFeed alerts={alerts} />
              </div>

              {/* V-IQ Card */}
              <div className="card glass viq-card">
                <div className="card-title"><Play size={14} /> V-IQ Market Wrap Engine</div>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  AI-generated 30-second cinematic market brief — a broadcast-ready synthesis of the day's pattern breakouts and corporate intelligence.
                </p>
                <button
                  className="viq-launch-btn"
                  onClick={() => setCinemaOpen(true)}
                  disabled={!data}
                >
                  <Play size={18} fill="currentColor" />
                  Launch V-IQ for {data?.ticker}
                </button>
                <div style={{ display: "flex", gap: "8px", marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                  {["🔊 AI Voice Synced", "📊 Pattern Intel", "🎬 Cinematic Script"].map(tag => (
                    <span key={tag} style={{
                      background: "rgba(56,189,248,0.08)",
                      border: "1px solid rgba(56,189,248,0.2)",
                      borderRadius: "100px",
                      padding: "4px 12px",
                      fontSize: "0.75rem",
                      color: "var(--primary)",
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Intelligence Sidebar */}
          <div className="right-column">
            <MarketGPT ticker={data.ticker} context={data} />

            <div className="card glass">
              <div className="card-title"><Radar size={14} /> Real-Time Patterns</div>
              {data.backtest_results?.length > 0
                ? data.backtest_results.slice(0, 4).map((r, i) => <PatternCard key={i} result={r} />)
                : <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Analysing patterns...</div>
              }
            </div>

            <div className="card glass">
              <div className="card-title"><Activity size={14} /> Agent Intelligence Trail</div>
              <AgentLog logs={data.logs || []} />
            </div>

          </div>
        </div>
      )}

      {cinemaOpen && <CinemaMode data={data} onClose={() => setCinemaOpen(false)} />}

      <HowItWorks />

      <div className="footer">
        Built with Precision for ET Gen AI Hackathon · PatternIQ Intelligence Layer
      </div>
    </div>
  );
}