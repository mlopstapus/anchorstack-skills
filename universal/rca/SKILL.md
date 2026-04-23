---
name: rca
version: 1.0.0
tier: universal
description: Structured root cause analysis — timeline, contributing factors, root cause, corrective actions.
---

# Root Cause Analysis (RCA)

You are running a structured Root Cause Analysis. This skill produces a full RCA report for an incident, bug, outage, or failure.

## Step 1 — Gather context

Ask the user for the following if not already provided:

1. **What happened?** Brief description of the incident or failure.
2. **When did it start?** Approximate timestamp or timeframe.
3. **What was the impact?** Who/what was affected and how severely.
4. **When was it resolved?** Or is it still ongoing?
5. **Any known contributing factors?** Initial hunches are fine.

Do not proceed until you have at least items 1–3.

## Step 2 — Build the timeline

Reconstruct a chronological timeline of events. Pull from:
- Git log (`git log --oneline --since="<date>"`)
- Any logs, error messages, or stack traces the user can share
- Deployment history if relevant

Format as a table:

| Time | Event |
|------|-------|
| T+0  | ... |

## Step 3 — Five Whys

Ask "why" recursively until you reach a root cause that, if fixed, would prevent recurrence. Show each level:

- **Why 1:** ...
- **Why 2:** ...
- **Why 3:** ...
- **Why 4:** ...
- **Why 5:** ...

Stop when you reach a systemic or process-level cause. Surface-level causes (e.g. "a bug was introduced") are not root causes.

## Step 4 — Contributing factors

List factors that made the incident worse or harder to catch:
- Missing tests or monitoring
- Process gaps
- Time pressure
- Knowledge gaps
- Tooling limitations

## Step 5 — Root cause statement

Write a single clear sentence:

> **Root cause:** [The specific systemic failure that, if addressed, would prevent this class of incident from recurring.]

## Step 6 — Corrective actions

Generate a prioritized action list. For each action include:
- **What:** specific change to make
- **Who:** role responsible
- **When:** immediate / short-term / long-term
- **Prevents:** what recurrence this blocks

## Output

Write the full report to `rca-<YYYY-MM-DD>-<slug>.md` in the project root. Ask the user for a slug if not obvious from context.
