import { test, expect, describe, beforeEach } from 'bun:test'
import { existsSync, rmSync, readFileSync } from 'fs'
import { join } from 'path'
import { loadConfig, CONFIG_DIR, CONFIG_FILE, DEFAULTS } from '../src/zszcode/config'

describe('task-19: loadConfig() 创建默认配置', () => {
  beforeEach(() => {
    if (existsSync(CONFIG_FILE)) rmSync(CONFIG_FILE)
  })

  test('test_load_config_creates_file — 创建配置文件', () => {
    if (existsSync(CONFIG_FILE)) rmSync(CONFIG_FILE)
    loadConfig()
    expect(existsSync(CONFIG_FILE)).toBe(true)
  })

  test('test_load_config_creates_dir — 创建配置目录', () => {
    if (existsSync(CONFIG_DIR)) rmSync(CONFIG_DIR, { recursive: true })
    loadConfig()
    expect(existsSync(CONFIG_DIR)).toBe(true)
  })

  test('test_load_config_returns_defaults — 返回默认值', () => {
    if (existsSync(CONFIG_FILE)) rmSync(CONFIG_FILE)
    const config = loadConfig()
    expect(config.model).toBe(DEFAULTS.model)
    expect(config.baseUrl).toBe(DEFAULTS.baseUrl)
    expect(config.apiKey).toBe(DEFAULTS.apiKey)
  })

  test('test_load_config_written_json_valid — 写入的 JSON 可解析', () => {
    if (existsSync(CONFIG_FILE)) rmSync(CONFIG_FILE)
    loadConfig()
    const raw = readFileSync(CONFIG_FILE, 'utf-8')
    expect(() => JSON.parse(raw)).not.toThrow()
  })

  test('test_load_config_written_json_has_all_fields — 写入的 JSON 有全部字段', () => {
    if (existsSync(CONFIG_FILE)) rmSync(CONFIG_FILE)
    loadConfig()
    const raw = readFileSync(CONFIG_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    expect(Object.keys(parsed).length).toBe(6)
  })
})
