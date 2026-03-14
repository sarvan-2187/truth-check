from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    GROQ_API_KEY: str
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    EMBED_MODEL: str = "all-MiniLM-L6-v2"
    CHROMA_PATH: str = "./data/chroma_db"
    SQLITE_URL: str = "sqlite+aiosqlite:///./data/history.db"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"

settings = Settings()
