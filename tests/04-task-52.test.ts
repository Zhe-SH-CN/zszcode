import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-52: URL query token 认证', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_query_token_auth — query token 成功', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token}`)
    expect(res.status).toBe(200)
  })

  test('test_query_token_position_anywhere — 其他参数后也能识别', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?foo=bar&token=${h.token}`)
    expect(res.status).toBe(200)
  })

  test('test_query_token_case_sensitive — 大小写敏感', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token.toUpperCase()}`)
    expect(res.status).toBe(401)
  })

  test('test_query_token_url_encoded — URL 编码正确', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${encodeURIComponent(h.token)}`)
    expect(res.status).toBe(200)
  })

  test('test_query_token_missing_param — 无 token 参数返回 401', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?foo=bar`)
    expect(res.status).toBe(401)
  })

})
