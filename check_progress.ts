#!/usr/bin/env bun
/**
 * check_progress.ts — 读取 progress.json，报告任务完成状态
 * 用法：bun run check_progress.ts
 * 退出码：0 = 全部完成，1 = 有未完成任务，2 = 错误
 */

import { readFileSync } from 'fs'
import { join } from 'path'

const PROGRESS_FILE = join(import.meta.dir, 'progress.json')

interface ProgressData {
  project: string
  total_tasks: number
  started_at: string
  updated_at: string
  tasks: Record<string, string>
}

try {
  const raw = readFileSync(PROGRESS_FILE, 'utf-8')
  const data: ProgressData = JSON.parse(raw)

  const total = data.total_tasks
  const tasks = data.tasks
  const taskKeys = Object.keys(tasks)

  let pending = 0
  let inProgress = 0
  let completed = 0
  let failed = 0

  for (const [id, status] of Object.entries(tasks)) {
    switch (status) {
      case 'pending': pending++; break
      case 'in_progress': inProgress++; break
      case 'completed': completed++; break
      case 'failed': failed++; break
      default:
        console.error(`Task ${id}: unknown status "${status}"`)
        process.exit(2)
    }
  }

  // 验证任务数量一致性
  if (taskKeys.length !== total) {
    console.error(`Mismatch: progress.json has ${taskKeys.length} tasks but total_tasks=${total}`)
    process.exit(2)
  }

  // 验证任务编号连续性
  const ids = taskKeys.map(Number).sort((a, b) => a - b)
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] !== i + 1) {
      console.error(`Task numbering gap: expected ${i + 1}, found ${ids[i]}`)
      process.exit(2)
    }
  }

  // 输出报告
  console.log(`\n📊 ZSZCode Progress Report`)
  console.log(`${'─'.repeat(40)}`)
  console.log(`Total:      ${total}`)
  console.log(`Completed:  ${completed} ✅`)
  console.log(`In Progress:${inProgress} 🔄`)
  console.log(`Pending:    ${pending} ⏳`)
  if (failed > 0) console.log(`Failed:     ${failed} ❌`)
  console.log(`${'─'.repeat(40)}`)
  console.log(`Progress:   ${((completed / total) * 100).toFixed(1)}%`)
  console.log(`Updated:    ${data.updated_at}`)
  console.log()

  if (completed === total) {
    console.log('🎉 All tasks done!')
    process.exit(0)
  } else {
    // 列出下一个待完成的任务
    const nextPending = ids.find(id => tasks[String(id)] === 'pending')
    const nextInProgress = ids.find(id => tasks[String(id)] === 'in_progress')
    if (nextInProgress) {
      console.log(`🔄 Next in-progress: task ${nextInProgress}`)
    } else if (nextPending) {
      console.log(`⏳ Next pending: task ${nextPending}`)
    }
    process.exit(1)
  }
} catch (err: any) {
  if (err.code === 'ENOENT') {
    console.error(`Error: progress.json not found at ${PROGRESS_FILE}`)
  } else if (err instanceof SyntaxError) {
    console.error(`Error: progress.json contains invalid JSON`)
  } else {
    console.error(`Error: ${err.message}`)
  }
  process.exit(2)
}
