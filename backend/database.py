"""
PostgreSQL Database Connection and Session Management with SQLAlchemy 2.0.
Supports PostgreSQL (asyncpg/psycopg2) with automatic table bootstrapping and seed data.
"""

import os
from datetime import datetime
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
)
from sqlalchemy import select
from .models import Base, GovOfficerModel, ComplaintModel, StatusHistoryModel, GovAuditLogModel

# Database connection string: Default to SQLite for local development
# Format: sqlite+aiosqlite:///./database.db
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./metropolis_civic.db",
)

# If SQLite is selected for lightweight local dev:
connect_args = {}
if "sqlite" in DATABASE_URL:
    connect_args = {"check_same_thread": False}

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
    pool_pre_ping=True,
    connect_args=connect_args,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Dependency for providing a transactional async database session."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# Pre-seeded Municipal Officers for RBAC
DEMO_OFFICERS = [
    {
        "id": "gov_u_01",
        "badge_number": "MUNI-001",
        "name": "Jane Vance",
        "title": "City Operations Administrator",
        "email": "admin@metropolis.gov",
        "role": "CITY_ADMIN",
        "department_id": "ALL",
        "department_name": "Office of the City Administrator (All Departments)",
        "clearance_level": "LEVEL_4_EXECUTIVE",
        "demo_pin": "citygov2026",
    },
    {
        "id": "gov_u_02",
        "badge_number": "DOT-409",
        "name": "Marcus Alvarez",
        "title": "Lead Roadway & Signals Dispatcher",
        "email": "malvarez@transport.metropolis.gov",
        "role": "DEPT_DISPATCHER",
        "department_id": "DOT",
        "department_name": "Department of Transportation (DOT)",
        "clearance_level": "LEVEL_3_DISPATCH",
        "demo_pin": "dot409pin",
    },
    {
        "id": "gov_u_03",
        "badge_number": "SAN-102",
        "name": "Elena Rostova",
        "title": "Sanitation Operations Coordinator",
        "email": "erostova@sanitation.metropolis.gov",
        "role": "DEPT_DISPATCHER",
        "department_id": "SANITATION",
        "department_name": "Department of Sanitation & Waste Management",
        "clearance_level": "LEVEL_3_DISPATCH",
        "demo_pin": "san102pin",
    },
    {
        "id": "gov_u_04",
        "badge_number": "WTR-772",
        "name": "Kwame Mensah",
        "title": "Water & Stormwater Utility Dispatcher",
        "email": "kmensah@water.metropolis.gov",
        "role": "DEPT_DISPATCHER",
        "department_id": "WATER",
        "department_name": "Bureau of Water & Sewer Services",
        "clearance_level": "LEVEL_3_DISPATCH",
        "demo_pin": "wtr772pin",
    },
    {
        "id": "gov_u_05",
        "badge_number": "FLD-554",
        "name": "David Chen",
        "title": "Rapid Asphalt & Street Repair Crew Chief",
        "email": "dchen@crews.metropolis.gov",
        "role": "FIELD_SUPERVISOR",
        "department_id": "DOT",
        "department_name": "Department of Transportation (DOT)",
        "clearance_level": "LEVEL_2_FIELD",
        "demo_pin": "field554pin",
    },
    {
        "id": "gov_u_06",
        "badge_number": "AUD-991",
        "name": "Sarah Sterling",
        "title": "Senior Forensic Civic Auditor",
        "email": "ssterling@inspector-general.metropolis.gov",
        "role": "AUDITOR",
        "department_id": "ALL",
        "department_name": "Office of the Inspector General & Civic Audit",
        "clearance_level": "LEVEL_1_OVERSIGHT_READONLY",
        "demo_pin": "audit991pin",
    },
]


async def init_db():
    """Initializes PostgreSQL schemas and seeds RBAC officers if empty."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(GovOfficerModel))
        officers = result.scalars().all()
        if not officers:
            for officer_data in DEMO_OFFICERS:
                officer = GovOfficerModel(**officer_data)
                session.add(officer)
            await session.commit()
