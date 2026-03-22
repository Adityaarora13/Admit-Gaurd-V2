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
