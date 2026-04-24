---
name: as-hipaa-check
version: 2.0.0
tier: component
description: HIPAA compliance check — PHI exposure, audit trail gaps, access control, encryption. Defaults to staged changes for pre-commit use; supports full codebase audit with report output.
---

# HIPAA Check

Two modes:

- **Quick check** (default): scan staged changes before a commit
- **Full audit**: scan the entire codebase and write a report to disk

When invoked from `as-finish` or without an explicit scope instruction, run quick check mode.

---

## The 18 PHI Identifiers

Flag any of these appearing in logs, error messages, URLs, or unscoped queries:

```
name, first_name, last_name, patient_name, full_name
dob, date_of_birth, birth_date
phone, phone_number, cell, mobile
email, email_address
address, street, city, zip, postal_code
ssn, social_security
mrn, medical_record_number, chart_number
insurance, policy_number, member_id
diagnosis, condition, treatment, procedure
device_id, biometric, photo, image
ip_address (when stored with identity)
account_number, certificate_number, license_number
```

---

## Quick Check Mode

### Step 1 — Get the diff

```bash
git status --short
git diff --staged        # staged changes
git diff HEAD            # if nothing staged yet
```

Entirely new files (untracked) appear only in `git status` — read those directly.

### Step 2 — Classify changes

Check what file types changed:

- If ONLY infrastructure files changed (`.yml`, `.yaml`, `.tf`, `.sh`, `Dockerfile`, nginx configs, `.hcl`, `.toml`) → run **Infrastructure Checks**
- Otherwise → run **Application Checks**

---

### Application Checks

#### 1. Logs
Find every logging call in the diff — `console.log`, `logger.*`, `log.*`, `print`, `logging.*`, `structlog.*`, `syslog`. PHI must not appear in log output. Only non-PHI identifiers are acceptable (IDs, timestamps). Flag any log that could contain a PHI field.

#### 2. Error messages
Find every error thrown or returned. Error messages must reference IDs only — never patient names, contact info, or health details.

#### 3. Tenant isolation
If multi-tenant: every database query in the diff must be scoped to the authenticated tenant. The tenant/user identifier must come from the auth session, not user-supplied input. A query returning another tenant's records is a HIPAA violation.

#### 4. Auth on new routes
Any new route or endpoint must have auth middleware. Confirm it is not publicly reachable without authentication.

#### 5. Audit logging
If changed code reads or writes PHI-bearing data, confirm an audit log entry is created. Audit entries must store only identifiers (user ID, entity ID, action, timestamp) — never the PHI itself.

#### 6. PHI in URLs
Route definitions and URL construction must not place PHI (names, phones, emails) in URL paths or query strings. URLs appear in server and proxy access logs.

#### 7. Raw/blob data handling
If code reads a field that may contain arbitrary PHI (e.g., a `raw_data` blob, imported records, document payloads), confirm it is not logged, not returned to clients unfiltered, and not sent to third-party services without redaction.

#### 8. Frontend logging
Check `console.log`, `console.error`, `console.warn` in frontend files. These must be removed or replaced with user-facing messages — browser console is not a secure boundary.

#### 9. Session timeout
If auth or token logic changed, verify session timeout is enforced. Expired tokens must be rejected. Frontend must clear the session on expiry.

#### 10. Rate limiting
If new auth routes or sensitive endpoints are added, verify rate limiting is applied. Auth endpoints must have stricter limits than general endpoints.

**Outcome:**
- All pass → `✅ HIPAA check — no issues found`
- Any fail → explain what needs to change. Do not proceed until fixed.

---

### Infrastructure Checks

#### 1. Encryption at rest
Database storage encryption enabled (`storage_encrypted`, `encrypt = true`, `kms_key`). S3/storage buckets have server-side encryption. Volumes use encryption.

#### 2. Encryption in transit
HTTP → HTTPS redirect configured. Database connections use SSL (`sslmode=require`, `ssl: true`). No `http://` endpoints in production config.

#### 3. Logging & monitoring
Access logs must not capture request bodies or query strings on PHI-bearing endpoints. Audit logging enabled for database access.

#### 4. Data retention
Retention policy meets healthcare requirements (6+ years for PHI). Automated deletion/archival mechanisms exist.

#### 5. Network security
Database and backend not in public subnets. Security groups use minimal port exposure — no `0.0.0.0/0` on sensitive ports. Admin access requires VPN or bastion.

#### 6. Access control
IAM policies follow least privilege. No wildcard permissions in production. Credentials in a secrets manager, not plain environment variables.

