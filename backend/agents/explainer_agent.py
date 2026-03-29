from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
import os
import time

load_dotenv()

def run_explainer(ticker: str, patterns: list, backtest_results: list, stock_info: dict, intel_signals: list = []) -> dict:
    logs = []

    def log(msg):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] Explainer Agent → {msg}"
        logs.append(entry)
        print(entry)

    try:
        log("Connecting to Groq LLM...")
        llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.3,
            max_tokens=600,
        )

        pattern_summary = "\n".join([
            f"- {r['pattern']} ({r['type']}): {r['success_rate']}% historical success rate over {r['total_signals']} signals, avg return {r['avg_return']}%"
            for r in backtest_results
        ])

        intel_summary = "\n".join([
            f"- [{s['label']}] {s['description']} (Source: {s['source']})"
            for s in intel_signals
        ])

        log("Generating plain-English explanation for retail investor...")

        messages = [
            SystemMessage(content="""You are an expert Indian stock market analyst. 
            Explain chart patterns and corporate intelligence signals to retail investors in simple, actionable language.
            Synthesize both technical patterns and fundamental 'Opportunity Radar' signals.
            Keep it under 120 words. Be direct. Mention specific numbers.
            End with one clear action: Buy / Sell / Wait and Watch."""),
            HumanMessage(content=f"""
            Stock: {ticker} ({stock_info.get('name', ticker)})
            Current Price: ₹{stock_info.get('current_price', 'N/A')}
            Change: {stock_info.get('change_percent', 0)}%
            
            Detected Technical Patterns:
            {pattern_summary}
            
            Opportunity Radar (Corporate Intelligence):
            {intel_summary if intel_summary else 'No major news/filings detected.'}
            
            Explain what this means for a retail investor and what action to take.
            """)
        ]

        response = llm.invoke(messages)
        explanation = response.content
        log("Explanation generated successfully")

        dominant = backtest_results[0] if backtest_results else {}
        confidence = "High" if dominant.get('success_rate', 0) > 70 else \
                     "Medium" if dominant.get('success_rate', 0) > 55 else "Low"

        return {
            "success": True,
            "ticker": ticker,
            "explanation": explanation,
            "confidence": confidence,
            "action": _extract_action(explanation),
            "logs": logs
        }

    except Exception as e:
        log(f"Error: {str(e)}")
        return {
            "success": False,
            "ticker": ticker,
            "explanation": "Unable to generate explanation at this time.",
            "confidence": "Low",
            "action": "Wait and Watch",
            "logs": logs
        }


def _extract_action(text: str) -> str:
    text_lower = text.lower()
    if "strong buy" in text_lower:
        return "Strong Buy"
    elif "buy" in text_lower:
        return "Buy"
    elif "strong sell" in text_lower or "sell" in text_lower:
        return "Sell"
    else:
        return "Wait and Watch"