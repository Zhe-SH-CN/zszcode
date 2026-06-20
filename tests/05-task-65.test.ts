import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const clientPath = join(ROOT, 'src/services/api/client.ts')
const clientSrc = readFileSync(clientPath, 'utf-8')

describe('task-65: client.ts 注入 zszcode apiKey', () => {
  test('test_client_imports_config — 包含 loadConfig import', () => {
    expect(clientSrc).toContain("import { loadConfig }")
    expect(clientSrc).toContain("from '../../zszcode/config.js'")
  })

  test('test_client_calls_load_config — 调用 loadConfig()', () => {
    expect(clientSrc).toContain('loadConfig()')
  })

  test('test_client_uses_zszcode_api_key — 使用 zszConfig.apiKey', () => {
    expect(clientSrc).toContain('zszConfig.apiKey')
  })

  test('test_client_api_key_priority — zszConfig.apiKey 优先', () => {
    // Verify that zszConfig.apiKey is used before the fallback
    expect(clientSrc).toMatch(/zszConfig\.apiKey\s*\|\|/)
  })

  test('test_client_config_variable — 有 zszConfig 变量', () => {
    expect(clientSrc).toContain('const zszConfig = loadConfig()')
  })
})
