#!/usr/bin/env node
// Validates that each SKILL.md in .claude/skills/ has only allowed frontmatter keys
// and that the frontmatter parses cleanly as YAML (matching the skills package's own parser).
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import jsYaml from 'js-yaml';
const { load: parse } = jsYaml;

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, '.claude', 'skills');
const ALLOWED = new Set(['name', 'version', 'tier', 'description']);

let failed = 0;

for (const name of readdirSync(skillsDir)) {
  const skillMd = join(skillsDir, name, 'SKILL.md');
  if (!existsSync(skillMd)) continue;

  const content = readFileSync(skillMd, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    console.error(`FAIL ${name}: missing or malformed frontmatter`);
    failed++;
    continue;
  }

  // Check for unknown keys
  const unknown = [];
  for (const line of match[1].split('\n')) {
    const key = line.match(/^([a-zA-Z_-]+)\s*:/)?.[1];
    if (key && !ALLOWED.has(key)) unknown.push(key);
  }
  if (unknown.length) {
    console.error(`FAIL ${name}: unknown frontmatter key(s): ${unknown.join(', ')}`);
    failed++;
    continue;
  }

  // Check that the frontmatter parses cleanly as YAML (colon-space in values etc.)
  try {
    const data = parse(match[1]);
    if (!data?.name || !data?.description) {
      console.error(`FAIL ${name}: frontmatter missing required name or description`);
      failed++;
      continue;
    }
  } catch (e) {
    console.error(`FAIL ${name}: frontmatter YAML parse error — ${e.message.split('\n')[0]}`);
    failed++;
    continue;
  }

  console.log(`✓ ${name}`);
}

if (failed) {
  console.error(`\n${failed} skill(s) failed validation.`);
  process.exit(1);
}
console.log(`\nAll skills have valid frontmatter.`);
