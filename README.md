# anchorstack-skills

A composable Claude Code skill library for professional software projects. Skills install into `.claude/skills/` and travel with you across jobs. They share a common project config and are designed to work together.

---

## Install

```bash
npx skills add mlopstapus/anchorstack-skills
```

---

## Skill reference

### Universal — thinking and planning

These skills work on any project at any time. They read context from `context/` and `spec/` to produce better results the more you use the other skills.

---

#### `as-setup-project`

**Run once at the start of every project.**

Auto-detects your stack, git provider, and common commands, then interviews you for anything it couldn't find. Writes `.claude/anchorstack/project.md` — the shared config that all other skills read. Also bootstraps `CLAUDE.md` if one doesn't exist.

*Run again any time your stack or commands change.*

---

#### `as-tenets`

**Establishes the governing principles for the project.**

Scans the codebase for context (stack, compliance signals, existing patterns), then proposes a draft set of tenets — the invariants that must hold across all work. Interviews you to fill gaps and confirm. Writes to `spec/tenets.md`.

Tenets feed into `as-architect` (design constraints) and `as-backlog` (feature requirements). If you use speckit, tenets map directly to a speckit constitution.

*Depends on: `as-setup-project` (optional but improves output)*

---

#### `as-architect`

**Collaborative architecture design session.**

Interviews you about the problem, thinks through options and tradeoffs, and produces a full architecture document. Covers system decomposition, Domain-Driven Design (bounded contexts, aggregates, contracts), data architecture, build-vs-buy decisions, failure modes, and Conway's Law considerations. Writes to `context/architecture.md` and `docs/pdr/` for significant decisions.

*Depends on: `as-tenets` (optional — tenets become design constraints)*

---

#### `as-backlog`

**Translates architecture and tenets into an executable, ranked backlog.**

Reads `context/architecture.md` and `spec/tenets.md`, interviews you on scope, then generates a structured folder hierarchy:

```
backlog/
  000-foundations/   ← always first — decisions and context to establish before coding
  001-epic-slug/     ← epics ranked by implementation priority
  002-epic-slug/
```

The foundations epic establishes decisions (repo structure, deployment, design system, API conventions, auth approach, etc.) that each write a deliverable to `context/`. Implementation epics contain numbered, spec-kit-compatible feature files with requirements, acceptance criteria, open questions, and dependencies. Each epic has an `EPIC.md` tracker with checkboxes and an `archive/` folder for completed work.

*Depends on: `as-architect`, `as-tenets`*

---

#### `as-rca`

**Root cause analysis — finds why something is broken, not just what's broken.**

Reproduces the failure locally, finds the failure point in code, then iteratively asks "what is causing this?" until it reaches the true root cause — the decision, assumption, or design gap where the chain starts. Documents the full causation chain from symptom to root. Writes to `context/rca-<date>-<slug>.md`.

The key behavior: it doesn't stop at the first broken thing. It keeps drilling until fixing the root cause would prevent the whole class of failures.

---

#### `as-tech-debt-audit`

**Full codebase health check from the perspective of a senior engineer.**

Runs the test suite first (failing tests are Critical by definition), then scans for: broken/missing tests, code structure issues (duplication, god objects, deep nesting, dead code), silent catches and unhandled errors, type safety gaps, performance issues (N+1 queries, missing indexes, unbounded queries), observability gaps (structured logging, request IDs, metrics), stale documentation, outdated or vulnerable dependencies, CI/CD gaps, database hygiene, surface-level security issues, and operational gaps. Produces a prioritized report at `context/tech-debt-audit-<date>.md`.

After the report, offers to convert findings into backlog items — creates a tech-debt epic and writes feature files for selected findings.

*Depends on: `as-backlog` (for the optional backlog conversion step)*

---

### Components — pipeline steps

Components are atomic, composable steps. They're used directly or wired into the `as-finish` pipeline.

---

#### `as-test`

Writes missing tests first, then runs the suite and fixes failures. For each changed file it checks whether tests exist, and if not writes them — matching the project's existing test framework and style — before running anything. When tests fail it triages each one: fix the code if the test describes correct behavior, fix the test if it was asserting an implementation detail that legitimately changed. Won't paper over a failure with a bad fix — notes anything that needs a broader decision and moves on.

