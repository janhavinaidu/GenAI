from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
import os
from dotenv import load_dotenv

load_dotenv()

def chat_with_market_gpt(ticker: str, message: str, history: list, context: dict) -> str:
    """
    Interactive Market GPT — portfolio-aware, context-aware responses.
    """
    try:
        llm = ChatGroq(
            api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.5,
            max_tokens=500,
        )

        system_prompt = f"""You are PatternIQ Market GPT, a sharp Indian Stock Market AI assistant.
You are currently discussing: {ticker}

Current Analysis Context:
- AI Explanation: {context.get('explanation', 'No analysis available yet.')}
- Technical Action: {context.get('action', 'Wait and Watch')}
- Confidence: {context.get('confidence', 'Medium')}
- Support: ₹{context.get('support_resistance', {}).get('support', 'N/A')}
- Resistance: ₹{context.get('support_resistance', {}).get('resistance', 'N/A')}
- Current Price: ₹{context.get('stock_info', {}).get('current_price', 'N/A')}

Guidelines:
- Be concise, data-driven, and direct (under 100 words per reply).
- Reference NSE/BSE context and specific numbers.
- If asked about entry/exit/stop-loss/target, reference support/resistance above.
- End with one clear recommendation.
- Always add: *Not financial advice.*"""

        messages = [SystemMessage(content=system_prompt)]

        # Add conversation history (last 6 messages)
        for msg in history[-6:]:
            if msg.get('role') == 'user':
                messages.append(HumanMessage(content=msg['content']))
            elif msg.get('role') == 'ai':
                messages.append(AIMessage(content=msg['content']))

        # Add the current user message
        messages.append(HumanMessage(content=message))

        response = llm.invoke(messages)
        return response.content

    except Exception as e:
        return f"⚠️ Market GPT error: {str(e)}"
