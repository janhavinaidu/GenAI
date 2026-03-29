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
                Detection Reliability: <strong>{rate}%</strong>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${rate}%`, background: barColor }}
                />
            </div>
            {result.description && (
                <div className="explanation-text" style={{ fontSize: "0.75rem", marginTop: "10px" }}>
                    {result.description}
                </div>
            )}
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "8px" }}>
                Signal Count: {result.successful_signals}/{result.total_signals} · Avg Return: {result.avg_return}%
            </div>
        </div>
    );
}