---
description: "Task list for ANC-201: Update as-rca skill to v3.0.0"
---

# Tasks: RCA Skill (ANC-201)

**Input**: Design documents from `/specs/ANC-201-create-rca-skill/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Not requested — validated manually via quickstart.md scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story. All implementation tasks edit `universal/rca/SKILL.md`.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- File paths included in all implementation descriptions

---

## Phase 1: Setup

**Purpose**: Confirm starting state before editing.

- [x] T001 Read `universal/rca/SKILL.md` in full and confirm: (a) version is 2.0.0, (b) no `inputs`/`outputs` fields in frontmatter, (c) Phase 3 has no secrets note, (d) Phase 6 template uses prose placeholders not `[ALL_CAPS]`

**Checkpoint**: Starting state confirmed — implementation can begin.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Changes that both user stories depend on — security posture and composability
declarations. MUST be complete before US1 and US2 phases.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 Update frontmatter in `universal/rca/SKILL.md`: bump `version` to `3.0.0`; add `inputs` field listing `symptom_description` (required), `project_config` (optional, `.claude/anchorstack/project.md`), and `evidence` (optional); add `outputs` field with `rca_report: context/rca/YYYY-MM-DD-<slug>.md`
- [x] T003 Add secrets-exclusion security note in Phase 3 of `universal/rca/SKILL.md` immediately after the instruction to read relevant files: "**Security**: If you encounter secrets, credentials, API keys, tokens, or other sensitive values while reading files — do not include them in the report. Note that sensitive values were encountered and omitted if relevant to the investigation."
- [x] T004 Add secrets verification item to the Phase 5 checklist in `universal/rca/SKILL.md` as item 4: "**The secrets check:** Review what you're about to include in the report. Any secret, credential, or token encountered during investigation MUST be omitted."

**Checkpoint**: Foundation ready — both user story phases can now begin.

---

## Phase 3: User Story 1 — Investigate Broken Behavior (Priority: P1) 🎯 MVP

**Goal**: Complete investigation flow — from symptom through causation chain to a written report
that uses the template pattern and correct output path.

**Independent Test**: Invoke the skill with the Scenario 1 inputs from `quickstart.md`. Verify
the report appears at `context/rca/YYYY-MM-DD-login-401.md` with all six sections filled and no
secret values present.

### Implementation for User Story 1

- [x] T005 [US1] Update Phase 4 of `universal/rca/SKILL.md` — add `process` and `observability` to the root cause category list (currently ends at `test coverage`)
- [x] T006 [US1] Replace the Phase 6 report template in `universal/rca/SKILL.md` with the placeholder-driven version: change output path from `context/rca-<YYYY-MM-DD>-<slug>.md` to `context/rca/[YYYY-MM-DD]-[SLUG].md`; replace all prose placeholder descriptions with `[ALL_CAPS_IDENTIFIER]` tokens: `[FAILURE_DESCRIPTION]`, `[DATE]`, `[STATUS]`, `[WHAT_BROKE]`, `[CAUSATION_CHAIN]`, `[ROOT_CAUSE_STATEMENT]`, `[ROOT_CAUSE_EXPLANATION]`, `[CONTRIBUTING_FACTORS]`, `[FIX_RECOMMENDATION]`, `[PREVENTION_RECOMMENDATION]`; update the instruction line above the template to say "Create `context/rca/` if it doesn't exist"

**Checkpoint**: User Story 1 complete — full investigation-to-report flow works with template
output. Validate with quickstart.md Scenario 1 before moving to US2.

---

## Phase 4: User Story 2 — Incomplete Evidence Handling (Priority: P2)

**Goal**: When evidence is incomplete, the skill explicitly surfaces what is missing and labels
inferences clearly in the report.

**Independent Test**: Invoke the skill with Scenario 2 inputs from `quickstart.md` ("The app is
slow sometimes"). Verify the skill asks targeted questions before investigating, and the resulting
report labels uncertain conclusions and identifies the next evidence step.

### Implementation for User Story 2

- [x] T007 [US2] Strengthen Phase 2 of `universal/rca/SKILL.md` — after "Note that you couldn't reproduce locally", add explicit guidance: "In your report, label any conclusion derived from unconfirmed evidence as *inferred* rather than confirmed. Identify the specific evidence that would confirm or refute the inference."
- [x] T008 [US2] Add an **Evidence Gaps** section to the Phase 6 report template in `universal/rca/SKILL.md` between Contributing Factors and Fix: include `[EVIDENCE_GAPS]` placeholder with guidance "List any evidence that was missing during this investigation and what it would have confirmed. Use 'None — reproduction confirmed' if the failure was fully reproduced." Add `[CONFIDENCE_LEVEL]` to the Status line options: `Investigating | Root cause identified (confirmed) | Root cause identified (inferred) | Resolved`

**Checkpoint**: User Story 2 complete — both stories independently testable.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validation and quality gates.

- [x] T009 Validate updated `universal/rca/SKILL.md` against quickstart.md Scenario 1 (complete context / happy path) — invoke skill mentally with the login-401 scenario and confirm: report path matches `context/rca/` convention, all six + evidence-gaps sections present, no secrets in output
- [x] T010 Validate against quickstart.md Scenario 2 (incomplete context) — invoke skill with "app is slow sometimes" and confirm: targeted questions asked before investigation, conclusions labeled as inferred, evidence gaps noted in report
- [x] T011 Validate against quickstart.md Scenario 3 (non-code root cause) — confirm skill reaches a non-code root cause category and prevention is not another code fix
- [x] T012 [P] Run `/as-secret-scan` on `universal/rca/SKILL.md` to confirm no sensitive values were introduced
- [x] T013 [P] Verify `skills.json` entry for `as-rca` is correct — path `universal/rca`, tier `universal` (no version field tracked there; no update needed)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup confirmation — BLOCKS both user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion; may integrate with US1 template changes
- **Polish (Phase 5)**: Depends on all implementation phases complete

### Within Each Phase

- T002, T003, T004 in Phase 2 are sequential (all edit the same file)
- T005, T006 in Phase 3 are sequential (same file, T006 depends on T005's taxonomy being set)
- T007, T008 in Phase 4 are sequential (same file, T008 extends T006's template from Phase 3)
- T009, T010, T011 in Phase 5 are sequential validations
- T012, T013 in Phase 5 are parallelizable (different operations, no shared state)

### Parallel Opportunities

- Once Phase 2 is complete, US1 and US2 phases CAN be worked by different people (different
  sections of the same file) but should be serialized for a single implementer to avoid conflicts
- T012 and T013 in Polish can run concurrently

---

## Parallel Example: Polish Phase

```bash
# These two can run concurrently:
Task T012: "Run /as-secret-scan on universal/rca/SKILL.md"
Task T013: "Verify skills.json entry for as-rca"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (read/confirm T001)
2. Complete Phase 2: Foundational (T002–T004)
3. Complete Phase 3: User Story 1 (T005–T006)
4. **STOP and VALIDATE**: Run quickstart.md Scenario 1 (T009)
5. The skill is constitution-compliant and fully functional for complete-context investigations

### Incremental Delivery

1. Foundational → both stories benefit from security hardening and composability declarations
2. US1 complete → full investigation flow with template output (MVP)
3. US2 complete → evidence gap handling explicit in guidance and report
4. Polish → validated and secret-scanned

---

## Notes

- All implementation tasks touch `universal/rca/SKILL.md` only — no new files added
- [P] tasks in Polish phase = different operations, no file conflicts
- [US1]/[US2] labels map to user stories in `spec.md`
- Validate each story independently using scenarios in `quickstart.md` before moving to next phase
- Commit after Phase 2 and after each user story phase
