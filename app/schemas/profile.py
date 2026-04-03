from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.float import FloatRead


class OceanMeasurementRead(BaseModel):
    id: int
    pressure: float | None
    temperature: float | None
    salinity: float | None
    latitude: float | None
    longitude: float | None
    measured_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


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
    measurements: list[OceanMeasurementRead]

    model_config = ConfigDict(from_attributes=True)
