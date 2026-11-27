// HomeLedger — app shell: hash routing, forms, filters, CSV export.
// Everything is stored on this device in localStorage; nothing leaves the browser.

import { loadState, saveState, resetState, CATEGORIES } from './data.js';
import { viewDashboard, viewTransactions, viewBudgets, viewGoals, viewReports, CURRENT_MONTH } from './views.js';

let state = loadState();
const ui = {
  month: CURRENT_MONTH,
  txFilter: { month: CURRENT_MONTH, type: '', cat: '', q: '' },
  editingTx: null,
};

const app = document.getElementById('app');

function route() {
  const hash = location.hash || '#/';
  const nav = document.querySelectorAll('nav a');
  nav.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === hash.split('?')[0] || (hash === '#/' && a.getAttribute('href') === '#/')));
  if (hash.startsWith('#/transactions')) {
    app.innerHTML = viewTransactions(state, ui);
    wireTxForm();
    wireTxFilter();
  } else if (hash.startsWith('#/budgets')) {
    app.innerHTML = viewBudgets(state);
    wireBudgetForms();
  } else if (hash.startsWith('#/goals')) {
    app.innerHTML = viewGoals(state);
    wireGoalForms();
  } else if (hash.startsWith('#/reports')) {
    app.innerHTML = viewReports(state, ui);
    wireMonthSelect();
    const btn = document.getElementById('export-csv');
    if (btn) btn.addEventListener('click', exportCSV);
  } else {
    app.innerHTML = viewDashboard(state, ui);
    wireMonthSelect();
  }
  wireTxActions();
}

function wireMonthSelect() {
  const sel = document.getElementById('month-select');
  if (sel) sel.addEventListener('change', () => { ui.month = sel.value; route(); });
}

function wireTxActions() {
  app.querySelectorAll('[data-del-tx]').forEach((b) => b.addEventListener('click', () => {
    const tx = state.transactions.find((t) => t.id === b.dataset.delTx);
    if (!tx) return;
    if (!confirm(`Delete "${tx.note}" (${tx.type === 'income' ? '+' : '−'} ${tx.amount.toLocaleString('id-ID')})?`)) return;
    state.transactions = state.transactions.filter((t) => t.id !== tx.id);
    saveState(state);
    route();
  }));
  app.querySelectorAll('[data-edit-tx]').forEach((b) => b.addEventListener('click', () => {
    ui.editingTx = b.dataset.editTx;
    location.hash = '#/transactions';
    route();
    const form = document.getElementById('tx-form');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
  const cancel = app.querySelector('[data-cancel-edit]');
  if (cancel) cancel.addEventListener('click', () => { ui.editingTx = null; route(); });
}

function wireTxForm() {
  const form = document.getElementById('tx-form');
  if (!form) return;
  const typeSel = form.elements.type;
  const catSel = form.elements.category;
  const refreshCats = () => {
    const list = typeSel.value === 'income' ? CATEGORIES.income : CATEGORIES.expense;
    const keep = catSel.value;
    catSel.innerHTML = list.map((c) => `<option${c === keep ? ' selected' : ''}>${c}</option>`).join('');
  };
  typeSel.addEventListener('change', refreshCats);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const entry = {
      date: String(d.get('date')),
      type: String(d.get('type')),
      category: String(d.get('category')),
      amount: Math.round(Number(d.get('amount'))),
      note: String(d.get('note')).trim(),
    };
    if (!entry.date || !entry.amount || entry.amount <= 0 || !entry.note) return;
    const editId = form.dataset.editId;
    if (editId) {
      const tx = state.transactions.find((t) => t.id === editId);
      if (tx) Object.assign(tx, entry);
      ui.editingTx = null;
    } else {
      state.transactions.push({ id: 'tx-' + Date.now().toString(36), ...entry });
    }
    saveState(state);
    route();
  });
}

function wireTxFilter() {
  const form = document.getElementById('tx-filter');
  if (!form) return;
  form.addEventListener('input', () => {
    const d = new FormData(form);
    ui.txFilter = {
      month: String(d.get('month') || ''),
      type: String(d.get('type') || ''),
      cat: String(d.get('cat') || ''),
      q: String(d.get('q') || ''),
    };
    route();
    const f2 = document.getElementById('tx-filter');
    if (f2) {
      f2.elements.month.value = ui.txFilter.month;
      f2.elements.type.value = ui.txFilter.type;
      f2.elements.cat.value = ui.txFilter.cat;
      f2.elements.q.value = ui.txFilter.q;
      if (document.activeElement === f2.elements.q) f2.elements.q.focus();
    }
  });
  form.addEventListener('submit', (e) => e.preventDefault());
}

function wireBudgetForms() {
  app.querySelectorAll('.budget-edit').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cap = Math.round(Number(new FormData(form).get('cap')));
    if (Number.isNaN(cap) || cap < 0) return;
    state.budgets[form.dataset.cat] = cap;
    saveState(state);
    route();
  }));
}

function wireGoalForms() {
  app.querySelectorAll('.goal-add').forEach((form) => form.addEventListener('submit', (e) => {
    e.preventDefault();
    const amount = Math.round(Number(new FormData(form).get('amount')));
    if (!amount || amount <= 0) return;
    const goal = state.goals.find((g) => g.id === form.dataset.goal);
    if (goal) goal.saved += amount;
    saveState(state);
    route();
  }));
  const form = document.getElementById('goal-form');
  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const target = Math.round(Number(d.get('target')));
    const saved = Math.round(Number(d.get('saved')) || 0);
    if (!target || target <= 0) return;
    state.goals.push({
      id: 'goal-' + Date.now().toString(36),
      name: String(d.get('name')).trim(),
      target,
      saved,
      note: String(d.get('note')).trim() || 'A new goal for the family.',
    });
    saveState(state);
    route();
  });
}

function exportCSV() {
  const head = 'date,type,category,amount,note\n';
  const escCsv = (s) => '"' + String(s).replace(/"/g, '""') + '"';
  const body = state.transactions
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((t) => [t.date, t.type, t.category, t.amount, escCsv(t.note)].join(','))
    .join('\n');
  const blob = new Blob([head + body], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'homeledger-transactions.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

document.getElementById('reset-demo').addEventListener('click', () => {
  if (!confirm('Reset all data back to the example household figures? Your changes will be lost.')) return;
  state = resetState();
  ui.month = CURRENT_MONTH;
  ui.txFilter = { month: CURRENT_MONTH, type: '', cat: '', q: '' };
  ui.editingTx = null;
  location.hash = '#/';
  route();
});

window.addEventListener('hashchange', route);
route();
