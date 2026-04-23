---
name: anchorstack-dependency-audit
version: 1.0.0
tier: component
description: Check for outdated packages and known CVEs across the project's dependency manifest.
---

# Dependency Audit

Check all project dependencies for outdated versions and known security vulnerabilities.

## Step 1 — Detect package manager

Check for:
- `package.json` → npm/yarn/pnpm
- `requirements.txt` or `pyproject.toml` → pip/uv
- `go.mod` → Go modules
- `Gemfile` → Bundler
- `Cargo.toml` → Cargo

Handle whichever is present (may be multiple in a monorepo).

## Step 2 — Security vulnerabilities

### Node.js
```bash
npm audit --json
```
Parse JSON output. Flag all `high` and `critical` advisories with:
- Package name
- Vulnerability description
- CVSS score
- Fix available (yes/no, and what version)

### Python
```bash
pip-audit  # or: safety check
```

### Go
```bash
govulncheck ./...
```

### Ruby
```bash
bundle audit
```

### Rust
```bash
cargo audit
```

## Step 3 — Outdated packages

### Node.js
```bash
npm outdated
```

### Python
```bash
pip list --outdated
```

### Go
```bash
go list -u -m all
```

For each outdated package note:
- Current version
- Latest version
- How far behind (patch / minor / major)

Flag anything more than 1 major version behind.

## Step 4 — Unused dependencies

### Node.js
Check `package.json` dependencies. Look for packages that have no import in the source code:
```bash
npx depcheck
```

## Step 5 — Report

```markdown
## Dependency Audit — <date>

### Critical / High CVEs
[List with CVE ID, package, description, fix]

### Outdated (major version behind)
[List with current vs latest]

### Outdated (minor/patch)
[Condensed list]

### Unused dependencies
[List — verify before removing]

### Recommended actions
1. [Most urgent fix first]
```
