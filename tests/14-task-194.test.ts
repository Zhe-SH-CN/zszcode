import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 194: Tree builder from events in App.tsx', () => {
  const content = readFileSync(join(WEB, 'src', 'App.tsx'), 'utf-8')

  test('has buildTreeFromEvents function', () => {
    expect(content).toContain('buildTreeFromEvents')
  })

  test('handles agent_spawn events', () => {
    expect(content).toContain("ev.type === 'agent_spawn'")
  })

  test('handles agent_complete events', () => {
    expect(content).toContain("ev.type === 'agent_complete'")
  })

  test('handles tool_call_start events', () => {
    expect(content).toContain("ev.type === 'tool_call_start'")
  })

  test('handles tool_call_end events', () => {
    expect(content).toContain("ev.type === 'tool_call_end'")
  })
})
