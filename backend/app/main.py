from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import analyze, ingest, history
from app.models.db_models import Base
from sqlalchemy.ext.asyncio import create_async_engine

app = FastAPI(title="Fake News Detector API", version="1.0.0")

engine = create_async_engine(settings.SQLITE_URL)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(ingest.router)
app.include_router(history.router)

@app.get("/api/health")
def health():
    return {"status": "ok", "model": settings.GROQ_MODEL}
