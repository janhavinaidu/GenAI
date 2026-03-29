from utils.data_fetcher import NSE_TOP_STOCKS, get_stock_data
from utils.pattern_detector import detect_patterns
import time

def run_alerter(limit: int = 10) -> dict:
    logs = []
    alerts = []

    def log(msg):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] Alerter Agent → {msg}"
        logs.append(entry)
        print(entry)

    log(f"Scanning top {limit} NSE stocks for active signals...")

    for ticker in NSE_TOP_STOCKS[:limit]:
        try:
            log(f"Checking {ticker}...")
            df = get_stock_data(ticker, period="3mo", interval="1d")
            patterns = detect_patterns(df)

            strong = [p for p in patterns if p['strength'] == 'high' and p['type'] != 'neutral']
            if strong:
                current_price = round(float(df['close'].iloc[-1]), 2)
                prev_price = round(float(df['close'].iloc[-2]), 2)
                change_pct = round(((current_price - prev_price) / prev_price) * 100, 2)

                alerts.append({
                    "ticker": ticker,
                    "price": current_price,
                    "change_pct": change_pct,
                    "pattern": strong[0]['name'],
                    "type": strong[0]['type'],
                    "strength": strong[0]['strength'],
                    "time": time.strftime("%H:%M")
                })
                log(f"SIGNAL: {ticker} → {strong[0]['name']} ({strong[0]['type']})")

        except Exception as e:
            log(f"Skipping {ticker}: {str(e)}")
            continue

    log(f"Scan complete. Found {len(alerts)} strong signals.")

    return {
        "success": True,
        "alerts": alerts,
        "scanned": limit,
        "logs": logs
    }