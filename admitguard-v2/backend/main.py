import json
import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from services.limiter import limiter
from routers import validate

# Setup logging
logging.basicConfig(
    filename='admitguard_audit.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

app = FastAPI(title="AdmitGuard v2 API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to load rules
@app.on_event("startup")
async def startup_event():
    """
    Loads the admission rules from config/rules.json into app state.
    """
    try:
        rules_path = os.path.join(os.path.dirname(__file__), "config", "rules.json")
        with open(rules_path, "r") as f:
            app.state.rules = json.load(f)
            print("Successfully loaded admission rules.")
    except Exception as e:
        print(f"Warning: Could not load rules.json: {str(e)}")
        app.state.rules = {}

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler to return clean JSON errors.
    """
    print(f"Unhandled error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "An internal server error occurred. Please try again later."
        }
    )

# Include routers
app.include_router(validate.router)

@app.get("/")
async def root():
    return {
        "message": "AdmitGuard v2 API is running",
        "docs": "/docs"
    }
