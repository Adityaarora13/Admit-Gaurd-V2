# AdmitGuard v2

**Enterprise Admission Validation Platform**  
PG Diploma in AI-ML & Agentic AI Engineering — IIT Gandhinagar  
Built by: Aditya Arora

---

## What Is This?

AdmitGuard v2 is a full-stack admission data validation platform that replaces manual Excel-based candidate tracking. It enforces eligibility rules at the point of data entry, scores candidates automatically using a risk engine, and writes every validated application to a live Google Sheet in real time.

**The problem it solves:** Ineligible candidates were reaching the interview stage because no validation happened at data entry. Rejections at the document verification stage wasted counselor time, damaged candidate experience, and created compliance risk with IIT.

---

## Live Demo

| Layer | URL |
|-------|-----|
| Frontend (Vercel) | `https://admit-gaurd-v2.vercel.app` |
| Backend API (Render) | `https://admitguard-v2-api.onrender.com` |
| Google Sheet (Live Data) | *(share link here)* |

> Backend is on Render free tier — first request after 15 min idle takes ~30 seconds to wake up.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  AdmitGuard v2                       │
│                                                     │
│  React Frontend  →  FastAPI Backend  →  Google      │
│  (Vercel)            (Render)           Sheets      │
│       │                  │                          │
│       │            Validation Engine                │
│       │            Intelligence Layer               │
│       │            Gemini AI (suggestions)          │
└─────────────────────────────────────────────────────┘
```

**Stack:**
- Frontend: React + Vite + TailwindCSS
- Backend: Python + FastAPI + Pydantic
- Storage: Google Sheets via Apps Script webhook
- AI: Google Gemini API (smart field suggestions)
- Hosting: Vercel (frontend) + Render (backend)

---

## Features

### Multi-Step Form
5-step guided form with real-time validation at every field.

### Indian Education Path Detection
Automatically detects which education path the candidate followed:
- **Path A (Standard):** 10th → 12th → UG
- **Path B (Diploma):** 10th → Diploma → UG (lateral)
- **Path C (Lateral/ITI):** 10th → ITI → Diploma → UG

### Work Experience Module
Captures full employment history with auto-calculated:
- Total experience (months)
- Domain-relevant experience
- Career gaps between jobs
- Current employment status

### 3-Tier Validation Engine (Server-Side)

| Tier | Behavior | Examples |
|------|----------|---------|
| **Hard Reject** | Submission blocked, data not saved | Duplicate email, age < 18, Aadhaar invalid, interview Rejected |
| **Soft Flag** | Saved but flagged for manual review | Education gap > 24 months, backlogs, low score |
| **Enrichment** | Auto-computed metadata attached | Risk score, experience bucket, completeness % |

### Intelligence Layer
- **Risk Score (0–100):** Weighted penalty system across 12 factors
- **Auto-Categorization:** Strong Fit / Needs Review / Weak Fit / Anomaly
- **Anomaly Detection:** Flags unusual patterns (PhD for entry-level, 5+ career switches, etc.)
- **Gemini Smart Assist:** AI-powered suggestions for university names and skills

### Reporting
- Every submission auto-writes to Google Sheets (live, real-time)
- Dashboard with submission stats, risk distribution, trend charts
- Audit log with search, filter, sort, and CSV export

---

## Project Structure

```
admitguard-v2/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # StepIndicator, SuccessScreen, etc.
│   │   ├── pages/             # Step1 through Step5, Dashboard, AuditLog
│   │   ├── config/            # formConfig.js (rules, constants)
│   │   └── utils/             # localStore.js
│   ├── vercel.json
│   └── package.json
│
├── backend/                   # FastAPI app
│   ├── main.py                # App entry point + CORS
│   ├── routers/
│   │   └── validate.py        # API routes
│   ├── models/
│   │   └── applicant.py       # Pydantic models
│   ├── services/
│   │   ├── validation_engine.py
│   │   ├── intelligence.py
│   │   └── sheets.py
│   ├── config/
│   │   └── rules.json         # All eligibility rules (edit here to update rules)
│   ├── docs/
│   │   └── apps_script.js     # Google Apps Script webhook code
│   ├── requirements.txt
│   └── .env.example
│
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Google account (for Sheets integration)
- Gemini API key (free at aistudio.google.com)

### 1. Clone the Repo

```bash
git clone https://github.com/Adityaarora13/Admit-Gaurd-V2.git
cd Admit-Gaurd-V2/admitguard-v2
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy and fill environment variables:
```bash
cp .env.example .env
```

Edit `.env`:
```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ID/exec
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env.local`:
```
VITE_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Google Sheets Setup

This step connects your app to a live Google Sheet.

