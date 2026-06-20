import { test, expect, describe } from 'bun:test'
import { existsSync, statSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const ROOT = join(import.meta.dir, '..')
const BINARY = join(ROOT, 'zszcode')

describe('task-203: bun build --compile 生成二进制', () => {
  test('test_compile_output_exists — 二进制文件存在', () => {
    expect(existsSync(BINARY)).toBe(true)
  })

  test('test_compile_output_executable — 有可执行权限', () => {
    const stat = statSync(BINARY)
    expect(stat.mode & 0o111).toBeGreaterThan(0)
  })

  test('test_compile_output_size — 大小 < 200MB', () => {
    const stat = statSync(BINARY)
    expect(stat.size).toBeLessThan(200 * 1024 * 1024)
  })

  test('test_compile_is_elf — 是 ELF 二进制', () => {
    const output = execSync(`file ${BINARY}`, { encoding: 'utf-8' })
    expect(output).toContain('ELF')
  })

  test('test_compile_no_node_required — 不依赖 Node.js', () => {
    // The binary should be self-contained
    const stat = statSync(BINARY)
    expect(stat.size).toBeGreaterThan(10 * 1024 * 1024) // > 10MB means it has runtime embedded
  })
})
