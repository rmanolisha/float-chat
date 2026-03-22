from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FloatRead(BaseModel):
    id: int
    platform_number: str
    project_name: str | None
    pi_name: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
