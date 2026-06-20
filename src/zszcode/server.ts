import { randomBytes } from 'crypto'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, extname } from 'path'
import type { ZszCodeConfig } from './config'
import { eventBus } from './events'

export interface WebServerHandle {
  port: number
  token: string
  url: string
  close: () => void
}

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const MAX_PORT_ATTEMPTS = 100

function generateToken(): string {
  return randomBytes(24).toString('hex')
}

function extractToken(url: URL, headers: Headers): string | null {
  const queryToken = url.searchParams.get('token')
  if (queryToken) return queryToken

  const auth = headers.get('Authorization')
  if (auth) {
    const match = auth.match(/^Bearer\s+(.+)$/i)
    if (match) return match[1]
  }

  return null
}

export function startWebServer(config: ZszCodeConfig): WebServerHandle {
  const token = generateToken()
  let server: ReturnType<typeof Bun.serve>
  const wsClients = new Set<any>()
  const pendingPermissions = new Map<string, { resolve: (d: string) => void; timer: ReturnType<typeof setTimeout> }>()
  const webDist = join(process.cwd(), 'web', 'dist')

  const startPort = config.webPort === 0 ? 0 : config.webPort
  const maxAttempts = config.webPort === 0 ? 1 : MAX_PORT_ATTEMPTS

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const port = startPort === 0 ? 0 : startPort + attempt
    try {
      server = Bun.serve({
        port,
        fetch(req, srv) {
          const url = new URL(req.url)

          // WebSocket upgrade
          if (url.pathname === '/ws') {
            const clientToken = extractToken(url, req.headers)
            if (clientToken !== token) {
              return new Response('Unauthorized', { status: 401 })
            }
            if (srv.upgrade(req)) {
              return undefined
            }
            return new Response('WebSocket upgrade failed', { status: 500 })
          }

          // Token auth: required for root path, API, and WebSocket; not for static assets
          const reqToken = extractToken(url, req.headers)
          const hasFileExtension = /\.\w+$/.test(url.pathname)
          const isApiRoute = url.pathname.startsWith('/api/')

          if (!hasFileExtension && reqToken !== token) {
            return new Response('Unauthorized', { status: 401 })
          }

          // API routes
          if (url.pathname === '/api/events') {
            return Response.json(eventBus.getHistory(100))
          }

          if (url.pathname === '/api/permission/resolve' && req.method === 'POST') {
            return req.json().then((body: any) => {
              const { toolUseId, decision } = body
              const pending = pendingPermissions.get(toolUseId)
              if (pending) {
                clearTimeout(pending.timer)
                pending.resolve(decision)
                pendingPermissions.delete(toolUseId)
              }
              return Response.json({ ok: true })
            })
          }

          // Static files
          let filePath = join(webDist, url.pathname === '/' ? 'index.html' : url.pathname)
          if (!filePath.startsWith(webDist)) {
            return new Response('Forbidden', { status: 403 })
          }
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            const ext = extname(filePath)
            const mime = MIME_TYPES[ext] || 'application/octet-stream'
            return new Response(readFileSync(filePath), {
              headers: { 'Content-Type': mime },
            })
          }

          // SPA fallback — only for top-level navigation paths (no dots, no deep paths)
          const segments = url.pathname.split('/').filter(Boolean)
          if (segments.length === 1 && !segments[0].includes('.')) {
            const indexPath = join(webDist, 'index.html')
            if (existsSync(indexPath)) {
              return new Response(readFileSync(indexPath), {
                headers: { 'Content-Type': 'text/html' },
              })
            }
          }

          return new Response('Not Found', { status: 404 })
        },
        websocket: {
          open(ws) {
            wsClients.add(ws)
          },
          close(ws) {
            wsClients.delete(ws)
          },
          message() {},
        },
      })

      // Broadcast events to WebSocket clients
      const unsubEventBus = eventBus.onEvent((event) => {
        const json = JSON.stringify(event)
        for (const ws of wsClients) {
          try { ws.send(json) } catch {}
        }
      })

      const handle: WebServerHandle = {
        port: server.port,
        token,
        url: `http://localhost:${server.port}?token=${token}`,
        close: () => {
          unsubEventBus()
          for (const ws of wsClients) {
            try { ws.close() } catch {}
          }
          wsClients.clear()
          server.stop()
        },
      }

      return handle
    } catch {
      continue
    }
  }

  throw new Error('No available port found')
}
