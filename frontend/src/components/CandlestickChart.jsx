import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const d = payload[0]?.payload;
    return (
      <div style={{
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "10px",
        padding: "12px 16px",
        fontSize: "12px",
        color: "#94a3b8",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
      }}>
        <div style={{ color: "#fff", marginBottom: "6px", fontWeight: 700 }}>{d.date}</div>
        <div>Open: <span style={{ color: "#fff" }}>₹{d.open?.toFixed(2)}</span></div>
        <div>High: <span style={{ color: "#10b981" }}>₹{d.high?.toFixed(2)}</span></div>
        <div>Low: <span style={{ color: "#ef4444" }}>₹{d.low?.toFixed(2)}</span></div>
        <div>Close: <span style={{ color: "#38bdf8", fontWeight: 700 }}>₹{d.close?.toFixed(2)}</span></div>
      </div>
    );
  }
  return null;
};

// Formats a date string or timestamp to a readable label
function formatDate(raw, timeframe) {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    if (isNaN(d)) return String(raw).slice(0, 10);
    if (timeframe === "1D") {
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    }
    if (timeframe === "1W") {
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) +
             " " + d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  } catch {
    return String(raw).slice(0, 10);
  }
}

export default function CandlestickChart({ candles, timeframe = "1M" }) {
  if (!candles || candles.length === 0) {
    return (
      <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
        No chart data available
      </div>
    );
  }

  // Determine the date key — yfinance returns "Datetime" for intraday, "Date" for daily
  const dateKey = candles[0]?.Datetime ? "Datetime" : (candles[0]?.Date ? "Date" : "index");

  const data = candles.map((c) => ({
    date: formatDate(c[dateKey] || c.index, timeframe),
    rawDate: c[dateKey] || c.index,
    open: Number(c.open) || 0,
    high: Number(c.high) || 0,
    low: Number(c.low) || 0,
    close: Number(c.close) || 0,
    volume: Number(c.volume) || 0,
    isUp: Number(c.close) >= Number(c.open),
    color: Number(c.close) >= Number(c.open) ? "#10b981" : "#ef4444",
  }));

  const interval = Math.max(1, Math.floor(data.length / 7));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(30,41,59,0.5)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={interval}
        />
        <YAxis
          tick={{ fill: "#64748b", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          domain={["auto", "auto"]}
          tickFormatter={(v) => `₹${v.toFixed(0)}`}
          width={65}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="close"
          stroke="#38bdf8"
          dot={false}
          strokeWidth={2}
          activeDot={{ r: 4, fill: "#38bdf8" }}
        />
        <Bar
          dataKey="high"
          fill="transparent"
          stroke="transparent"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}