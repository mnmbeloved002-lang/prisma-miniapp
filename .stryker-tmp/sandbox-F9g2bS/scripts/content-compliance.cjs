#!/usr/bin/env node
// @ts-nocheck
// CONTENT COMPLIANCE GATE (C.C.G.)
// Проверяет целостность контента, контракт данных и ограничивает PR.
// MUST: [Контракт, Allow-list, Diff Limit, 0 новостей]

const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const path = require('path');

// --- Configuration ---
const MAX_ALLOWED_DIFF_SIZE = 5000; // Макс. 5 КБ чистого добавления/удаления строк в контенте
const NEWS_FILE_PATH = 'public/news.json';
// Разрешаем изменение ТОЛЬКО этих файлов в Content PR
const ALLOWED_FILES_REGEX = [
  /^public\/news\.json$/,
  /^docs\/checksums\/chain\.log$/,
  /^docs\/architecture\/.*$/,
  /^docs\/runbooks\/.*$/,
  /^docs\/adr\/.*$/,
  /^\.github\/workflows\/.*\.yml$/,
  /^scripts\/content-compliance\.cjs$/, // Разрешаем самому себе обновляться
];

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' }).trim();
}

try {
  console.log('--- [72] Content Compliance Gate Start ---');

  // 1. Allow-list файлов и лимиты Diff
  // Получаем список измененных файлов, сравнивая HEAD с предыдущим коммитом
  // NOTE: Для первого коммита в PR HEAD^ может не существовать, что приведет к ошибке!
  // В CI это решается fetch-depth: 2 в workflow.
  const changedFiles = run('git diff --name-only HEAD^ HEAD').split('\n').filter(Boolean);
  const untrackedFiles = run('git ls-files --others --exclude-standard').split('\n').filter(Boolean);
  const allChangedFiles = [...new Set([...changedFiles, ...untrackedFiles])];

  let diffLines = 0;
  let isOnlyAllowedFiles = true;

  for (const file of allChangedFiles) {
    // Проверка, что файл разрешен
    const isAllowed = ALLOWED_FILES_REGEX.some(regex => regex.test(file));
    if (!isAllowed) {
      isOnlyAllowedFiles = false;
      console.error(`[🛑 FAIL] Нарушение allow-list: Изменён неразрешенный файл: ${file}`);
    }

    // Если это контент, считаем diff size
    if (file === NEWS_FILE_PATH) {
      // Используем git diff --numstat для оценки размера изменения
      // [Added] \t [Deleted] \t [Filename]
      const stats = run(`git diff --numstat HEAD^ HEAD -- ${file}`);
      const [added, deleted] = stats.split('\t').map(Number);
      diffLines = added + deleted;
      console.log(`[INFO] Diff size для ${file}: +${added} / -${deleted} линий`);
    }
  }

  // Enforcement: Allow-list
  if (!isOnlyAllowedFiles) {
    throw new Error('PR содержит изменения в неразрешенных файлах. Запрещено смешивание контента и кода/конфигов.');
  }

  // Enforcement: Diff Limit
  if (diffLines > MAX_ALLOWED_DIFF_SIZE) {
    throw new Error(`[🛑 FAIL] Превышен лимит изменения контента: ${diffLines} строк (лимит: ${MAX_ALLOWED_DIFF_SIZE}).`);
  }
  console.log('[✅ PASS] Allow-list и Diff Limit соблюдены.');

  // 2. Контракт данных и "0 новостей"
  
  // A. Проверка контракта (вызов существующего скрипта)
  // Мы запускаем ваш существующий validate-news.cjs, который сам упадет, если схема нарушена.
  console.log('[INFO] Запуск валидации контракта (news.json)...');
  const validateOutput = run(`node scripts/validate-news.cjs ${NEWS_FILE_PATH}`);
  console.log(`[INFO] Валидатор: ${validateOutput.split('\n').slice(-1)}`);

  // B. Проверка "0 новостей"
  const newsContent = JSON.parse(readFileSync(NEWS_FILE_PATH, 'utf-8'));
  const newsCount = newsContent.length;

  if (newsCount === 0) {
    throw new Error('[🛑 FAIL] Найден "0 новостей" в финальном news.json. Это ошибка ingestion-пайплайна.');
  }
  
  console.log(`[✅ PASS] Контракт данных соблюден. Найдено ${newsCount} новостей.`);


} catch (error) {
  console.error(`\n--- [72] Content Compliance Gate FAILED ---`);
  console.error(error.message);
  process.exit(1); // Ломаем CI
}

console.log('--- [72] Content Compliance Gate PASS ---');
process.exit(0);
