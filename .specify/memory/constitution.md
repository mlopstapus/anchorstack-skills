<!--
SYNC IMPACT REPORT
==================
Version change: [template] → 1.0.0
Bump rationale: MINOR — first population of all principles and sections from blank template state.

Modified principles:
  [PRINCIPLE_1_NAME] → I. Security by Default
  [PRINCIPLE_2_NAME] → II. Token Efficiency
  [PRINCIPLE_3_NAME] → III. Provider-Agnostic Design
  [PRINCIPLE_4_NAME] → IV. Template-Driven Patterns
  [PRINCIPLE_5_NAME] → V. Skill Composability

Added sections:
  Quality Standards
  Skill Authoring Workflow

Removed sections:
  None

Templates:
  ✅ .specify/templates/plan-template.md — Constitution Check section is generic (no updates needed)
  ✅ .specify/templates/spec-template.md — No agent-specific or principle-conflicting references
  ✅ .specify/templates/tasks-template.md — Skill command references are product names, not provider-specific

Deferred TODOs:
  None — all placeholders resolved.
-->

# anchorstack-skills Constitution

## Core Principles

### I. Security by Default

Skills MUST never expose, log, or transmit secrets, credentials, or sensitive data.
Skills MUST sanitize all inputs that flow into shell commands, file paths, or external API calls.
Skills MUST flag security regressions as blocking findings and MUST pass `as-security-scan` before merge.
Destructive operations MUST require explicit user confirmation — no silent side effects.

**Rationale**: Skills execute autonomously on user codebases. A compromised or careless skill has
blast radius across every project that installs it.

### II. Token Efficiency

Skills MUST minimize token consumption: no redundant context, no padded prose, no re-stating
information already available in the conversation or project config.
Prompts MUST be targeted — request only what is needed for the immediate task.
Templates MUST use placeholders rather than inline examples that inflate every invocation.
Skills MUST read shared config from `.claude/anchorstack/project.md` instead of re-detecting
context that has already been captured.

**Rationale**: Token cost is a first-class concern. Wasteful skills degrade user experience and
price out smaller models and tighter budgets.

### III. Provider-Agnostic Design

Skills MUST NOT rely on Claude-specific API behaviours, tool names, or model capabilities unless
the skill is explicitly and visibly scoped to a single provider (declared in its frontmatter).
Skills MUST use neutral language for tool references wherever possible.
Skill outputs MUST be plain Markdown processable by any LLM toolchain.
Agent-specific names (CLAUDE, GPT, Gemini) MUST NOT appear in generic guidance sections.

**Rationale**: The Anchorstack skill library serves teams using multiple AI providers. A skill
that only works on one platform halves its value and creates lock-in.

### IV. Template-Driven Patterns

Skills MUST use templates for all structured outputs (specs, plans, tasks, constitutions).
Templates MUST live in `.specify/templates/` and be referenced rather than duplicated inline.
New skills producing structured documents MUST extend an existing template pattern rather than
invent ad hoc formats.
Template placeholders MUST follow the `[ALL_CAPS_IDENTIFIER]` convention for consistency.

**Rationale**: Templates enforce consistency across features and make outputs machine-readable
for downstream skills. Duplication creates drift; a single canonical template does not.

### V. Skill Composability

Skills MUST produce outputs that other skills can consume as inputs (chained workflows).
Skills MUST declare their dependencies, expected inputs, and output artifacts explicitly.
Skills MUST degrade gracefully — if a prerequisite is missing, explain and continue where safe
rather than failing silently or aborting without guidance.
Cross-skill data MUST flow through stable file conventions (`project.md`, `spec.md`, `plan.md`,
`tasks.md`) rather than ephemeral state.

**Rationale**: The value of a skill library compounds when skills compose. A skill that cannot
be chained is a dead end; one that degrades gracefully extends reach to partial environments.

## Quality Standards

Skills in this repository are production artifacts — they execute autonomously on user codebases.
The following gates apply to all skills before merge:

- Skills MUST pass `as-security-scan` (no secrets exposure, no injection vectors).
- Skills MUST include a clear `description` field and usage trigger in their frontmatter.
- Skills MUST NOT perform destructive operations without explicit user confirmation.
- Token budgets MUST be considered in every skill revision — removing unnecessary context is
  as valuable as adding a feature.
- Skills MUST be reviewed against all five Core Principles before a PR is opened.

## Skill Authoring Workflow

New skills follow this process:

1. Specify intent and trigger conditions in a feature spec (`speckit-specify`).
2. Plan structure and template dependencies (`speckit-plan`).
3. Implement using an existing template as the base where one exists.
4. Pass `as-security-scan` and `as-lint` before opening a PR.
5. Update `skills.json` and `README.md` to register the new skill.

Amendments to existing skills MUST include a rationale comment in the PR description citing
which principle the change serves. Amendments that weaken a principle require a constitution
update first.

## Governance

This constitution supersedes all other practices in this repository.

**Amendment procedure**: Any amendment requires (a) a documented rationale referencing at
least one principle, (b) an incremented `CONSTITUTION_VERSION`, (c) an updated
`LAST_AMENDED_DATE`, and (d) all dependent templates reviewed for consistency via
`speckit-constitution`.

**Version policy**:
- MAJOR: A principle is removed or its core requirement materially weakened.
- MINOR: A new principle or mandatory section is added or materially expanded.
- PATCH: Wording clarifications, typo fixes, non-semantic refinements.

**Compliance review**: Verified at the start of every feature branch via `speckit-constitution`.
All PRs MUST confirm adherence to the five Core Principles before approval.

**Version**: 1.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
