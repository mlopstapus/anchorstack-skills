# Anchorstack Skills — Build Plan

## Vision

A versioned, composable skill library for Claude Code that travels across contracting projects. Skills are installed via the `skills` CLI (`npx skills add anchorstack/anchorstack-skills`), composable by design, and configurable per-project without losing the ability to receive upstream updates.

The `skills` CLI is a generic agent skill package manager (used by BEARY and others). It supports a custom install path — we target `.claude/skills/` for Claude Code.

---

## Architecture

Four skill tiers:

| Tier | What it does | Examples |
|---|---|---|
| **Universal** | Thinking, diagnosis, planning — stateless, project-agnostic | `rca`, `architect`, `research`, `backlog`, `tenants` |
| **Components** | Atomic composable steps invoked by configurable skills | `sync`, `hipaa-check`, `rebuild-docker`, `ralph` |
| **Setup** | Run once per project, writes `.claude/anchorstack/` config | `setup-project`, `setup-finish` |
| **Configurable** | Reads project config, orchestrates components in order | `finish` |

### Project config location

```
.claude/
  anchorstack/
    project.md       ← written by setup-project (stack, type, constraints)
    finish.md        ← written by setup-finish (ordered steps)
    manifest.json    ← managed by CLI (versions, hashes, eject status)
```

### Composability model

Configurable skills (like `finish`) read a step list from `finish.md`. Each step is either:
- `invoke: <skill-name>` — runs another skill
- `run: <shell command>` — executes a raw command

Components can also invoke other components. Skills read `project.md` to adapt behavior to context (e.g. `tech-debt-audit` adjusts what it flags based on stack type).

### finish.md step format

```yaml
steps:
  - invoke: sync
  - invoke: hipaa-check
  - run: docker compose restart
  - invoke: tech-debt-audit
```

Steps execute in order. Any failure halts the chain and reports which step failed. `invoke` targets are skill names; `run` targets are raw shell commands.

### Skill frontmatter format

```markdown
---
name: sync
version: 1.0.0
tier: component
description: Pull main, rebase, resolve conflicts
---
```

Versioning is per-skill semver in frontmatter. The package version tracks the overall release; individual skills can update independently.

---

## Key Integrations

### BEARY (research skill)
BEARY is an agentic background research workflow (`sally-jankovic/BEARY`). It takes a topic prompt, performs internet research, takes notes, and compiles findings into a whitepaper with citations. Originally built for Cascade/Windsurf — our `research` universal skill adapts BEARY's workflow for Claude Code. It works out of a `beary-scratchpad/` directory (gitignored) and publishes to a configured output path.

### RALPH (component)
Just a skill prompt — instructs Claude to implement the Ralph Wiggum Loop pattern: keep iterating on a task until objectively verifiable completion criteria are met, rather than stopping when it subjectively thinks it's done. Each iteration re-states the goal and checks explicit success conditions.

### spec-kit
GitHub's Spec-Driven Development toolkit (`github/spec-kit`). The CLI is `specify`. `setup-project` detects the available installer (`uv` preferred, falls back to `pipx`) and runs:
```bash
# uv
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# pipx fallback
pipx install git+https://github.com/github/spec-kit.git
```
Then initializes the project with `specify`. The `tenants` universal skill generates spec-kit constitution tenants.

### skills CLI / SKILL.md format
The `skills` CLI expects a `SKILL.md` at the root of each skill with frontmatter:
```markdown
---
name: skill-name
description: One-line description
---
```
BEARY's skills live under `beary/` in its repo. Our structure will mirror this — each skill is a directory with a `SKILL.md` entry point and any supporting files.

---

## Update Strategy

- Installer writes `manifest.json` with version + hash per skill on install
- `skills update anchorstack-skills` — compares current file hashes to manifest
  - **Unmodified** → auto-update silently
  - **Locally modified** → show diff, prompt: keep / take upstream / open in editor
  - **Ejected** → skip unless `--force`
- `skills eject <skill>` — marks skill as locally owned, updates skip it
- `skills contribute <skill>` — opens a GitHub PR with local ejected changes
- `skills list` — show installed skills, versions, eject status

---

## Milestones

### M1 — Repo Scaffolding ✓

Foundation. Everything else depends on this.

- [x] Initialize `package.json` — registered as `anchorstack-skills` on npm, compatible with `npx skills add`
- [x] Create directory structure — each skill is a folder with `SKILL.md` + supporting files, mirroring BEARY's layout
- [x] Write `scripts/finish-picker.js` — interactive component picker for `setup-finish`
- [x] Define `manifest.json` schema (in `bin/cli.js`)
- [x] Lock down `finish.md` step format (documented above)
- [x] Lock down skill frontmatter format (documented above)
- [x] `skills.json` — package manifest listing all skills and install paths

### M2 — Universal Skills ✓

Stateless, project-agnostic thinking and diagnosis tools.

- [x] `universal/rca/SKILL.md` — structured root cause analysis
- [x] `universal/architect/SKILL.md` — solution design, trade-off analysis, ADR output
- [x] `universal/tech-debt-audit/SKILL.md` — codebase debt audit, severity ranking
- [x] `universal/backlog/SKILL.md` — generate product backlog, specs, and work items
- [x] `universal/research/SKILL.md` — BEARY-based research pipeline for Claude Code
- [x] `universal/tenants/SKILL.md` — generate spec-kit constitution tenants

### M3 — Components Library ✓

Atomic steps. Each does exactly one thing. All auto-discovered by `finish-picker.js`.

- [x] `components/sync/SKILL.md`
- [x] `components/ralph/SKILL.md`
- [x] `components/hipaa-check/SKILL.md`
- [x] `components/soc2-check/SKILL.md`
- [x] `components/rebuild-docker/SKILL.md`
- [x] `components/type-check/SKILL.md`
- [x] `components/dependency-audit/SKILL.md`
- [x] `components/lint/SKILL.md`
- [x] `components/security-scan/SKILL.md`

### M4 — Setup Skills ✓

Run once per project to configure `.claude/anchorstack/`.

- [x] `setup/setup-project/SKILL.md`
- [x] `setup/setup-finish/SKILL.md`

### M5 — Configurable Skills ✓

Orchestrators. Read project config and compose components.

- [x] `configurable/finish/SKILL.md`

### M6 — Update Mechanism ✓

- [x] `anchorstack update` — hash diff, auto-update clean, prompt on dirty
- [x] `anchorstack eject <skill>` — set ejected flag in manifest
- [x] `anchorstack contribute <skill>` — open GitHub PR with local ejected changes
- [x] `anchorstack list` — installed skills with version, hash status, eject flag

### M7 — Publishing ✓

- [x] `README.md` — install instructions, skill reference, update workflow
- [x] `.github/workflows/publish.yml` — npm publish on tag push
- [ ] Initial publish to npm as `anchorstack-skills` ← do when ready to ship
- [ ] Tag v1.0.0 ← do when ready to ship

---

## Open Questions

None. Plan is complete and ready to build.
