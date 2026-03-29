export default function PatternCard({ result }) {
    const rate = result.success_rate || 0;
    const barColor = rate >= 65 ? "#10B981" : rate >= 50 ? "#F59E0B" : "#EF4444";

    return (
        <div className="pattern-item">
            <div className="pattern-name">
                <span>{result.pattern}</span>
                <span className={`badge badge-${result.type}`}>
                    {result.type}
                </span>
            </div>
            <div className="success-rate">
                Historical Success Rate: <strong style={{ color: barColor }}>{rate}%</strong>
                {" "}({result.successful_signals}/{result.total_signals} signals)
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${rate}%`, background: barColor }}
                />
            </div>
            {result.description && (
                <div style={{ fontSize: "11px", color: "#64748B", marginTop: "6px" }}>
                    {result.description}
                </div>
            )}
            <div style={{ fontSize: "11px", color: "#2D2D3D", marginTop: "4px" }}>
                Avg return: {result.avg_return > 0 ? "+" : ""}{result.avg_return}%
            </div>
        </div>
    );
}