import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-48: 服务器在配置端口启动', () => {
  test('test_server_starts_on_config_port — 启动成功有端口', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h.port).toBeGreaterThan(0)
    h.close()
  })

  test('test_server_listens_on_port — 接受连接', async () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    const res = await fetch(`http://localhost:${h.port}?token=${h.token}`)
    expect(res.status).toBe(200)
    h.close()
  })

  test('test_server_custom_port — 指定端口', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 19000 })
    expect(h.port).toBe(19000)
    h.close()
  })

  test('test_server_returns_after_start — 启动后返回', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h).toBeDefined()
    h.close()
  })

  test('test_server_config_required — 有效 config 不抛异常', () => {
    expect(() => {
      const h = startWebServer({ ...DEFAULTS, webPort: 0 })
      h.close()
    }).not.toThrow()
  })
})
