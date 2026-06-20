import { test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const tsconfig = JSON.parse(readFileSync(join(ROOT, 'tsconfig.json'), 'utf-8'))

test('test_tsconfig_exists — tsconfig.json 文件存在', () => {
  expect(() => readFileSync(join(ROOT, 'tsconfig.json'), 'utf-8')).not.toThrow()
})

test('test_tsconfig_strict — compilerOptions.strict 为 true', () => {
  expect(tsconfig.compilerOptions.strict).toBe(true)
})

test('test_tsconfig_jsx — compilerOptions.jsx 为 "react-jsx"', () => {
  expect(tsconfig.compilerOptions.jsx).toBe('react-jsx')
})

test('test_tsconfig_paths_bun_bundle — paths["bun:bundle"] 包含 shim 路径', () => {
  expect(tsconfig.compilerOptions.paths).toBeDefined()
  expect(tsconfig.compilerOptions.paths['bun:bundle']).toContain('src/shims/bun-bundle.ts')
})

test('test_tsconfig_paths_bun_test — paths["bun:test"] 包含 shim 路径', () => {
  expect(tsconfig.compilerOptions.paths['bun:test']).toContain('src/shims/bun-test.ts')
})

test('test_tsconfig_module_resolution — moduleResolution 为 "bundler"', () => {
  expect(tsconfig.compilerOptions.moduleResolution).toBe('bundler')
})

test('test_tsconfig_include — 包含 src 下 ts 和 tsx 文件', () => {
  expect(tsconfig.include).toContain('src/**/*.ts')
  expect(tsconfig.include).toContain('src/**/*.tsx')
})
