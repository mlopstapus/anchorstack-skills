---
name: as-retro
version: 2.0.0
tier: component
status: under-review
description: Session retrospective — review what happened, identify friction points and clarifications the user had to provide, then update CLAUDE.md, AGENTS.md, and memory files so agents improve over time.
---

# RALPH — Session Retrospective

Run at the end of a working session. RALPH reviews what happened, finds the friction, and bakes the learnings into the project's persistent context so the same corrections don't have to happen again.

## Step 1 — Review the session

Reflect on the current conversation. Look for:

- **Clarifications the user had to provide** — things Claude assumed wrong or asked about that should have been obvious from context
- **Corrections** — instances where the user said "no", "not like that", "actually...", or redirected the approach
- **Missing context** — information the user had to supply that could have been documented upfront
- **Repeated patterns** — anything the user explained more than once

Don't just skim — the value is in the specifics. A vague takeaway like "be more careful" is useless. A specific one like "this project uses `npm run typecheck` not `tsc --noEmit` directly" is what makes the next session faster.

## Step 2 — Identify what to document

Group findings into three buckets:

**Project facts** — stack details, conventions, constraints, commands that are specific to this codebase. These belong in `CLAUDE.md`.

**Agent behavior** — how Claude should approach tasks, what to avoid, what the user prefers. These belong in `CLAUDE.md` (project scope) or `AGENTS.md` (if present and agent-specific).

**User preferences** — working style, communication preferences, recurring patterns in how the user gives feedback. These belong in memory.

Only document things that would genuinely change how a future session goes. Skip anything already documented or too situational to generalise.

## Step 3 — Update CLAUDE.md

Read the existing `CLAUDE.md`. Add new entries under appropriate sections, or create new sections if needed. Do not remove existing content unless it's factually wrong.

Keep additions concise — one or two lines per fact. `CLAUDE.md` is read at the start of every session so it should stay scannable.

## Step 4 — Update AGENTS.md (if present)

Check if `AGENTS.md` exists. If it does, apply the same approach — add agent-specific behavioral guidance derived from the session. If it doesn't exist, don't create it.

## Step 5 — Update memory

Write new memory entries for user preferences and working style that surfaced during the session. Follow the same memory format already in use (frontmatter with `name`, `description`, `type`).

For corrections and feedback: save as `feedback` type memories — include the rule, why it matters, and when it applies.

For project-specific context: save as `project` type memories.

## Step 6 — Summarise

Tell the user what was added and where:

```
RALPH session retrospective complete.

CLAUDE.md — 2 additions:
  - This project uses `npm run typecheck`, not `tsc --noEmit`
  - Migrations live in db/migrations/, not src/db/

Memory — 1 new entry:
  - User prefers commit messages reviewed before committing (feedback)

AGENTS.md — no changes
```

If nothing worth documenting was found, say so plainly.