**1.** Create a new Google Sheet at sheets.google.com

**2.** Go to **Extensions → Apps Script**

**3.** Delete any existing code. Paste the entire contents of `backend/docs/apps_script.js`

**4.** Save the project (Ctrl+S)

**5.** In the function dropdown at the top, select **`setupHeaders`** → click **Run**
   - Authorize when prompted (Advanced → Go to project → Allow)
   - This writes all column headers to Row 1 of your sheet

**6.** Click **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**

**7.** Copy the Web App URL (looks like `https://script.google.com/macros/s/AKfycb.../exec`)

**8.** Paste it as `GOOGLE_SHEETS_WEBHOOK_URL` in your `.env` file

---

## Deployment

### Deploy Backend → Render

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Configure:
   ```
   Root Directory:  admitguard-v2/backend
   Runtime:         Python 3
   Build Command:   pip install -r requirements.txt
   Start Command:   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
4. Add environment variables:
   ```
   GOOGLE_SHEETS_WEBHOOK_URL = (your Apps Script URL)
   GEMINI_API_KEY            = (your Gemini key)
   FRONTEND_URL              = (your Vercel URL — add after frontend deploy)
   ```
5. Click **Create Web Service**

### Deploy Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Configure:
   ```
   Root Directory:   admitguard-v2/frontend
   Framework:        Vite
   Build Command:    npm run build
   Output Directory: dist
   ```
3. Add environment variable:
   ```
   VITE_API_URL = https://your-render-url.onrender.com
   ```
4. Click **Deploy**

---

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `GOOGLE_SHEETS_WEBHOOK_URL` | Backend | Apps Script web app URL |
| `GEMINI_API_KEY` | Backend | Google Gemini API key (free tier) |
| `FRONTEND_URL` | Backend | Vercel URL (for CORS) |
| `VITE_API_URL` | Frontend | Render backend URL |

> Never commit `.env` files. They are in `.gitignore` by default.

---

## Updating Eligibility Rules

All rules live in one file: `backend/config/rules.json`

To change a rule (e.g., raise minimum UG score from 60% to 65%):
```json
"education_rules": {
  "min_ug_percentage": 65.0
}
```

Save the file → push to GitHub → Render auto-redeploys. No code changes needed.

---

## API Reference

### `POST /api/validate`
Submit a candidate application for validation.

**Request body:** Full applicant JSON payload  
**Response (Clean/Flagged):**
```json
{
  "status": "success",
  "tier": "SOFT_FLAG",
  "risk_score": 72,
  "category": { "category": "Needs Review", "reason": "..." },
  "flags": [...],
  "anomalies": [...],
  "derived": { "total_work_months": 24, ... },
  "sheets_saved": true
}
```
**Response (Hard Reject):** `422` with field-level error list

### `GET /api/suggest?field=<name>&value=<value>`
Get Gemini AI suggestion for a form field.

### `POST /api/check-duplicate`
Check if email or phone already exists.
```json
{ "email": "user@example.com", "phone": "9876543210" }
```

### `GET /api/health`
```json
{ "status": "ok", "version": "2.0" }
```

---

## Validation Rules Reference

| # | Field | Rule | Type | Exception? |
|---|-------|------|------|-----------|
| 1 | Full Name | Min 2 chars, no numbers | Strict | No |
| 2 | Email | Valid format, unique | Strict | No |
| 3 | Phone | 10-digit, starts with 6/7/8/9 | Strict | No |
| 4 | Date of Birth | Age 18–35 on program start | Soft | Yes |
| 5 | 10th Education | Mandatory for all paths | Strict | No |
| 6 | UG Score | ≥ 60% after normalization | Soft | Yes |
| 7 | Education Gap | ≤ 24 months total | Soft | Yes |
| 8 | Backlogs | Any backlog flagged | Soft | Yes |
| 9 | Screening Score | ≥ 40 out of 100 | Soft | Yes |
| 10 | Interview Status | Cleared/Waitlisted/Rejected | Strict | No |
| 11 | Aadhaar | Exactly 12 digits | Strict | No |
| 12 | Career Gap | ≤ 6 months between jobs | Soft | Yes |

---

## Known Limitations (Prototype)

- Duplicate detection uses in-memory store — resets on backend restart. Replace with a database for production.
- Render free tier sleeps after 15 minutes of inactivity (first request takes ~30s).
- Gemini suggestions are best-effort — silently skipped if API is unavailable.

---

## Built With

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Google Gemini API](https://aistudio.google.com/)
- [Google Apps Script](https://script.google.com/)

---

## License

Built for IIT Gandhinagar PG Diploma in AI-ML — Week 1 Sprint Project.  
© 2025 Futurense Technologies / AdmitGuard Team.
