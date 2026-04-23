---
name: anchorstack-setup-project
version: 1.0.0
tier: setup
description: Initialize a project for Anchorstack — interview, install spec-kit, write project.md.
---

# Setup Project

Run this once when starting work on a new project. It captures the project context, installs spec-kit, and writes `.claude/anchorstack/project.md` which all other skills read for context.

## Step 1 — Interview

Ask the user the following questions. Take notes as you go.

1. **Project name:** What is this project called?
2. **What does it do?** 2–3 sentence description of the product or service.
3. **Stack:** What languages, frameworks, and key libraries are in use?
4. **Project type:** Which best describes it?
   - SaaS web app
   - Healthcare / clinical system
   - Automation / workflow system
   - Internal tooling
   - API / platform service
   - Mobile app
   - Data pipeline
   - Other (describe)
5. **Compliance requirements:** Does this project handle any of the following?
   - HIPAA (protected health information)
   - SOC2 (security/availability controls)
   - GDPR (EU personal data)
   - PCI DSS (payment card data)
   - None / unknown
6. **Team size:** How many engineers work on this codebase?
7. **Key constraints:** What are the hard constraints? (deadline, legacy systems, must-use libraries, etc.)
8. **Known problem areas:** Any areas of the codebase already known to be fragile or in need of work?
9. **CI/CD setup:** What does the deploy pipeline look like?
10. **Testing approach:** What kinds of tests exist (unit, integration, e2e)? What's the coverage situation?

## Step 2 — Install spec-kit

Check if `specify` is already available:
```bash
specify --version
```

If not installed, detect the available installer:
```bash
which uv && echo "uv available" || which pipx && echo "pipx available"
```

Install using the available tool:
```bash
# uv (preferred)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# pipx (fallback)
pipx install git+https://github.com/github/spec-kit.git
```

If neither `uv` nor `pipx` is available, tell the user to install `uv` first:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Then initialize spec-kit in the project:
```bash
specify init
```

## Step 3 — Write project.md

Create `.claude/anchorstack/` if it doesn't exist, then write `.claude/anchorstack/project.md`:

```markdown
# Project Context

## Name
<project name>

## Description
<2–3 sentence description>

## Stack
<languages, frameworks, key libraries>

## Project type
<type from interview>

## Compliance
<list of applicable compliance frameworks, or "None">

## Team
<team size>

## Key constraints
<constraints from interview>

## Known problem areas
<known fragile areas>

## CI/CD
<pipeline description>

## Testing
<testing approach and coverage situation>

## Last updated
<YYYY-MM-DD>
```

## Step 4 — Initialize manifest

Create `.claude/anchorstack/manifest.json`:
```json
{
  "version": "1.0.0",
  "installedAt": "<ISO timestamp>",
  "skills": {}
}
```

## Step 5 — Confirm

Tell the user:
- What was written and where
- That they should run `setup-finish` next to configure the finish pipeline
- That they should run `tenants` to generate spec-kit constitution tenants
