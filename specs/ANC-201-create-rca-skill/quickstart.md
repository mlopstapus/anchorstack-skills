# Quickstart: as-rca Skill Validation

**Branch**: `001-create-rca-skill` | **Date**: 2026-05-30

Use this to verify the updated `as-rca` skill works correctly after implementation.

---

## Setup

Ensure the skill is installed in `.claude/skills/as-rca/` or is being read directly from
`universal/rca/SKILL.md` in development.

---

## Scenario 1 — Complete context (Happy path)

**Invoke**: Start a new session and describe a broken behavior with full context:

> "The login endpoint returns 401 for all users since this morning's deploy. Error logs show
> `JWT_SECRET undefined`. It's reproducible every time in staging."

**Expected behavior**:
1. Skill checks `project.md` for rebuild/run commands (or notes it's absent)
2. Skill proceeds directly to reproduction (context is complete — no questions needed)
3. Skill inspects environment config and relevant code around JWT validation
4. Skill produces a causation chain ending at a root cause with a category label
5. Report is written to `context/rca/YYYY-MM-DD-login-401.md`
6. Report contains all six sections and no secret values

**Verify**:
- [ ] Report file exists at expected path
- [ ] Report includes causation chain, root cause category, fix, and prevention
- [ ] No `.env` values, tokens, or credentials appear in report text

---

## Scenario 2 — Incomplete context (Evidence gap handling)

**Invoke**:

> "The app is slow sometimes."

**Expected behavior**:
1. Skill asks targeted questions to establish: what operation is slow, when it started,
   how reproducible it is, and what evidence is available
2. After answers, skill investigates available code and config paths
3. If evidence remains insufficient, report clearly labels conclusions as inferred
4. Report identifies the next evidence needed

**Verify**:
- [ ] Skill asked clarifying questions before investigating
- [ ] Report does not invent a confident root cause without evidence
- [ ] Report includes "evidence gap" note if uncertainty remains

---

## Scenario 3 — Non-code root cause

**Invoke**:

> "Users keep submitting invalid data and the app crashes. We've fixed the validation three
> times but it keeps happening."

**Expected behavior**:
1. Skill traces past the validation code to the upstream cause
2. Skill identifies the root cause category as one of: workflow, process, or observability
3. Fix recommendation addresses the class of failure, not just the latest validation bug

**Verify**:
- [ ] Root cause category is NOT "code structure" (the fix kept being code patches)
- [ ] Prevention recommendation is not another code fix
- [ ] Causation chain reaches a non-code driver

---

## Post-verification

After all three scenarios pass:
- [ ] Update skill version to `3.0.0` in frontmatter
- [ ] Run `/as-secret-scan` on the updated SKILL.md
- [ ] Update `skills.json` version field if it tracks versions
