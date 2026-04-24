---
name: as-backlog
version: 2.0.0
tier: universal
description: Build or update a structured product backlog from architecture and tenets. Creates a numbered, priority-ranked folder hierarchy at backlog/ with a foundations epic (research/decisions before coding), numbered epics, and spec-kit-compatible feature files with requirements, open questions, and dependencies. Use this skill when the user wants to plan what to build, create implementation tickets, break architecture into workable chunks, or figure out where to start on a project. Trigger on any mention of backlog, epics, features, implementation planning, or "what do we build first".
---

# Backlog

The backlog translates architecture and tenets into a ranked, executable plan. It's organized as a folder hierarchy rather than a single list — so epics and features can be navigated, checked off, archived, and eventually synced to a tracker (Jira etc.).

The structure is:
```
backlog/
  000-foundations/        ← always first — decisions and context before coding starts
    EPIC.md
    001-repo-structure.md     deliverable → context/repo-structure.md
    002-deployment.md         deliverable → context/deployment.md
    003-design-system.md      deliverable → context/design-system.md
    archive/
  001-epic-slug/          ← epics ranked by implementation order / priority
    EPIC.md
    001-feature-slug.md
    002-feature-slug.md
    archive/              ← completed features move here
  002-epic-slug/
    ...

context/                  ← populated as foundations items are completed
  architecture.md         (written by as-architect)
  repo-structure.md       (written when foundations/001 is done)
  deployment.md           (written when foundations/002 is done)
  design-system.md        (written when foundations/003 is done)
  ...
```

---

## Phase 1 — Read available context

Start by reading everything available. The quality of the backlog depends on what you know about the project.

**Read in priority order:**
1. `context/architecture.md` — system design, bounded contexts, components, key decisions
2. `spec/tenets.md` — the governing invariants (these become constraints on every feature)
3. `.claude/anchorstack/project.md` — stack, compliance scope
4. `backlog/` — if it exists, scan what's already there (existing epics, completed foundations items)
5. `CLAUDE.md` and `README.md` — any product context not in architecture

If `context/architecture.md` doesn't exist, tell the user: "I don't see an architecture document — running as-architect first will give me a much better foundation for the backlog. Do you want to proceed anyway, or should we do that first?"

---

## Phase 2 — Interview for scope

Don't generate the full backlog yet. First, understand the scope of this planning session:

1. **What are we building toward?** Is this the full product, an MVP, a specific release, or a single epic?
2. **What's already done?** Any existing code, existing backlog items already completed?
3. **What are the constraints?** Timeline, team size, anything that limits scope?
4. **Any known unknowns?** Things you know you don't know yet — these go in foundations.

Keep this short. 2–3 questions at most. The architecture document should already answer most of what you need.

---

## Phase 3 — Plan the foundations epic

`backlog/000-foundations/` is always the first epic and always comes before implementation. Its purpose is to establish the decisions and context the entire project will be built on. Implementation epics should not begin until foundations items that block them are resolved.

Foundations items are not features — they're decisions that need to be made and documented. Each one has a deliverable: a document written to `context/` that becomes a permanent project reference. When a foundations item is completed, the team should have a clear, written answer they can point to.

**Foundations items to always consider** (generate specific ones based on the project):

- **Repo structure** — monorepo vs. separate repos, folder conventions, where things live
- **Deployment** — hosting platform, CI/CD pipeline, environments (dev/staging/prod), release process
- **Design system** — color palette, typography, component library choice, design tokens, brand conventions
- **API conventions** — REST vs. GraphQL, versioning strategy, error response format, auth headers
- **Database schema conventions** — naming, migration tooling, soft-delete pattern, audit fields
- **Authentication approach** — provider, session strategy, token storage, refresh flow
- **Environment and secrets management** — how secrets are managed, .env conventions, what goes where
- **Testing strategy** — unit vs. integration vs. e2e split, what requires tests, test data approach
- **Error handling conventions** — how errors propagate, what gets logged, what gets returned to users
- **Third-party service selections** — email, storage, payments, analytics — evaluate and choose before building against them

Also mine the architecture document for open questions listed there and add those as foundations items.

**Each completed foundations item writes to `context/`** — for example:
- `backlog/000-foundations/001-repo-structure.md` → deliverable: `context/repo-structure.md`
- `backlog/000-foundations/002-deployment.md` → deliverable: `context/deployment.md`
- `backlog/000-foundations/003-design-system.md` → deliverable: `context/design-system.md`

The `context/` folder becomes the living reference for the project. BEARY and other research tools point here. The foundations epic is how that folder gets populated before implementation begins.

