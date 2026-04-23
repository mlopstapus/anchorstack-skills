---
name: as-type-check
version: 1.0.0
tier: component
status: under-review
description: Run TypeScript type checking and surface errors with context.
---

# Type Check

Run TypeScript type checking and triage any errors.

## Steps

1. **Detect TypeScript config**
   Look for `tsconfig.json` in the project root or common locations (`src/tsconfig.json`, `apps/*/tsconfig.json` in monorepos).

   If no `tsconfig.json` found, report and stop.

2. **Run type checker**
   ```bash
   npx tsc --noEmit
   ```
   Or if a `typecheck` script is defined in `package.json`:
   ```bash
   npm run typecheck
   ```

3. **Parse output**
   If errors are present, group them by file. For each error:
   - Show the file path and line number
   - Show the error message
   - Show the surrounding code context (3 lines before and after)
   - Suggest a fix if the error is a common pattern

4. **Common error patterns and fixes**
   - `Type 'X' is not assignable to type 'Y'` — check the type definition or add a type assertion
   - `Property 'X' does not exist on type 'Y'` — check spelling, check that the type includes the property
   - `Object is possibly 'null' or 'undefined'` — add a null check or non-null assertion with a comment explaining why it's safe
   - `Cannot find module 'X'` — check the import path and tsconfig `paths`

5. **Report**
   ```
   ✓ Type check passed — no errors
   ```
   Or:
   ```
   ✗ Type check failed — N errors in M files
   [grouped errors with context]
   ```

   If errors exist, ask: fix them now, or just report?
