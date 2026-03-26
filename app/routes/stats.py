from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Float, OceanMeasurement, Profile
from app.schemas.stats import DashboardStatsRead

router = APIRouter(tags=["stats"])


@router.get("/stats", response_model=DashboardStatsRead)
def get_dashboard_stats(db: Session = Depends(get_db)) -> DashboardStatsRead:
    total_floats = db.scalar(select(func.count()).select_from(Float)) or 0
    total_profiles = db.scalar(select(func.count()).select_from(Profile)) or 0
    total_measurements = db.scalar(select(func.count()).select_from(OceanMeasurement)) or 0
    return DashboardStatsRead(
        total_floats=total_floats,
        total_profiles=total_profiles,
        total_measurements=total_measurements,
    )
