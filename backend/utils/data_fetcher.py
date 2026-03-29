import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

def get_stock_data(ticker: str, period: str = "6mo", interval: str = "1d") -> pd.DataFrame:
    if not ticker.endswith(".NS"):
        ticker = ticker + ".NS"
    
    stock = yf.Ticker(ticker)
    df = stock.history(period=period, interval=interval)
    
    if df.empty:
        raise ValueError(f"No data found for {ticker}")
    
    df = df[["Open", "High", "Low", "Close", "Volume"]]
    df.index = pd.to_datetime(df.index)
    df.columns = ["open", "high", "low", "close", "volume"]
    return df

def get_stock_info(ticker: str) -> dict:
    if not ticker.endswith(".NS"):
        ticker = ticker + ".NS"
    
    stock = yf.Ticker(ticker)
    info = stock.info
    
    return {
        "ticker": ticker,
        "name": info.get("longName", ticker),
        "current_price": info.get("currentPrice") or info.get("regularMarketPrice", 0),
        "previous_close": info.get("previousClose", 0),
        "change_percent": round(
            ((info.get("currentPrice", 0) - info.get("previousClose", 1)) 
             / info.get("previousClose", 1)) * 100, 2
        ),
        "market_cap": info.get("marketCap", 0),
        "sector": info.get("sector", "N/A"),
        "volume": info.get("volume", 0),
    }

def get_multiple_stocks(tickers: list) -> dict:
    results = {}
    for ticker in tickers:
        try:
            results[ticker] = get_stock_data(ticker)
        except Exception as e:
            print(f"Error fetching {ticker}: {e}")
    return results

NSE_TOP_STOCKS = [
    "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK",
    "HINDUNILVR", "ITC", "SBIN", "BHARTIARTL", "KOTAKBANK",
    "LT", "AXISBANK", "ASIANPAINT", "MARUTI", "SUNPHARMA",
    "WIPRO", "ULTRACEMCO", "TITAN", "BAJFINANCE", "NESTLEIND"
]