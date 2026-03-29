import pandas as pd
import ta
import numpy as np

def detect_patterns(df: pd.DataFrame) -> list:
    patterns = []
    df = df.copy()

    # Add indicators
    df['rsi'] = ta.momentum.RSIIndicator(df['close'], window=14).rsi()
    
    macd = ta.trend.MACD(df['close'])
    df['macd'] = macd.macd()
    df['macd_signal'] = macd.macd_signal()
    df['macd_hist'] = macd.macd_diff()
    
    df['ema20'] = ta.trend.EMAIndicator(df['close'], window=20).ema_indicator()
    df['ema50'] = ta.trend.EMAIndicator(df['close'], window=50).ema_indicator()
    df['ema200'] = ta.trend.EMAIndicator(df['close'], window=200).ema_indicator()
    
    bb = ta.volatility.BollingerBands(df['close'], window=20)
    df['bb_upper'] = bb.bollinger_hband()
    df['bb_lower'] = bb.bollinger_lband()
    df['bb_mid'] = bb.bollinger_mavg()

    df.dropna(inplace=True)

    if len(df) < 2:
        return [{
            "name": "No Strong Pattern",
            "type": "neutral",
            "description": "Not enough data to detect patterns",
            "strength": "low"
        }]

    latest = df.iloc[-1]
    prev = df.iloc[-2]

    # 1. MACD Bullish Crossover
    if (prev['macd'] < prev['macd_signal'] and
            latest['macd'] > latest['macd_signal']):
        patterns.append({
            "name": "Bullish MACD Crossover",
            "type": "bullish",
            "description": "MACD line crossed above signal line indicating upward momentum",
            "strength": "high" if latest['macd_hist'] > 0.5 else "medium"
        })

    # 2. MACD Bearish Crossover
    if (prev['macd'] > prev['macd_signal'] and
            latest['macd'] < latest['macd_signal']):
        patterns.append({
            "name": "Bearish MACD Crossover",
            "type": "bearish",
            "description": "MACD line crossed below signal line indicating downward momentum",
            "strength": "high" if latest['macd_hist'] < -0.5 else "medium"
        })

    # 3. RSI Oversold Bounce
    if latest['rsi'] < 35 and prev['rsi'] < latest['rsi']:
        patterns.append({
            "name": "RSI Oversold Bounce",
            "type": "bullish",
            "description": "RSI below 35 and recovering — potential reversal signal",
            "strength": "medium"
        })

    # 4. RSI Overbought Reversal
    if latest['rsi'] > 70 and prev['rsi'] > latest['rsi']:
        patterns.append({
            "name": "RSI Overbought Reversal",
            "type": "bearish",
            "description": "RSI above 70 and falling — stock may be due for a pullback",
            "strength": "medium"
        })

    # 5. Golden Cross
    if (prev['ema20'] < prev['ema50'] and
            latest['ema20'] > latest['ema50']):
        patterns.append({
            "name": "Golden Cross",
            "type": "bullish",
            "description": "20 EMA crossed above 50 EMA — strong bullish trend signal",
            "strength": "high"
        })

    # 6. Death Cross
    if (prev['ema20'] > prev['ema50'] and
            latest['ema20'] < latest['ema50']):
        patterns.append({
            "name": "Death Cross",
            "type": "bearish",
            "description": "20 EMA crossed below 50 EMA — strong bearish trend signal",
            "strength": "high"
        })

    # 7. Bollinger Band Squeeze
    band_width = latest['bb_upper'] - latest['bb_lower']
    avg_band_width = (df['bb_upper'] - df['bb_lower']).mean()
    if band_width < avg_band_width * 0.5:
        patterns.append({
            "name": "Bollinger Band Squeeze",
            "type": "neutral",
            "description": "Bands are unusually tight — high volatility breakout expected soon",
            "strength": "medium"
        })

    # 8. 200 EMA Breakout
    if latest['close'] > latest['ema200'] and prev['close'] < prev['ema200']:
        patterns.append({
            "name": "200 EMA Breakout",
            "type": "bullish",
            "description": "Price crossed above 200 EMA — long term bullish trend confirmed",
            "strength": "high"
        })

    # 9. Double Bottom (simplified)
    recent_lows = df['low'].tail(20)
    min_low = recent_lows.min()
    low_count = (recent_lows < min_low * 1.02).sum()
    if low_count >= 2 and latest['close'] > df['close'].tail(20).mean():
        patterns.append({
            "name": "Double Bottom Reversal",
            "type": "bullish",
            "description": "Price tested same support twice and bounced — reversal likely",
            "strength": "high"
        })

    return patterns if patterns else [{
        "name": "No Strong Pattern",
        "type": "neutral",
        "description": "No significant technical pattern detected at this time",
        "strength": "low"
    }]


def get_support_resistance(df: pd.DataFrame) -> dict:
    recent = df.tail(60)
    support = round(float(recent['low'].min()), 2)
    resistance = round(float(recent['high'].max()), 2)
    current = round(float(df['close'].iloc[-1]), 2)

    return {
        "support": support,
        "resistance": resistance,
        "current": current,
        "risk_reward": round(
            (resistance - current) / (current - support), 2
        ) if current > support else 0
    }