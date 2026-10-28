import asyncio
import sys
from pathlib import Path

backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import AsyncSessionLocal, init_db
from app.models.course import Course, Section
from app.models.lesson import Lesson
from sqlalchemy.future import select

SEED_COURSES = [
    {
        "slug": "full-stack-nextjs",
        "title": "Full-Stack Next.js 15",
        "category": "Full-Stack",
        "tags": "Next.js 15, Prisma, PostgreSQL, Tailwind CSS",
        "level": "Intermediate",
        "price": 2499,
        "description": "Master production full-stack engineering with Next.js App Router, Server Actions, NextAuth.js authentication, and Prisma ORM backed by PostgreSQL.",
        "thumbnail_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
        "status": "published",
        "sections": [
            {
                "title": "1. Getting Started & App Router",
                "lessons": [
                    {"title": "Course Introduction & System Architecture", "duration": 204, "is_free": True},
                    {"title": "Next.js 15 Project Setup & Tailwind", "duration": 340, "is_free": False},
                    {"title": "Server vs Client Components Deep Dive", "duration": 480, "is_free": False},
                ]
            },
            {
                "title": "2. Database Modeling with Prisma",
                "lessons": [
                    {"title": "PostgreSQL Schema Definition", "duration": 520, "is_free": False},
                    {"title": "Database Migrations & Seeding", "duration": 410, "is_free": False},
                ]
            }
        ]
    },
    {
        "slug": "react-fastapi",
        "title": "React + FastAPI Production Mastery",
        "category": "Full-Stack",
        "tags": "FastAPI, Python 3.11, React, Neon Postgres",
        "level": "Intermediate",
        "price": 2499,
        "description": "Enterprise web apps with React, Vite, and async Python FastAPI backed by Neon serverless PostgreSQL.",
        "thumbnail_url": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
        "status": "published",
        "sections": [
            {
                "title": "1. Architecture & API Foundations",
                "lessons": [
                    {"title": "Modern FastAPI Architecture", "duration": 310, "is_free": True},
                    {"title": "Asyncpg & SQLAlchemy 2.0 Async Session", "duration": 460, "is_free": False},
                ]
            },
            {
                "title": "2. High Performance Endpoints",
                "lessons": [
                    {"title": "JWT Authentication Flow", "duration": 390, "is_free": False},
                    {"title": "Background Tasks & Streaming", "duration": 450, "is_free": False},
                ]
            }
        ]
    },
    {
        "slug": "microservices-python",
        "title": "High-Concurrency Microservices with Python",
        "category": "Backend & Systems",
        "tags": "System Design, Redis, Kafka, Async Python",
        "level": "Advanced",
        "price": 2999,
        "description": "Architect distributed systems capable of handling 100K+ requests/sec using Redis caching, Kafka message streaming, and distributed locks.",
        "thumbnail_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        "status": "published",
        "sections": [
            {
                "title": "1. Distributed System Architecture",
                "lessons": [
                    {"title": "High-Concurrency Paradigms", "duration": 420, "is_free": True},
                    {"title": "Redis Cluster Caching Strategies", "duration": 510, "is_free": False},
                ]
            }
        ]
    },
    {
        "slug": "modern-frontend",
        "title": "Modern Frontend Architecture with React 19",
        "category": "Frontend",
        "tags": "React 19, TypeScript, Tailwind CSS, Vite",
        "level": "Intermediate",
        "price": 1999,
        "description": "Master state management, micro-frontends, server components, and performant user experiences in React 19.",
        "thumbnail_url": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
        "status": "published",
        "sections": [
            {
                "title": "1. Modern React 19 Paradigms",
                "lessons": [
                    {"title": "React 19 Compiler & Actions", "duration": 380, "is_free": True},
                    {"title": "Component Architecture Design", "duration": 460, "is_free": False},
                ]
            }
        ]
    },
    {
        "slug": "devops-cloud",
        "title": "DevOps & Cloud Production CI/CD",
        "category": "DevOps & Cloud",
        "tags": "Docker, Kubernetes, AWS, GitHub Actions",
        "level": "Advanced",
        "price": 2799,
        "description": "Deploy rock-solid infrastructure on AWS with Docker, Kubernetes, Terraform, and automated zero-downtime CI/CD workflows.",
        "thumbnail_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
        "status": "published",
        "sections": [
            {
                "title": "1. Containerization & Pipelines",
                "lessons": [
                    {"title": "Multi-Stage Docker Builds", "duration": 350, "is_free": True},
                    {"title": "GitHub Actions Automated Testing & Deployment", "duration": 490, "is_free": False},
                ]
            }
        ]
    },
    {
        "slug": "applied-ai",
        "title": "Applied AI & Vector Search with Python",
        "category": "AI & Data",
        "tags": "OpenAI, LangChain, Pinecone, FastAPI",
        "level": "Intermediate",
        "price": 3499,
        "description": "Build production LLM apps with Retrieval-Augmented Generation (RAG), vector databases, semantic search, and streaming responses.",
        "thumbnail_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
        "status": "published",
        "sections": [
            {
                "title": "1. LLM & Embeddings Foundations",
                "lessons": [
                    {"title": "Vector Embeddings & Semantic Search", "duration": 410, "is_free": True},
                    {"title": "Building Production RAG Pipelines", "duration": 560, "is_free": False},
                ]
            }
        ]
    }
]

async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        res = await db.execute(select(Course))
        existing_courses = res.scalars().all()
        existing_slugs = {c.slug for c in existing_courses}

        added = 0
        for item in SEED_COURSES:
            if item["slug"] in existing_slugs:
                continue

            course = Course(
                title=item["title"],
                slug=item["slug"],
                category=item["category"],
                tags=item["tags"],
                level=item["level"],
                price=item["price"],
                description=item["description"],
                thumbnail_url=item["thumbnail_url"],
                status=item["status"],
            )
            db.add(course)
            await db.commit()
            await db.refresh(course)

            for s_idx, sec_data in enumerate(item["sections"]):
                sec = Section(
                    course_id=course.id,
                    title=sec_data["title"],
                    position=s_idx + 1,
                )
                db.add(sec)
                await db.commit()
                await db.refresh(sec)

                for l_idx, les_data in enumerate(sec_data["lessons"]):
                    les = Lesson(
                        section_id=sec.id,
                        title=les_data["title"],
                        position=l_idx + 1,
                        video_duration_seconds=les_data["duration"],
                        is_free_preview=les_data.get("is_free", False),
                        status="published",
                    )
                    db.add(les)
            await db.commit()
            added += 1

        print(f"Seeding complete. Added {added} courses. Total now: {len(existing_courses) + added}")

if __name__ == "__main__":
    asyncio.run(seed())
