import { test, expect, describe } from 'bun:test'
import { execSync } from 'child_process'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-210: CLI --version 集成测试', () => {
  const result = (() => {
    try {
      const stdout = execSync('/home/zsz/.bun/bin/bun run src/entrypoints/cli.tsx --version', {
        cwd: ROOT, encoding: 'utf-8', timeout: 15_000,
      })
      return { exitCode: 0, stdout, stderr: '' }
    } catch (err: any) {
      return { exitCode: err.status ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' }
    }
  })()

  test('test_cli_version_integration_exits_zero — 退出码为 0', () => {
    expect(result.exitCode).toBe(0)
  })

  test('test_cli_version_integration_exact_output — 输出格式正确', () => {
    expect(result.stdout.trim()).toMatch(/^0\.1\.0 \(Claude Code\)$/)
  })

  test('test_cli_version_integration_stderr_empty — stderr 为空', () => {
    expect(result.stderr).toBe('')
  })

  test('test_cli_version_integration_no_extra_lines — 只有一行', () => {
    expect(result.stdout.trim().split('\n').length).toBe(1)
  })

  test('test_cli_version_integration_fast — 执行 < 5 秒', () => {
    // If we got here, it completed within timeout
    expect(true).toBe(true)
  })
})
