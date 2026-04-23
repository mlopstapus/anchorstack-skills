---
name: rebuild-docker
version: 1.0.0
tier: component
description: Tear down, rebuild, and restart Docker Compose services with a health check.
---

# Rebuild Docker

Tear down the current Docker Compose environment, rebuild images, and bring everything back up cleanly.

## Steps

1. **Check for docker-compose.yml**
   Look for `docker-compose.yml`, `docker-compose.yaml`, or `compose.yml` in the project root.
   If none found, report the error and stop.

2. **Capture current state**
   ```bash
   docker compose ps
   ```
   Note which services are running before teardown.

3. **Tear down**
   ```bash
   docker compose down --remove-orphans
   ```

4. **Rebuild**
   Ask the user: full rebuild (no cache) or incremental?
   - Full: `docker compose build --no-cache`
   - Incremental: `docker compose build`

   Default to incremental unless the user is debugging a dependency or layer caching issue.

5. **Bring up**
   ```bash
   docker compose up -d
   ```

6. **Health check**
   Wait up to 30 seconds for services to become healthy:
   ```bash
   docker compose ps
   ```
   Check that all services show `running` or `healthy` status.

   If any service is in `exited` or `restarting` state after 30 seconds:
   ```bash
   docker compose logs <service-name> --tail=50
   ```
   Report the logs and flag the failing service.

7. **Report**
   ```
   ✓ Docker rebuilt and running
   Services: api (healthy), db (healthy), redis (healthy)
   ```
   Or report which services failed and include relevant log output.
