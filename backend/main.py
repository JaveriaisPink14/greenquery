from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from .llm import summarize_papers, evaluate_routing
from .auth import create_user, verify_user
import sys
import os
import time
import random
import math
import json

# Add paths
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from search import search_papers
from parallel import parallel_search

app = FastAPI(title="GreenScholar")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchRequest(BaseModel):
    query: str
    mode: str = "now"
    deadline: Optional[int] = None

class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str



# ============ ZONE-AWARE RESULT SELECTION ============
def select_top_by_zone(all_papers, zone_weights, total=10):
    """
    Select top papers while respecting zone weights.
    Example: zone_weights = {"solar": 0.8, "wind": 0.1, "nuclear": 0.1}
    Returns: 8 solar, 1 wind, 1 nuclear (highest scored from each zone)
    """
    # Group papers by zone
    zone_papers = {"solar": [], "wind": [], "nuclear": []}
    for paper in all_papers:
        zone_papers[paper["zone"]].append(paper)
    
    # Sort each zone's papers by score (highest first)
    for zone in zone_papers:
        zone_papers[zone].sort(key=lambda x: x["score"], reverse=True)
    
    # Calculate how many papers from each zone
    counts = {}
    for zone, weight in zone_weights.items():
        counts[zone] = int(total * weight)
    
    # Adjust rounding to ensure total = exact number
    diff = total - sum(counts.values())
    if diff > 0:
        counts["solar"] += diff
    
    # Take top N from each zone
    result = []
    for zone, count in counts.items():
        result.extend(zone_papers[zone][:count])
    
    return result


# ============ SSE CARBON STREAM ============
def generate_carbon_scores():
    """Generate realistic carbon intensity scores (lower = greener)"""
    while True:
        timestamp = time.time()
        
        # Solar carbon intensity: 15-45 gCO₂/kWh (lower is better)
        solar = 30 + 15 * math.sin(timestamp / 600) + random.uniform(-8, 8)
        
        # Wind carbon intensity: 10-35 gCO₂/kWh (lower is better)
        wind = 22 + 12 * math.sin(timestamp / 1800) + random.uniform(-8, 8)
        
        # Nuclear carbon intensity: 5-15 gCO₂/kWh (very stable)
        nuclear = 10 + random.uniform(-3, 5)
        
        # Clamp to realistic ranges
        solar = max(10, min(50, solar))
        wind = max(5, min(45, wind))
        nuclear = max(3, min(20, nuclear))
        
        scores = {
            "solar": round(solar, 1),
            "wind": round(wind, 1),
            "nuclear": round(nuclear, 1)
        }
        
        yield f"data: {json.dumps(scores)}\n\n"
        time.sleep(5)

