import { useEffect, useRef } from "react";

export default function AgentLog({ logs }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="terminal" ref={ref}>
            {logs.map((log, i) => (
                <div
                    key={i}
                    className="terminal-line"
                    style={{ animationDelay: `${i * 0.05}s` }}
                >
                    <span style={{ color: "var(--primary)", marginRight: "8px" }}>›</span>
                    {log}
                </div>
            ))}
            {logs.length === 0 && (
                <div className="terminal-line" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
                    Waiting for neural agents to synchronize...
                </div>
            )}
        </div>
    );
}