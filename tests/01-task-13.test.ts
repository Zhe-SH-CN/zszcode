import { test, expect, describe } from 'bun:test'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-13: tsconfig paths 解析 bun:bundle', () => {
  const tsconfig = JSON.parse(readFileSync(join(ROOT, 'tsconfig.json'), 'utf-8'))

  test('test_tsconfig_bun_bundle_path_resolves — 指向存在的文件', () => {
    const paths = tsconfig.compilerOptions.paths
    expect(paths['bun:bundle']).toBeDefined()
    const targetPath = join(ROOT, paths['bun:bundle'][0])
    expect(existsSync(targetPath)).toBe(true)
  })

  test('test_tsconfig_bun_bundle_file_exports_feature — 导出 feature 函数', () => {
    const content = readFileSync(join(ROOT, 'src/shims/bun-bundle.ts'), 'utf-8')
    expect(content).toContain('export function feature')
  })

  test('test_tsconfig_bun_bundle_file_exports_macro — 导出 MACRO 常量', () => {
    const content = readFileSync(join(ROOT, 'src/shims/bun-bundle.ts'), 'utf-8')
    expect(content).toContain('export const MACRO')
  })

  test('test_tsconfig_bun_bundle_path_in_tsconfig — paths 配置正确', () => {
    expect(tsconfig.compilerOptions.paths['bun:bundle']).toEqual(['src/shims/bun-bundle.ts'])
  })

  test('test_tsconfig_bun_bundle_relative_path_valid — 是有效相对路径', () => {
    const path = tsconfig.compilerOptions.paths['bun:bundle'][0]
    expect(path).toMatch(/^src\/shims\/.*/)
  })
})
