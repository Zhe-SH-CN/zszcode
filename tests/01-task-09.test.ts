import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'
import { MACRO } from '../src/shims/bun-bundle'

const ROOT = join(import.meta.dir, '..')

describe('task-09: MACRO.VERSION 返回 0.1.0', () => {
  test('test_macro_version_exact — 精确匹配 0.1.0', () => {
    expect(MACRO.VERSION).toBe('0.1.0')
  })

  test('test_macro_version_type — 类型为 string', () => {
    expect(typeof MACRO.VERSION).toBe('string')
  })

  test('test_macro_version_matches_package — 与 package.json 版本一致', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))
    expect(MACRO.VERSION).toBe(pkg.version)
  })

  test('test_macro_version_no_prerelease — 不包含 - 或 +', () => {
    expect(MACRO.VERSION).not.toContain('-')
    expect(MACRO.VERSION).not.toContain('+')
  })

  test('test_macro_version_semver — 匹配 X.Y.Z 格式', () => {
    expect(MACRO.VERSION).toMatch(/^\d+\.\d+\.\d+$/)
  })
})
