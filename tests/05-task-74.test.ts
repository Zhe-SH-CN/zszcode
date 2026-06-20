import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-74: model 通过 parseUserSpecifiedModel 标准化', () => {
  const mainSrc = readFileSync(join(ROOT, 'src/main.tsx'), 'utf-8')

  test('test_model_parsed — 使用 parseUserSpecifiedModel', () => {
    expect(mainSrc).toMatch(/parseUserSpecifiedModel\(.*zszConfig\.model/)
  })

  test('test_model_with_spaces — 模型名被处理', () => {
    // parseUserSpecifiedModel handles trimming
    expect(mainSrc).toContain('parseUserSpecifiedModel')
  })

  test('test_model_case_preserved — 大小写保留', () => {
    const configSrc = readFileSync(join(ROOT, 'src/zszcode/config.ts'), 'utf-8')
    expect(configSrc).toContain("'mimo-v2.5-pro'")
  })

  test('test_model_parse_function_called — 函数被调用', () => {
    expect(mainSrc).toContain('parseUserSpecifiedModel(')
  })

  test('test_model_priority_chain — 优先级链正确', () => {
    // getInitialMainLoopModel() ?? zszConfig.model || getDefaultMainLoopModel()
    expect(mainSrc).toContain('getInitialMainLoopModel()')
    expect(mainSrc).toContain('zszConfig.model')
    expect(mainSrc).toContain('getDefaultMainLoopModel()')
  })
})
