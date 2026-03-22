from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.float import FloatRead


class ProfileRead(BaseModel):
    id: int
    float_id: int
    cycle_number: int | None
    profile_time: datetime | None
    latitude: float | None
    longitude: float | None
    source_file: str
    created_at: datetime
    float: FloatRead

    model_config = ConfigDict(from_attributes=True)
