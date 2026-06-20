import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const permLogSrc = readFileSync(join(ROOT, 'src/hooks/toolPermission/permissionLogging.ts'), 'utf-8')

describe('task-127: tool_permission_resolved event', () => {
  test('test_perm_log_imports_event_bus — permissionLogging.ts imports eventBus', () => {
    expect(permLogSrc).toContain("import { eventBus }")
    expect(permLogSrc).toContain("from '../../zszcode/events.js'")
  })

  test('test_tool_permission_resolved_emitted — emits tool_permission_resolved event', () => {
    expect(permLogSrc).toContain("type: 'tool_permission_resolved'")
  })

  test('test_tool_permission_resolved_has_toolUseId — includes toolUseId field', () => {
    expect(permLogSrc).toMatch(/type:\s*'tool_permission_resolved'.*toolUseId/s)
  })

  test('test_tool_permission_resolved_has_decision — includes decision field', () => {
    expect(permLogSrc).toMatch(/type:\s*'tool_permission_resolved'.*decision/s)
  })

  test('test_tool_permission_resolved_has_source — includes source field', () => {
    expect(permLogSrc).toMatch(/type:\s*'tool_permission_resolved'.*source/s)
  })

  test('test_tool_permission_resolved_has_timestamp — includes timestamp: Date.now()', () => {
    expect(permLogSrc).toMatch(/type:\s*'tool_permission_resolved'.*timestamp:\s*Date\.now\(\)/s)
  })
})
