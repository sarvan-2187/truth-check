from sqlalchemy import Column, String, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

class AnalysisHistory(Base):
    __tablename__ = "history"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    verdict = Column(String)
    confidence = Column(Float)
    summary = Column(String)
    red_flags = Column(JSON)
    supporting_evidence = Column(JSON)
    retrieved_sources = Column(JSON)
    input_preview = Column(String)
    groq_model_used = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
