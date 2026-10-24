import asyncio
from sqlalchemy.future import select
from app.database import AsyncSessionLocal, init_db
from app.models.user import User
from app.models.course import Course, Section
from app.models.lesson import Lesson
from app.models.access import UserAccess
from app.services.auth_service import hash_password

async def seed_data():
    await init_db()
    async with AsyncSessionLocal() as session:
        # 1. Seed Admin User
        stmt = select(User).where(User.email == "admin@nxtlearnn.com")
        res = await session.execute(stmt)
        admin = res.scalar_one_or_none()

        if not admin:
            admin = User(
                email="admin@nxtlearnn.com",
                hashed_password=hash_password("admin123456"),
                full_name="Lead Instructor (Admin)",
                role="admin",
                is_active=True,
            )
            session.add(admin)
            print("Admin user seeded: admin@nxtlearnn.com / admin123456")

        # 2. Seed Student User
        stmt = select(User).where(User.email == "student@nxtlearnn.com")
        res = await session.execute(stmt)
        student = res.scalar_one_or_none()

        if not student:
            student = User(
                email="student@nxtlearnn.com",
                hashed_password=hash_password("student123456"),
                full_name="Kishore Student",
                role="student",
                is_active=True,
            )
            session.add(student)
            print("Student user seeded: student@nxtlearnn.com / student123456")

        await session.commit()

        # Refresh users
        await session.refresh(admin)
        await session.refresh(student)

        # 3. Seed Initial Sample Course
        stmt = select(Course).where(Course.slug == "react-fastapi-production-mastery")
        res = await session.execute(stmt)
        course = res.scalar_one_or_none()

        if not course:
            course = Course(
                title="Full-Stack Fast & Furious: React + FastAPI Production Mastery",
                slug="react-fastapi-production-mastery",
                description="Build enterprise-ready web applications using React, Vite, and Python FastAPI with async PostgreSQL.",
                thumbnail_url="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
                price=2499,
                status="published",
            )
            session.add(course)
            await session.commit()
            await session.refresh(course)

            # Section 1
            sec1 = Section(course_id=course.id, title="1. Foundations & Architecture", position=1)
            session.add(sec1)
            await session.commit()
            await session.refresh(sec1)

            # Lessons
            l1 = Lesson(
                section_id=sec1.id,
                title="01 - Architectural Deep Dive: React SPA + Async FastAPI",
                position=1,
                video_file_id="demo_video_01",
                video_duration_seconds=720,
                content="<p>Welcome to NxtLearnn! In this lesson, we break down why decoupling frontend and backend gives you immense speed and scalability.</p>",
                is_free_preview=True,
                status="published",
            )
            l2 = Lesson(
                section_id=sec1.id,
                title="02 - High-Performance Database Design with Async SQLAlchemy",
                position=2,
                video_file_id="demo_video_02",
                video_duration_seconds=980,
                content="<p>Understanding connection pooling, asyncpg, and index optimization.</p>",
                is_free_preview=False,
                status="published",
            )
            session.add_all([l1, l2])

            # Grant student access to this course for testing
            access = UserAccess(
                user_id=student.id,
                access_type="single_course",
                course_id=course.id,
                status="active",
            )
            session.add(access)

            await session.commit()
            print("Sample course, sections, lessons, and access seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
