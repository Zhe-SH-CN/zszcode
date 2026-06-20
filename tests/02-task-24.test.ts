import { test, expect, describe } from 'bun:test'
import { writeFileSync } from 'fs'
import { loadConfig, CONFIG_FILE } from '../src/zszcode/config'

describe('task-24: loadConfig() 无效 JSON 抛错', () => {
  test('test_load_config_invalid_json_throws — 无效 JSON 抛异常', () => {
    writeFileSync(CONFIG_FILE, 'not json', 'utf-8')
    expect(() => loadConfig()).toThrow()
  })

  test('test_load_config_invalid_json_error_type — SyntaxError', () => {
    writeFileSync(CONFIG_FILE, 'not json', 'utf-8')
    expect(() => loadConfig()).toThrow(SyntaxError)
  })

  test('test_load_config_empty_string_throws — 空字符串抛异常', () => {
    writeFileSync(CONFIG_FILE, '', 'utf-8')
    expect(() => loadConfig()).toThrow()
  })

  test('test_load_config_truncated_json_throws — 截断 JSON 抛异常', () => {
    writeFileSync(CONFIG_FILE, '{"model":', 'utf-8')
    expect(() => loadConfig()).toThrow()
  })

  test('test_load_config_bom_json_throws — BOM 内容抛异常', () => {
    writeFileSync(CONFIG_FILE, '﻿not json', 'utf-8')
    expect(() => loadConfig()).toThrow()
  })
})