#### 7. Infrastructure as code
No hardcoded credentials in `.tf`, `.yml`, or `.sh` files. State storage encrypted with versioning.

**Outcome:**
- All pass → `✅ HIPAA infrastructure check — no issues found`
- Any fail → list specific violations and required fixes.

---

## Full Audit Mode

Run when explicitly asked for a HIPAA audit or compliance review.

Read `CLAUDE.md` and project documentation first to understand intended safeguards before looking for gaps. Then scan across all 15 areas:

1. PHI in application logs
2. PHI in error messages
3. Tenant isolation
4. Authentication & authorization on sensitive routes
5. Audit logging coverage
6. PHI in URLs and query parameters
7. Raw/blob data handling
8. Frontend security — console, localStorage, sessionStorage
9. Secrets and credential management
10. Encryption in transit
11. Encryption at rest
12. Network security and access controls
13. Data retention and purge mechanisms
14. Rate limiting and brute-force protection
15. Third-party services and Business Associate Agreements (BAAs)

Use patterns appropriate for the project's stack. For each area: search, read relevant files, classify findings.

### Output

Write two artifacts. Check if `worklogs/audits/` exists — if so, use it. Otherwise use `audits/`.

**1. Audit report** → `<audit-dir>/hipaa-audit-YYYY-MM-DD.md`

```markdown
# HIPAA Compliance Audit — YYYY-MM-DD

**Branch:** <current branch>
**Scope:** Full codebase
**Standard:** 45 CFR Part 164 (HIPAA Security Rule)

> Engineering audit, not a legal opinion. A qualified HIPAA compliance officer
> should review before attesting compliance.

## Summary

| Severity | Count |
|----------|-------|
| Critical | N |
| High     | N |
| Medium   | N |
| Low      | N |

## Risk Areas

| Area | Status | Notes |
|------|--------|-------|
| PHI in logs            | ✅ / ⚠️ / ❌ | ... |
| PHI in errors          | ✅ / ⚠️ / ❌ | ... |
| Tenant isolation       | ✅ / ⚠️ / ❌ | ... |
| Authentication         | ✅ / ⚠️ / ❌ | ... |
| Audit logging          | ✅ / ⚠️ / ❌ | ... |
| PHI in URLs            | ✅ / ⚠️ / ❌ | ... |
| Raw data handling      | ✅ / ⚠️ / ❌ | ... |
| Frontend security      | ✅ / ⚠️ / ❌ | ... |
| Secrets management     | ✅ / ⚠️ / ❌ | ... |
| Encryption in transit  | ✅ / ⚠️ / ❌ | ... |
| Encryption at rest     | ✅ / ⚠️ / ❌ | ... |
| Network security       | ✅ / ⚠️ / ❌ | ... |
| Data retention         | ✅ / ⚠️ / ❌ | ... |
| Rate limiting          | ✅ / ⚠️ / ❌ | ... |
| Third-party BAAs       | ✅ / ⚠️ / ❌ | ... |

## Findings

### Critical
#### [hipaa-CRITICAL-slug] Title
- **HIPAA Standard:** § 164.312(b) Audit Controls / etc.
- **Location:** `path/to/file:42`
- **Finding:** One sentence.
- **Risk:** One sentence.
- **Action:** One sentence.

### High / Medium / Low
...

## Positives
...

## Recommended Action Order
1. Critical — fix before next production deploy
2. High — fix this sprint
3. Medium — fix within 2 sprints
4. Low — fix opportunistically
```

**2. Individual backlog files** → `<audit-dir>/backlog/hipaa-SEVERITY-<slug>.md` per finding

```markdown
# hipaa-SEVERITY-slug: Short Title

**Severity:** CRITICAL | HIGH | MED | LOW
**HIPAA Standard:** § 164.312(b) | etc.
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
| **Critical** | PHI directly in logs/errors/responses. Route accessing PHI with no auth. No tenant isolation on PHI query. Hardcoded credential committed. `http://` for PHI in transit. Fix before next deploy. |
| **High** | Audit log missing on PHI read/write. Unfiltered PHI blob returned to client. Third-party receiving PHI with no BAA. No rate limiting on auth. No session timeout. Fix this sprint. |
| **Medium** | Possible PHI in log (runtime-dependent). Missing security header. No documented data retention policy. TLS version not pinned. Fix within 2 sprints. |
| **Low** | HTTP link in non-PHI internal config. Missing env var documentation. Security TODO comment. Fix opportunistically. |
