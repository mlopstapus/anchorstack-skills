---
name: soc2-check
version: 1.0.0
tier: component
description: SOC2 compliance scan — access controls, logging, encryption, change management, availability.
---

# SOC2 Check

Scan the codebase for SOC2 Trust Services Criteria gaps. This is a code-level review covering the five TSC categories: Security, Availability, Processing Integrity, Confidentiality, and Privacy.

## Checks

### CC6 — Logical and physical access controls

- Are all admin and sensitive endpoints protected by authentication and authorization?
- Is there RBAC or ABAC enforced at the API layer?
- Are there any hardcoded credentials, default passwords, or API keys in source code?
- Search for: `password`, `secret`, `api_key`, `token` in non-secret config files
- Is MFA enforced for admin access? (may not be visible in code — flag for manual review)
- Are inactive session timeouts configured?

### CC7 — System operations and monitoring

- Is there structured logging throughout the application?
- Are security events logged (login attempts, permission denials, data access)?
- Are logs shipped to a centralized system (check for log aggregation config)?
- Are there alerting rules for anomalous behavior (check alerting config files)?
- Is there a health check endpoint?

### CC8 — Change management

- Is there a CI/CD pipeline configured? (check `.github/workflows/`, `.circleci/`, etc.)
- Are there required code reviews before merge? (check branch protection config if accessible)
- Are deployments automated and auditable?
- Is there a way to roll back a deployment?

### CC9 — Risk mitigation

- Are there rate limiting controls on public endpoints?
- Is input validation applied at API boundaries?
- Are dependencies scanned for vulnerabilities? (check for `npm audit`, Dependabot, Snyk config)

### A1 — Availability

- Are there retry mechanisms for critical external calls?
- Are there circuit breakers or fallbacks for dependencies?
- Are there timeout configurations on all external HTTP calls?
- Is there a documented incident response path? (check runbooks directory)

### PI1 — Processing integrity

- Are there data validation checks before writes to the database?
- Are financial or critical calculations tested with edge cases?
- Is there idempotency handling for critical operations?

### C1 — Confidentiality

- Is sensitive data encrypted at rest?
- Are there data classification labels or handling policies in code/config?
- Is PII scoped to minimum necessary access?

## Output

Report findings by TSC category with severity (Critical / High / Medium / Info).

For each finding: file:line, description, which TSC criterion it affects, and recommended remediation.

Append a **Manual review required** section for things that cannot be verified from code alone (MFA enforcement, BAAs, network controls, etc.).
