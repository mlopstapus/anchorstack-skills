# Research: RCA Skill (ANC-201)

**Branch**: `001-create-rca-skill` | **Date**: 2026-05-30
**Spec**: [spec.md](spec.md)

## Decision 1: Update vs. Create

**Decision**: Update the existing `universal/rca/SKILL.md` (v2.0.0 → v3.0.0).
**Rationale**: The skill already exists and is registered in `skills.json`. The spec's assumption
confirms it should be updated. Creating a duplicate would violate the composability principle
(stable output locations, no drift).
**Alternatives considered**: Creating a new skill at a different path — rejected because it
creates a registry conflict and breaks installations that already reference `as-rca`.

## Decision 2: Template location — inline vs. `.specify/templates/`

**Decision**: Keep the report template inline in SKILL.md, updating it to use `[ALL_CAPS]` placeholders.
**Rationale**: The constitution's template-driven principle applies to speckit workflow outputs
(specs, plans, tasks). Skill-embedded templates are a different pattern: they travel with the
skill and must be self-contained. Moving the template to `.specify/templates/` would break skills
installed without the speckit toolchain. The spec (FR-010) says "skill's bundled RCA report
template" — confirming inline.
**Alternatives considered**: External template in `.specify/templates/rca-report-template.md` —
rejected because skills must be self-contained per composability principle.

## Decision 3: Report output path — `context/` flat vs. `context/rca/` subdirectory

**Decision**: Move report output to `context/rca/` (subdirectory).
**Rationale**: The spec (FR-009) explicitly states `context/rca/`. A subdirectory isolates RCA
reports from other context artifacts (architecture decisions, tenets, etc.) and makes the output
location predictable for downstream skills that read RCA reports.
**Alternatives considered**: Keep flat at `context/rca-<slug>.md` — rejected because the spec
explicitly requires the subdirectory, and it's the cleaner structure for a library that produces
multiple artifact types.

## Decision 4: Secrets exclusion — passive note vs. active phase

**Decision**: Add an explicit security note in Phase 3 (Find the failure point) where secrets
are most likely to be encountered, and add a checklist item to Phase 5 (Verify) and Phase 6
(Write report). Do not create a new investigation phase.
**Rationale**: A new phase would add tokens and cognitive overhead. A targeted note at the most
relevant moment (file reading) with a final-check reminder is token-efficient and sufficient.
**Alternatives considered**: A dedicated "secrets scrub" phase — rejected as overkill for a
skill that reads files in natural language context; a note in Phase 6 only — rejected because
the intervention point should be at discovery, not only at writing.

## Decision 5: Frontmatter extensions for composability

**Decision**: Add `inputs` and `outputs` fields to the YAML frontmatter.
**Rationale**: FR-019 requires explicit input/output declarations. Frontmatter is the correct
location (machine-readable, skills-framework convention). These fields let downstream skills and
skill-install tooling know what the skill consumes and produces without reading the full content.
**Alternatives considered**: Document inputs/outputs in prose at the top of the skill — rejected
because prose is not machine-readable and doesn't serve the composability goal.

## Decision 6: Root cause driver taxonomy

**Decision**: Keep the existing seven-category taxonomy (data, workflow, code structure,
architecture, configuration, dependency, test coverage) and add two from the spec: process and
observability.
**Rationale**: The spec (FR-007) explicitly lists both. The existing skill omits them. Adding
them extends coverage without breaking the existing taxonomy.
**Alternatives considered**: Rewriting taxonomy completely — rejected as unnecessary churn.
