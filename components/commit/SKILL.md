---
name: as-commit
version: 1.0.0
tier: component
status: under-review
description: Stage and commit changes using conventional commits format.
---

# Commit

Stage and commit changes with a conventional commit message derived from the diff.

## Step 1 — Check for changes

Run `git status` and `git diff`. If there is nothing to commit, tell the user and stop.

## Step 2 — Review the diff

Run `git diff HEAD` to see all unstaged and staged changes. Use this to understand:
- What changed (files, logic, config, tests, docs)
- Why it likely changed (based on context)
- The scope (which area of the codebase)

## Step 3 — Determine commit type

Pick the type that best fits the change:

| Type | When to use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `chore` | Maintenance, config, tooling, dependencies |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |
| `style` | Formatting, whitespace (no logic change) |
| `revert` | Reverting a previous commit |

## Step 4 — Draft the message

Format: `type(scope): short description`

Rules:
- Scope is optional but recommended — use the module, feature, or directory name (e.g. `auth`, `api`, `finish`)
- Description is imperative mood, lowercase, no period, under 72 characters (e.g. `add retry logic to sync step`)
- Add a body if the change needs context that isn't obvious from the title — separate with a blank line
- Add `BREAKING CHANGE: <description>` in the footer if applicable

Show the draft message to the user and ask for approval or edits before committing.

## Step 5 — Stage and commit

Stage all modified tracked files:
```bash
git add -u
```

If there are untracked files that should be included, ask the user before staging them.

Commit with the approved message:
```bash
git commit -m "<message>"
```

Report the resulting commit hash and message.
