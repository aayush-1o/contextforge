"""FastAPI application entry point for ContextForge."""

from __future__ import annotations

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, StreamingResponse

from app.config import Settings, get_settings
from app.models import ChatCompletionRequest, HealthResponse
from app.proxy import ProxyClient, UpstreamError

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application lifecycle — initialize and teardown resources."""
    settings: Settings = get_settings()

    proxy_client = ProxyClient(settings)
    application.state.proxy_client = proxy_client
    application.state.settings = settings

    logger.info("contextforge.started", log_level=settings.log_level)
    yield

    await proxy_client.close()
    logger.info("contextforge.shutdown")


app = FastAPI(
    title="ContextForge",
    description="Proxy middleware for LLM-powered apps",
    version="0.1.0",
    lifespan=lifespan,
)


# ───────────────────────── Health Check ──────────────────────────────────


@app.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Simple health check endpoint."""
    return HealthResponse()


# ─────────────────── Chat Completions Endpoint ───────────────────────────


@app.post("/v1/chat/completions", response_model=None)
async def chat_completions(request: Request, body: ChatCompletionRequest):
    """OpenAI-compatible chat completions endpoint.

    Validates the request, forwards it upstream to OpenAI, and returns
    the response. Supports both streaming and non-streaming modes.
    """
    proxy_client: ProxyClient = request.app.state.proxy_client

    try:
        if body.stream:
            return StreamingResponse(
                proxy_client.forward_stream(body),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no",
                },
            )

        response_data = await proxy_client.forward(body)
        return JSONResponse(content=response_data)

    except UpstreamError as exc:
        logger.warning("upstream.error", status_code=exc.status_code, detail=exc.detail)
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": {
                    "message": exc.detail,
                    "type": "upstream_error",
                    "code": str(exc.status_code),
                }
            },
        )
