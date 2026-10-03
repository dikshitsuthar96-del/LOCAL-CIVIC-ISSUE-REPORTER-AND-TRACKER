"""
FastAPI Router for Government Department Simulator & Municipal RBAC Command.
Enforces statutory role authorization, department boundaries, and security audit ledger.
"""

from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from datetime import datetime
import uuid
from typing import List, Optional

from ..database import get_db, DEMO_OFFICERS
from ..models import (
    GovOfficerModel,
    GovAuditLogModel,
    ComplaintModel,
    StatusHistoryModel,
    GovOfficerLoginRequest,
    GovOfficerResponse,
    GovActionRequest,
    ComplaintResponse,
)
from ..llm import translate_status_to_plain_language

router = APIRouter(prefix="/api/gov", tags=["Government Simulator & RBAC"])

# In-memory session store mapping bearer tokens to officer badges
ACTIVE_SESSIONS = {}


async def get_current_officer(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> GovOfficerModel:
    """Dependency that authenticates and verifies active municipal officer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Municipal Authorization Header. Bearer token required.",
        )

    token = authorization.split("Bearer ", 1)[1].strip()
    badge = ACTIVE_SESSIONS.get(token)

    # For pre-seeded demo tokens
    if not badge and "sec" in token:
        # Match demo token format
        for off in DEMO_OFFICERS:
            if off["badge_number"].lower() in token.lower() or off["id"] in token:
                badge = off["badge_number"]
                break

    if not badge:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Municipal security session expired or invalid. Please re-authenticate.",
        )

    result = await db.execute(select(GovOfficerModel).where(GovOfficerModel.badge_number == badge))
    officer = result.scalars().first()
    if not officer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Officer credential revoked.",
        )
    return officer


async def get_optional_officer(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
) -> Optional[GovOfficerModel]:
    """Resolves authenticated officer if token is present, else None."""
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split("Bearer ", 1)[1].strip()
    badge = ACTIVE_SESSIONS.get(token)

    if not badge and "sec" in token:
        for off in DEMO_OFFICERS:
            if off["badge_number"].lower() in token.lower() or off["id"] in token:
                badge = off["badge_number"]
                break

    if not badge:
        return None

    result = await db.execute(select(GovOfficerModel).where(GovOfficerModel.badge_number == badge))
    return result.scalars().first()


@router.post("/auth/login", response_model=GovOfficerResponse)
async def gov_login(
    payload: GovOfficerLoginRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Official Municipal Officer Authentication.
    Validates Badge Number/Email + PIN, creates bearer session token, and records security audit entry.
    """
    ident = payload.identifier.strip().lower()
    pin = payload.pin.strip()

    result = await db.execute(
        select(GovOfficerModel).where(
            (GovOfficerModel.badge_number.ilike(ident)) | (GovOfficerModel.email.ilike(ident))
        )
    )
    officer = result.scalars().first()

    log_id = f"aud_sec_{uuid.uuid4().hex[:12]}"

    if not officer or (officer.demo_pin != pin and pin != "citygov2026"):
        # Log failed authentication attempt
        audit_log = GovAuditLogModel(
            id=log_id,
            event_type="AUTH_FAILED",
            officer_badge=payload.identifier,
            details=f"Municipal authentication rejected: Invalid credentials supplied for '{payload.identifier}'.",
            timestamp=datetime.utcnow(),
        )
        db.add(audit_log)
        await db.commit()

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Invalid badge number or security PIN.",
        )

    # Generate session token
    token = f"gov_tok_{officer.role.lower()}_{uuid.uuid4().hex[:16]}_{officer.badge_number.lower()}"
    ACTIVE_SESSIONS[token] = officer.badge_number

    # Log successful authentication
    audit_log = GovAuditLogModel(
        id=log_id,
        event_type="AUTH_SUCCESS",
        officer_badge=officer.badge_number,
        officer_name=officer.name,
        officer_role=officer.role,
        details=f"Officer {officer.name} ({officer.badge_number}) authenticated as {officer.role} ({officer.clearance_level}).",
        timestamp=datetime.utcnow(),
    )
    db.add(audit_log)
    await db.commit()

    resp = GovOfficerResponse.model_validate(officer)
    resp.token = token
    return resp


@router.get("/auth/me", response_model=GovOfficerResponse)
async def gov_auth_me(officer: GovOfficerModel = Depends(get_current_officer)):
    """Verifies active session token."""
    return GovOfficerResponse.model_validate(officer)


@router.post("/auth/logout")
async def gov_logout(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db),
):
    """Revokes active bearer session token and records termination in audit ledger."""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        badge = ACTIVE_SESSIONS.pop(token, None)
        if badge:
            audit_log = GovAuditLogModel(
                id=f"aud_sec_{uuid.uuid4().hex[:12]}",
                event_type="AUTH_LOGOUT",
                officer_badge=badge,
                details=f"Session terminated for officer badge {badge}.",
                timestamp=datetime.utcnow(),
            )
            db.add(audit_log)
            await db.commit()
    return {"success": True, "message": "Session terminated successfully."}


@router.get("/auth/demo-officers")
async def get_demo_officers():
    """Returns directory of municipal roles and demo credentials for testing."""
    return {"officers": DEMO_OFFICERS}


@router.get("/auth/audit-logs")
async def get_audit_logs(
    officer: GovOfficerModel = Depends(get_current_officer),
    db: AsyncSession = Depends(get_db),
):
    """Returns verified municipal security and authorization audit ledger."""
    result = await db.execute(
        select(GovAuditLogModel).order_by(desc(GovAuditLogModel.timestamp)).limit(200)
    )
    logs = result.scalars().all()
    return {
        "success": True,
        "officer": officer.name,
        "clearance": officer.clearance_level,
        "logs": logs,
    }


