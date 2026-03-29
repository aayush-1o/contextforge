# Local Development Setup

> Step-by-step guide to get ContextForge running on your machine.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Python | 3.11+ | `python --version` |
| pip | Latest | `pip --version` |
| Docker | Any recent | `docker --version` |
| Git | Any recent | `git --version` |

> **Note:** Docker is only needed for Redis. If you have Redis installed natively, Docker is optional.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Ayush-o1/contextforge.git
cd contextforge
```

## 2. Create a Virtual Environment

```bash
python -m venv .venv
source .venv/bin/activate   # macOS / Linux
# .venv\Scripts\activate    # Windows
```

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs FastAPI, sentence-transformers, FAISS, Redis client, tiktoken, and all other dependencies. The first run will also download the `all-MiniLM-L6-v2` embedding model (~80 MB).

## 4. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-your-key-here
```

> **Tip:** You do NOT need an API key to run the test suite. All 84 tests use mocked fixtures.

For the full list of environment variables, see [CONFIGURATION.md](CONFIGURATION.md).

## 5. Start Redis

```bash
docker run -d --name contextforge-redis -p 6379:6379 redis:7-alpine
```

Verify Redis is running:

```bash
redis-cli ping
# → PONG
```

## 6. Start the Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Verify the server is up:

```bash
curl http://localhost:8000/health
# → {"status":"ok","version":"0.7.0"}
```

## 7. Open the Dashboard

Open `docs/dashboard/index.html` in your browser. If the backend is running, it connects automatically and shows **API Connected**. If the backend is down, it falls back to mock data.

---

## Running Tests

Tests require no running services and no API key:

```bash
# Lint check
ruff check app/ tests/ benchmarks/

# Run all tests (84 tests)
PYTHONPATH=. pytest tests/ -v
```

---

## Docker Setup (Alternative)

If you prefer running everything in Docker:

```bash
cp .env.example .env
# Add your OPENAI_API_KEY to .env

docker compose up --build -d

# Verify
curl http://localhost:8000/health
```

This starts both the ContextForge server and Redis.

---

## Troubleshooting

If you run into issues, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).
