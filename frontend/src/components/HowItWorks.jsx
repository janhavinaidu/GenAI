import { Search, BarChart2, Brain } from "lucide-react";

const STEPS = [
    {
        icon: <Search size={24} />,
        title: "Scanner Agent",
        desc: "Continuously monitors all NSE stocks for technical pattern formations using 9 different indicators in real-time."
    },
    {
        icon: <BarChart2 size={24} />,
        title: "Backtester Agent",
        desc: "Tests each detected pattern against 2 years of historical data to compute real success rates — not guesses."
    },
    {
        icon: <Brain size={24} />,
        title: "Explainer Agent",
        desc: "Translates complex signals into plain English using Groq LLM so any retail investor can act confidently."
    }
];

export default function HowItWorks() {
    return (
        <div className="how-it-works">
            <h3>How PatternIQ Works</h3>
            <div className="steps">
                {STEPS.map((s, i) => (
                    <div key={i} className="step-card">
                        <div className="step-icon">{s.icon}</div>
                        <h4>{s.title}</h4>
                        <p>{s.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}