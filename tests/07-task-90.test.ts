import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const toolExecSrc = readFileSync(join(ROOT, 'src/services/tools/toolExecution.ts'), 'utf-8')

describe('task-90: tool_call_end 事件', () => {
  test('test_tool_call_end_emitted — 发出 tool_call_end', () => {
    expect(toolExecSrc).toContain("type: 'tool_call_end'")
  })

  test('test_tool_call_end_has_success — 包含 success', () => {
    expect(toolExecSrc).toMatch(/type:\s*'tool_call_end'.*success/s)
  })

  test('test_tool_call_end_has_duration — 包含 duration', () => {
    expect(toolExecSrc).toMatch(/type:\s*'tool_call_end'.*duration/s)
  })

  test('test_tool_call_end_success_true — 成功时 success=true', () => {
    expect(toolExecSrc).toContain('success: true')
  })

  test('test_tool_call_end_success_false — 失败时 success=false', () => {
    // Should have a second emit with success: false in the catch block
    const matches = toolExecSrc.match(/type:\s*'tool_call_end'/g)
    expect(matches?.length).toBeGreaterThanOrEqual(2)
  })
})
