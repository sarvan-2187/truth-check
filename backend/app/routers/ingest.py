from fastapi import APIRouter, UploadFile, File, Depends
from app.services.pdf_loader import extract_text_from_pdf
from app.services.rag_pipeline import run_pipeline
from app.models.schemas import IngestResponse
from app.core.firebase_auth import get_current_user
import uuid

router = APIRouter(prefix="/api", tags=["ingest"])

pdf_store: dict[str, str] = {}  # In-memory; swap for Redis/DB in production

@router.post("/ingest", response_model=IngestResponse)
async def ingest_pdf(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)
    doc_id = str(uuid.uuid4())
    pdf_store[doc_id] = text

    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from app.services.embedder import get_embedder
    from app.services.vector_store import get_collection

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)
    embedder = get_embedder()
    collection = get_collection()
    embeddings = embedder.encode(chunks).tolist()
    ids = [f"pdf_{doc_id}_{i}" for i in range(len(chunks))]
    collection.upsert(documents=chunks, embeddings=embeddings, ids=ids)

    return IngestResponse(
        doc_id=doc_id,
        chunks_stored=len(chunks),
        message="PDF ingested and embedded successfully."
    )
