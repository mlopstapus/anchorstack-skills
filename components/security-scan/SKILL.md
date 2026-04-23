---
name: security-scan
version: 1.0.0
tier: component
description: OWASP-based security scan — secrets detection, injection vulnerabilities, common misconfigurations.
---

# Security Scan

Scan the codebase for common security vulnerabilities. Covers OWASP Top 10 patterns detectable through static analysis.

## 1. Secrets and credentials

Search for hardcoded secrets:
```bash
git grep -n -E '(api_key|apikey|secret|password|passwd|token|bearer|private_key)\s*=\s*["\x27][^"\x27]{8,}' -- ':!*.md' ':!*.lock'
```

Also check:
- `.env` files committed to git (`git log --all --full-history -- .env`)
- AWS/GCP/Azure credential patterns
- Private key headers (`-----BEGIN RSA PRIVATE KEY-----`)
- Connection strings with credentials embedded

Flag anything found. These must be rotated immediately if real credentials.

## 2. Injection vulnerabilities

### SQL injection
Look for string concatenation or interpolation in SQL queries:
- `"SELECT * FROM users WHERE id = " + id`
- Template literals with user input in SQL strings
- Raw query methods called with unparameterized input

Flag any query not using parameterized queries or an ORM's safe query builder.

### Command injection
Look for shell execution with user input:
- `exec()`, `execSync()`, `spawn()`, `system()`, `os.popen()`, `subprocess` with `shell=True`
- User input passed as arguments without sanitization

### XSS
In server-rendered HTML, look for:
- `dangerouslySetInnerHTML` in React with user data
- Unescaped template variables in server-rendered HTML
- `innerHTML =` with user-supplied content

## 3. Authentication and authorization

- Endpoints that skip auth middleware (look for routes without auth guards)
- JWT validation — are tokens actually verified, or just decoded?
- Password hashing — `bcrypt`/`argon2` required; flag `md5`, `sha1`, `sha256` for passwords
- Missing rate limiting on auth endpoints (login, password reset, OTP)

## 4. Insecure dependencies (surface check)

Check if `npm audit` or equivalent has been run recently. If `package-lock.json` exists:
```bash
npm audit --audit-level=high
```
(Full audit is in `dependency-audit` — this is a quick surface check.)

## 5. Sensitive data exposure

- API responses that include fields like `password_hash`, `ssn`, `credit_card` — verify these are stripped before serialization
- Pagination or list endpoints that return more data than intended (no field filtering)
- Error responses that leak stack traces, file paths, or internal details in production mode

## 6. Security misconfigurations

- CORS set to `*` on endpoints that handle authenticated requests
- `X-Frame-Options`, `Content-Security-Policy`, `X-Content-Type-Options` headers missing
- Debug mode or verbose error output enabled in production config
- Default credentials in any config (admin/admin, root/root)

## Output

Group findings by severity:

**Critical** — active secrets, SQL injection, auth bypass
**High** — XSS, command injection, weak password hashing
**Medium** — CORS misconfiguration, missing security headers
**Info** — Dependency flags, configuration notes

Each finding: file:line, description, OWASP category, recommended fix.
