from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import Float
from app.schemas.float import FloatRead

router = APIRouter(tags=["floats"])


@router.get("/floats", response_model=list[FloatRead])
def list_floats(db: Session = Depends(get_db)) -> list[Float]:
    return list(db.scalars(select(Float).order_by(Float.platform_number)).all())
