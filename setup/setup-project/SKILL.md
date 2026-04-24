---
name: as-setup-project
version: 2.0.0
tier: setup
status: under-review
description: Initialize a project for anchorstack skills — auto-detect git config, stack, and commands, then interview to fill gaps. Writes .claude/anchorstack/project.md (read by all other skills) and bootstraps CLAUDE.md if none exists. Run with as-setup-project at project start, or re-run to update config.
---

# Setup Project

Run once per project to establish the persistent config that all anchorstack skills read. This saves every future skill invocation from re-detecting things the project already knows about itself.

Can be re-run at any time to update specific fields.

---

## Step 1 — Check existing state

Check if `.claude/anchorstack/project.md` already exists.

If it does, read it and show the user the current values. Ask: update specific fields, or regenerate from scratch?

If updating, only re-run the relevant steps and preserve the rest.

---

## Step 2 — Auto-detect

Run these before asking the user anything. The goal is to arrive at the interview with most fields already filled in.

**Git provider:**
```bash
git remote -v
```
- Contains `github.com` → GitHub
- Contains `gitlab.com` → GitLab
- Contains `bitbucket.org` → Bitbucket
- No remote or unrecognized → unknown (ask)

**Base branch:**
```bash
git branch -a
```
Prefer `main` → `master` → `develop`. If the repo has a clear default branch, use it. If unclear, ask.

**Stack:**
Check for indicator files (read the top-level one to get framework/library details):

| File | Stack signal |
|---|---|
| `package.json` | Node.js — read for framework hints (next, react, express, fastify, etc.) |
| `go.mod` | Go — read for module name |
| `requirements.txt` / `pyproject.toml` / `Pipfile` | Python — check for Django, FastAPI, Flask |
| `Gemfile` | Ruby — check for Rails |
| `Cargo.toml` | Rust |
| `pom.xml` / `build.gradle` | Java / Kotlin |
| `composer.json` | PHP |

Also note presence of `docker-compose.yml` (Docker-based local env) and `terraform/` (infra-as-code).

Form a one-line stack description. Example: `Next.js + TypeScript + PostgreSQL + Docker`.

**Commands:**
Detect using the same logic as `as-rebuild`, `as-type-check`, `as-lint`:

- **Rebuild:** `docker-compose.yml` → `docker compose up -d`; `package.json` scripts → check for `dev` or `start`; `Makefile` → check for a `dev` target; `Procfile` → `foreman start`
- **Type check:** `tsconfig.json` → `npx tsc --noEmit`; `pyrightconfig.json` → `pyright`; `mypy.ini` → `mypy .`; `go.mod` → `go vet ./...`; `Cargo.toml` → `cargo check`
- **Lint:** `lint` in package.json scripts → `npm run lint`; `.eslintrc*` → `npx eslint .`; `biome.json` → `npx biome check .`; `ruff.toml` → `ruff check .`; `.golangci.yml` → `golangci-lint run`; `.rubocop.yml` → `bundle exec rubocop`
- **Test:** `test` in package.json scripts → `npm test`; `go.mod` → `go test ./...`; `pytest.ini` or `[tool.pytest.ini_options]` → `pytest`; `Cargo.toml` → `cargo test`

---

## Step 3 — Interview

Show what was auto-detected. Only ask about what's missing or needs confirmation. Keep this to under a minute for a standard project.

**Questions to ask:**

1. **Stack** — "I detected [X] — does this look right? Anything to add (database, cloud provider, key services)?"

2. **Compliance scope** — "Is this project in scope for any compliance frameworks?" Specifically ask about:
   - HIPAA (protected health information)
   - SOC2 (security/availability controls)
   - GDPR (EU personal data)
   - PCI DSS (payment card data)
   
   This affects which checks `as-finish` includes in the pipeline.

3. **Any commands that couldn't be detected** — Only ask for commands where detection failed. "I couldn't detect a [rebuild/lint/etc.] command — what do you use?"

Don't ask about git provider or base branch if they were clearly detected. Don't re-ask about things already confirmed.

---

## Step 4 — Write project.md

Create `.claude/anchorstack/` if it doesn't exist. Write `.claude/anchorstack/project.md`:

```markdown
# Project Config

## Git
provider: <github | gitlab | bitbucket | other>
base_branch: <main | master | develop>

## Stack
<one to two sentences describing the tech stack>

## Compliance
hipaa: <true | false>
soc2: <true | false>
gdpr: <true | false>
pci: <true | false>

## Rebuild
<command, or leave blank>

## Type check
<command, or leave blank>

## Lint
<command, or leave blank>

## Test
<command, or leave blank>
```

Leave any command blank if it couldn't be detected and the user didn't provide one. Skills detect and fill these in on first use via `as-retro`.

---

## Step 5 — Bootstrap CLAUDE.md

Check if `CLAUDE.md` exists at the project root.

**If it doesn't exist**, create a starter:

```markdown
# <Project Name>

<Stack — one sentence>

## Key commands

| Command | Run |
|---------|-----|
| Rebuild | `<command>` |
| Type check | `<command>` |
| Lint | `<command>` |
| Test | `<command>` |

## Notes

<!-- Project-specific notes. as-retro will add to this over time. -->
```

Use the project name from `package.json` (`name` field), `go.mod` (module path), `Cargo.toml`, or the repo directory name — whichever is most readable.

Omit any command rows where no command was detected.

**If CLAUDE.md already exists**, don't overwrite it. Scan it for a commands section — if there isn't one, offer to append the commands table. Otherwise leave it alone.

---

## Step 6 — Report

Summarise what was written:

```
Setup complete.

.claude/anchorstack/project.md
  provider:     github
  base_branch:  main
  stack:        Next.js + TypeScript + PostgreSQL + Docker
  compliance:   hipaa=false  soc2=false  gdpr=false  pci=false
  rebuild:      docker compose up -d
  type-check:   npx tsc --noEmit
  lint:         npm run lint
  test:         npm test

CLAUDE.md — created ✓

Run /as-finish to configure your workflow pipeline.
```

If any commands are blank, note them: "Rebuild command not detected — run as-rebuild once to detect and save it."
