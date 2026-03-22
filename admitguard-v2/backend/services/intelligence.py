import os
import requests
from typing import List, Dict, Any, Optional
from datetime import date, datetime
from models.applicant import ApplicantPayload

class IntelligenceEngine:
    """
    Intelligence layer for AdmitGuard v2.
    Provides risk scoring, categorization, anomaly detection, and AI-powered suggestions.
    """

    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.gemini_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

    def compute_risk_score(self, payload: ApplicantPayload, validation_result: Dict[str, Any]) -> int:
        """
        Computes a risk score (0-100) based on a weighted penalty system.
        Higher score means lower risk (better fit).
        """
        score = 100
        derived = validation_result.get("derived", {})
        normalized_scores = validation_result.get("normalized_scores", {})

        # 1. UG Score Penalties
        ug_score = normalized_scores.get("UG", 0)
        if ug_score < 50:
            score -= 20
        elif 50 <= ug_score < 60:
            score -= 10

        # 2. Backlog Penalties
        levels_with_backlogs = sum(1 for edu in payload.education if edu.backlog_count > 0)
        if levels_with_backlogs > 0:
            penalty = min(30, levels_with_backlogs * 15)
            score -= penalty

        # 3. Education Gap Penalties
        total_edu_gap = derived.get("total_education_gap_months", 0)
        if total_edu_gap > 48:
            score -= 20
        elif total_edu_gap > 24:
            score -= 10

        # 4. No Work Experience + 3+ years since graduation
        last_edu_year = max((edu.year_of_passing for edu in payload.education), default=0)
        years_since_grad = datetime.now().year - last_edu_year
        if not payload.work_experience and years_since_grad >= 3:
            score -= 15

        # 5. Career Gap Penalties
        career_gaps = derived.get("career_gaps", [])
        gaps_over_6 = sum(1 for gap in career_gaps if gap > 6)
        if gaps_over_6 > 0:
            penalty = min(20, gaps_over_6 * 8)
            score -= penalty

        # 6. Domain Switches
        unique_domains = len(set(w.domain for w in payload.work_experience))
        if unique_domains > 3:
            score -= 12

        # 7. Screening Score Penalties
        test_score = payload.screening_test_score
        if test_score is not None:
            if test_score < 40:
                score -= 20
            elif test_score < 50:
                score -= 10

        # 8. Soft-rule Exceptions
        if len(payload.exceptions) > 2:
            score -= 10

        # 9. PhD Anomaly
        if any(edu.level == "PhD" for edu in payload.education):
            score -= 5

        # 10. Completeness Penalty
        completeness = derived.get("completeness_pct", 100)
        if completeness < 70:
            score -= 10

        return max(0, min(100, score))

    def detect_anomalies(self, payload: ApplicantPayload, validation_result: Dict[str, Any]) -> List[str]:
        """
        Detects unusual patterns or data inconsistencies in the application.
        """
        anomalies = []
        
        # PhD holder applying
        if any(edu.level == "PhD" for edu in payload.education):
            anomalies.append("PhD holder applying for PG Diploma (Overqualified)")

        # Age > 32
        today = date.today()
        age = today.year - payload.date_of_birth.year - ((today.month, today.day) < (payload.date_of_birth.month, payload.date_of_birth.day))
        if age > 32:
            anomalies.append(f"Age outlier: {age} years (Program typically for younger professionals)")

        # 4+ career domain switches
        unique_domains = len(set(w.domain for w in payload.work_experience))
        if unique_domains >= 4:
            anomalies.append(f"High domain instability: {unique_domains} sectors in career history")

        # Graduation year before 2010
        if any(edu.year_of_passing < 2010 for edu in payload.education):
            anomalies.append("Legacy education: Graduation year before 2010 detected")

        # Work experience > 15 years
        total_months = validation_result.get("derived", {}).get("total_work_months", 0)
        if total_months > 180: # 15 * 12
            anomalies.append(f"Experience outlier: {total_months // 12} years of work history")

        # All education levels scored exactly the same
        if len(payload.education) > 1:
            scores = [edu.score for edu in payload.education]
            if len(set(scores)) == 1:
                anomalies.append("Data suspicion: All education levels reported with identical scores")

        return anomalies

    def categorize(self, risk_score: int, validation_result: Dict[str, Any], payload: ApplicantPayload) -> Dict[str, Any]:
        """
        Categorizes the applicant based on risk score, validation tier, and anomalies.
        """
        tier = validation_result.get("tier", "CLEAN")
        anomalies = self.detect_anomalies(payload, validation_result)
        
        if anomalies:
            return {
                "category": "Anomaly",
                "reason": f"System detected potential anomalies: {', '.join(anomalies[:2])}..."
            }

        if risk_score >= 75 and tier == "CLEAN":
            return {
                "category": "Strong Fit",
                "reason": "High risk score and clean validation profile."
            }
        
        if risk_score >= 55 and tier != "HARD_REJECT":
            return {
                "category": "Needs Review",
                "reason": "Moderate risk score or soft flags present in application."
            }
        
        return {
            "category": "Weak Fit",
            "reason": "Low risk score or significant validation concerns."
        }

    def get_smart_suggestions(self, field_name: str, current_value: str) -> str:
        """
        Calls Gemini API to provide standardization suggestions for specific fields.
        """
        if not self.api_key:
            return ""

        allowed_fields = ["board_or_university", "stream_specialization", "key_skills"]
        if field_name not in allowed_fields:
            return ""

        prompt = (
            f"You are an assistant for an Indian university admission form. The field is '{field_name}'. "
            f"The user entered: '{current_value}'. "
            f"Suggest the correct/standardized version in 1 line. If already correct, say 'Looks good'. "
            f"Be concise."
        )

        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }

        try:
            response = requests.post(
                f"{self.gemini_url}?key={self.api_key}",
                json=payload,
                timeout=5
            )
            response.raise_for_status()
            data = response.json()
            
            # Extract text from Gemini response structure
            suggestion = data['candidates'][0]['content']['parts'][0]['text'].strip()
            return suggestion
        except Exception:
            return ""
