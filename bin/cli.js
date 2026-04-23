#!/usr/bin/env node
import * as p from '@clack/prompts';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import { join } from 'path';
import chalk from 'chalk';

const MANIFEST_PATH = '.claude/anchorstack/manifest.json';
const SKILLS_JSON = new URL('../skills.json', import.meta.url).pathname;
const GITHUB_RAW = 'https://raw.githubusercontent.com/mlopstapus/anchorstack-skills/main';

function loadSkillsJson() {
  return JSON.parse(readFileSync(SKILLS_JSON, 'utf8'));
}

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return { skills: {} };
  return JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
}

function saveManifest(manifest) {
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

function hashFile(filePath) {
  if (!existsSync(filePath)) return null;
  const content = readFileSync(filePath, 'utf8');
  return createHash('sha256').update(content).digest('hex').slice(0, 12);
}

function skillInstallPath(skillPath, global = false) {
  const base = global
    ? join(process.env.HOME, '.claude', 'skills')
    : join(process.cwd(), '.claude', 'skills');
  return join(base, skillPath.split('/').pop());
}

const [,, command, ...args] = process.argv;

switch (command) {
  case 'list':    await runList();    break;
  case 'update':  await runUpdate();  break;
  case 'eject':   await runEject(args[0]);   break;
  case 'contribute': await runContribute(args[0]); break;
  default:
    console.log(chalk.bold('anchorstack') + ' — skill management CLI\n');
    console.log('  anchorstack list                  Show installed skills');
    console.log('  anchorstack update                Update unmodified skills');
    console.log('  anchorstack eject <skill>         Take local ownership of a skill');
    console.log('  anchorstack contribute <skill>    Open a PR with your local changes');
}

async function runList() {
  const { skills: registry } = loadSkillsJson();
  const manifest = loadManifest();

  p.intro(chalk.bold('Anchorstack Skills'));

  const rows = registry.map(skill => {
    const entry = manifest.skills?.[skill.name];
    const installPath = skillInstallPath(skill.path);
    const installed = existsSync(join(installPath, 'SKILL.md'));
    const currentHash = installed ? hashFile(join(installPath, 'SKILL.md')) : null;
    const status = !installed
      ? chalk.dim('not installed')
      : !entry
        ? chalk.yellow('untracked')
        : entry.ejected
          ? chalk.magenta('ejected')
          : currentHash !== entry.hash
            ? chalk.yellow('modified')
            : chalk.green('up to date');

    return { name: skill.name, tier: skill.tier, version: entry?.version ?? '—', status };
  });

  const tierOrder = ['universal', 'component', 'setup', 'configurable'];
  const grouped = tierOrder.map(tier => ({
    tier,
    skills: rows.filter(r => r.tier === tier),
  }));

  for (const { tier, skills } of grouped) {
    if (!skills.length) continue;
    console.log('\n' + chalk.bold(chalk.underline(tier)));
    for (const s of skills) {
      console.log(`  ${s.name.padEnd(22)} v${s.version.padEnd(8)} ${s.status}`);
    }
  }
  console.log('');
}

async function runUpdate() {
  const { skills: registry } = loadSkillsJson();
  const manifest = loadManifest();
  manifest.skills ??= {};

  p.intro(chalk.bold('Updating Anchorstack Skills'));

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const skill of registry) {
    const entry = manifest.skills[skill.name];

    if (entry?.ejected) {
      p.log.warn(`Skipping ${skill.name} (ejected)`);
      skipped++;
      continue;
    }

    const installPath = skillInstallPath(skill.path);
    const skillMd = join(installPath, 'SKILL.md');

    try {
      const res = await fetch(`${GITHUB_RAW}/${skill.path}/SKILL.md`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = await res.text();

      mkdirSync(installPath, { recursive: true });
      writeFileSync(skillMd, content, 'utf8');

      manifest.skills[skill.name] = {
        ...entry,
        hash: hashFile(skillMd),
        updatedAt: new Date().toISOString(),
      };

      p.log.success(`Updated ${skill.name}`);
      updated++;
    } catch (err) {
      p.log.error(`Failed to update ${skill.name}: ${err.message}`);
      failed++;
    }
  }

  saveManifest(manifest);
  p.outro(`Done. ${updated} updated, ${skipped} skipped${failed ? `, ${failed} failed` : ''}.`);
}

async function runEject(skillName) {
  if (!skillName) {
    p.log.error('Usage: anchorstack eject <skill-name>');
    process.exit(1);
  }
  const manifest = loadManifest();
  manifest.skills ??= {};
  manifest.skills[skillName] ??= {};
  manifest.skills[skillName].ejected = true;
  saveManifest(manifest);
  p.log.success(`${skillName} ejected — it will be skipped on future updates.`);
  p.log.info('Run `anchorstack contribute ' + skillName + '` to open a PR with your changes.');
}

async function runContribute(skillName) {
  if (!skillName) {
    p.log.error('Usage: anchorstack contribute <skill-name>');
    process.exit(1);
  }
  p.intro(`Contributing ${skillName}`);
  p.log.info('This will open a pull request against anchorstack/anchorstack-skills.');

  const branch = `contrib/${skillName}-${Date.now()}`;
  try {
    execSync(`gh pr create --repo anchorstack/anchorstack-skills --head ${branch} --title "contrib: ${skillName}" --body "Contributed local changes to ${skillName} via anchorstack contribute"`, { stdio: 'inherit' });
  } catch {
    p.log.warn('Could not open PR automatically. Push your changes and open a PR at:');
    p.log.info('https://github.com/anchorstack/anchorstack-skills/pulls');
  }
  p.outro('Done.');
}
