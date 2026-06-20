import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const querySrc = readFileSync(join(ROOT, 'src/query.ts'), 'utf-8')

describe('task-75: query() emit turn_start', () => {
  test('test_query_imports_event_bus — 导入 eventBus', () => {
    expect(querySrc).toContain("import { eventBus }")
    expect(querySrc).toContain("from './zszcode/events.js'")
  })

  test('test_query_emits_turn_start — 发出 turn_start', () => {
    expect(querySrc).toContain("eventBus.emit({ type: 'turn_start'")
  })

  test('test_turn_start_has_timestamp — 包含 timestamp', () => {
    expect(querySrc).toMatch(/type:\s*'turn_start'.*timestamp:\s*Date\.now\(\)/s)
  })

  test('test_turn_start_turn_number — 包含 turnNumber', () => {
    expect(querySrc).toMatch(/type:\s*'turn_start'.*turnNumber/s)
  })

  test('test_turn_start_in_loop — 在 while 循环内', () => {
    // The emit should be inside the while(true) loop
    const loopStart = querySrc.indexOf('while (true)')
    const emitPos = querySrc.indexOf("eventBus.emit({ type: 'turn_start'")
    expect(loopStart).toBeGreaterThan(0)
    expect(emitPos).toBeGreaterThan(loopStart)
  })
})
