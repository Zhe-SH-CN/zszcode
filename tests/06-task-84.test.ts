import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const querySrc = readFileSync(join(ROOT, 'src/query.ts'), 'utf-8')

describe('task-84: turn_end 事件', () => {
  test('test_turn_end_emitted — 发出 turn_end', () => {
    expect(querySrc).toContain("eventBus.emit({ type: 'turn_end'")
  })

  test('test_turn_end_has_timestamp — 包含 timestamp', () => {
    expect(querySrc).toMatch(/type:\s*'turn_end'.*timestamp/s)
  })

  test('test_turn_end_has_turn_number — 包含 turnNumber', () => {
    expect(querySrc).toMatch(/type:\s*'turn_end'.*turnNumber/s)
  })

  test('test_turn_end_at_loop_end — 在循环末尾', () => {
    const loopEnd = querySrc.indexOf('} // while (true)')
    const emitPos = querySrc.indexOf("eventBus.emit({ type: 'turn_end'")
    expect(emitPos).toBeLessThan(loopEnd)
    expect(emitPos).toBeGreaterThan(loopEnd - 200)
  })

  test('test_turn_end_after_tools — 在工具执行之后', () => {
    // turn_end should be after the tool execution logic
    const toolExecPos = querySrc.indexOf('runTools')
    const emitPos = querySrc.indexOf("eventBus.emit({ type: 'turn_end'")
    if (toolExecPos > 0) {
      expect(emitPos).toBeGreaterThan(toolExecPos)
    }
  })
})
