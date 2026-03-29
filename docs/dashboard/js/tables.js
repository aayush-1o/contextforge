/* ============================================
   CONTEXTFORGE DASHBOARD – TABLE RENDERING
   ============================================ */

// ─── PAGINATION STATE ────────────────────────────────────────
let _currentPage = 1;
const _pageSize = 10;
let _searchTerm = '';
let _filterModel = '';
let _filterStatus = '';

// ─── FILTER ──────────────────────────────────────────────────
function getFilteredRequests(requests) {
  return requests.filter(r => {
    const rid = r.id || r.request_id || '';
    const rmodel = r.model || r.model_used || '';
    const endpoint = r.endpoint || '';
    const cacheHit = r.cacheHit != null ? r.cacheHit : r.cache_hit;
    const cacheStatus = r.cache_status || (cacheHit ? 'HIT' : 'MISS');
    if (_searchTerm) {
      const q = _searchTerm.toLowerCase();
      const match = rid.toLowerCase().includes(q) ||
                    rmodel.toLowerCase().includes(q) ||
                    endpoint.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (_filterModel && rmodel !== _filterModel) return false;
    if (_filterStatus && cacheStatus !== _filterStatus) return false;
    return true;
  });
}

// ─── REQUESTS TABLE ──────────────────────────────────────────
function renderRequestsTable(requests) {
  const filtered = getFilteredRequests(requests);
  const totalPages = Math.max(1, Math.ceil(filtered.length / _pageSize));
  if (_currentPage > totalPages) _currentPage = totalPages;

  const start = (_currentPage - 1) * _pageSize;
  const pageItems = filtered.slice(start, start + _pageSize);

  const tbody = document.getElementById('req-tbody');
  if (!tbody) return;

  if (pageItems.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--text-tertiary)">No requests match your filters</td></tr>`;
  } else {
    tbody.innerHTML = pageItems.map(r => {
      const rid = r.id || r.request_id || '';
      const rmodel = r.model || r.model_used || '';
      const lat = r.latency != null ? r.latency : (r.latency_ms || 0);
      const rcost = r.cost != null ? r.cost : (r.estimated_cost_usd || 0);
      const cacheHit = r.cacheHit != null ? r.cacheHit : r.cache_hit;
      const cacheStatus = r.cache_status || (cacheHit ? 'HIT' : 'MISS');
      const tIn = r.tokens_in || r.prompt_tokens || 0;
      const tOut = r.tokens_out || r.completion_tokens || 0;
      const tokens = r.tokens != null ? r.tokens : (tIn + tOut);
      const endpoint = r.endpoint || '/v1/chat/completions';
      const sim = r.similarity_score != null ? r.similarity_score : (r.similarity || null);
      const latencyClass = lat < 500 ? 'latency-fast' : lat < 1500 ? 'latency-medium' : 'latency-slow';
      const pillClass = cacheHit ? 'hit' : 'miss';
      const simText = sim !== null && sim !== undefined ? (sim * 100).toFixed(0) + '%' : '—';

      return `<tr>
        <td>
          <span class="mono">${rid.slice(0, 12)}</span>
          <button class="copy-btn" onclick="copyToClipboard('${rid}', this)" title="Copy ID">⧉</button>
        </td>
        <td>${timeAgo(r.timestamp)}</td>
        <td>${rmodel}</td>
        <td class="mono text-muted">${endpoint.split('/').pop()}</td>
        <td>${tIn.toLocaleString()} / ${tOut.toLocaleString()}</td>
        <td class="${latencyClass}">${formatLatency(lat)}</td>
        <td>${formatCost(rcost)}</td>
        <td><span class="pill ${pillClass}">${cacheStatus}</span> ${simText !== '—' ? `<span class="text-muted" style="font-size:0.7rem;margin-left:4px">${simText}</span>` : ''}</td>
      </tr>`;
    }).join('');
  }

  // Pagination info
  const info = document.getElementById('page-info');
  if (info) {
    const end = Math.min(start + _pageSize, filtered.length);
    info.textContent = filtered.length === 0
      ? 'No results'
      : `${start + 1}–${end} of ${filtered.length}`;
  }

  // Button states
  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');
  if (prevBtn) prevBtn.disabled = _currentPage <= 1;
  if (nextBtn) nextBtn.disabled = _currentPage >= totalPages;
}

