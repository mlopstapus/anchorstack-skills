---
name: anchorstack-backlog
version: 1.0.0
tier: universal
description: Generate a prioritized product backlog with user stories, acceptance criteria, and effort estimates.
---

# Backlog Generator

You are generating a product backlog. This skill produces structured work items with user stories, acceptance criteria, and rough effort estimates — ready to load into a project tracker.

## Step 1 — Context gathering

Ask the user for:
1. **What is the product / feature?** Describe what you are building.
2. **Who are the users?** List the primary user types or personas.
3. **What problem does it solve?** The core job-to-be-done.
4. **What is in scope?** What are we definitely building in this round.
5. **What is out of scope?** Explicitly park things that are not in this iteration.
6. **Any technical constraints?** Stack decisions, integrations, or non-negotiables.
7. **Is there a spec or design?** If so, read it before generating items.

Also check for `.claude/anchorstack/project.md` and read it for stack and compliance context.

## Step 2 — Generate epics

Break the scope into 3–7 epics. An epic is a meaningful chunk of product value that takes more than one sprint. Format:

```
Epic: [Name]
Goal: [One sentence — what user problem does this solve]
Included: [Bullet list of what's in this epic]
```

## Step 3 — Generate stories

For each epic, generate user stories. Each story must be:
- **Small enough** to complete in 1–3 days
- **Independently testable**
- **Valuable on its own** (not just a technical task)

Format each story:

```markdown
### [Epic] — [Story title]

**As a** [user type]
**I want to** [do something]
**So that** [I get some value]

**Acceptance criteria:**
- [ ] ...
- [ ] ...
- [ ] ...

**Effort:** XS / S / M / L / XL
**Dependencies:** [other story IDs if any]
**Notes:** [edge cases, open questions, technical callouts]
```

## Step 4 — Prioritize

Sort stories using this framework:
1. **Must have** — core value prop, nothing works without it
2. **Should have** — important but not launch-blocking
3. **Could have** — nice to have if time allows
4. **Won't have** — explicitly out of scope this iteration

## Step 5 — Output

Produce the full backlog as a markdown document. Ask the user if they want it:
- Saved to `backlog-<YYYY-MM-DD>.md` in the project root
- Grouped by epic
- Or flat sorted by priority

Include a summary table at the top:

| ID | Title | Epic | Priority | Effort | Status |
|----|-------|------|----------|--------|--------|
