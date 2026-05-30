---
name: as-architect
version: 3.0.0
tier: universal
description: Architecture design session — interview the user to understand what needs built, then think through the problem deeply, explore tradeoffs, model failure, apply Domain Driven Design where it fits, and produce context/architecture.md, individual decision records in context/pdr/, and bounded context folders with CONTRACT.md and OWNERSHIP.md. Use this skill when the user wants to design a system, plan an architecture, figure out how to structure something they're about to build, or think through a major technical decision.
---

# Architect

Run a collaborative architecture session. The goal is not to gather notes — it's to think hard about the problem together and arrive at a design you can both stand behind.

This is as much a thinking task for you as it is for the user. Bring your expertise. Challenge assumptions. Surface risks they haven't named. A good architecture session should feel like talking to a senior engineer who's seen this type of problem before.

The session ends with a fully documented architecture — not a collection of ideas.

---

## Phase 1 — Discovery

Start with open questions. Don't run through a form — listen and follow up based on what you hear. You're trying to understand the full shape of the problem before you say anything prescriptive.

**Start here:** Ask the user to describe what they're building in plain terms — the problem it solves, who uses it, what it needs to do. Don't constrain them. Let them explain it their way first.

**Probe based on what you hear. Pick the most important questions:**
- Who are the users, and what are their primary workflows?
- What's the scale? (users, data volume, transactions per second, peak vs steady state)
- What external systems must this integrate with, and what's the nature of those integrations?
- What's the most important thing to get right — and what can be wrong initially without being fatal?
- What does failure look like? Data loss? Downtime? Bad user experience? What's the actual business impact?
- Compliance or regulatory constraints? (HIPAA, SOC2, GDPR, PCI)
- What does the team look like? (how many engineers, what skills, what bandwidth)
- Is there an existing system? What stays, what goes, what must coexist?
- What's the timeline, and what are the forcing functions?

**Ask two or three at a time.** Listen. Then ask what's most important next based on what you learned.

---

## Phase 2 — Think Before You Design

Before proposing anything, think through the problem. This step is internal — reason your way to a position before presenting options.

- What is the core domain? What is this system's primary job, and what's everything else in service of it?
- What are the natural boundaries? Where does complexity cluster?
- What's the most likely failure mode? What's the hardest part to get right?
- What patterns apply? (modular monolith, microservices, event-driven, hexagonal, CQRS, saga — what actually fits?)
- What would a simpler version look like? Is that good enough?
- What's the cost of getting this wrong? Reversible or foundational?
- Does Conway's Law suggest anything? The architecture the team can build and own is often different from the technically ideal architecture.

Surface the most important tensions you've identified. The real architectural decision is often different from the surface question.

---

## Phase 3 — Clarify

Before designing, feed back what you've understood and get explicit confirmation. This is where misunderstood requirements get caught cheaply.

Write a short synthesis covering four things:

**What you understood:** Restate the problem, users, core workflows, and scale in your own words — concretely. Not "a healthcare app" but "a patient scheduling system for a single clinic, ~200 appointments/day, used by 5 admin staff and 3 clinicians."

**Assumptions you're making:** State things you're treating as true that weren't explicitly confirmed. Every design rests on assumptions — name them now. "I'm assuming this is a web app, not native mobile." "I'm assuming eventual consistency is acceptable for notifications." "I'm assuming the team has no prior microservices experience."

**What you still need to know:** Flag anything that would fork the design if the answer went one way vs. another. If you can proceed with a reasonable default, say what you'll assume. If the decision genuinely changes everything (e.g., multi-tenant vs. single-tenant changes the entire data model), ask before proceeding.

**Your initial read on what's hard:** Share the one or two things that look like the real engineering challenges based on what you've heard. This signals you've moved from note-taker to co-designer, and it often surfaces constraints the user hadn't explicitly named.

Wait for the user to confirm, correct, or add. The session does not move to design until both of you are working from the same understanding.

---

## Phase 4 — DDD Scope Check

Decide whether Domain Driven Design adds value here.

**Apply DDD when:**
- The system has complex business rules that are the core engineering challenge (not just CRUD)
- Multiple distinct business domains exist that are genuinely separate concerns
- The team is likely to grow, or multiple teams will own pieces
- The ubiquitous language is non-trivial and worth making explicit

**Skip DDD when:**
- Single-domain CRUD app, tool, marketing site, or simple automation
- The main challenge is infrastructure or integration, not business logic
- Small, stable team with bounded scope unlikely to grow

If DDD applies, work through it:

**Ubiquitous Language** — Name the key domain concepts as the team will use them in code, conversations, and documentation. Agreement on language prevents confusion more than any technical decision.

**Bounded Contexts** — What are the distinct areas of the domain, each with their own models and language? Sketch a context map. For each context relationship, identify the pattern: shared kernel, customer/supplier, conformist, anti-corruption layer.

