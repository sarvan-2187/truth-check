from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings
import json

SYSTEM_PROMPT = """
You are an expert fact-checker and misinformation analyst.
Given an article or text AND relevant context retrieved from a knowledge base,
analyze it and return ONLY a valid JSON object with this exact structure:
{
  "verdict": "REAL" | "FAKE" | "MISLEADING" | "UNVERIFIABLE",
  "confidence": <float between 0.0 and 1.0>,
  "summary": "<2-3 sentence explanation of your verdict>",
  "red_flags": ["<specific red flag 1>", "<specific red flag 2>"],
  "supporting_evidence": ["<evidence supporting credibility 1>", "<evidence 2>"],
  "retrieved_sources": ["<relevant chunk excerpt 1>", "<excerpt 2>"]
}
Return ONLY the JSON. No markdown, no preamble, no explanation outside the JSON.
"""

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model=settings.GROQ_MODEL,
    temperature=0.1,
    max_tokens=1024,
)

async def classify_content(content: str, retrieved_chunks: list[str]) -> dict:
    context_block = "\n\n---\n".join(retrieved_chunks) if retrieved_chunks else "No prior context found."

    user_message = f"""
## Content to Analyze:
{content}

## Retrieved Context from Knowledge Base:
{context_block}

Analyze the content above against the retrieved context and return your JSON verdict.
"""
    response = await llm.ainvoke([
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=user_message),
    ])

    raw = response.content.strip()
    return json.loads(raw)
