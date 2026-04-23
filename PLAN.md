# Anchorstack Skills — Build Plan

## Vision

A versioned, composable skill library for Claude Code that travels across contracting projects. Skills are installed via the `anchorstack update` command and live in `.claude/skills/`. They are composable by design and configurable per-project without losing the ability to receive upstream updates.

---

## Architecture

Four skill tiers:

| Tier | What it does | Examples |
|---|---|---|
| **Universal** | Thinking, diagnosis, planning — stateless, project-agnostic | `as-rca`, `as-architect`, `as-research` |
| **Components** | Atomic composable steps invoked by configurable skills | `as-sync`, `as-commit`, `as-pr` |
| **Setup** | Run once per project, writes `.claude/anchorstack/` config | `as-setup-project` |
| **Configurable** | Reads project config, orchestrates components in order | `as-finish` |

### Project config location

```
.claude/
  anchorstack/
    project.md       ← written by as-setup-project (stack, type, constraints)
    finish.md        ← written by as-finish on first run (ordered steps)
    manifest.json    ← managed by CLI (hashes, eject status)
```

### Skill naming

All skills use the `as-` prefix (e.g. `as-finish`, `as-sync`). Short enough to type, namespaced enough to avoid collisions.

### finish.md step format

```yaml
steps:
  - invoke: as-sync
  - invoke: as-hipaa-check
  - run: npm test
```

Steps execute in order. Any failure halts the chain. `invoke` targets are skill names; `run` targets are raw shell commands.

### Skill frontmatter format

```markdown
---
name: as-sync
version: 1.0.0
tier: component
status: under-review
description: Pull main, rebase current branch.
---
```

---

## Update Strategy

- `anchorstack update` — fetches latest SKILL.md for each skill from GitHub, overwrites installed files. Skips ejected skills.
- `anchorstack eject <skill>` — marks skill as locally owned, skipped on future updates
- `anchorstack contribute <skill>` — opens a GitHub PR with local ejected changes
- `anchorstack list` — show installed skills, hash status, eject flag

---

## Milestones

### M1 — Repo Scaffolding ✓

- [x] `package.json` — registered as `anchorstack-skills`
- [x] Directory structure — each skill is a folder with `SKILL.md`
- [x] `skills.json` — package manifest listing all skills and install paths
- [x] `bin/cli.js` — `anchorstack` CLI (list, update, eject, contribute)
- [x] `anchorstack update` — fetches latest skills from GitHub raw
- [x] `scripts/finish-picker.js` — standalone interactive pipeline picker

### M2 — Universal Skills ✓

- [x] `universal/rca/SKILL.md`
- [x] `universal/architect/SKILL.md`
- [x] `universal/tech-debt-audit/SKILL.md`
- [x] `universal/backlog/SKILL.md`
- [x] `universal/research/SKILL.md`
- [x] `universal/tenants/SKILL.md`
- [x] `universal/context/SKILL.md`

### M3 — Components Library ✓

- [x] `components/sync/SKILL.md`
- [x] `components/ralph/SKILL.md`
- [x] `components/hipaa-check/SKILL.md`
- [x] `components/soc2-check/SKILL.md`
- [x] `components/rebuild-docker/SKILL.md`
- [x] `components/type-check/SKILL.md`
- [x] `components/dependency-audit/SKILL.md`
- [x] `components/lint/SKILL.md`
- [x] `components/security-scan/SKILL.md`
- [x] `components/commit/SKILL.md`
- [x] `components/pr/SKILL.md`

### M4 — Setup Skills ✓

- [x] `setup/setup-project/SKILL.md`

### M5 — Configurable Skills ✓

- [x] `configurable/finish/SKILL.md` — self-bootstraps on first run, no separate setup step

### M6 — Publishing

- [x] `README.md` — install instructions, skill reference, update workflow
- [x] `.github/workflows/publish.yml` — npm publish on tag push
- [ ] Initial publish to npm as `anchorstack-skills`
- [ ] Tag v1.0.0

---

## Skill Review

Going through each skill one by one to flesh out and validate.

### Universal

- [ ] `as-rca`
- [ ] `as-architect`
- [ ] `as-tech-debt-audit`
- [ ] `as-backlog`
- [ ] `as-research`
- [ ] `as-tenants`
- [ ] `as-context`

### Components

- [x] `as-finish` — working well in testing
- [x] `as-sync`
- [x] `as-retro`
- [ ] `as-hipaa-check`
- [ ] `as-soc2-check`
- [ ] `as-rebuild-docker`
- [ ] `as-type-check`
- [ ] `as-dependency-audit`
- [ ] `as-lint`
- [ ] `as-security-scan`
- [x] `as-commit`
- [x] `as-pr`

### Setup

- [ ] `as-setup-project`
