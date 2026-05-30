# RCA: as-rca skill not installing via npx skills add

**Date:** 2026-05-30
**Status:** Root cause identified (inferred — parser behaviour not locally reproduced)

## What broke

Running `npx skills add mlopstapus/anchorstack-skills` (or equivalent) installs all 16 other skills but skips `as-rca`. The skill is present in the repo and pushed to `main` but does not appear in the user's `.claude/skills/` after install.

## Causation chain

`as-rca` not visible after install
  ↓ caused by
Skills package installer scans `.claude/skills/` in the repo; `as-rca` was only in `universal/rca/` and never copied there (fixed in `d8f6ac4`)
  ↓ caused by
Even after the sync fix, `as-rca` was still skipped
  ↓ caused by
`as-rca/SKILL.md` contained multi-line YAML list syntax for `inputs` and `outputs` fields, which broke the skills package frontmatter parser (fixed in `390f81d`)
  ↓ caused by
**ROOT CAUSE: `as-rca` was created with non-standard frontmatter fields (`inputs`, `outputs`) that no other skill in the repo has, violating the schema defined in CONTRIBUTING.md (`name`, `version`, `tier`, `description` only). The multi-line YAML form of those fields broke the parser; the fields themselves remain non-standard.**

## Root cause

`as-rca`'s SKILL.md frontmatter includes `inputs` and `outputs` keys that are absent from every other skill and from the CONTRIBUTING.md schema. The original multi-line YAML list syntax for these fields was confirmed to break the skills package parser. The fix flattened them to single strings, but whether the parser tolerates unknown keys at all is unconfirmed — no post-fix reproduction was run. This is a **code structure** root cause: the skill was authored against an unofficial, extended schema rather than the project's documented frontmatter spec.

## Contributing factors

- No validation or CI check enforces frontmatter schema compliance, so the deviation went undetected until install failed
- The `inputs`/`outputs` fields carry no runtime value — the skill is invoked by the model reading the description, not by parsing declared inputs

## Evidence gaps

- Actual behaviour of the skills package parser against flat (non-list) unknown keys is unknown — parser source not inspected
- No confirmed reproduction after `390f81d`; the fix may be sufficient, or `inputs`/`outputs` may still cause skipping

## Fix

Remove `inputs` and `outputs` from `universal/rca/SKILL.md` and `.claude/skills/as-rca/SKILL.md`. They are undocumented, unique to `as-rca`, and add no functional value. Run `npm run sync` to keep copies in sync.

## Prevention

Add a CI check (or a pre-commit hook) that validates each `SKILL.md` in `.claude/skills/` against the documented frontmatter schema: `name`, `version`, `tier`, `description` — warn on unknown keys. This would have caught the deviation before the PR was merged.
