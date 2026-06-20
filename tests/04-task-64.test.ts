import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-64: url 属性格式', () => {
  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_url_starts_with_http — 以 http:// 开头', () => {
    expect(h.url).toMatch(/^http:\/\//)
  })

  test('test_url_contains_localhost — 包含 localhost', () => {
    expect(h.url).toContain('localhost')
  })

  test('test_url_contains_port — 包含端口', () => {
    expect(h.url).toContain(String(h.port))
  })

  test('test_url_contains_token — 包含 token', () => {
    expect(h.url).toContain(`?token=${h.token}`)
  })

  test('test_url_is_valid — 有效 URL', () => {
    expect(() => new URL(h.url)).not.toThrow()
  })

})
