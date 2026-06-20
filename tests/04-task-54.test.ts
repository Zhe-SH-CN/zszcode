import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-54: GET / 返回 index.html', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_root_returns_html — 返回 HTML', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    const body = await res.text()
    expect(body).toContain('<html')
  })

  test('test_root_content_type_html — Content-Type text/html', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    expect(res.headers.get('content-type')).toContain('text/html')
  })

  test('test_root_has_doctype — 包含 DOCTYPE', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    const body = await res.text()
    expect(body).toContain('<!DOCTYPE html>')
  })

  test('test_root_has_root_div — 包含 root div', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    const body = await res.text()
    expect(body).toContain('id="root"')
  })

  test('test_root_status_200 — 状态码 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    expect(res.status).toBe(200)
  })

})
