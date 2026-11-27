// HomeLedger — views: dashboard, transactions, budgets, goals, reports.
// Renders into <main id="app">. All charts are hand-drawn inline SVG (no libraries, no network).

import {
  CATEGORIES,
  CATEGORY_COLORS,
  formatIDR,
  monthKey,
  monthLabel,
  shortDate,
  monthTotals,
  categoryTotals,
  lastMonths,
} from './data.js';

export const CURRENT_MONTH = '2026-11';

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function pct(n) {
  return Math.min(100, Math.max(0, Math.round(n)));
}

function monthOptions(selected) {
  const months = lastMonths(CURRENT_MONTH, 6).slice().reverse();
  return months.map((k) => `<option value="${k}"${k === selected ? ' selected' : ''}>${monthLabel(k)}</option>`).join('');
}

// ---- SVG charts ----

function donutSVG(totals) {
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const sum = entries.reduce((s, [, v]) => s + v, 0);
  if (sum === 0) return '<p class="muted">No spending recorded this month yet.</p>';
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const rings = entries.map(([cat, v]) => {
    const frac = v / sum;
    const len = frac * c;
    const seg = `<circle r="${r}" cx="90" cy="90" fill="none" stroke="${CATEGORY_COLORS[cat] || '#94a3b8'}" stroke-width="26" stroke-dasharray="${Math.max(len - 2, 1)} ${c - Math.max(len - 2, 1)}" stroke-dashoffset="${-offset}" />`;
    offset += len;
    return seg;
  }).join('');
  const legend = entries.map(([cat, v]) => `
    <li><span class="dot" style="background:${CATEGORY_COLORS[cat] || '#94a3b8'}"></span>${esc(cat)}<strong>${formatIDR(v)}</strong><span class="muted">${Math.round((v / sum) * 100)}%</span></li>`).join('');
  return `
  <div class="donut-wrap">
    <svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="Spending by category">${rings}
      <text x="90" y="84" text-anchor="middle" class="donut-total">${formatIDR(sum)}</text>
      <text x="90" y="104" text-anchor="middle" class="donut-label">spent</text>
    </svg>
    <ul class="legend">${legend}</ul>
  </div>`;
}

