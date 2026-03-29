export default function AlertFeed({ alerts }) {
    if (!alerts || alerts.length === 0) {
        return (
            <div style={{ color: "#2D2D3D", fontSize: "13px", textAlign: "center", padding: "16px" }}>
                No active signals — scanning NSE...
            </div>
        );
    }

    return (
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
                        <td style={{ color: "#fff", fontWeight: 600 }}>
                            {a.ticker}
                            <div style={{ fontSize: "10px", color: a.change_pct >= 0 ? "#10B981" : "#EF4444" }}>
                                ₹{a.price} ({a.change_pct >= 0 ? "+" : ""}{a.change_pct}%)
                            </div>
                        </td>
                        <td style={{ fontSize: "11px" }}>{a.pattern}</td>
                        <td>
                            <span className={`badge badge-${a.type}`}>{a.type}</span>
                        </td>
                        <td style={{ fontSize: "11px" }}>{a.time}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}