#!/usr/bin/env node
// Syncs each skill's SKILL.md from its source directory to .claude/skills/<name>/
// Run after editing a skill to keep the installable copy up to date.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(readFileSync(join(root, 'skills.json'), 'utf8')).skills;

let synced = 0;
let missing = 0;

for (const { name, path } of registry) {
  const src = join(root, path, 'SKILL.md');
  const destDir = join(root, '.claude', 'skills', name);
  const dest = join(destDir, 'SKILL.md');

  if (!existsSync(src)) {
    console.warn(`SKIP ${name} — source not found: ${path}/SKILL.md`);
    missing++;
    continue;
  }

  mkdirSync(destDir, { recursive: true });
  writeFileSync(dest, readFileSync(src, 'utf8'));
  console.log(`✓ ${name}`);
  synced++;
}

console.log(`\nDone. ${synced} synced, ${missing} missing.`);
