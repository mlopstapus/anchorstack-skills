# Skill Contract: as-rca

**Type**: AnchorStack Universal Skill
**Version**: 3.0.0
**Artifact**: `universal/rca/SKILL.md`

---

## Inputs

| Input | Required | Source | Description |
|-------|----------|--------|-------------|
| Symptom description | Yes | User message / invocation context | Natural language description of the broken behavior |
| `.claude/anchorstack/project.md` | No | Filesystem | Project config (stack, rebuild command). Read if present; degraded gracefully if absent. |
| Evidence artifacts | No | User-provided | Logs, stack traces, test output, error messages |

---

## Outputs

| Output | Location | Format | Description |
|--------|----------|--------|-------------|
| RCA Report | `context/rca/YYYY-MM-DD-<slug>.md` | Markdown | Full investigation report including causation chain, root cause, fix, and prevention |

The `context/rca/` directory is created if it does not exist.

---

## Behavior Contract

### Preconditions

- A symptom description MUST be available (from user or conversation context)
- No other preconditions — the skill degrades gracefully for all optional inputs

### Invariants

- The skill MUST NOT modify, delete, or write any project files except the RCA report output
- The skill MUST NOT include secrets, credentials, tokens, or sensitive values in the report
- The skill MUST ask clarifying questions before investigation when critical context is absent
- The skill MUST read `.claude/anchorstack/project.md` if present, before asking about project context

### Postconditions

- An RCA report exists at `context/rca/YYYY-MM-DD-<slug>.md`
- The report contains: what broke, causation chain, root cause (with category), contributing
  factors, fix recommendation, prevention recommendation
- Uncertainty is explicitly labeled if evidence was insufficient to confirm the root cause

### Error / Degradation Behavior

| Condition | Behavior |
|-----------|----------|
| Cannot reproduce locally | Proceed on available evidence; note limitation in report |
| Incomplete symptom description | Ask targeted clarifying questions; do not proceed without a clear failure description |
| No `.claude/anchorstack/project.md` | Skip project config loading; continue investigation without it |
| Secrets visible in inspected files | Exclude from report; note that sensitive values were encountered but omitted |
| Causation chain branches | Document all branches; identify primary root cause and secondary contributing causes |

---

## Composability

**Produces output consumed by**: Any skill or workflow that reads `context/rca/` artifacts
(e.g., post-incident review, backlog prioritization)

**Consumes output from**: `as-setup-project` (via `project.md`)

**Registry**: Declared in `skills.json` as `{ "name": "as-rca", "path": "universal/rca", "tier": "universal" }`
