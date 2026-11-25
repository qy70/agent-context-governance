#!/usr/bin/env node
/**
 * Zero-dependency workspace governance and Markdown link checker.
 * Validates AGENTS protocol presence, 3-file topic knowledge bases,
 * and broken relative links across Markdown files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REQUIRED_TOP_FILES = ['README.md', 'LICENSE'];
const REQUIRED_KB_FILES = ['manual.md', 'README.md', 'notes.md'];

let passed = 0;
const failures = [];

function check(condition, label, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${label}`);
  } else {
    failures.push(`${label}${detail ? `: ${detail}` : ''}`);
    console.error(`FAIL  ${label}${detail ? ` -> ${detail}` : ''}`);
  }
}

for (const rel of REQUIRED_TOP_FILES) {
  const p = path.join(ROOT, rel);
  check(fs.existsSync(p) && fs.statSync(p).size > 0, `Top-level file exists: ${rel}`);
}

const agentsFile = ['AGENTS.md', 'AGENTS.template.md'].find((name) =>
  fs.existsSync(path.join(ROOT, name))
);
check(Boolean(agentsFile), 'Governance contract exists (AGENTS.md or AGENTS.template.md)');

const kbRoot = path.join(ROOT, 'knowledge-base');
check(fs.existsSync(kbRoot) && fs.statSync(kbRoot).isDirectory(), 'knowledge-base/ directory exists');

if (fs.existsSync(kbRoot)) {
  const topics = fs
    .readdirSync(kbRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('.') && !d.name.startsWith('_'));
  check(topics.length > 0, 'At least one topic KB exists');

  for (const t of topics) {
    const tDir = path.join(kbRoot, t.name);
    for (const f of REQUIRED_KB_FILES) {
      const fp = path.join(tDir, f);
      check(fs.existsSync(fp) && fs.statSync(fp).size > 0, `Topic [${t.name}] has ${f}`);
    }
  }
}

function collectMarkdownFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdownFiles(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

const mdFiles = collectMarkdownFiles(ROOT);
const LINK_RE = /\[[^\]]*\]\(([^)]+)\)/g;

for (const mdPath of mdFiles) {
  const raw = fs.readFileSync(mdPath, 'utf8');
  let broken = 0;
  for (const match of raw.matchAll(LINK_RE)) {
    const target = match[1].trim().split('#')[0];
    if (!target || /^(https?:|mailto:|tel:)/i.test(target)) continue;
    const resolved = path.resolve(path.dirname(mdPath), target);
    if (!fs.existsSync(resolved)) {
      broken += 1;
      failures.push(`Broken link in ${path.relative(ROOT, mdPath)}: ${match[1]}`);
    }
  }
  check(broken === 0, `Markdown links valid: ${path.relative(ROOT, mdPath)}`);
}

console.log(`\nSummary: ${passed} passed, ${failures.length} failed.`);
if (failures.length > 0) process.exit(1);
