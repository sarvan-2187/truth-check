from fastapi import APIRouter
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.rag_pipeline import run_pipeline
from app.services.url_scraper import scrape_article
from app.core.config import settings
import uuid
from datetime import datetime

router = APIRouter(prefix="/api", tags=["analyze"])

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    if req.input_type == "url":
        content = scrape_article(req.content)
    elif req.input_type == "pdf_id":
        # In this implementation, we assume the content passed is already extracted text
        # or we retrieve it from the pdf_store if available.
        # For simplicity in this spec, we'll assume content is the text for now
        # OR we could implement the pdf_store retrieval here.
        from app.routers.ingest import pdf_store
        content = pdf_store.get(req.content, "PDF content not found.")
    else:
        content = req.content

    result = await run_pipeline(content, req.input_type)

    return AnalyzeResponse(
        id=str(uuid.uuid4()),
        verdict=result["verdict"],
        confidence=result["confidence"],
        summary=result["summary"],
        red_flags=result.get("red_flags", []),
        supporting_evidence=result.get("supporting_evidence", []),
        retrieved_sources=result.get("retrieved_sources", []),
        input_preview=content[:200],
        groq_model_used=settings.GROQ_MODEL,
        created_at=datetime.utcnow(),
    )
