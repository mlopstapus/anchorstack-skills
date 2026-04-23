---
name: as-context
version: 1.0.0
tier: universal
status: under-review
description: Build a context/ folder with researched topic docs for the current project.
---

# Context Creation

Build a `context/` folder for the current project. Each file is a concise research doc on a topic relevant to the work.

## Step 1 — Project survey

Read to understand the project:
- `CLAUDE.md` (if present)
- `README.md`
- `package.json` / `pyproject.toml` / `go.mod` (whichever apply)
- `.claude/anchorstack/project.md` and `finish.md` if present

Extract:
- Tech stack (frameworks, key libraries, language versions)
- Domain (what the product does, who it serves)
- Compliance requirements (HIPAA, SOC 2, GDPR, etc.)
- Architectural patterns in use
- Any non-obvious constraints visible in config

## Step 2 — Topic selection

Propose a list of research topics, grouped:

- **Stack** — things the team actively codes against (e.g., Next.js App Router, Prisma)
- **Domain** — subject matter knowledge (e.g., healthcare billing, real estate data)
- **Compliance** — regulatory context (e.g., HIPAA minimum necessary, SOC 2 controls)
- **Patterns** — architectural approaches in use (e.g., optimistic UI, event sourcing)

Present the list. Let the user add, remove, or rename topics before proceeding.

## Step 3 — Ensure context/ stub exists

Create `context/` at the project root if it doesn't exist. Do not overwrite existing files.

## Step 4 — Research each topic

For each approved topic, create `context/<topic-slug>.md` and run a focused research pass (5–10 sources, technical depth). Each doc should cover:

- What it is and why it matters for this project
- Current best practices and common gotchas
- How it specifically applies here
- Key docs / links to bookmark

Use `as-research` as the research engine for each topic. Configure each pass as a quick brief (5–10 sources) with output saved directly to `context/<topic-slug>.md` rather than `research-output/`. Skip the interactive whitepaper intake — topic and purpose are already known.

## Step 5 — Write index

Create or update `context/index.md`:
- One paragraph describing the project
- Table: Topic | File | One-line summary | Date researched

## Step 6 — Gitignore check

Ask the user whether `context/` should be committed. Default: yes — this is project knowledge worth tracking.
