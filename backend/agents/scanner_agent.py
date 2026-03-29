from utils.data_fetcher import get_stock_data, get_stock_info
from utils.pattern_detector import detect_patterns, get_support_resistance
import time

def run_scanner(ticker: str) -> dict:
    logs = []
    
    def log(msg):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] Scanner Agent → {msg}"
        logs.append(entry)
        print(entry)

    try:
        log(f"Fetching market data for {ticker}.NS...")
        df = get_stock_data(ticker, period="6mo", interval="1d")
        info = get_stock_info(ticker)
        log(f"Retrieved {len(df)} trading days of data")

        log(f"Running technical indicator calculations...")
        patterns = detect_patterns(df)
        sr = get_support_resistance(df)
        log(f"Detected {len(patterns)} pattern(s): {', '.join([p['name'] for p in patterns])}")

        return {
            "success": True,
            "ticker": ticker,
            "info": info,
            "patterns": patterns,
            "support_resistance": sr,
            "candles": df.tail(60).reset_index().to_dict(orient="records"),
            "logs": logs
        }

    except Exception as e:
        log(f"Error: {str(e)}")
        return {
            "success": False,
            "ticker": ticker,
            "error": str(e),
            "logs": logs
        }