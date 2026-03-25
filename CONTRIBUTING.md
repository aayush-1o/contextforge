# Contributing to ContextForge

Thank you for your interest in contributing to ContextForge!

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aayush-1o/contextforge.git
   cd contextforge
   ```

2. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

## Branch Strategy

- `main` — protected, production-ready releases
- `develop` — integration branch for feature work
- `phase/*` — phase-specific feature branches (branched from `develop`)

## Code Style

- **Linter:** ruff (configured in `pyproject.toml`)
- **Line length:** 120 characters
- Run before committing: `ruff check app/ tests/ benchmarks/`

## Testing

```bash
pytest tests/ -v
```

All tests must be fixture-based — no real API calls.

## Pull Requests

1. Branch from `develop`
2. Write tests for new functionality
3. Ensure lint and tests pass
4. Open a PR against `develop`
