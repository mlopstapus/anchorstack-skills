---
name: anchorstack-finish
version: 1.0.0
tier: configurable
dependencies:
  - anchorstack-setup-finish
description: Execute the project's finish pipeline — reads .claude/anchorstack/finish.md and runs each step in order.
---

# Finish

Execute the finish pipeline configured for this project. The pipeline is defined in `.claude/anchorstack/finish.md` and is set up by running `anchorstack-setup-finish`.

## Step 1 — Load pipeline config

Read `.claude/anchorstack/finish.md`. If it does not exist:
- Tell the user the finish pipeline has not been configured for this project
- Ask if they want to run `setup-finish` now

Parse the YAML `steps` array from the file.

## Step 2 — Show pipeline

Print the steps that will run before starting:

```
Finish pipeline (5 steps):
  1. invoke: sync
  2. invoke: hipaa-check
  3. invoke: type-check
  4. run: npm test
  5. invoke: tech-debt-audit
```

Ask: proceed?

## Step 3 — Execute each step

Run steps in order. For each step:

### `invoke: <skill-name>`

Execute the named skill by reading its `SKILL.md` and following its instructions completely. The skill must complete before moving to the next step.

If the skill reports a failure, stop the pipeline and report:
```
✗ Pipeline halted at step N (invoke: <skill-name>)
Reason: <what the skill reported>
```

Do not continue to subsequent steps after a failure unless the user explicitly says to skip and continue.

### `run: <shell command>`

Execute the shell command:
```bash
<command>
```

Capture stdout and stderr. A non-zero exit code is a failure — stop the pipeline and report the command output.

## Step 4 — Report

On full success:
```
✓ Finish pipeline complete — all N steps passed

  1. ✓ sync
  2. ✓ hipaa-check
  3. ✓ type-check
  4. ✓ npm test
  5. ✓ tech-debt-audit
```

On failure:
```
✗ Finish pipeline failed at step N

  1. ✓ sync
  2. ✓ hipaa-check
  3. ✗ type-check — 4 type errors found (see above)
  4. — npm test (skipped)
  5. — tech-debt-audit (skipped)
```

## Notes

- Read `.claude/anchorstack/project.md` before starting so invoked skills have project context available
- Each invoked skill should also read project.md independently for stack/compliance context
- The pipeline is only as good as what `setup-finish` configured — if the wrong steps are running, re-run `setup-finish`
