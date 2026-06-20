import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-68: 无 CLI --model 时使用配置 model', () => {
  const mainSrc = readFileSync(join(ROOT, 'src/main.tsx'), 'utf-8')

  test('test_config_model_used — 使用配置的 model', () => {
    expect(mainSrc).toContain('zszConfig.model')
  })

  test('test_config_model_type — model 是字符串', () => {
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    expect(configSrc).toContain('model: string')
  })

  test('test_config_model_parsed — 通过 parseUserSpecifiedModel', () => {
    expect(mainSrc).toContain('parseUserSpecifiedModel')
  })

  test('test_config_model_default — 默认值 mimo-v2.5-pro', () => {
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    expect(configSrc).toContain("model: 'mimo-v2.5-pro'")
  })

  test('test_config_model_import — main.tsx 导入 loadConfig', () => {
    expect(mainSrc).toContain("import { loadConfig }")
  })
})
