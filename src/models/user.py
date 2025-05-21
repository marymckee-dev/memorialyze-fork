"""
User model.

This module defines the User model for the Memorialyze system.
"""
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import BaseModel


class User(BaseModel):
    """
    User model.
    
    Attributes:
        username: User's unique username
        email: User's email address
        full_name: User's full name
        hashed_password: User's hashed password
        is_active: Whether the user account is active
        memories: Relationship to Memory objects owned by this user
    """
    __tablename__ = "users"
    
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100))
    hashed_password: Mapped[str] = mapped_column(String(200))
    is_active: Mapped[bool] = mapped_column(default=True)
    
    # Relationships will be defined later
    # memories = relationship("Memory", back_populates="owner")
    
    def __repr__(self) -> str:
        return f"<User {self.username}>"
