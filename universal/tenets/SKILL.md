---
name: as-tenets
version: 1.0.0
tier: universal
description: Establish project tenets — the governing principles that define what "correct" means for this codebase. Derives a draft set of tenets from project context, then interviews the user to fill gaps and confirm. Outputs spec/tenets.md and optionally initializes a speckit-constitution. Use this skill when the user wants to define project rules, establish coding principles, set up a project constitution, or create guiding standards for a codebase. Also use it proactively when a project seems to lack documented principles and the user asks about consistency, quality, or standards.
---

# Tenets

Tenets are the governing principles for this project. They encode what "correct" means here — the invariants that every piece of work should uphold. Good tenets are:

- **Specific enough to be testable** — not "write clean code" but "all async functions must handle the error case explicitly"
- **Grounded in real risk** — each one should encode a constraint the project actually faces
- **Written as positive statements** — what must always be true, not what to avoid

The goal of this skill is to arrive at a set of tenets the user actually believes in, not a generic checklist. Start from the project itself, make concrete recommendations, then refine with the user.

---

## Phase 1 — Read the project

Before asking anything, gather as much context as possible so your recommendations aren't generic.

**Read in order (stop each when you have enough):**

1. `.claude/anchorstack/project.md` — stack, compliance scope, commands
2. `CLAUDE.md` — team conventions, constraints, existing rules
3. `README.md` — what the project does, who uses it, any stated principles
4. `package.json` / `go.mod` / `pyproject.toml` — exact dependencies (hint at architectural choices)
5. Spot-check 2–3 key source files to understand patterns in use (auth middleware, DB layer, API handlers, or equivalent)
6. `spec/tenets.md` — if it already exists, read it and note what's there

Also scan for signals:
- Test files: what's being tested, what's not, testing approach
- Error handling patterns: consistent or scattered?
- Any `.env.example`, secrets management approach
- Compliance signals: HIPAA/SOC2 referenced in code or config?

The more specific your understanding, the more useful your tenet recommendations will be.

---

## Phase 2 — Draft initial tenets

Based on what you read, draft a set of tenets organized by category. Don't wait for the user to tell you what they care about — make your best educated guess and explain your reasoning. You can always adjust.

**Standard categories to consider** (use what applies, skip what doesn't):

- **Security** — auth, authorization, input validation, secrets, encryption
- **Data integrity** — validation rules, constraints, idempotency, consistency guarantees
- **Error handling** — how errors surface, what gets logged, what gets returned to callers
- **Observability** — logging, tracing, alerting — what the system must emit
- **Performance** — latency targets, caching rules, query patterns
- **Compliance** — regulatory requirements (HIPAA, SOC2, GDPR, PCI) if in scope
- **Testing** — what requires tests, what coverage means here, integration vs unit policy
- **Code quality** — patterns, abstractions, coupling rules, review standards
- **Operational** — deployment, rollback, health checks, zero-downtime requirements

For each tenet, write it in this format:

```
**[ID] — [Short name]**
[The rule, as a clear positive statement.]
*Why:* [The real constraint or risk this encodes — what goes wrong without it?]
```

Example:
```
**S1 — JWT required on all endpoints**
Every HTTP endpoint except `/health` and `/metrics` must verify a valid JWT before processing the request.
*Why:* Without this, adding new routes silently creates unauthenticated access — it's hard to audit after the fact.
```

Start with 5–10 tenets across 2–4 categories most relevant to this project. Don't try to be comprehensive in the first pass — better to get the important ones right than to produce a long list the user has to wade through.

---

## Phase 3 — Present and interview

Show the user your draft tenets. Lead with one sentence explaining your reasoning — something like: "Based on the stack and compliance scope I found, here's what I'd propose as a starting set. These are meant to spark the conversation, not be final."

Then ask:

1. **Do these feel right?** Walk through each category. Are any wrong, missing nuance, or not applicable?
2. **What's not here that should be?** What are the things your team argues about? What mistakes have come up more than once?
3. **What's the hardest thing to get right on this project?** The answer often reveals the most important missing tenet.
4. **Any compliance requirements that add constraints?** (If not already clear from the project config)

Don't ask all four at once — ask what's most relevant based on what the draft is missing. Listen for corrections and additions. The user knows things the code doesn't.

Ask in small batches (2–3 questions max at a time) and wait for answers before probing further. This should feel like a conversation, not a form.

---

## Phase 4 — Finalize

Revise the tenets based on the user's input. Before writing, briefly confirm the final set: "Here's what I have — anything to change before I write this out?"

A well-formed tenet:
- States the rule clearly as a positive assertion
- Is specific enough that a reviewer could check for a violation
- Includes the *why* — the consequence or risk it prevents
- Has a stable ID (e.g., S1, D2, O1) so it can be referenced elsewhere

---

## Phase 5 — Write the output

**Always write:** `spec/tenets.md` in the project root. Create `spec/` if it doesn't exist.

```markdown
# Project Tenets

*Last updated: YYYY-MM-DD*

These are the governing principles for [project name]. Each tenet encodes a constraint the project actually faces — not a style preference, but an invariant that must hold.

## [Category]

**[ID] — [Short name]**
[Rule statement]
*Why:* [The constraint or risk]

...
```

**If speckit is available** (`specify` command exists), also run:
```bash
specify init
```
Then write the tenets to the speckit constitution location per `specify --help`. If speckit isn't installed, note it at the end: "You can use these as a speckit-constitution by installing speckit and running `specify init`."

---

## Phase 6 — Summary

Tell the user:
- How many tenets were written and in which categories
- The one or two that felt most important to nail down for this project
- Where the file is (`spec/tenets.md`)
- A natural next step, e.g. "Now that these are established, as-architect can reference them when making design decisions" or "You can wire these into as-finish as a tenet-check step"
