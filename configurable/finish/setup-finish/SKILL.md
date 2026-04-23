---
name: anchorstack-setup-finish
version: 1.0.0
tier: setup
description: Configure the finish pipeline — interactive component picker writes .claude/anchorstack/finish.md.
---

# Setup Finish

Configure the `finish` pipeline for this project. Run this once per project (re-run any time the finish pipeline needs updating).

## Step 1 — Check prerequisites

Verify that `.claude/anchorstack/project.md` exists. If not, tell the user to run `setup-project` first.

## Step 2 — Run the interactive picker

Run the finish picker script:
```bash
node .claude/skills/scripts/finish-picker.js
```

If the script is not found at that path, try:
```bash
node $(npm root -g)/anchorstack-skills/scripts/finish-picker.js
```

The picker will:
- Show all available components as a multi-select checkbox list
- Let the user select which components to include (space to toggle)
- Ask the user to order the selected components
- Optionally add custom shell commands at specific positions in the pipeline
- Output YAML between `---FINISH_YAML---` and `---END_YAML---` markers

## Step 3 — Parse picker output

Extract the YAML block from the picker output:
```
---FINISH_YAML---
steps:
  - invoke: sync
  - invoke: hipaa-check
  - run: docker compose restart
---END_YAML---
```

## Step 4 — Write finish.md

Create or overwrite `.claude/anchorstack/finish.md`:

```markdown
# Finish Pipeline

This file is managed by setup-finish. Re-run setup-finish to reconfigure.
Edit manually only if you need a quick one-off change.

---

steps:
  - invoke: sync
  - invoke: hipaa-check
  - run: docker compose restart
```

## Step 5 — Confirm

Show the user the full configured pipeline in a readable format:

```
Finish pipeline configured:

  1. invoke: sync
  2. invoke: hipaa-check
  3. run: docker compose restart

Run /finish to execute this pipeline.
```

Ask: does this look correct?
