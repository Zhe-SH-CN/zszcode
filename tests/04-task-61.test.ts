import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-61: WebSocket 无 token 被拒', () => {
  test('test_ws_no_token_rejected — 无 token 被拒', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const ws = new WebSocket(`ws://localhost:${h.port}/ws`)
    await new Promise<void>((resolve) => {
      ws.onclose = () => resolve()
      ws.onerror = () => resolve()
      setTimeout(() => resolve(), 2000)
    })
    expect(ws.readyState).not.toBe(WebSocket.OPEN)
    h.close()
  })

  test('test_ws_wrong_token_rejected — 错误 token 被拒', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=wrong`)
    await new Promise<void>((resolve) => {
      ws.onclose = () => resolve()
      ws.onerror = () => resolve()
      setTimeout(() => resolve(), 2000)
    })
    expect(ws.readyState).not.toBe(WebSocket.OPEN)
    h.close()
  })

  test('test_ws_valid_token_still_works — 有效 token 仍能连', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=${h.token}`)
    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => resolve()
      ws.onerror = (e) => reject(e)
      setTimeout(() => reject(new Error('timeout')), 3000)
    })
    expect(ws.readyState).toBe(WebSocket.OPEN)
    ws.close()
    h.close()
  })
})