**Aggregates** — What are the consistency boundaries? What's the aggregate root? What invariants must hold within the aggregate? Keep aggregates small — the temptation is to make them too large.

**Domain Events** — What happens in this system? What facts get recorded? Events often reveal the real shape of the domain better than entities do.

**BC Folder Convention** — Each bounded context gets a folder:

```
/bcs/
  <bc-name>/
    CONTRACT.md    ← what this BC exposes and how
    OWNERSHIP.md   ← what this BC owns
    src/           ← implementation
```

Work through CONTRACT.md and OWNERSHIP.md for each BC during this phase — don't leave them for the end. They are design artifacts, not documentation artifacts.

**CONTRACT.md** captures the BC's interface to the outside world — what it exposes and guarantees:

```markdown
# <BC Name> — Contract

**Owner:** <team or person>
**Status:** Draft | Stable | Deprecated

## Purpose
One paragraph on this BC's responsibility and why it exists as a separate context.

## Exposed APIs
| Endpoint / Method | Description | Consumers |
|-------------------|-------------|-----------|
| ...               | ...         | ...       |

## Events Published
| Event | Payload summary | Consumers |
|-------|----------------|-----------|
| ...   | ...            | ...       |

## Events Consumed
| Event | From BC | What this BC does with it |
|-------|---------|--------------------------|
| ...   | ...     | ...                      |

## Data Contracts
Key types exposed to other BCs — not implementation types. What shape does data have at the boundary?

## Stability Guarantees
What can consumers rely on not changing without notice?

## Breaking Change Policy
How will breaking changes be communicated and managed?
```

**OWNERSHIP.md** captures what this BC owns — folders, schemas, tables, and shared resources:

```markdown
# <BC Name> — Ownership

**Owner:** <team or person>

## Folder Ownership
| Path | Ownership level |
|------|----------------|
| /bcs/<bc-name>/ | Full |
| ...             | ...  |

## Database Ownership
Every table in a BC-specific schema is implicitly owned by that BC. Tables in a public or shared schema must be explicitly claimed here — no table in a public or shared schema is ownerless.

| Schema / Table | Notes |
|---------------|-------|
| ...           | ...   |

## Shared Resource Ownership
Files in /shared/ must have a single BC owner. List every shared resource this BC owns:

| Resource | Path | Notes |
|----------|------|-------|
| ...      | ...  | ...   |

## Dependencies (owned by others)
| Resource | Owned by BC |
|----------|-------------|
| ...      | ...         |
```

The OWNERSHIP.md for every BC, taken together, must account for every file in /shared/ — no shared resource is ownerless.

---

## Phase 5 — Data Architecture

Data outlives code. It's the hardest thing to change once production traffic is on it. Before designing services, design the data.

Work through these questions explicitly:

**Data ownership** — For each major entity or dataset: which bounded context owns it? Ownership means that BC is the single writer. Other BCs may read, but only through the owning BC's contract. This maps directly to OWNERSHIP.md.

**Consistency requirements** — For each domain: is strong consistency required, or is eventual consistency acceptable? Strong consistency constrains your options significantly (usually means one DB, or careful transaction design). Eventual consistency enables distribution but adds complexity the team must be able to reason about.

**Read/write patterns** — Is this read-heavy, write-heavy, or mixed? Are there hot paths that need different treatment? Read-heavy systems may need caching or read replicas. Write-heavy may need queue-based ingestion. Knowing the pattern shapes the database choice.

**Cross-context data flow** — How does data move between bounded contexts? Three patterns, each with real tradeoffs:
- *Shared database* — simple to start, but BCs aren't truly isolated; schema changes become coordination problems
- *Synchronous API calls* — explicit contract, but coupling at runtime; one BC's downtime affects the other
- *Events / async messaging* — decoupled, but eventually consistent; harder to debug, harder to reason about ordering

Be explicit about which pattern is used for each cross-context relationship, and why.

**Database choice** — Don't assume one database for everything. What does each context actually need? PostgreSQL for complex relational queries, a document store for flexible schemas, Redis for ephemeral state, a message broker for events — these are real choices. The reason matters as much as the choice.

**Migration path** — If there's existing data: how does it get from here to there? This is often harder than the new design. What runs in parallel? What gets migrated when? What's the rollback plan?

**Backup and recovery** — What's the RPO (how much data can be lost) and RTO (how fast must recovery happen)? These determine backup frequency, replication strategy, and whether you need point-in-time recovery.

---

## Phase 6 — Design and Decisions

Work through the architecture component by component. For each major piece, apply four lenses:

**Design** — What does this component do, and how is it structured? What are the options, what are the real tradeoffs for *this team and context*, and what do you recommend?

