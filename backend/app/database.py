from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.config import settings

db_url = settings.DATABASE_URL.strip()

if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://") and not db_url.startswith("postgresql+asyncpg://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

connect_args = {}
if "sqlite" in db_url:
    connect_args["check_same_thread"] = False

engine = create_async_engine(
    db_url,
    echo=False,
    future=True,
    connect_args=connect_args
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

from sqlalchemy import text

async def sync_missing_columns(conn):
    dialect = engine.dialect.name
    for table_name, table in Base.metadata.tables.items():
        try:
            if dialect == "sqlite":
                res = await conn.execute(text(f"PRAGMA table_info({table_name});"))
                existing_cols = {r[1] for r in res.fetchall()}
            else:
                res = await conn.execute(
                    text("SELECT column_name FROM information_schema.columns WHERE table_name = :t"),
                    {"t": table_name}
                )
                existing_cols = {r[0] for r in res.fetchall()}

            if not existing_cols:
                continue

            for col in table.columns:
                if col.name not in existing_cols:
                    col_type = col.type.compile(engine.dialect)
                    stmt = f"ALTER TABLE {table_name} ADD COLUMN {col.name} {col_type};"
                    try:
                        await conn.execute(text(stmt))
                    except Exception:
                        pass
        except Exception:
            pass

async def init_db():
    import app.models  # noqa
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await sync_missing_columns(conn)
    print("Database tables and columns initialized successfully.")
