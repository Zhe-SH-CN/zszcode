import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const clientSrc = readFileSync(join(ROOT, 'src/services/mcp/client.ts'), 'utf-8')

describe('task-110: mcp_connect event import', () => {
  test('test_mcp_client_imports_event_bus — client.ts imports eventBus', () => {
    expect(clientSrc).toContain("import { eventBus }")
    expect(clientSrc).toContain("from '../../zszcode/events.js'")
  })

  test('test_mcp_connect_emitted — emits mcp_connect event', () => {
    expect(clientSrc).toContain("type: 'mcp_connect'")
  })

  test('test_mcp_connect_has_serverName — includes serverName field', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_connect'.*serverName/s)
  })

  test('test_mcp_connect_has_success — includes success field', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_connect'.*success/s)
  })

  test('test_mcp_connect_has_timestamp — includes timestamp: Date.now()', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_connect'.*timestamp:\s*Date\.now\(\)/s)
  })

  test('test_mcp_connect_success_true — emits with success: true on connect', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_connect'[^}]*success:\s*true/s)
  })

  test('test_mcp_connect_success_false — emits with success: false on failure', () => {
    expect(clientSrc).toMatch(/type:\s*'mcp_connect'[^}]*success:\s*false/s)
  })
})
