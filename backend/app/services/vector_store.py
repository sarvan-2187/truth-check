import chromadb
from app.core.config import settings
from functools import lru_cache

@lru_cache(maxsize=1)
def get_client():
    return chromadb.PersistentClient(path=settings.CHROMA_PATH)

def get_collection():
    client = get_client()
    return client.get_or_create_collection(
        name="fact_check_kb",
        metadata={"hnsw:space": "cosine"}
    )
