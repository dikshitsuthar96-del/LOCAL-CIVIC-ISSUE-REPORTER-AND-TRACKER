"""
PostgreSQL SQLAlchemy 2.0 Models and Pydantic v2 Schemas
for the Metropolis Municipal Civic Issue Tracking & Gov Dispatch Platform.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from sqlalchemy import (
    Column,
    String,
    Text,
    Float,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import declarative_base, relationship
from pydantic import BaseModel, Field, ConfigDict

Base = declarative_base()


# ============================================================================
# PostgreSQL SQLAlchemy 2.0 ORM Models
# ============================================================================

class ComplaintModel(Base):
    __tablename__ = "complaints"

    id = Column(String(64), primary_key=True, index=True)
    work_order_id = Column(String(64), unique=True, index=True, nullable=False)
    category = Column(String(64), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    department_id = Column(String(64), nullable=False, index=True)
    department_name = Column(String(128), nullable=False)
    severity = Column(String(32), nullable=False, default="MEDIUM", index=True)
    urgency_rating = Column(Integer, default=3)
    status = Column(String(32), nullable=False, default="SUBMITTED", index=True)
    assigned_crew = Column(String(128), nullable=True)
    target_eta = Column(String(64), nullable=True)
    resolution_proof = Column(Text, nullable=True)
    statutory_compliance_verified = Column(Boolean, default=True)
    confidence_score = Column(Float, default=0.92)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    history_entries = relationship(
        "StatusHistoryModel",
        back_populates="complaint",
        cascade="all, delete-orphan",
        order_by="StatusHistoryModel.timestamp.desc()",
    )


class StatusHistoryModel(Base):
    __tablename__ = "complaint_status_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    complaint_id = Column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), nullable=False, index=True)
    old_status = Column(String(32), nullable=False)
    new_status = Column(String(32), nullable=False)
    plain_language_summary = Column(Text, nullable=False)
    actor = Column(String(128), nullable=False)
    notes = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    complaint = relationship("ComplaintModel", back_populates="history_entries")


class GovOfficerModel(Base):
    __tablename__ = "gov_officers"

    id = Column(String(64), primary_key=True)
    badge_number = Column(String(32), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    title = Column(String(128), nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=False)
    role = Column(String(32), nullable=False, index=True)  # CITY_ADMIN, DEPT_DISPATCHER, FIELD_SUPERVISOR, AUDITOR
    department_id = Column(String(64), nullable=False)
    department_name = Column(String(128), nullable=False)
    clearance_level = Column(String(64), nullable=False)
    demo_pin = Column(String(64), nullable=False)
    active = Column(Boolean, default=True)


class GovAuditLogModel(Base):
    __tablename__ = "gov_audit_logs"

    id = Column(String(64), primary_key=True)
    event_type = Column(String(64), nullable=False, index=True)  # AUTH_SUCCESS, AUTH_FAILED, ACTION_AUTHORIZED, etc.
    officer_badge = Column(String(32), nullable=True, index=True)
    officer_name = Column(String(128), nullable=True)
    officer_role = Column(String(32), nullable=True)
    complaint_id = Column(String(64), nullable=True, index=True)
    action = Column(String(64), nullable=True)
    details = Column(Text, nullable=False)
    ip_address = Column(String(64), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


# ============================================================================
# Pydantic v2 Schemas for FastAPI Request/Response Validation
# ============================================================================

class VisionAnalyzeRequest(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image string of the civic issue")
    mime_type: Optional[str] = Field("image/jpeg", description="MIME type of the photo")


class VisionAnalyzeResponse(BaseModel):
    category: str
    detected_issue: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "EMERGENCY"]
    urgency_rating: int = Field(ge=1, le=5)
    suggested_department: str
    suggested_department_id: str
    safety_hazards: List[str]
    confidence: float
    confidence_score: float
    estimated_repair_time: str
    recommended_action: str
    llm_provider: str = "Gemini / GPT Dual Adapter"


class ComplaintCreate(BaseModel):
    category: str
    title: str
    description: str
    location: str
    image_url: Optional[str] = None
    department_id: Optional[str] = None
    department_name: Optional[str] = None
    severity: Optional[Literal["LOW", "MEDIUM", "HIGH", "EMERGENCY"]] = "MEDIUM"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    public_safety_hazards: Optional[List[str]] = None


class StatusHistoryEntryResponse(BaseModel):
    id: Optional[int] = None
    old_status: str
    new_status: str
    plain_language_summary: str
    actor: str
    notes: Optional[str] = None
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)


class ComplaintResponse(BaseModel):
    id: str
    work_order_id: str
    category: str
    title: str
    description: str
    image_url: Optional[str] = None
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    department_id: str
    department_name: str
    severity: str
    urgency_rating: int
    status: str
    assigned_crew: Optional[str] = None
    target_eta: Optional[str] = None
    resolution_proof: Optional[str] = None
    statutory_compliance_verified: bool = True
    confidence_score: float
    created_at: datetime
    updated_at: datetime
    history_entries: List[StatusHistoryEntryResponse] = []

    model_config = ConfigDict(from_attributes=True)


class GovOfficerLoginRequest(BaseModel):
    identifier: str = Field(..., description="Officer badge number (e.g. MUNI-001) or email")
    pin: str = Field(..., description="Official security PIN (e.g. citygov2026)")


class GovOfficerResponse(BaseModel):
    id: str
    badge_number: str
    name: str
    title: str
    email: str
    role: str
    department_id: str
    department_name: str
    clearance_level: str
    demo_pin: Optional[str] = None
    token: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class GovActionRequest(BaseModel):
    action: Literal["ACCEPT", "REJECT", "REASSIGN", "ASSIGN_CREW", "UPDATE_STATUS", "RESOLVE"]
    reason: Optional[str] = None
    new_status: Optional[str] = None
    new_department_id: Optional[str] = None
    new_department_name: Optional[str] = None
    crew_name: Optional[str] = None
    target_eta: Optional[str] = None
    notes: Optional[str] = None
    resolution_proof: Optional[str] = None


class LangGraphStepTrace(BaseModel):
    step: int
    node_name: str
    timestamp: str
    status: str
    input_state_summary: Dict[str, Any]
    output_state_summary: Dict[str, Any]
    decision: Optional[str] = None
