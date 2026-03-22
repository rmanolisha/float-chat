from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models import Profile
from app.schemas.profile import ProfileRead

router = APIRouter(tags=["profiles"])


@router.get("/profiles", response_model=list[ProfileRead])
def list_profiles(
    float_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[Profile]:
    stmt = (
        select(Profile)
        .options(joinedload(Profile.float))
        .order_by(Profile.profile_time.desc().nullslast(), Profile.id.desc())
    )
    if float_id is not None:
        stmt = stmt.where(Profile.float_id == float_id)
    return list(db.scalars(stmt).unique().all())
