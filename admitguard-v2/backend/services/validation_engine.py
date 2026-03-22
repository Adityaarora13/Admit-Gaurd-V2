import re
from datetime import date, datetime
from typing import List, Dict, Any, Optional
from models.applicant import ApplicantPayload, EducationEntry, WorkEntry

# In-memory store for duplicate checks (mocking database/sheets)
EXISTING_EMAILS = set()
EXISTING_PHONES = set()

class ValidationEngine:
    """
    Core validation engine for AdmitGuard v2.
    Handles score normalization, hard rejects, soft flags, and derived metrics.
    """

    PROGRAM_START_DATE = date(2025, 9, 1)

    def __init__(self):
        self.errors = []
        self.flags = []
        self.normalized_scores = {}

    def _normalize_score(self, entry: EducationEntry) -> float:
        """Normalizes scores from various scales to a 0-100 percentage scale."""
        scale = entry.score_scale
        score = entry.score

        if scale == "percentage":
            return score
        
        if scale == "cgpa_10":
            return score * 9.5
        
        if scale == "cgpa_4":
            # Table-based normalization for CGPA 4.0
            mapping = {
                4.0: 100.0,
                3.7: 92.0,
                3.3: 87.0,
                3.0: 83.0,
                2.7: 77.0,
                2.3: 73.0,
                2.0: 67.0
            }
            # Find closest lower bound or calculate proportional
            if score >= 4.0: return 100.0
            if score in mapping: return mapping[score]
            
            # Linear interpolation or fallback logic
            sorted_keys = sorted(mapping.keys(), reverse=True)
            for k in sorted_keys:
                if score >= k:
                    return mapping[k]
            
            # Below 2.0 logic
            return (score / 4.0) * 60.0

        if scale == "grade":
            grade_map = {
                "A+": 95.0, "A": 90.0, "B+": 85.0, "B": 80.0,
                "C+": 75.0, "C": 70.0, "D": 60.0, "F": 0.0
            }
            # Handle case-insensitive and potential whitespace
            clean_grade = str(score).strip().upper() if isinstance(score, str) else str(score)
            return grade_map.get(clean_grade, 0.0)

        return 0.0

    def _calculate_age(self, dob: date) -> int:
        """Calculates age at the time of program start."""
        return (self.PROGRAM_START_DATE - dob).days // 365

    def _is_valid_email(self, email: str) -> bool:
        """Basic regex for email validation."""
        pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        return bool(re.match(pattern, email))

    def _is_valid_phone(self, phone: str) -> bool:
        """Validates 10-digit Indian phone numbers starting with 6-9."""
        pattern = r"^[6-9]\d{9}$"
        return bool(re.match(pattern, phone))

    def validate(self, payload: ApplicantPayload) -> Dict[str, Any]:
        """
        Main validation entry point. Performs all checks and returns a ValidationResult.
        """
        self.errors = []
        self.flags = []
        self.normalized_scores = {}
        
        # 1. HARD REJECT RULES
        self._check_hard_rejects(payload)
        
        # 2. SCORE NORMALIZATION (needed for soft flags)
        for edu in payload.education:
            self.normalized_scores[edu.level] = self._normalize_score(edu)

        # 3. SOFT FLAG RULES
        self._check_soft_flags(payload)

        # 4. DERIVED METRICS
        derived = self._calculate_derived_metrics(payload)

        # Determine Tier
        tier = "CLEAN"
        if self.errors:
            tier = "HARD_REJECT"
        elif self.flags:
            tier = "SOFT_FLAG"

        return {
            "tier": tier,
            "errors": self.errors,
            "flags": self.flags,
            "normalized_scores": self.normalized_scores,
            "derived": derived
        }

    def _check_hard_rejects(self, payload: ApplicantPayload):
        """Implements all non-negotiable rejection criteria."""
        
        # Missing basic details (Pydantic handles some, but we check logic here)
        if not payload.full_name.strip():
            self.errors.append({"field": "full_name", "message": "Full name is required."})
        
        # Email validation
        if not self._is_valid_email(payload.email):
            self.errors.append({"field": "email", "message": "Invalid email format."})
        elif payload.email in EXISTING_EMAILS:
            self.errors.append({"field": "email", "message": "Duplicate email detected."})

        # Phone validation
        if not self._is_valid_phone(payload.phone):
            self.errors.append({"field": "phone", "message": "Phone must be 10 digits starting with 6/7/8/9."})
        elif payload.phone in EXISTING_PHONES:
            self.errors.append({"field": "phone", "message": "Duplicate phone number detected."})

        # Age check
        age = self._calculate_age(payload.date_of_birth)
        if age < 18:
            self.errors.append({"field": "date_of_birth", "message": f"Applicant must be at least 18 years old (Current: {age})."})

        # Aadhaar check
        if not (payload.aadhaar_number.isdigit() and len(payload.aadhaar_number) == 12):
            self.errors.append({"field": "aadhaar_number", "message": "Aadhaar must be exactly 12 digits."})

        # Education checks
        has_10th = any(e.level == "10th" for e in payload.education)
        if not has_10th:
            self.errors.append({"field": "education", "message": "10th standard details are mandatory."})

        current_year = datetime.now().year
        prev_year = -1
        for edu in sorted(payload.education, key=lambda x: ["10th", "12th", "Diploma", "ITI", "UG", "PG", "PhD"].index(x.level)):
            # Score logic
            if edu.score_scale == "percentage" and edu.score > 100:
                self.errors.append({"field": f"education.{edu.level}.score", "message": "Score cannot exceed 100%."})
            
            # Chronology logic
            if edu.year_of_passing > current_year:
                self.errors.append({"field": f"education.{edu.level}.year_of_passing", "message": "Year of passing cannot be in the future."})
            
            if edu.year_of_passing <= prev_year:
                self.errors.append({"field": f"education.{edu.level}.year_of_passing", "message": "Chronologically impossible: Passing year must be after previous level."})
            prev_year = edu.year_of_passing

        # Interview status
        if payload.interview_status == "Rejected":
            self.errors.append({"field": "interview_status", "message": "Applicant has been explicitly rejected in interview."})

    def _check_soft_flags(self, payload: ApplicantPayload):
        """Implements criteria that require manual review or manager approval."""
        
        # Education gap
        total_edu_gap = sum(e.gap_after_months for e in payload.education)
        if total_edu_gap > 24:
            self.flags.append({"field": "education", "reason": f"Total education gap exceeds 24 months ({total_edu_gap} months)."})

        # Backlogs
        if any(e.backlog_count > 0 for e in payload.education):
            self.flags.append({"field": "education", "reason": "Applicant has reported backlogs in their history."})

        # UG Score
        ug_score = self.normalized_scores.get("UG", 0)
        if ug_score < 60:
            self.flags.append({"field": "education.UG", "reason": f"UG score is below 60% ({ug_score:.2f}%)."})

        # Screening score
        if payload.screening_test_score is not None and payload.screening_test_score < 40:
            self.flags.append({"field": "screening_test_score", "reason": f"Screening score is below 40 ({payload.screening_test_score})."})

        # Work experience gaps
        work = sorted(payload.work_experience, key=lambda x: x.start_date)
        for i in range(len(work) - 1):
            if work[i].end_date:
                gap = (work[i+1].start_date - work[i].end_date).days // 30
                if gap > 6:
                    self.flags.append({"field": "work_experience", "reason": f"Career gap of {gap} months detected between jobs."})

        # No work experience but long time since education
        if not payload.work_experience:
            last_edu = max(payload.education, key=lambda x: x.year_of_passing)
            years_since_edu = datetime.now().year - last_edu.year_of_passing
            if years_since_edu > 3:
                self.flags.append({"field": "work_experience", "reason": f"No work experience reported despite graduating {years_since_edu} years ago."})

        # Domain switches
        if len(payload.work_experience) > 1:
            domains = [w.domain for w in payload.work_experience]
            unique_domains = len(set(domains))
            if unique_domains > 3:
                self.flags.append({"field": "work_experience", "reason": f"High frequency of domain switches ({unique_domains} unique domains)."})

    def _calculate_derived_metrics(self, payload: ApplicantPayload) -> Dict[str, Any]:
        """Calculates analytical data points for the dashboard."""
        
        # Work months
        total_months = 0
        relevant_months = 0
        for w in payload.work_experience:
            end = w.end_date or date.today()
            months = (end.year - w.start_date.year) * 12 + (end.month - w.start_date.month)
            total_months += months
            if w.domain in ["IT", "Startup"]:
                relevant_months += months

        # Career gaps
        career_gaps = []
        work = sorted(payload.work_experience, key=lambda x: x.start_date)
        for i in range(len(work) - 1):
            if work[i].end_date:
                gap = (work[i+1].start_date - work[i].end_date).days // 30
                career_gaps.append(max(0, gap))

        # Current status
        current_status = "Unemployed"
        if any(w.end_date is None for w in payload.work_experience):
            current_status = "Employed"
        # Notice period logic would require a field, defaulting to Employed/Unemployed for now

        # Experience bucket
        exp_bucket = "Fresher"
        if total_months > 60: exp_bucket = "Senior"
        elif total_months > 24: exp_bucket = "Mid"
        elif total_months > 0: exp_bucket = "Junior"

        # Completeness
        fields = [payload.full_name, payload.email, payload.phone, payload.aadhaar_number]
        filled = sum(1 for f in fields if f)
        if payload.education: filled += 1
        if payload.screening_test_score: filled += 1
        completeness = (filled / 6) * 100

        return {
            "total_work_months": total_months,
            "relevant_work_months": relevant_months,
            "career_gaps": career_gaps,
            "current_status": current_status,
            "total_education_gap_months": sum(e.gap_after_months for e in payload.education),
            "experience_bucket": exp_bucket,
            "completeness_pct": round(completeness, 2)
        }
