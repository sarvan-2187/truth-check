from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.core.config import settings
import json

SYSTEM_PROMPT = """
You are an expert fact-checker and misinformation analyst.
Given an article or text AND relevant context retrieved from a knowledge base,
analyze it and return ONLY a valid JSON object with this exact structure (and NOTHING else):

{
  "verdict": "REAL" | "FAKE" | "MISLEADING" | "UNVERIFIABLE",
  "confidence": <float between 0.0 and 1.0>,
  "summary": "<2-3 sentence explanation of your verdict>",
  "red_flags": ["<specific red flag 1>", "<specific red flag 2>"],
  "supporting_evidence": ["<evidence supporting credibility 1>", "<evidence 2>"],
  "retrieved_sources": ["<relevant chunk excerpt 1>", "<excerpt 2>"]
}

CRITICAL RULES:
1. Return ONLY valid JSON - no markdown, no code blocks, no preamble, no explanation
2. Every field must be present in the JSON
3. The verdict field must be one of: REAL, FAKE, MISLEADING, or UNVERIFIABLE
4. Confidence must be a number between 0.0 and 1.0
5. All array fields must contain at least one element
6. All string values must be properly escaped JSON strings
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
    
    # Handle markdown code blocks
    if raw.startswith("```"):
        # Extract JSON from markdown code blocks
        lines = raw.split("\n")
        json_lines = []
        in_json_block = False
        for line in lines:
            if line.startswith("```"):
                in_json_block = not in_json_block
                continue
            if in_json_block:
                json_lines.append(line)
        raw = "\n".join(json_lines).strip()
    
    # Debug logging
    if not raw:
        raise ValueError(f"LLM returned empty response. Raw content: '{response.content}'")
    
    try:
        return json.loads(raw)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse LLM response as JSON. Raw response: '{raw}'. Error: {e}")
