# Feature Specification: RCA Skill

**Feature Branch**: `001-create-rca-skill`
**Created**: 2026-05-29
**Status**: Draft
**Input**: Issue ANC-201: "We want a skill that does root cause analysis on issues in a repo. We are not just looking for superficial issues we are looking for what is driving the issues. Is it a data problem, a workflow problem, a code structure problem? We ask questions to understand the issue then dive in to find out what is wrong exploring different aspects of the code base. This should live in the anchorstack-skills repo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Investigate Broken Behavior (Priority: P1)

As an engineer or technical lead with a broken or suspicious application behavior, I want to invoke
the RCA skill, which interviews me for missing context, investigates the repository empirically, and
reports the underlying cause category and causation chain — so I can fix the driver of the issue
instead of applying a superficial patch.

**Why this priority**: This is the core value of the skill. Without a complete investigation-to-report
flow, the skill delivers no value.

**Independent Test**: Invoke the skill with a description of a broken behavior. Verify it asks
targeted questions, inspects the repository, and produces a written report with a causation chain,
root cause classification, and prevention recommendation.

**Acceptance Scenarios**:

1. **Given** a user reports a broken behavior with incomplete context, **When** the RCA skill starts,
   **Then** it asks only the most relevant missing questions needed to understand the symptom, timing,
   reproducibility, environment, and available evidence.
2. **Given** a user provides logs, stack traces, failing tests, or reproduction notes, **When** the
   RCA skill investigates, **Then** it traces from the observed symptom to the failure point and then
   upstream through data, workflow, architecture, code structure, configuration, dependency, and
   process causes as applicable.
3. **Given** the first discovered bug is only a downstream consequence, **When** the RCA skill
   evaluates it, **Then** it continues asking "what is causing this?" until it reaches a defensible
   root cause or clearly documents why the investigation cannot go deeper.
4. **Given** the investigation identifies multiple independent contributing causes, **When** the RCA
   skill writes the report, **Then** it separates the root cause from contributing factors and
   explains how each factor affected the failure.
5. **Given** the skill cannot reproduce the issue locally, **When** adequate evidence exists from
   user-provided artifacts, **Then** it proceeds from that evidence while explicitly noting the
   reproduction limitation.

---

### User Story 2 - Incomplete Evidence Handling (Priority: P2)

As an engineer with only partial information (vague symptom, no logs, no reproduction steps), I want
the skill to identify what evidence is missing and guide me toward the next investigative step rather
than producing a speculative report.

**Why this priority**: Skills that fabricate root causes under uncertainty are worse than no skill.
Evidence gaps must surface, not disappear.

**Independent Test**: Invoke the skill with only a vague symptom ("it's slow sometimes"). Verify it
asks clarifying questions before investigation, proceeds on available evidence, and explicitly labels
any inference as unconfirmed.

**Acceptance Scenarios**:

1. **Given** the user provides only a vague symptom and no reproduction steps, **When** the RCA
   skill reaches the investigation phase, **Then** it explicitly states what evidence is missing and
   what the next evidence-gathering step is.
2. **Given** sufficient evidence exists but reproduction was not possible, **When** the report is
   written, **Then** it notes the reproduction limitation and rates its conclusions as inferred rather
   than confirmed.

---

### Edge Cases

- The user provides only a vague symptom and no logs or reproduction steps.
- The failure is intermittent, data-dependent, or environment-specific.
- The issue is caused by a non-code driver such as a flawed workflow, unclear ownership, missing
  validation, incomplete observability, or bad data assumptions.
- The repository has multiple apps, services, packages, or data paths that may participate in the
  failure.
- Investigation finds the immediate fix but also reveals a broader prevention gap.
- Secrets or credentials are visible in log output or repository files encountered during
  investigation — these MUST be excluded from the report.

## Requirements *(mandatory)*

### Functional Requirements

**Investigation workflow:**

- **FR-001**: The skill MUST start by establishing the reported symptom, observed behavior, expected
  behavior, timing, reproducibility, environment, and available evidence when those facts are not
  already present.
- **FR-002**: The skill MUST avoid form-style questioning when context is already obvious; it MUST
  ask targeted follow-up questions only for missing information that materially affects the
  investigation.
- **FR-003**: The skill MUST attempt to reproduce the failure or, when reproduction is impossible,
  state the evidence source it is using instead.
- **FR-004**: The skill MUST inspect the repository around the failure path rather than relying
  solely on the user's description.
- **FR-005**: The skill MUST identify the concrete failure point before declaring a root cause.
- **FR-006**: The skill MUST trace causes upstream from the failure point and continue until reaching
  a root cause that is a decision, assumption, design gap, data contract gap, workflow gap,
  validation gap, observability gap, or ownership gap.
- **FR-007**: The skill MUST classify the root cause driver using clear categories such as: data,
  workflow, code structure, architecture, configuration, dependency, test coverage, process, or
  observability.
