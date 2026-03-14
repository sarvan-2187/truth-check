from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.services.embedder import get_embedder
from app.services.vector_store import get_collection
from app.services.llm_service import classify_content

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)

async def run_pipeline(content: str, input_type: str) -> dict:
    # 1. Chunk
    chunks = splitter.split_text(content)

    # 2. Embed query + retrieve from ChromaDB
    collection = get_collection()
    embedder = get_embedder()
    query_embedding = embedder.encode([content[:512]])[0].tolist()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=5,
        include=["documents"]
    )
    retrieved = results["documents"][0] if results["documents"] else []

    # 3. Store new chunks into vector DB
    if chunks:
        embeddings = embedder.encode(chunks).tolist()
        ids = [f"{input_type}_{i}_{hash(c)}" for i, c in enumerate(chunks)]
        collection.upsert(documents=chunks, embeddings=embeddings, ids=ids)

    # 4. Groq LLM classification
    verdict_data = await classify_content(content[:4000], retrieved)
    return verdict_data
