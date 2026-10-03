"""
FastAPI Router for Citizen Public Portal and Issue Intake.
Executes LangGraph Intake Pipeline, PostgreSQL transactions, and status lookups.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, desc
from datetime import datetime
from typing import List, Optional

from ..database import get_db
from ..models import (
    ComplaintModel,
    StatusHistoryModel,
    ComplaintCreate,
    ComplaintResponse,
    VisionAnalyzeRequest,
    VisionAnalyzeResponse,
    GovOfficerModel,
)
from ..graph import intake_agent_graph, CivicIntakeState
from ..llm import analyze_image_with_vision
from .gov import get_optional_officer

router = APIRouter(prefix="/api", tags=["Civic Issues & Public Portal"])


@router.post("/analyze-image", response_model=VisionAnalyzeResponse)
async def analyze_image_endpoint(payload: VisionAnalyzeRequest):
    """
    Multimodal Vision Inspection Endpoint.
    Uses Google Gemini (GEMINI_API_KEY) to extract defect findings, department, and hazards from photo.
    """
    if not payload.image_base64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image base64 payload is required for visual inspection.",
        )

    try:
        findings = await analyze_image_with_vision(
            payload.image_base64,
            mime_type=payload.mime_type or "image/jpeg",
        )
        return VisionAnalyzeResponse(**findings)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Vision inspection failed: {str(e)}",
        )


@router.post("/complaints/submit", response_model=ComplaintResponse, status_code=status.HTTP_201_CREATED)
async def submit_complaint(
    payload: ComplaintCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Submits a civic issue report.
    Executes the 6-node LangGraph StateGraph pipeline, commits to PostgreSQL, and generates official IDs.
    """
    # Initialize LangGraph State
    initial_state: CivicIntakeState = {
        "citizen_description": payload.description,
        "location": payload.location,
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        "image_base64": payload.image_url,
        "category_hint": payload.category,
        "execution_trace": [],
    }

    # Execute LangGraph Pipeline
    graph_output = await intake_agent_graph.ainvoke(initial_state)

    complaint_id = graph_output.get("official_complaint_id")
    work_order_id = graph_output.get("work_order_id")
    title = graph_output.get("standardized_title", payload.title)
    dept_id = graph_output.get("department_id", payload.department_id or "DOT")
    dept_name = graph_output.get("department_name", payload.department_name or "Department of Transportation (DOT)")
    severity = graph_output.get("severity", payload.severity or "MEDIUM")
    urgency_rating = graph_output.get("urgency_rating", 3)

    # Persist to PostgreSQL via SQLAlchemy
    new_complaint = ComplaintModel(
        id=complaint_id,
        work_order_id=work_order_id,
        category=payload.category,
        title=title,
        description=payload.description,
        image_url=payload.image_url,
        location=payload.location,
        latitude=payload.latitude,
        longitude=payload.longitude,
        department_id=dept_id,
        department_name=dept_name,
        severity=severity,
        urgency_rating=urgency_rating,
        status="SUBMITTED",
        statutory_compliance_verified=graph_output.get("statutory_compliance_verified", True),
        confidence_score=graph_output.get("vision_findings", {}).get("confidence", 0.94),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )

    initial_history = StatusHistoryModel(
        complaint_id=complaint_id,
        old_status="NONE",
        new_status="SUBMITTED",
        plain_language_summary=graph_output.get(
            "citizen_plain_language_receipt",
            "Report successfully received and assigned to city dispatch queue.",
        ),
        actor="Intake Agent (LangGraph Agent 1)",
        notes="Automated multimodal classification & department routing completed.",
        timestamp=datetime.utcnow(),
    )

    db.add(new_complaint)
    db.add(initial_history)
    await db.commit()
    await db.refresh(new_complaint)

    # Query loaded entity with relations
    result = await db.execute(
        select(ComplaintModel).where(ComplaintModel.id == complaint_id)
    )
    saved = result.scalars().first()
    return saved


@router.get("/complaints", response_model=List[ComplaintResponse])
async def list_complaints(
    status_filter: Optional[str] = None,
    department_id: Optional[str] = None,
    search: Optional[str] = None,
    officer: Optional[GovOfficerModel] = Depends(get_optional_officer),
    db: AsyncSession = Depends(get_db),
):
    """Lists complaints from PostgreSQL with optional multi-criteria filters and strict departmental isolation."""
    query = select(ComplaintModel).order_by(desc(ComplaintModel.created_at))

    # Department Isolation for Dispatchers (e.g. Garbage / Sanitation)
    if officer and officer.role == "DEPT_DISPATCHER" and officer.department_id != "ALL":
        if department_id and department_id != "ALL" and department_id != officer.department_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Departmental Isolation Enforced: Officer {officer.name} ({officer.badge_number}) is assigned to {officer.department_name}. Access to other municipal agencies is prohibited by municipal charter.",
            )
        # Always enforce query restriction to officer's assigned department
        query = query.where(ComplaintModel.department_id == officer.department_id)
    elif department_id and department_id != "ALL":
        query = query.where(ComplaintModel.department_id == department_id)

    if status_filter and status_filter != "ALL":
        query = query.where(ComplaintModel.status == status_filter)
    if search:
        s = f"%{search.lower()}%"
        query = query.where(
            or_(
                ComplaintModel.id.ilike(s),
                ComplaintModel.work_order_id.ilike(s),
                ComplaintModel.title.ilike(s),
                ComplaintModel.location.ilike(s),
                ComplaintModel.description.ilike(s),
            )
        )

    result = await db.execute(query)
    return result.scalars().all()


@router.get("/complaints/{identifier}", response_model=ComplaintResponse)
async def get_complaint(
    identifier: str,
    officer: Optional[GovOfficerModel] = Depends(get_optional_officer),
    db: AsyncSession = Depends(get_db),
):
    """
    Fetches a complaint by either Complaint ID (CIVIC-2026-XXXX) or Work Order ID (WO-XXXX).
    Enforces strict departmental boundaries for municipal dispatchers.
    """
    clean_id = identifier.strip().upper()
    result = await db.execute(
        select(ComplaintModel).where(
            or_(
                ComplaintModel.id == clean_id,
                ComplaintModel.work_order_id == clean_id,
            )
        )
    )
    complaint = result.scalars().first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Municipal complaint '{identifier}' not found in registry.",
        )

    # Department Isolation verification for municipal dispatchers
    if officer and officer.role == "DEPT_DISPATCHER" and officer.department_id != "ALL":
        if complaint.department_id != officer.department_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access Denied (403 Forbidden): Officer {officer.name} ({officer.badge_number}) is assigned to {officer.department_name}. You cannot access work orders belonging to other municipal departments.",
            )

    return complaint
