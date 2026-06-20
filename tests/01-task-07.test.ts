import { test, expect, describe } from 'bun:test'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

function runBuild(): { exitCode: number; stdout: string; stderr: string } {
  try {
    const stdout = execSync(
      '/home/zsz/.bun/bin/bun build src/entrypoints/cli.tsx --outdir dist --target bun',
      { cwd: ROOT, encoding: 'utf-8', timeout: 60_000 }
    )
    return { exitCode: 0, stdout, stderr: '' }
  } catch (err: any) {
    return {
      exitCode: err.status ?? 1,
      stdout: err.stdout ?? '',
      stderr: err.stderr ?? '',
    }
  }
}

describe('task-07: bun build 无 ModuleNotFound 错误', () => {
  const result = runBuild()

  test('test_build_exits_zero — 构建命令退出码为 0', () => {
    expect(result.exitCode).toBe(0)
  })

  test('test_build_no_module_not_found — 构建输出不包含 ModuleNotFound', () => {
    const combined = result.stdout + result.stderr
    expect(combined).not.toContain('Could not resolve')
    expect(combined).not.toContain('ModuleNotFound')
  })

  test('test_build_dist_created — dist/ 目录被创建', () => {
    expect(existsSync(join(ROOT, 'dist'))).toBe(true)
  })

  test('test_build_output_has_cli — dist/ 中包含 cli.js 文件', () => {
    expect(existsSync(join(ROOT, 'dist', 'cli.js'))).toBe(true)
  })

  test('test_build_stderr_clean — stderr 不包含严重错误', () => {
    // warnings 可接受，但 error/ModuleNotFound 不行
    expect(result.stderr).not.toMatch(/error:/i)
  })
})
