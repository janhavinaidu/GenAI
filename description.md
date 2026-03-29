# PatternIQ — The Intelligence Layer for India's 14 Crore Retail Investors

> **ET Gen AI Hackathon 2025 Submission**  
> *Transforming raw market data into actionable, money-making decisions*

---

## 🎯 The Problem

India has **14 crore+ demat accounts**, yet most retail investors are flying blind:

- Reacting to WhatsApp tips instead of data
- Missing critical corporate filings and insider activity
- Unable to read technical charts or understand indicators
- Managing portfolios on gut feel, not intelligence

**ET Markets has the data. PatternIQ builds the intelligence layer.**

---

## 🚀 What is PatternIQ?

PatternIQ is a **multi-agent AI investment intelligence platform** that continuously monitors NSE stocks using four specialized AI agents working in parallel — surfacing opportunities, detecting chart patterns, and delivering everything in plain English so any retail investor can act confidently.

---

## 🤖 The Multi-Agent Architecture

```
User Input (NSE Ticker)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│            (Coordinates all agents below)               │
└─────────────────────────────────────────────────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Scanner  │  │ Backtester│  │Intelligence│  │ Explainer│
  │  Agent   │  │  Agent   │  │  Agent   │  │  Agent   │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

### 🔬 Scanner Agent
- Fetches real-time NSE price data via yfinance
- Runs 14 technical indicator checks: MACD crossovers, RSI analysis, Bollinger Band squeezes/breakouts, EMA crossovers, Double Bottoms, and more
- Supports 5 timeframes: **1D, 1W, 1M, 3M, 1Y** — each with the correct period and interval for accuracy
- Computes support and resistance levels automatically

### 📊 Backtester Agent
- Tests every detected pattern against **2 years of historical NSE data**
- Computes real success rates (not estimates) — e.g. "Bullish MACD Crossover worked 68% of the time on RELIANCE over 24 signals"
- Shows average return per signal and recent signal history

### 🔍 Intelligence Agent (Opportunity Radar)
- Scans for corporate intelligence signals:
  - Bulk/Block deals on NSE exchange
  - Director insider buying activity
  - SEBI regulatory clearances
  - Management commentary shifts from earnings calls
  - FII holding changes
- Tags each signal with a **relevance score**: `critical`, `high`, `medium`
- Modular architecture: plug in real News APIs, SEBI RSS feeds, or NSE bulk deal endpoints  

### 🧠 Explainer Agent (Groq LLM — Llama 3.3 70B)
- Synthesizes all technical patterns + market intelligence into a single plain-English paragraph
- Written for retail investors, not quants
- Ends with one clear action: **Buy / Sell / Wait and Watch**
- Provides confidence level: **High / Medium / Low**

---

## 💬 Market GPT — Next-Gen Interactive Intelligence

PatternIQ includes a **conversational AI layer** powered by Groq's Llama 3.3 70B:

- Knows the current stock's support, resistance, price, and analysis context
- Answers questions like:
  - *"What's the best entry point?"*
  - *"Where should I set my stop loss?"*
  - *"Is this a good time to buy?"*
- Comes with **quick-tap suggestion chips** so users never face a blank input
- Full conversation history maintained per session

---

## 🎬 V-IQ Video Engine

A unique content layer that generates **cinematic market wrap-up scripts** (30-second summaries) in the style of premium financial news:

- High-impact language: *"Momentum Surge", "Resistance Breach", "Consolidation Break"*
- 3-part structure: Hook → Analysis → Action
- Scene-by-scene playback with progress bar
- Designed to make market intelligence accessible and engaging

---

## 📡 NSE Opportunity Scan

A live scanner that monitors the **top 20 NSE blue-chip stocks** and surfaces actionable signals in real time:

- Runs pattern detection across RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, and more
- Displays ticker, price, change %, detected pattern, and signal strength
- Auto-updates with a one-click refresh

---

## 🛠️ Technical Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | React + Vite, Recharts, Lucide Icons |
| **Backend** | FastAPI (Python), WebSocket support |
| **AI / LLM** | Groq API — Llama 3.3 70B Versatile |
| **LLM Framework** | LangChain (ChatGroq, Messages) |
| **Market Data** | yfinance (NSE real-time + historical) |
| **Technical Analysis** | TA-Lib (`ta` library) — 14 indicators |
| **Styling** | Vanilla CSS — Deep Space glassmorphism design |

---

## 🎨 Design Philosophy

PatternIQ uses a **"Deep Space" premium design** system:

- **Dark glassmorphism** cards with frosted glass effects
- **Neon accent palette**: Electric Blue (`#38bdf8`), Electric Indigo (`#818cf8`)
- **Agent Intelligence Trail**: Real-time terminal log of every AI agent's activity  
- **Animated progress bars** showing pattern success rates
- **Live-pulse badge** indicating real-time NSE monitoring
- Fully responsive across desktop and tablet

---

## 🔌 How to Run

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
# Add GROQ_API_KEY to .env
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:5173
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/analyze` | Full multi-agent stock analysis (supports `timeframe`) |
| `GET` | `/api/alerts` | NSE-wide opportunity scan (top 20 stocks) |
| `POST` | `/api/chat` | Market GPT conversational AI |
| `POST` | `/api/market-wrap` | V-IQ video script generation |
| `WS` | `/ws/analyze/{ticker}` | Real-time WebSocket analysis stream |

---

## 🔮 Real-World Data Roadmap

The current architecture is built for **instant swap to live data**:

| Feature | Mock Source | Real Source (Ready to Plug) |
|:---|:---|:---|
| Corporate Filings | Generated signals | NSE Announcements API / SEBI RSS |
| Bulk/Block Deals | Simulated | NSE Bulk Deal CSV (daily) |
| Insider Trades | Simulated | SEBI Insider Trading Disclosures |
| Management Commentary | Simulated | Earnings call transcripts (TickerTape/Screener) |
| Price Data | yfinance (real) | Already live |

---

## 👥 Built For

India's **14 crore retail investors** who deserve the same intelligence layer as institutional traders — delivered in an interface that anyone can understand and use to make better financial decisions.

---

*PatternIQ — Intelligence Layer for the Indian Retail Investor*  
*ET Gen AI Hackathon 2025*
