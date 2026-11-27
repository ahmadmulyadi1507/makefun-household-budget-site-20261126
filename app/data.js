// HomeLedger — data layer: seed data, localStorage store, helpers.
// All figures are realistic example figures for the Hartono household (Jakarta).
// Currency: Indonesian rupiah (IDR). No network use anywhere.

export const CATEGORIES = {
  income: ['Salary', 'Side Income', 'Other Income'],
  expense: [
    'Housing',
    'Groceries',
    'Transport',
    'Utilities',
    'Food & Dining',
    'Health',
    'Education',
    'Entertainment',
    'Shopping',
    'Savings',
  ],
};

export const CATEGORY_COLORS = {
  Housing: '#2563eb',
  Groceries: '#16a34a',
  Transport: '#d97706',
  Utilities: '#0891b2',
  'Food & Dining': '#dc2626',
  Health: '#db2777',
  Education: '#7c3aed',
  Entertainment: '#ea580c',
  Shopping: '#4f46e5',
  Savings: '#059669',
  Salary: '#059669',
  'Side Income': '#0891b2',
  'Other Income': '#64748b',
};

const KEY = 'homeledger-v1';

function seedTransactions() {
  // [date, type, category, amount, note]
  const rows = [
    // ---- November 2026 (current month, detailed) ----
    ['2026-11-01', 'income', 'Salary', 8500000, 'Monthly salary — Ahmad'],
    ['2026-11-02', 'expense', 'Housing', 1800000, 'Monthly house rent'],
    ['2026-11-03', 'expense', 'Groceries', 650000, 'Weekly market — Pasar Minggu'],
    ['2026-11-04', 'expense', 'Transport', 300000, 'Petrol for the motorbike'],
    ['2026-11-05', 'income', 'Salary', 2500000, 'Part-time salary — Sari'],
    ['2026-11-06', 'expense', 'Utilities', 385000, 'Electricity bill (PLN)'],
    ['2026-11-07', 'expense', 'Utilities', 145000, 'Water bill (PDAM)'],
    ['2026-11-08', 'expense', 'Utilities', 350000, 'Home internet'],
    ['2026-11-09', 'expense', 'Education', 600000, 'School fees — Dimas & Putri'],
    ['2026-11-10', 'expense', 'Groceries', 520000, 'Weekly market — vegetables & rice'],
    ['2026-11-11', 'expense', 'Entertainment', 89000, 'Streaming subscription'],
    ['2026-11-12', 'expense', 'Food & Dining', 180000, 'Family dinner out'],
    ['2026-11-14', 'expense', 'Health', 150000, 'Pharmacy — vitamins & medicine'],
    ['2026-11-15', 'income', 'Side Income', 750000, 'Freelance data entry'],
    ['2026-11-17', 'expense', 'Groceries', 480000, 'Weekly market — fruit & fish'],
    ['2026-11-18', 'expense', 'Transport', 250000, 'Petrol + motorbike service'],
    ['2026-11-20', 'expense', 'Food & Dining', 220000, 'Weekend lunch with family'],
    ['2026-11-21', 'expense', 'Shopping', 450000, 'School uniforms for the kids'],
    ['2026-11-24', 'expense', 'Groceries', 610000, 'Weekly market — bulk staples'],
    ['2026-11-25', 'expense', 'Savings', 1000000, 'Monthly transfer to savings'],
    // ---- October 2026 ----
    ['2026-10-01', 'income', 'Salary', 8500000, 'Monthly salary — Ahmad'],
    ['2026-10-02', 'expense', 'Housing', 1800000, 'Monthly house rent'],
    ['2026-10-05', 'income', 'Salary', 2500000, 'Part-time salary — Sari'],
    ['2026-10-06', 'expense', 'Groceries', 590000, 'Weekly market'],
    ['2026-10-07', 'expense', 'Utilities', 372000, 'Electricity bill (PLN)'],
    ['2026-10-09', 'expense', 'Utilities', 140000, 'Water bill (PDAM)'],
    ['2026-10-10', 'expense', 'Groceries', 540000, 'Weekly market'],
    ['2026-10-12', 'expense', 'Education', 600000, 'School fees — Dimas & Putri'],
    ['2026-10-14', 'expense', 'Transport', 320000, 'Petrol for the motorbike'],
    ['2026-10-16', 'expense', 'Food & Dining', 250000, 'Family dinner out'],
    ['2026-10-18', 'expense', 'Groceries', 610000, 'Weekly market'],
    ['2026-10-20', 'expense', 'Health', 220000, 'Clinic visit — Putri'],
    ['2026-10-22', 'expense', 'Shopping', 380000, 'Kitchen supplies'],
    ['2026-10-25', 'expense', 'Groceries', 470000, 'Weekly market'],
    ['2026-10-26', 'expense', 'Savings', 1000000, 'Monthly transfer to savings'],
    ['2026-10-28', 'expense', 'Entertainment', 89000, 'Streaming subscription'],
    ['2026-10-30', 'income', 'Side Income', 500000, 'Freelance data entry'],
    // ---- September 2026 ----
    ['2026-09-01', 'income', 'Salary', 8500000, 'Monthly salary — Ahmad'],
    ['2026-09-02', 'expense', 'Housing', 1800000, 'Monthly house rent'],
    ['2026-09-05', 'income', 'Salary', 2500000, 'Part-time salary — Sari'],
    ['2026-09-06', 'expense', 'Groceries', 620000, 'Weekly market'],
    ['2026-09-07', 'expense', 'Utilities', 390000, 'Electricity bill (PLN)'],
    ['2026-09-10', 'expense', 'Utilities', 138000, 'Water bill (PDAM)'],
    ['2026-09-12', 'expense', 'Education', 600000, 'School fees — Dimas & Putri'],
    ['2026-09-13', 'expense', 'Groceries', 560000, 'Weekly market'],
    ['2026-09-15', 'expense', 'Transport', 280000, 'Petrol for the motorbike'],
    ['2026-09-18', 'expense', 'Food & Dining', 190000, 'Family dinner out'],
    ['2026-09-20', 'expense', 'Groceries', 500000, 'Weekly market'],
    ['2026-09-24', 'expense', 'Shopping', 310000, 'Household items'],
    ['2026-09-25', 'expense', 'Savings', 1000000, 'Monthly transfer to savings'],
    ['2026-09-27', 'expense', 'Health', 175000, 'Dental check — Dimas'],
    // ---- August 2026 ----
    ['2026-08-01', 'income', 'Salary', 8500000, 'Monthly salary — Ahmad'],
    ['2026-08-02', 'expense', 'Housing', 1800000, 'Monthly house rent'],
    ['2026-08-05', 'income', 'Salary', 2500000, 'Part-time salary — Sari'],
    ['2026-08-06', 'expense', 'Groceries', 580000, 'Weekly market'],
    ['2026-08-08', 'expense', 'Utilities', 365000, 'Electricity + water'],
    ['2026-08-12', 'expense', 'Education', 600000, 'School fees — Dimas & Putri'],
    ['2026-08-14', 'expense', 'Groceries', 540000, 'Weekly market'],
    ['2026-08-16', 'expense', 'Transport', 300000, 'Petrol for the motorbike'],
    ['2026-08-19', 'expense', 'Food & Dining', 210000, 'Family dinner out'],
    ['2026-08-22', 'expense', 'Groceries', 490000, 'Weekly market'],
    ['2026-08-25', 'expense', 'Savings', 1000000, 'Monthly transfer to savings'],
    ['2026-08-28', 'expense', 'Entertainment', 150000, 'Cinema — family movie night'],
    // ---- July 2026 ----
    ['2026-07-01', 'income', 'Salary', 8500000, 'Monthly salary — Ahmad'],
    ['2026-07-02', 'expense', 'Housing', 1800000, 'Monthly house rent'],
    ['2026-07-05', 'income', 'Salary', 2500000, 'Part-time salary — Sari'],
    ['2026-07-06', 'expense', 'Groceries', 600000, 'Weekly market'],
    ['2026-07-08', 'expense', 'Utilities', 358000, 'Electricity + water'],
    ['2026-07-12', 'expense', 'Education', 600000, 'School fees — Dimas & Putri'],
    ['2026-07-15', 'expense', 'Groceries', 520000, 'Weekly market'],
    ['2026-07-17', 'expense', 'Transport', 270000, 'Petrol for the motorbike'],
    ['2026-07-20', 'expense', 'Food & Dining', 175000, 'Family dinner out'],
    ['2026-07-23', 'expense', 'Groceries', 480000, 'Weekly market'],
    ['2026-07-25', 'expense', 'Savings', 1000000, 'Monthly transfer to savings'],
    ['2026-07-29', 'expense', 'Health', 120000, 'Pharmacy'],
    // ---- June 2026 ----
    ['2026-06-01', 'income', 'Salary', 8500000, 'Monthly salary — Ahmad'],
    ['2026-06-02', 'expense', 'Housing', 1800000, 'Monthly house rent'],
    ['2026-06-05', 'income', 'Salary', 2500000, 'Part-time salary — Sari'],
    ['2026-06-06', 'expense', 'Groceries', 570000, 'Weekly market'],
    ['2026-06-08', 'expense', 'Utilities', 342000, 'Electricity + water'],
    ['2026-06-12', 'expense', 'Education', 600000, 'School fees — Dimas & Putri'],
    ['2026-06-15', 'expense', 'Groceries', 510000, 'Weekly market'],
    ['2026-06-17', 'expense', 'Transport', 260000, 'Petrol for the motorbike'],
    ['2026-06-20', 'expense', 'Food & Dining', 200000, 'Family dinner out'],
    ['2026-06-23', 'expense', 'Groceries', 460000, 'Weekly market'],
    ['2026-06-25', 'expense', 'Savings', 1000000, 'Monthly transfer to savings'],
  ];
  return rows.map(([date, type, category, amount, note], i) => ({
    id: 'seed-' + (i + 1),
    date,
    type,
    category,
    amount,
    note,
  }));
}

