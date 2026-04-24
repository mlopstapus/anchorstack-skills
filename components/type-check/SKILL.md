---
name: as-type-check
version: 2.0.0
tier: component
description: Run type checking for any language, auto-fix errors, and report results.
---

# Type Check

Run the project's type checker, fix any errors, and verify they're resolved.

## Step 1 — Find the type check command

Check `.claude/anchorstack/project.md` for a `## Type check` section with a configured command. If found, use it and skip to Step 2.

Otherwise auto-detect:

| Signal | Tool | Command |
|---|---|---|
| `tsconfig.json` present | TypeScript | `npm run typecheck` if script exists, else `npx tsc --noEmit` |
| `pyrightconfig.json` or `pyproject.toml` with `[tool.pyright]` | Pyright | `pyright` |
| `mypy.ini` or `setup.cfg` with `[mypy]` | mypy | `mypy .` |
| `.flowconfig` | Flow | `npx flow check` |
| `Cargo.toml` | Rust | `cargo check` |
| `go.mod` | Go | `go vet ./...` |

If nothing is detected, ask the user what command to run.

If a command was detected or provided (not already in `project.md`), offer to save it:

```markdown
## Type check
<command>
```

## Step 2 — Run the type checker

Run the command and capture output. If it passes cleanly:

```
✓ Type check passed — no errors
```

Stop here.

## Step 3 — Fix errors

For each error in the output:

1. Read the file and the surrounding code at the reported line
2. Understand what the type system is complaining about and why
3. Fix the code — prefer correct types over type assertions or suppression comments. Only use assertions/ignores when the type system genuinely can't express the invariant (and add a comment explaining why).
4. Move on to the next error

Work through all errors before re-running — fixing one error often resolves others downstream.

## Step 4 — Re-run and verify

Run the type checker again. If errors remain, repeat Step 3. If the same error persists after two fix attempts, stop and report it with context — it likely needs a design decision or more information.

## Step 5 — Report

```
✓ Type check passed — N errors fixed

  - src/api/users.ts:42 — Property 'id' missing on UserInput type
  - src/lib/db.ts:18 — Argument type mismatch in query helper
```

Or if unresolved errors remain:

```
✗ Type check — N fixed, M unresolved

Unresolved:
  - src/complex/thing.ts:99 — <error> [needs review]
```
