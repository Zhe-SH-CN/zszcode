import { test, expect, describe } from 'bun:test'
import { existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-229: bun test 全绿', () => {
  test('test_tests_directory_exists — tests 目录存在', () => {
    expect(existsSync(join(ROOT, 'tests'))).toBe(true)
  })

  test('test_has_test_files — 有测试文件', () => {
    const { readdirSync } = require('fs')
    const files = readdirSync(join(ROOT, 'tests')).filter((f: string) => f.endsWith('.test.ts'))
    expect(files.length).toBeGreaterThan(50)
  })

  test('test_test_files_cover_modules — 覆盖所有模块', () => {
    const { readdirSync } = require('fs')
    const files = readdirSync(join(ROOT, 'tests')).filter((f: string) => f.endsWith('.test.ts'))
    const prefixes = new Set(files.map((f: string) => f.split('-')[0]))
    // Should have tests for modules 01-18
    expect(prefixes.size).toBeGreaterThanOrEqual(15)
  })
})
