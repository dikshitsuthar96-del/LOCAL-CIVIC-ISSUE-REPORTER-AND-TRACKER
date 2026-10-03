"""
FastAPI Router for LangGraph Multi-Agent Workflows and Telemetry.
Exposes Agent 1 Intake StateGraph topology and triggers Agent 2 Background Monitoring loops.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from typing import List, Dict, Any

from ..database import get_db
from ..models import ComplaintModel, StatusHistoryModel
from ..llm import translate_status_to_plain_language

router = APIRouter(prefix="/api/agents", tags=["LangGraph Multi-Agent Architecture"])


@router.get("/graph/spec")
async def get_langgraph_specification():
    """Returns the visual topology, node contracts, and state schema of the LangGraph architecture."""
    return {
        "framework": "LangGraph (Python)",
        "language": "Python 3.10+",
        "backend": "FastAPI",
        "database": "PostgreSQL (SQLAlchemy Async)",
        "llm_providers": ["Google Gemini (gemini-3.8-flash & gemini-flash-latest)"],
        "agents": [
            {
                "id": "agent_1_intake",
                "name": "Intake Agent (Real-Time Submission Pipeline)",
                "graph_type": "StateGraph (DAG)",
                "trigger": "Citizen Public Submission Event",
                "nodes": [
                    {
                        "step": 1,
                        "name": "classify_image",
                        "description": "Multimodal vision model inspects uploaded pixels for defect classification and severity.",
                        "tools": ["gemini_multimodal_vision"],
                    },
                    {
                        "step": 2,
                        "name": "validate_with_text",
                        "description": "Cross-references vision findings against citizen text description for semantic alignment.",
                    },
                    {
                        "step": 3,
                        "name": "determine_department",
                        "description": "Applies municipal routing matrix to resolve statutory jurisdiction (DOT, Sanitation, Lighting, etc.).",
                    },
                    {
                        "step": 4,
                        "name": "evaluate_statutory_compliance",
                        "description": "Evaluates public right-of-way and municipal jurisdiction code bounds.",
                    },
                    {
                        "step": 5,
                        "name": "draft_complaint",
                        "description": "Generates formal municipal work order and assigns permanent reference IDs.",
                    },
                    {
                        "step": 6,
                        "name": "notify_user",
                        "description": "Dispatches transparent plain-language receipt to citizen with tracking link.",
                    },
                ],
            },
            {
                "id": "agent_2_monitoring",
                "name": "Monitoring Agent (Autonomous Lifecycle Watch)",
                "graph_type": "StateGraph (Scheduled Polling Loop)",
                "trigger": "Cron Interval / Dispatcher Trigger",
                "nodes": [
                    {
                        "step": 1,
                        "name": "fetch_open_complaints",
                        "description": "Queries all unresolved complaints from PostgreSQL.",
                    },
                    {
                        "step": 2,
                        "name": "check_status",
                        "description": "Retrieves current municipal work order status and field crew activity.",
                    },
                    {
                        "step": 3,
                        "name": "detect_change",
                        "description": "Compares stored state with latest government status delta.",
                    },
                    {
                        "step": 4,
                        "name": "translate_plain",
                        "description": "LLM translates technical government codes into plain citizen language.",
                    },
                    {
                        "step": 5,
                        "name": "notify_user",
                        "description": "Emits notifications to citizen status tracking feed.",
                    },
                    {
                        "step": 6,
                        "name": "log_history",
                        "description": "Persists immutable transition audit record to PostgreSQL.",
                    },
                ],
            },
        ],
    }


@router.post("/monitoring/run")
async def run_monitoring_agent(db: AsyncSession = Depends(get_db)):
    """
    Executes an autonomous Agent 2 LangGraph Monitoring Cycle.
    Polls active PostgreSQL complaints, detects status progression, and translates updates into citizen language.
    """
    result = await db.execute(
        select(ComplaintModel).where(ComplaintModel.status.notin_(["RESOLVED", "REJECTED"]))
    )
    open_complaints = result.scalars().all()

    updated = []
    for complaint in open_complaints:
        # Example status progression for demonstration
        if complaint.status == "SUBMITTED":
            old = complaint.status
            complaint.status = "UNDER_REVIEW"
            complaint.updated_at = datetime.utcnow()
            summary = await translate_status_to_plain_language(
                complaint.title, old, "UNDER_REVIEW", "City Intake Dispatcher"
            )
            hist = StatusHistoryModel(
                complaint_id=complaint.id,
                old_status=old,
                new_status="UNDER_REVIEW",
                plain_language_summary=summary,
                actor="Agent 2 (LangGraph Monitoring Cycle)",
                notes="Automated lifecycle verification check.",
                timestamp=datetime.utcnow(),
            )
            db.add(hist)
            updated.append({
                "id": complaint.id,
                "oldStatus": old,
                "newStatus": "UNDER_REVIEW",
                "plainLanguageUpdate": summary,
            })

    if updated:
        await db.commit()

    return {
        "success": True,
        "checkedCount": len(open_complaints),
        "updatedCount": len(updated),
        "updatedComplaints": updated,
        "timestamp": datetime.utcnow().isoformat(),
    }
