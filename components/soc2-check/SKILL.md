---
name: as-soc2-check
version: 2.0.0
tier: component
status: under-review
description: SOC2 compliance check — access controls, encryption, change management, logging, availability. Defaults to staged changes for pre-commit use; supports full codebase audit with report output.
---

# SOC2 Check

Two modes:

- **Quick check** (default): scan staged changes before a commit
- **Full audit**: scan the entire codebase and write a report to disk

When invoked from `as-finish` or without an explicit scope instruction, run quick check mode.

---

## Quick Check Mode

Scan the diff for the most impactful SOC2 gaps — things that, if committed, create audit findings or customer data risk.

### Step 1 — Get the diff

```bash
git status --short
git diff --staged        # staged changes
git diff HEAD            # if nothing staged yet
```

Entirely new files (untracked) appear only in `git status` — read those directly.

### Step 2 — Run checks

#### CC6 — Access Controls
- Any new route or endpoint must have auth middleware applied. Check that no route is inadvertently public.
- tenantId / user context must come from the authenticated session, not from user-supplied query params or request body.
- If password hashing logic changed, confirm a proper algorithm is used (bcrypt, argon2, scrypt) — never store passwords plaintext.
- If session/token logic changed, confirm expiry is enforced.

#### CC6.6 — Input Validation
- Check new API endpoints for input validation before database queries or external calls.
- Flag raw SQL string concatenation with user input — parameterized queries or an ORM must be used.
- Check for injection patterns: template string interpolation in queries, `eval`, dynamic `require`.

#### CC6.7 — Encryption in Transit
- Flag any `http://` URL in the diff that isn't `localhost` or a comment.
- If TLS/SSL configuration changed, verify no downgrade (TLS 1.0/1.1 disabled, TLS 1.2+ only).
- If database connection config changed, verify SSL is required.

#### CC7 — Monitoring and Logging
- If new auth events are added (login, logout, permission denied), confirm they are logged to the audit trail.
- Check for `console.log` replacing structured logging in backend code — structured logs are required for SIEM and SOC2 auditor review.
- If error handling changed, confirm errors are logged at the appropriate severity.

#### CC8 — Change Management
- If CI/CD workflow files changed, confirm lint/test gates are still present before deploy steps.
- Flag removal of required checks or gates.

#### CC9 — Risk Mitigation
- If new auth endpoints or sensitive routes are added, verify rate limiting is applied.
- If a new third-party service dependency is added, flag it for vendor risk review (the organization must assess whether a DPA or subprocessor agreement is required).

#### Secrets
- Flag any hardcoded credential, API key, or token in the diff — anything assigned to a variable named `password`, `secret`, `api_key`, `token`, `private_key` that isn't a reference to an environment variable.
- Flag any `.env` file being tracked by git.

**Outcome:**
- All pass → `✅ SOC2 check — no issues found`
- Any fail → explain what needs to change. Flag severity (Critical/High/Medium).

---

## Full Audit Mode

Run when explicitly asked for a SOC2 audit or compliance review.

Read `CLAUDE.md` and project documentation first to understand the system boundary and intended controls. Then scan across all 14 areas:

1. Logical access controls (CC6.1–6.3)
2. Encryption in transit (CC6.7)
3. Encryption at rest (CC6.7)
4. Change management (CC8.1)
5. Monitoring and alerting (CC7.1–7.2)
6. Incident response readiness (CC7.3–7.5)
7. Availability and redundancy (A1.1–1.3)
8. Secrets and credential management (CC6.1, CC6.7)
9. Input validation and injection prevention (CC6.6)
10. Multi-tenancy isolation (CC6.3, C1.1)
11. Vendor and third-party risk (CC9.2)
12. Network security (CC6.6–6.7)
13. Logging and audit trail (CC7.2–7.3)
14. Business continuity and recovery (A1.3, CC9.1)

Use patterns appropriate for the project's stack. For each area: search, read relevant files, classify findings.

### What to look for per area

**1. Logical access controls** — auth middleware on all non-public routes, RBAC enforcement, session expiry, password hashing algorithm, inactive session timeout.

**2. Encryption in transit** — HTTP → HTTPS redirect, TLS version pinned, database connections require SSL, no cleartext transmission of customer data.

**3. Encryption at rest** — database storage encryption, S3/storage bucket encryption, volume encryption (check infrastructure config: Terraform, docker-compose).

**4. Change management** — CI/CD pipeline exists, lint/test gates before deploy, no direct commits to main without review, staging gate before production.

**5. Monitoring and alerting** — health check endpoints exist, error tracking integration (Sentry, Datadog, etc.), structured logging (not just `console.log`), alerting rules configured.

**6. Incident response** — audit log table covers security events (logins, permission failures, data access), auth failures logged, rate limit hits logged.

**7. Availability** — Docker restart policies configured, database connection pooling, retry logic on external calls, backup configuration.

**8. Secrets management** — no hardcoded credentials, no `.env` committed, production secrets in a secrets manager (AWS SSM, Vault, etc.), all env vars documented in `.env.example`.

**9. Input validation** — parameterized queries or ORM for all DB calls, request body validation before use (Zod, Joi, Pydantic, etc.), no injection vectors (string concatenation in queries, dynamic eval).

**10. Multi-tenancy isolation** — all queries on customer data scoped by tenant ID, tenant ID sourced from auth context not request params, tenant scope enforced in service boundaries.

