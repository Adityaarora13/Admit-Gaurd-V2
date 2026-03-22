export const ADMISSION_RULES = {
  program: "PG Diploma in AI-ML & Agentic AI Engineering",
  institution: "IIT Gandhinagar",
  program_start_date: "2025-09-01",
  age_rules: { min: 18, max: 35 },
  education_rules: {
    mandatory_levels: ["10th"],
    path_a_mandatory: ["10th", "12th", "UG"],
    path_b_mandatory: ["10th", "Diploma", "UG"],
    min_ug_percentage: 60.0,
    min_ug_cgpa_10: 6.0,
    max_education_gap_months: 24,
    graduation_year_range: { min: 2015, max: 2025 }
  },
  work_rules: {
    max_career_gap_months: 6,
    flag_if_no_experience_years_since_education: 3,
    max_unrelated_domain_switches: 3
  },
  screening: {
    min_test_score: 40,
    max_test_score: 100
  },
  soft_rule_exception: {
    max_exceptions_before_manager_review: 2,
    required_keywords: ["approved by", "special case", "documentation pending", "waiver granted"],
    min_rationale_length: 30
  },
  valid_qualifications: ["B.Tech", "B.E.", "B.Sc", "BCA", "M.Tech", "M.Sc", "MCA", "MBA"],
  valid_interview_statuses: ["Cleared", "Waitlisted", "Rejected"]
};

export const INDIAN_BOARDS = [
  "CBSE",
  "ICSE",
  "NIOS",
  "Andhra Pradesh State Board",
  "Bihar School Examination Board",
  "Gujarat Secondary and Higher Secondary Education Board",
  "Haryana Board of School Education",
  "Karnataka Secondary Education Examination Board",
  "Kerala Board of Public Examinations",
  "Maharashtra State Board of Secondary and Higher Secondary Education",
  "Punjab School Education Board",
  "Rajasthan Board of Secondary Education",
  "Tamil Nadu State Board",
  "Telangana State Board",
  "Uttar Pradesh Board of High School and Intermediate Education",
  "West Bengal Board of Secondary Education"
];

export const KNOWN_UNIVERSITIES = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur", "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad", "IIT Gandhinagar", "IIT Indore",
  "NIT Trichy", "NIT Karnataka", "NIT Rourkela", "NIT Warangal", "NIT Calicut", "NIT Nagpur", "NIT Kurukshetra", "NIT Silchar", "NIT Durgapur", "NIT Jamshedpur",
  "BITS Pilani", "VIT Vellore", "SRM Institute of Science and Technology", "Manipal Institute of Technology", "Amrita Vishwa Vidyapeetham", "Anna University", "Jadavpur University", "Delhi Technological University", "COEP Pune", "VJTI Mumbai"
];

export const EDUCATION_LEVELS = ["10th", "12th", "Diploma", "ITI", "UG", "PG", "PhD"];

export const DOMAIN_OPTIONS = [
  "Software Engineering", "Data Science", "Artificial Intelligence", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Business Management", "Finance", "Healthcare", "Education", "Other"
];

export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Internship", "Freelance"];

export const SCORE_SCALES = [
  { label: "Percentage (%)", value: "PERCENTAGE", multiplier: 1 },
  { label: "CGPA (Scale of 10)", value: "CGPA_10", multiplier: 9.5 },
  { label: "CGPA (Scale of 4)", value: "CGPA_4", multiplier: 25 }
];

export const STEP_RULES = {
  0: [
    "Applicant must be between 18 and 35 years old.",
    "Full name must match Aadhaar records.",
    "Valid email and phone are required for verification."
  ],
  1: [
    "Minimum 60% or 6.0 CGPA required in Undergraduate degree.",
    "Mandatory levels: 10th, 12th/Diploma, and UG.",
    "Maximum allowed education gap is 24 months.",
    "Graduation year must be between 2015 and 2025."
  ],
  2: [
    "Maximum allowed career gap between jobs is 6 months.",
    "Gaps since graduation > 3 years without experience will be flagged.",
    "More than 3 unrelated domain switches may require review."
  ],
  3: [
    "Aadhaar number is mandatory for identity verification.",
    "Minimum screening test score of 40/100 is required.",
    "Interview status 'Rejected' will lead to immediate application closure."
  ],
  4: [
    "Review all details carefully before final submission.",
    "Soft-rule exceptions require a valid rationale (>30 characters).",
    "Max 2 exceptions allowed before mandatory manager review."
  ]
};
