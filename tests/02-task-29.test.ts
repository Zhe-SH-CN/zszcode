import { test, expect, describe } from 'bun:test'
import { writeFileSync } from 'fs'
import { loadConfig, CONFIG_FILE } from '../src/zszcode/config'

describe('task-29: loadConfig() 幂等性', () => {
  test('test_load_config_idempotent_same_keys — 键集合相同', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'test' }), 'utf-8')
    const a = loadConfig()
    const b = loadConfig()
    expect(Object.keys(a).sort()).toEqual(Object.keys(b).sort())
  })

  test('test_load_config_idempotent_same_values — 值相同', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'test' }), 'utf-8')
    const a = loadConfig()
    const b = loadConfig()
    expect(a.model).toBe(b.model)
    expect(a.webPort).toBe(b.webPort)
  })

  test('test_load_config_idempotent_deep_equal — 深比较相等', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    const a = loadConfig()
    const b = loadConfig()
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
  })

  test('test_load_config_no_file_mutation — 不修改文件', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({ model: 'test' }), 'utf-8')
    const before = require('fs').readFileSync(CONFIG_FILE, 'utf-8')
    loadConfig()
    const after = require('fs').readFileSync(CONFIG_FILE, 'utf-8')
    expect(after).toBe(before)
  })

  test('test_load_config_100_calls_stable — 100 次调用一致', () => {
    writeFileSync(CONFIG_FILE, JSON.stringify({}), 'utf-8')
    const first = JSON.stringify(loadConfig())
    for (let i = 0; i < 100; i++) {
      expect(JSON.stringify(loadConfig())).toBe(first)
    }
  })
})
