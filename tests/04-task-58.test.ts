import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-58: 端口自动递增', () => {
  test('test_port_auto_increment — 占用后递增', () => {
    const h1 = startWebServer({ ...DEFAULTS, webPort: 19100 })
    const h2 = startWebServer({ ...DEFAULTS, webPort: 19100 })
    expect(h2.port).toBe(h1.port + 1)
    h1.close()
    h2.close()
  })

  test('test_port_returns_actual — 返回实际端口', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h.port).toBeGreaterThan(0)
    h.close()
  })

  test('test_port_server_accessible — 递增端口可访问', async () => {
    const h1 = startWebServer({ ...DEFAULTS, webPort: 19110 })
    const h2 = startWebServer({ ...DEFAULTS, webPort: 19110 })
    const res = await fetch(`http://localhost:${h2.port}?token=${h2.token}`)
    expect(res.status).toBe(200)
    h1.close()
    h2.close()
  })

  test('test_port_two_servers — 两个服务器不同端口', () => {
    const h1 = startWebServer({ ...DEFAULTS, webPort: 0 })
    const h2 = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h1.port).not.toBe(h2.port)
    h1.close()
    h2.close()
  })

  test('test_port_gap_skipping — 跳过多个占用端口', () => {
    const h1 = startWebServer({ ...DEFAULTS, webPort: 19120 })
    const h2 = startWebServer({ ...DEFAULTS, webPort: 19120 })
    const h3 = startWebServer({ ...DEFAULTS, webPort: 19120 })
    expect(h3.port).toBe(h1.port + 2)
    h1.close()
    h2.close()
    h3.close()
  })
})
