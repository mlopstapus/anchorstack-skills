---
name: as-tech-debt-audit
version: 2.0.0
tier: universal
description: Full codebase tech debt audit — runs tests, inspects code structure, checks dependencies, finds stale docs, and produces a prioritized report. Then offers to convert findings into backlog items. Use this skill when the user wants to assess code quality, understand what's broken or rotting, get a health check on a codebase, or figure out what technical debt exists before a refactor or new hire ramp-up. Trigger on any mention of tech debt, code quality audit, codebase review, or "what's wrong with this code".
---

# Tech Debt Audit

A tech debt audit is what a senior engineer does when they first join a project and want an honest picture of what they're working with. The goal is not to list everything that's imperfect — it's to surface what's actually costing the team: slowing them down, creating fragility, hiding bugs, or blocking growth.

Read `.claude/anchorstack/project.md` and `spec/tenets.md` if they exist — the stack and stated principles shape what counts as debt here.

---

## Phase 1 — Scope (optional)

If the user hasn't already specified, ask briefly:
- Any areas to prioritize or skip?
- Any known problem areas to start with?

If no guidance, do a full sweep. Don't ask more than this.

---

## Phase 2 — Run the tests

Before reading a line of code, run the test suite. Test results are objective — they tell you what's actually broken, not what looks broken.

```bash
# detect and run (check project.md for the test command, or try these)
npm test / yarn test / pnpm test
pytest / python -m pytest
go test ./...
cargo test
bundle exec rspec
```

Capture:
- How many tests pass, fail, error
- Which tests are failing and what error they produce
- Any tests that are skipped or marked pending

Failing tests are **Critical** findings by definition — they mean the codebase's own specification of correct behavior is broken.

---

## Phase 3 — Scan the codebase

Work through each category. For every finding, note the file path (and line number where useful). Don't list every instance of every issue — identify patterns and representative examples.

### Tests and coverage
- Failing tests (from Phase 2)
- Skipped/pending tests with no explanation
- Untested critical paths: auth, payments, data mutations, public APIs
- Tests that only exercise happy paths — no error cases, no edge cases
- Tests that test implementation details instead of behavior (brittle)
- Missing integration coverage for core user flows

### Code structure
- Duplicated logic — same or near-same code appearing in multiple places
- Functions that are too long to hold in your head (rough guide: > 40-50 lines)
- Deep nesting (> 3 levels) that makes control flow hard to follow
- God files or god modules — one file doing too many unrelated things
- Business logic mixed into route handlers, UI components, or other wrong layers
- Circular dependencies
- Inconsistent patterns for the same problem across the codebase (some files do X this way, others do it differently for no clear reason)
- Magic numbers and strings that should be named constants
- Dead code: unused exports, unreachable branches, commented-out blocks
- TODO / FIXME / HACK comments — count them, note if any look old (check git blame)

### Documentation
- README claims that don't match reality (wrong setup steps, wrong commands, missing prereqs)
- Docs that reference files, functions, or endpoints that no longer exist — grep for names mentioned in docs and verify they're still there
- API docs that are out of date with actual endpoints or request/response shapes
- Architecture docs describing a design that's been superseded
- Missing docs on genuinely complex or non-obvious code

### Dependencies
```bash
npm outdated         # or pip list --outdated, bundle outdated, etc.
npm audit            # or equivalent for the stack
```
- Packages more than 1-2 major versions behind (flag the ones that matter)
- Packages with known CVEs — these are Critical
- Unused packages still in package.json / requirements.txt
- Dependencies that could be replaced by a standard library feature

### Error handling
- Silent catches — `catch (e) {}` or catching and only logging with no recovery or re-throw
- Unhandled promise rejections (Node) or unhandled async errors in general
- Error messages to users that either leak internal details or are too generic to be useful
- Missing error boundaries in UI — one component crash shouldn't take down the page

### Type safety (typed codebases)
- `any` used as an escape hatch instead of a real type
- Unchecked type assertions (`as Foo`, non-null `!`) without a comment explaining why it's safe
- Missing null/undefined handling at API or I/O boundaries — values that could be absent but aren't checked

