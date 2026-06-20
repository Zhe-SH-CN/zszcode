import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-60: WebSocket 连接', () => {
  test('test_ws_connect_success — 连接成功', async () => {
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

  test('test_ws_url_path — 路径为 /ws', async () => {
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

  test('test_ws_token_in_query — token 通过 query 传递', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=${h.token}`)
    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => resolve()
      ws.onerror = (e) => reject(e)
      setTimeout(() => reject(new Error('timeout')), 3000)
    })
    ws.close()
    h.close()
  })

  test('test_ws_open_event — open 事件触发', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    let opened = false
    const ws = new WebSocket(`ws://localhost:${h.port}/ws?token=${h.token}`)
    await new Promise<void>((resolve, reject) => {
      ws.onopen = () => { opened = true; resolve() }
      ws.onerror = (e) => reject(e)
      setTimeout(() => reject(new Error('timeout')), 3000)
    })
    expect(opened).toBe(true)
    ws.close()
    h.close()
  })
})
