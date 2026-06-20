import { test, expect, describe } from 'bun:test'
import { writeFileSync } from 'fs'
import { loadConfig, CONFIG_FILE, DEFAULTS } from '../src/zszcode/config'

describe('task-31: loadConfig() 多余字段不报错', () => {
  test('test_load_config_extra_field_no_error — 额外字段不抛异常', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'x', extra: true }), 'utf-8')
    expect(() => loadConfig()).not.toThrow()
  })

  test('test_load_config_extra_field_ignored — 返回值不含额外字段', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'x', extra: true }), 'utf-8')
    const config = loadConfig()
    expect((config as any).extra).toBeUndefined()
  })

  test('test_load_config_extra_field_preserves_valid — 不影响有效字段', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'custom', extra: true }), 'utf-8')
    expect(loadConfig().model).toBe('custom')
  })

  test('test_load_config_many_extra_fields — 10 个额外字段不报错', () => {
    const obj: any = { model: 'x' }
    for (let i = 0; i < 10; i++) obj[`extra${i}`] = i
    writeFileSync(CONFIG_FILE, JSON.stringify(obj), 'utf-8')
    expect(() => loadConfig()).not.toThrow()
  })

  test('test_load_config_nested_extra_field — 嵌套额外对象不报错', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'x', nested: { a: 1 } }), 'utf-8')
    expect(() => loadConfig()).not.toThrow()
  })
})
