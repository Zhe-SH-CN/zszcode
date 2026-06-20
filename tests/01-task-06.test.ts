import { test, expect } from 'bun:test'
import { existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

test('test_node_modules_exists — node_modules 目录存在', () => {
  expect(existsSync(join(ROOT, 'node_modules'))).toBe(true)
})

test('test_bun_lock_exists — bun.lock 文件存在', () => {
  expect(existsSync(join(ROOT, 'bun.lock'))).toBe(true)
})

test('test_react_installed — node_modules/react 存在', () => {
  expect(existsSync(join(ROOT, 'node_modules', 'react'))).toBe(true)
})

test('test_commander_installed — node_modules/commander 存在', () => {
  expect(existsSync(join(ROOT, 'node_modules', 'commander'))).toBe(true)
})

test('test_typescript_installed — node_modules/typescript 存在', () => {
  expect(existsSync(join(ROOT, 'node_modules', 'typescript'))).toBe(true)
})
