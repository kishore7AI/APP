from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("sections.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=True)
    position = Column(Integer, default=0, nullable=False)
    
    # Video & Content
    video_file_id = Column(String(255), nullable=True)  # ImageKit File ID
    video_duration_seconds = Column(Integer, default=0, nullable=False)
    content = Column(Text, nullable=True)  # Rich text HTML / Markdown notes
    attachments = Column(JSON, default=list, nullable=False)  # JSON array of downloadable resources
    
    # Access & Status
    is_free_preview = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default="draft", nullable=False)  # "draft" | "published"
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    section = relationship("Section", back_populates="lessons")
    progress_records = relationship("LessonProgress", back_populates="lesson", cascade="all, delete-orphan")
