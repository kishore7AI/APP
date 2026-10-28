from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.course import Course, Section
from app.models.lesson import Lesson
from app.models.user import User
from app.models.access import UserAccess, PurchaseRecord
from app.services.auth_service import require_admin
from app.services.imagekit_service import imagekit_service

router = APIRouter(prefix="/admin", tags=["Admin Studio"])

# -----------------------------------------------------------------------------
# Schemas
# -----------------------------------------------------------------------------
class LessonCreate(BaseModel):
    title: str
    position: Optional[int] = 0
    video_file_id: Optional[str] = None
    video_duration_seconds: Optional[int] = 0
    content: Optional[str] = ""
    is_free_preview: Optional[bool] = False
    status: Optional[str] = "published"

class SectionCreate(BaseModel):
    title: str
    position: Optional[int] = 0

class CourseCreate(BaseModel):
    title: str
    slug: str
    description: Optional[str] = ""
    price: Optional[int] = 0
    category: Optional[str] = "Full-Stack"
    tags: Optional[str] = ""
    level: Optional[str] = "Intermediate"
    polar_product_id: Optional[str] = None
    trailer_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: Optional[str] = "published"  # "draft" | "published" | "archived"

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    level: Optional[str] = None
    polar_product_id: Optional[str] = None
    trailer_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    status: Optional[str] = None


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@router.get("/stats")
async def get_admin_stats(
    db: AsyncSession = Depends(get_db),
    # Optional requirement: can be accessed with admin token, or fallback gracefully
):
    """
    Get live platform KPI metrics for the Admin Dashboard.
    """
    try:
        # Total Courses
        courses_res = await db.execute(select(Course))
        all_courses = courses_res.scalars().all()
        total_courses = len(all_courses)
        published_courses = sum(1 for c in all_courses if c.status == "published")
        draft_courses = total_courses - published_courses

        # Total Lessons
        lessons_res = await db.execute(select(Lesson))
        total_lessons = len(lessons_res.scalars().all())

        # Total Students
        students_res = await db.execute(select(User).where(User.role == "student"))
        total_students = len(students_res.scalars().all())

        # Total Revenue (real purchases only)
        revenue_res = await db.execute(select(PurchaseRecord))
        purchases = revenue_res.scalars().all()
        total_revenue = sum(p.amount_inr for p in purchases) if purchases else 0

        return {
            "total_courses": total_courses,
            "published_courses": published_courses,
            "draft_courses": draft_courses,
            "total_lessons": total_lessons,
            "total_students": total_students,
            "total_revenue_inr": total_revenue,
        }
    except Exception as e:
        return {
            "total_courses": 0,
            "published_courses": 0,
            "draft_courses": 0,
            "total_lessons": 0,
            "total_students": 0,
            "total_revenue_inr": 0,
        }


@router.get("/courses")
async def list_admin_courses(
    db: AsyncSession = Depends(get_db),
):
    """
    List all courses with sections and lessons for the Admin Studio.
    """
    stmt = (
        select(Course)
        .options(
            selectinload(Course.sections).selectinload(Section.lessons),
            selectinload(Course.access_records),
        )
        .order_by(Course.created_at.desc())
    )
    result = await db.execute(stmt)
    courses = result.scalars().all()

    response = []
    for c in courses:
        lessons_count = sum(len(s.lessons) for s in c.sections)
        students_count = len(c.access_records)
        response.append({
            "id": c.id,
            "title": c.title,
            "slug": c.slug,
            "description": c.description,
            "category": c.category or "Full-Stack",
            "tags": c.tags or "",
            "level": c.level or "Intermediate",
            "price": c.price,
            "polar_product_id": c.polar_product_id,
            "trailer_url": c.trailer_url,
            "thumbnail_url": c.thumbnail_url,
            "status": c.status,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "lessons_count": lessons_count,
            "students_count": students_count,
            "sections": [
                {
                    "id": s.id,
                    "title": s.title,
                    "position": s.position,
                    "lessons": [
                        {
                            "id": l.id,
                            "title": l.title,
                            "position": l.position,
                            "video_file_id": l.video_file_id,
                            "video_duration_seconds": l.video_duration_seconds,
                            "is_free_preview": l.is_free_preview,
                            "status": l.status,
                        }
                        for l in s.lessons
                    ],
                }
                for s in c.sections
            ],
        })
    return response


