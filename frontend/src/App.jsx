import { useState, useEffect } from "react";
import axios from "axios";
import { Zap, RefreshCw, Search, Activity, TrendingUp, TrendingDown, BarChart2, Brain } from "lucide-react";
import CandlestickChart from "./components/CandlestickChart";
import PatternCard from "./components/PatternCard";
import AgentLog from "./components/AgentLog";
import AlertFeed from "./components/AlertFeed";
import StatsBar from "./components/StatsBar";
import HowItWorks from "./components/HowItWorks";

const API_BASE = "http://localhost:8000";

const QUICK_STOCKS = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "WIPRO"];

export default function App() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [timeframe, setTimeframe] = useState("1M");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/alerts`);
      setAlerts(res.data.alerts || []);
    } catch (e) {
      console.log("Alerts fetch failed", e);
    }
  };

  const handleSearch = async (symbol) => {
    const searchTicker = symbol || ticker;
    if (!searchTicker) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await axios.post(`${API_BASE}/api/analyze`, {
        ticker: searchTicker.toUpperCase(),
      });
      setData(res.data);
    } catch (e) {
      setError("Failed to analyze stock. Please try again.");
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
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">
            <Zap size={18} />
          </div>
          <div className="logo-text">
            <h1>PatternIQ</h1>
            <p>AI Chart Intelligence</p>
          </div>
        </div>
        <div className="nav-right">
          <div className="live-badge">
            <div className="pulse-dot" />
            NSE Live
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <h2>Discover Hidden Patterns<br />Before the Market Does</h2>
        <p>
          Multi-agent AI scans NSE stocks in real-time, detects chart patterns,
          and gives you back-tested success rates — in plain English.
        </p>
        <div className="search-container">
          <input
            className="search-input"
            placeholder="Search NSE stock... e.g. RELIANCE, TCS, INFY"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={() => handleSearch()}>
            <Search size={16} />
          </button>
        </div>
        <div className="chips">
          {QUICK_STOCKS.map((s) => (
            <div
              key={s}
              className="chip"
              onClick={() => {
                setTicker(s);
                handleSearch(s);
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar />

      {/* Loading */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner" />
          <p style={{ color: "#64748B", fontSize: "14px" }}>
            Running AI agents on {ticker}...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ textAlign: "center", color: "#EF4444", padding: "20px" }}>
          {error}
        </div>
      )}

      {/* Dashboard */}
      {data && !loading && (
        <div className="dashboard">
          {/* Left: Chart */}
          <div className="chart-section">
            <div className="chart-header">
              <div>
                <div className="stock-name">
                  {data.stock_info?.name || data.ticker}
                </div>
                <div className="stock-price">
                  ₹{data.stock_info?.current_price?.toFixed(2)}{" "}
                  <span
                    className={
                      data.stock_info?.change_percent >= 0
                        ? "change-positive"
                        : "change-negative"
                    }
                  >
                    {data.stock_info?.change_percent >= 0 ? "+" : ""}
                    {data.stock_info?.change_percent?.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="timeframe-btns">
                {["1D", "1W", "1M", "3M", "6M", "1Y"].map((tf) => (
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
            <CandlestickChart candles={data.candles} />

            {/* Support / Resistance */}
            {data.support_resistance && (
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginTop: "16px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    background: "#0F2A1A",
                    border: "1px solid #10B981",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    color: "#10B981",
                  }}
                >
                  Support: ₹{data.support_resistance.support}
                </div>
                <div
                  style={{
                    background: "#2A0F0F",
                    border: "1px solid #EF4444",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    color: "#EF4444",
                  }}
                >
                  Resistance: ₹{data.support_resistance.resistance}
                </div>
                <div
                  style={{
                    background: "#1A1A2A",
                    border: "1px solid #3B82F6",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    color: "#3B82F6",
                  }}
                >
                  Risk/Reward: {data.support_resistance.risk_reward}x
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="right-column">
            {/* Patterns */}
            <div className="card">
              <div className="card-title">
                <TrendingUp size={14} /> Detected Patterns
              </div>
              {data.backtest_results?.map((r, i) => (
                <PatternCard key={i} result={r} />
              ))}
            </div>

            {/* Explanation */}
            <div className="card">
              <div className="card-title">
                <Brain size={14} /> AI Explanation
              </div>
              <p className="explanation-text">{data.explanation}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span className={`action-badge ${getActionClass(data.action)}`}>
                  {data.action}
                </span>
                <span
                  className={`confidence-badge confidence-${data.confidence?.toLowerCase()}`}
                >
                  {data.confidence} Confidence
                </span>
              </div>
            </div>

            {/* Agent Log */}
            <div className="card">
              <div className="card-title">
                <Activity size={14} /> Live Agent Trail
                <div className="pulse-dot" />
              </div>
              <AgentLog logs={data.logs || []} />
            </div>

            {/* Alert Feed */}
            <div className="card">
              <div className="card-title">
                <BarChart2 size={14} /> Signals Across NSE
                <RefreshCw
                  size={12}
                  style={{ cursor: "pointer", marginLeft: "auto" }}
                  onClick={fetchAlerts}
                />
              </div>
              <AlertFeed alerts={alerts} />
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <HowItWorks />

      {/* Footer */}
      <div className="footer">
        Built for ET Gen AI Hackathon 2025 · PatternIQ
      </div>
    </div>
  );
}