import pandas as pd
import ta
import numpy as np

def detect_patterns(df: pd.DataFrame) -> list:
    patterns = []
    df = df.copy()

    # Add indicators — use shorter EMAs to work with less data
    df['rsi'] = ta.momentum.RSIIndicator(df['close'], window=14).rsi()
    
    macd = ta.trend.MACD(df['close'])
    df['macd'] = macd.macd()
    df['macd_signal'] = macd.macd_signal()
    df['macd_hist'] = macd.macd_diff()
    
    df['ema10'] = ta.trend.EMAIndicator(df['close'], window=10).ema_indicator()
    df['ema20'] = ta.trend.EMAIndicator(df['close'], window=20).ema_indicator()
    df['ema50'] = ta.trend.EMAIndicator(df['close'], window=50).ema_indicator()
    
    bb = ta.volatility.BollingerBands(df['close'], window=20)
    df['bb_upper'] = bb.bollinger_hband()
    df['bb_lower'] = bb.bollinger_lband()
    df['bb_mid'] = bb.bollinger_mavg()

    # Drop only rows where core indicators are NaN — don't require EMA200
    df.dropna(subset=['rsi', 'macd', 'macd_signal', 'ema20', 'ema50'], inplace=True)

    if len(df) < 3:
        return [{
            "name": "Consolidation Phase",
            "type": "neutral",
            "description": "Market is consolidating — watch for breakout direction",
            "strength": "medium"
        }]

    latest = df.iloc[-1]
    prev = df.iloc[-2]
    prev2 = df.iloc[-3]

    # 1. MACD Bullish Crossover
    if (prev['macd'] < prev['macd_signal'] and latest['macd'] > latest['macd_signal']):
        patterns.append({
            "name": "Bullish MACD Crossover",
            "type": "bullish",
            "description": "MACD line crossed above signal line — upward momentum building",
            "strength": "high"
        })

    # 2. MACD Bearish Crossover
    if (prev['macd'] > prev['macd_signal'] and latest['macd'] < latest['macd_signal']):
        patterns.append({
            "name": "Bearish MACD Crossover",
            "type": "bearish",
            "description": "MACD line crossed below signal line — downward momentum building",
            "strength": "high"
        })

    # 3. RSI Oversold Bounce
    if latest['rsi'] < 40 and prev['rsi'] < latest['rsi']:
        patterns.append({
            "name": "RSI Oversold Bounce",
            "type": "bullish",
            "description": f"RSI at {latest['rsi']:.1f} and recovering — oversold condition, potential reversal",
            "strength": "high" if latest['rsi'] < 30 else "medium"
        })

    # 4. RSI Overbought Reversal
    if latest['rsi'] > 65 and prev['rsi'] > latest['rsi']:
        patterns.append({
            "name": "RSI Overbought Reversal",
            "type": "bearish",
            "description": f"RSI at {latest['rsi']:.1f} and declining — stock may pullback from overbought zone",
            "strength": "high" if latest['rsi'] > 75 else "medium"
        })

    # 5. Golden Cross (EMA10 x EMA20)
    if (prev['ema10'] < prev['ema20'] and latest['ema10'] > latest['ema20']):
        patterns.append({
            "name": "Golden Cross",
            "type": "bullish",
            "description": "10 EMA crossed above 20 EMA — strong short-term bullish momentum",
            "strength": "high"
        })

    # 6. Death Cross (EMA10 x EMA20)
    if (prev['ema10'] > prev['ema20'] and latest['ema10'] < latest['ema20']):
        patterns.append({
            "name": "Death Cross",
            "type": "bearish",
            "description": "10 EMA crossed below 20 EMA — bearish momentum, consider risk management",
            "strength": "high"
        })

    # 7. Bollinger Band Squeeze
    band_width = latest['bb_upper'] - latest['bb_lower']
    avg_band_width = (df['bb_upper'] - df['bb_lower']).mean()
    if band_width < avg_band_width * 0.7:
        patterns.append({
            "name": "Bollinger Band Squeeze",
            "type": "neutral",
            "description": "Bands are tightening — a high-velocity breakout is likely imminent",
            "strength": "high"
        })

    # 8. Bollinger Band Breakout (Bullish)
    if latest['close'] > latest['bb_upper']:
        patterns.append({
            "name": "Bollinger Band Breakout (Up)",
            "type": "bullish",
            "description": "Price breaking above upper Bollinger Band — strong bullish momentum",
            "strength": "high"
        })

    # 9. Bollinger Band Breakdown (Bearish)
    if latest['close'] < latest['bb_lower']:
        patterns.append({
            "name": "Bollinger Band Breakdown",
            "type": "bearish",
            "description": "Price broke below lower Bollinger Band — strong bearish pressure",
            "strength": "high"
        })

    # 10. Price above 50 EMA (Bullish bias)
    if latest['close'] > latest['ema50'] and prev['close'] < prev['ema50']:
        patterns.append({
            "name": "50 EMA Bullish Breakout",
            "type": "bullish",
            "description": "Price just crossed above 50 EMA — medium-term trend turning bullish",
            "strength": "high"
        })

    # 11. Price below 50 EMA (Bearish bias)
    if latest['close'] < latest['ema50'] and prev['close'] > prev['ema50']:
        patterns.append({
            "name": "50 EMA Bearish Breakdown",
            "type": "bearish",
            "description": "Price just crossed below 50 EMA — medium-term trend turning bearish",
            "strength": "high"
        })

    # 12. Strong uptrend with RSI strength (always detect if in strong trend)
    if latest['rsi'] > 55 and latest['close'] > latest['ema20'] and latest['ema20'] > latest['ema50']:
        patterns.append({
            "name": "Strong Uptrend Continuation",
            "type": "bullish",
            "description": f"Price above EMAs, RSI at {latest['rsi']:.1f} — trend momentum intact",
            "strength": "medium"
        })

    # 13. Downtrend continuation
    if latest['rsi'] < 45 and latest['close'] < latest['ema20'] and latest['ema20'] < latest['ema50']:
        patterns.append({
            "name": "Downtrend Continuation",
            "type": "bearish",
            "description": f"Price below EMAs, RSI at {latest['rsi']:.1f} — bearish bias persists",
            "strength": "medium"
        })

    # 14. Double Bottom (simplified)
    recent_lows = df['low'].tail(20)
    min_low = recent_lows.min()
    low_count = (recent_lows < min_low * 1.02).sum()
    if low_count >= 2 and latest['close'] > df['close'].tail(20).mean():
        patterns.append({
            "name": "Double Bottom Reversal",
            "type": "bullish",
            "description": "Price tested same support twice and bounced — reversal signal confirmed",
            "strength": "high"
        })

    # Always return at least one pattern
    if not patterns:
        # Generate a meaningful pattern based on current technicals
        if latest['rsi'] > 50 and latest['close'] > latest['ema20']:
            patterns.append({
                "name": "Bullish Bias",
                "type": "bullish",
                "description": f"Price above 20 EMA with RSI at {latest['rsi']:.1f} — mild bullish bias",
                "strength": "medium"
            })
        else:
            patterns.append({
                "name": "Bearish/Neutral Bias",
                "type": "bearish",
                "description": f"Price below key EMAs with RSI at {latest['rsi']:.1f} — cautious stance advised",
                "strength": "medium"
            })

    return patterns


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