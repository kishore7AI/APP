# NxtLearnn — Modern Solo-Creator Course Platform

A complete, production-grade course platform built with:

- **Frontend**: React + Vite (JavaScript), Tailwind CSS, Lucide React, React Router v6
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2.0 (Async), asyncpg, Uvicorn
- **Database**: Neon (PostgreSQL)
- **Authentication**: JWT & Google OAuth2 with Role-Based Access Control (`student` vs `admin`)
- **Video Delivery**: ImageKit (HLS adaptive streaming with time-limited signed authorization)
- **Monetization**: Polar checkout & HMAC-verified idempotent webhooks (Single Course, Monthly, Lifetime)

## Directory Structure
- `frontend/` - React Single Page Application (SPA)
- `backend/` - FastAPI async REST API server
