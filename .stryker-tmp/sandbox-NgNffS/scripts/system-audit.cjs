#!/usr/bin/env node
// @ts-nocheck

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== ПОЛНЫЙ СИСТЕМНЫЙ АУДИТ ===');
console.log('Дата: 2025-11-11\n');

let errors = [];
let warnings = [];
let passed = [];

// 1. Проверка структуры проекта
console.log('1. 📁 ПРОВЕРКА СТРУКТУРЫ ПРОЕКТА');
console.log('---------------------------------');

const requiredDirs = [
  'docs', 'docs/uat', 'docs/ops', 'docs/qa', 'docs/schema', 
  'docs/security', 'docs/runbooks', 'docs/ci', 'docs/perf',
  'scripts', 'public', 'archive/backups', 'docs/checksums'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    passed.push(`✅ Директория ${dir} существует`);
  } else {
    errors.push(`❌ Директория ${dir} отсутствует`);
  }
});

// 2. Проверка всех JSON файлов на валидность
console.log('\n2. 📄 ПРОВЕРКА ВАЛИДНОСТИ JSON ФАЙЛОВ');
console.log('-------------------------------------');

const jsonFiles = [
  'public/news.json',
  'docs/fetch/normalized-news.json',
  'docs/fetch/last-fetch.json',
  'docs/schema/news-schema.json'
];

jsonFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      JSON.parse(content);
      passed.push(`✅ ${file} - валидный JSON`);
    } catch (e) {
      errors.push(`❌ ${file} - невалидный JSON: ${e.message}`);
    }
  } else {
    warnings.push(`⚠️  ${file} - файл отсутствует`);
  }
});

// 3. Проверка всех скриптов на синтаксические ошибки
console.log('\n3. 🔧 ПРОВЕРКА СИНТАКСИСА СКРИПТОВ');
console.log('----------------------------------');

const scripts = [
  'scripts/validate-news.cjs',
  'scripts/dqm-validator.cjs',
  'scripts/fetch-news-stub.cjs',
  'scripts/normalize-news.cjs',
  'scripts/create-backup.cjs',
  'scripts/restore-backup.cjs',
  'scripts/integrity-chain.cjs',
  'scripts/metrics-collector.cjs',
  'scripts/quality-audit.cjs',
  'scripts/quality-audit-fixed.cjs',
  'scripts/system-audit.cjs'
];

scripts.forEach(script => {
  if (fs.existsSync(script)) {
    try {
      // Проверяем синтаксис через node --check
      execSync(`node --check ${script}`, { stdio: 'pipe' });
      passed.push(`✅ ${script} - синтаксис корректен`);
    } catch (e) {
      errors.push(`❌ ${script} - синтаксическая ошибка: ${e.message}`);
    }
  } else {
    warnings.push(`⚠️  ${script} - скрипт отсутствует`);
  }
});

// 4. Проверка зависимостей package.json
console.log('\n4. 📦 ПРОВЕРКА ЗАВИСИМОСТЕЙ');
console.log('---------------------------');

if (fs.existsSync('package.json')) {
  try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Проверяем обязательные скрипты
    const requiredScripts = ['test', 'start', 'dev'];
    requiredScripts.forEach(script => {
      if (pkg.scripts && pkg.scripts[script]) {
        passed.push(`✅ package.json scripts.${script} - существует`);
      } else {
        warnings.push(`⚠️  package.json scripts.${script} - отсутствует`);
      }
    });
    
    // Проверяем основные зависимости
    if (pkg.dependencies) {
      passed.push(`✅ dependencies - настроены (${Object.keys(pkg.dependencies).length} пакетов)`);
    }
    
    if (pkg.devDependencies) {
      passed.push(`✅ devDependencies - настроены (${Object.keys(pkg.devDependencies).length} пакетов)`);
    }
    
  } catch (e) {
    errors.push(`❌ package.json - ошибка чтения: ${e.message}`);
  }
} else {
  errors.push('❌ package.json - отсутствует');
}

// 5. Проверка целостности данных
console.log('\n5. 🛡️ ПРОВЕРКА ЦЕЛОСТНОСТИ ДАННЫХ');
console.log('--------------------------------');

// Проверяем бэкапы
try {
  const backups = fs.readdirSync('archive/backups');
  if (backups.length > 0) {
    passed.push(`✅ Бэкапы - ${backups.length} файлов найдено`);
    
    // Проверяем последний бэкап
    const lastBackup = backups.sort().reverse()[0];
    const backupPath = path.join('archive/backups', lastBackup);
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    JSON.parse(backupContent);
    passed.push(`✅ Последний бэкап (${lastBackup}) - валидный JSON`);
  } else {
    warnings.push('⚠️  Бэкапы - нет файлов бэкапов');
  }
} catch (e) {
  errors.push(`❌ Бэкапы - ошибка доступа: ${e.message}`);
}

