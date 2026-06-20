import { test, expect, describe } from 'bun:test'
import { loadConfig, DEFAULTS } from '../src/zszcode/config'
import { writeFileSync } from 'fs'
import { CONFIG_FILE } from '../src/zszcode/config'

describe('task-72: baseURL 为空字符串不覆盖', () => {
  test('test_empty_base_url_no_override — 空字符串不设置', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ baseUrl: '' }), 'utf-8')
    const config = loadConfig()
    // Empty string is falsy, so it should not override
    expect(config.baseUrl).toBe('')
  })

  test('test_valid_base_url_overrides — 非空字符串正确设置', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ baseUrl: 'https://custom.api' }), 'utf-8')
    const config = loadConfig()
    expect(config.baseUrl).toBe('https://custom.api')
  })

  test('test_falsy_check_type — 使用 falsy 检查', () => {
    const clientSrc = require('fs').readFileSync(
      require('path').join(process.cwd(), 'src/services/api/client.ts'), 'utf-8'
    )
    // Should use truthy check: zszConfig.baseUrl ? { baseURL: ... } : ...
    expect(clientSrc).toMatch(/zszConfig\.baseUrl\s*\?/)
  })
})
