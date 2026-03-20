from fastapi import APIRouter, HTTPException, Depends
from app.models.db_models import AnalysisHistory
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.core.firebase_auth import get_current_user
import uuid

router = APIRouter(prefix="/api", tags=["history"])

engine = create_async_engine(settings.SQLITE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

@router.get("/history")
async def get_all_history(current_user: dict = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(AnalysisHistory).order_by(AnalysisHistory.created_at.desc()))
        history = result.scalars().all()
        return history

@router.delete("/history/{id}")
async def delete_history_item(id: str, current_user: dict = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        async with session.begin():
            result = await session.execute(select(AnalysisHistory).where(AnalysisHistory.id == id))
            item = result.scalar_one_or_none()
            if not item:
                raise HTTPException(status_code=404, detail="History item not found")
            await session.delete(item)
        return {"message": "Deleted successfully"}
