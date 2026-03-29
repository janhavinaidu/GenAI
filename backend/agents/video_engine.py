import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv()

def generate_market_wrap(data: dict) -> dict:
    """
    Generate a V-IQ "Market Video" wrap-up script and scene data.
    """
    ticker = data.get("ticker", "The Market")
    action = data.get("action", "Wait and Watch")
    explanation = data.get("explanation", "")
    price = data.get("stock_info", {}).get("current_price", 0)
    change = data.get("stock_info", {}).get("change_percent", 0)
    
    try:
        llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=300,
        )

        messages = [
            SystemMessage(content="""You are the lead anchor of a premium financial broadcast (like Bloomberg or CNBC). 
            Generate a high-impact, cinematic 30-second market wrap script.
            
            RULES:
            - Exactly 3 sections, separated by newlines: [HOOK], [ANALYSIS], [ACTION]
            - Do NOT include labels like "Hook:" or "Section 1", just the spoken text.
            - Keep total length under 60 words. Short, punchy, dramatic sentences.
            - Use professional trading verbs: 'surge', 'breach', 'consolidate', 'bullish divergence', 'capitulation'.
            
            Example output structure:
            Reliance is testing critical resistance today on massive volume. 
            A bullish MACD crossover confirms the upside momentum, completely ignoring broader market weakness.
            Wait for a daily close above 2900 before deploying fresh capital.
            """),
            HumanMessage(content=f"""
                Stock: {ticker}
                Current Price: ₹{price} ({change}% change)
                AI Technical Call: {action}
                Supporting Data: {explanation}
            """)
        ]

        response = llm.invoke(messages)
        script = response.content

        # Split into segments for the Frontend to "play"
        lines = [line.strip() for line in script.split('\n') if line.strip()]
        
        scenes = [
            {"id": 1, "text": lines[0] if len(lines) > 0 else script[:50], "type": "intro"},
            {"id": 2, "text": lines[1] if len(lines) > 1 else explanation[:100], "type": "analysis"},
            {"id": 3, "text": lines[-1] if len(lines) > 2 else f"Recommendation: {action}", "type": "action"}
        ]

        return {
            "success": True,
            "ticker": ticker,
            "full_script": script,
            "scenes": scenes,
            "config": {
                "duration_per_scene": 10,
                "accent_color": "#10b981" if change >= 0 else "#ef4444"
            }
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "fallback_script": f"Moving on to {ticker}. Current price at ₹{price}. Action stands at {action}."
        }
