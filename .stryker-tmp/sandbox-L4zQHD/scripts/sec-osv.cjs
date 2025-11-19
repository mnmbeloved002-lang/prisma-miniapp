#!/usr/bin/env node
// @ts-nocheck
/* sec:osv — строгий аудит зависимостей по pnpm-lock.yaml (аналог OSV для локального запуска) */

const { execSync } = require('node:child_process');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

try {
  // Локальный аналог OSV: строгий audit по lock-файлу
  run('pnpm audit --prod --audit-level=high');
} catch (error) {
  const status = (error && (error.status ?? error.code)) ?? 1;
  process.exit(typeof status === 'number' ? status : 1);
}
