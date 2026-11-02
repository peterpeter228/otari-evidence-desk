const $ = (selector) => document.querySelector(selector);
const el = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = String(text); if (className) node.className = className; return node; };
let sourceSequence = 0;
let currentReport = null;
let running = false;
function invalidateReport() { currentReport = null; $('#results').hidden = true; $('#claim-list').replaceChildren(); }
function updateSourceCount() {
  const count = $('#sources').children.length;
  $('#source-count').textContent = `${count} / 3 sources`;
  $('#add-source').hidden = count >= 3;
  document.querySelectorAll('.remove').forEach(button => { button.disabled = count <= 1 || running; });
  document.querySelectorAll('.source-card').forEach((card, i) => { const label = `Source ${i + 1}`; card.querySelector('.source-index').textContent = `S${i + 1}`; card.querySelector('.source-title').setAttribute('aria-label', `${label} title`); card.querySelector('.source-kind').setAttribute('aria-label', `${label} input type`); card.querySelector('.remove').setAttribute('aria-label', `Remove ${label.toLowerCase()}`); card.querySelector('.source-content').setAttribute('aria-label', `${label} ${card.querySelector('.source-kind').value}`); });
}
function addSource(source = {}) {
  invalidateReport();
  if ($('#sources').children.length >= 3) return;
  const id = ++sourceSequence;
  const card = el('div', undefined, 'source-card');
  const top = el('div', undefined, 'source-top');
  top.append(el('span', `S${id}`, 'source-index'));
  const title = el('input', undefined, 'source-title'); title.type = 'text'; title.placeholder = 'Source title'; title.value = source.title || ''; title.maxLength = 120; title.required = true; title.setAttribute('aria-label', `Source ${id} title`);
  const kind = el('select', undefined, 'source-kind'); kind.setAttribute('aria-label', `Source ${id} input type`);
  for (const [value, label] of [['text', 'Text'], ['url', 'URL']]) { const option = el('option', label); option.value = value; kind.append(option); }
  kind.value = source.url ? 'url' : 'text';
  const remove = el('button', '×', 'remove'); remove.type = 'button'; remove.setAttribute('aria-label', `Remove source ${id}`); remove.addEventListener('click', () => { card.remove(); invalidateReport(); updateSourceCount(); });
  top.append(title, kind, remove); card.append(top);
  const body = el('div', undefined, 'source-body'); card.append(body);
  const values = { text: source.text || '', url: source.url || '' };
  function renderInput() {
    body.replaceChildren();
    const input = el(kind.value === 'text' ? 'textarea' : 'input');
    input.className = 'source-content'; input.value = values[kind.value]; input.required = true;
    input.setAttribute('aria-label', `Source ${id} ${kind.value}`);
    if (kind.value === 'text') { input.rows = 4; input.maxLength = 20000; input.placeholder = 'Paste the relevant public source text…'; }
    else { input.type = 'url'; input.maxLength = 2000; input.placeholder = 'https://official-source.example/policy'; }
    input.addEventListener('input', () => { values[kind.value] = input.value; }); body.append(input);
    if (kind.value === 'url') body.append(el('p', 'Public HTTPS only. Safe local fetching is not native Otari web fetch.', 'hint'));
  }
  kind.addEventListener('change', () => { renderInput(); updateSourceCount(); }); renderInput(); $('#sources').append(card); updateSourceCount();
}
function loadExample() {
  $('#sources').replaceChildren(); sourceSequence = 0;
  $('#question').value = 'Compare Atlas and Boreal retention, CSV export and monthly price. Identify contradictory evidence and what we cannot conclude.';
  addSource({title: 'Atlas — synthetic product policy', text: 'Atlas retains activity records for 30 days. Atlas supports CSV export. Atlas costs $20 per month.'});
  addSource({title: 'Boreal — synthetic product policy', text: 'Boreal retains activity records for 90 days. Boreal supports CSV export. Boreal costs $35 per month.'});
  addSource({title: 'Atlas — synthetic help page', text: 'Atlas retains activity records for 14 days. Atlas supports CSV export. This synthetic source deliberately conflicts with the product policy.'});
}
function setRunning(value) {
  running = value;
  $('#review-form').setAttribute('aria-busy', String(value));
  $('#review-form').querySelectorAll('button,input,textarea,select').forEach(control => { control.disabled = value; });
  $('#run').replaceChildren(document.createTextNode(value ? 'Reviewing evidence…' : 'Review evidence'), el('span', value ? '…' : '↗'));
  updateSourceCount();
}
function renderReport(report) {
  currentReport = report;
  $('#result-mode').textContent = report.mode === 'OFFLINE_FIXTURE' ? 'OFFLINE FIXTURE · NO MODEL CALLS' : `${report.mode || 'UNKNOWN MODE'} · INSPECT TRACE`;
  $('#result-question').textContent = report.question || '';
  $('#claim-list').replaceChildren();
  const sources = new Map((report.sources || []).map(source => [source.id || source.sourceId, source.title || source.id || source.sourceId]));
  for (const claim of report.claims || []) {
    const card = el('article', undefined, 'claim');
    const header = el('div', undefined, 'claim-heading'); header.append(el('h3', claim.text));
    const verdict = ['supported', 'contradicted', 'insufficient'].includes(claim.verdict) ? claim.verdict : 'insufficient';
    header.append(el('span', verdict === 'supported' ? 'source-supported' : verdict, `verdict ${verdict}`)); card.append(header);
    card.append(el('p', claim.reason || 'No reviewer rationale provided.', 'claim-reason'));
    const evidenceItems = [...(claim.evidence || [])];
    for (const item of claim.reviewEvidence || []) if (!evidenceItems.some(existing => existing.sourceId === item.sourceId && existing.quote === item.quote)) evidenceItems.push(item);
    for (const evidence of evidenceItems) { const quote = el('blockquote', evidence.quote || ''); quote.append(el('cite', `${evidence.sourceId || 'Unknown source'} · ${sources.get(evidence.sourceId) || 'Source title unavailable'}`)); card.append(quote); }
    $('#claim-list').append(card);
  }
  if (!(report.claims || []).length) $('#claim-list').append(el('p', 'No supported claims were extracted. Inspect the uncertainty and trace below.', 'muted'));
  $('#uncertainties').replaceChildren();
  const uncertainties = report.uncertainties?.length ? report.uncertainties : ['No additional uncertainty was reported; this does not establish source accuracy or completeness.'];
  for (const uncertainty of uncertainties) $('#uncertainties').append(el('li', typeof uncertainty === 'string' ? uncertainty : JSON.stringify(uncertainty)));
  $('#trace-output').textContent = JSON.stringify({runId: report.id, createdAt: report.createdAt, mode: report.mode, trace: report.trace, budget: report.budget}, null, 2);
  $('#results').hidden = false;
  $('#result-title').focus({preventScroll: true}); $('#results').scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'});
}
function markdown(report) {
  const lines = ['# Evidence Desk brief', '', `Mode: ${report.mode}`, `Run: ${report.id}`, '', '## Question', report.question, '', '## Claims'];
  for (const claim of report.claims || []) {
    lines.push('', `### ${claim.verdict === 'supported' ? 'source-supported' : claim.verdict}: ${claim.text}`, '', claim.reason || '');
    const uniqueEvidence = [...(claim.evidence || []), ...(claim.reviewEvidence || [])].filter((item, i, all) => all.findIndex(other => other.sourceId === item.sourceId && other.quote === item.quote) === i);
    for (const evidence of uniqueEvidence) lines.push('', ...String(evidence.quote).split('\n').map(line => `> ${line}`), '', `Source: ${evidence.sourceId} · ${(report.sources || []).find(source => source.id === evidence.sourceId)?.title || 'Unknown source'}`);
  }
  lines.push('', '## Sources', ...(report.sources || []).flatMap(source => [`- ${source.id}: ${source.title}`, `  URL: ${source.canonicalUrl || 'pasted text'}`, `  Retrieved: ${source.retrievedAt}`, `  SHA-256: ${source.sha256}`]), '', '## Uncertainties', ...(report.uncertainties || []).map(item => `- ${typeof item === 'string' ? item : JSON.stringify(item)}`), '', '## Trace and budget', '```json', JSON.stringify({trace: report.trace, budget: report.budget}, null, 2), '```', '', 'Quotes are source matches, not guarantees of truth.'); return lines.join('\n').replace(/</g, '&lt;');
}
function download(format) {
  if (!currentReport) return;
  const blob = new Blob([format === 'json' ? JSON.stringify(currentReport, null, 2) : markdown(currentReport)], {type: format === 'json' ? 'application/json' : 'text/markdown;charset=utf-8'});
  const link = el('a'); const url = URL.createObjectURL(blob); link.href = url; link.download = `evidence-brief-${String(currentReport.id || 'local').replace(/[^a-zA-Z0-9_-]/g, '').slice(0,64)}.${format === 'json' ? 'json' : 'md'}`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
$('#review-form').addEventListener('input', invalidateReport);
$('#review-form').addEventListener('change', invalidateReport);
$('#example').addEventListener('click', loadExample);
$('#add-source').addEventListener('click', () => addSource());
$('#export-json').addEventListener('click', () => download('json'));
$('#export-md').addEventListener('click', () => download('md'));
$('#review-form').addEventListener('submit', async event => {
  event.preventDefault(); if (running) return;
  currentReport = null; $('#results').hidden = true; $('#error').hidden = true; $('#claim-list').replaceChildren();
  const sources = [...document.querySelectorAll('.source-card')].map(card => ({title: card.querySelector('.source-title').value.trim(), [card.querySelector('select').value]: card.querySelector('.source-content').value.trim()}));
  const body = {question: $('#question').value.trim(), sources};
  setRunning(true);
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch('/api/run', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body), signal: controller.signal});
    let result; try { result = await response.json(); } catch { throw new Error(`Server returned an unreadable response (${response.status}).`); }
    if (!response.ok) throw new Error(typeof result.error === 'string' ? result.error : result.error?.message || result.message || `Review failed (${response.status}).`);
    renderReport(result);
  } catch (error) {
    $('#error').textContent = error.name === 'AbortError' ? 'The request timed out. Outcome may be unknown; do not blindly retry a live run. Inspect the server trace first.' : error.message;
    $('#error').hidden = false;
  } finally { clearTimeout(timeout); setRunning(false); }
});
addSource(); addSource();
try {
  const response = await fetch('/api/status'); if (!response.ok) throw new Error('Status unavailable'); const status = await response.json();
  $('#mode').textContent = status.mode === 'OFFLINE_FIXTURE' ? 'OFFLINE FIXTURE' : status.liveReady ? 'LIVE · CHECK TRACE' : 'LIVE NOT READY';
  $('#mode-notice').textContent = status.mode === 'OFFLINE_FIXTURE' ? 'Offline fixture mode. Deterministic demonstration only — no AI inference, no provider calls, zero model cost. Native Otari features remain unverified.' : status.liveReady ? 'Live mode. Review provider evidence and reported costs in each run trace. Never include secrets or private information.' : 'Live mode is not configured. Provider calls must fail closed until configuration and capability checks are verified.';
} catch { $('#mode').textContent = 'STATUS UNAVAILABLE'; $('#mode-notice').textContent = 'Cannot verify server mode. Do not assume live integration is available. Start the local server and refresh.'; }
