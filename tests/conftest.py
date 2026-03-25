"""Shared test fixtures for ContextForge test suite."""

from __future__ import annotations

import json
from pathlib import Path
from unittest.mock import AsyncMock

import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import app
from app.proxy import ProxyClient

FIXTURES_DIR = Path(__file__).parent.parent / "fixtures" / "openai_responses"


@pytest.fixture
def fixture_dir() -> Path:
    """Return the path to the fixtures directory."""
    return FIXTURES_DIR


@pytest.fixture
def chat_completion_fixture() -> dict:
    """Load the non-streaming chat completion fixture."""
    return json.loads((FIXTURES_DIR / "chat_completion.json").read_text())


@pytest.fixture
def stream_chunks_fixture() -> list[dict]:
    """Load the streaming chat completion chunks fixture."""
    return json.loads((FIXTURES_DIR / "chat_completion_stream.json").read_text())


@pytest.fixture
def error_429_fixture() -> dict:
    """Load the 429 rate limit error fixture."""
    return json.loads((FIXTURES_DIR / "error_429.json").read_text())


@pytest.fixture
def test_settings() -> Settings:
    """Return test settings with dummy keys."""
    return Settings(
        openai_api_key="sk-test-key-123",
        anthropic_api_key="sk-ant-test-123",
        openai_base_url="https://api.openai.com/v1",
        log_level="DEBUG",
    )


@pytest.fixture
def mock_proxy_client() -> AsyncMock:
    """Return a mocked ProxyClient."""
    client = AsyncMock(spec=ProxyClient)
    client.close = AsyncMock()
    return client


@pytest.fixture
def test_client(mock_proxy_client: AsyncMock, test_settings: Settings) -> TestClient:
    """Return a FastAPI TestClient with mocked proxy."""
    app.state.proxy_client = mock_proxy_client
    app.state.settings = test_settings

    return TestClient(app, raise_server_exceptions=False)


@pytest.fixture
def sample_request_body() -> dict:
    """A minimal valid chat completion request body."""
    return {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hello!"}],
    }


@pytest.fixture
def sample_streaming_request_body() -> dict:
    """A minimal valid streaming chat completion request body."""
    return {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": "Hello!"}],
        "stream": True,
    }
