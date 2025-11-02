// ESM-версия, т.к. в package.json "type": "module"
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, '..', 'dist');
const port = process.env.PORT ? Number(process.env.PORT) : 4173;

const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join('; ');

const headersBase = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

const mime = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html; charset=utf-8';
    case '.js': return 'text/javascript; charset=utf-8';
    case '.css': return 'text/css; charset=utf-8';
    case '.json': return 'application/json; charset=utf-8';
    case '.svg': return 'image/svg+xml';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.ico': return 'image/x-icon';
    case '.map': return 'application/json; charset=utf-8';
    default: return 'application/octet-stream';
  }
};

function send(res, status, body, extra = {}) {
  const h = { ...headersBase, ...extra };
  res.writeHead(status, h);
  if (body !== undefined) res.end(body);
  else res.end();
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, buf) => {
    if (err) {
      if (err.code === 'ENOENT') return send(res, 404, 'Not found');
      return send(res, 500, 'Internal error');
    }
    send(res, 200, buf, {
      'Content-Type': mime(filePath),
      'Cache-Control': filePath.includes('/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'no-store',
    });
  });
}

const server = http.createServer((req, res) => {
  try {
    const url = decodeURI((req.url || '').split('?')[0]);

    // Блокируем sourcemaps
    if (url.endsWith('.map')) return send(res, 404, 'Not found');

    // Отдаём ассеты
    if (url.startsWith('/assets/')) {
      return serveFile(res, path.join(distDir, url));
    }

    // Файлы у корня dist
    const candidate = path.join(distDir, url);
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return serveFile(res, candidate);
    }

    // SPA fallback
    return serveFile(res, path.join(distDir, 'index.html'));
  } catch {
    return send(res, 500, 'Internal error');
  }
});

// ... остальной файл без изменений ...

const host = '127.0.0.1';
server.on('error', (err) => {
  console.error('[serve-dist] server error:', err);
  // Явно выходим, чтобы Playwright увидел неуспех старта
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(`▶ Serving dist/ at http://${host}:${port}`);
});
