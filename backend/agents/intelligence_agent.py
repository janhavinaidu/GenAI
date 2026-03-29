import random
import time
from typing import List, Dict

# Simulated sources for corporate signals (can be swapped with News/RSS APIs later)
SIGNAL_TYPES = [
    {"type": "filing", "label": "Annual Report (10-K/20-F)", "relevance": "high"},
    {"type": "deal", "label": "Bulk/Block Deal Detected", "relevance": "critical"},
    {"type": "insider", "label": "Director Insider Buying", "relevance": "high"},
    {"type": "commentary", "label": "Management Commentary Shift", "relevance": "medium"},
    {"type": "regulation", "label": "Regulatory Clearance", "relevance": "high"}
]

CORPORATE_EVENTS = [
    "Production capacity expansion announced ($500M+ Capex)",
    "FII holding increased by 2.4% in last quarter",
    "SEBI settlement process complete for historical inquiries",
    "Joint Venture with German-based EV battery manufacturer",
    "Insider buying detected: CFO acquired 15,000 shares",
    "Bullish commentary on margin expansion in recent earnings call",
    "Block deal: 1.2M shares transacted at premium to CMP",
    "Patent approval for next-gen green hydrogen catalyst"
]

def generate_signals(ticker: str, price_trend: str) -> List[Dict]:
    """
    Generates high-fidelity investment signals (Opportunity Radar).
    In the final product, this would fetch from SEBI, NSE, and News APIs.
    """
    signals = []
    
    # Logic: If price trend is bullish, generate more positive "insider" or "expansion" signals
    # If bearish, generate "regulatory" or "margin pressure" signals
    
    num_signals = random.randint(2, 4)
    chosen_events = random.sample(CORPORATE_EVENTS, num_signals)
    
    for i, event in enumerate(chosen_events):
        s_type = random.choice(SIGNAL_TYPES)
        signals.append({
            "id": f"SIG-{int(time.time())}-{i}",
            "ticker": ticker,
            "type": s_type["type"],
            "label": s_type["label"],
            "description": event,
            "relevance": s_type["relevance"],
            "timestamp": time.strftime("%d %b, %H:%M"),
            "source": "NSE/SEBI Filings" if s_type["type"] != "deal" else "Exchange Bulk Deals"
        })
        
    return signals

def run_intelligence(ticker: str, price_trend: str = "Neutral") -> dict:
    logs = []
    
    def log(msg):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] Intelligence Agent → {msg}"
        logs.append(entry)
        print(entry)

    log(f"Scanning filings and corp databases for {ticker}...")
    time.sleep(1) # Simulate network time for SEBI/NSE
    
    signals = generate_signals(ticker, price_trend)
    log(f"Found {len(signals)} actionable intelligence signals (Opportunity Radar).")
    
    return {
        "success": True,
        "signals": signals,
        "logs": logs
    }
