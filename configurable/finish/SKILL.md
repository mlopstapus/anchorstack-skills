---
name: as-finish
version: 2.0.0
tier: configurable
description: Execute the project's finish pipeline — self-bootstraps if not yet configured. Pipeline steps are stored in .claude/anchorstack/project.json.
---

# Finish

Execute the finish pipeline for this project.

## Step 1 — Check configuration

Attempt to read `.claude/anchorstack/project.json`.

### If `project.json` is malformed JSON

Stop and report:

```
project.json is malformed and cannot be read. Fix the file and re-run /as-finish.
```

Do not proceed.

### If `project.json` does not exist, or exists but has no `finish.pipeline` key

Check whether `.claude/anchorstack/finish.md` exists.

If it does, offer migration:

```
Found an existing finish pipeline in .claude/anchorstack/finish.md.
Migrate it to project.json? (yes / no / reconfigure from scratch)
```

- **Yes**: read the ordered steps from `finish.md`, write them to `project.json` under `finish.pipeline` (see format below), delete `finish.md`, then continue to Step 2.
- **Reconfigure from scratch**: run the setup flow, then delete `finish.md` after saving.
- **No**: run the setup flow without deleting `finish.md`.

If `finish.md` does not exist either, run the setup flow.

### Setup flow (first run or reconfigure)

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

Take their response and confirm the order.

If `.claude/anchorstack/project.json` already exists with other keys, merge the `finish` key in — do not overwrite unrelated content. If the file does not exist, create `.claude/anchorstack/` if needed, then create the file.

Write the confirmed pipeline to `.claude/anchorstack/project.json`:

```json
{
  "finish": {
    "pipeline": [
      { "invoke": "as-sync" },
      { "invoke": "as-lint" },
      { "run": "npm test" }
    ]
  }
}
```

Each step is either `{ "invoke": "<skill-name>" }` or `{ "run": "<shell command>" }`.

Confirm what was written, then continue to Step 2.

## Step 2 — Show pipeline

Read `finish.pipeline` from `.claude/anchorstack/project.json` and print the steps:

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

Before invoking, check that the skill exists under `.claude/skills/`. If not found, stop and report:

```
✗ Pipeline halted at step N (invoke: <skill-name>)
Reason: skill not installed
```

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
- Pipeline steps are stored at `finish.pipeline` in `.claude/anchorstack/project.json`
- To reconfigure, run `/as-finish` and respond "reconfigure" at the proceed prompt
