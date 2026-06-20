import { test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'))

test('test_package_json_exists — package.json 文件存在', () => {
  expect(() => readFileSync(join(ROOT, 'package.json'), 'utf-8')).not.toThrow()
})

test('test_package_json_name — name 字段为 "zszcode"', () => {
  expect(pkg.name).toBe('zszcode')
})

test('test_package_json_version — version 字段为 "0.1.0"', () => {
  expect(pkg.version).toBe('0.1.0')
})

test('test_package_json_type_module — type 字段为 "module"', () => {
  expect(pkg.type).toBe('module')
})

test('test_package_json_scripts — scripts 包含 build, dev, test, typecheck', () => {
  expect(pkg.scripts).toBeDefined()
  expect(pkg.scripts.build).toBeDefined()
  expect(pkg.scripts.dev).toBeDefined()
  expect(pkg.scripts.test).toBeDefined()
  expect(pkg.scripts.typecheck).toBeDefined()
})

test('test_package_json_dependencies — 包含所有必需依赖', () => {
  expect(pkg.dependencies).toBeDefined()
  expect(pkg.dependencies['@anthropic-ai/sdk']).toBeDefined()
  expect(pkg.dependencies['react']).toBeDefined()
  expect(pkg.dependencies['react-reconciler']).toBeDefined()
  expect(pkg.dependencies['commander']).toBeDefined()
  expect(pkg.dependencies['chalk']).toBeDefined()
  expect(pkg.dependencies['zod']).toBeDefined()
  expect(pkg.dependencies['ws']).toBeDefined()
})

test('test_package_json_dev_dependencies — 包含所有必需 devDependencies', () => {
  expect(pkg.devDependencies).toBeDefined()
  expect(pkg.devDependencies['@types/react']).toBeDefined()
  expect(pkg.devDependencies['@types/ws']).toBeDefined()
  expect(pkg.devDependencies['typescript']).toBeDefined()
})
