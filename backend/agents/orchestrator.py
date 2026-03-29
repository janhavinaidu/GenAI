from agents.scanner_agent import run_scanner
from agents.backtester_agent import run_backtester
from agents.explainer_agent import run_explainer
from agents.alerter_agent import run_alerter
import time

def analyze_stock(ticker: str) -> dict:
    ticker = ticker.upper().replace(".NS", "")
    all_logs = []
    
    def log(msg):
        timestamp = time.strftime("%H:%M:%S")
        entry = f"[{timestamp}] Orchestrator → {msg}"
        all_logs.append(entry)
        print(entry)

    log(f"Starting full analysis pipeline for {ticker}")

    # Step 1: Scan
    log("Dispatching Scanner Agent...")
    scan_result = run_scanner(ticker)
    all_logs.extend(scan_result.get("logs", []))

    if not scan_result["success"]:
        return {
            "success": False,
            "error": scan_result.get("error", "Scan failed"),
            "logs": all_logs
        }

    # Step 2: Backtest
    log("Dispatching Backtester Agent...")
    backtest_result = run_backtester(ticker, scan_result["patterns"])
    all_logs.extend(backtest_result.get("logs", []))

    # Step 3: Explain
    log("Dispatching Explainer Agent...")
    explain_result = run_explainer(
        ticker,
        scan_result["patterns"],
        backtest_result.get("backtest_results", []),
        scan_result.get("info", {})
    )
    all_logs.extend(explain_result.get("logs", []))

    log("Analysis complete. Compiling results...")

    return {
        "success": True,
        "ticker": ticker,
        "stock_info": scan_result.get("info", {}),
        "patterns": scan_result.get("patterns", []),
        "backtest_results": backtest_result.get("backtest_results", []),
        "explanation": explain_result.get("explanation", ""),
        "confidence": explain_result.get("confidence", "Medium"),
        "action": explain_result.get("action", "Wait and Watch"),
        "support_resistance": scan_result.get("support_resistance", {}),
        "candles": scan_result.get("candles", []),
        "logs": all_logs
    }


def get_market_alerts(limit: int = 10) -> dict:
    return run_alerter(limit)