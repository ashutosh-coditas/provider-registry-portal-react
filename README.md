# Provider Portal

A React registry where doctors register, complete a 4-step certification, and recertify every 3 years. It is frontend only: all data is mocked in `localStorage`.

The full spec, rules and architecture are in [CONTEXT.md](CONTEXT.md).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173  (design system: /design-system)
```

| Script | What it does |
|---|---|
| `npm run dev` | Starts the dev server |
| `npm run build` | Type-checks, then builds for production |
| `npm run typecheck` | Runs the TypeScript project build (`tsc -b`) |
| `npm run lint` | Lints `src` with oxlint |
| `npm run format` | Formats the code with Prettier |

## Demo accounts

| Username | Password | Scenario |
|---|---|---|
| `admin` | `Admin@123` | Admin |
| `cand.new` / `cand.partial` / `cand.ready` | `Pass@123` | Candidate with Initial Certification at 0/4, 2/4 and 3/4 |
| `dip.fresh` / `dip.ontrack` / `dip.overdue` / `dip.veteran` | `Pass@123` | Diplomats in different cycle states |

In demo builds, the **Demo users** menu in the top bar signs in as any of these accounts in one click.

**Trying out cycles:** log in as `admin` and go to **Settings → Simulated date**. Pick a date a few years ahead, then open a diplomat account to see cycles become due and overdue. **Settings → Reset demo data** restores the seed data and logs you out.

## Environment

See `.env`: `VITE_USE_MOCK_API`, `VITE_API_BASE_URL`, `VITE_MOCK_DELAY_MS`, `VITE_SHOW_DEMO_TOOLS`.
