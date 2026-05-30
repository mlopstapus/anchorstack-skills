# Data Model: RCA Skill (ANC-201)

**Branch**: `001-create-rca-skill` | **Date**: 2026-05-30

This skill is not a data-driven application. The entities below are the logical constructs
the skill operates on during an investigation.

---

## Entity: RCA Skill

**What it represents**: The skill artifact itself — `universal/rca/SKILL.md`.
**Attributes**:
- `name`: `as-rca` (stable identifier for registry and invocation)
- `version`: `3.0.0` (post-update)
- `tier`: `universal` (applicable to any project type)
- `inputs`: symptom description (natural language), optional `.claude/anchorstack/project.md`
- `outputs`: RCA report at `context/rca/YYYY-MM-DD-<slug>.md`

---

## Entity: Failure Symptom

**What it represents**: The user-reported externally observable problem.
**Attributes**:
- Description (what the user sees)
- Timing (when it started)
- Reproducibility (always / sometimes / environment-specific)
- Environment (local / staging / production / stack details)
- Available evidence (logs, stack traces, test failures, error messages)

**Validation rules**: At minimum, a description must be present. All other attributes are
gathered in Phase 1 if absent; investigation proceeds on available evidence if incomplete.

---

## Entity: Failure Point

**What it represents**: The specific code location or condition where behavior first becomes incorrect.
**Attributes**:
- File path and line reference
- Condition description (what goes wrong there)
- Evidence type (stack trace frame / wrong output source / crash origin)

**Relationship**: One Failure Symptom has one primary Failure Point (the starting node of
the causation chain). Multiple failure points may exist if causes branch.

---

## Entity: Causation Chain

**What it represents**: The ordered sequence of cause-effect relationships from symptom to root cause.
**Attributes**:
- Ordered list of nodes: each node is a Failure Point or upstream cause
- Causal link between each pair of adjacent nodes
- Terminus: the Root Cause Driver

**Format**:
```
[SYMPTOM]
  ↓ caused by
[FAILURE_POINT]
  ↓ caused by
[UPSTREAM_CAUSE]
  ↓ caused by
[ROOT_CAUSE]
```

---

## Entity: Root Cause Driver

**What it represents**: The deepest actionable cause — the decision, assumption, or gap where
the causal chain terminates.
**Attributes**:
- Category (one of: data, workflow, code structure, architecture, configuration, dependency,
  test coverage, process, observability)
- Description (specific gap or decision that made the failure possible)
- Counterfactual: if this didn't exist, would the failure still occur? (must be: no)

---

## Entity: RCA Report

**What it represents**: The persisted investigation output.
**Attributes**:
- File path: `context/rca/YYYY-MM-DD-<slug>.md`
- Status: Investigating | Root cause identified | Resolved
- Sections: What broke, Causation chain, Root cause, Contributing factors, Fix, Prevention

**Validation rules**:
- MUST NOT contain secrets, credentials, tokens, or sensitive values
- MUST include all six sections (contributing factors may be empty if none identified)
- File path MUST follow the `YYYY-MM-DD-<slug>` convention

**Relationship**: One investigation produces one RCA Report. The report references one Root
Cause Driver and one or more Contributing Factors.
