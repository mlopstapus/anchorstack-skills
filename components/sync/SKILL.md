---
name: anchorstack-sync
version: 1.0.0
tier: component
description: Pull main, rebase current branch, resolve any conflicts.
---

# Sync

Pull the latest main and rebase the current branch on top of it.

## Steps

1. **Check working tree is clean**
   ```bash
   git status --porcelain
   ```
   If there are uncommitted changes, ask the user: stash them first, or abort. Do not proceed with a dirty tree.

2. **Fetch latest**
   ```bash
   git fetch origin
   ```

3. **Identify the main branch**
   Check for `main` first, then `master`:
   ```bash
   git branch -r | grep -E 'origin/(main|master)'
   ```

4. **Rebase**
   ```bash
   git rebase origin/main
   ```
   (or `origin/master` if that's what the repo uses)

5. **Handle conflicts**
   If rebase stops with conflicts:
   - List the conflicting files
   - For each conflict, read both versions and the base
   - Resolve by applying the logical intent of both sides
   - After resolving: `git add <file>` and `git rebase --continue`
   - If a conflict is ambiguous, pause and ask the user to decide

6. **Report**
   On success:
   ```
   ✓ Sync complete — rebased on origin/main (<N> commits ahead)
   ```
   On failure, report exactly what failed and what state the repo is in.
