# Alpaca Health Platform - Client Schedule Optimizer

Full-stack application for optimizing clinician-client schedule matching based on availability and location.

## Tech Stack

- Frontend: Next.js 14, TypeScript, Tailwind CSS
- Backend: FastAPI 0.115.12 (Python 3.11)
- DB: In-memory for POC

## Key Features

- Address-based clinician lookup
- Schedule optimization for maximum hours
- Travel time optimization
- Top 10 schedule options display
- Detailed daily schedule view

## Quick Start

Backend:
```bash
# Requires Python 3.11+
pip install "fastapi==0.115.12" "uvicorn[standard]"
uvicorn main:app --reload --port 8000
```

Frontend:
```bash
npm install
npm run dev
```

## Design Highlights

- RESTful API with CORS support
- React state management (no external state library)
- Progressive UI disclosure
- Native emoji icons for minimal dependencies

## Assumptions

- Monday-Friday scheduling
- Pre-calculated drive times
- Valid addresses in system
- Maximum clients per day limit

## Future Improvements

1. Unit testing
2. Address lookup caching
3. Enhanced error handling
4. Loading animations
5. Schedule pagination

