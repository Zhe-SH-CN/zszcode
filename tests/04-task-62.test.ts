import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { eventBus } from '../src/zszcode/events'

describe('task-62: WebSocket 事件广播', () => {
  test('test_ws_receives_event — 收到事件', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=${h.token}`)
    const received = await new Promise<string>((resolve, reject) => {
      ws.onopen = () => {
        eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 999 })
      }
      ws.onmessage = (e) => resolve(e.data as string)
      ws.onerror = (e) => reject(e)
      setTimeout(() => reject(new Error('timeout')), 3000)
    })
    expect(received).toContain('turn_start')
    ws.close()
    h.close()
  })

  test('test_ws_event_is_json — 消息是 JSON', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=${h.token}`)
    const received = await new Promise<string>((resolve, reject) => {
      ws.onopen = () => {
        eventBus.emit({ type: 'turn_end', timestamp: Date.now(), turnNumber: 1 })
      }
      ws.onmessage = (e) => resolve(e.data as string)
      ws.onerror = (e) => reject(e)
      setTimeout(() => reject(new Error('timeout')), 3000)
    })
    expect(() => JSON.parse(received)).not.toThrow()
    ws.close()
    h.close()
  })

  test('test_ws_event_has_type — 解析后有 type', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=${h.token}`)
    const received = await new Promise<string>((resolve, reject) => {
      ws.onopen = () => {
        eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
      }
      ws.onmessage = (e) => resolve(e.data as string)
      ws.onerror = (e) => reject(e)
      setTimeout(() => reject(new Error('timeout')), 3000)
    })
    const parsed = JSON.parse(received)
    expect(parsed.type).toBe('turn_start')
    ws.close()
    h.close()
  })
})
