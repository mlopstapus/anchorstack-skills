---
name: as-rca
version: 3.0.0
tier: universal
description: Root cause analysis — actively investigates a broken project by reading code, reproducing the failure locally, and drilling down the causation chain until the true root cause is found. Not a template — an investigation. Use this whenever something is broken and the cause isn't obvious: errors, crashes, wrong behavior, failing tests, broken deploys, or anything where "it worked before and now it doesn't". Trigger on any mention of debugging, something being broken, an error that needs diagnosis, or a fix that keeps not working.
---

# Root Cause Analysis

The goal of RCA is not to describe what's broken — it's to find *why* it's broken at the deepest level. Surface symptoms have causes. Those causes have causes. The true root cause is the thing that, if you fix it, prevents not just this failure but the whole class of failures it represents.

The method here is empirical: reproduce the failure, find the failure point in code, then trace backwards. "What is causing this?" Not once — repeatedly, until you reach something that has no further upstream cause in the system. That's the root.

---

## Phase 1 — Understand the symptom

Start by understanding what's actually breaking. Ask the user:

1. **What's the failure?** Error message, wrong behavior, or crash — as specific as possible. A stack trace or log snippet is worth a thousand words of description.
2. **When did it start?** Did something change? A deploy, a dependency update, a config change, a data change?
3. **Is it reproducible?** Every time, sometimes, or only in certain conditions?
4. **What's the environment?** Local, staging, or production? What's the stack?

Don't ask all of these if some are obvious from context. The goal is to arrive at a clear failure description, not fill out a form.

---

## Phase 2 — Reproduce the failure

Before reading code, try to reproduce the failure. A confirmed reproduction is the foundation of good RCA — it proves you're investigating the right thing.

**Try to reproduce:**
- Run the app locally (check `.claude/anchorstack/project.md` or `CLAUDE.md` for the run command)
- Trigger the failing condition
- Capture the exact error, stack trace, or wrong output

**If local reproduction isn't possible** (prod-only data, external dependency, specific environment), work from the error evidence the user has provided — logs, stack traces, error messages. Note that you couldn't reproduce locally. In your report, label any conclusion derived from unconfirmed evidence as *inferred* rather than confirmed. Identify the specific evidence that would confirm or refute the inference.

**Read git history** to understand what changed recently:
```bash
git log --oneline -20
git log --oneline --since="3 days ago"
```

Recent commits often narrow the search considerably. If a commit looks related, inspect it:
```bash
git show <hash>
```

---

## Phase 3 — Find the failure point

Now read the code. The failure point is the specific place where something goes wrong — a function that throws, a value that's wrong, a condition that's never true (or always true).

Work from the error outward:
- If there's a stack trace, start at the top frame that's in the project code (not library code)
- If there's wrong output, find where that output is produced
- If there's a crash, find where the crash originates

Read the relevant files. Check the specific lines implicated. Look at inputs, state, and assumptions at the failure point.

**Security**: If you encounter secrets, credentials, API keys, tokens, or other sensitive values while reading files — do not include them in the report. Note that sensitive values were encountered and omitted if relevant to the investigation.

Once you've found it, state it clearly:
> **Failure point:** `auth/middleware.ts:47` — JWT is being verified with `process.env.JWT_SECRET` which is `undefined` in the test environment, causing all token verifications to throw.

This is not the root cause yet. It's the symptom in code.

---

## Phase 4 — Drill down the causation chain

This is the core of the investigation. For each failure you find, ask: **what is causing this?**

Not "what went wrong" — what is *causing* the thing you just found to be wrong? Trace it upstream. Then ask again. Keep going.

**The causation question to keep asking:**
> "This is broken. But what is causing it to be broken?"

**Each answer either:**
1. Points to another upstream cause in the system → keep drilling
2. Reaches bedrock → that's the root cause

**Signs you've reached the root cause:**
- It's a decision or assumption, not just a consequence (a missing check, a wrong design choice, an untested path, a bad default)
- There's nothing further upstream in the system causing it — it's where the chain starts
- If you fixed it here, the downstream failures would not be possible

**Signs you have NOT reached the root cause yet:**
- The answer to "what is causing this?" is another piece of broken code
- You can still ask "but why is THAT broken?" and get a meaningful answer
- The "fix" would be a patch that papers over the issue rather than eliminating it

