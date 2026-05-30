#!/usr/bin/env node
// Validates that each SKILL.md in .claude/skills/ has only the allowed frontmatter keys.
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, '.claude', 'skills');
const ALLOWED = new Set(['name', 'version', 'tier', 'description']);

let failed = 0;

for (const name of readdirSync(skillsDir)) {
  const skillMd = join(skillsDir, name, 'SKILL.md');
  if (!existsSync(skillMd)) continue;

  const content = readFileSync(skillMd, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.error(`FAIL ${name}: missing or malformed frontmatter`);
    failed++;
    continue;
  }

  const unknown = [];
  for (const line of match[1].split('\n')) {
    const key = line.match(/^([a-zA-Z_-]+)\s*:/)?.[1];
    if (key && !ALLOWED.has(key)) unknown.push(key);
  }

  if (unknown.length) {
    console.error(`FAIL ${name}: unknown frontmatter key(s): ${unknown.join(', ')}`);
    failed++;
  } else {
    console.log(`✓ ${name}`);
  }
}

if (failed) {
  console.error(`\n${failed} skill(s) failed validation.`);
  process.exit(1);
}
console.log(`\nAll skills have valid frontmatter.`);
