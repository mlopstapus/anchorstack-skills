---
name: as-commit
version: 1.1.0
tier: component
description: Stage and commit changes using conventional commits format.
---

# Commit

Generate a conventional commit message from the diff, get approval, then commit.

## Step 1 — Check for changes

Run `git status` and `git diff`. If there is nothing to commit, tell the user and stop.

## Step 2 — Review the diff

Run `git diff HEAD` to understand what changed and why:
- What files and logic changed
- Which area of the codebase (scope)
- Whether it's a single coherent change or multiple concerns mixed together

## Step 3 — Determine type and scope

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

Scope is optional but useful — use the module, feature, or directory name (e.g. `auth`, `api`, `finish`).

## Step 4 — Draft the message

Format: `type(scope): short description`

- Description: imperative mood, lowercase, no period, under 72 characters
- Always include a body. Explain the why — what prompted this change, any non-obvious decisions, context a future reader would want. Separate from title with a blank line.
- Add `BREAKING CHANGE: <description>` in the footer if applicable

**Examples:**
- `feat(auth): add Google OAuth login`
- `fix(api): handle null response from payment provider`
- `refactor(finish): simplify step execution loop`

## Step 5 — Ask for approval

Show the draft message and ask the user to approve or edit it before proceeding. Don't commit until they confirm.

## Step 6 — Stage and commit

Stage tracked changes:
```bash
git add -u
```

If there are untracked files, list them and ask the user which (if any) to include before committing.

Commit with the approved message:
```bash
git commit -m "<message>"
```

Report the resulting commit hash and one-line message.