// ─── PAGINATION CONTROLS ─────────────────────────────────────
function prevPage(requests) {
  if (_currentPage > 1) {
    _currentPage--;
    renderRequestsTable(requests);
  }
}

function nextPage(requests) {
  const filtered = getFilteredRequests(requests);
  const totalPages = Math.ceil(filtered.length / _pageSize);
  if (_currentPage < totalPages) {
    _currentPage++;
    renderRequestsTable(requests);
  }
}

function resetFilters() {
  _searchTerm = '';
  _filterModel = '';
  _filterStatus = '';
  _currentPage = 1;
  const searchEl = document.getElementById('req-search');
  const modelEl = document.getElementById('filter-model');
  const statusEl = document.getElementById('filter-status');
  if (searchEl) searchEl.value = '';
  if (modelEl) modelEl.value = '';
  if (statusEl) statusEl.value = '';
}

// ─── CACHE TABLE ─────────────────────────────────────────────
function renderCacheTable(entries) {
  const tbody = document.getElementById('cache-tbody');
  if (!tbody) return;

  tbody.innerHTML = entries.map(e => {
    const ttlPct = Math.round((e.ttl_remaining / e.ttl_total) * 100);
    const ttlMin = Math.round(e.ttl_remaining / 60);
    const barColor = ttlPct > 50 ? 'var(--accent)' : ttlPct > 20 ? 'var(--warning)' : 'var(--error)';

    return `<tr>
      <td class="mono">${e.key}</td>
      <td style="max-width:220px;overflow:hidden;text-overflow:ellipsis" title="${e.prompt_preview}">${e.prompt_preview.slice(0, 50)}…</td>
      <td>${e.model}</td>
      <td>${(e.similarity * 100).toFixed(0)}%</td>
      <td>${e.hits}</td>
      <td>${e.size_kb.toFixed(1)} KB</td>
      <td>
        <div class="flex items-center gap-sm">
          <div class="ttl-bar">
            <div class="ttl-bar-fill" style="width:${ttlPct}%;background:${barColor}"></div>
          </div>
          <span class="text-muted" style="font-size:0.7rem">${ttlMin}m</span>
        </div>
      </td>
    </tr>`;
  }).join('');
}

// ─── ROUTER TABLE ────────────────────────────────────────────
function renderRouterTable(categories) {
  const tbody = document.getElementById('router-tbody');
  if (!tbody) return;

  tbody.innerHTML = categories.map(c => {
    const accColor = c.accuracy >= 95 ? 'var(--success)' : c.accuracy >= 90 ? 'var(--warning)' : 'var(--error)';

    return `<tr>
      <td style="font-weight:500">${c.category}</td>
      <td>${c.model_assigned}</td>
      <td>${c.requests.toLocaleString()}</td>
      <td style="color:${accColor};font-weight:600">${c.accuracy}%</td>
      <td>${formatLatency(c.avg_latency_ms)}</td>
      <td>${formatCost(c.avg_cost)}</td>
    </tr>`;
  }).join('');
}

// ─── RECENT REQUESTS (overview) ──────────────────────────────
function renderRecentRequestsTable(requests) {
  const tbody = document.getElementById('recent-tbody');
  if (!tbody) return;

  const recent = requests.slice(0, 5);
  tbody.innerHTML = recent.map(r => {
    const rid = r.id || r.request_id || '';
    const rmodel = r.model || r.model_used || '';
    const lat = r.latency != null ? r.latency : (r.latency_ms || 0);
    const rcost = r.cost != null ? r.cost : (r.estimated_cost_usd || 0);
    const cacheHit = r.cacheHit != null ? r.cacheHit : r.cache_hit;
    const cacheStatus = r.cache_status || (cacheHit ? 'HIT' : 'MISS');
    const latencyClass = lat < 500 ? 'latency-fast' : lat < 1500 ? 'latency-medium' : 'latency-slow';
    const pillClass = cacheHit ? 'hit' : 'miss';

    return `<tr>
      <td class="mono">${rid.slice(0, 12)}</td>
      <td>${timeAgo(r.timestamp)}</td>
      <td>${rmodel}</td>
      <td class="${latencyClass}">${formatLatency(lat)}</td>
      <td>${formatCost(rcost)}</td>
      <td><span class="pill ${pillClass}">${cacheStatus}</span></td>
    </tr>`;
  }).join('');
}
