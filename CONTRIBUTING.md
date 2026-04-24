# Contributing to anchorstack-skills

Skills in this library are meant to be used on real projects, by real engineers, under real time pressure. The bar for a good skill is that it produces better results than Claude would without it — not just different results.

---

## Adding a new skill

### 1. Pick the right tier

| Tier | Use when |
|---|---|
| `universal` | Stateless, project-agnostic thinking — works anywhere, anytime |
| `component` | A single, atomic pipeline step — does one thing and does it well |
| `setup` | Runs once per project, writes config that other skills read |
| `configurable` | Reads project config and orchestrates other skills |

When in doubt, start with `component`. Universal skills are for things that don't depend on project state. Most new skills are components.

### 2. Create the folder and SKILL.md

```
<tier>/<skill-slug>/
  SKILL.md
```

The `SKILL.md` frontmatter:

```yaml
---
name: as-<slug>
version: 1.0.0
tier: <universal | component | setup | configurable>
description: <one to two sentences — see below>
---
```

### 3. Write a good description

The description is the primary triggering mechanism. Claude reads it to decide whether to consult the skill. Two things it must do:

- Explain what the skill does and what it outputs
- Specify when to use it — the contexts, phrasings, or user intents that should trigger it

Be slightly pushy. Claude tends to under-trigger skills. If the description is vague, the skill won't be used. If it's specific about the situations where it applies, it will.

**Weak:** `"Run tests and fix failures."`
**Better:** `"Write tests for uncovered code, then run the test suite and fix failures. Use this when the user wants to run tests, add tests for changed files, fix failing tests, or improve coverage."`

### 4. Register in skills.json

Add an entry to the `skills` array:

```json
{ "name": "as-<slug>", "path": "<tier>/<slug>", "tier": "<tier>" }
```

Keep the list sorted by tier order: universal → component → setup → configurable.

### 5. Add to the README

Add a section under the appropriate tier heading in `README.md`. Include: what the skill does, when to use it, and any skills it depends on.

---

## Skill writing guidelines

**Be specific about the why.** Don't just tell the skill what to do — explain why. Claude is smart enough to generalize well-reasoned instructions. Unexplained rules get followed rigidly or ignored.

**Write in the imperative.** "Read project.md" not "You should read project.md".

**Keep SKILL.md under 500 lines.** If you're approaching that, split into a `references/` subdirectory and link to it from the main file.

**Don't over-specify.** If you find yourself writing rigid templates or MUST in all caps, step back and ask whether you can explain the intent instead. A skill that understands the goal handles edge cases better than one that follows rules mechanically.

**Test with a real project.** Run the skill on an actual codebase before submitting. Check that the output is genuinely better than what Claude produces without it.

---

## Modifying an existing skill

If you've installed the skills and ejected one locally:

```bash
anchorstack eject as-<skill>    # take local ownership
# make your changes
anchorstack contribute as-<skill>   # open a PR with your changes
```

For changes made directly in this repo, open a pull request with:
- What the skill did before
- What it does now
- Why the change improves it (ideally with a concrete example)

Bump the patch version (`1.0.0` → `1.0.1`) for fixes and small improvements. Bump the minor version (`1.0.0` → `1.1.0`) for new behavior. Bump the major version for breaking changes to output format or workflow.

---

## What makes a skill worth adding

A skill earns its place if it produces meaningfully better results than Claude would without it on the same prompt. Before submitting, honestly ask:

- Does this encode knowledge or judgment that Claude wouldn't apply on its own?
- Is the output consistently better, or just differently formatted?
- Does it work across different projects, or only for the one it was built on?

Skills that are too narrow (only work for one stack, one company's conventions) belong in a project-specific skills repo. This library is for patterns that generalize.

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
