from utils.backtester import backtest_all_patterns
import time

def run_backtester(ticker: str, patterns: list) -> dict:
    logs = []

    def log(msg):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] Backtester Agent → {msg}"
        logs.append(entry)
        print(entry)

    try:
        log(f"Starting 2-year historical backtest for {ticker}...")
        log(f"Testing {len(patterns)} detected pattern(s)...")

        results = backtest_all_patterns(ticker, patterns)

        for r in results:
            log(f"{r['pattern']} → Success rate: {r['success_rate']}% ({r['successful_signals']}/{r['total_signals']} signals)")

        return {
            "success": True,
            "ticker": ticker,
            "backtest_results": results,
            "logs": logs
        }

    except Exception as e:
        log(f"Error during backtest: {str(e)}")
        return {
            "success": False,
            "ticker": ticker,
            "error": str(e),
            "logs": logs
        }