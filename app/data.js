// Seed data for HomeBudget: one household's November 2026 money, written
// out so the site opens with real figures in place instead of empty cards.
// Amounts are US dollars. Every entry is a plain object the store can save
// back to localStorage unchanged, so the seed and the user's own entries
// share one shape.

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2f6f4f', icon: '⌂' },
  { id: 'groceries', label: 'Groceries', color: '#4a9b6d', icon: '◍' },
  { id: 'transport', label: 'Transport', color: '#3d7ea6', icon: '➤' },
  { id: 'utilities', label: 'Utilities', color: '#7a6bb5', icon: '⚡' },
  { id: 'dining', label: 'Dining out', color: '#c07a3a', icon: '🍽' },
  { id: 'entertainment', label: 'Entertainment', color: '#b5546e', icon: '♪' },
  { id: 'health', label: 'Health', color: '#4f8a8b', icon: '+' },
  { id: 'shopping', label: 'Shopping', color: '#8a6d3b', icon: '▣' },
  { id: 'savings', label: 'Savings', color: '#2f6f4f', icon: '⬢' },
  { id: 'income', label: 'Income', color: '#2f6f4f', icon: '$' },
  { id: 'other', label: 'Other', color: '#8a8d91', icon: '•' },
];

export const MONTHLY_BUDGETS = {
  housing: 1650,
  groceries: 620,
  transport: 280,
  utilities: 310,
  dining: 240,
  entertainment: 150,
  health: 180,
  shopping: 200,
  savings: 600,
};

export const SEED_TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', kind: 'income', category: 'income', note: 'Salary — November', amount: 4850 },
  { id: 't02', date: '2026-11-01', kind: 'expense', category: 'housing', note: 'Rent', amount: 1650 },
  { id: 't03', date: '2026-11-02', kind: 'expense', category: 'groceries', note: 'Weekly shop — market', amount: 148.2 },
  { id: 't04', date: '2026-11-03', kind: 'expense', category: 'transport', note: 'Metro card top-up', amount: 52 },
  { id: 't05', date: '2026-11-04', kind: 'expense', category: 'dining', note: 'Lunch with Maya', amount: 34.5 },
  { id: 't06', date: '2026-11-05', kind: 'expense', category: 'utilities', note: 'Electricity bill', amount: 96.4 },
  { id: 't07', date: '2026-11-06', kind: 'expense', category: 'groceries', note: 'Bakery and fruit', amount: 41.75 },
  { id: 't08', date: '2026-11-07', kind: 'expense', category: 'entertainment', note: 'Cinema tickets', amount: 28 },
  { id: 't09', date: '2026-11-08', kind: 'expense', category: 'health', note: 'Pharmacy', amount: 22.9 },
  { id: 't10', date: '2026-11-09', kind: 'expense', category: 'groceries', note: 'Weekly shop — supermarket', amount: 162.35 },
  { id: 't11', date: '2026-11-10', kind: 'expense', category: 'transport', note: 'Fuel', amount: 48.6 },
  { id: 't12', date: '2026-11-11', kind: 'expense', category: 'shopping', note: 'Winter coat', amount: 119 },
  { id: 't13', date: '2026-11-12', kind: 'expense', category: 'dining', note: 'Takeaway — Thursday', amount: 26.8 },
  { id: 't14', date: '2026-11-13', kind: 'income', category: 'income', note: 'Weekend design work', amount: 320 },
  { id: 't15', date: '2026-11-14', kind: 'expense', category: 'utilities', note: 'Internet and phone', amount: 89 },
  { id: 't16', date: '2026-11-15', kind: 'expense', category: 'savings', note: 'Transfer to savings', amount: 600 },
  { id: 't17', date: '2026-11-16', kind: 'expense', category: 'groceries', note: 'Weekly shop — market', amount: 139.9 },
  { id: 't18', date: '2026-11-17', kind: 'expense', category: 'health', note: 'Dentist check-up', amount: 85 },
  { id: 't19', date: '2026-11-18', kind: 'expense', category: 'transport', note: 'Ride to airport', amount: 31.4 },
  { id: 't20', date: '2026-11-19', kind: 'expense', category: 'dining', note: 'Dinner — family birthday', amount: 74.2 },
  { id: 't21', date: '2026-11-20', kind: 'expense', category: 'entertainment', note: 'Streaming subscription', amount: 15.99 },
  { id: 't22', date: '2026-11-21', kind: 'expense', category: 'groceries', note: 'Weekly shop — supermarket', amount: 154.6 },
  { id: 't23', date: '2026-11-22', kind: 'expense', category: 'shopping', note: 'Kids’ school supplies', amount: 46.3 },
  { id: 't24', date: '2026-11-23', kind: 'expense', category: 'utilities', note: 'Water bill', amount: 58.2 },
  { id: 't25', date: '2026-11-24', kind: 'expense', category: 'transport', note: 'Fuel', amount: 44.75 },
  { id: 't26', date: '2026-11-25', kind: 'expense', category: 'dining', note: 'Coffee and pastries', amount: 18.6 },
  { id: 't27', date: '2026-11-25', kind: 'expense', category: 'groceries', note: 'Thanksgiving groceries', amount: 96.45 },
  { id: 't28', date: '2026-11-26', kind: 'expense', category: 'entertainment', note: 'Board game night', amount: 24 },
];

export const GUIDE_STEPS = [
  {
    title: '1. Add what comes in and what goes out',
    body: 'Every paycheck, every coffee. A budget that only tracks the big bills misses the small leaks — and the small leaks are usually where the money goes.',
  },
  {
    title: '2. Give every dollar a category',
    body: 'Housing, groceries, transport and the rest. When a transaction has a category, the dashboard can tell you which part of life is running over budget.',
  },
  {
    title: '3. Set a monthly limit per category',
    body: 'Start from last month’s real spending, not a wish. A limit you can actually keep beats an ambitious one you abandon by the second week.',
  },
  {
    title: '4. Check the remaining budget weekly',
    body: 'Open the dashboard on Sunday. If groceries are at 80% by the 15th, you still have time to cook at home for a few days — that is the whole point.',
  },
  {
    title: '5. Pay savings first',
    body: 'Move the savings transfer to the 1st of the month, the same day the salary lands. What is left after saving is what you can spend, not the other way round.',
  },
];

export const RULE_503020 = [
  { label: 'Needs — 50%', text: 'Rent, groceries, utilities, transport and health. The bills a household cannot skip.' },
  { label: 'Wants — 30%', text: 'Dining out, entertainment, streaming and shopping. The fun part — capped, not banned.' },
  { label: 'Savings — 20%', text: 'Emergency fund, debt payoff and long-term savings. This month’s seed data saves about 12% — room to grow.' },
];
