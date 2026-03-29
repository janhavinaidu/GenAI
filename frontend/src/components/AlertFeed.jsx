export default function AlertFeed({ alerts }) {
    if (!alerts || alerts.length === 0) {
        return (
            <div style={{ color: "#2D2D3D", fontSize: "13px", textAlign: "center", padding: "16px" }}>
                No active signals — scanning NSE...
            </div>
        );
    }

    return (
        <div style={{ overflowX: "auto", width: "100%", paddingBottom: "10px" }}>
            <table className="alert-table">
            <thead>
                <tr>
                    <th>Stock</th>
                    <th>Pattern</th>
                    <th>Signal</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {alerts.map((a, i) => (
                    <tr key={i}>
                        <td>
                            <div style={{ fontWeight: 700, color: "#fff" }}>{a.ticker}</div>
                            <div style={{ fontSize: "0.7rem", color: a.change_pct >= 0 ? "var(--buy)" : "var(--sell)" }}>
                                ₹{a.price} ({a.change_pct >= 0 ? "+" : ""}{a.change_pct}%)
                            </div>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{a.pattern}</td>
                        <td>
                            <span className={`badge badge-${a.type}`}>{a.type}</span>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{a.time}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
}