function barsSVG(state, months) {
  const data = months.map((k) => {
    const t = monthTotals(state, k);
    return { key: k, income: t.income, expense: t.expense + t.saved };
  });
  const max = Math.max(...data.flatMap((d) => [d.income, d.expense]), 1);
  const W = 640;
  const H = 240;
  const base = 205;
  const bw = 34;
  const step = (W - 40) / data.length;
  const bars = data.map((d, i) => {
    const x = 20 + i * step + (step - bw * 2 - 8) / 2;
    const ih = Math.round((d.income / max) * 170);
    const eh = Math.round((d.expense / max) * 170);
    const label = new Date(Number(d.key.slice(0, 4)), Number(d.key.slice(5, 7)) - 1, 1).toLocaleDateString('en-US', { month: 'short' });
    return `
      <rect x="${x}" y="${base - ih}" width="${bw}" height="${ih}" rx="3" fill="#059669"><title>Income ${monthLabel(d.key)}: ${formatIDR(d.income)}</title></rect>
      <rect x="${x + bw + 8}" y="${base - eh}" width="${bw}" height="${eh}" rx="3" fill="#dc2626"><title>Spending ${monthLabel(d.key)}: ${formatIDR(d.expense)}</title></rect>
      <text x="${x + bw + 4}" y="${base + 18}" text-anchor="middle" class="bar-label">${label}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="bars" role="img" aria-label="Income versus spending, last six months">
    <line x1="10" y1="${base}" x2="${W - 10}" y2="${base}" stroke="#cbd5e1" stroke-width="1" />${bars}
  </svg>
  <p class="chart-key"><span class="key-in">Income</span><span class="key-out">Spending + savings</span></p>`;
}

// ---- shared bits ----

function txRow(t) {
  const sign = t.type === 'income' ? '+' : '−';
  const cls = t.type === 'income' ? 'in' : 'out';
  return `<li class="tx">
    <span class="tx-date">${shortDate(t.date)}</span>
    <span class="tx-main"><strong>${esc(t.note)}</strong><small>${esc(t.category)}</small></span>
    <span class="tx-amount ${cls}">${sign} ${formatIDR(t.amount)}</span>
    <span class="tx-actions">
      <button class="mini" data-edit-tx="${t.id}">Edit</button>
      <button class="mini danger" data-del-tx="${t.id}">Delete</button>
    </span>
  </li>`;
}

function budgetBar(cat, cap, spent) {
  const p = cap > 0 ? pct((spent / cap) * 100) : 0;
  const over = spent > cap;
  return `<div class="budget-row">
    <div class="budget-head"><span class="dot" style="background:${CATEGORY_COLORS[cat]}"></span><strong>${esc(cat)}</strong>
      <span>${formatIDR(spent)} of ${formatIDR(cap)}</span>
      <span class="pct ${over ? 'over' : ''}">${p}%</span></div>
    <div class="bar"><span style="width:${p}%;background:${over ? '#dc2626' : CATEGORY_COLORS[cat]}"></span></div>
    ${over ? `<p class="warn">Over budget by ${formatIDR(spent - cap)}.</p>` : ''}
  </div>`;
}

// ---- views ----

export function viewDashboard(state, ui) {
  const key = ui.month;
  const t = monthTotals(state, key);
  const cats = categoryTotals(state, key);
  const recent = state.transactions
    .filter((x) => monthKey(x.date) === key)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 5);
  const topBudgets = Object.entries(state.budgets)
    .map(([cat, cap]) => ({ cat, cap, spent: cats[cat] || 0 }))
    .sort((a, b) => b.spent / b.cap - a.spent / a.cap)
    .slice(0, 4);
  return `
  <section class="hero">
    <div><h1>Good evening, Hartono family</h1><p>Here is where November stands — income, spending, savings and what is left.</p></div>
    <label class="month-pick">Month <select id="month-select">${monthOptions(key)}</select></label>
  </section>
  <section class="cards">
    <article class="card stat in"><small>Income</small><strong>${formatIDR(t.income)}</strong><span>${monthLabel(key)}</span></article>
    <article class="card stat out"><small>Spending</small><strong>${formatIDR(t.expense)}</strong><span>excludes savings</span></article>
    <article class="card stat save"><small>Saved</small><strong>${formatIDR(t.saved)}</strong><span>${t.income ? Math.round((t.saved / t.income) * 100) : 0}% of income</span></article>
    <article class="card stat left"><small>Left to spend</small><strong>${formatIDR(t.remaining)}</strong><span>${t.remaining < 0 ? 'Over budget this month' : 'on track'}</span></article>
  </section>
  <section class="grid-2">
    <article class="card"><h2>Where the money went</h2>${donutSVG(cats)}</article>
    <article class="card"><h2>Budgets to watch</h2>
      ${topBudgets.map((b) => budgetBar(b.cat, b.cap, b.spent)).join('')}
      <p><a class="link" href="#/budgets">See all budgets →</a></p>
    </article>
  </section>
  <section class="grid-2">
    <article class="card"><h2>Recent transactions</h2>
      <ul class="tx-list">${recent.map(txRow).join('') || '<li class="muted">No transactions this month yet.</li>'}</ul>
      <p><a class="link" href="#/transactions">All transactions →</a></p>
    </article>
    <article class="card"><h2>Savings goals</h2>
      ${state.goals.map((g) => {
        const p = pct((g.saved / g.target) * 100);
        return `<div class="goal-mini"><div class="budget-head"><strong>${esc(g.name)}</strong><span>${formatIDR(g.saved)} of ${formatIDR(g.target)}</span><span class="pct">${p}%</span></div>
        <div class="bar"><span style="width:${p}%;background:#059669"></span></div></div>`;
      }).join('')}
      <p><a class="link" href="#/goals">Manage goals →</a></p>
    </article>
  </section>`;
}

export function viewTransactions(state, ui) {
  const f = ui.txFilter;
  let list = state.transactions.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  if (f.month) list = list.filter((t) => monthKey(t.date) === f.month);
  if (f.type) list = list.filter((t) => t.type === f.type);
  if (f.cat) list = list.filter((t) => t.category === f.cat);
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter((t) => t.note.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }
  const catOpts = ['<option value="">All categories</option>']
    .concat([...CATEGORIES.income, ...CATEGORIES.expense].map((c) => `<option${f.cat === c ? ' selected' : ''}>${c}</option>`)).join('');
  const editing = ui.editingTx ? state.transactions.find((t) => t.id === ui.editingTx) : null;
  return `
  <section class="page-head"><div><h1>Transactions</h1><p>Every rupiah in and out. Add, edit or delete — everything saves on this device.</p></div></section>
  <section class="card form-card"><h2>${editing ? 'Edit transaction' : 'Add a transaction'}</h2>
    <form id="tx-form" data-edit-id="${editing ? editing.id : ''}">
      <label>Date <input type="date" name="date" value="${editing ? editing.date : '2026-11-27'}" required></label>
      <label>Type <select name="type">
        <option value="expense"${editing && editing.type === 'expense' ? ' selected' : ''}>Expense</option>
        <option value="income"${editing && editing.type === 'income' ? ' selected' : ''}>Income</option>
      </select></label>
      <label>Category <select name="category" id="tx-category">
        ${(editing && editing.type === 'income' ? CATEGORIES.income : CATEGORIES.expense).map((c) => `<option${editing && editing.category === c ? ' selected' : ''}>${c}</option>`).join('')}
      </select></label>
      <label>Amount (Rp) <input type="number" name="amount" min="1000" step="1000" value="${editing ? editing.amount : ''}" placeholder="250000" required></label>
      <label class="wide">Note <input type="text" name="note" maxlength="80" value="${editing ? esc(editing.note) : ''}" placeholder="What was it for?" required></label>
      <button class="btn" type="submit">${editing ? 'Save changes' : 'Add transaction'}</button>
      ${editing ? '<button class="btn ghost" type="button" data-cancel-edit>Cancel</button>' : ''}
    </form>
  </section>
  <section class="card"><h2>${list.length} transaction${list.length === 1 ? '' : 's'}</h2>
    <form id="tx-filter" class="filters">
      <select name="month"><option value="">All months</option>${monthOptions(f.month)}</select>
      <select name="type"><option value="">Income + expense</option>
        <option value="income"${f.type === 'income' ? ' selected' : ''}>Income only</option>
        <option value="expense"${f.type === 'expense' ? ' selected' : ''}>Expense only</option></select>
      <select name="cat">${catOpts}</select>
      <input type="search" name="q" placeholder="Search notes…" value="${esc(f.q)}">
    </form>
    <ul class="tx-list">${list.map(txRow).join('') || '<li class="muted">Nothing matches these filters.</li>'}</ul>
  </section>`;
}

export function viewBudgets(state) {
  const key = CURRENT_MONTH;
  const cats = categoryTotals(state, key);
  const rows = Object.entries(state.budgets).map(([cat, cap]) => {
    const spent = cats[cat] || 0;
    const p = cap > 0 ? pct((spent / cap) * 100) : 0;
    const over = spent > cap;
    return `<article class="card budget-card">
      <div class="budget-head"><span class="dot" style="background:${CATEGORY_COLORS[cat]}"></span><strong>${esc(cat)}</strong>
      <span class="pct ${over ? 'over' : ''}">${p}%</span></div>
      <div class="bar"><span style="width:${p}%;background:${over ? '#dc2626' : CATEGORY_COLORS[cat]}"></span></div>
      <p>${formatIDR(spent)} spent of ${formatIDR(cap)} budget</p>
      ${over ? `<p class="warn">Over budget by ${formatIDR(spent - cap)} — consider moving money from a category with room.</p>` : `<p class="muted">${formatIDR(Math.max(cap - spent, 0))} left in this budget.</p>`}
      <form class="budget-edit" data-cat="${esc(cat)}"><label>Monthly budget (Rp)
        <input type="number" name="cap" min="0" step="10000" value="${cap}" required></label>
        <button class="btn small" type="submit">Update</button></form>
    </article>`;
  }).join('');
  const totalCap = Object.values(state.budgets).reduce((a, b) => a + b, 0);
  const totalSpent = Object.keys(state.budgets).reduce((a, c) => a + (cats[c] || 0), 0);
  return `
  <section class="page-head"><div><h1>Budgets — ${monthLabel(key)}</h1>
  <p>Monthly caps for each spending category. Total budgeted ${formatIDR(totalCap)}; spent so far ${formatIDR(totalSpent)}.</p></div></section>
  <section class="budget-grid">${rows}</section>`;
}

export function viewGoals(state) {
  const cards = state.goals.map((g) => {
    const p = pct((g.saved / g.target) * 100);
    const left = Math.max(g.target - g.saved, 0);
    return `<article class="card goal-card">
      <h2>${esc(g.name)}</h2><p class="muted">${esc(g.note)}</p>
      <div class="bar big"><span style="width:${p}%;background:#059669"></span></div>
      <p><strong>${formatIDR(g.saved)}</strong> of ${formatIDR(g.target)} — ${p}% there, ${formatIDR(left)} to go.</p>
      <form class="goal-add" data-goal="${g.id}"><label>Add savings (Rp)
        <input type="number" name="amount" min="1000" step="1000" placeholder="100000" required></label>
        <button class="btn small" type="submit">Add to goal</button></form>
    </article>`;
  }).join('');
  return `
  <section class="page-head"><div><h1>Savings goals</h1><p>What the family is saving for — every contribution moves the bar.</p></div></section>
  <section class="goal-grid">${cards}</section>
  <section class="card form-card"><h2>Start a new goal</h2>
    <form id="goal-form">
      <label class="wide">Goal name <input type="text" name="name" maxlength="60" placeholder="e.g. New washing machine" required></label>
      <label>Target (Rp) <input type="number" name="target" min="10000" step="10000" placeholder="3000000" required></label>
      <label>Already saved (Rp) <input type="number" name="saved" min="0" step="10000" value="0"></label>
      <label class="wide">Note <input type="text" name="note" maxlength="120" placeholder="Why are we saving for this?"></label>
      <button class="btn" type="submit">Create goal</button>
    </form>
  </section>`;
}

export function viewReports(state, ui) {
  const months = lastMonths(CURRENT_MONTH, 6);
  const key = ui.month;
  const cats = categoryTotals(state, key);
  const t = monthTotals(state, key);
  const rows = Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([cat, v]) => {
    const total = Object.values(cats).reduce((a, b) => a + b, 0) || 1;
    return `<tr><td><span class="dot" style="background:${CATEGORY_COLORS[cat]}"></span> ${esc(cat)}</td><td>${formatIDR(v)}</td><td>${Math.round((v / total) * 100)}%</td></tr>`;
  }).join('');
  return `
  <section class="page-head"><div><h1>Reports</h1><p>Six months at a glance — income against spending, and where this month's money went.</p></div>
  <label class="month-pick">Month <select id="month-select">${monthOptions(key)}</select></label></section>
  <section class="card"><h2>Income vs spending — last 6 months</h2>${barsSVG(state, months)}
  <p class="muted">Average monthly income ${formatIDR(months.reduce((a, k) => a + monthTotals(state, k).income, 0) / months.length)} ·
  average spending ${formatIDR(months.reduce((a, k) => a + monthTotals(state, k).expense + monthTotals(state, k).saved, 0) / months.length)}.</p></section>
  <section class="grid-2">
    <article class="card"><h2>Spending breakdown — ${monthLabel(key)}</h2>${donutSVG(cats)}</article>
    <article class="card"><h2>Top categories</h2>
      <table class="tbl"><thead><tr><th>Category</th><th>Amount</th><th>Share</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="muted">Income ${formatIDR(t.income)} · spending ${formatIDR(t.expense)} · saved ${formatIDR(t.saved)}.</p>
      <button class="btn" id="export-csv" type="button">Download transactions as CSV</button>
    </article>
  </section>`;
}
