from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from agents.orchestrator import analyze_stock, get_market_alerts
from agents.market_gpt import chat_with_market_gpt
from agents.video_engine import generate_market_wrap
from pydantic import BaseModel
import asyncio
import numpy as np
import pandas as pd
import json
from datetime import datetime

class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.bool_):
            return bool(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if isinstance(obj, (pd.Timestamp, datetime)):
            return obj.strftime("%Y-%m-%d")
        if isinstance(obj, pd.Series):
            return obj.tolist()
        return super().default(obj)

app = FastAPI(title="PatternIQ API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class StockRequest(BaseModel):
    ticker: str
    timeframe: str = "1M"

class ChatRequest(BaseModel):
    ticker: str
    message: str
    history: list
    context: dict

class WrapRequest(BaseModel):
    data: dict

@app.get("/")
def root():
    return {"message": "PatternIQ Backend Running", "status": "ok"}

@app.post("/api/analyze")
def analyze(request: StockRequest):
    result = analyze_stock(request.ticker, request.timeframe)
    return JSONResponse(content=json.loads(json.dumps(result, cls=NumpyEncoder)))

@app.get("/api/alerts")
def alerts():
    result = get_market_alerts(limit=10)
    return JSONResponse(content=json.loads(json.dumps(result, cls=NumpyEncoder)))

@app.get("/api/health")
def health():
    return {"status": "healthy"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    response = chat_with_market_gpt(
        request.ticker,
        request.message,
        request.history,
        request.context
    )
    return {"response": response}

@app.post("/api/market-wrap")
def market_wrap(request: WrapRequest):
    result = generate_market_wrap(request.data)
    return JSONResponse(content=result)

@app.websocket("/ws/analyze/{ticker}")
async def websocket_analyze(websocket: WebSocket, ticker: str):
    await websocket.accept()
    try:
        await websocket.send_json({"type": "log", "message": f"Starting analysis for {ticker}..."})
        await asyncio.sleep(0.5)
        
        result = analyze_stock(ticker)
        
        for log_entry in result.get("logs", []):
            await websocket.send_json({"type": "log", "message": log_entry})
            await asyncio.sleep(0.3)
        
        await websocket.send_json({
            "type": "result",
            "data": json.loads(json.dumps(result, cls=NumpyEncoder))
        })
        await websocket.send_json({"type": "done"})

    except Exception as e:
        await websocket.send_json({"type": "error", "message": str(e)})
    finally:
        await websocket.close()