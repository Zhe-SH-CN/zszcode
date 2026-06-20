import { test, expect, describe } from 'bun:test'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-14: tsconfig paths 解析 bun:test', () => {
  const tsconfig = JSON.parse(readFileSync(join(ROOT, 'tsconfig.json'), 'utf-8'))

  test('test_tsconfig_bun_test_path_resolves — 指向存在的文件', () => {
    const paths = tsconfig.compilerOptions.paths
    expect(paths['bun:test']).toBeDefined()
    const targetPath = join(ROOT, paths['bun:test'][0])
    expect(existsSync(targetPath)).toBe(true)
  })

  test('test_tsconfig_bun_test_file_exists — 文件存在', () => {
    expect(existsSync(join(ROOT, 'src/shims/bun-test.ts'))).toBe(true)
  })

  test('test_tsconfig_bun_test_path_in_tsconfig — paths 配置正确', () => {
    expect(tsconfig.compilerOptions.paths['bun:test']).toEqual(['src/shims/bun-test.ts'])
  })

  test('test_tsconfig_bun_test_relative_path_valid — 是有效相对路径', () => {
    const path = tsconfig.compilerOptions.paths['bun:test'][0]
    expect(path).toMatch(/^src\/shims\/.*/)
  })

  test('test_tsconfig_bun_test_file_is_typescript — 扩展名为 .ts', () => {
    expect(tsconfig.compilerOptions.paths['bun:test'][0]).toEndWith('.ts')
  })
})
