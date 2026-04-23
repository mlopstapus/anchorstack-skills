---
name: as-pr
version: 1.0.0
tier: component
status: under-review
description: Create a GitHub PR with a structured template and pre-merge smoke test checklist.
---

# Pull Request

Create a GitHub PR with a structured description and a manual smoke test checklist derived from the changes.

## Step 1 — Gather context

Detect the base branch:
```bash
git branch -r | grep -E 'origin/(main|master)'
```

Use `main`, fall back to `master`.

Run the following:
```bash
git log <base>..HEAD --oneline
git diff <base>..HEAD --stat
```

Also read `.claude/anchorstack/project.md` if it exists for product/stack context.

## Step 2 — Draft the PR title

Use conventional commit style: `type(scope): short description`

Match the type to the dominant change (feat, fix, refactor, chore, etc.). Keep it under 72 characters.

## Step 3 — Draft the PR body

Use this template:

```markdown
## What changed

<2–4 sentences summarising the change and why. Focus on the why, not just the what.>

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / cleanup
- [ ] Chore / dependency / config
- [ ] Breaking change

## Smoke tests

Manual checks to run before merging:

- [ ] <specific thing to test based on what changed>
- [ ] <another specific check>
- [ ] <edge case or regression risk worth verifying>

## Notes for reviewer

<Anything non-obvious: tricky decisions, known limitations, follow-up work, areas that need extra scrutiny.>
```

### Smoke test generation

Derive smoke tests from the diff — be specific, not generic. Examples:
- Changed auth flow → "Log in with Google, verify redirect works"
- Changed API endpoint → "Hit /api/orders with valid and invalid payloads, check response shape"
- Changed DB migration → "Run migration on a copy of prod data, verify no row count change"
- Changed UI component → "Render at mobile and desktop breakpoints, verify no layout shift"

Avoid filler items like "make sure the app works". Every item should be something a human can actually check in under 5 minutes.

## Step 4 — Confirm

Show the full title and body to the user. Ask for approval or edits before creating.

## Step 5 — Create the PR

```bash
gh pr create --title "<title>" --body "<body>" --base <base>
```

Report the PR URL when done.
