# Architecture Decision Records

## ADR-001: FAISS over Qdrant for MVP

**Status:** Accepted  
**Date:** 2025-03-25

### Context
We need a vector index to store and search prompt embeddings for semantic cache lookups. Two primary options were evaluated:
- **FAISS** — Facebook's in-process vector similarity search library
- **Qdrant** — A dedicated vector database requiring a separate service

### Decision
Use **FAISS** (Flat index) for the MVP.

### Rationale
- **Zero infrastructure:** FAISS runs in-process — no additional service to deploy, monitor, or scale
- **Simplicity:** A flat index is trivial to implement and debug for MVP-scale data
- **Performance:** For sub-100K vectors, FAISS Flat is fast enough without approximate indexing
- **CPU-only:** No GPU required, aligns with local-first constraint

### Upgrade Path
When the vector count surpasses ~100K or we need persistence/filtering, migrate to Qdrant:
1. Add `qdrant` service to `docker-compose.yml`
2. Swap `app/vector_store.py` implementation (interface remains the same)
3. One-time re-indexing of cached embeddings

---

## ADR-002: Rule-Based Classifier First

**Status:** Accepted  
**Date:** 2025-03-25

### Context
Model routing requires classifying prompt complexity (simple vs. complex) to select the optimal model. Options:
- **Rule-based:** Token count thresholds + keyword matching
- **ML-based:** Fine-tuned classifier on labeled prompt data

### Decision
Use **rule-based heuristics** for the initial implementation.

### Rationale
- **No labeled data required:** ML classifiers need a labeled dataset that doesn't exist yet
- **Ships faster:** Rules can be defined and tuned immediately via `config/routing_rules.yaml`
- **Transparency:** Rules are inspectable and debuggable — no black-box predictions
- **Good enough:** For the MVP, token count + keyword lists capture 80%+ of routing decisions

### Upgrade Path
After accumulating telemetry data with the rule-based router, use it as labeled training data for an ML classifier in a future phase.

---

## ADR-003: SQLite for Telemetry

**Status:** Accepted  
**Date:** 2025-03-25

### Context
We need persistent storage for per-request telemetry data (model used, latency, cost, cache hits). Options:
- **PostgreSQL** — Full-featured relational database
- **SQLite** — Embedded, serverless database

### Decision
Use **SQLite** via SQLModel/SQLAlchemy.

### Rationale
- **Zero infrastructure:** No database server to provision, configure, or maintain
- **Solo developer:** For a single-instance MVP, SQLite's concurrency limitations are irrelevant
- **Portable:** The telemetry database is a single file, easy to back up or inspect
- **SQLModel compatibility:** SQLModel/SQLAlchemy abstracts the engine — migration to Postgres requires only a connection string change

### Upgrade Path
When scaling beyond a single instance or needing concurrent write access:
1. Add `postgres` service to `docker-compose.yml`
2. Change `SQLITE_DB_PATH` to a `DATABASE_URL` connection string
3. Run Alembic migrations

---

## ADR-004: all-MiniLM-L6-v2 as Embedding Model

**Status:** Accepted  
**Date:** 2025-03-25

### Context
Semantic caching requires an embedding model to convert prompts into dense vectors for similarity search. Key requirements:
- Must run locally on CPU (no GPU, no API calls)
- Must be fast enough for real-time inference on every request
- Embedding dimensionality should balance quality vs. index size

### Decision
Use **sentence-transformers/all-MiniLM-L6-v2**.

### Rationale
- **CPU-fast:** ~14ms per embedding on CPU — negligible latency overhead
- **Small footprint:** 80MB model, 384-dimensional output vectors
- **Quality:** Achieves strong performance on semantic textual similarity benchmarks (STS-B)
- **Well-supported:** Part of the sentence-transformers library with extensive documentation
- **Proven:** Widely used in production semantic search and caching systems

### Upgrade Path
If higher embedding quality is needed for domain-specific prompts:
1. Evaluate larger models (e.g., all-mpnet-base-v2 at 768-dim)
2. Fine-tune on domain-specific prompt pairs
3. Update `FAISS_INDEX_PATH` dimension parameter and re-index
