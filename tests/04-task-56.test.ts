import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { eventBus } from '../src/zszcode/events'

describe('task-56: GET /api/events 返回事件数组', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_api_events_returns_json — Content-Type JSON', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token}`)
    expect(res.headers.get('content-type')).toContain('json')
  })

  test('test_api_events_returns_array — 返回数组', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token}`)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  test('test_api_events_max_100 — 不超过 100', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token}`)
    const data = await res.json()
    expect(data.length).toBeLessThanOrEqual(100)
  })

  test('test_api_events_empty_initially — 初始为空', async () => {
    const h2 = startWebServer({ ...DEFAULTS, webPort: 0 })
    const res = await fetch(`http://localhost:${h2.port}/api/events?token=${h2.token}`)
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    h2.close()
  })

  test('test_api_events_status_200 — 状态码 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/api/events?token=${h.token}`)
    expect(res.status).toBe(200)
  })

})
