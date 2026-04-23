---
name: anchorstack-tenants
version: 1.0.0
tier: universal
description: Generate spec-kit constitution tenants for a project.
---

# Tenants

You are generating spec-kit constitution tenants for this project. Tenants are the governing principles that spec-kit uses to guide implementation — they encode what "good" means for this specific project.

Requires spec-kit to be installed (`specify` command available). If not installed, tell the user to run `setup-project` first.

## Step 1 — Gather context

Read `.claude/anchorstack/project.md` if it exists. Then ask the user:

1. **What is this project?** What does it do and who uses it?
2. **What are the non-negotiables?** Things that must always be true (e.g. "every API endpoint must be authenticated", "all PHI must be encrypted at rest")
3. **What does quality look like here?** What separates good code from great code in this codebase?
4. **What are the known failure modes?** Past bugs, recurring issues, or common mistakes on this team?
5. **What compliance requirements apply?** HIPAA, SOC2, GDPR, etc.

## Step 2 — Generate tenant categories

Organize tenants into categories. Typical categories:

- **Security** — auth, encryption, secrets handling, input validation
- **Data integrity** — validation rules, constraints, idempotency
- **Observability** — logging, tracing, alerting requirements
- **Performance** — latency budgets, caching requirements
- **Compliance** — regulatory requirements specific to this project
- **Code quality** — patterns, testing requirements, review standards
- **Operational** — deployment requirements, rollback, health checks

Add or remove categories based on the project type.

## Step 3 — Write tenants

For each category, write tenants as clear, testable assertions. A good tenant:
- Is specific enough to be verifiable
- Explains the *why* (the constraint it encodes)
- Is written as a positive statement ("All endpoints must..." not "Never leave...")

Example:
```markdown
### Security

**S1 — Authentication required on all endpoints**
Every HTTP endpoint except `/health` and `/login` must verify a valid JWT before processing the request. This prevents unauthorized data access without complex per-route configuration.

**S2 — Secrets via environment variables only**
No secret value (API keys, database URLs, tokens) may appear in source code or committed config files. All secrets must be loaded from environment variables at runtime.
```

## Step 4 — Initialize with spec-kit

Once tenants are written and approved, run:
```bash
specify init
```

Write the tenants to the appropriate spec-kit location (check `specify --help` for the current config path).

## Step 5 — Output

Save tenants to `spec/tenants.md` in the project root as a standalone reference document regardless of spec-kit's internal storage location.
