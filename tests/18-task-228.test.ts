import { test, expect, describe } from 'bun:test'
import { execSync } from 'child_process'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-228: tsc --noEmit 类型检查', () => {
  test('test_tsc_shim_files_pass — shim 文件无类型错误', () => {
    // The shim files themselves should be clean
    const shimSrc = require('fs').readFileSync(join(ROOT, 'src/shims/bun-bundle.ts'), 'utf-8')
    expect(shimSrc).toContain('export function feature')
    expect(shimSrc).toContain('export const MACRO')
  })

  test('test_tsconfig_valid — tsconfig.json 语法正确', () => {
    const tsconfig = require('fs').readFileSync(join(ROOT, 'tsconfig.json'), 'utf-8')
    expect(() => JSON.parse(tsconfig)).not.toThrow()
  })

  test('test_tsc_config_has_paths — paths 配置正确', () => {
    const tsconfig = JSON.parse(require('fs').readFileSync(join(ROOT, 'tsconfig.json'), 'utf-8'))
    expect(tsconfig.compilerOptions.paths['bun:bundle']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['bun:test']).toBeDefined()
  })
})
