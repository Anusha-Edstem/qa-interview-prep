---
name: playwright-conventions
description: The Playwright + TypeScript standard for this repo — architecture, data isolation, locators, waits, tagging — and what review treats as blocking. Load before writing or reviewing anything under tests/, src/ or playwright.config.ts.
---

# Playwright conventions

- **Scope**: `tests/`, `src/`, `playwright.config.ts`.

Apply it to the lines a change **adds or modifies**; a pre-existing violation in untouched code is a
backlog item, not a blocker. Surrounding code is never precedent for a new violation.

**Architecture**

- Specs live in `tests/`, framework code in `src/`. `--grep` and `--shard` collect from the test
  directory, so a helper placed under it can be collected as a test.
- A spec imports `test` and `expect` from `@fixtures/base`, never from `@playwright/test`. A direct
  import compiles, runs, silently skips every fixture, and then fails as though the product broke.
- A page object exposes named locators and intent-named actions and never asserts. An assertion in
  the spec names the scenario when it fails; buried in a helper it names the helper.
- A page object holds no state beyond `page`. A locator cached in a constructor is bound to a DOM
  that no longer exists by the time the action runs.
- One module reads the environment, validates it, and fails loudly naming the missing variable.

**State and data**

- Seed preconditions through the API so a spec fails only for its own reason. Seeding does not cover
  creation journeys, which still need their own UI specs.
- Never assert on an API response inside a UI spec. The API layer is setup and teardown only.
- Generate unique values through a factory. Workers and runs share one backend, so a hardcoded email
  is a race.
- A spec owns what it creates, tears it down, and depends on no other spec's data or ordering. Prove
  it with a parallel repeat run before opening the PR, not with one serial pass.
- Authenticate by injecting `storageState`, except in the specs that test login. `storageState`
  cannot carry `sessionStorage`; keys that live there need `page.addInitScript`.
- Credentials never reach the repository, a log line, a trace or a screenshot.

**Testing**

- Every promise is awaited. A missing `await` races the action against the assertion and lets machine
  load pick the winner — the most common cause of silent flake.
- No `waitForTimeout` and no fixed sleep. Use web-first assertions, which retry and report what they
  saw. A fixed wait is either wasted time multiplied across the suite or too short on a slow day.
- Locate by role, label or text. No CSS class, no Tailwind class, no XPath — a class encodes
  appearance, not identity.
- Scope a locator to its component wherever a second instance can appear. Never use a text locator on
  user-generated or reword-prone content.
- Assert user-visible behaviour. A spec that asserts nothing is a defect, and so is an assertion that
  cannot fail.
- No conditional logic in a test body. A test takes one path, so an assertion never sits in a branch
  it might not enter.
- `force: true` never clicks through an overlay a real user could not click through.
- A skipped test is conditional and names its condition. `test.only`, bare `test.skip` and bare
  `test.fixme` are never committed.
- Tag every spec. Directory follows the tag, not the module: `@smoke` under `tests/smoke/`,
  everything else under `tests/regression/<module>/`.

**Blocking in review**

- **False confidence** — no assertion; an assertion that cannot fail, such as a truthiness check on a
  locator object; an `expect` in a branch the test never enters; `test.only`; an unconditional skip.
- **Broken isolation** — hardcoded or shared data, a fixture at the wrong scope, a create with no
  cleanup, order dependence between specs.
- **Locator policy** — a CSS class or XPath; an unscoped locator where the component repeats; a text
  locator on user-generated content.
- **Flake vectors** — a missing `await`, a fixed wait, `force: true` over a real overlay, conditional
  logic in a test, an assertion racing a navigation.
- **Broken layering** — an assertion in a page object, an API assertion in a UI spec, a spec reaching
  past its page object to a raw selector, `test` imported from `@playwright/test`.
- **Secrets** — a credential in a tracked file, or a log, trace or screenshot that can carry one.
- **Comments** — any comment added to a changed source file.
- **Placement** — a spec in the wrong directory for its tag, or carrying no tag at all.

