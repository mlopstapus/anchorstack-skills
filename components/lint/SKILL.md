---
name: as-lint
version: 2.0.0
tier: component
description: Run the project linter, auto-fix what it can, manually fix the rest.
---

# Lint

Run the project's linter, fix all errors, and verify they're resolved.

## Step 1 — Find the lint command

Check `.claude/anchorstack/project.md` for a `## Lint` section with a configured command. If found, use it and skip to Step 2.

Otherwise auto-detect by checking for config files and `package.json` scripts:

| Signal | Command |
|---|---|
| `lint` script in `package.json` | `npm run lint` |
| `.eslintrc*` / `eslint.config.*` | `npx eslint .` |
| `biome.json` | `npx biome check .` |
| `ruff.toml` / `[tool.ruff]` in `pyproject.toml` | `ruff check .` |
| `.flake8` / `[flake8]` in `setup.cfg` | `flake8 .` |
| `.golangci.yml` | `golangci-lint run` |
| `.rubocop.yml` | `bundle exec rubocop` |
| `Cargo.toml` | `cargo clippy` |

If nothing is detected, ask the user what command to run.

If a command was detected or provided (not already in `project.md`), offer to save it:

```markdown
## Lint
<command>
```

## Step 2 — Run the linter

Run the command. If it passes cleanly:

```
✓ Lint passed — no errors
```

Stop here.

## Step 3 — Auto-fix

Run the linter's built-in auto-fixer for fixable issues:

| Linter | Fix command |
|---|---|
| ESLint | `npx eslint . --fix` |
| Biome | `npx biome check . --write` |
| Ruff | `ruff check . --fix` |
| Prettier | `npx prettier . --write` |
| RuboCop | `bundle exec rubocop -a` |
| Clippy | `cargo clippy --fix` |

Re-run the linter after auto-fixing to see what remains.

## Step 4 — Manually fix remaining errors

For each remaining error that wasn't auto-fixable:

1. Read the file at the reported line and understand what the rule is flagging
2. Fix the code — follow the rule's intent, don't just suppress the warning
3. Only use inline disable comments (`// eslint-disable-line`, `# noqa`, etc.) when the rule is genuinely wrong for this case, and add a comment explaining why

Work through all remaining errors, then re-run to verify.

## Step 5 — Report

```
✓ Lint passed — N auto-fixed, M manually fixed
```

Or if unresolved issues remain:

```
✗ Lint — N fixed, M unresolved

Unresolved:
  - src/thing.ts:42 — <rule>: <message> [needs review]
```
