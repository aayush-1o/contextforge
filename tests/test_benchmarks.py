"""Tests for benchmark utility functions.

All tests are fixture-based — no live server required.
"""

from __future__ import annotations

import json

import pytest

from benchmarks.benchmark_utils import (
    BenchmarkResult,
    compute_latency_stats,
    compute_routing_accuracy,
    paraphrase,
)

# ── Paraphrase ───────────────────────────────────────────────────────────


class TestParaphrase:
    """Tests for the paraphrase() function."""

    def test_paraphrase_function(self):
        """paraphrase() correctly swaps at least one synonym or modifies text."""
        original = "What is the capital of France?"
        result = paraphrase(original)
        assert result != original
        assert len(result) > 0

    def test_paraphrase_with_known_synonym(self):
        """Paraphrase swaps 'explain' with a known synonym."""
        original = "Explain how photosynthesis works"
        result = paraphrase(original)
        # The result should be different from original (lowercased)
        assert result.lower() != original.lower()

    def test_paraphrase_fallback_when_no_synonym(self):
        """Paraphrase adds a suffix when no synonym matches."""
        original = "Hello world"
        result = paraphrase(original)
        assert result.lower() != original.lower()
        assert len(result) > len("hello world")


# ── Latency Stats ────────────────────────────────────────────────────────


class TestLatencyStats:
    """Tests for compute_latency_stats()."""

    def test_latency_stats_p50(self):
        """p50 calculation is correct for a simple list."""
        latencies = list(range(1, 101))  # 1 to 100
        stats = compute_latency_stats([float(x) for x in latencies])
        # p50 of 1..100 should be ~50.5
        assert 49.0 <= stats.p50_ms <= 52.0

    def test_latency_stats_p95(self):
        """p95 calculation is correct."""
        latencies = [float(x) for x in range(1, 101)]
        stats = compute_latency_stats(latencies)
        # p95 of 1..100 should be ~95.05
        assert 94.0 <= stats.p95_ms <= 96.5

    def test_latency_stats_p99(self):
        """p99 calculation is correct."""
        latencies = [float(x) for x in range(1, 101)]
        stats = compute_latency_stats(latencies)
        # p99 of 1..100 should be ~99.01
        assert 98.0 <= stats.p99_ms <= 100.5

    def test_latency_stats_min_max(self):
        """min and max are correct."""
        latencies = [10.0, 200.0, 50.0, 300.0, 1.0]
        stats = compute_latency_stats(latencies)
        assert stats.min_ms == 1.0
        assert stats.max_ms == 300.0

    def test_latency_stats_empty(self):
        """Empty list returns all zeros."""
        stats = compute_latency_stats([])
        assert stats.p50_ms == 0
        assert stats.p95_ms == 0
        assert stats.min_ms == 0

    def test_latency_stats_single_value(self):
        """Single value returns that value for all percentiles."""
        stats = compute_latency_stats([42.0])
        assert stats.p50_ms == 42.0
        assert stats.p95_ms == 42.0
        assert stats.p99_ms == 42.0
        assert stats.min_ms == 42.0
        assert stats.max_ms == 42.0


# ── Routing Accuracy ─────────────────────────────────────────────────────


class TestRoutingAccuracy:
    """Tests for compute_routing_accuracy()."""

    def test_routing_accuracy_calculation(self):
        """Given predictions vs labels, accuracy is calculated correctly."""
        predictions = ["simple", "complex", "simple", "complex", "simple"]
        labels = ["simple", "complex", "complex", "complex", "simple"]
        result = compute_routing_accuracy(predictions, labels)
        # 4 out of 5 correct
        assert result.accuracy == pytest.approx(0.8, abs=0.01)
        assert result.total == 5
        assert result.correct == 4

    def test_confusion_matrix_structure(self):
        """Confusion matrix has correct keys (TP, TN, FP, FN)."""
        predictions = ["simple", "complex"]
        labels = ["simple", "complex"]
        result = compute_routing_accuracy(predictions, labels)
        cm = result.confusion_matrix
        assert "TP" in cm
        assert "TN" in cm
        assert "FP" in cm
        assert "FN" in cm
        assert cm["TP"] == 1  # simple correctly predicted
        assert cm["TN"] == 1  # complex correctly predicted
        assert cm["FP"] == 0
        assert cm["FN"] == 0

    def test_routing_accuracy_perfect(self):
        """100% accuracy when all predictions match."""
        labels = ["simple"] * 50 + ["complex"] * 50
        result = compute_routing_accuracy(labels, labels)
        assert result.accuracy == 1.0

    def test_routing_accuracy_mismatched_lengths(self):
        """Raises ValueError when predictions and labels have different lengths."""
        with pytest.raises(ValueError):
            compute_routing_accuracy(["simple"], ["simple", "complex"])


# ── BenchmarkResult ──────────────────────────────────────────────────────


class TestBenchmarkResult:
    """Tests for BenchmarkResult serialization."""

    def test_benchmark_result_json_serializable(self):
        """BenchmarkResult dataclass is JSON serializable via to_dict()."""
        result = BenchmarkResult(
            timestamp="2025-01-01T00:00:00",
            cache_hit_rate=0.52,
            avg_latency_miss_ms=450.0,
            avg_latency_hit_ms=25.0,
            speedup_factor=18.0,
            routing_accuracy=0.88,
            routing_confusion_matrix={"TP": 400, "TN": 480, "FP": 50, "FN": 70},
            latency_stats={"p50_ms": 100.0, "p95_ms": 500.0, "p99_ms": 800.0, "min_ms": 10.0, "max_ms": 1200.0},
        )
        # Must not raise
        serialized = json.dumps(result.to_dict())
        deserialized = json.loads(serialized)
        assert deserialized["cache_hit_rate"] == 0.52
        assert deserialized["routing_accuracy"] == 0.88
        assert "TP" in deserialized["routing_confusion_matrix"]

    def test_benchmark_result_default_values(self):
        """BenchmarkResult with defaults is JSON serializable."""
        result = BenchmarkResult(timestamp="2025-01-01T00:00:00")
        serialized = json.dumps(result.to_dict())
        assert "assertions_passed" in serialized