// Проверяем integrity chain
if (fs.existsSync('docs/checksums/chain.log')) {
  try {
    const chain = fs.readFileSync('docs/checksums/chain.log', 'utf8');
    const lines = chain.trim().split('\n').filter(line => line);
    if (lines.length > 0) {
      passed.push(`✅ Integrity chain - ${lines.length} записей`);
    } else {
      warnings.push('⚠️  Integrity chain - пустой файл');
    }
  } catch (e) {
    errors.push(`❌ Integrity chain - ошибка чтения: ${e.message}`);
  }
} else {
  warnings.push('⚠️  Integrity chain - файл отсутствует');
}

// 6. Проверка документации
console.log('\n6. 📚 ПРОВЕРКА ДОКУМЕНТАЦИИ');
console.log('---------------------------');

const requiredDocs = [
  'docs/FINAL-PROJECT-REPORT.md',
  'docs/uat/phase2-uat-checklist.md',
  'docs/uat/phase2-uat-report-2025-11-11.md',
  'docs/ops/monthly-retro-cadence.md',
  'docs/schema/news-data-contract.md',
  'docs/qa/data-quality-thresholds.md',
  'docs/security/rbac-policy.md',
  'docs/runbooks/kill-switch.md'
];

requiredDocs.forEach(doc => {
  if (fs.existsSync(doc)) {
    const stats = fs.statSync(doc);
    if (stats.size > 100) {
      passed.push(`✅ ${doc} - существует (${stats.size} bytes)`);
    } else {
      warnings.push(`⚠️  ${doc} - слишком маленький (${stats.size} bytes)`);
    }
  } else {
    errors.push(`❌ ${doc} - отсутствует`);
  }
});

// 7. Функциональное тестирование ключевых скриптов
console.log('\n7. 🧪 ФУНКЦИОНАЛЬНОЕ ТЕСТИРОВАНИЕ');
console.log('--------------------------------');

// Тестируем валидацию
try {
  const validateOutput = execSync('node scripts/validate-news.cjs public/news.json', { encoding: 'utf8' });
  if (validateOutput.includes('✅')) {
    passed.push('✅ Валидатор - работает корректно');
  } else {
    warnings.push('⚠️  Валидатор - возможные проблемы в выводе');
  }
} catch (e) {
  errors.push(`❌ Валидатор - ошибка выполнения: ${e.message}`);
}

// Тестируем DQM
try {
  const dqmOutput = execSync('node scripts/dqm-validator.cjs public/news.json', { encoding: 'utf8' });
  if (dqmOutput.includes('Проверка качества данных')) {
    passed.push('✅ DQM валидатор - работает');
  }
} catch (e) {
  warnings.push(`⚠️  DQM валидатор - ошибка выполнения: ${e.message}`);
}

// Тестируем создание бэкапа
try {
  execSync('node scripts/create-backup.cjs', { stdio: 'pipe' });
  passed.push('✅ Создание бэкапа - работает');
} catch (e) {
  errors.push(`❌ Создание бэкапа - ошибка: ${e.message}`);
}

// 8. Сводный отчет
console.log('\n8. 📊 СВОДНЫЙ ОТЧЕТ АУДИТА');
console.log('--------------------------');

console.log(`✅ ВЫПОЛНЕНО: ${passed.length}`);
console.log(`⚠️  ПРЕДУПРЕЖДЕНИЯ: ${warnings.length}`);
console.log(`❌ ОШИБКИ: ${errors.length}`);

// Выводим ошибки
if (errors.length > 0) {
  console.log('\n🚨 КРИТИЧЕСКИЕ ОШИБКИ:');
  errors.forEach(error => console.log(`   ${error}`));
}

// Выводим предупреждения
if (warnings.length > 0) {
  console.log('\n📝 ПРЕДУПРЕЖДЕНИЯ:');
  warnings.forEach(warning => console.log(`   ${warning}`));
}

// Выводим успешные проверки (первые 10)
if (passed.length > 0) {
  console.log('\n✅ УСПЕШНЫЕ ПРОВЕРКИ:');
  passed.slice(0, 10).forEach(pass => console.log(`   ${pass}`));
  if (passed.length > 10) {
    console.log(`   ... и ещё ${passed.length - 10} проверок`);
  }
}

// Итоговый статус
console.log('\n🎯 ИТОГОВЫЙ СТАТУС:');
if (errors.length === 0 && warnings.length === 0) {
  console.log('🟢 ОТЛИЧНО - система полностью готова к работе');
} else if (errors.length === 0) {
  console.log('🟡 ХОРОШО - система готова,但有 незначительные замечания');
} else if (errors.length < 5) {
  console.log('🟠 ТРЕБУЕТСЯ ВНИМАНИЕ - есть критические ошибки для исправления');
} else {
  console.log('🔴 КРИТИЧЕСКОЕ СОСТОЯНИЕ - требуется срочное исправление ошибок');
}

console.log('\n=== АУДИТ ЗАВЕРШЕН ===');