**Root cause driver categories** — classify which type of gap the root cause falls into:

- **data** — bad data, wrong schema, missing validation of incoming data
- **workflow** — flawed process, unclear ownership, manual step that should be automated
- **code structure** — wrong abstraction, inappropriate coupling, logic in the wrong layer
- **architecture** — design decision that made the failure class possible
- **configuration** — missing, wrong, or environment-specific config value
- **dependency** — upstream library, service, or external API behaviour
- **test coverage** — gap in tests that allowed the regression to ship
- **process** — team or delivery process gap (review, deployment, rollback procedure)
- **observability** — missing logging, metrics, or alerting that hid the failure

**Document the chain as you go:**

```
Symptom: [what the user reported]
  ↓ caused by
[First failure point found in code]
  ↓ caused by
[What's causing that]
  ↓ caused by
[What's causing that]
  ↓ caused by
[ROOT CAUSE] [The decision/assumption/gap where the chain starts]
```

The chain should read top-to-bottom as a coherent causal story. Each step should make the next one inevitable.

---

## Phase 5 — Verify the root cause

Before writing the report, validate that you've found the real root cause:

1. **The counterfactual test:** If the root cause didn't exist, would the failure still occur? If yes, you haven't found it yet.
2. **The fix test:** Does the implied fix feel like a real solution, or does it feel like a workaround? A real root cause fix eliminates the failure class.
3. **The "but why" test:** Ask "but why is *that* true?" one more time. If you get a meaningful answer, keep drilling.
4. **The secrets check:** Review what you're about to include in the report. Any secret, credential, or token encountered during investigation MUST be omitted.

If the causation chain branches — multiple independent causes contributing — document all branches. Sometimes there are two root causes.

---

## Phase 6 — Write the report

Write to `context/rca/[YYYY-MM-DD]-[SLUG].md`. Create `context/rca/` if it doesn't exist.

```markdown
# RCA: [FAILURE_DESCRIPTION]

**Date:** [DATE]
**Status:** [STATUS: Investigating | Root cause identified (confirmed) | Root cause identified (inferred) | Resolved]

## What broke

[WHAT_BROKE]

## Causation chain

[CAUSATION_CHAIN]
  ↓ caused by
**ROOT CAUSE: [ROOT_CAUSE_STATEMENT]**

## Root cause

[ROOT_CAUSE_EXPLANATION]

## Contributing factors

[CONTRIBUTING_FACTORS]

## Evidence gaps

[EVIDENCE_GAPS]

## Fix

[FIX_RECOMMENDATION]

## Prevention

[PREVENTION_RECOMMENDATION]
```

**Filling the template:**
- `[FAILURE_DESCRIPTION]` — short description of the failure (e.g., "Login returns 401 after deploy")
- `[DATE]` — investigation date in YYYY-MM-DD format
- `[STATUS]` — use "confirmed" if reproduced locally; "inferred" if working from evidence only
- `[WHAT_BROKE]` — one paragraph from the user's perspective: what they saw, what didn't work
- `[CAUSATION_CHAIN]` — the full chain from symptom to root cause using `↓ caused by` arrows
- `[ROOT_CAUSE_STATEMENT]` — the thing where the chain stops
- `[ROOT_CAUSE_EXPLANATION]` — one clear sentence: the specific systemic failure; not "a bug" — the decision, assumption, missing check, or design gap that made this failure possible; include the root cause driver category
- `[CONTRIBUTING_FACTORS]` — things that made this harder to catch or worse when it happened (missing test, missing monitoring, etc.); use "None identified" if absent
- `[EVIDENCE_GAPS]` — list evidence that was missing and what it would have confirmed; use "None — reproduction confirmed" if the failure was fully reproduced locally
- `[FIX_RECOMMENDATION]` — what needs to change to address the root cause; should feel like it closes the door, not patches a hole
- `[PREVENTION_RECOMMENDATION]` — what would catch this class of problem in the future: a test, a check, a process change

---

## A note on depth

The most common mistake in RCA is stopping too early. "The function returned null" is not a root cause. "The API returned a 500" is not a root cause. "The config was missing" might not be a root cause (why was it missing? what should have caught it?).

The root cause is almost always a gap in design, testing, assumptions, or observability — something that let the failure be possible in the first place. Keep asking "what is causing this?" until you feel the ground.