@app.get("/stream")
async def stream_scores():
    """Server-Sent Events endpoint for live carbon scores"""
    return StreamingResponse(
        generate_carbon_scores(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    )

@app.get("/forecast")
async def get_forecast():
    timestamp = time.time()
    
    solar_period = 600
    time_since_solar_peak = timestamp % solar_period
    solar_seconds_to_peak = round(solar_period - time_since_solar_peak)
    
    wind_period = 1800
    time_since_wind_peak = timestamp % wind_period
    wind_seconds_to_peak = round(wind_period - time_since_wind_peak)
    
    nuclear_period = 3600
    time_since_nuclear_peak = timestamp % nuclear_period
    nuclear_seconds_to_peak = round(nuclear_period - time_since_nuclear_peak)
    
    # Current carbon intensity
    solar_current = 30 + 15 * math.sin(timestamp / 600) + random.uniform(-8, 8)
    wind_current = 22 + 12 * math.sin(timestamp / 1800) + random.uniform(-8, 8)
    nuclear_current = 10 + random.uniform(-3, 5)
    
    # Clamp
    solar_current = max(10, min(50, solar_current))
    wind_current = max(5, min(45, wind_current))
    nuclear_current = max(3, min(20, nuclear_current))
    
    # Peak predictions (lowest carbon intensity)
    solar_peak = 15
    wind_peak = 10
    nuclear_peak = 5
    
    return {
        "solar": {
            "seconds_to_peak": solar_seconds_to_peak,
            "predicted_peak_score": solar_peak,
            "current_score": round(solar_current, 1)
        },
        "wind": {
            "seconds_to_peak": wind_seconds_to_peak,
            "predicted_peak_score": wind_peak,
            "current_score": round(wind_current, 1)
        },
        "nuclear": {
            "seconds_to_peak": nuclear_seconds_to_peak,
            "predicted_peak_score": nuclear_peak,
            "current_score": round(nuclear_current, 1)
        }
    }

# ============ AUTH ENDPOINTS ============

@app.post("/api/signup")
async def signup(request: SignupRequest):
    result = create_user(request.full_name, request.email, request.password)
    return result

@app.post("/api/login")
async def login(request: LoginRequest):
    result = verify_user(request.email, request.password)
    if result["success"]:
        return {"success": True, "user": result["user"]}
    return {"success": False, "message": result["message"]}



# ============ SEARCH ENDPOINT ============
@app.post("/search")
async def search(request: SearchRequest):
    query = request.query
    mode = request.mode
    
    print(f"\n{'='*50}")
    print(f"🔍 NEW SEARCH REQUEST")
    print(f"   Query: {query}")
    print(f"   Mode: {mode}")
    print(f"{'='*50}")
    
    # Define zone weights based on mode
    if mode == "run-now":
        # Equal distribution: all zones get same weight
        zone_weights = {"solar": 0.34, "wind": 0.33, "nuclear": 0.33}
    elif mode == "run-green":
        # Heavily weighted to solar (cleanest zone)
        zone_weights = {"solar": 0.80, "wind": 0.10, "nuclear": 0.10}
    else:  # balanced
        zone_weights = {"solar": 0.60, "wind": 0.20, "nuclear": 0.20}
    
    print(f"📊 Zone weights: {zone_weights}")
    
    # Measure sequential time
    print(f"\n⏱️  SEQUENTIAL SEARCH START")
    start_seq = time.time()
    sequential_papers = search_papers(query, top_k=500)
    sequential_time = time.time() - start_seq
    print(f"✅ SEQUENTIAL SEARCH END: {sequential_time:.2f}s")
    
    # Measure parallel time
    print(f"\n⏱️  PARALLEL SEARCH START")
    start_par = time.time()
    parallel_papers = parallel_search(query, zone_weights, total_papers=500)
    parallel_time = time.time() - start_par
    print(f"✅ PARALLEL SEARCH END: {parallel_time:.2f}s")
    
    # Calculate speedup
    speedup = sequential_time / parallel_time if parallel_time > 0 else 1
    print(f"\n📈 SPEEDUP: {sequential_time:.2f}s / {parallel_time:.2f}s = {speedup:.2f}x")

    # Calculate carbon savings (mock calculation)
    avg_carbon_intensity = 30  # average gCO₂/kWh
    carbon_cost = round(parallel_time * avg_carbon_intensity / 3600, 3)  # kWh to gCO₂
    carbon_saved_percent = round((1 - 1/speedup) * 100) if speedup > 1 else 0
    
    # Select top 10 papers respecting zone weights
    top_papers = select_top_by_zone(parallel_papers, zone_weights, total=10)
    
    # Count actual zone distribution in top results
    zone_counts = {"solar": 0, "wind": 0, "nuclear": 0}
    for paper in top_papers:
        zone_counts[paper["zone"]] += 1
    
    print(f"📊 Zone counts in top 10: {zone_counts}")

    ai_summary = summarize_papers(query, top_papers[:3])
    ai_evaluation = evaluate_routing(query, mode, speedup, zone_counts, zone_weights)
    
    return {
        "papers": top_papers,
        "speedup": round(speedup, 2),
        "sequential_time": round(sequential_time, 2),
        "parallel_time": round(parallel_time, 2),
        "carbon_cost": carbon_cost,
        "carbon_saved_percent": carbon_saved_percent,
        "zone_distribution": zone_weights,
        "zone_counts": zone_counts,
        "ai_summary": ai_summary,
        "ai_evaluation": ai_evaluation
    }

@app.get("/")
def root():
    return {"message": "GreenScholar API running"}