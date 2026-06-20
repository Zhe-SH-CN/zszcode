import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-213: curl Web 服务器返回 HTML', () => {
  test('test_web_server_returns_html — 返回 HTML', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    expect(res.status).toBe(200)
    const body = await res.text()
    expect(body).toContain('<!DOCTYPE html>')
    expect(body).toContain('ZSZCode')
    h.close()
  })

  test('test_web_server_content_type — Content-Type text/html', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    expect(res.headers.get('content-type')).toContain('text/html')
    h.close()
  })
})
