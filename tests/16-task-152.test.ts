import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 152: events.ts type definitions', () => {
  const content = readFileSync(join(WEB, 'src', 'types', 'events.ts'), 'utf-8')

  test('events.ts exists', () => {
    expect(content).toBeTruthy()
  })

  test('defines ZszCodeEventType union', () => {
    expect(content).toContain('ZszCodeEventType')
  })

  test('defines all 19 event types', () => {
    const types = [
      'api_stream_start', 'api_stream_event', 'api_stream_end',
      'tool_call_start', 'tool_call_end', 'tool_permission_request',
      'tool_permission_resolved', 'agent_spawn', 'agent_complete',
      'mcp_connect', 'mcp_call', 'skill_load', 'skill_invoke',
      'state_change', 'context_compact', 'hook_fire',
      'message', 'turn_start', 'turn_end',
    ]
    for (const t of types) {
      expect(content).toContain(`'${t}'`)
    }
  })

  test('defines AgentNode interface', () => {
    expect(content).toContain('interface AgentNode')
  })

  test('defines ToolCallInfo interface', () => {
    expect(content).toContain('interface ToolCallInfo')
  })
})
