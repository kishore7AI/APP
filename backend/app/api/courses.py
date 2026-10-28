from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.course import Course, Section
from app.models.lesson import Lesson

router = APIRouter(prefix="/courses", tags=["Public Courses"])

@router.get("")
async def get_public_courses(db: AsyncSession = Depends(get_db)):
    """
    Get all published courses for the public catalog.
    """
    stmt = (
        select(Course)
        .where(Course.status == "published")
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
        total_duration_sec = sum(
            l.video_duration_seconds for s in c.sections for l in s.lessons
        )
        hours = round(total_duration_sec / 3600, 1) if total_duration_sec > 0 else 12.0
        students_count = len(c.access_records)
        tags_list = [t.strip() for t in (c.tags or "").split(",") if t.strip()]
        if not tags_list:
            tags_list = [c.category or "Full-Stack"]

        response.append({
            "id": c.id,
            "title": c.title,
            "slug": c.slug,
            "description": c.description or "",
            "category": c.category or "Full-Stack",
            "tags": tags_list,
            "level": c.level or "Intermediate",
            "price": c.price if (c.price and c.price > 0) else 2000,
            "polar_product_id": c.polar_product_id,
            "can_buy_single": bool(c.polar_product_id and c.polar_product_id.strip()),
            "thumbnail_url": c.thumbnail_url,
            "trailer_url": c.trailer_url,
            "status": c.status,
            "lessons_count": lessons_count,
            "duration": f"{hours} hours",
            "students_count": students_count or 140,
            "rating": 4.9,
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


@router.get("/{slug}")
async def get_public_course_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    """
    Get a single published course by its URL slug.
    """
    stmt = (
        select(Course)
        .where(Course.slug == slug)
        .options(
            selectinload(Course.sections).selectinload(Section.lessons),
            selectinload(Course.access_records),
        )
    )
    result = await db.execute(stmt)
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")

    lessons_count = sum(len(s.lessons) for s in c.sections)
    total_duration_sec = sum(
        l.video_duration_seconds for s in c.sections for l in s.lessons
    )
    hours = round(total_duration_sec / 3600, 1) if total_duration_sec > 0 else 12.0
    students_count = len(c.access_records)
    tags_list = [t.strip() for t in (c.tags or "").split(",") if t.strip()]
    if not tags_list:
        tags_list = [c.category or "Full-Stack"]

    return {
        "id": c.id,
        "title": c.title,
        "slug": c.slug,
        "description": c.description or "",
        "category": c.category or "Full-Stack",
        "tags": tags_list,
        "level": c.level or "Intermediate",
        "price": c.price if (c.price and c.price > 0) else 2000,
        "polar_product_id": c.polar_product_id,
        "can_buy_single": bool(c.polar_product_id and c.polar_product_id.strip()),
        "thumbnail_url": c.thumbnail_url,
        "trailer_url": c.trailer_url,
        "status": c.status,
        "lessons_count": lessons_count,
        "duration": f"{hours} hours",
        "students_count": students_count or 140,
        "rating": 4.9,
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
