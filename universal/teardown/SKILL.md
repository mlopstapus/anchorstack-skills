---
name: as-teardown
version: 1.0.0
tier: universal
description: Feature teardown deep dive that investigates an existing feature across code, UI, workflows, data, operations, and known problems, then writes a durable report. Use this when someone asks to understand, map, document, audit, or explain a feature before changing it.
---

# Teardown

This skill creates a working-quality feature brief for an existing application feature. The output should be useful to an engineer who needs to modify the feature without inheriting vague context, missed workflows, or hidden risk.

Do not write a generic summary. Investigate the feature empirically, connect behavior to implementation, and call out uncertainty clearly.

---

## Output

Write the final report to:

```text
context/features/<YYYY-MM-DD>-<feature-slug>.md
```

Create `context/features/` if it does not exist.

If the user gives a different destination, use that destination instead.

---

## Phase 1 - Define the feature boundary

Start by identifying the exact feature to understand.

Use the user's request, issue context, product copy, routes, screenshots, tests, and code names to determine:

- The feature name.
- The primary user or actor.
- The entry points where a user reaches it.
- The core outcome the feature is supposed to deliver.
- What is explicitly out of scope for this deep dive.

Ask a focused question only if the boundary is genuinely ambiguous and the wrong boundary would waste the investigation. If you can make a reasonable assumption, state it in the report and proceed.

---

## Phase 2 - Find the feature in the product

Map what the feature looks like from the outside before reading too deeply into internals.

Look for:

- Routes, pages, layouts, components, modals, forms, panels, and navigation entries.
- API calls, server actions, jobs, CLI commands, webhooks, or background flows the feature triggers.
- User-visible states such as empty, loading, success, error, permission denied, disabled, archived, draft, and edge-case states.
- Screenshots, Storybook stories, design references, docs, or tests that show expected behavior.

When the app can run locally, use it. Capture what you verified. When it cannot run locally, say why and rely on source, tests, docs, and static inspection.

---

## Phase 3 - Trace the workflows

Document the real workflows, not only the happy path.

For each meaningful workflow, trace:

1. Trigger: what starts the workflow.
2. Inputs: form fields, URL params, state, permissions, external events, or data prerequisites.
3. Processing: client logic, server logic, validation, transformations, and persistence.
4. Outputs: UI updates, records written, events emitted, side effects, notifications, or downstream calls.
5. Failure behavior: validation errors, retries, partial failures, stale data, permission failures, and recovery paths.

Prefer concrete file references over prose when possible.

---

## Phase 4 - Trace the implementation

Read the implementation deeply enough that another engineer can orient quickly.

Cover:

- Frontend components and state ownership.
- Backend endpoints, services, actions, workers, and middleware.
- Data models, schemas, tables, migrations, storage objects, and external system records.
- Authorization and access control.
- Configuration, environment variables, feature flags, and deployment assumptions.
- Tests and fixtures that define or protect the behavior.
- Observability, logging, metrics, and operational hooks.

For each important file, explain why it matters. Avoid dumping file lists without relationships.

---

## Phase 5 - Evaluate quality and risk

Look for issues that would matter before changing the feature:

- Tech debt, duplicated logic, unclear ownership, weak boundaries, or hard-coded assumptions.
- Missing tests, brittle tests, stale docs, or behavior not covered by tests.
- Security, privacy, compliance, and permission risks.
- Performance bottlenecks, N+1 queries, large payloads, cache hazards, or expensive client work.
- Reliability risks, race conditions, retry gaps, partial writes, or missing rollback paths.
- UX gaps, confusing states, inaccessible controls, or broken responsive behavior.
- Data migration or backward compatibility hazards.

Separate confirmed issues from suspected risks. Tie each confirmed issue to evidence.

---

## Phase 6 - Write the feature brief

Use this structure:

```markdown
# Feature Teardown: <Feature Name>

**Date:** YYYY-MM-DD
**Status:** Investigated
**Repo:** <repo name>
**Scope:** <what was included>

## Executive Summary

One or two short paragraphs describing what the feature does, who uses it, and the most important implementation or risk notes.

## Feature Boundary

- In scope:
- Out of scope:
- Assumptions:

## User Workflows

### <Workflow Name>

- Trigger:
- Preconditions:
- Steps:
- Success behavior:
- Failure behavior:
- Key files:

## What It Looks Like

Describe the UI, screens, states, and user-visible behavior. Include screenshot paths if captured.

## How It Works

Explain the implementation from entry point to persistence or side effects. Include file references and data flow.

## Data and Integrations

Describe data models, external systems, contracts, jobs, events, and configuration.

## Tests and Verification

List relevant tests, commands run, observed results, and gaps.

## Tech Debt and Issues

| Severity | Issue | Evidence | Suggested next step |
| --- | --- | --- | --- |
| High | ... | ... | ... |

## Open Questions

Questions that could not be answered from the repo, runtime behavior, docs, or issue context.

## Recommended Follow-ups

Prioritized implementation, testing, cleanup, or research work.
```

Keep the report specific and evidence-backed. If a section does not apply, say so briefly rather than deleting it.

---

## Completion Standard

The task is complete when:

- The report exists at the agreed path.
- The feature boundary is explicit.
- At least one user workflow is traced end to end, unless the feature truly has no workflow.
- UI or user-visible behavior is described.
- Implementation files and data flow are connected to behavior.
- Tech debt, issues, and test gaps are separated from open questions.
- Verification performed and verification gaps are recorded.
