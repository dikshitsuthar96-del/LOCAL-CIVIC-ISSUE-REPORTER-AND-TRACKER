"""
FastAPI Main Application Entry Point
Metropolis Municipal Civic Issue Tracking & Governance Platform

Tech Stack:
- Language: Python 3.10+
- Backend: FastAPI (Asynchronous Web Framework)
- Agent Framework: LangGraph (Multi-Agent StateGraph Architecture)
- LLM: Google Gemini (Exclusively via GEMINI_API_KEY)
- Database: PostgreSQL (SQLAlchemy 2.0 Async + asyncpg)
- Frontend: React / Next.js
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from .database import init_db
from .routers import complaints, gov, agents


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager: initializes PostgreSQL tables and seeds data on startup."""
    print(" [FastAPI] Initializing PostgreSQL schemas and LangGraph agents...")
    try:
        await init_db()
        print(" [FastAPI] PostgreSQL database ready and seeded.")
    except Exception as e:
        print(f" [FastAPI Warning] Database initialization warning: {e}")
    yield
    print(" [FastAPI] Shutting down application gracefully...")


app = FastAPI(
    title="Metropolis Civic Issue Tracker & Gov Dispatch API",
    description=(
        "Production-grade municipal issue management platform powered by "
        "Python FastAPI, LangGraph multi-agent orchestration, Google Gemini multimodal AI, "
        "and PostgreSQL."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

# Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(complaints.router)
app.include_router(gov.router)
app.include_router(agents.router)


@app.get("/health", tags=["Health & Diagnostics"])
async def health_check():
    """System health check and tech stack manifest."""
    return {
        "status": "HEALTHY",
        "service": "Metropolis Municipal Backend",
        "tech_stack": {
            "language": "Python 3.10+",
            "backend_framework": "FastAPI",
            "agent_framework": "LangGraph (StateGraph)",
            "llm_engine": "Google Gemini (gemini-3.8-flash & gemini-flash-latest)",
            "database": "PostgreSQL (SQLAlchemy 2.0 Async)",
            "frontend": "React / Next.js",
        },
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)
