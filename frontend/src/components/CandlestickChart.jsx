import { ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from "recharts";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const d = payload[0]?.payload;
        return (
            <div style={{
                background: "#12121A",
                border: "1px solid #1E1E2E",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "12px",
                color: "#94A3B8"
            }}>
                <div style={{ color: "#fff", marginBottom: "4px", fontWeight: 600 }}>{d.date}</div>
                <div>Open: <span style={{ color: "#fff" }}>₹{d.open?.toFixed(2)}</span></div>
                <div>High: <span style={{ color: "#10B981" }}>₹{d.high?.toFixed(2)}</span></div>
                <div>Low: <span style={{ color: "#EF4444" }}>₹{d.low?.toFixed(2)}</span></div>
                <div>Close: <span style={{ color: "#3B82F6" }}>₹{d.close?.toFixed(2)}</span></div>
            </div>
        );
    }
    return null;
};

export default function CandlestickChart({ candles }) {
    if (!candles || candles.length === 0) {
        return (
            <div style={{
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748B"
            }}>
                No chart data available
            </div>
        );
    }

    const data = candles.slice(-60).map((c) => ({
        date: c.Date ? c.Date.slice(0, 10) : "",
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
        volume: c.volume,
        isUp: c.close >= c.open,
        bodyHigh: Math.max(c.open, c.close),
        bodyLow: Math.min(c.open, c.close),
        color: c.close >= c.open ? "#10B981" : "#EF4444",
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis
                    dataKey="date"
                    tick={{ fill: "#64748B", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(data.length / 6)}
                    tickFormatter={(v) => v.slice(5)}
                />
                <YAxis
                    tick={{ fill: "#64748B", fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    domain={["auto", "auto"]}
                    tickFormatter={(v) => `₹${v.toFixed(0)}`}
                    width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bodyHigh" fill="transparent" />
                <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#3B82F6"
                    dot={false}
                    strokeWidth={2}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}