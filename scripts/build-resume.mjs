#!/usr/bin/env node
/**
 * Print scripts/resume/resume.html to public/Tien-Nguyen-CV.pdf via Chrome headless.
 */
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'scripts/resume/resume.html');
const outPath = join(root, 'public/Tien-Nguyen-CV.pdf');
const tmpPath = join(root, 'scripts/resume/Tien-Nguyen-CV.pdf');

const chrome =
  process.env.CHROME_PATH ||
  ['/usr/local/bin/google-chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) =>
    existsSync(p),
  );

if (!chrome) {
  console.error('Chrome/Chromium not found. Set CHROME_PATH.');
  process.exit(1);
}

if (!existsSync(htmlPath)) {
  console.error(`Missing ${htmlPath}`);
  process.exit(1);
}

mkdirSync(dirname(tmpPath), { recursive: true });
const fileUrl = pathToFileURL(htmlPath).href;
const profileDir = mkdtempSync(join(tmpdir(), 'resume-chrome-'));

const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-background-networking',
    '--allow-file-access-from-files',
    `--user-data-dir=${profileDir}`,
    '--virtual-time-budget=8000',
    `--print-to-pdf=${tmpPath}`,
    '--no-pdf-header-footer',
    fileUrl,
  ],
  { encoding: 'utf8', timeout: 45000 },
);

try {
  rmSync(profileDir, { recursive: true, force: true });
} catch {
  // ignore cleanup failures
}

if (result.status !== 0 || !existsSync(tmpPath)) {
  console.error(result.stderr || result.stdout || 'Chrome print failed');
  process.exit(result.status || 1);
}

copyFileSync(tmpPath, outPath);
console.log(`Wrote ${outPath}`);
