from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    float_id: Mapped[int] = mapped_column(ForeignKey("floats.id", ondelete="CASCADE"), index=True)
    cycle_number: Mapped[int | None] = mapped_column(Integer, nullable=True)
    profile_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    latitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    longitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    source_file: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    float = relationship("Float", back_populates="profiles")
    measurements = relationship(
        "OceanMeasurement",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
