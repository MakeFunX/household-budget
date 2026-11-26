// main.js — the site's wiring: hash routing, the add-transaction form,
// the month picker, and the reset button. Nothing here fetches anything.

import {
  addTransaction,
  deleteTransaction,
  loadTransactions,
  monthsAvailable,
  monthLabel,
  resetTransactions,
  saveTransactions,
} from './store.js';
import {
  renderBudgets,
  renderDashboard,
  renderGuide,
  renderInsights,
  renderTransactions,
} from './views.js';

const app = document.getElementById('app');
const monthSelect = document.getElementById('month-select');

const state = {
  rows: loadTransactions(),
  month: '2026-11',
};

const ROUTES = {
  '': renderDashboard,
  '/': renderDashboard,
  '/transactions': renderTransactions,
  '/budgets': renderBudgets,
  '/insights': renderInsights,
  '/guide': renderGuide,
};

function fillMonths() {
  const months = monthsAvailable(state.rows);
  if (!months.includes(state.month)) months.unshift(state.month);
  monthSelect.innerHTML = months
    .map((m) => `<option value="${m}"${m === state.month ? ' selected' : ''}>${monthLabel(m)}</option>`)
    .join('');
}

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

function render() {
  fillMonths();
  const route = currentRoute();
  document.querySelectorAll('.nav a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + route);
  });
  ROUTES[route](app, state);
  const form = document.getElementById('add-form');
  if (form) form.addEventListener('submit', onAdd);
  app.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', () => {
      state.rows = deleteTransaction(state.rows, button.dataset.delete);
      saveTransactions(state.rows);
      render();
    });
  });
  const reset = document.getElementById('reset-data');
  if (reset) reset.addEventListener('click', onReset);
}

function onAdd(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  const updated = addTransaction(state.rows, {
    kind: data.get('kind'),
    amount: data.get('amount'),
    date: data.get('date'),
    category: data.get('category'),
    note: data.get('note'),
  });
  if (!updated) {
    window.alert('Enter an amount above $0.00.');
    return;
  }
  state.rows = updated;
  saveTransactions(state.rows);
  state.month = String(data.get('date')).slice(0, 7);
  window.location.hash = '#/transactions';
  render();
}

function onReset() {
  if (!window.confirm('Replace all transactions with the sample household data?')) return;
  state.rows = resetTransactions();
  saveTransactions(state.rows);
  render();
}

monthSelect.addEventListener('change', () => {
  state.month = monthSelect.value;
  render();
});

window.addEventListener('hashchange', render);
render();