**Failure** — What happens when this component is unavailable? What's the blast radius — does it affect just this feature, or does it cascade? What's the degraded-mode behavior? Where are the single points of failure, and are they acceptable? What does recovery look like, and is there state to reconcile? Could a retry loop make things worse (thundering herd)?

**Build vs Buy** — For each major capability this component needs, make an explicit decision: build it, buy a SaaS, or adopt open source? This is an architectural decision that's often made implicitly and regretted. Cover at minimum:
- Auth / identity
- Email / SMS notifications
- Background job processing / queues
- Search
- File storage
- Payments (if applicable)
- Error tracking / observability
- Feature flags (if needed)

For each: the tradeoffs are real. Building gives control; buying gives speed and shifts operational burden. Name the choice and the reason.

**Conway's Law** — Does the component decomposition match how the team is actually structured? If you're one team of four, a monolith or modular monolith is almost always right. If you have three teams each owning a domain, separate services that follow those domain lines make sense. Don't architect for the org you wish you had — architect for the org you have, with a path to evolve.

**Operations** — Who deploys this component, how often, and what does rollback look like? How do you know it's healthy (what metrics, what alerts)? How do you debug it at 2am? How do schema migrations happen? What's the on-call story? Operational complexity is often what kills architectures that look correct on paper — a microservices design that's textbook DDD can be ruinous for three engineers to operate.

**PDRs** — For each significant decision (hard to reverse, or future maintainers need to understand why), capture a Project Decision Record:

```markdown
# PDR-NNN: <Title>

**Status:** Accepted
**Date:** YYYY-MM-DD

## Context
What situation or requirement forced this decision. What forces were at play.

## Options Considered

### <Option A>
<How it works, 2–3 sentences>
Pros: ...
Cons: ...

### <Option B>
<How it works>
Pros: ...
Cons: ...

## Decision
We chose <option> because <reason tied to the specific constraints of this project and team>.

## Consequences
- **Positive:** ...
- **Negative:** ...
- **Risks:** ... and mitigation plan
```

Significant decisions typically include: database choice, auth approach, service decomposition, sync vs async between contexts, API design, deployment strategy, caching strategy, key integration patterns.

---

## Phase 7 — Write the Architecture Document

When the design is settled, produce the artifacts.

**BC folders** (if DDD was applied) — These should already be substantially written from Phase 4. Finalize and write to disk:

```
/bcs/<bc-name>/CONTRACT.md
/bcs/<bc-name>/OWNERSHIP.md
```

Verify two things across all OWNERSHIP.md files taken together:
- Every file in /shared/ is claimed by exactly one BC
- Every table in the public schema (or any shared database schema) is claimed by exactly one BC

Nothing in a shared space — filesystem or database — is ownerless.

**PDRs** — Write to `docs/pdr/`. Create the directory if it doesn't exist. Auto-increment from existing files.

**Architecture document** — Write to `context/architecture.md`. Create `context/` if it doesn't exist.

```markdown
# Architecture: <System Name>

**Last updated:** YYYY-MM-DD
**Status:** Draft | Proposed | Accepted

## Overview
<2–4 sentences: what is this system, what problem it solves, who uses it>

## Architectural Style
<Overall approach — modular monolith, microservices, event-driven, etc. — and the one-sentence reason>

## Bounded Contexts
<Only if DDD was applied>

| Context | Responsibility | Contract | Ownership |
|---------|---------------|----------|-----------|
| <name>  | ...           | [Contract](../bcs/<name>/CONTRACT.md) | [Ownership](../bcs/<name>/OWNERSHIP.md) |

Context map: <how contexts relate — which pattern for each relationship>

## Components
<If not using DDD — main components and their responsibilities>

| Component | Responsibility |
|-----------|---------------|
| ...       | ...           |

## Data Architecture

| Store | Owner BC | Type | Why |
|-------|----------|------|-----|
| ...   | ...      | ...  | ... |

Cross-context data flow: <how data moves between contexts and which pattern>

## Key Decisions
<Links to PDRs>

- [PDR-001: Title](../docs/pdr/001-slug.md) — one-line summary
- ...

## Failure Model
<For each critical component: what's the failure mode, blast radius, and degraded behavior>

## Integrations
<External systems and how this integrates with each>

## Non-Functional Properties

| Property     | Target | Notes |
|-------------|--------|-------|
| Availability | ...    | ...   |
| Performance  | ...    | ...   |
| Security     | ...    | ...   |
| Compliance   | ...    | ...   |

## Operational Notes
<Deployment model, on-call considerations, key runbook scenarios>

## Open Questions
<Decisions not yet made, assumptions that need validation, things to revisit>
```

---

## Closing

After writing the artifacts, tell the user:
- What was written and where
- The single riskiest assumption in the design — the one thing that, if wrong, would require the most rework
- What to validate first before committing to the design
- Any open questions that need an answer before implementation starts

Architecture is a living thing. These documents should be updated as understanding develops — especially the open questions section.
