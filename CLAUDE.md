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

Finish pipeline: as-sync → as-lint → as-secret-scan → as-security-scan → as-retro → as-commit → as-pr. Configured at `.claude/anchorstack/finish.md`.

<!-- Project-specific notes. as-retro will add to this over time. -->

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan at
specs/ANC-201-create-rca-skill/plan.md
<!-- SPECKIT END -->
