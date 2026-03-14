from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class AnalyzeRequest(BaseModel):
    input_type: Literal["text", "url", "pdf_id"]
    content: str

class AnalyzeResponse(BaseModel):
    id: str
    verdict: Literal["REAL", "FAKE", "MISLEADING", "UNVERIFIABLE"]
    confidence: float
    summary: str
    red_flags: list[str]
    supporting_evidence: list[str]
    retrieved_sources: list[str]
    input_preview: str
    groq_model_used: str
    created_at: datetime

class IngestResponse(BaseModel):
    doc_id: str
    chunks_stored: int
    message: str
