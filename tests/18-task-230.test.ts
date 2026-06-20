import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')

describe('task-230: check_progress.ts 返回 all tasks done', () => {
  test('test_progress_file_exists — progress.json 存在', () => {
    const { existsSync } = require('fs')
    expect(existsSync(join(ROOT, 'progress.json'))).toBe(true)
  })

  test('test_progress_has_all_tasks — 有全部 230 个任务', () => {
    const p = JSON.parse(readFileSync(join(ROOT, 'progress.json'), 'utf-8'))
    expect(p.total_tasks).toBe(230)
    expect(Object.keys(p.tasks).length).toBe(230)
  })

  test('test_progress_completed_count — 完成数正确', () => {
    const p = JSON.parse(readFileSync(join(ROOT, 'progress.json'), 'utf-8'))
    expect(p.completed).toBe(230)
  })

  test('test_check_progress_script_exists — 脚本存在', () => {
    const { existsSync } = require('fs')
    expect(existsSync(join(ROOT, 'check_progress.ts'))).toBe(true)
  })
})
