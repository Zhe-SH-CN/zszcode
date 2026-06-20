import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-63: close() 停止服务器', () => {
  test('test_close_stops_server — 关闭后端口不可访问', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const port = h.port
    h.close()
    await expect(fetch(`http://localhost:${port}`)).rejects.toThrow()
  })

  test('test_close_releases_port — 释放端口', async () => {
    const basePort = 19200
    const h1 = startWebServer({ ...DEFAULTS, webPort: basePort })
    const port = h1.port
    h1.close()
    const h2 = startWebServer({ ...DEFAULTS, webPort: port })
    expect(h2.port).toBe(port)
    h2.close()
  })

  test('test_close_idempotent — 多次调用不报错', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    h.close()
    expect(() => h.close()).not.toThrow()
  })

  test('test_close_returns_void — 返回 undefined', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h.close()).toBeUndefined()
  })

  test('test_close_after_start — 启动后立即关闭', () => {
    expect(() => {
      const h = startWebServer({ ...DEFAULTS, webPort: 0 })
      h.close()
    }).not.toThrow()
  })
})
