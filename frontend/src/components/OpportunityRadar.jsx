import { AlertCircle, FileText, Zap, ShieldCheck, TrendingUp } from "lucide-react";

export default function OpportunityRadar({ signals }) {
  const getIcon = (type) => {
    switch (type) {
      case "filing": return <FileText size={14} />;
      case "deal": return <Zap size={14} className="text-yellow-400" />;
      case "insider": return <ShieldCheck size={14} className="text-green-400" />;
      case "regulation": return <ShieldCheck size={14} className="text-blue-400" />;
      default: return <TrendingUp size={14} />;
    }
  };

  const getRelevanceClass = (rel) => {
    if (rel === "critical") return "badge-bearish";
    if (rel === "high") return "badge-bullish";
    return "badge-neutral";
  };

  return (
    <div className="card glass">
      <div className="card-title">
        <AlertCircle size={14} /> Opportunity Radar (Market Signals)
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {!signals || signals.length === 0 ? (
          <div className="explanation-text" style={{ textAlign: "center", padding: "1rem" }}>
            No current intelligence signals detected.
          </div>
        ) : (
          signals.map((sig) => (
            <div key={sig.id} className="pattern-item glass" style={{ borderLeft: "4px solid var(--primary)" }}>
              <div className="pattern-name">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {getIcon(sig.type)}
                  {sig.label}
                </div>
                <span className={`badge ${getRelevanceClass(sig.relevance)}`}>
                  {sig.relevance}
                </span>
              </div>
              <p className="explanation-text" style={{ fontSize: "0.8rem", color: "#fff", marginBottom: "4px" }}>
                {sig.description}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                <span>Source: {sig.source}</span>
                <span>{sig.timestamp}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
