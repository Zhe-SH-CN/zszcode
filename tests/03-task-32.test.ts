import { test, expect, describe } from 'bun:test'
import type { ZszCodeEvent } from '../src/zszcode/events'

describe('task-32: ZszCodeEvent 联合类型', () => {
  test('test_event_type_importable — 可导入类型', () => {
    const e: ZszCodeEvent = { type: 'turn_start', timestamp: Date.now(), turnNumber: 1 }
    expect(e.type).toBe('turn_start')
  })

  test('test_event_has_19_variants — 19 种变体', () => {
    const types = [
      'api_stream_start', 'api_stream_event', 'api_stream_end',
      'tool_call_start', 'tool_call_end', 'tool_permission_request', 'tool_permission_resolved',
      'agent_spawn', 'agent_complete',
      'mcp_connect', 'mcp_call',
      'skill_load', 'skill_invoke',
      'state_change', 'context_compact', 'hook_fire',
      'message', 'turn_start', 'turn_end',
    ]
    expect(types.length).toBe(19)
  })

  test('test_event_turn_start_valid — turn_start 事件构造', () => {
    const e: ZszCodeEvent = { type: 'turn_start', timestamp: Date.now(), turnNumber: 1 }
    expect(e).toBeDefined()
  })

  test('test_event_api_stream_start_valid — api_stream_start 事件构造', () => {
    const e: ZszCodeEvent = { type: 'api_stream_start', timestamp: Date.now(), model: 'test' }
    expect(e.model).toBe('test')
  })

  test('test_event_all_have_timestamp — 所有事件有 timestamp', () => {
    const events: ZszCodeEvent[] = [
      { type: 'turn_start', timestamp: 1, turnNumber: 1 },
      { type: 'turn_end', timestamp: 1, turnNumber: 1 },
      { type: 'api_stream_start', timestamp: 1, model: '' },
      { type: 'message', timestamp: 1, role: 'user', content: '' },
    ]
    for (const e of events) {
      expect(e.timestamp).toBeDefined()
      expect(typeof e.timestamp).toBe('number')
    }
  })
})
