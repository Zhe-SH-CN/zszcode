import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const runAgentSrc = readFileSync(join(ROOT, 'src/tools/AgentTool/runAgent.ts'), 'utf-8')

describe('task-103: agent_complete event', () => {
  test('test_agent_complete_emitted — emits agent_complete event', () => {
    expect(runAgentSrc).toContain("type: 'agent_complete'")
  })

  test('test_agent_complete_has_agentId — includes agentId field', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_complete'.*agentId/s)
  })

  test('test_agent_complete_has_duration — includes duration field', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_complete'.*duration/s)
  })

  test('test_agent_complete_has_timestamp — includes timestamp: Date.now()', () => {
    expect(runAgentSrc).toMatch(/type:\s*'agent_complete'.*timestamp:\s*Date\.now\(\)/s)
  })

  test('test_agent_complete_in_finally — emitted in finally block', () => {
    // agent_complete should appear after the try block's closing brace
    const finallyPos = runAgentSrc.indexOf('} finally {')
    const completePos = runAgentSrc.indexOf("type: 'agent_complete'")
    expect(finallyPos).toBeGreaterThan(0)
    expect(completePos).toBeGreaterThan(finallyPos)
  })
})
