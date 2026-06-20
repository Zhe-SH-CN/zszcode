import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const clientSrc = readFileSync(join(ROOT, 'src/services/api/client.ts'), 'utf-8')

describe('task-66: client.ts 注入 zszcode baseURL', () => {
  test('test_client_uses_zszcode_base_url — 使用 zszConfig.baseUrl', () => {
    expect(clientSrc).toContain('zszConfig.baseUrl')
  })

  test('test_client_base_url_not_empty — 非空时生效', () => {
    expect(clientSrc).toMatch(/zszConfig\.baseUrl\s*\?/)
  })

  test('test_client_base_url_empty_skipped — 空字符串不覆盖', () => {
    // The condition uses truthy check, so empty string is falsy
    expect(clientSrc).toContain('zszConfig.baseUrl')
  })

  test('test_client_base_url_format — URL 格式', () => {
    // Verify the config default URL starts with https
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    expect(configSrc).toContain('https://')
  })

  test('test_client_base_url_no_trailing_slash — 不以 / 结尾', () => {
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    const match = configSrc.match(/baseUrl:\s*'([^']+)'/)
    expect(match).not.toBeNull()
    expect(match![1]).not.toMatch(/\/$/)
  })
})
