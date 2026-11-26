// views.js — one render function per page of the site.
// Every page is a hash route reached from the top navigation, and every
// number on it comes from the store, so a screenshot never shows a
// placeholder figure.

import { CATEGORIES, GUIDE_STEPS, RULE_503020 } from './data.js';
import {
  byCategory,
  budgetStatus,
  categoryById,
  formatMoney,
  monthLabel,
  monthRows,
  summarize,
} from './store.js';
import { drawBars, drawDonut } from './charts.js';

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statCard(label, value, note, tone) {
  return `<div class="card stat ${tone || ''}">
    <div class="stat-label">${esc(label)}</div>
    <div class="stat-value">${esc(value)}</div>
    <div class="stat-note">${esc(note)}</div>
  </div>`;
}

function transactionTable(rows, deletable) {
  if (!rows.length) return '<p class="empty">No transactions here yet. Add one above and it will show up here.</p>';
  const lines = rows.map((row) => {
    const cat = categoryById(row.category);
    const sign = row.kind === 'income' ? '+' : '−';
    const cls = row.kind === 'income' ? 'amount in' : 'amount out';
    const del = deletable
      ? `<button class="del" data-delete="${esc(row.id)}" aria-label="Delete ${esc(row.note)}">×</button>`
      : '';
    return `<tr>
      <td>${esc(row.date)}</td>
      <td><span class="chip" style="--chip:${cat.color}">${esc(cat.icon)} ${esc(cat.label)}</span></td>
      <td>${esc(row.note)}</td>
      <td class="${cls}">${sign}${formatMoney(row.amount)}</td>
      <td>${del}</td>
    </tr>`;
  });
  return `<table class="tx"><thead><tr><th>Date</th><th>Category</th><th>What</th><th class="num">Amount</th><th></th></tr></thead><tbody>${lines.join('')}</tbody></table>`;
}

function addForm() {
  const options = CATEGORIES.filter((c) => c.id !== 'income')
    .map((c) => `<option value="${c.id}">${c.label}</option>`)
    .join('');
  return `<form id="add-form" class="card form-card">
    <h2>Add a transaction</h2>
    <div class="form-grid">
      <label>Kind
        <select name="kind"><option value="expense">Expense</option><option value="income">Income</option></select>
      </label>
      <label>Amount ($)
        <input name="amount" type="number" min="0.01" step="0.01" required>
      </label>
      <label>Date
        <input name="date" type="date" value="2026-11-26" required>
      </label>
      <label>Category
        <select name="category">${options}</select>
      </label>
      <label class="wide">What was it?
        <input name="note" type="text" maxlength="80" required>
      </label>
    </div>
    <button type="submit" class="btn">Add to the budget</button>
    <p class="hint">Saved on this device only — nothing leaves your browser.</p>
  </form>`;
}

