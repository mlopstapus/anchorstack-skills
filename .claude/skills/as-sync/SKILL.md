---
name: as-sync
version: 1.1.0
tier: component
description: Stash, fetch, rebase on main, auto-resolve conflicts, push.
---

# Sync

Bring the current branch up to date with main and push.

## Steps

1. **Stash any uncommitted changes**

   ```bash
   git stash push -m "as-sync auto-stash"
   ```

   Note whether anything was stashed so you can pop it at the end.

2. **Fetch latest**

   ```bash
   git fetch origin
   ```

3. **Identify the main branch**

   ```bash
   git branch -r | grep -E 'origin/(main|master)'
   ```

   Use `main`, fall back to `master`.

4. **Rebase**

   ```bash
   git rebase origin/main
   ```

5. **Auto-resolve conflicts**

   If the rebase stops with conflicts, resolve each one without asking:

   - Read the conflicting file, both sides, and the common ancestor
   - Read the relevant commit messages and diffs from both branches to understand intent (`git log`, `git show`)
   - Apply the resolution that preserves the intent of both sides — prefer the incoming change when it clearly supersedes the local one, preserve local when it's additive
   - `git add <file>` after resolving each file
   - `git rebase --continue`

   Only pause and ask the user if a conflict is genuinely ambiguous after reading the full context — e.g. two distinct rewrites of the same logic with no clear winner.

6. **Push**

   ```bash
   git push --force-with-lease
   ```

7. **Pop stash**

   If changes were stashed in step 1:

   ```bash
   git stash pop
   ```

   If the pop produces conflicts, resolve them the same way as step 5.

8. **Report**

   ```
   ✓ Sync complete — rebased on origin/main (<N> commits ahead), pushed
   ```

   If anything was stashed and popped, note that too. On failure, report exactly what failed and the current repo state.
