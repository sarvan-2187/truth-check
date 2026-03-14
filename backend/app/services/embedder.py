from sentence_transformers import SentenceTransformer
from app.core.config import settings
from functools import lru_cache

@lru_cache(maxsize=1)
def get_embedder() -> SentenceTransformer:
    return SentenceTransformer(settings.EMBED_MODEL)