### Performance
- N+1 queries — ORM loops that issue one query per row instead of a join or batch
- Missing database indexes on columns used in `WHERE`, `JOIN`, or `ORDER BY` clauses
- Unbounded list queries with no `LIMIT` — will break on real data volumes
- Synchronous or blocking operations on the hot path that could be async or deferred
- Large binary files committed to the repo that should be in storage

### Observability
- `console.log` / `print` in production code instead of structured logging with levels and context
- No request ID or trace ID — can't correlate logs for a single request across services
- No metrics or no way to detect performance degradation in production
- Logging that's too noisy (everything at INFO) or too quiet (errors swallowed silently)

### CI/CD
- No CI pipeline, or tests / lint / type-check not running in CI
- No automated deployment path — releases are manual
- CI that always passes even when checks fail (misconfigured exit codes, `|| true`)

### Database hygiene (if applicable)
- Schema changes without migrations — manual alterations that drift between environments
- Missing foreign key constraints where referential integrity should be enforced
- No soft-delete strategy — hard deletes make audit trails and recovery impossible
- Schema drift between dev, staging, and production

### Security (surface-level — use as-secret-scan for deep scan)
- Secrets or credentials in non-secret files
- User input passed directly to shell, SQL, or eval without sanitization
- Missing authentication checks on endpoints that should require auth
- Missing input validation at API boundaries

### Operational
- No health check or readiness endpoint
- Hard-coded URLs, ports, or env-specific values that should come from config
- No error boundary or fallback behavior on critical paths
- Required environment variables not validated at startup — app starts and fails later

---

## Phase 4 — Rank findings

Rate each finding by what it's actually costing:

| Severity | What it means |
|----------|---------------|
| **Critical** | Broken right now, or active risk — failing tests, security vulnerabilities, data loss potential |
| **High** | Slows the team materially, creates fragility, or will definitely cause a bug under the right conditions |
| **Medium** | Visible debt that accumulates interest — slows onboarding, makes changes riskier, degrades over time |
| **Low** | Cleanup and polish — worth doing but not urgent |

Be honest about severity. Not everything is Critical. But don't downgrade something because it's embarrassing.

---

## Phase 5 — Write the report

Save to `context/tech-debt-audit-<YYYY-MM-DD>.md`.

```markdown
# Tech Debt Audit — <project> — <date>

## Summary

| Severity | Count |
|----------|-------|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |

**Test suite:** N passing, N failing, N skipped

## Top 3 to address first

[The three findings with the best effort-to-impact ratio — quick wins or things blocking everything else]

## Critical

### [Finding title]
**Location:** `path/to/file.ts:42`
**What:** Description of the issue
**Why it matters:** The actual cost — what's broken or what will break
**Fix:** What needs to change

[repeat for each Critical finding]

## High

[same format]

## Medium

[same format]

## Low

[same format]
```

---

## Phase 6 — Offer to create backlog items

After presenting the report, ask:

> "Would you like to add any of these to the backlog? I can create backlog items from the Critical and High findings, or you can pick specific ones."

If the user says yes:

**Find or create a tech debt epic.** Check if `backlog/` exists and has a tech-debt epic already. If not, create one — it gets the next available number in the sequence:

```
backlog/NNN-tech-debt/
  EPIC.md
  archive/
```

**For each selected finding, create a feature file** following the backlog format:

```markdown
---
epic: NNN-tech-debt
feature: NNN-finding-slug
status: open
dependencies: []
---

# [Finding title]

[What the issue is and why it matters — drawn from the audit finding]

## Requirements

- [ ] [Specific thing that needs to be true when this is fixed]
- [ ] [Another requirement]

## Acceptance Criteria

- [ ] [How to verify it's actually fixed]

## Open Questions

[Any ambiguity about the right fix approach]

## Technical Notes

**Audit severity:** [Critical / High / Medium / Low]
**Location:** `path/to/file`
[Any additional context from the audit]
```

Add each new feature to the `EPIC.md` checklist. Don't overwrite anything that's already there.

If the user only wants specific findings, generate just those. If they want all Critical and High, generate those. Follow their lead.