@router.get("/courses/{course_id}")
async def get_admin_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Get a single course with full curriculum for the Course Studio.
    """
    stmt = (
        select(Course)
        .where(Course.id == course_id)
        .options(
            selectinload(Course.sections).selectinload(Section.lessons),
            selectinload(Course.access_records),
        )
    )
    result = await db.execute(stmt)
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Course not found.")

    lessons_count = sum(len(s.lessons) for s in c.sections)
    students_count = len(c.access_records)
    return {
        "id": c.id,
        "title": c.title,
        "slug": c.slug,
        "description": c.description,
        "category": c.category or "Full-Stack",
        "tags": c.tags or "",
        "level": c.level or "Intermediate",
        "price": c.price,
        "polar_product_id": c.polar_product_id,
        "trailer_url": c.trailer_url,
        "thumbnail_url": c.thumbnail_url,
        "status": c.status,
        "created_at": c.created_at.isoformat() if c.created_at else None,
        "lessons_count": lessons_count,
        "students_count": students_count,
        "sections": [
            {
                "id": s.id,
                "title": s.title,
                "position": s.position,
                "lessons": [
                    {
                        "id": l.id,
                        "title": l.title,
                        "position": l.position,
                        "video_file_id": l.video_file_id,
                        "video_duration_seconds": l.video_duration_seconds,
                        "is_free_preview": l.is_free_preview,
                        "status": l.status,
                    }
                    for l in s.lessons
                ],
            }
            for s in c.sections
        ],
    }


@router.post("/courses", status_code=status.HTTP_201_CREATED)
async def create_course(
    payload: CourseCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new course in the Admin Studio.
    """
    # Check if slug exists
    stmt = select(Course).where(Course.slug == payload.slug)
    existing = await db.execute(stmt)
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="A course with this slug already exists.")

    new_course = Course(
        title=payload.title,
        slug=payload.slug,
        description=payload.description,
        category=payload.category or "Full-Stack",
        tags=payload.tags or "",
        level=payload.level or "Intermediate",
        price=payload.price or 0,
        polar_product_id=payload.polar_product_id,
        trailer_url=payload.trailer_url,
        thumbnail_url=payload.thumbnail_url,
        status=payload.status or "published",
    )
    db.add(new_course)
    await db.commit()
    await db.refresh(new_course)

    # Automatically create a default initial section
    default_section = Section(
        course_id=new_course.id,
        title="Getting Started",
        position=1,
    )
    db.add(default_section)
    await db.commit()

    return {
        "id": new_course.id,
        "title": new_course.title,
        "slug": new_course.slug,
        "category": new_course.category,
        "tags": new_course.tags,
        "level": new_course.level,
        "polar_product_id": new_course.polar_product_id,
        "trailer_url": new_course.trailer_url,
        "status": new_course.status,
        "message": "Course created successfully."
    }


@router.put("/courses/{course_id}")
async def update_course(
    course_id: int,
    payload: CourseUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update course details.
    """
    stmt = select(Course).where(Course.id == course_id)
    res = await db.execute(stmt)
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    if payload.title is not None:
        course.title = payload.title
    if payload.slug is not None:
        course.slug = payload.slug
    if payload.description is not None:
        course.description = payload.description
    if payload.category is not None:
        course.category = payload.category
    if payload.tags is not None:
        course.tags = payload.tags
    if payload.level is not None:
        course.level = payload.level
    if payload.price is not None:
        course.price = payload.price
    if payload.polar_product_id is not None:
        course.polar_product_id = payload.polar_product_id
    if payload.trailer_url is not None:
        course.trailer_url = payload.trailer_url
    if payload.thumbnail_url is not None:
        course.thumbnail_url = payload.thumbnail_url
    if payload.status is not None:
        course.status = payload.status

    course.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(course)

    return {"message": "Course updated successfully.", "id": course.id, "status": course.status}



@router.delete("/courses/{course_id}")
async def delete_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a course.
    """
    stmt = select(Course).where(Course.id == course_id)
    res = await db.execute(stmt)
    course = res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    await db.delete(course)
    await db.commit()
    return {"message": "Course deleted successfully."}


@router.post("/courses/{course_id}/sections", status_code=status.HTTP_201_CREATED)
async def add_section(
    course_id: int,
    payload: SectionCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Add a new section to a course.
    """
    new_section = Section(
        course_id=course_id,
        title=payload.title,
        position=payload.position or 0,
    )
    db.add(new_section)
    await db.commit()
    await db.refresh(new_section)
    return {"id": new_section.id, "title": new_section.title, "position": new_section.position}


@router.delete("/sections/{section_id}")
async def delete_section(
    section_id: int,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Section).where(Section.id == section_id)
    res = await db.execute(stmt)
    section = res.scalar_one_or_none()
    if not section:
        raise HTTPException(status_code=404, detail="Section not found.")
    await db.delete(section)
    await db.commit()
    return {"message": "Section deleted successfully."}


@router.post("/sections/{section_id}/lessons", status_code=status.HTTP_201_CREATED)
async def add_lesson(
    section_id: int,
    payload: LessonCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Add a lesson to a section.
    """
    new_lesson = Lesson(
        section_id=section_id,
        title=payload.title,
        position=payload.position or 0,
        video_file_id=payload.video_file_id,
        video_duration_seconds=payload.video_duration_seconds or 0,
        content=payload.content or "",
        is_free_preview=payload.is_free_preview or False,
        status=payload.status or "published",
    )
    db.add(new_lesson)
    await db.commit()
    await db.refresh(new_lesson)
    return {
        "id": new_lesson.id,
        "title": new_lesson.title,
        "video_file_id": new_lesson.video_file_id,
        "is_free_preview": new_lesson.is_free_preview,
    }


@router.delete("/lessons/{lesson_id}")
async def delete_lesson(
    lesson_id: int,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Lesson).where(Lesson.id == lesson_id)
    res = await db.execute(stmt)
    lesson = res.scalar_one_or_none()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found.")
    await db.delete(lesson)
    await db.commit()
    return {"message": "Lesson deleted successfully."}


# -----------------------------------------------------------------------------
# ImageKit Endpoints
# -----------------------------------------------------------------------------

@router.get("/imagekit/auth")
async def get_imagekit_auth():
    """
    Get client-side ImageKit upload token, expiration, and signature.
    """
    return imagekit_service.get_auth_parameters()


@router.post("/imagekit/upload")
async def upload_imagekit_media(
    file: UploadFile = File(...),
    folder: str = Form("courses/thumbnails"),
):
    """
    Upload an image or video directly to ImageKit.
    """
    file_bytes = await file.read()
    result = await imagekit_service.upload_file(
        file_bytes=file_bytes,
        file_name=file.filename or "media_upload",
        folder=folder,
    )
    return result
