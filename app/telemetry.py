import sqlite3
import threading
from typing import Any

DB_PATH = "telemetry.db"
_lock = threading.Lock()


def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS records (
                request_id TEXT PRIMARY KEY,
                timestamp TEXT,
                model_requested TEXT,
                model_used TEXT,
                cache_hit INTEGER,
                similarity_score REAL,
                prompt_tokens INTEGER,
                completion_tokens INTEGER,
                estimated_cost_usd REAL,
                latency_ms REAL,
                compressed INTEGER,
                compression_ratio REAL
            )
        """)
        conn.commit()


def write_record(record: dict[str, Any]):
    with _lock:
        try:
            with sqlite3.connect(DB_PATH) as conn:
                conn.execute("""
                    INSERT OR IGNORE INTO records VALUES (
                        :request_id, :timestamp, :model_requested, :model_used,
                        :cache_hit, :similarity_score, :prompt_tokens,
                        :completion_tokens, :estimated_cost_usd, :latency_ms,
                        :compressed, :compression_ratio
                    )
                """, record)
                conn.commit()
        except Exception:
            pass


def get_records() -> list[dict[str, Any]]:
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM records").fetchall()
        return [dict(row) for row in rows]


def get_summary() -> dict[str, Any]:
    records = get_records()
    if not records:
        return {"total_requests": 0, "cache_hit_rate": 0.0, "total_cost_usd": 0.0}
    total = len(records)
    hits = sum(1 for r in records if r["cache_hit"])
    cost = sum(r["estimated_cost_usd"] for r in records)
    return {
        "total_requests": total,
        "cache_hit_rate": hits / total,
        "total_cost_usd": round(cost, 6),
    }
