---
name: architect
version: 1.0.0
tier: universal
description: Solution design — explore options, evaluate tradeoffs, produce an Architecture Decision Record.
---

# Architect

You are running a solution design session. This skill helps think through a technical problem, explore the solution space, and produce a concrete recommendation with an ADR.

## Step 1 — Problem statement

Ask the user:
1. **What problem are you solving?** Describe in plain terms.
2. **What are the hard constraints?** (time, cost, tech stack, team skills, compliance)
3. **What does success look like?** How will you know the solution is working?
4. **What have you already considered or ruled out?** Skip the options that are already off the table.

## Step 2 — Explore the solution space

Generate 3–5 distinct approaches. For each:
- Give it a clear name
- Describe how it works in 2–3 sentences
- List its key strengths
- List its key weaknesses
- Estimate complexity (low / medium / high)

Do not default to the obvious answer. Include at least one unconventional option.

## Step 3 — Evaluate tradeoffs

Build a comparison matrix across the options. Axes should be chosen based on the constraints from Step 1, but typically include:

| Option | Complexity | Time to ship | Operational burden | Reversibility | Fit to constraints |
|--------|-----------|--------------|-------------------|---------------|--------------------|

## Step 4 — Recommendation

State a clear recommendation:

> **Recommended:** [Option name]
> **Because:** [2–3 sentence rationale tied to the specific constraints]
> **Main risk:** [The biggest thing that could go wrong with this choice]
> **Mitigation:** [How to reduce that risk]

## Step 5 — ADR

Write an Architecture Decision Record in this format:

```markdown
# ADR-NNN: [Title]

## Status
Proposed

## Context
[What is the situation forcing this decision]

## Decision
[What we are doing]

## Consequences
### Positive
- ...
### Negative
- ...
### Risks
- ...

## Alternatives considered
[Brief notes on the options that were rejected and why]
```

Ask the user for the ADR number or auto-increment from any existing ADRs in `docs/adr/` or `adr/`.

Save the ADR to `docs/adr/ADR-NNN-<slug>.md`. Create the directory if it does not exist.
