import { test, expect, describe } from 'bun:test'
import { execSync } from 'child_process'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const BINARY = join(ROOT, 'zszcode')

describe('task-204: ./zszcode --version 输出版本', () => {
  const result = (() => {
    try {
      const stdout = execSync(`${BINARY} --version`, { encoding: 'utf-8', timeout: 10_000 })
      return { exitCode: 0, stdout, stderr: '' }
    } catch (err: any) {
      return { exitCode: err.status ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' }
    }
  })()

  test('test_binary_version_exits_zero — 退出码为 0', () => {
    expect(result.exitCode).toBe(0)
  })

  test('test_binary_version_output_contains_version — 包含 0.1.0', () => {
    expect(result.stdout).toContain('0.1.0')
  })

  test('test_binary_version_stderr_empty — stderr 为空', () => {
    expect(result.stderr).toBe('')
  })

  test('test_binary_version_output_format — 输出格式正确', () => {
    expect(result.stdout.trim()).toMatch(/^0\.1\.0 \(Claude Code\)$/)
  })
})
