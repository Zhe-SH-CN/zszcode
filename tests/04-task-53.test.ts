import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-53: Bearer token 认证', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_bearer_auth_success — Bearer 成功', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events`, {
      headers: { Authorization: `Bearer ${h.token}` },
    })
    expect(res.status).toBe(200)
  })

  test('test_bearer_auth_case_sensitive_prefix — 小写 bearer 也支持', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events`, {
      headers: { authorization: `bearer ${h.token}` },
    })
    expect(res.status).toBe(200)
  })

  test('test_bearer_auth_no_space — 无空格失败', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events`, {
      headers: { Authorization: `Bearer${h.token}` },
    })
    expect(res.status).toBe(401)
  })

  test('test_bearer_auth_empty_value — 空值失败', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events`, {
      headers: { Authorization: 'Bearer ' },
    })
    expect(res.status).toBe(401)
  })

  test('test_bearer_auth_other_scheme — Basic 失败', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events`, {
      headers: { Authorization: 'Basic dXNlcjpwYXNz' },
    })
    expect(res.status).toBe(401)
  })

})
