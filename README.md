# ContextForge

> Proxy middleware for LLM-powered apps — semantic caching, model routing, and context compression with zero code changes.

[![CI](https://github.com/aayush-1o/contextforge/actions/workflows/ci.yml/badge.svg)](https://github.com/aayush-1o/contextforge/actions/workflows/ci.yml)

---

## What is ContextForge?

ContextForge is a local-first proxy middleware layer that sits between your LLM-powered application and upstream providers (OpenAI, Anthropic). It exposes an **OpenAI-compatible REST API** so existing apps can point at it with zero code changes, then applies three optimizations transparently:

| Optimization            | What it does                                                  | Benefit                     |
|-------------------------|---------------------------------------------------------------|-----------------------------|
| **Semantic Caching**    | Detects near-duplicate prompts and returns cached responses    | Reduce API costs & latency  |
| **Context Compression** | Summarizes long conversation histories before forwarding       | Lower token usage           |
| **Model Routing**       | Routes simple queries to cheaper models, complex to capable    | Optimize cost/quality       |

Every request is tracked with per-request telemetry (model, latency, cost, cache hit) stored in a local SQLite database.

---

## Architecture

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

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full architecture document.

---

## Tech Stack

- **FastAPI** — async Python web framework
- **sentence-transformers/all-MiniLM-L6-v2** — local CPU embeddings (384-dim)
- **FAISS** — in-process vector similarity search
- **Redis 7** — cache key-value store
- **SQLite** — telemetry database (via SQLModel)
- **Docker + Docker Compose** — containerized deployment

---

## Quick Start

### Prerequisites
- Docker & Docker Compose
- OpenAI and/or Anthropic API key(s)

### Setup

```bash
# Clone the repository
git clone https://github.com/aayush-1o/contextforge.git
cd contextforge

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start services
docker compose up --build -d

# Verify
curl http://localhost:8000/health
```

### Usage

Point your OpenAI SDK at ContextForge:

```python
import openai

client = openai.OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="your-openai-key",
)

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## Project Structure

```
contextforge/
├── app/                    # Application source code
│   ├── main.py             # FastAPI entry point
│   ├── proxy.py            # Upstream LLM forwarding
│   ├── models.py           # Pydantic request/response schemas
│   ├── cache.py            # Semantic cache logic
│   ├── embedder.py         # Embedding model wrapper
│   ├── vector_store.py     # FAISS wrapper
│   ├── router.py           # Model complexity router
│   ├── compressor.py       # Context compressor
│   ├── telemetry.py        # SQLite telemetry writer/reader
│   ├── middleware.py       # Request wrapping middleware
│   └── config.py           # Pydantic Settings config
├── config/                 # Configuration files
│   └── routing_rules.yaml  # Model routing rules
├── tests/                  # Test suite
├── benchmarks/             # Performance benchmarks
├── docs/                   # Documentation
├── docker-compose.yml      # Docker services
├── Dockerfile              # App container
└── requirements.txt        # Pinned dependencies
```

---

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — system design, component diagram, telemetry schema
- [API Reference](docs/API.md) — endpoint documentation
- [Configuration](docs/CONFIGURATION.md) — environment variables and config options
- [Decisions](DECISIONS.md) — architecture decision records (ADRs)
- [Contributing](CONTRIBUTING.md) — contribution guidelines
- [Changelog](CHANGELOG.md) — version history

---

## Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run linter
ruff check app/ tests/ benchmarks/

# Run tests
pytest tests/

# Start locally (requires Redis running)
uvicorn app.main:app --reload --port 8000
```

---

## License

MIT
