from pydantic import BaseModel


class DashboardStatsRead(BaseModel):
    total_floats: int
    total_profiles: int
    total_measurements: int
