# qa-interview-prep

Five Playwright Test suites in TypeScript, one per question, each shipped as its own pull request.

| #   | Question                | PR link                                                           |
| --- | ----------------------- | ----------------------------------------------------------------- |
| 1   | UI Checkout Flow        | [#8](https://github.com/Anusha-Edstem/qa-interview-prep/pull/8)   |
| 2   | API Booking Tests       | [#9](https://github.com/Anusha-Edstem/qa-interview-prep/pull/9)   |
| 3   | Network Mocking         | [#10](https://github.com/Anusha-Edstem/qa-interview-prep/pull/10) |
| 4   | Tricky UI Interactions  | [#12](https://github.com/Anusha-Edstem/qa-interview-prep/pull/12) |
| 5   | CI Pipeline & Reporting |                                                                   |

**Video:**

## Applications under test

Public practice sites only: [Sauce Demo](https://www.saucedemo.com),
[Restful Booker](https://restful-booker.herokuapp.com),
[the Playwright API-mocking demo](https://demo.playwright.dev/api-mocking) and
[The Internet](https://the-internet.herokuapp.com).

## Install

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install --with-deps
cp .env.example .env
```

Fill in `.env`. Every variable is read and validated by `src/config/env.ts`, the only file that
touches the environment; a missing one fails the test that needs it, naming the variable.

## Run

```bash
npm test                              # every project
npx playwright test --project=chromium
npm run test:smoke                    # tests tagged @smoke
npm run test:regression               # tests tagged @regression
npx playwright test --ui              # UI mode
```

## Read a failure

```bash
npm run report                        # opens playwright-report/index.html
npx playwright show-trace test-results/<test>/trace.zip
```

Traces, screenshots and videos are kept only for failed tests, under `test-results/`.

## Layout

```
playwright.config.ts   projects, reporters, retries
src/config/env.ts      the only reader of the environment
src/fixtures/base.ts   the single test/expect every spec imports
src/pages/             page objects: locators and intent-named actions, no assertions
src/api/               API clients used for setup and teardown
src/data/              factories and file fixtures
src/setup/health.ts    reachability check every project depends on
tests/smoke/           @smoke specs
tests/regression/      @regression specs, one folder per module
docs/e2e-scenarios.md  the scenario catalogue specs cite by ID
```

## Quality gates

`npm run typecheck`, `npm run lint`, `npm run format:check` and `npx playwright test --list` run on
every pull request.
