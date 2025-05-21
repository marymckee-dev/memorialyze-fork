"""
Base model for all database models.

This module provides a base model with common fields and functionality.
"""
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class BaseModel(Base):
    """
    Base model with common fields for all models.
    
    Attributes:
        id: Primary key UUID
        created_at: Timestamp when the record was created
        updated_at: Timestamp when the record was last updated
    """
    __abstract__ = True
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4,
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime, 
        nullable=False,
        server_default=text("CURRENT_TIMESTAMP"),
    )
    
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime,
        nullable=True,
        onupdate=datetime.utcnow,
    )
