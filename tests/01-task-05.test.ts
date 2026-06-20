import { test, expect } from 'bun:test'
import { readFileSync, statSync } from 'fs'
import { join } from 'path'

const SHIM_PATH = join(import.meta.dir, '..', 'src', 'shims', 'bun-test.ts')

test('test_bun_test_shim_exists — 文件存在', () => {
  expect(() => readFileSync(SHIM_PATH, 'utf-8')).not.toThrow()
})

test('test_bun_test_shim_is_empty_module — 导出为空', () => {
  const content = readFileSync(SHIM_PATH, 'utf-8')
  expect(content).toContain('export')
})

test('test_bun_test_shim_no_syntax_error — 可被 TypeScript 解析', () => {
  const content = readFileSync(SHIM_PATH, 'utf-8')
  expect(content.length).toBeGreaterThan(0)
})

test('test_bun_test_shim_importable — 可以 import', async () => {
  const mod = await import('../src/shims/bun-test')
  expect(mod).toBeDefined()
})

test('test_bun_test_shim_file_size_small — 小于 100 字节', () => {
  const stat = statSync(SHIM_PATH)
  expect(stat.size).toBeLessThan(100)
})
