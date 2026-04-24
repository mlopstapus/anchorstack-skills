---
name: as-test
version: 1.1.0
tier: component
description: Write tests for uncovered code, then run the test suite and fix failures — whether that means fixing the code or correcting a wrong test. Use this skill when the user wants to run tests, add tests for changed files, fix failing tests, or improve test coverage. Trigger on any mention of testing, test failures, writing tests, or coverage gaps.
---

# Test

The order matters: write missing tests first, then run and fix. Tests you write before looking at failures are honest — they describe what the code *should* do. Tests written after a failure are biased toward the current (possibly broken) behavior.

---

## Step 1 — Discover test commands

Check `.claude/anchorstack/project.md` for a `## Test` section first. If it's populated, use those commands and skip the rest of this step.

Otherwise, scan for **all** test layers — a project often has more than one:

**Unit / component tests:**
| Signal | Command |
|---|---|
| `test` script in `package.json` | `npm test` |
| `jest.config.*` | `npx jest` |
| `vitest.config.*` | `npx vitest run` |
| `pytest.ini` / `[tool.pytest]` in `pyproject.toml` | `pytest` |
| `go.mod` | `go test ./...` |
| `Cargo.toml` | `cargo test` |
| `spec/` dir + `Gemfile` | `bundle exec rspec` |

**Integration tests:**
| Signal | Command |
|---|---|
| `test:integration` script in `package.json` | `npm run test:integration` |
| `tests/integration/` directory | run with the same runner, scoped to that dir |

**End-to-end tests:**
| Signal | Command |
|---|---|
| `playwright.config.*` | `npx playwright test` |
| `cypress.config.*` | `npx cypress run` |
| `e2e/` or `tests/e2e/` directory | run with detected e2e runner |

If nothing is detected for any layer, ask the user what commands to use.

After running (Step 5), save all confirmed working commands to `project.md`:

```markdown
## Test
unit: <command>
integration: <command>        ← omit if none
e2e: <command>                ← omit if none
```

If a `## Test` section already exists, update it in place rather than appending. This persistence means future runs — and other skills like `as-finish` and `as-tech-debt-audit` — always know how to run the full test suite without re-detecting.

---

## Step 2 — Identify changed files

Find what's changed and needs test coverage:

```bash
git diff --staged --name-only       # if changes are staged
git diff HEAD --name-only           # unstaged changes
git diff HEAD~1 --name-only         # since last commit
```

Focus on source files — not config, not lock files, not the test files themselves. Filter to files that contain logic worth testing.

---

## Step 3 — Check existing coverage

For each changed file, find its corresponding test file(s). Common conventions:

| Source file | Test file |
|---|---|
| `src/auth/jwt.ts` | `src/auth/jwt.test.ts` or `tests/auth/jwt.test.ts` |
| `app/models/user.py` | `tests/test_user.py` or `tests/models/test_user.py` |
| `pkg/handler/user.go` | `pkg/handler/user_test.go` |
| `lib/payments.rb` | `spec/lib/payments_spec.rb` |

Also grep for imports/references to the changed file across existing test files — a file may be tested indirectly.

For each changed file, decide:
- **Covered** — tests exist that exercise the changed code paths
- **Partially covered** — tests exist but don't reach the changed paths
- **Uncovered** — no tests at all

---

## Step 4 — Write missing tests

For each uncovered or partially covered file, write tests before running anything.

**What to test:**
- The primary behavior — what the function/class/component is supposed to do
- Error cases — what happens with invalid input, missing data, or failure conditions
- Edge cases meaningful to this specific code — empty lists, zero values, boundary conditions
- Integration points — if this code calls external services or other modules, test that the interaction is correct

**How to write them:**
- Match the existing test style exactly — same framework, same assertion style, same describe/it/test structure, same mocking approach
- Read 2–3 existing test files first to understand the conventions before writing anything
- Test behavior, not implementation — a good test shouldn't break when you refactor the internals
- Name tests so they read as specifications: "returns 401 when token is expired", not "test jwt"

Write the tests to the appropriate file. If no test file exists, create one following the project's naming convention.

---

## Step 5 — Run the tests

Run tests for the changed files first — focused runs are faster and give clearer signal:

```bash
# Focused run examples
npx jest src/auth/jwt.test.ts
pytest tests/test_user.py
go test ./pkg/handler/...
```

If the focused run passes, run the full suite to check for regressions. Run each discovered layer (unit, then integration, then e2e — in that order, since unit is fastest and e2e is slowest).

**After confirming which commands work, write them to `project.md`** under `## Test` with one line per layer. If a layer doesn't exist for this project, omit it. This is the source of truth that other skills and future runs will use.

If everything passes:
```
✓ Tests passed — N new tests written, all passing
```

Stop here.

---

## Step 6 — Triage failures

For each failing test, make a judgment call before touching anything:

**Fix the code if:**
- The test describes correct, intended behavior that the code doesn't satisfy
- The test was passing before the change and the change broke it
- The expectation makes sense from the user's perspective

**Fix the test if:**
- The test has a wrong expectation — it was asserting something that was never quite right
- The test is testing an internal implementation detail that legitimately changed (e.g., a private method was renamed or refactored)
- The test is overly coupled to structure rather than behavior

**When it's ambiguous:** lean toward fixing the code. A failing test is the code's way of saying "you changed something I relied on" — and usually that's worth addressing. Changing a test to make it pass is easier to get wrong silently.

Explain the reasoning briefly before making each fix: "This test is asserting X but the correct behavior is Y, so I'm updating the expectation" or "The code is missing a null check that this test is correctly flagging."

---

## Step 7 — Fix and re-run

Make the fixes — either to code or tests — and re-run to verify. Repeat until everything passes.

If a failure can't be resolved without a broader change (architectural, missing dependency, needs a design decision), note it clearly and move on rather than applying a bad fix:

```
⚠ tests/auth/session.test.ts — skipped: requires session store to be injected (not hardcoded)
```

---

## Step 8 — Report

```
✓ Tests passed

  Written:  N new test files, M new test cases
  Fixed:    N code fixes, M test corrections
  Skipped:  N (with reasons)
  Passing:  N / N
```
