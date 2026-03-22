from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Float(Base):
    __tablename__ = "floats"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    platform_number: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    project_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    pi_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    profiles = relationship("Profile", back_populates="float", cascade="all, delete-orphan")