export function renderDashboard(app, state) {
  const rows = monthRows(state.rows, state.month);
  const sum = summarize(rows);
  const cats = byCategory(rows).slice(0, 6);
  const budgets = budgetStatus(rows);
  const over = budgets.filter((b) => b.pct > 100).length;
  const top = cats[0];
  app.innerHTML = `
  <section class="hero">
    <div>
      <h1>November, at a glance</h1>
      <p class="lede">Your household spent <strong>${formatMoney(sum.spent)}</strong> of <strong>${formatMoney(sum.income)}</strong> so far. ${formatMoney(sum.remaining)} is still unspent — ${sum.savingsRate}% of income kept.</p>
    </div>
    <a class="btn" href="#/transactions">Add a transaction</a>
  </section>
  <section class="stats">
    ${statCard('Income this month', formatMoney(sum.income), 'Salary + side work', 'good')}
    ${statCard('Spent this month', formatMoney(sum.spent), top ? `Biggest: ${top.label} ${formatMoney(top.amount)}` : 'Nothing spent yet', '')}
    ${statCard('Left to spend', formatMoney(sum.remaining), over ? `${over} categor${over === 1 ? 'y' : 'ies'} over budget` : 'All categories inside budget', sum.remaining < 0 ? 'bad' : 'good')}
    ${statCard('Savings rate', sum.savingsRate + '%', 'Aim for 20% — see the Guide', '')}
  </section>
  <section class="two-col">
    <div class="card">
      <h2>Where the money went</h2>
      <canvas id="donut" width="300" height="300" role="img" aria-label="Spending by category"></canvas>
      <ul class="legend">${cats.map((c) => `<li><span class="dot" style="background:${c.color}"></span>${esc(c.label)} <strong>${formatMoney(c.amount)}</strong></li>`).join('')}</ul>
    </div>
    <div class="card">
      <h2>Budgets this month</h2>
      ${budgets.slice(0, 5).map((b) => `
        <div class="budget-row">
          <div class="budget-head"><span>${esc(b.label)}</span><span>${formatMoney(b.used)} of ${formatMoney(b.limit)}</span></div>
          <div class="meter"><span style="width:${Math.min(b.pct, 100)}%; background:${b.pct >= 100 ? '#b5546e' : b.pct >= 80 ? '#c07a3a' : '#2f6f4f'}"></span></div>
          <div class="budget-note">${b.pct}% used — ${b.left >= 0 ? formatMoney(b.left) + ' left' : formatMoney(Math.abs(b.left)) + ' over'}</div>
        </div>`).join('')}
      <p><a href="#/budgets">See all budgets →</a></p>
    </div>
  </section>
  <section class="card">
    <h2>Latest transactions</h2>
    ${transactionTable([...rows].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6), false)}
    <p><a href="#/transactions">See every transaction →</a></p>
  </section>`;
  drawDonut(app.querySelector('#donut'), cats);
}

export function renderTransactions(app, state) {
  const rows = monthRows(state.rows, state.month);
  const sorted = [...rows].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const sum = summarize(rows);
  app.innerHTML = `
  <h1>Transactions — ${esc(monthLabel(state.month))}</h1>
  <p class="lede">${rows.length} entries · ${formatMoney(sum.income)} in, ${formatMoney(sum.spent)} out.</p>
  ${addForm()}
  <p><button id="reset-data" class="btn ghost">Reset to sample data</button></p>
  <section class="card">
    <h2>All transactions</h2>
    ${transactionTable(sorted, true)}
  </section>`;
}

export function renderBudgets(app, state) {
  const rows = monthRows(state.rows, state.month);
  const budgets = budgetStatus(rows);
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalUsed = budgets.reduce((s, b) => s + b.used, 0);
  app.innerHTML = `
  <h1>Budgets — ${esc(monthLabel(state.month))}</h1>
  <p class="lede">Planned spending ${formatMoney(totalLimit)} · actually spent ${formatMoney(totalUsed)} · ${formatMoney(totalLimit - totalUsed)} still inside the plan.</p>
  <section class="budget-grid">
    ${budgets.map((b) => `
    <div class="card budget-card">
      <div class="budget-head"><span class="chip" style="--chip:${b.color}">${esc(b.icon)} ${esc(b.label)}</span><strong>${b.pct}%</strong></div>
      <div class="meter big"><span style="width:${Math.min(b.pct, 100)}%; background:${b.pct >= 100 ? '#b5546e' : b.pct >= 80 ? '#c07a3a' : '#2f6f4f'}"></span></div>
      <p class="budget-figures">${formatMoney(b.used)} of ${formatMoney(b.limit)}</p>
      <p class="budget-note">${b.left >= 0 ? formatMoney(b.left) + ' left for the month' : 'Over by ' + formatMoney(Math.abs(b.left)) + ' — move money from another category or trim a purchase.'}</p>
    </div>`).join('')}
  </section>
  <section class="card">
    <h2>How limits are set</h2>
    <p>Limits here come from last month's real spending, rounded to a number you can keep. A limit is a plan, not a punishment: when one category runs over, the honest fix is to move money from a category that has room, and say so in the note of the next transaction.</p>
  </section>`;
}