- **FR-008**: The skill MUST distinguish symptoms, failure points, contributing factors, root causes,
  fixes, and prevention measures.
- **FR-011**: The skill MUST state uncertainty explicitly when evidence is insufficient and identify
  the next evidence needed rather than inventing a root cause.

**Report output:**

- **FR-009**: The skill MUST produce a written RCA report in the project's shared `context/rca/`
  area using a predictable dated filename (e.g., `YYYY-MM-DD-<slug>.md`).
- **FR-010**: The report MUST be generated from the skill's bundled RCA report template, with
  placeholders replaced by investigation findings. The report MUST include: what broke, the
  causation chain, the root cause, contributing factors, recommended fix, and prevention
  recommendation.
- **FR-018**: The skill MUST NOT include secrets, credentials, tokens, or sensitive values observed
  during repository investigation in the report or any output.

**Project context:**

- **FR-015**: The skill MUST read `.claude/anchorstack/project.md` at the start of investigation
  (when present) to load stack, commands, and configuration — avoiding re-detection of context that
  has already been captured.
- **FR-020**: The skill MUST degrade gracefully when `.claude/anchorstack/project.md` is absent,
  continuing investigation without requiring it.

**Skill registration and composability:**

- **FR-012**: The skill MUST be registered and discoverable as an AnchorStack skill in the skills
  repository (`skills.json` and `README.md`).
- **FR-019**: The skill's frontmatter MUST declare its expected inputs (symptom description, optional
  project config) and its output artifact (RCA report path) so downstream skills and users can
  reference them.

### Non-Functional Requirements

- **NFR-001**: The skill guidance MUST be understandable without prior AnchorStack-specific context
  beyond the repository's normal skill conventions.
- **NFR-002**: The skill MUST favor empirical evidence over speculation and make clear when an
  inference is based on available evidence rather than direct reproduction.
- **NFR-003**: The resulting RCA report MUST be concise enough for handoff while preserving the
  causal reasoning needed to audit the conclusion.
- **NFR-004**: The workflow MUST be applicable across common repository types without assuming a
  specific language, framework, database, deployment platform, or test runner.
- **NFR-005**: The skill MUST use neutral language for all tool references — no AI
  provider-specific tool names, API behaviors, or model-specific assumptions in the skill guidance.
- **NFR-006**: The skill MUST minimize token consumption: no padded prose, no redundant context
  re-stated from project config, no free-form report generation when a template exists.

## Key Entities

- **RCA Skill**: The reusable AnchorStack skill that guides root cause analysis investigations.
- **Failure Symptom**: The externally observed issue reported by the user or surfaced by tests,
  logs, metrics, or application behavior.
- **Failure Point**: The specific location or condition where the system behavior first becomes
  incorrect.
- **Causation Chain**: The ordered explanation from symptom to failure point to upstream causes.
- **Root Cause Driver**: The deepest actionable cause category that explains why the failure became
  possible.
- **RCA Report**: The persisted investigation output (generated from the report template) containing
  evidence, reasoning, fix guidance, and prevention guidance. Written to `context/rca/`.

## Success Criteria *(mandatory)*

- **SC-001**: In review against at least three representative broken-app scenarios, the skill drives
  the investigator past the first symptom or failing code location to a documented upstream cause.
- **SC-002**: In each representative scenario, the report clearly labels the symptom, failure point,
  root cause driver, contributing factors, fix, and prevention recommendation.
- **SC-003**: When the input evidence is incomplete, the skill asks targeted clarifying questions
  before investigation and identifies any remaining evidence gaps in the report.
- **SC-004**: The skill is discoverable through the repository's skill registry (`skills.json`) and
  documentation (`README.md`).
- **SC-005**: A reviewer can determine from the report why the recommended fix addresses the failure
  class rather than only the immediate symptom.
- **SC-006**: The report contains no secrets, credentials, or sensitive values — even when such
  values were visible in files or logs inspected during investigation.
- **SC-007**: The skill runs without modification on at least two different LLM providers/toolchains.

## Assumptions

- The target repository is `anchorstack-skills`.
- The existing `as-rca` skill in the repo, if present, is the intended artifact to update or
  validate rather than creating a duplicate.
- The report location follows the AnchorStack convention of writing durable output to `context/rca/`
  using a dated filename.
- The skill supports both human-guided investigations (conversational) and automated repository
  exploration by any LLM-based toolchain.
- The RCA report template will be co-located with the skill or stored in `.specify/templates/` if a
  general template is appropriate across skills.

## Out of Scope

- Automatically fixing the diagnosed issue.
- Building a separate RCA application, CLI, or service.
- Defining a language-specific debugging workflow for one stack.
- Replacing specialized security, compliance, lint, type-check, or test skills.
- Capturing or redacting secrets found during investigation (the skill MUST exclude them, not
  attempt to manage them).
