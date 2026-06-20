import { test, expect, describe } from 'bun:test'
import { execSync } from 'child_process'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-16: CLI --version 输出版本信息', () => {
  let result: { exitCode: number; stdout: string; stderr: string }

  try {
    const stdout = execSync(
      '/home/zsz/.bun/bin/bun run src/entrypoints/cli.tsx --version',
      { cwd: ROOT, encoding: 'utf-8', timeout: 15_000 }
    )
    result = { exitCode: 0, stdout, stderr: '' }
  } catch (err: any) {
    result = {
      exitCode: err.status ?? 1,
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? '',
    }
  }

  test('test_cli_version_exits_zero — 退出码为 0', () => {
    expect(result.exitCode).toBe(0)
  })

  test('test_cli_version_output_contains_version — 输出包含 0.1.0', () => {
    expect(result.stdout).toContain('0.1.0')
  })

  test('test_cli_version_output_format — 输出格式为 VERSION (Claude Code)', () => {
    expect(result.stdout.trim()).toMatch(/^0\.1\.0 \(Claude Code\)$/)
  })

  test('test_cli_version_stderr_empty — stderr 为空', () => {
    expect(result.stderr).toBe('')
  })

  test('test_cli_version_macro_injected — MACRO.VERSION 被正确注入', () => {
    expect(result.stdout).not.toContain('undefined')
  })
})
