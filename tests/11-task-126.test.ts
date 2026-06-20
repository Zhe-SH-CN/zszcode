import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const permCtxSrc = readFileSync(join(ROOT, 'src/hooks/toolPermission/PermissionContext.ts'), 'utf-8')

describe('task-126: tool_permission_request event', () => {
  test('test_perm_ctx_imports_event_bus — PermissionContext.ts imports eventBus', () => {
    expect(permCtxSrc).toContain("import { eventBus }")
    expect(permCtxSrc).toContain("from '../../zszcode/events.js'")
  })

  test('test_tool_permission_request_emitted — emits tool_permission_request event', () => {
    expect(permCtxSrc).toContain("type: 'tool_permission_request'")
  })

  test('test_tool_permission_request_has_toolName — includes toolName field', () => {
    expect(permCtxSrc).toMatch(/type:\s*'tool_permission_request'.*toolName/s)
  })

  test('test_tool_permission_request_has_toolUseId — includes toolUseId field', () => {
    expect(permCtxSrc).toMatch(/type:\s*'tool_permission_request'.*toolUseId/s)
  })

  test('test_tool_permission_request_has_input — includes input field', () => {
    expect(permCtxSrc).toMatch(/type:\s*'tool_permission_request'.*input/s)
  })

  test('test_tool_permission_request_has_timestamp — includes timestamp: Date.now()', () => {
    expect(permCtxSrc).toMatch(/type:\s*'tool_permission_request'.*timestamp:\s*Date\.now\(\)/s)
  })
})
