import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-214: WebSocket 连接成功', () => {
  test('test_ws_connects — WebSocket 连接成功', async () => {
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

  test('test_ws_receives_events — 收到事件广播', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const { eventBus } = await import('../src/zszcode/events')
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=${h.token}`)
    const received = await new Promise<string>((resolve, reject) => {
      ws.onopen = () => {
        eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
      }
      ws.onmessage = (e) => resolve(e.data as string)
      ws.onerror = (e) => reject(e)
      setTimeout(() => reject(new Error('timeout')), 3000)
    })
    expect(received).toContain('turn_start')
    ws.close()
    h.close()
  })
})
