# Finish Pipeline

This file is managed by as-finish. Re-run /as-finish and choose "reconfigure" to update it.

---

steps:
  - invoke: as-sync
  - invoke: as-lint
  - invoke: as-secret-scan
  - invoke: as-security-scan
  - invoke: as-retro
  - invoke: as-commit
  - invoke: as-pr
