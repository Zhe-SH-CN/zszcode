import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const clientSrc = readFileSync(join(ROOT, 'src/services/mcp/client.ts'), 'utf-8')

describe('task-111: mcp_call event', () => {
  test('test_mcp_call_emitted — emits mcp_call event', () => {
    expect(clientSrc).toContain("type: 'mcp_call'")
  })

  test('test_mcp_call_has_serverName — includes serverName field', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_call'.*serverName/s)
  })

  test('test_mcp_call_has_toolName — includes toolName field', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_call'.*toolName/s)
  })

  test('test_mcp_call_has_request — includes request field', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_call'.*request/s)
  })

  test('test_mcp_call_has_duration — includes duration field', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_call'.*duration/s)
  })

  test('test_mcp_call_has_timestamp — includes timestamp: Date.now()', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_call'.*timestamp:\s*Date\.now\(\)/s)
  })

  test('test_mcp_call_has_response — success path includes response', () => {
    // The success path should have response: result
    expect(clientSrc).toMatch(/type:\s*'mcp_call'[^}]*response:\s*result/s)
  })
})
