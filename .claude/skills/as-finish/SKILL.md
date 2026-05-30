---
name: as-finish
version: 1.0.0
tier: configurable
description: Execute the project's finish pipeline — self-bootstraps if not yet configured.
---

# Finish

Execute the finish pipeline for this project.

## Step 1 — Check configuration

Read `.claude/anchorstack/finish.md`.

If the file does not exist or contains no steps, run the setup flow below before proceeding.

### Setup flow (first run only)

Discover available components by listing the `SKILL.md` files under `.claude/skills/components/`. Read the `name` and `description` frontmatter from each.

Present them to the user:

```
The finish pipeline hasn't been configured yet. Here are the available components:

  - as-sync            Pull main and rebase current branch
  - as-hipaa-check     HIPAA compliance check
  - as-lint            ESLint
  - as-type-check      TypeScript type checking
  ...

Which do you want to include? You can also add custom shell commands (e.g. npm test, docker compose restart).
```

Take their response, confirm the order, then write `.claude/anchorstack/finish.md`:

```markdown
# Finish Pipeline

This file is managed by as-finish. Re-run /as-finish and choose "reconfigure" to update it.

---

steps:
  - invoke: as-sync
  - invoke: as-lint
  - run: npm test
```

Confirm what was written, then continue to Step 2.

## Step 2 — Show pipeline

Print the steps that will run:

```
Finish pipeline (N steps):
  1. invoke: as-sync
  2. invoke: as-lint
  3. run: npm test
```

Ask: proceed? (Also offer "reconfigure" to redo the setup flow.)

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

  1. ✓ as-sync
  2. ✓ as-lint
  3. ✓ npm test
```

On failure:
```
✗ Finish pipeline failed at step N

  1. ✓ as-sync
  2. ✗ as-lint — 3 errors found (see above)
  3. — npm test (skipped)
```

## Notes

- Read `.claude/anchorstack/project.md` before starting so invoked skills have project context
- To reconfigure, run `/as-finish` and respond "reconfigure" at the proceed prompt
