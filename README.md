# anchorstack-skills

Composable Claude Code skill library for the Anchorstack contracting methodology.

Skills are versioned, installable, and configurable per-project. They travel with you across jobs without losing the ability to receive upstream updates.

---

## Install

```bash
npx skills add anchorstack/anchorstack-skills
```

This installs all skills to `.claude/skills/` in your project (or `~/.claude/skills/` globally).

---

## Skills

### Universal — thinking and diagnosis

| Skill | What it does |
|-------|-------------|
| `rca` | Structured root cause analysis — timeline, five whys, corrective actions |
| `architect` | Solution design — explore options, evaluate tradeoffs, produce an ADR |
| `tech-debt-audit` | Codebase debt audit — ranked findings by severity |
| `backlog` | Generate a prioritized product backlog with user stories and acceptance criteria |
| `research` | BEARY-style agentic research — topic prompt to cited whitepaper |
| `tenants` | Generate spec-kit constitution tenants for a project |

### Components — atomic pipeline steps

| Skill | What it does |
|-------|-------------|
| `sync` | Pull main, rebase current branch, resolve conflicts |
| `ralph` | Ralph Wiggum Loop — iterate until explicit completion criteria are met |
| `hipaa-check` | PHI exposure, audit trails, encryption, access controls |
| `soc2-check` | Access controls, logging, encryption, change management |
| `rebuild-docker` | Docker Compose down / rebuild / up with health check |
| `type-check` | Run tsc, surface and triage type errors |
| `dependency-audit` | Outdated packages and known CVEs |
| `lint` | Detect project linter and run it |
| `security-scan` | OWASP basics, secrets detection, injection vulnerabilities |

### Setup — run once per project

| Skill | What it does |
|-------|-------------|
| `setup-project` | Interview, install spec-kit, write `.claude/anchorstack/project.md` |
| `setup-finish` | Interactive picker → writes `.claude/anchorstack/finish.md` |

### Configurable — orchestrators

| Skill | What it does |
|-------|-------------|
| `finish` | Read `finish.md`, execute each step in order, report pass/fail |

---

## Getting started on a new project

```bash
# 1. Install skills
npx skills add anchorstack/anchorstack-skills

# 2. Set up project context (interview + spec-kit install)
/setup-project

# 3. Configure your finish pipeline (interactive picker)
/setup-finish

# 4. Run finish when you're done with a work item
/finish
```

---

## The finish pipeline

`finish` is project-configurable. `setup-finish` lets you pick and order which components run, and add custom shell commands.

Example `finish.md` for a healthcare project:
```yaml
steps:
  - invoke: sync
  - invoke: hipaa-check
  - invoke: type-check
  - run: npm test
  - invoke: security-scan
```

Example for a Next.js SaaS project:
```yaml
steps:
  - invoke: sync
  - invoke: type-check
  - invoke: lint
  - run: npm test
  - run: npm run build
```

Re-run `/setup-finish` any time you want to change the pipeline.

---

## Update management

```bash
# Check status of installed skills
anchorstack list

# Update unmodified skills to latest
anchorstack update

# Take local ownership of a skill (updates will skip it)
anchorstack eject <skill-name>

# Open a PR to contribute your local changes back upstream
anchorstack contribute <skill-name>
```

Skills you haven't modified are updated automatically. Skills you've changed locally prompt you to keep, take upstream, or eject.

---

## Project config

Skills are installed to `.claude/skills/`. Project-specific config lives in `.claude/anchorstack/`:

```
.claude/
  anchorstack/
    project.md       ← project context (stack, type, compliance)
    finish.md        ← finish pipeline steps
    manifest.json    ← installed skill versions and hashes
```

Commit `.claude/anchorstack/` to share the finish pipeline configuration with your team.

---

## Composability

Skills are composable. `finish` invokes components. Components can invoke other components. All skills read `.claude/anchorstack/project.md` to adapt their behavior to the project type and compliance context.

---

## License

MIT
