#!/usr/bin/env node
/**
 * Interactive picker for setup-finish.
 * Discovers all component skills, lets you select and order them,
 * optionally add custom shell commands, then outputs YAML to stdout.
 */
import * as p from '@clack/prompts';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { dump } from 'js-yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, '..', 'components');

function discoverComponents() {
  return readdirSync(COMPONENTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const skillPath = join(COMPONENTS_DIR, d.name, 'SKILL.md');
      if (!existsSync(skillPath)) return null;
      const content = readFileSync(skillPath, 'utf8');
      const descMatch = content.match(/^description:\s*(.+)$/m);
      return {
        name: d.name,
        description: descMatch?.[1]?.trim() ?? '',
      };
    })
    .filter(Boolean);
}

async function main() {
  p.intro('setup-finish — Configure your finish pipeline');

  const components = discoverComponents();

  const selected = await p.multiselect({
    message: 'Select components to include (space to toggle, enter to confirm):',
    options: components.map(c => ({
      value: c.name,
      label: c.name,
      hint: c.description,
    })),
    required: true,
  });

  if (p.isCancel(selected)) {
    p.cancel('Cancelled.');
    process.exit(1);
  }

  p.log.info(`Selected ${selected.length} component(s). Now set the order (1 = first to run).`);

  const ordered = [];
  const remaining = [...selected];

  while (remaining.length > 0) {
    const next = await p.select({
      message: `Step ${ordered.length + 1} of ${selected.length}:`,
      options: remaining.map(name => ({ value: name, label: name })),
    });
    if (p.isCancel(next)) { p.cancel('Cancelled.'); process.exit(1); }
    ordered.push({ invoke: next });
    remaining.splice(remaining.indexOf(next), 1);
  }

  const addCustom = await p.confirm({
    message: 'Add any custom shell commands?',
    initialValue: false,
  });

  if (!p.isCancel(addCustom) && addCustom) {
    let adding = true;
    while (adding) {
      const cmd = await p.text({
        message: 'Shell command (e.g. docker compose restart):',
        placeholder: 'enter command',
        validate: v => v.trim() ? undefined : 'Command cannot be empty',
      });
      if (p.isCancel(cmd)) break;

      const position = await p.select({
        message: 'Where should this run?',
        options: [
          { value: 'end',   label: 'At the end' },
          { value: 'start', label: 'At the start' },
          ...ordered.map((_, i) => ({ value: String(i + 1), label: `After step ${i + 1}` })),
        ],
      });
      if (p.isCancel(position)) break;

      const entry = { run: cmd.trim() };
      if (position === 'end') ordered.push(entry);
      else if (position === 'start') ordered.unshift(entry);
      else ordered.splice(Number(position), 0, entry);

      const more = await p.confirm({ message: 'Add another command?', initialValue: false });
      if (p.isCancel(more) || !more) adding = false;
    }
  }

  const yaml = dump({ steps: ordered }, { lineWidth: -1 });

  p.outro('Pipeline configured. Writing finish.md...');

  process.stdout.write('\n---FINISH_YAML---\n' + yaml + '---END_YAML---\n');
}

main().catch(err => { console.error(err); process.exit(1); });
