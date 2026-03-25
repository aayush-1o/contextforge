# ContextForge Architecture

## System Overview

ContextForge is a proxy middleware layer that sits between any LLM-powered application and upstream providers (OpenAI, Anthropic). It exposes an OpenAI-compatible REST API (`POST /v1/chat/completions`) so existing apps can point at it with zero code changes, then applies three optimizations before forwarding requests upstream:

1. **Semantic Caching** — Embeds the prompt, searches a FAISS vector index for near-duplicates, and returns a cached response from Redis on a hit (similarity ≥ threshold).
2. **Context Compression** — Summarizes long conversation histories to reduce token usage while preserving meaning.
3. **Model Routing** — Classifies prompt complexity and routes simple queries to cheaper models, complex queries to more capable ones.

Every request is tracked with per-request telemetry written to a local SQLite database.

---

## Component Diagram

```
[ App / SDK ] → POST /v1/chat/completions
     ↓
[ ContextForge API Gateway ]
     ↓
┌───────────────────────────────┐
│     Optimization Pipeline     │
│  1. Semantic Cache Lookup     │
│  2. Context Compressor        │
│  3. Model Router              │
└───────────────────────────────┘
     ↓               ↗ (cache hit)
[ Upstream LLM API ]   [ Redis / FAISS ]
     ↓
[ Telemetry → SQLite ]
```

---

## Layer Responsibilities

| # | Layer               | Responsibility                                              |
|---|---------------------|-------------------------------------------------------------|
| 1 | API Gateway         | FastAPI — receives and validates OpenAI-compatible requests  |
| 2 | Optimization Pipeline | Applies cache lookup, context compression, model routing in sequence |
| 3 | Proxy Layer         | Forwards processed requests to OpenAI / Anthropic            |
| 4 | Storage Layer       | Redis (cache KV + vector metadata), FAISS (vector index), SQLite (telemetry) |
| 5 | Embedding Service   | Local sentence-transformers model (all-MiniLM-L6-v2)        |

---

## Telemetry Schema (SQLite)

```sql
CREATE TABLE telemetry (
    id                  INTEGER PRIMARY KEY,
    request_id          TEXT UNIQUE,
    timestamp           DATETIME,
    model_requested     TEXT,
    model_used          TEXT,
    cache_hit           BOOLEAN,
    similarity_score    REAL,
    prompt_tokens       INTEGER,
    completion_tokens   INTEGER,
    estimated_cost_usd  REAL,
    latency_ms          REAL,
    compressed          BOOLEAN,
    compression_ratio   REAL
);
```

---

## Key Architecture Decisions

| ADR   | Decision                          | Rationale                                        |
|-------|-----------------------------------|--------------------------------------------------|
| ADR-001 | FAISS over Qdrant for MVP       | Zero infra overhead; upgrade path to Qdrant documented |
| ADR-002 | Rule-based classifier first     | No labeled data required; ships faster than ML   |
| ADR-003 | SQLite for telemetry            | No Postgres infra for solo dev MVP               |
| ADR-004 | all-MiniLM-L6-v2 embeddings    | CPU-fast, 384-dim, sufficient for semantic similarity |

Full ADR details are in [DECISIONS.md](../DECISIONS.md).

---

## Technology Stack

- **Web Framework:** FastAPI (Python, async-first)
- **Embedding Model:** sentence-transformers/all-MiniLM-L6-v2 (local, CPU-runnable)
- **Vector Index:** FAISS (in-process, Flat for MVP)
- **Cache Store:** Redis 7
- **Telemetry DB:** SQLite (via SQLModel/SQLAlchemy)
- **LLM SDKs:** openai-python + anthropic-python (version-pinned)
- **Complexity Classifier:** Rule-based heuristics (token count + keywords)
- **Config:** Pydantic Settings + .env
- **Testing:** pytest + httpx + pytest-asyncio
- **Containerization:** Docker + Docker Compose
- **Logging:** structlog (structured JSON logs)
