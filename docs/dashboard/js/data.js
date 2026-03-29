/* ============================================
   CONTEXTFORGE DASHBOARD – MOCK DATA
   ============================================ */

// Helpers
function _daysAgo(d) {
  const dt = new Date();
  dt.setDate(dt.getDate() - d);
  dt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return dt.toISOString();
}

function _hoursAgo(h) {
  const dt = new Date();
  dt.setHours(dt.getHours() - h, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
  return dt.toISOString();
}

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'claude-3.5-sonnet', 'claude-3-haiku', 'gemini-1.5-pro', 'gemini-1.5-flash'];
const ENDPOINTS = ['/v1/chat/completions', '/v1/completions', '/v1/embeddings'];

// ─── MOCK REQUESTS (50 items) ───────────────────────────────
const MOCK_REQUESTS = [
  { id: 'req_a1b2c3d4', timestamp: _hoursAgo(0.2), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 1842, tokens_out: 512, latency_ms: 1243, cost: 0.0387, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_e5f6g7h8', timestamp: _hoursAgo(0.5), model: 'gpt-4o-mini', endpoint: '/v1/chat/completions', tokens_in: 423, tokens_out: 189, latency_ms: 312, cost: 0.0012, cache_status: 'HIT', similarity_score: 0.97, status: 200 },
  { id: 'req_i9j0k1l2', timestamp: _hoursAgo(0.8), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 2105, tokens_out: 743, latency_ms: 2156, cost: 0.0521, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_m3n4o5p6', timestamp: _hoursAgo(1.1), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 956, tokens_out: 287, latency_ms: 834, cost: 0.0198, cache_status: 'HIT', similarity_score: 0.94, status: 200 },
  { id: 'req_q7r8s9t0', timestamp: _hoursAgo(1.5), model: 'gemini-1.5-pro', endpoint: '/v1/chat/completions', tokens_in: 1567, tokens_out: 621, latency_ms: 1879, cost: 0.0312, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_u1v2w3x4', timestamp: _hoursAgo(2.0), model: 'claude-3-haiku', endpoint: '/v1/chat/completions', tokens_in: 324, tokens_out: 156, latency_ms: 198, cost: 0.0004, cache_status: 'HIT', similarity_score: 0.99, status: 200 },
  { id: 'req_y5z6a7b8', timestamp: _hoursAgo(2.3), model: 'gpt-4o-mini', endpoint: '/v1/completions', tokens_in: 712, tokens_out: 234, latency_ms: 445, cost: 0.0018, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_c9d0e1f2', timestamp: _hoursAgo(2.8), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 2341, tokens_out: 892, latency_ms: 2876, cost: 0.0612, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_g3h4i5j6', timestamp: _hoursAgo(3.2), model: 'gemini-1.5-flash', endpoint: '/v1/chat/completions', tokens_in: 543, tokens_out: 198, latency_ms: 267, cost: 0.0008, cache_status: 'HIT', similarity_score: 0.92, status: 200 },
  { id: 'req_k7l8m9n0', timestamp: _hoursAgo(3.6), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 1876, tokens_out: 654, latency_ms: 1923, cost: 0.0478, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_o1p2q3r4', timestamp: _hoursAgo(4.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 1123, tokens_out: 412, latency_ms: 1067, cost: 0.0267, cache_status: 'HIT', similarity_score: 0.95, status: 200 },
  { id: 'req_s5t6u7v8', timestamp: _hoursAgo(4.5), model: 'gpt-4o-mini', endpoint: '/v1/chat/completions', tokens_in: 287, tokens_out: 98, latency_ms: 187, cost: 0.0006, cache_status: 'HIT', similarity_score: 0.98, status: 200 },
  { id: 'req_w9x0y1z2', timestamp: _hoursAgo(5.0), model: 'claude-3-haiku', endpoint: '/v1/completions', tokens_in: 456, tokens_out: 167, latency_ms: 213, cost: 0.0005, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_a3b4c5d6', timestamp: _hoursAgo(5.5), model: 'gemini-1.5-pro', endpoint: '/v1/chat/completions', tokens_in: 1987, tokens_out: 756, latency_ms: 2234, cost: 0.0389, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_e7f8g9h0', timestamp: _hoursAgo(6.2), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 834, tokens_out: 312, latency_ms: 756, cost: 0.0178, cache_status: 'HIT', similarity_score: 0.91, status: 200 },
  { id: 'req_i1j2k3l4', timestamp: _hoursAgo(7.0), model: 'gpt-4o-mini', endpoint: '/v1/embeddings', tokens_in: 1245, tokens_out: 0, latency_ms: 134, cost: 0.0002, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_m5n6o7p8', timestamp: _hoursAgo(8.0), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 1654, tokens_out: 543, latency_ms: 1678, cost: 0.0398, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_q9r0s1t2', timestamp: _hoursAgo(9.5), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 765, tokens_out: 234, latency_ms: 623, cost: 0.0156, cache_status: 'HIT', similarity_score: 0.96, status: 200 },
  { id: 'req_u3v4w5x6', timestamp: _hoursAgo(10.0), model: 'gemini-1.5-flash', endpoint: '/v1/chat/completions', tokens_in: 432, tokens_out: 176, latency_ms: 234, cost: 0.0006, cache_status: 'HIT', similarity_score: 0.93, status: 200 },
  { id: 'req_y7z8a9b0', timestamp: _hoursAgo(11.0), model: 'claude-3-haiku', endpoint: '/v1/chat/completions', tokens_in: 567, tokens_out: 213, latency_ms: 289, cost: 0.0006, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_c1d2e3f4', timestamp: _hoursAgo(13.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 2456, tokens_out: 987, latency_ms: 3012, cost: 0.0678, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_g5h6i7j8', timestamp: _hoursAgo(15.0), model: 'gpt-4o-mini', endpoint: '/v1/chat/completions', tokens_in: 345, tokens_out: 123, latency_ms: 213, cost: 0.0007, cache_status: 'HIT', similarity_score: 0.97, status: 200 },
  { id: 'req_k9l0m1n2', timestamp: _hoursAgo(18.0), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 1432, tokens_out: 521, latency_ms: 1534, cost: 0.0356, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_o3p4q5r6', timestamp: _hoursAgo(20.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 987, tokens_out: 345, latency_ms: 892, cost: 0.0212, cache_status: 'HIT', similarity_score: 0.94, status: 200 },
  { id: 'req_s7t8u9v0', timestamp: _hoursAgo(22.0), model: 'gemini-1.5-pro', endpoint: '/v1/chat/completions', tokens_in: 1789, tokens_out: 678, latency_ms: 2089, cost: 0.0356, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_w1x2y3z4', timestamp: _hoursAgo(25.0), model: 'gpt-4o-mini', endpoint: '/v1/chat/completions', tokens_in: 534, tokens_out: 198, latency_ms: 367, cost: 0.0013, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_a5b6c7d8', timestamp: _hoursAgo(28.0), model: 'claude-3-haiku', endpoint: '/v1/chat/completions', tokens_in: 678, tokens_out: 234, latency_ms: 312, cost: 0.0007, cache_status: 'HIT', similarity_score: 0.96, status: 200 },
  { id: 'req_e9f0g1h2', timestamp: _hoursAgo(32.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 1345, tokens_out: 567, latency_ms: 1234, cost: 0.0312, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_i3j4k5l6', timestamp: _hoursAgo(36.0), model: 'gemini-1.5-flash', endpoint: '/v1/completions', tokens_in: 389, tokens_out: 145, latency_ms: 198, cost: 0.0005, cache_status: 'HIT', similarity_score: 0.91, status: 200 },
  { id: 'req_m7n8o9p0', timestamp: _hoursAgo(40.0), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 2012, tokens_out: 789, latency_ms: 2345, cost: 0.0523, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_q1r2s3t4', timestamp: _hoursAgo(44.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 1123, tokens_out: 432, latency_ms: 1056, cost: 0.0267, cache_status: 'HIT', similarity_score: 0.93, status: 200 },
  { id: 'req_u5v6w7x8', timestamp: _hoursAgo(48.0), model: 'gpt-4o-mini', endpoint: '/v1/embeddings', tokens_in: 876, tokens_out: 0, latency_ms: 98, cost: 0.0001, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_y9z0a1b2', timestamp: _hoursAgo(52.0), model: 'claude-3-haiku', endpoint: '/v1/chat/completions', tokens_in: 432, tokens_out: 167, latency_ms: 234, cost: 0.0005, cache_status: 'HIT', similarity_score: 0.98, status: 200 },
  { id: 'req_c3d4e5f6', timestamp: _hoursAgo(56.0), model: 'gemini-1.5-pro', endpoint: '/v1/chat/completions', tokens_in: 1567, tokens_out: 623, latency_ms: 1890, cost: 0.0312, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_g7h8i9j0', timestamp: _hoursAgo(60.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 876, tokens_out: 312, latency_ms: 789, cost: 0.0189, cache_status: 'HIT', similarity_score: 0.95, status: 200 },
  { id: 'req_k1l2m3n4', timestamp: _hoursAgo(65.0), model: 'gpt-4o-mini', endpoint: '/v1/chat/completions', tokens_in: 623, tokens_out: 234, latency_ms: 345, cost: 0.0014, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_o5p6q7r8', timestamp: _hoursAgo(70.0), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 1876, tokens_out: 698, latency_ms: 1987, cost: 0.0467, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_s9t0u1v2', timestamp: _hoursAgo(76.0), model: 'gemini-1.5-flash', endpoint: '/v1/chat/completions', tokens_in: 354, tokens_out: 134, latency_ms: 178, cost: 0.0004, cache_status: 'HIT', similarity_score: 0.94, status: 200 },
  { id: 'req_w3x4y5z6', timestamp: _hoursAgo(82.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 1678, tokens_out: 623, latency_ms: 1567, cost: 0.0378, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_a7b8c9d0', timestamp: _hoursAgo(88.0), model: 'claude-3-haiku', endpoint: '/v1/completions', tokens_in: 512, tokens_out: 189, latency_ms: 256, cost: 0.0005, cache_status: 'HIT', similarity_score: 0.92, status: 200 },
  { id: 'req_e1f2g3h4', timestamp: _hoursAgo(94.0), model: 'gpt-4o-mini', endpoint: '/v1/chat/completions', tokens_in: 789, tokens_out: 298, latency_ms: 412, cost: 0.0017, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_i5j6k7l8', timestamp: _hoursAgo(100.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 2134, tokens_out: 845, latency_ms: 2678, cost: 0.0567, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_m9n0o1p2', timestamp: _hoursAgo(108.0), model: 'gemini-1.5-pro', endpoint: '/v1/chat/completions', tokens_in: 1234, tokens_out: 498, latency_ms: 1456, cost: 0.0245, cache_status: 'HIT', similarity_score: 0.90, status: 200 },
  { id: 'req_q3r4s5t6', timestamp: _hoursAgo(116.0), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 1543, tokens_out: 567, latency_ms: 1678, cost: 0.0389, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_u7v8w9x0', timestamp: _hoursAgo(124.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 945, tokens_out: 367, latency_ms: 876, cost: 0.0213, cache_status: 'HIT', similarity_score: 0.96, status: 200 },
  { id: 'req_y1z2a3b4', timestamp: _hoursAgo(132.0), model: 'gemini-1.5-flash', endpoint: '/v1/embeddings', tokens_in: 654, tokens_out: 0, latency_ms: 87, cost: 0.0001, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_c5d6e7f8', timestamp: _hoursAgo(140.0), model: 'claude-3-haiku', endpoint: '/v1/chat/completions', tokens_in: 376, tokens_out: 145, latency_ms: 198, cost: 0.0004, cache_status: 'HIT', similarity_score: 0.97, status: 200 },
  { id: 'req_g9h0i1j2', timestamp: _hoursAgo(148.0), model: 'gpt-4o-mini', endpoint: '/v1/chat/completions', tokens_in: 567, tokens_out: 213, latency_ms: 289, cost: 0.0012, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_k3l4m5n6', timestamp: _hoursAgo(156.0), model: 'gpt-4o', endpoint: '/v1/chat/completions', tokens_in: 1876, tokens_out: 734, latency_ms: 2123, cost: 0.0489, cache_status: 'MISS', similarity_score: null, status: 200 },
  { id: 'req_o7p8q9r0', timestamp: _hoursAgo(164.0), model: 'claude-3.5-sonnet', endpoint: '/v1/chat/completions', tokens_in: 1234, tokens_out: 456, latency_ms: 1345, cost: 0.0312, cache_status: 'HIT', similarity_score: 0.93, status: 200 },
];

// ─── MOCK SUMMARY ────────────────────────────────────────────
const MOCK_SUMMARY = {
  total_requests: 12847,
  cache_hit_rate: 42.3,
  avg_latency_ms: 876,
  total_cost: 247.56,
  total_tokens: 1834521,
  requests_today: 342,
  cost_today: 18.43,
  avg_tokens_per_request: 142,
};

// ─── MOCK CACHE STATS ────────────────────────────────────────
const MOCK_CACHE_STATS = {
  total_entries: 1847,
  memory_used_mb: 234.5,
  memory_limit_mb: 512,
  hit_rate: 42.3,
  avg_similarity: 0.94,
  evictions_today: 23,
  ttl_default: 3600,
};

// ─── MOCK CACHE ENTRIES (20 items) ───────────────────────────
const MOCK_CACHE_ENTRIES = [
  { key: 'emb_7f2a9c3e', prompt_preview: 'Explain the concept of machine learning in simple terms...', model: 'gpt-4o', similarity: 0.98, hits: 47, created: _hoursAgo(2), ttl_remaining: 2890, ttl_total: 3600, size_kb: 12.4 },
  { key: 'emb_4b8d1e5f', prompt_preview: 'Write a Python function to sort a list using quicksort...', model: 'gpt-4o-mini', similarity: 0.96, hits: 34, created: _hoursAgo(5), ttl_remaining: 2100, ttl_total: 3600, size_kb: 8.7 },
  { key: 'emb_2c6f0a9d', prompt_preview: 'What are the benefits of using TypeScript over JavaScript...', model: 'claude-3.5-sonnet', similarity: 0.95, hits: 28, created: _hoursAgo(8), ttl_remaining: 1800, ttl_total: 3600, size_kb: 15.2 },
  { key: 'emb_9e3b7d1a', prompt_preview: 'Create a REST API endpoint for user authentication...', model: 'gpt-4o', similarity: 0.97, hits: 56, created: _hoursAgo(1), ttl_remaining: 3200, ttl_total: 3600, size_kb: 18.9 },
  { key: 'emb_5a1c8f4e', prompt_preview: 'How does garbage collection work in Go programming...', model: 'gemini-1.5-pro', similarity: 0.93, hits: 19, created: _hoursAgo(12), ttl_remaining: 1200, ttl_total: 3600, size_kb: 11.3 },
  { key: 'emb_8d2e6b0c', prompt_preview: 'Design a database schema for an e-commerce platform...', model: 'gpt-4o', similarity: 0.94, hits: 23, created: _hoursAgo(6), ttl_remaining: 2400, ttl_total: 3600, size_kb: 22.1 },
  { key: 'emb_1f7a3c5d', prompt_preview: 'Summarize the key principles of clean architecture...', model: 'claude-3-haiku', similarity: 0.99, hits: 67, created: _hoursAgo(0.5), ttl_remaining: 3400, ttl_total: 3600, size_kb: 6.8 },
  { key: 'emb_6b0d9e2a', prompt_preview: 'Write unit tests for a React component using Jest...', model: 'gpt-4o-mini', similarity: 0.92, hits: 15, created: _hoursAgo(16), ttl_remaining: 800, ttl_total: 3600, size_kb: 9.4 },
  { key: 'emb_3c8f1a7e', prompt_preview: 'Explain the difference between SQL and NoSQL databases...', model: 'gemini-1.5-flash', similarity: 0.96, hits: 41, created: _hoursAgo(3), ttl_remaining: 2700, ttl_total: 3600, size_kb: 7.6 },
  { key: 'emb_0d5e9b4c', prompt_preview: 'Implement a binary search tree in Java with insert...', model: 'gpt-4o', similarity: 0.91, hits: 12, created: _hoursAgo(20), ttl_remaining: 450, ttl_total: 3600, size_kb: 14.8 },
  { key: 'emb_7a2b6c1d', prompt_preview: 'What is the CAP theorem and how does it apply to...', model: 'claude-3.5-sonnet', similarity: 0.97, hits: 38, created: _hoursAgo(4), ttl_remaining: 2500, ttl_total: 3600, size_kb: 10.2 },
  { key: 'emb_4e8f2a3b', prompt_preview: 'Build a responsive navbar using CSS flexbox and media...', model: 'gpt-4o-mini', similarity: 0.94, hits: 25, created: _hoursAgo(9), ttl_remaining: 1600, ttl_total: 3600, size_kb: 5.9 },
  { key: 'emb_1b5c9d0e', prompt_preview: 'How to implement OAuth 2.0 with PKCE flow in a SPA...', model: 'gpt-4o', similarity: 0.95, hits: 31, created: _hoursAgo(7), ttl_remaining: 2000, ttl_total: 3600, size_kb: 16.7 },
  { key: 'emb_8a3d7e2f', prompt_preview: 'Explain Kubernetes pod lifecycle and container states...', model: 'gemini-1.5-pro', similarity: 0.93, hits: 18, created: _hoursAgo(14), ttl_remaining: 1000, ttl_total: 3600, size_kb: 13.5 },
  { key: 'emb_5c0e4b1a', prompt_preview: 'Write a shell script to automate Docker deployment...', model: 'claude-3-haiku', similarity: 0.98, hits: 52, created: _hoursAgo(1.5), ttl_remaining: 3100, ttl_total: 3600, size_kb: 4.3 },
  { key: 'emb_2d6f8c3e', prompt_preview: 'Compare microservices vs monolithic architecture for...', model: 'gpt-4o', similarity: 0.92, hits: 14, created: _hoursAgo(18), ttl_remaining: 600, ttl_total: 3600, size_kb: 19.8 },
  { key: 'emb_9b1a5d7c', prompt_preview: 'Implement rate limiting middleware in Express.js...', model: 'gpt-4o-mini', similarity: 0.96, hits: 36, created: _hoursAgo(3.5), ttl_remaining: 2600, ttl_total: 3600, size_kb: 8.1 },
  { key: 'emb_6e0f2a8d', prompt_preview: 'Design a CI/CD pipeline using GitHub Actions for a...', model: 'claude-3.5-sonnet', similarity: 0.94, hits: 22, created: _hoursAgo(10), ttl_remaining: 1400, ttl_total: 3600, size_kb: 11.9 },
  { key: 'emb_3a7b1c4e', prompt_preview: 'Explain the principles of functional programming with...', model: 'gemini-1.5-flash', similarity: 0.97, hits: 43, created: _hoursAgo(2.5), ttl_remaining: 2800, ttl_total: 3600, size_kb: 7.2 },
  { key: 'emb_0c4d8e5f', prompt_preview: 'Write a GraphQL schema for a social media application...', model: 'gpt-4o', similarity: 0.95, hits: 29, created: _hoursAgo(6.5), ttl_remaining: 2200, ttl_total: 3600, size_kb: 20.4 },
];

// ─── MOCK DAILY STATS (14 days) ──────────────────────────────
const MOCK_DAILY_STATS = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const base = 800 + Math.floor(Math.random() * 400);
  const hits = Math.floor(base * (0.35 + Math.random() * 0.2));
  return {
    date: d.toISOString().split('T')[0],
    total_requests: base,
    cache_hits: hits,
    cache_misses: base - hits,
    avg_latency_ms: 600 + Math.floor(Math.random() * 500),
    total_cost: +(12 + Math.random() * 15).toFixed(2),
    total_tokens: 80000 + Math.floor(Math.random() * 60000),
  };
});

// ─── MOCK ROUTER CATEGORIES (8 items) ────────────────────────
const MOCK_ROUTER_CATEGORIES = [
  { category: 'Code Generation', model_assigned: 'gpt-4o', requests: 3421, accuracy: 94.2, avg_latency_ms: 1456, avg_cost: 0.042 },
  { category: 'Summarization', model_assigned: 'claude-3-haiku', requests: 2876, accuracy: 91.8, avg_latency_ms: 312, avg_cost: 0.006 },
  { category: 'Translation', model_assigned: 'gemini-1.5-flash', requests: 1987, accuracy: 88.5, avg_latency_ms: 234, avg_cost: 0.004 },
  { category: 'Analysis', model_assigned: 'claude-3.5-sonnet', requests: 1654, accuracy: 96.1, avg_latency_ms: 1876, avg_cost: 0.048 },
  { category: 'Q&A', model_assigned: 'gpt-4o-mini', requests: 1432, accuracy: 89.7, avg_latency_ms: 345, avg_cost: 0.012 },
  { category: 'Creative Writing', model_assigned: 'gpt-4o', requests: 876, accuracy: 92.4, avg_latency_ms: 2123, avg_cost: 0.056 },
  { category: 'Data Extraction', model_assigned: 'gemini-1.5-pro', requests: 423, accuracy: 90.3, avg_latency_ms: 567, avg_cost: 0.018 },
  { category: 'Classification', model_assigned: 'claude-3-haiku', requests: 178, accuracy: 95.6, avg_latency_ms: 187, avg_cost: 0.003 },
];

// ─── BACKEND FIELD ENRICHMENT ────────────────────────────────
// Adds backend-compatible fields (request_id, model_used, cache_hit,
// prompt_tokens, completion_tokens, estimated_cost_usd, latency_ms,
// compressed, compression_ratio) and camelCase aliases (modelUsed,
// cacheHit, latencyMs, estimatedCostUsd, promptTokens, completionTokens,
// tier, compressed) to every mock record.
MOCK_REQUESTS.forEach(r => {
  r.request_id = r.id;
  r.model_requested = r.model;
  r.model_used = r.model;
  r.modelUsed = r.model;
  r.cache_hit = r.cache_status === 'HIT';
  r.cacheHit = r.cache_hit;
  r.prompt_tokens = r.tokens_in;
  r.promptTokens = r.tokens_in;
  r.completion_tokens = r.tokens_out;
  r.completionTokens = r.tokens_out;
  r.estimated_cost_usd = r.cost;
  r.estimatedCostUsd = r.cost;
  r.latencyMs = r.latency_ms;
  r.compressed = false;
  r.compression_ratio = 1.0;
  r.tier = r.tokens_in > 1000 ? 'complex' : 'simple';
});

// Summary aliases
MOCK_SUMMARY.totalRequests = MOCK_SUMMARY.total_requests;
MOCK_SUMMARY.cacheHitRate = MOCK_SUMMARY.cache_hit_rate;
MOCK_SUMMARY.avgLatencyMs = MOCK_SUMMARY.avg_latency_ms;
MOCK_SUMMARY.totalCostUsd = MOCK_SUMMARY.total_cost;
MOCK_SUMMARY.total_cost_usd = MOCK_SUMMARY.total_cost;
MOCK_SUMMARY.costSaved = 89.32;
MOCK_SUMMARY.cache_hits = Math.round(MOCK_SUMMARY.total_requests * MOCK_SUMMARY.cache_hit_rate / 100);

// Cache entry aliases
MOCK_CACHE_ENTRIES.forEach(e => {
  e.hitCount = e.hits;
  e.ttlHours = +(e.ttl_total / 3600).toFixed(1);
});
