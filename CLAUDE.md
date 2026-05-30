# anchorstack-skills

Composable Claude Code skill library for Anchorstack contracting methodology. Node.js CLI tool (ESM).

## Key commands

| Command | Run |
|---------|-----|
| Test | `npm test` |

## Notes

No linter or type checker configured — `as-lint` and `as-type-check` will skip on this project.

Skills are organised by tier: `universal/`, `components/`, `configurable/`, `setup/`. Each skill is a single `SKILL.md` file.

Feature development follows the speckit workflow: `speckit-constitution` → `speckit-specify` → `speckit-plan` → `speckit-tasks` → `speckit-implement`.

Finish pipeline: as-sync → npm test → as-lint → as-secret-scan → as-security-scan → as-retro → as-commit → as-pr. Configured at `.claude/anchorstack/finish.md`.

## Skill authoring rules

SKILL.md frontmatter allows only four keys: `name`, `version`, `tier`, `description`. Extra keys (e.g. `inputs`, `outputs`) break the skills package parser and cause the skill to be skipped during `npx skills add`. `npm test` (= `scripts/validate-skills.js`) enforces this — it will exit 1 if any unknown key is present.

After editing a skill source in `universal/`, `components/`, `configurable/`, or `setup/`, run `npm run sync` to copy the updated SKILL.md into `.claude/skills/<name>/`. The installer reads from `.claude/skills/`, not the source directory.

<!-- Project-specific notes. as-retro will add to this over time. -->

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan at
specs/ANC-201-create-rca-skill/plan.md
<!-- SPECKIT END -->
