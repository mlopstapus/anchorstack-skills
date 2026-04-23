---
name: as-tech-debt-audit
version: 1.0.0
tier: universal
status: under-review
description: Codebase debt audit — scan for issues, rank by severity, produce a prioritized report.
---

# Tech Debt Audit

You are running a comprehensive tech debt audit. Read `.claude/anchorstack/project.md` if it exists to understand the project type and constraints — this shapes what counts as debt in this context.

## Step 1 — Scope

Ask the user:
1. **Are there areas to focus on?** (specific directories, services, or layers)
2. **Any known problem areas?** Start there.
3. **What's the primary concern?** (security, maintainability, performance, cost)

If no answer, do a full codebase scan.

## Step 2 — Scan categories

Work through each category systematically. For each finding, note the file path and line number.

### Code quality
- Duplicated logic (copy-paste across files)
- Functions over 50 lines or with cyclomatic complexity > 10
- Deep nesting (> 3 levels)
- Magic numbers and strings with no constants
- Dead code (unreachable, unused exports, commented-out blocks)
- TODO / FIXME / HACK comments (count and age if discernible from git)

### Architecture
- Circular dependencies
- God objects / god modules (one file doing too much)
- Missing separation of concerns (business logic in route handlers, etc.)
- Inconsistent patterns across similar modules

### Testing
- Untested critical paths (auth, payments, data mutations)
- Tests that only test happy paths
- Missing integration or e2e coverage for core flows
- Flaky or slow tests

### Dependencies
- Run `npm outdated` / `pip list --outdated` / equivalent — flag packages > 2 major versions behind
- Packages with known CVEs (run `npm audit` or equivalent)
- Unused dependencies in package.json / requirements.txt
- Pinned to patch versions without a stated reason

### Security (surface-level — use `security-scan` for deep scan)
- Secrets or credentials hardcoded in non-secret files
- User input passed directly to shell commands, SQL, or eval
- Missing input validation at API boundaries

### Operational
- Missing or inadequate logging at decision points
- No health check endpoints
- Hard-coded environment-specific values (URLs, ports) that should be env vars

## Step 3 — Rank findings

Rate each finding:

| Severity | Meaning |
|----------|---------|
| **Critical** | Active risk — security vulnerability, data loss potential, or blocks shipping |
| **High** | Slows the team materially or creates fragility |
| **Medium** | Visible debt that accumulates interest |
| **Low** | Cleanup, nice-to-have |

## Step 4 — Report

Produce a structured report:

```markdown
# Tech Debt Audit — <project> — <date>

## Summary
- Critical: N
- High: N
- Medium: N
- Low: N

## Context
[Project type and any compliance constraints from project.md]

## Critical findings
[Each finding with: file:line, description, why it matters, suggested fix]

## High findings
...

## Medium findings
...

## Low findings
...

## Recommended starting points
[Top 3 items to tackle first and why]
```

Save to `tech-debt-audit-<YYYY-MM-DD>.md` in the project root.
