import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-57: POST /api/permission/resolve', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_permission_resolve_returns_ok — 返回 ok', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/permission/resolve?token=${h.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolUseId: 'test-123', decision: 'allow' }),
    })
    const data = await res.json()
    expect(data.ok).toBe(true)
  })

  test('test_permission_resolve_status_200 — 状态码 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/permission/resolve?token=${h.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolUseId: 'test-456', decision: 'deny' }),
    })
    expect(res.status).toBe(200)
  })

  test('test_permission_resolve_unknown_id — 未知 ID 不报错', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/permission/resolve?token=${h.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolUseId: 'unknown', decision: 'allow' }),
    })
    expect(res.status).toBe(200)
  })

  test('test_permission_resolve_content_type — JSON 响应', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/permission/resolve?token=${h.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolUseId: 'x', decision: 'allow' }),
    })
    expect(res.headers.get('content-type')).toContain('json')
  })

})
