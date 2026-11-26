// store.js — the household's money, kept in localStorage.
// One job only: load, save, add, delete, and add up the numbers.
// No network, no cookies, no dates outside the transactions themselves.

import { CATEGORIES, MONTHLY_BUDGETS, SEED_TRANSACTIONS } from './data.js';

const KEY = 'homebudget.transactions.v1';

function clone(rows) {
  return rows.map((row) => ({ ...row }));
}

export function loadTransactions() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(SEED_TRANSACTIONS));
      return clone(SEED_TRANSACTIONS);
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return clone(SEED_TRANSACTIONS);
    return parsed.filter((row) => row && typeof row.amount === 'number' && row.date);
  } catch {
    return clone(SEED_TRANSACTIONS);
  }
}

export function saveTransactions(rows) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    // Storage full or unavailable: the page still works for this visit.
  }
}

export function resetTransactions() {
  localStorage.setItem(KEY, JSON.stringify(SEED_TRANSACTIONS));
  return clone(SEED_TRANSACTIONS);
}

export function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function monthOf(date) {
  return String(date).slice(0, 7);
}

export function monthLabel(yyyymm) {
  const [year, month] = yyyymm.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function monthRows(rows, yyyymm) {
  return rows.filter((row) => monthOf(row.date) === yyyymm);
}

export function addTransaction(rows, fields) {
  const amount = Math.abs(Number(fields.amount));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const entry = {
    id: 'u' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36),
    date: fields.date || new Date().toISOString().slice(0, 10),
    kind: fields.kind === 'income' ? 'income' : 'expense',
    category: fields.category || 'other',
    note: String(fields.note || '').trim() || 'Untitled',
    amount: Math.round(amount * 100) / 100,
  };
  return [entry, ...rows];
}

export function deleteTransaction(rows, id) {
  return rows.filter((row) => row.id !== id);
}

export function summarize(rows) {
  let income = 0;
  let spent = 0;
  for (const row of rows) {
    if (row.kind === 'income') income += row.amount;
    else spent += row.amount;
  }
  const remaining = income - spent;
  return {
    income: round2(income),
    spent: round2(spent),
    remaining: round2(remaining),
    savingsRate: income > 0 ? Math.max(0, Math.round((remaining / income) * 100)) : 0,
  };
}

export function byCategory(rows) {
  const totals = new Map();
  for (const row of rows) {
    if (row.kind !== 'expense') continue;
    totals.set(row.category, round2((totals.get(row.category) || 0) + row.amount));
  }
  return [...totals.entries()]
    .map(([id, amount]) => ({ id, amount, ...categoryById(id) }))
    .sort((a, b) => b.amount - a.amount);
}

export function budgetStatus(rows) {
  const spent = new Map();
  for (const row of rows) {
    if (row.kind !== 'expense') continue;
    spent.set(row.category, (spent.get(row.category) || 0) + row.amount);
  }
  return Object.entries(MONTHLY_BUDGETS).map(([id, limit]) => {
    const used = round2(spent.get(id) || 0);
    return {
      id,
      limit,
      used,
      left: round2(limit - used),
      pct: limit > 0 ? Math.round((used / limit) * 100) : 0,
      ...categoryById(id),
    };
  });
}

export function monthsAvailable(rows) {
  const months = [...new Set(rows.map((row) => monthOf(row.date)))];
  months.sort().reverse();
  return months;
}

export function formatMoney(amount) {
  const sign = amount < 0 ? '−' : '';
  return sign + '$' + Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