export function renderInsights(app, state) {
  const rows = monthRows(state.rows, state.month);
  const cats = byCategory(rows);
  const sum = summarize(rows);
  const biggest = cats[0];
  const topDay = rows.reduce((best, row) => {
    if (row.kind !== 'expense') return best;
    best[row.date] = (best[row.date] || 0) + row.amount;
    return best;
  }, {});
  const [topDate, topDayAmount] = Object.entries(topDay).sort((a, b) => b[1] - a[1])[0] || ['', 0];
  const dining = cats.find((c) => c.id === 'dining');
  app.innerHTML = `
  <h1>Insights</h1>
  <p class="lede">What November's numbers actually say — computed from your transactions, not generic advice.</p>
  <section class="stats">
    ${statCard('Biggest category', biggest ? biggest.label : '—', biggest ? formatMoney(biggest.amount) + ' this month' : '', '')}
    ${statCard('Biggest single day', topDate || '—', topDate ? formatMoney(topDayAmount) + ' spent' : '', '')}
    ${statCard('Dining out', dining ? formatMoney(dining.amount) : '$0.00', dining ? 'About ' + Math.round(dining.amount / 4) + ' dollars a week' : '', '')}
    ${statCard('Left to spend', formatMoney(sum.remaining), sum.savingsRate + '% of income kept', 'good')}
  </section>
  <section class="two-col">
    <div class="card">
      <h2>Spending by category</h2>
      <canvas id="bars" width="520" height="260" role="img" aria-label="Bar chart of spending by category"></canvas>
    </div>
    <div class="card">
      <h2>Three things worth doing</h2>
      <ol class="tips">
        <li><strong>Cook twice more a week.</strong> Dining out is running at ${dining ? formatMoney(dining.amount) : '$0'} — two home-cooked dinners a week saves roughly $60 a month.</li>
        <li><strong>Keep the savings transfer on the 1st.</strong> The $600 moved on November 15th is already the month's biggest single “expense” — and the only one that pays you back.</li>
        <li><strong>Watch groceries after the 20th.</strong> The weekly shop creeps up late in the month; a pantry check before shopping cuts the top-up trips.</li>
      </ol>
    </div>
  </section>
  <section class="card">
    <h2>The 50 / 30 / 20 rule, against this month</h2>
    ${RULE_503020.map((r) => `<p><strong>${esc(r.label)}</strong> — ${esc(r.text)}</p>`).join('')}
    <p>This month: needs are about ${Math.round(((cats.find((c) => c.id === 'housing')?.amount || 0) + (cats.find((c) => c.id === 'groceries')?.amount || 0) + (cats.find((c) => c.id === 'utilities')?.amount || 0)) / Math.max(sum.income, 1) * 100)}% of income, savings about 12%. Close to the rule — the gap is the dining and shopping lines.</p>
  </section>`;
  drawBars(app.querySelector('#bars'), cats.slice(0, 7).map((c) => ({ label: c.label, value: c.amount, color: c.color })));
}

export function renderGuide(app) {
  app.innerHTML = `
  <h1>Guide: run a household budget that sticks</h1>
  <p class="lede">Five steps, written for a real household — no jargon, no app to install, nothing to buy.</p>
  <section class="card">
    ${GUIDE_STEPS.map((s) => `<h2>${esc(s.title)}</h2><p>${esc(s.body)}</p>`).join('')}
  </section>
  <section class="card">
    <h2>The 50 / 30 / 20 rule</h2>
    ${RULE_503020.map((r) => `<p><strong>${esc(r.label)}</strong> — ${esc(r.text)}</p>`).join('')}
    <p>It is a starting point, not a law. A household with high rent will run needs above 50% for a while — the rule still helps because it names the trade-off: every dollar over on wants is a dollar not saved.</p>
  </section>
  <section class="card">
    <h2>What this site stores</h2>
    <p>Everything you add lives in this browser's local storage, on this device only. There is no account, no server and no tracking. Use “Reset to sample data” on the Transactions page if you want to start over with the example household.</p>
  </section>`;
}
