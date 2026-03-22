from fastapi import APIRouter, HTTPException, Query, Request
from models.applicant import ApplicantPayload
from services.validation_engine import ValidationEngine
from services.intelligence import IntelligenceEngine
from services.sheets import SheetsService
from services.limiter import limiter
from datetime import datetime
from typing import Dict, Any
import logging

router = APIRouter()
v_engine = ValidationEngine()
i_engine = IntelligenceEngine()
s_service = SheetsService()

# In-memory duplicate check (for session)
submitted_emails = set()
submitted_phones = set()

def mask_email(email: str) -> str:
    if "@" not in email:
        return "***"
    user, domain = email.split("@")
    return f"{user[:2]}***@{domain}"

@router.post("/api/validate")
@limiter.limit("10/minute")
async def validate_applicant(request: Request, payload: ApplicantPayload):
    """
    Full validation pipeline:
    1. Run validation engine (Hard rejects check)
    2. If clean/soft flag, run intelligence layer
    3. Flatten and save to Google Sheets
    4. Return full result
    """
    # 1. Validation Logic
    v_result = v_engine.validate(payload)
    
    # Log the request
    logging.info(f"Validation Request - Email: {mask_email(payload.email)} - Tier: {v_result['tier']}")
    
    # HARD REJECT: Stop immediately, return 422, do not save to Sheets
    if v_result["tier"] == "HARD_REJECT":
        raise HTTPException(
            status_code=422, 
            detail={"errors": v_result["errors"], "tier": "HARD_REJECT"}
        )
    
    # 2. Intelligence Layer
    risk_score = i_engine.compute_risk_score(payload, v_result)
    category_data = i_engine.categorize(risk_score, v_result, payload)
    anomalies = i_engine.detect_anomalies(payload, v_result)
    
    # 3. Flatten for Google Sheets
    ug_edu = next((e for e in payload.education if e.level == "UG"), None)
    
    record = {
        "full_name": payload.full_name,
        "email": payload.email,
        "phone": payload.phone,
        "date_of_birth": payload.date_of_birth.isoformat(),
        "aadhaar_number": payload.aadhaar_number,
        "education_levels": ", ".join([e.level for e in payload.education]),
        "ug_institution": ug_edu.board_or_university if ug_edu else "N/A",
        "ug_stream": ug_edu.stream_specialization if ug_edu else "N/A",
        "ug_year": ug_edu.year_of_passing if ug_edu else 0,
        "ug_score_normalized": v_result["normalized_scores"].get("UG", 0),
        "total_work_months": v_result["derived"]["total_work_months"],
        "relevant_work_months": v_result["derived"]["relevant_work_months"],
        "current_status": v_result["derived"]["current_status"],
        "experience_bucket": v_result["derived"]["experience_bucket"],
        "screening_score": payload.screening_test_score or 0,
        "interview_status": payload.interview_status or "Pending",
        "risk_score": risk_score,
        "category": category_data["category"],
        "anomalies": ", ".join(anomalies),
        "validation_tier": v_result["tier"],
        "flags": ", ".join([f["reason"] for f in v_result["flags"]]),
        "exceptions_count": len(payload.exceptions),
        "exceptions_summary": ", ".join([f"{k}: {v}" for k, v in payload.exceptions.items()]),
        "completeness_pct": v_result["derived"]["completeness_pct"],
        "submitted_at": datetime.utcnow().isoformat()
    }
    
    # 4. Save to Sheets
    sheets_saved = s_service.append_applicant(record)
    
    # Add to duplicate check sets
    submitted_emails.add(payload.email)
    submitted_phones.add(payload.phone)
    
    return {
        "status": "success",
        "tier": v_result["tier"],
        "flags": v_result["flags"],
        "risk_score": risk_score,
        "category": category_data,
        "anomalies": anomalies,
        "derived": v_result["derived"],
        "sheets_saved": sheets_saved
    }

@router.post("/api/check-duplicate")
@limiter.limit("10/minute")
async def check_duplicate(request: Request, payload: Dict[str, str]):
    email = payload.get("email")
    phone = payload.get("phone")
    
    if email in submitted_emails:
        return {"duplicate": True, "field": "email"}
    if phone in submitted_phones:
        return {"duplicate": True, "field": "phone"}
    
    return {"duplicate": False, "field": None}

@router.get("/api/suggest")
async def suggest(field: str = Query(...), value: str = Query(...)):
    """
    AI-powered field standardization suggestions.
    """
    suggestion = i_engine.get_smart_suggestions(field, value)
    return {"suggestion": suggestion}

@router.get("/api/health")
async def health():
    """
    System health check.
    """
    return {"status": "ok", "version": "2.0"}
