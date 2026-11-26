# household-budget

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/MakeFunX/household-budget/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/MakeFunX/household-budget/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

HomeBudget is a household budget site: add income and expenses, watch every category against its monthly limit, and keep the savings rate in sight. It runs as plain static files — no build step, no network, no account. Everything you add is saved in the browser's local storage, on your device only.

## Pages

- **Dashboard** — income, spending and what's left this month, a donut of where the money went, budget meters, and the latest transactions.
- **Transactions** — add an income or expense, delete one, and reset to the sample household.
- **Budgets** — a monthly limit per category with a progress meter and what is left.
- **Insights** — biggest category and day, a bar chart of spending, and three concrete things worth doing, computed from your own numbers.
- **Guide** — five steps to run a budget that sticks, and the 50 / 30 / 20 rule.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — it works on desktop and on a phone.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

---

<sub>Entered on [make.fun](https://make.fun/?ref=b0wmr685&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