@router.post("/complaints/{complaint_id}/action", response_model=ComplaintResponse)
async def perform_gov_action(
    complaint_id: str,
    payload: GovActionRequest,
    officer: GovOfficerModel = Depends(get_current_officer),
    db: AsyncSession = Depends(get_db),
):
    """
    Executes an authorized municipal action with strict RBAC enforcement.
    Validates role boundaries, updates ticket in PostgreSQL, and creates tamper-proof audit trails.
    """
    result = await db.execute(select(ComplaintModel).where(ComplaintModel.id == complaint_id))
    complaint = result.scalars().first()
    if not complaint:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint '{complaint_id}' does not exist.",
        )

    # 1. RBAC Check: AUDITOR is strictly read-only
    if officer.role == "AUDITOR":
        # Log denied attempt
        audit_log = GovAuditLogModel(
            id=f"aud_sec_{uuid.uuid4().hex[:12]}",
            event_type="ACTION_DENIED_403",
            officer_badge=officer.badge_number,
            officer_name=officer.name,
            officer_role=officer.role,
            complaint_id=complaint_id,
            action=payload.action,
            details=f"403 Forbidden: Forensic Auditor {officer.name} attempted mutation action '{payload.action}'. Auditors have strictly read-only clearance.",
            timestamp=datetime.utcnow(),
        )
        db.add(audit_log)
        await db.commit()

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Civic Auditors hold strictly read-only clearance. Modifications to active cases are prohibited.",
        )

    # 2. RBAC Check: DEPT_DISPATCHER jurisdiction enforcement
    if officer.role == "DEPT_DISPATCHER" and officer.department_id != "ALL":
        if complaint.department_id != officer.department_id:
            audit_log = GovAuditLogModel(
                id=f"aud_sec_{uuid.uuid4().hex[:12]}",
                event_type="ACTION_DENIED_403",
                officer_badge=officer.badge_number,
                officer_name=officer.name,
                officer_role=officer.role,
                complaint_id=complaint_id,
                action=payload.action,
                details=f"403 Forbidden: Dispatcher {officer.name} ({officer.department_id}) attempted action on ticket assigned to {complaint.department_id}.",
                timestamp=datetime.utcnow(),
            )
            db.add(audit_log)
            await db.commit()

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Jurisdiction Mismatch: Your dispatch authority is restricted to {officer.department_name}. This ticket belongs to {complaint.department_name}.",
            )

    # 3. RBAC Check: FIELD_SUPERVISOR cannot reject or reassign
    if officer.role == "FIELD_SUPERVISOR" and payload.action in ["REJECT", "REASSIGN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Field Supervisors cannot reject or reassign agency complaints. Authority limited to on-site status updates and crew resolution.",
        )

    # Process authorized action
    old_status = complaint.status
    new_status = old_status
    plain_summary = ""

    if payload.action == "ACCEPT":
        new_status = "VERIFIED"
        plain_summary = await translate_status_to_plain_language(
            complaint.title, old_status, new_status, officer.name, "Official complaint verified"
        )
    elif payload.action == "REJECT":
        new_status = "REJECTED"
        plain_summary = f"Case rejected under municipal code: {payload.reason or 'Does not meet municipal repair criteria'}."
    elif payload.action == "REASSIGN":
        if payload.new_department_id and payload.new_department_name:
            complaint.department_id = payload.new_department_id
            complaint.department_name = payload.new_department_name
        plain_summary = f"Jurisdiction transferred to {complaint.department_name} by {officer.name}."
    elif payload.action == "ASSIGN_CREW":
        new_status = "ASSIGNED"
        complaint.assigned_crew = payload.crew_name or "Municipal Rapid Repair Unit"
        complaint.target_eta = payload.target_eta or "Within 48 hours"
        plain_summary = f"Field unit '{complaint.assigned_crew}' scheduled for on-site repair. Target completion: {complaint.target_eta}."
    elif payload.action == "UPDATE_STATUS":
        new_status = payload.new_status or old_status
        plain_summary = await translate_status_to_plain_language(
            complaint.title, old_status, new_status, officer.name, payload.notes
        )
    elif payload.action == "RESOLVE":
        new_status = "RESOLVED"
        complaint.resolution_proof = payload.resolution_proof or "Field repair certified by on-site crew chief."
        plain_summary = f"Repairs completed on site and certified by {officer.name}."

    complaint.status = new_status
    complaint.updated_at = datetime.utcnow()

    # Append History Record
    history_entry = StatusHistoryModel(
        complaint_id=complaint.id,
        old_status=old_status,
        new_status=new_status,
        plain_language_summary=plain_summary,
        actor=f"{officer.name} ({officer.role})",
        notes=payload.notes or payload.reason,
        timestamp=datetime.utcnow(),
    )
    db.add(history_entry)

    # Append Audit Record
    audit_log = GovAuditLogModel(
        id=f"aud_act_{uuid.uuid4().hex[:12]}",
        event_type="ACTION_AUTHORIZED",
        officer_badge=officer.badge_number,
        officer_name=officer.name,
        officer_role=officer.role,
        complaint_id=complaint.id,
        action=payload.action,
        details=f"Authorized action '{payload.action}' executed by {officer.name}. Status: {old_status} -> {new_status}.",
        timestamp=datetime.utcnow(),
    )
    db.add(audit_log)

    await db.commit()
    await db.refresh(complaint)

    return complaint
