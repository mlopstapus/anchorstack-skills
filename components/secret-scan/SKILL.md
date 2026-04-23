---
name: as-secret-scan
version: 1.0.0
tier: component
status: under-review
description: Scan for accidentally committed secrets — API keys, tokens, passwords, credentials. Reports findings by location and type without printing secret values, and helps remediate.
---

# Secret Scan

Scan for secrets that shouldn't be in the codebase — API keys, tokens, passwords, private keys, connection strings. The goal is to catch them before they're pushed, or clean them up if they already are.

## Step 1 — Determine scope

Default to scanning staged changes and the working tree (`git diff HEAD`). If the user asks for a full repo scan or history scan, do that instead.

History scans (`git log -p`) are slower but catch secrets that were committed and later deleted — those are still exposed in git history and need rotation even if the file looks clean now.

## Step 2 — Detect available tools

Check whether any secret scanning tools are installed:

```bash
which gitleaks || which trufflehog || which detect-secrets
```

If a tool is available, use it:
- **gitleaks**: `gitleaks detect --source . --no-git` (or `gitleaks protect` for staged changes)
- **trufflehog**: `trufflehog git file://. --only-verified`
- **detect-secrets**: `detect-secrets scan`

If no tool is available, proceed with pattern-based scanning in Step 3.

## Step 3 — Pattern-based scanning (fallback)

If no tool is installed, scan the diff or files directly. Look for:

| Pattern | Examples |
|---|---|
| High-entropy strings assigned to credential-named variables | `api_key = "abc123..."`, `secret = "xyz..."` |
| Known key prefixes | `sk-`, `ghp_`, `xoxb-`, `AKIA`, `AIza`, `ya29.` |
| Private key blocks | `-----BEGIN RSA PRIVATE KEY-----` |
| Connection strings with embedded credentials | `postgres://user:pass@host` |
| `.env` files or files named `*.pem`, `*.key`, `*_secret*` being tracked by git |

Focus on new or modified content — don't re-flag things that have been in the repo for a long time unless doing a history scan.

## Step 4 — Report findings

For each finding, report:
- File path and line number
- Type of secret (e.g., "GitHub token", "AWS access key", "high-entropy string")
- Do **not** print the actual secret value — just confirm it's there

```
⚠ Secret scan found 2 potential issues:

  1. src/config.ts:14 — GitHub personal access token (ghp_...)
  2. .env.local:3 — High-entropy string assigned to STRIPE_SECRET_KEY
```

If nothing is found:
```
✓ Secret scan — no secrets detected
```

## Step 5 — Remediate

For each finding, help the user fix it:

1. **Remove from code** — replace the hardcoded value with an environment variable reference
2. **Add to .gitignore** — if it's a file (`.env`, `*.pem`, etc.), ensure it's gitignored going forward
3. **Advise rotation** — even if removed from the working tree, if the secret was ever committed it's potentially exposed. Flag this clearly:

> This secret appeared in a commit. Even after removal, it may be in git history and should be considered compromised — rotate it at the provider.

4. **Offer history cleanup** — if the secret is in git history, offer to help with `git filter-repo` or BFG to scrub it, with a warning that this rewrites history and requires a force push.
