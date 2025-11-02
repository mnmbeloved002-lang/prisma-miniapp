// scripts/serve-dist.js
// Простенький static-сервер для dist/ с продовыми security-заголовками.
// Запуск: node scripts/serve-dist.js

import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = normalize(join(__filename, '..', '..'));

const DIST_DIR = join(__dirname, 'dist');
const PORT = 4173;
const HOST = '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const COMMON_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // ВАЖНО: позволяем встраивание в Telegram WebView
  'X-Frame-Options': 'ALLOWALL',
  // CSP согласована с версел-конфигом
  'Content-Security-Policy':
    "default-src 'self'; " +
    "img-src * data: blob:; " +
    "media-src * blob:; " +
    "style-src 'self' 'unsafe-inline'; " +
    "script-src 'self' 'wasm-unsafe-eval' 'inline-speculation-rules'; " +
    "connect-src *; " +
    "frame-ancestors 'self' https://*.telegram.org https://web.telegram.org https://*.t.me;",
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  const safePath = normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let filePath = join(DIST_DIR, safePath);

  if (!existsSync(filePath) || (existsSync(filePath) && statSync(filePath).isDirectory())) {
    // SPA: всегда index.html
    filePath = join(DIST_DIR, 'index.html');
  }

  const ext = extname(filePath);
  const type = MIME[ext] || 'application/octet-stream';

  res.writeHead(200, { 'Content-Type': type, ...COMMON_HEADERS });
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`▶ Serving dist/ at http://localhost:${PORT}`);
});
