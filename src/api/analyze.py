# backend/main.py or backend/api/analyze.py
from fastapi import FastAPI, Body
from pydantic import BaseModel
from imi_model import predict_impact  # your LightGBM inference function

app = FastAPI()

class AnalyzeRequest(BaseModel):
    title: str
    content: str
    ticker: str | None = None

@app.post("/api/analyze")
def analyze(request: AnalyzeRequest):
    result = predict_impact(request.title, request.content, request.ticker)
    return result
