import { useEffect, useState } from "react";

const STATS = [
    { label: "Stocks Monitored", value: 1847, suffix: "" },
    { label: "Patterns Detected Today", value: 234, suffix: "" },
    { label: "Avg Success Rate", value: 71.3, suffix: "%" },
    { label: "Agents Running", value: 4, suffix: "", pulse: true },
];

function useCountUp(target, duration = 1500) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(parseFloat(start.toFixed(1)));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [target]);
    return count;
}

function StatCard({ label, value, suffix, pulse }) {
    const count = useCountUp(value);
    return (
        <div className="stat-card">
            <div className="stat-value">
                {count}{suffix}
                {pulse && <span className="pulse-dot" style={{ display: "inline-block", marginLeft: "8px", verticalAlign: "middle" }} />}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
}

export default function StatsBar() {
    return (
        <div className="stats-bar">
            {STATS.map((s) => (
                <StatCard key={s.label} {...s} />
            ))}
        </div>
    );
}