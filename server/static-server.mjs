/**
 * Servidor estático mínimo para el sitio VitePress (docs/.vitepress/dist).
 * Resuelve correctamente /ruta, /ruta.html y /ruta/index.html — lo que
 * `pm2 serve` no hace (error EISDIR en directorios como /es/).
 *
 * Uso con PM2:
 *   pm2 start server/static-server.mjs --name leaf-docs
 *   (puerto por defecto 5000; cambiar con PORT=xxxx)
 */

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_DIR = path.resolve(__dirname, '..', 'docs', '.vitepress', 'dist')
const PORT = Number(process.env.PORT ?? 5000)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
}

http
  .createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405)
      return res.end()
    }
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
    const candidates = [
      path.join(DIST_DIR, safe),
      path.join(DIST_DIR, safe + '.html'),
      path.join(DIST_DIR, safe, 'index.html'),
    ]
    for (const file of candidates) {
      if (
        file.startsWith(DIST_DIR) &&
        fs.existsSync(file) &&
        fs.statSync(file).isFile()
      ) {
        res.writeHead(200, {
          'content-type':
            MIME[path.extname(file)] ?? 'application/octet-stream',
        })
        return fs.createReadStream(file).pipe(res)
      }
    }
    const notFound = path.join(DIST_DIR, '404.html')
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    if (fs.existsSync(notFound)) fs.createReadStream(notFound).pipe(res)
    else res.end('404')
  })
  .listen(PORT, () => {
    console.log(`🌿 Leaf docs (estático) en http://0.0.0.0:${PORT}`)
    console.log(`   Sirviendo: ${DIST_DIR}`)
  })