---

#### `as-sync`

Stashes local changes, fetches, rebases on main, auto-resolves conflicts where safe, then pushes. The standard "get current" step before finishing work.

---

#### `as-commit`

Stages and commits changes using conventional commits format (`feat:`, `fix:`, `chore:` etc.). Reviews what's staged before committing and writes a meaningful message.

---

#### `as-pr`

Creates a GitHub pull request with a structured template — summary, test plan, and checklist. Runs a pre-merge smoke check before opening.

---

#### `as-rebuild`

Rebuilds and restarts the local dev environment. Uses the rebuild command from `project.md` if set; otherwise auto-detects from project files (Docker Compose, package.json scripts, Makefile, Procfile).

---

#### `as-type-check`

Runs the project's type checker (TypeScript, Pyright, mypy, Go vet, Cargo check — auto-detected). Surfaces errors, attempts auto-fixes, and reports results.

---

#### `as-lint`

Detects the project linter (ESLint, Biome, Ruff, golangci-lint, Rubocop, etc.), runs it, auto-fixes what it can, and manually fixes what it can't. Saves the detected command back to `project.md`.

---

#### `as-secret-scan`

Scans for accidentally committed secrets — API keys, tokens, passwords, credentials — across staged changes and history. Reports findings by location and type without printing values, and helps remediate.

---

#### `as-hipaa-check`

HIPAA compliance check scoped to staged changes by default, or full codebase on request. Checks: PHI exposure, audit trail gaps, access control, encryption at rest and in transit. Produces findings with severity ratings. Use on any project handling protected health information.

---

#### `as-soc2-check`

SOC2 compliance check scoped to staged changes by default, or full codebase on request. Checks: access controls, encryption, change management, logging, availability controls. Use on any project with SOC2 obligations.

---

#### `as-retro`

Session retrospective. Reviews what happened in the session, identifies friction points and clarifications you had to provide, then updates `CLAUDE.md`, `AGENTS.md`, and memory files so future sessions start with better context. Run at the end of a work session.

---

### Configurable — orchestrators

#### `as-finish`

**The "done" command. Runs your project's finish pipeline.**

On first run, self-bootstraps: presents an interactive picker to choose and order which components run (sync, type-check, lint, tests, HIPAA check, etc.) and write custom shell steps. Saves the pipeline to `.claude/anchorstack/finish.md`. On subsequent runs, executes each step in order and reports pass/fail.

Re-run `/as-finish` to change the pipeline at any time.

Example `finish.md`:
```yaml
steps:
  - invoke: as-sync
  - invoke: as-type-check
  - invoke: as-lint
  - run: npm test
  - invoke: as-secret-scan
```

*Depends on: `as-setup-project` (for `project.md` context)*

---

## How the skills connect

```
as-setup-project          ← run first on any project
       ↓
as-tenets                 ← establishes governing principles → spec/tenets.md
       ↓
as-architect              ← designs the system → context/architecture.md
       ↓
as-backlog                ← breaks it into executable work → backlog/
       ↓
as-finish (daily)         ← sync → type-check → lint → test → scan → commit → pr
```

At any point:
- `as-rca` — when something is broken
- `as-tech-debt-audit` — when you need a health check
- `as-retro` — at the end of a session

The `context/` folder is the project's shared brain. `as-architect` writes architecture docs there. `as-backlog` foundations items write decisions there. `as-rca` writes incident reports there. `as-tech-debt-audit` writes audit reports there.

---

## Update management

```bash
anchorstack list                  # installed skills, versions, eject status
anchorstack update                # pull latest for unmodified skills
anchorstack eject <skill>         # take local ownership — updates skip it
anchorstack contribute <skill>    # open a PR with your local changes upstream
```

---

## Project config

```
.claude/
  anchorstack/
    project.md      ← stack, compliance, commands (written by as-setup-project)
    finish.md       ← finish pipeline steps (written by as-finish)
    manifest.json   ← installed versions and hashes

context/            ← architecture docs, RCA reports, audit reports, decisions
spec/
  tenets.md         ← project governing principles (written by as-tenets)
backlog/            ← structured work items (written by as-backlog)
```

Commit `.claude/anchorstack/` and `spec/` to share config with your team.

---

## License

MIT
