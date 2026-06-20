import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-50: 无 token 返回 401', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_no_token_returns_401 — 无 token 返回 401', async () => {
    const res = await fetch(`http://localhost:${h.port}/`)
    expect(res.status).toBe(401)
  })

  test('test_no_token_response_body — 包含 Unauthorized', async () => {
    const res = await fetch(`http://localhost:${h.port}/`)
    const body = await res.text()
    expect(body).toContain('Unauthorized')
  })

  test('test_empty_token_returns_401 — 空 token 返回 401', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=`)
    expect(res.status).toBe(401)
  })

  test('test_wrong_token_returns_401 — 错误 token 返回 401', async () => {
    const res = await fetch(`http://localhost:${h.port}/?token=wrong`)
    expect(res.status).toBe(401)
  })

  test('test_no_auth_header_returns_401 — 无 Auth header 返回 401', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events`)
    expect(res.status).toBe(401)
  })

  // cleanup
})
