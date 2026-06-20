import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const toolExecSrc = readFileSync(join(ROOT, 'src/services/tools/toolExecution.ts'), 'utf-8')

describe('task-88: tool_call_start 事件', () => {
  test('test_tool_exec_imports_event_bus — 导入 eventBus', () => {
    expect(toolExecSrc).toContain("import { eventBus }")
    expect(toolExecSrc).toContain("from '../../zszcode/events.js'")
  })

  test('test_tool_call_start_emitted — 发出 tool_call_start', () => {
    expect(toolExecSrc).toContain("type: 'tool_call_start'")
  })

  test('test_tool_call_start_has_tool_name — 包含 toolName', () => {
    expect(toolExecSrc).toMatch(/type:\s*'tool_call_start'.*toolName/s)
  })

  test('test_tool_call_start_has_timestamp — 包含 timestamp', () => {
    expect(toolExecSrc).toMatch(/type:\s*'tool_call_start'.*timestamp:\s*Date\.now\(\)/s)
  })

  test('test_tool_call_start_before_call — 在 tool.call 之前', () => {
    // Find the tool_call_start emit and verify it's before a tool.call
    const startPos = toolExecSrc.indexOf("type: 'tool_call_start'")
    // Find tool.call after the emit
    const afterEmit = toolExecSrc.substring(startPos)
    const callPos = afterEmit.indexOf('tool.call(')
    expect(startPos).toBeGreaterThan(0)
    expect(callPos).toBeGreaterThan(0)
  })
})