function seedState() {
  return {
    transactions: seedTransactions(),
    budgets: {
      Housing: 1800000,
      Groceries: 2500000,
      Transport: 700000,
      Utilities: 950000,
      'Food & Dining': 600000,
      Health: 300000,
      Education: 650000,
      Entertainment: 150000,
      Shopping: 500000,
    },
    goals: [
      { id: 'goal-1', name: 'Emergency fund', target: 20000000, saved: 12500000, note: 'Six months of essential spending, kept in a separate account.' },
      { id: 'goal-2', name: 'Family holiday in Bali', target: 8000000, saved: 3200000, note: 'Flights, hotel and meals for four — planned for June 2027.' },
      { id: 'goal-3', name: 'New laptop for Sari', target: 7500000, saved: 5000000, note: 'For her part-time design work.' },
    ],
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && parsed.budgets && Array.isArray(parsed.goals)) return parsed;
    }
  } catch {
    // corrupted storage: fall through to seed
  }
  const seed = seedState();
  saveState(seed);
  return seed;
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  const seed = seedState();
  saveState(seed);
  return seed;
}

// ---- helpers ----

export function formatIDR(n) {
  return 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(n));
}

export function monthKey(dateStr) {
  return dateStr.slice(0, 7); // '2026-11'
}

export function monthLabel(key) {
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function shortDate(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number);
  return new Date(2026, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function monthTotals(state, key) {
  let income = 0;
  let expense = 0;
  let saved = 0;
  for (const t of state.transactions) {
    if (monthKey(t.date) !== key) continue;
    if (t.type === 'income') income += t.amount;
    else if (t.category === 'Savings') saved += t.amount;
    else expense += t.amount;
  }
  return { income, expense, saved, remaining: income - expense - saved };
}

export function categoryTotals(state, key) {
  const totals = {};
  for (const t of state.transactions) {
    if (t.type !== 'expense' || t.category === 'Savings') continue;
    if (monthKey(t.date) !== key) continue;
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  }
  return totals;
}

export function lastMonths(currentKey, n) {
  const [y, m] = currentKey.split('-').map(Number);
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(y, m - 1 - i, 1);
    out.push(String(d.getFullYear()) + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  }
  return out;
}

export function newId(prefix) {
  return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e6).toString(36);
}
