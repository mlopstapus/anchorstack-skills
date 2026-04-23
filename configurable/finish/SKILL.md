---
name: as-finish
version: 1.0.0
tier: configurable
status: under-review
description: Execute the project's finish pipeline — self-bootstraps if not yet configured.
---

# Finish

Execute the finish pipeline for this project.

## Step 1 — Check configuration

Read `.claude/anchorstack/finish.md`.

If the file does not exist or contains no steps, the pipeline has not been configured. Tell the user:

> The finish pipeline hasn't been set up for this project yet. Run the picker in your terminal to configure it (you can type `! <command>` to run it in this session):
>
> ```bash
> node .claude/skills/scripts/finish-picker.js
> ```
>
> If that path isn't found:
> ```bash
> node $(npm root -g)/anchorstack-skills/scripts/finish-picker.js
> ```
>
> The picker will ask what you want in your pipeline and write the config. Then run `/finish` again.

Stop here — do not proceed until the file exists with steps configured.

## Step 2 — Show pipeline

Print the steps before running:

```
Finish pipeline (N steps):
  1. invoke: sync
  2. invoke: hipaa-check
  3. run: npm test
```

Ask: proceed?

## Step 3 — Execute each step

Run steps in order. For each step:

### `invoke: <skill-name>`

Execute the named skill by reading its `SKILL.md` and following its instructions completely. The skill must complete before moving to the next step.

On failure, stop and report:
```
✗ Pipeline halted at step N (invoke: <skill-name>)
Reason: <what the skill reported>
```

Do not continue after a failure unless the user explicitly says to skip and continue.

### `run: <shell command>`

Execute the shell command. A non-zero exit code is a failure — stop the pipeline and report stdout/stderr.

## Step 4 — Report

On success:
```
✓ Finish pipeline complete — all N steps passed

  1. ✓ sync
  2. ✓ hipaa-check
  3. ✓ npm test
```

On failure:
```
✗ Finish pipeline failed at step N

  1. ✓ sync
  2. ✗ hipaa-check — <reason>
  3. — npm test (skipped)
```

## Notes

- Read `.claude/anchorstack/project.md` before starting so invoked skills have project context
- To reconfigure the pipeline, re-run the picker script and then `/finish` again
