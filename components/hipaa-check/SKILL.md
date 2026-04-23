---
name: hipaa-check
version: 1.0.0
tier: component
description: HIPAA compliance scan — PHI exposure, audit trails, encryption, access controls.
---

# HIPAA Check

Scan the codebase for HIPAA compliance issues. This is a code-level review — not a substitute for a formal compliance audit.

## PHI data types to look for

Protected Health Information (PHI) includes: names, dates (except year), phone numbers, addresses, SSNs, medical record numbers, health plan numbers, account numbers, certificate/license numbers, VINs, device identifiers, URLs, IP addresses, biometric identifiers, photos, and any other unique identifying number or code.

## Checks

### 1. PHI in logs
Search for logging statements that may output PHI:
- `console.log`, `logger.*`, `print`, `logging.*` calls with patient/user data
- Any log that includes name, email, DOB, SSN, MRN, diagnosis fields

Flag any log that could contain PHI. Logs must not contain PHI unless explicitly de-identified.

### 2. PHI in error messages
Check error responses returned to clients. Error messages must not expose PHI.

### 3. Encryption at rest
Verify PHI-containing fields in database schemas are encrypted:
- Look for field names: `ssn`, `dob`, `diagnosis`, `medical_record`, `health`, `patient`, `phi`
- Check that they use encryption at the ORM or storage layer, not plaintext

### 4. Encryption in transit
- Confirm all HTTP calls use HTTPS (no `http://` endpoints in production config)
- Check that API clients enforce TLS verification (no `verify=False`, `rejectUnauthorized: false`)

### 5. Audit logging
HIPAA requires audit trails for access to PHI. Check:
- Is there an audit log table or service?
- Are reads of PHI-containing records logged (not just writes)?
- Do audit logs capture: who, what, when, from where?

### 6. Access controls
- Is every PHI-touching endpoint behind authentication?
- Is there role-based access control limiting who can read which PHI?
- Are there any endpoints that return PHI without authorization checks?

### 7. Data retention
- Is there a retention policy implemented?
- Are there scheduled jobs or mechanisms to delete/archive PHI after the required period?

### 8. Third-party integrations
- List all third-party services that may receive PHI (analytics, error tracking, CRMs)
- Flag any that don't have a BAA (Business Associate Agreement) in place — you can't verify this in code, but flag the integration for manual review

## Output

Report findings grouped by severity:

**Critical** — PHI actively exposed or unencrypted
**High** — Missing audit trail, unprotected PHI endpoint
**Medium** — Potential PHI in logs, weak access controls
**Info** — Third-party integrations to verify manually

For each finding: file path, line number, description, recommended fix.
