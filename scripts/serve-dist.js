// scripts/serve-dist.js (ESM)
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = normalize(join(fileURLToPath(import.meta.url), '..', '..'));
const distDir = join(__dirname, 'dist');
const port = process.env.PORT ? Number(process.env.PORT) : 4173;
const host = process.env.HOST || '127.0.0.1';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

const ASSET_CACHE = 'public, max-age=31536000, immutable';
const HTML_NOCACHE = 'no-store, no-cache, must-revalidate, proxy-revalidate';

function isAsset(p) {
  const e = extname(p);
  return e && e !== '.html';
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), interest-cohort=()'
  );
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join('; ')
  );
}

function serve(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';

    const filePath = normalize(join(distDir, pathname));
    if (!filePath.startsWith(distDir)) {
      res.writeHead(403); return res.end('Forbidden');
    }

    setSecurityHeaders(res);

    // Строгая политика выдачи карт sourcemap — прячем
    if (pathname.endsWith('.map')) {
      res.writeHead(404); return res.end('Not found');
    }

    if (!existsSync(filePath)) {
      // Для SPA: только если просят корень — выдаём index.html
      if (!isAsset(pathname)) {
        const indexPath = join(distDir, 'index.html');
        const stat = statSync(indexPath);
        res.writeHead(200, {
          'Content-Type': MIME['.html'],
          'Cache-Control': HTML_NOCACHE,
          'Content-Length': stat.size,
        });
        return createReadStream(indexPath).pipe(res);
      }
      res.writeHead(404); return res.end('Not found');
    }

    const ext = extname(filePath);
    const stat = statSync(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': isAsset(pathname) ? ASSET_CACHE : HTML_NOCACHE,
      'Content-Length': stat.size,
    });
    createReadStream(filePath).pipe(res);
  } catch (e) {
    res.writeHead(500); res.end('Internal Server Error');
  }
}

createServer(serve).listen(port, host, () => {
  console.log(`▶ Serving dist/ at http://${host}:${port}`);
});
