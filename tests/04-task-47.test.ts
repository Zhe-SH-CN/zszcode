import { test, expect, describe, afterAll } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-47: startWebServer() 返回 WebServerHandle', () => {
  let handle: ReturnType<typeof startWebServer>

  afterAll(() => { handle?.close() })

  test('test_start_web_server_returns_handle — 返回对象', () => {
    handle = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(typeof handle).toBe('object')
    expect(handle).not.toBeNull()
  })

  test('test_handle_has_port — port 为数字', () => {
    expect(typeof handle.port).toBe('number')
    expect(handle.port).toBeGreaterThan(0)
  })

  test('test_handle_has_token — token 为字符串', () => {
    expect(typeof handle.token).toBe('string')
  })

  test('test_handle_has_url — url 为字符串', () => {
    expect(typeof handle.url).toBe('string')
  })

  test('test_handle_has_close — close 为函数', () => {
    expect(typeof handle.close).toBe('function')
  })
})