**11. Vendor and third-party risk** — list all external services that receive customer data, check whether subprocessor/DPA documentation exists, flag undocumented vendors.

**12. Network security** — database ports not exposed to public, security groups restrict to necessary ports, nginx security headers present (HSTS, CSP, X-Frame-Options, X-Content-Type-Options), services run as non-root.

**13. Logging and audit trail** — audit log covers all sensitive actions (login, logout, data access, permission changes), logs shipped to central system, log retention policy configured.

**14. Business continuity** — automated backups configured, database migration rollback possible, runbook/recovery documentation exists, infrastructure state backed up.

### Output

Write two artifacts. Check if `worklogs/audits/` exists — if so, use it. Otherwise use `audits/`.

**1. Audit report** → `<audit-dir>/soc2-audit-YYYY-MM-DD.md`

```markdown
# SOC2 Compliance Audit — YYYY-MM-DD

**Branch:** <current branch>
**Scope:** Full system — application, infrastructure, CI/CD, third-party services
**Trust Service Criteria in scope:** CC (Security), A (Availability), C (Confidentiality)

> Engineering audit against SOC2 Trust Service Criteria. Not a formal attestation.
> A licensed CPA firm must conduct the formal SOC2 audit.

## Summary

| Severity | Count |
|----------|-------|
| Critical | N |
| High     | N |
| Medium   | N |
| Low      | N |

## Control Areas

| Area | TSC | Status | Notes |
|------|-----|--------|-------|
| Logical access controls  | CC6.1-6.3     | ✅ / ⚠️ / ❌ | ... |
| Encryption in transit    | CC6.7         | ✅ / ⚠️ / ❌ | ... |
| Encryption at rest       | CC6.7         | ✅ / ⚠️ / ❌ | ... |
| Change management        | CC8.1         | ✅ / ⚠️ / ❌ | ... |
| Monitoring and alerting  | CC7.1-7.2     | ✅ / ⚠️ / ❌ | ... |
| Incident response        | CC7.3-7.5     | ✅ / ⚠️ / ❌ | ... |
| Availability / redundancy | A1.1-1.3     | ✅ / ⚠️ / ❌ | ... |
| Secrets management       | CC6.1, CC6.7  | ✅ / ⚠️ / ❌ | ... |
| Input validation         | CC6.6         | ✅ / ⚠️ / ❌ | ... |
| Multi-tenancy isolation  | CC6.3, C1.1   | ✅ / ⚠️ / ❌ | ... |
| Vendor risk              | CC9.2         | ✅ / ⚠️ / ❌ | ... |
| Network security         | CC6.6-6.7     | ✅ / ⚠️ / ❌ | ... |
| Logging and audit trail  | CC7.2-7.3     | ✅ / ⚠️ / ❌ | ... |
| Business continuity      | A1.3, CC9.1   | ✅ / ⚠️ / ❌ | ... |

## Findings

### Critical
#### [soc2-CRITICAL-slug] Title
- **TSC:** CC6.1 / CC7.2 / etc.
- **Location:** `path/to/file:42`
- **Finding:** One sentence.
- **Risk:** One sentence.
- **Action:** One sentence.

### High / Medium / Low
...

## Positives
...

## Recommended Action Order
1. Critical — block next production deploy
2. High — fix this sprint
3. Medium — fix within 2 sprints
4. Low — fix opportunistically
```

**2. Individual backlog files** → `<audit-dir>/backlog/soc2-SEVERITY-<slug>.md` per finding

```markdown
# soc2-SEVERITY-slug: Short Title

**Severity:** CRITICAL | HIGH | MED | LOW
**TSC:** CC6.1 | CC7.2 | CC8.1 | A1.2 | C1.1 | etc.
**Location:** path/to/file:42

## What
One to three sentences.

## Why it matters
One sentence.

## Suggested fix
One sentence.
```

### Severity Guide

| Severity | Definition |
|----------|------------|
| **Critical** | Unencrypted customer data transmission. Missing auth on a data route. SQL injection in active code path. Production secrets committed. No tenant isolation on multi-tenant queries. Block next deploy. |
| **High** | No lint/test gate before production deploy. No staging gate. Hardcoded credentials. Missing audit logging on sensitive actions. No session timeout. No rate limiting on auth endpoints. Database port exposed to public. Fix this sprint. |
| **Medium** | Missing security headers in nginx. `console.log` only (no structured logging) in backend. No restart policy on critical service. No health check endpoint. Undocumented vendor receiving customer data. Fix within 2 sprints. |
| **Low** | Undocumented `.env` var. Minor audit log coverage gap. Security TODO comment. No runbook or recovery doc. Fix opportunistically. |

### SOC2 TSC Reference

| Code | Description |
|------|-------------|
| CC6.1 | Logical access — software, infrastructure, architectures |
| CC6.3 | Restrict access based on authorization |
| CC6.6 | Protection against threats from outside system boundaries |
| CC6.7 | Encryption of data in transit and at rest |
| CC7.1 | Detection of vulnerabilities and threats |
| CC7.2 | Monitoring of system components |
| CC7.3–7.5 | Incident identification and response |
| CC8.1 | Management of changes to infrastructure, data, software |
| CC9.1 | Risk mitigation including business continuity |
| CC9.2 | Assessment and monitoring of vendors |
| A1.1–1.3 | Availability — capacity, backup, recovery |
| C1.1–1.2 | Confidentiality — identification and disposal |
