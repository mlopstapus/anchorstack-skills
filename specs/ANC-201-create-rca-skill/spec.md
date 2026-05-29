# Feature Specification: RCA Skill

**Feature Branch**: `spec/ANC-201-create-rca-skill`  
**Created**: 2026-05-29  
**Status**: Draft  
**Input**: Issue ANC-201: "We want a skill that does root cause analysis on issues in a repo. We are not just looking for superficial issues we are looking for what is driving the issues. Is it a data problem, a workflow problem, a code structure problem? We ask questions to understand the issue then dive in to find out what is wrong exploring different aspects of the code base. This should live in the anchorstack-skills repo."

## User Scenarios & Testing

### Primary User Story

As an engineer or technical lead with a broken or suspicious application behavior, I want to invoke an AnchorStack RCA skill that interviews me for the missing failure context, investigates the repository empirically, and reports the underlying cause category and causation chain so I can fix the driver of the issue instead of applying a superficial patch.

### Acceptance Scenarios

1. **Given** a user reports a broken behavior with incomplete context, **When** the RCA skill starts, **Then** it asks only the most relevant missing questions needed to understand the symptom, timing, reproducibility, environment, and available evidence.
2. **Given** a user provides logs, stack traces, failing tests, or reproduction notes, **When** the RCA skill investigates, **Then** it traces from the observed symptom to the failure point and then upstream through data, workflow, architecture, code structure, configuration, dependency, and process causes as applicable.
3. **Given** the first discovered bug is only a downstream consequence, **When** the RCA skill evaluates it, **Then** it continues asking "what is causing this?" until it reaches a defensible root cause or clearly documents why the investigation cannot go deeper.
4. **Given** the investigation identifies multiple independent contributing causes, **When** the RCA skill writes the report, **Then** it separates the root cause from contributing factors and explains how each factor affected the failure.
5. **Given** the skill cannot reproduce the issue locally, **When** adequate evidence exists from user-provided artifacts, **Then** it proceeds from that evidence while explicitly noting the reproduction limitation.

### Edge Cases

- The user provides only a vague symptom and no logs or reproduction steps.
- The failure is intermittent, data-dependent, or environment-specific.
- The issue is caused by a non-code driver such as a flawed workflow, unclear ownership, missing validation, incomplete observability, or bad data assumptions.
- The repository has multiple apps, services, packages, or data paths that may participate in the failure.
- Investigation finds the immediate fix but also reveals a broader prevention gap.

## Requirements

### Functional Requirements

- **FR-001**: The skill MUST start by establishing the reported symptom, observed behavior, expected behavior, timing, reproducibility, environment, and available evidence when those facts are not already present.
- **FR-002**: The skill MUST avoid form-style questioning when context is already obvious; it should ask targeted follow-up questions only for missing information that materially affects the investigation.
- **FR-003**: The skill MUST attempt to reproduce the failure or, when reproduction is impossible, state the evidence source it is using instead.
- **FR-004**: The skill MUST inspect the repository around the failure path rather than relying solely on the user's description.
- **FR-005**: The skill MUST identify the concrete failure point before declaring a root cause.
- **FR-006**: The skill MUST trace causes upstream from the failure point and continue until reaching a root cause that is a decision, assumption, design gap, data contract gap, workflow gap, validation gap, observability gap, or ownership gap.
- **FR-007**: The skill MUST classify the root cause driver using clear categories such as data, workflow, code structure, architecture, configuration, dependency, test coverage, process, or observability.
- **FR-008**: The skill MUST distinguish symptoms, failure points, contributing factors, root causes, fixes, and prevention measures.
- **FR-009**: The skill MUST produce a written RCA report in the project's shared context area using a predictable dated filename.
- **FR-010**: The report MUST include what broke, the causation chain, the root cause, contributing factors, recommended fix, and prevention recommendation.
- **FR-011**: The skill MUST state uncertainty explicitly when evidence is insufficient and identify the next evidence needed rather than inventing a root cause.
- **FR-012**: The skill MUST be registered and discoverable as an AnchorStack skill in the skills repository.

### Non-Functional Requirements

- **NFR-001**: The skill guidance MUST be understandable to an agent or engineer without prior AnchorStack-specific context beyond the repository's normal skill conventions.
- **NFR-002**: The skill MUST favor empirical evidence over speculation and make clear when an inference is based on available evidence rather than direct reproduction.
- **NFR-003**: The resulting RCA report MUST be concise enough for handoff while preserving the causal reasoning needed to audit the conclusion.
- **NFR-004**: The workflow MUST be applicable across common repository types without assuming a specific language, framework, database, deployment platform, or test runner.

## Key Entities

- **RCA Skill**: The reusable AnchorStack skill that guides root cause analysis investigations.
- **Failure Symptom**: The externally observed issue reported by the user or surfaced by tests, logs, metrics, or application behavior.
- **Failure Point**: The specific location or condition where the system behavior first becomes incorrect.
- **Causation Chain**: The ordered explanation from symptom to failure point to upstream causes.
- **Root Cause Driver**: The deepest actionable cause category that explains why the failure became possible.
- **RCA Report**: The persisted investigation output containing evidence, reasoning, fix guidance, and prevention guidance.

## Success Criteria

- **SC-001**: In review against at least three representative broken-app scenarios, the skill drives the investigator past the first symptom or failing code location to a documented upstream cause.
- **SC-002**: In each representative scenario, the report clearly labels the symptom, failure point, root cause driver, contributing factors, fix, and prevention recommendation.
- **SC-003**: When the input evidence is incomplete, the skill asks targeted clarifying questions before investigation and identifies any remaining evidence gaps in the report.
- **SC-004**: The skill remains discoverable through the repository's skill registry and documentation.
- **SC-005**: A reviewer can determine from the report why the recommended fix addresses the failure class rather than only the immediate symptom.

## Assumptions

- The target repository is `anchorstack-skills`.
- The existing `as-rca` skill, if present, is the intended artifact to update or validate rather than creating a duplicate RCA skill.
- The skill should support both user-guided investigations and agent-driven local repository exploration.
- The report location should follow the existing AnchorStack convention of writing durable investigation output to the project's shared `context/` area.

## Out of Scope

- Automatically fixing the diagnosed issue.
- Building a separate RCA application, CLI, or service.
- Defining a language-specific debugging workflow for one stack.
- Replacing specialized security, compliance, lint, type-check, or test skills.
