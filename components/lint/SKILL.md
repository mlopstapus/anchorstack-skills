---
name: lint
version: 1.0.0
tier: component
description: Detect and run the project linter, surface errors with context.
---

# Lint

Detect the project's linter configuration and run it.

## Step 1 — Detect linter

Check for linter config files in this order:

| Linter | Config files |
|--------|-------------|
| ESLint | `.eslintrc*`, `eslint.config.*`, `eslint` in `package.json` |
| Biome | `biome.json` |
| Prettier (format check) | `.prettierrc*` |
| Ruff (Python) | `ruff.toml`, `[tool.ruff]` in `pyproject.toml` |
| Flake8 (Python) | `.flake8`, `setup.cfg` |
| golangci-lint (Go) | `.golangci.yml` |
| RuboCop (Ruby) | `.rubocop.yml` |
| Clippy (Rust) | `Cargo.toml` (always available) |

Also check `package.json` scripts for a `lint` script — prefer that if defined.

## Step 2 — Run

Use the detected linter. If a `lint` script exists in `package.json`:
```bash
npm run lint
```

Otherwise run the detected linter directly:
- ESLint: `npx eslint . --ext .js,.jsx,.ts,.tsx`
- Biome: `npx biome check .`
- Ruff: `ruff check .`
- golangci-lint: `golangci-lint run`
- RuboCop: `bundle exec rubocop`
- Clippy: `cargo clippy`

## Step 3 — Parse and triage errors

Group errors by file. For each:
- File path and line number
- Rule name / error code
- Description
- 3-line code context

Distinguish between **errors** (must fix) and **warnings** (should fix).

## Step 4 — Auto-fix

Ask: attempt auto-fix for fixable issues?

If yes:
- ESLint: `npx eslint . --fix`
- Biome: `npx biome check . --write`
- Ruff: `ruff check . --fix`
- Prettier: `npx prettier . --write`

Then re-run to show what remains after auto-fix.

## Step 5 — Report

```
✓ Lint passed — no errors
```
Or:
```
✗ Lint failed — N errors, M warnings
[grouped by file with context]
[auto-fixed: X issues]
[remaining: Y issues requiring manual fix]
```
