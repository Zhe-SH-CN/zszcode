import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-211: CLI 默认使用 mimo-v2.5-pro', () => {
  test('test_cli_default_model — 默认模型为 mimo-v2.5-pro', () => {
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    expect(configSrc).toContain("model: 'mimo-v2.5-pro'")
  })

  test('test_cli_model_in_config — 从配置文件读取', () => {
    const mainSrc = readFileSync(join(ROOT, 'src/main.tsx'), 'utf-8')
    expect(mainSrc).toContain('zszConfig.model')
  })

  test('test_cli_api_endpoint — API endpoint 正确', () => {
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    expect(configSrc).toContain('token-plan-cn.xiaomimimo.com/anthropic')
  })

  test('test_cli_model_fallback — 无配置时使用默认值', () => {
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    expect(configSrc).toContain('DEFAULTS')
  })
})
