from utils.data_fetcher import get_stock_data, get_stock_info
from utils.pattern_detector import detect_patterns, get_support_resistance
import time

TIMEFRAME_MAP = {
    "1D": {"period": "5d",   "interval": "15m",  "candles": 50},
    "1W": {"period": "1mo",  "interval": "1h",   "candles": 60},
    "1M": {"period": "3mo",  "interval": "1d",   "candles": 60},
    "3M": {"period": "6mo",  "interval": "1d",   "candles": 90},
    "1Y": {"period": "1y",   "interval": "1wk",  "candles": 52},
}

def run_scanner(ticker: str, timeframe: str = "1M") -> dict:
    logs = []
    
    def log(msg):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] Scanner Agent → {msg}"
        logs.append(entry)
        print(entry)

    try:
        tf = TIMEFRAME_MAP.get(timeframe, TIMEFRAME_MAP["1M"])
        log(f"Fetching {timeframe} market data for {ticker}.NS...")
        df = get_stock_data(ticker, period=tf["period"], interval=tf["interval"])
        info = get_stock_info(ticker)
        log(f"Retrieved {len(df)} data points")

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
            "candles": df.tail(tf["candles"]).reset_index().to_dict(orient="records"),
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