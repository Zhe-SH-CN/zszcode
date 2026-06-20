import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-51: 有效 token 返回 200', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_valid_token_returns_200 — query token 返回 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token}`)
    expect(res.status).toBe(200)
  })

  test('test_valid_token_bearer_returns_200 — Bearer token 返回 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events`, {
      headers: { Authorization: `Bearer ${h.token}` },
    })
    expect(res.status).toBe(200)
  })

  test('test_valid_token_response_json — 返回 JSON', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token}`)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('test_valid_token_access_root — 根路径返回 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    expect(res.status).toBe(200)
  })

  test('test_valid_token_no_error_body — 无错误信息', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=${h.token}`)
    const body = await res.text()
    expect(body).not.toContain('Unauthorized')
  })

})
