# AdmitGuard v2

Enterprise admission validation platform for IIT Gandhinagar's PG Diploma in AI-ML program.

## Project Structure

- `/frontend`: React + Vite application
- `/backend`: Python FastAPI application

## Setup Instructions

### Backend Setup
1. Navigate to `/backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/macOS: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Configure `.env` based on `.env.example`
6. Run the server: `uvicorn main:app --reload`

### Frontend Setup
1. Navigate to `/frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Features
- Automated admission validation based on rules.
- Integration with Google Sheets via webhooks.
- AI-powered intelligence for screening.
