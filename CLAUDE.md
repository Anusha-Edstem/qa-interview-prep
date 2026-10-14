# CLAUDE.md

Thin router for this repository. It stays small and loads every session; everything else loads on
demand. Do not pre-read the convention files "just in case".

## Guardrails (hooks)

`.claude/hooks/` block secrets on write, block a comment added to a source file, block commits to
protected branches, and lint what was just written. They fire automatically. If one blocks you, fix
the cause; do not work around it.

## Where the rules live

| Topic                                          | Source                                                            |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| Stack standards, what review flags as blocking | the conventions skill named below                                 |
| Comments in source files                       | `.claude/conventions/comment-conventions.md`                      |
| Git, commit and branch hygiene                 | `.claude/conventions/git-hygiene.md`                              |
| Issues, PR titles, merge rules                 | `.claude/conventions/github-pr.md`                                |
| Review method and the review body shape        | `.claude/conventions/review-conventions.md`, `review-template.md` |
| Reviewer agents                                | `.claude/agents/`                                                 |
| The scenarios this suite covers                | `docs/e2e-scenarios.md`                                           |

Each rule lives in one place; everything else points there. Do not repeat a rule here.

## Project-specific

This is the **only** register of this repo's values. Every convention file and skill that needs one
reads it here; none of them restates it, so a value changes in exactly one place. A value that
appears twice is a defect.

- **Repo**: `Anusha-Edstem/qa-interview-prep` — Playwright suites for Sauce Demo (UI checkout), Restful Booker (API), the Playwright API-mocking demo (network control) and The Internet (tricky UI); runs locally and in GitHub Actions
- **Stack**: Playwright Test + TypeScript on Node.js 20+, driving Chromium, Firefox and WebKit plus a request-only API project
- **Package Manager**: npm
- **Default Branch**: `main`
- **Protected Branches**: `main`, `master`
- **Branch Name**: `feature/q<N>-<short-slug>`, with `feature/q0-base-project` for the base
- **Ticket Prefix**: NULL
- **PR Title**: `Q<N>: <short description>`, where Q0 is the base project (10–100 chars)
- **PR Title Regex**: `^Q[0-5]: .{5,95}$`
- **PR Template**: `.github/PULL_REQUEST_TEMPLATE.md`
- **Gate Commands**:
  - `npm run typecheck`
  - `npm run lint`
  - `npm run format:check`
  - `npx playwright test --list`
- **Version Bump**: NULL
- **Merge Method**: squash merge, then delete the branch; the next branch is cut from the updated default branch
- **Conventions Skills**: `playwright-conventions`
- **Reviewer Agents**: `senior-playwright-engineer`
- **Target Environment**: the public practice sites; each base URL is overridable through the `*_URL` variables in `.env.example`, read only by `src/config/env.ts`
- **Siblings**: NULL
