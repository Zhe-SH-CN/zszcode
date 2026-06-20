import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'

describe('task-49: 48 字符随机 token', () => {
  test('test_token_length_48 — 长度 48', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h.token.length).toBe(48)
    h.close()
  })

  test('test_token_hex_only — 只含 hex 字符', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h.token).toMatch(/^[0-9a-f]+$/)
    h.close()
  })

  test('test_token_unique_per_start — 每次不同', () => {
    const h1 = startWebServer({ ...DEFAULTS, webPort: 0 })
    const h2 = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h1.token).not.toBe(h2.token)
    h1.close()
    h2.close()
  })

  test('test_token_type_string — 类型为 string', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(typeof h.token).toBe('string')
    h.close()
  })

  test('test_token_no_special_chars — 无特殊字符', () => {
    const h = startWebServer({ ...DEFAULTS, webPort: 0 })
    expect(h.token).not.toMatch(/[^0-9a-f]/)
    h.close()
  })
})
