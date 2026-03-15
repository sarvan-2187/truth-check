# Truth-Check: Fake News Detector (RAG-Based)

A Retrieval-Augmented Generation (RAG) based system that analyzes news content and determines whether it is likely **real, misleading, or fake**. The system retrieves contextual evidence from a knowledge base and uses a Large Language Model to generate a fact-aware explanation.


## Project Structure

```
truth-check/
│
├── backend/        # RAG pipeline, APIs, and vector database
├── frontend/       # User interface for submitting news queries
└── README.md
```


## Overview

This project combines **vector search** and **LLM reasoning** to detect potential misinformation.

The workflow follows the RAG pipeline:

1. User submits a news headline or article.
2. Backend converts the text into embeddings.
3. Relevant documents are retrieved from the vector database.
4. The LLM analyzes the claim with retrieved context.
5. The system outputs:

   * **Verdict**
   * **Confidence**
   * **Explanation with evidence**


## Features

* RAG-based misinformation detection
* Context-aware fact checking
* AI generated explanations
* Semantic document retrieval
* Modern web interface
* Modular backend architecture


## Tech Stack

### Frontend

* React + Vite
* TailwindCSS
* API integration with backend

### Backend

* Python
* FastAPI
* ChromaDB (vector database)
* Sentence Transformers (embeddings)
* Groq LLM API

## Installation

### 1. Clone the repository

```
git clone https://github.com/your-username/truth-check.git
cd truth-check
```

### 2. Backend Setup

```
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file:

```
GROQ_API_KEY=your_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

Run the backend server:

```
uvicorn app.main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```


## How It Works

1. News text is sent to the backend API.
2. Text embeddings are generated using Sentence Transformers.
3. ChromaDB retrieves semantically similar articles.
4. Retrieved evidence is provided to the LLM.
5. The LLM generates a fact-check verdict with reasoning.

## Example Output

```
Claim:
"Drinking hot water cures COVID-19"

Verdict:
False

Confidence:
High

Explanation:
Scientific studies and WHO reports indicate that drinking hot water does not prevent or cure COVID-19.
```

## API Endpoint

### Analyze News

```
POST /api/analyze
```

Request:

```
{
  "text": "news article or claim"
}
```

Response:

```
{
  "verdict": "Fake",
  "confidence": "High",
  "explanation": "Detailed reasoning with retrieved evidence"
}
```

## Future Improvements

* Multi-source verification
* Source credibility scoring
* Browser extension for fake news detection
* Real-time news monitoring
* Multilingual support
