# HomeLedger — Household Budget Site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/ahmadmulyadi1507/makefun-household-budget-site-20261126/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/ahmadmulyadi1507/makefun-household-budget-site-20261126/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

A working household budget site for the Hartono family (Jakarta), built as
plain static files — no build step, no network requests, desktop and phone.

## What it does

- **Dashboard** — income, spending, savings and what's left this month, a
  spending-by-category donut chart, budgets to watch, recent transactions and
  savings-goal progress. Month picker covers the last six months.
- **Transactions** — add, edit and delete income and expenses; filter by
  month, type, category or search text. Everything saves in localStorage.
- **Budgets** — a monthly cap per spending category with a progress bar,
  over-budget warnings, and an inline form to change any cap.
- **Goals** — savings goals with progress bars; add a contribution to any
  goal, or create a new one.
- **Reports** — income vs spending bars for the last six months, a category
  breakdown for the selected month, top categories, and a one-click CSV
  download of all transactions.

Figures are realistic example figures for one household (June–November 2026,
rupiah). Change anything and it persists on the device; "Reset demo data"
in the footer restores the examples.

## Run it

```sh
node serve.ts
# then open http://localhost:8080
```

Or open `app/index.html` directly from the files — the site needs no server
and no network.

## Build the submission bundle

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`,
unchanged from the kit).

## License

MIT — see [LICENSE](LICENSE).
