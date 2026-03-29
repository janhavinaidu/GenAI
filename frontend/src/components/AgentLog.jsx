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
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    {log}
                </div>
            ))}
            {logs.length === 0 && (
                <div style={{ color: "#2D2D3D" }}>Waiting for agent activity...</div>
            )}
        </div>
    );
}