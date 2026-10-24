from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class UserAccess(Base):
    __tablename__ = "user_access"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    access_type = Column(String(50), nullable=False)  # "single_course" | "monthly" | "lifetime"
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True, index=True)
    polar_subscription_id = Column(String(255), nullable=True, index=True)
    status = Column(String(50), default="active", nullable=False)  # "active" | "cancelled" | "expired" | "refunded"
    starts_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=True)  # NULL means lifetime / perpetual
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="access_records")
    course = relationship("Course", back_populates="access_records")


class PurchaseRecord(Base):
    __tablename__ = "purchase_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    polar_order_id = Column(String(255), unique=True, index=True, nullable=False)
    access_type = Column(String(50), nullable=False)
    amount_paid = Column(Integer, nullable=False)  # in cents or paise/INR
    currency = Column(String(10), default="INR", nullable=False)
    paid_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="purchase_records")


class WebhookEvent(Base):
    __tablename__ = "webhook_events"

    id = Column(Integer, primary_key=True, index=True)
    delivery_id = Column(String(255), unique=True, index=True, nullable=False)  # Polar webhook delivery id for idempotency
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    processed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
