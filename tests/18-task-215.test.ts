import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-215: 未授权 curl 返回 401', () => {
  test('test_no_token_returns_401 — 无 token 返回 401', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const res = await fetch(`http://localhost:${h.port}/`)
    expect(res.status).toBe(401)
    h.close()
  })

  test('test_wrong_token_returns_401 — 错误 token 返回 401', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const res = await fetch(`http://localhost:${h.port}/?token=wrong`)
    expect(res.status).toBe(401)
    h.close()
  })

  test('test_unauthorized_body — 响应体包含 Unauthorized', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const res = await fetch(`http://localhost:${h.port}/`)
    const body = await res.text()
    expect(body).toContain('Unauthorized')
    h.close()
  })
})
