from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional, Literal, Dict
from datetime import date

class EducationEntry(BaseModel):
    """Represents a single education milestone."""
    level: Literal["10th", "12th", "Diploma", "ITI", "UG", "PG", "PhD"]
    board_or_university: str
    stream_specialization: Optional[str] = None
    year_of_passing: int
    score: float
    score_scale: Literal["percentage", "cgpa_10", "cgpa_4", "grade"]
    backlog_count: int = 0
    gap_after_months: int = 0

    @validator("backlog_count", always=True)
    def reset_backlog_for_schooling(cls, v, values):
        """Ensure backlog is zero for 10th and 12th as per rules."""
        if "level" in values and values["level"] in ["10th", "12th"]:
            return 0
        return v

class WorkEntry(BaseModel):
    """Represents a single professional experience."""
    company_name: str
    designation: str
    domain: Literal["IT", "Non-IT", "Government", "Startup", "Freelance", "Other"]
    start_date: date
    end_date: Optional[date] = None  # None indicates 'Present'
    employment_type: Literal["Full-time", "Part-time", "Internship", "Contract", "Freelance"]
    key_skills: List[str]

class ApplicantPayload(BaseModel):
    """Full form submission payload for an applicant."""
    full_name: str
    email: str
    phone: str
    date_of_birth: date
    education: List[EducationEntry] = Field(..., min_items=1)
    work_experience: List[WorkEntry] = []
    screening_test_score: Optional[float] = None
    interview_status: Optional[str] = None
    aadhaar_number: str
    exceptions: Dict[str, str] = {}  # field_name -> rationale text
