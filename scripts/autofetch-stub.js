/**
 * Stub autofetch: ничего не меняет, только сообщает о "нет изменений".
 * Выход 0 всегда.
 */
console.log('[autofetch-stub] start');
const fs = require('fs');
const path = 'public/news.json';
if (fs.existsSync(path)) {
  const s = fs.statSync(path).size;
  console.log(`[autofetch-stub] news.json present (${s} bytes)`);
} else {
  console.log('[autofetch-stub] news.json missing (ok for stub)');
}
console.log('[autofetch-stub] No changes / Skipped');
process.exit(0);
