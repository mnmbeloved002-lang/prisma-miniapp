// scripts/serve-dist.js
import http from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'

const distDir = resolve('dist')
const port = Number(process.env.PORT || process.env.PORT0 || 43210)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

  // Расширенный CSP для headless окружения (локально для e2e).
  const csp = [
    "default-src 'self' blob: data:",
    "script-src 'self' 'unsafe-eval' blob: data:",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join('; ')
  res.setHeader('Content-Security-Policy', csp)
}

function log(req, code, extra = '') {
  const ts = new Date().toISOString().slice(11, 19)
  console.log(`[${ts}] ${req.method} ${req.url} -> ${code}${extra ? ' ' + extra : ''}`)
}

const server = http.createServer((req, res) => {
  try {
    setSecurityHeaders(res)

    if (req.url && (req.url.endsWith('.map') || req.url.includes('/__never__/'))) {
      res.statusCode = 404
      res.end('Not found')
      log(req, 404)
      return
    }

    const reqUrl = (req.url || '/').split('?')[0]
    let filePath = join(distDir, reqUrl)
    if (reqUrl.endsWith('/')) filePath = join(filePath, 'index.html')

    if (!existsSync(filePath)) {
      if (reqUrl.startsWith('/assets/')) {
        res.statusCode = 404
        res.end('Not found')
        log(req, 404, '(asset)')
        return
      }
      filePath = join(distDir, 'index.html')
    }

    const ext = extname(filePath)
    const type = MIME[ext] || 'application/octet-stream'
    res.setHeader('Content-Type', type)

    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.setHeader('Pragma', 'no-cache')
      res.setHeader('Expires', '0')
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    }

    const stream = createReadStream(filePath)
    stream.on('open', () => log(req, 200))
    stream.on('error', () => {
      res.statusCode = 404
      res.end('Not found')
      log(req, 404, '(stream error)')
    })
    stream.pipe(res)
  } catch {
    res.statusCode = 500
    res.end('Internal Server Error')
    log(req, 500)
  }
})

server.listen(port, () => {
  console.log(`▶ Serving dist/ at http://localhost:${port}`)
})
