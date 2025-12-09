const fs = require('fs');
const path = require('path');

// --- НАСТРОЙКИ V3 ---
const OUTPUT_FILE = 'ai-full-dump.json';
const MAX_FILE_SIZE_KB = 100; // Пропускаем файлы больше 100КБ (обычно это минифицированный код)

// ЧЕРНЫЙ СПИСОК (Жесткий бан для мусора)
const FORBIDDEN_PATHS = [
  '.pnpm-store', // <--- ГЛАВНЫЙ ВИНОВНИК (Склад библиотек)
  'node_modules', // Библиотеки JS
  'vendor', // Библиотеки PHP
  '.git', // История версий
  '.idea', // Настройки PHPStorm
  '.vscode', // Настройки VSCode
  'dist', // Сборка
  'build', // Сборка
  'coverage', // Отчеты тестов
  '.next',
  '.nuxt',
  '.output',
  'storage/framework', // Кеш Laravel
  'storage/logs', // Логи
  'public/assets',
  'package-lock.json',
  'composer.lock',
  'pnpm-lock.yaml',
  'yarn.lock',
];

// БЕЛЫЙ СПИСОК (Только исходный код и конфиги)
const ALLOWED_EXTENSIONS = [
  // PHP / Laravel
  '.php',
  '.blade.php',
  // JS / Frontend
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.vue',
  '.svelte',
  // Configs
  '.json',
  '.xml',
  '.yml',
  '.yaml',
  '.toml',
  '.env.example',
  // Docker / System
  'Dockerfile',
  'Makefile',
  '.htaccess',
  '.conf',
  // Docs
  '.md',
  '.txt',
  // Styles (если нужны)
  '.css',
  '.scss',
  '.sass',
  '.less',
];

// Статистика
let stats = {
  processed: 0,
  skipped_path: 0,
  skipped_size: 0,
};

// Проверка пути на "Запрещенку"
function shouldIgnore(fullPath) {
  const relative = path.relative(process.cwd(), fullPath);

  // Проверяем каждое звено пути
  // Например: если путь "app/.pnpm-store/file", он будет заблокирован
  const parts = relative.split(path.sep);

  for (const part of parts) {
    if (FORBIDDEN_PATHS.includes(part)) return true;
    // Блокируем скрытые папки (начинаются с точки), кроме текущей
    if (part.startsWith('.') && part !== '.' && !['.env.example', '.github'].includes(part)) {
      // Но разрешаем .github (там Actions)
      if (part !== '.github') return true;
    }
  }
  return false;
}

function getAllFiles(dirPath, arrayOfFiles) {
  let files = [];
  try {
    files = fs.readdirSync(dirPath);
  } catch (e) {
    return arrayOfFiles || [];
  }

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    const relative = path.relative(process.cwd(), fullPath);

    // Пропускаем сам скрипт и результат
    if (file === OUTPUT_FILE || file.endsWith('ai-packer.cjs')) return;

    // Если это папка
    if (fs.statSync(fullPath).isDirectory()) {
      if (!shouldIgnore(fullPath)) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        stats.skipped_path++;
      }
    }
    // Если это файл
    else {
      if (shouldIgnore(fullPath)) {
        stats.skipped_path++;
        return;
      }

      const ext = path.extname(file).toLowerCase();
      const fileName = path.basename(file);

      // Проверяем расширение ИЛИ точное имя файла (для Dockerfile, Makefile)
      const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);
      const isAllowedName = ALLOWED_EXTENSIONS.includes(fileName); // хак для файлов без расширения

      if (isAllowedExt || isAllowedName) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

console.log('🧹 V3: Запуск с блокировкой .pnpm-store...');

try {
  const allFilePaths = getAllFiles(process.cwd());
  const filesData = [];
  let structure = {};

  console.log(`🔎 Найдено чистых файлов кода: ${allFilePaths.length}`);

  allFilePaths.forEach((filePath) => {
    try {
      const fileStat = fs.statSync(filePath);
      const fileSizeKB = fileStat.size / 1024;

      if (fileSizeKB > MAX_FILE_SIZE_KB) {
        filesData.push({
          path: path.relative(process.cwd(), filePath),
          content: `[SKIPPED: Too large (${Math.round(fileSizeKB)}KB)]`,
        });
        stats.skipped_size++;
      } else {
        const content = fs.readFileSync(filePath, 'utf8');
        filesData.push({
          path: path.relative(process.cwd(), filePath),
          content: content,
        });

        // Строим дерево
        const relative = path.relative(process.cwd(), filePath);
        const parts = relative.split(path.sep);
        if (parts.length > 1) {
          const rootDir = parts[0];
          if (!structure[rootDir]) structure[rootDir] = [];
          if (!structure[rootDir].includes(parts[1])) structure[rootDir].push(parts[1]);
        }
      }
    } catch (err) {}
  });

  const output = {
    meta: { generated_at: new Date().toISOString() },
    structure: structure,
    files: filesData,
  };

  const jsonString = JSON.stringify(output, null, 2);
  fs.writeFileSync(OUTPUT_FILE, jsonString);
  const sizeMB = (jsonString.length / 1024 / 1024).toFixed(2);

  console.log('--------------------------------------');
  console.log(`✅ Победа! Файл: ${OUTPUT_FILE}`);
  console.log(`📉 Размер: ${sizeMB} MB (Должно быть мало!)`);
  console.log(`📄 Файлов: ${filesData.length}`);
} catch (e) {
  console.error('Ошибка:', e);
}
