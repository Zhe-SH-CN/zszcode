import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const runAgentSrc = readFileSync(join(ROOT, 'src/tools/AgentTool/runAgent.ts'), 'utf-8')

describe('task-102: agent_spawn event import', () => {
  test('test_imports_event_bus — runAgent.ts imports eventBus', () => {
    expect(runAgentSrc).toContain("import { eventBus }")
    expect(runAgentSrc).toContain("from '../../zszcode/events.js'")
  })

  test('test_agent_spawn_emitted — emits agent_spawn event', () => {
    expect(runAgentSrc).toContain("type: 'agent_spawn'")
  })

  test('test_agent_spawn_has_parentId — includes parentId field', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_spawn'.*parentId/s)
  })

  test('test_agent_spawn_has_childId — includes childId field', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_spawn'.*childId/s)
  })

  test('test_agent_spawn_has_agentType — includes agentType field', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_spawn'.*agentType/s)
  })

  test('test_agent_spawn_has_description — includes description field', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_spawn'.*description/s)
  })

  test('test_agent_spawn_has_timestamp — includes timestamp: Date.now()', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_spawn'.*timestamp:\s*Date\.now\(\)/s)
  })
})
