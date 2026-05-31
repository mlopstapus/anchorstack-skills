# RCA: as-rca skill not installing via npx skills add

**Date:** 2026-05-30
**Status:** Resolved (root cause confirmed via reproduction)

## What broke

Running `npx skills add mlopstapus/anchorstack-skills` installs all 16 other skills but skips `as-rca`. The skill is present in the repo and pushed to `main` but does not appear after install.

## Causation chain

`as-rca` not visible after install
  ↓ caused by
Skills package `parseSkillMd()` silently returns `null` on any exception — no error surface
  ↓ caused by
`yaml.parse()` throws "Nested mappings are not allowed in compact mappings" on the frontmatter
  ↓ caused by
The `description` field contains `obvious: errors` — a colon-space (`: `) in an unquoted YAML scalar, which the YAML parser interprets as a nested key-value mapping
  ↓ caused by
**ROOT CAUSE: The `as-rca` description was written as natural English prose containing a colon-space (`: `), which is invalid inside an unquoted YAML scalar value. The skills package's `parseSkillMd()` catches the resulting parse error silently, so the skill is skipped with no warning.**

## Root cause

A colon followed by a space (`: `) inside an unquoted YAML scalar value is a syntax error in strict YAML parsers — it reads as the start of a nested mapping key. The `as-rca` description contained `"the cause isn't obvious: errors, crashes..."`. The skills package uses the `yaml` npm package (strict mode), which threw on this. `parseSkillMd()` wraps the entire parse in a `try/catch` that returns `null` silently, so the skill was dropped from the install list with no visible error. This is a **process** root cause: the skill description was not validated against YAML syntax constraints before merging, and the silent failure mode made it impossible to diagnose from install output alone.

## Prior investigations (incorrect)

Two earlier fixes were applied based on inference without confirmed reproduction:
1. `13c7657` — fixed install path using skill name vs path segment (real bug, but not the cause of the skip)
2. `390f81d` — flattened multi-line `inputs`/`outputs` YAML lists to single strings (the multi-line YAML was also a real YAML syntax error, but after removal `as-rca` still wasn't installing)

The actual root cause (colon-space in description) was only found by reading the skills package source and running `yaml.parse()` against the frontmatter directly.

## Contributing factors

- `parseSkillMd()` swallows all exceptions with a bare `catch { return null }` — there is no way to distinguish "skill not found" from "skill found but failed to parse"
- The `as-rca` description was unusually long and prose-heavy compared to other skills, making it more likely to contain natural-language punctuation that conflicts with YAML

## Evidence gaps

None — root cause confirmed by directly reproducing the `yaml.parse()` error and verifying the fix resolves it in a fresh install.

## Fix

Replace `obvious: errors, crashes` with `obvious (errors, crashes` in the description, eliminating the colon-space. Commit `c0e1674`.

## Prevention

1. Update `scripts/validate-skills.js` (`npm test`) to verify each description parses cleanly through `yaml.parse()` — not just that the key set is valid, but that the full frontmatter round-trips without error. This would have caught the colon-space before merge.
2. CONTRIBUTING.md should note that description values must not contain `: ` (colon-space) unless the entire value is quoted.
