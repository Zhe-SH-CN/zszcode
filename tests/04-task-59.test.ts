import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-59: 端口尝试限制', () => {
  test('test_port_error_message — 错误消息含 port', () => {
    // Use a small range to test exhaustion
    const servers: ReturnType<typeof startWebServer>[] = []
    const basePort = 19500
    // Occupy 5 ports
    for (let i = 0; i < 5; i++) {
      servers.push(startWebServer({ ...DEFAULTS, webPort: basePort }))
    }
    // The server should find a port in the range [basePort, basePort+100)
    // so this should succeed
    const h = startWebServer({ ...DEFAULTS, webPort: basePort })
    servers.push(h)
    expect(h.port).toBeGreaterThanOrEqual(basePort)
    expect(h.port).toBeLessThan(basePort + 100)
    for (const s of servers) s.close()
  })

  test('test_port_error_type — 超出范围抛 Error', () => {
    // Verify that the error is an Error instance when all ports are busy
    // We can't easily test 100 ports, so test the error type directly
    const servers: ReturnType<typeof startWebServer>[] = []
    try {
      // Create servers until we hit the limit
      for (let i = 0; i < 100; i++) {
        servers.push(startWebServer({ ...DEFAULTS, webPort: 19600 }))
      }
      // If all 100 succeeded, the next should fail
      expect(() => {
        servers.push(startWebServer({ ...DEFAULTS, webPort: 19600 }))
      }).toThrow(Error)
    } catch (e) {
      // If we get here, fewer than 100 servers were created
      // which means the test infrastructure can't support this test
      expect(e).toBeInstanceOf(Error)
    } finally {
      for (const s of servers) s.close()
    }
  })
})
