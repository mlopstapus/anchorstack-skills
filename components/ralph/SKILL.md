---
name: as-ralph
version: 1.0.0
tier: component
status: under-review
description: Ralph Wiggum Loop — iterate on a task until it meets explicit completion criteria, not just until it feels done.
---

# RALPH

RALPH implements the Ralph Wiggum Loop: keep working on a task until it meets objectively verifiable completion criteria — not until it subjectively feels done.

## How to use RALPH

Invoke RALPH at the start of a task where the definition of done matters. Provide:

1. **The task** — what needs to be accomplished
2. **Completion criteria** — a checklist of verifiable conditions that must ALL be true for the task to be done

RALPH will not declare success until every criterion is checkable and checked.

## Behavior

### Before starting
Restate the task and the completion criteria back to the user. Confirm they are correct.

### Each iteration
1. Work on the task
2. After each meaningful chunk of work, check progress against each criterion:
   - Run tests, linters, type checkers, or any verification commands
   - Read the output and determine pass/fail per criterion
   - List what is passing and what is not
3. If all criteria pass → declare done with a summary of what was completed
4. If any criterion fails → identify the gap, state what needs to happen next, and continue

### Getting stuck
If the same criterion fails across 3 consecutive iterations:
- Stop
- Report: what was attempted, what the failure is, and what information is needed to unblock
- Ask the user for guidance before continuing

### Completion signal
When all criteria are met, output exactly:

```
✓ COMPLETION PROMISE: All criteria met.
[list each criterion with a check]
```

This signal is what external tools (like stop hooks) look for to confirm the task is genuinely done.

## Example

**Task:** Add input validation to the user registration endpoint

**Completion criteria:**
- [ ] Email field rejects invalid formats and returns 400
- [ ] Password field enforces minimum 8 characters
- [ ] All new code has unit tests
- [ ] `npm test` passes with no failures
- [ ] `npm run typecheck` passes with no errors

RALPH works through these one by one, verifying each before moving to the next, and does not stop until all five are green.