---

## Phase 4 — Plan epics

Break the product into epics — meaningful chunks of user value that take more than a sprint. Pull these from the bounded contexts or components in the architecture document where possible, so the backlog maps naturally to the system design.

**Ranking criteria** (think about these in order):
1. What's foundational — other epics depend on it? Build it first.
2. What delivers the core value proposition? Do it early.
3. What reduces the most risk? Do it before you go too deep.
4. What's additive / can wait? Push it later.

Draft the epic list and share it with the user before writing features: "Here's how I'd break this down. Does this order make sense, or should anything move?" Adjust based on their feedback.

---

## Phase 5 — Write features

For each epic, generate its features — the individually implementable pieces. Each feature should be:
- Completable in a few days of focused work
- Independently testable
- A coherent unit of value (not just a technical task)

Number them within the epic by priority (`001-`, `002-`, etc.). The number reflects implementation order, not just a label.

**Foundations item format** (`backlog/000-foundations/NNN-slug.md`):

```markdown
---
type: foundations
item: NNN-slug
status: open
deliverable: context/slug.md
---

# Decision/Research Title

What question needs to be answered or what needs to be established, and why it matters before implementation begins.

## What We Need to Decide / Research

Specific sub-questions or things to investigate.

- Question or task 1
- Question or task 2

## Options / Considerations

Known approaches or tradeoffs to evaluate (fill in what's already known).

## Deliverable

When complete, write findings to `context/slug.md`. That document becomes the permanent reference — implementation epics will link back to it.

## Dependencies

Other foundations items this depends on (if any).
```

**Feature file format** (`backlog/NNN-epic-slug/NNN-feature-slug.md`):

```markdown
---
epic: NNN-epic-slug
feature: NNN-feature-slug
status: open
dependencies: []
---

# Feature Title

One paragraph: what this feature does and why it matters to the user or system.

## Requirements

What must be true when this feature is complete. Write these as verifiable statements, not aspirations.

- [ ] Requirement 1
- [ ] Requirement 2

## Acceptance Criteria

How to verify this is done correctly. Should be runnable or checkable.

- [ ] Criterion 1
- [ ] Criterion 2

## Open Questions

Things that need answers before or during implementation.

- Question 1?

## Dependencies

Other features or decisions this one depends on.

- `backlog/000-foundations/NNN-decision.md`
- `backlog/NNN-other-epic/NNN-other-feature.md`

## Technical Notes

Implementation constraints, approach hints, tenet references (e.g., "Per tenet S1, all requests must be authenticated"), or architectural context that's non-obvious.
```

Tenets inform every feature — if a tenet constrains how something must be implemented, reference it explicitly in Technical Notes. This is what makes features spec-kit-compatible.

---

## Phase 6 — Write EPIC.md files

Each epic gets an `EPIC.md` that serves as the entry point and progress tracker.

**Format:**

```markdown
# Epic NNN: Epic Name

**Priority:** N
**Status:** not-started | in-progress | complete
**Goal:** One sentence — what user or system value does this epic deliver?

## Overview

1–2 paragraphs on what this epic covers and why it's at this priority.

## Features

- [ ] [001 - Feature Name](001-feature-slug.md)
- [ ] [002 - Feature Name](002-feature-slug.md)

*Completed features are moved to `archive/` and checked off here.*

## Dependencies

Epics or foundations items this depends on (if any).

## Notes

Anything the team needs to know before starting this epic.
```

The checkboxes in the features list are the team's progress tracker. When a feature is complete, move the file to `archive/` and check it off in `EPIC.md`.

---

## Phase 7 — Write everything

Write all files at once:
- `backlog/000-foundations/EPIC.md` and all foundations items
- Each epic folder with `EPIC.md`, feature files, and an empty `archive/`

Create folders as needed. Don't ask about file structure — just match the schema above.

---

## Phase 8 — Summary

After writing, give the user:

```
Backlog created.

000-foundations/    N items (research, decisions)
001-epic-slug/      N features
002-epic-slug/      N features
...

Suggested starting point: 000-foundations — complete [item] and [item] before 
beginning epic 001, which depends on those decisions.

Total features: N across N epics.
```

Call out anything that looks like a significant blocker or a decision that, if made wrong, would require rework across multiple epics. These deserve extra attention in foundations.

---

## Updating an existing backlog

If `backlog/` already exists:
- Read all `EPIC.md` files to understand what's in progress and what's done
- Don't renumber existing epics — append new ones at the end
- Don't overwrite feature files — only add new ones
- Ask the user what's changed (new architecture decisions, scope changes) before generating additions
