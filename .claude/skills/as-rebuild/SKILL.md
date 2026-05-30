---
name: as-rebuild
version: 1.0.0
tier: component
description: Rebuild and restart the local dev environment — uses configured command if set, otherwise auto-detects from project files.
---

# Rebuild

Rebuild and restart the local development environment.

## Step 1 — Find the rebuild command

Check `.claude/anchorstack/project.md` for a `## Rebuild` section with a configured command. If found, use it and skip to Step 3.

If not configured, auto-detect by looking for these files in order:

| File found | Method |
|---|---|
| `docker-compose.yml` / `docker-compose.yaml` / `compose.yml` | Docker Compose |
| `Makefile` with a `dev`, `up`, or `start` target | Make |
| `package.json` with a `dev` or `start` script | npm |
| `Procfile` | foreman / honcho |

If multiple are found, use the one that best represents the primary local environment (e.g., Docker Compose takes precedence if it's present alongside a Makefile).

If nothing is detected, ask the user what command to run.

## Step 2 — Offer to save the command

If the command wasn't already configured, ask: "Should I save this as the rebuild command for this project so you don't have to detect it again?"

If yes, add to `.claude/anchorstack/project.md`:
```markdown
## Rebuild
<command>
```

## Step 3 — Execute the rebuild

### Docker Compose
```bash
docker compose down --remove-orphans
docker compose build
docker compose up -d
```

Wait up to 30 seconds, then check:
```bash
docker compose ps
```

If any service is in `exited` or `restarting` state, pull logs:
```bash
docker compose logs <service> --tail=50
```

### Make
```bash
make <target>
```

### npm
```bash
npm run dev
```
(or `npm start` if no `dev` script)

### Custom / other
Run whatever was configured or provided.

## Step 4 — Report

On success:
```
✓ Rebuild complete — <method> running
```

On failure, report exactly what failed with relevant log output.
