# ⚡ PatternIQ: AI Chart Intelligence

### *Empowering Indian Investors with Multi-Agent Technical Analysis*

![PatternIQ Banner](https://img.shields.io/badge/ET_Gen_AI_Hackathon-2025-blueviolet?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LLM](https://img.shields.io/badge/LLM-Llama_3.3_70B-orange?style=for-the-badge)

PatternIQ is an advanced multi-agent AI system designed to democratize professional-grade technical analysis for retail investors in the Indian stock market (NSE). By combining traditional technical indicators with cutting-edge Large Language Models, PatternIQ doesn't just find patterns—it explains them in plain English.

---

## 🧠 Core Architecture: The Multi-Agent System

PatternIQ operates on a modular, multi-agent architecture where specialized AI agents collaborate to deliver a comprehensive stock analysis.

### 1. 🎤 The Orchestrator
The central brain of the system. It receives a stock ticker (e.g., RELIANCE, TCS) and coordinates the entire pipeline. It manages the sequence of operations and ensures that data flows seamlessly between agents.

### 2. 🔍 Scanner Agent
This agent is the "eyes" of the system.
- **Data Retrieval**: Fetches 6 months of historical daily candle data from NSE using `yfinance`.
- **Pattern Detection**: Identifies technical setups including **MACD Crossovers**, **RSI Oversold/Overbought levels**, **Golden/Death Crosses**, **Bollinger Band Squeezes**, and **200 EMA Breakouts**.
- **S/R Identification**: Calculates dynamic Support and Resistance levels.

### 3. 🧪 Backtester Agent
The "validator" that prevents blind following of signals.
- **Historical Analysis**: For every pattern detected today, this agent looks back at 2 years of historical data for that specific stock.
- **Performance metrics**: It calculates the **Success Rate** (percentage of times the pattern led to a profit within a 5-day window) and **Average Return**.

### 4. 💡 Explainer Agent (AI-Powered)
The "voice" that simplifies complexity.
- **Natural Language Insights**: Uses **LangChain** and **Groq (Llama 3.3 70B)** to translate technical jargon into human-readable advice.
- **Recommendation**: Synthesizes pattern strength and backtest results into a clear action: **Buy**, **Sell**, or **Wait and Watch**.

### 5. 🚨 Alerter Agent
The "watchtower" for the Indian market.
- **Market-wide Scanning**: Scans the top 50+ NSE stocks in the background.
- **Signal Aggregation**: Highlights only the "High Strength" bullish or bearish signals across the entire market in a live feed.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **AI/LLM**: Groq (Llama 3.3 70B Model), LangChain
- **Data Engineering**: yfinance, Pandas, NumPy
- **Technical Analysis**: `ta` (Technical Analysis Library)

### Frontend
- **Framework**: React 19 + Vite
- **Visuals**: Recharts (Custom Candlestick Implementation)
- **Icons**: Lucide-react
- **Real-time**: WebSockets for streaming agent logs

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Groq API Key (Get it at [console.groq.com](https://console.groq.com/))

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/janhavinaidu/GenAI.git
   cd chart-pattern-intelligence
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   GROQ_API_KEY=your_key_here
   ```
   Run the server:
   ```bash
   uvicorn main:app --reload
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

---

## 🏆 Hackathon Acknowledgement
Built with ❤️ for the **ET Gen AI Hackathon 2025**. PatternIQ aims to bridge the gap between complex algorithmic trading and the everyday Indian retail investor.

---

**Disclaimer**: *PatternIQ is an educational tool. Stock market investments are subject to market risks. Always consult with a certified financial advisor before making any investment decisions.*
