import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 188-189: ToolCallNode component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'ToolCallNode.tsx'), 'utf-8')

  test('ToolCallNode.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports ToolCallNode', () => {
    expect(content).toContain('export const ToolCallNode')
  })

  test('has data-testid=tool-call-node', () => {
    expect(content).toContain('data-testid="tool-call-node"')
  })

  test('shows tool name', () => {
    expect(content).toContain('toolCall.toolName')
  })

  test('shows duration', () => {
    expect(content).toContain('formatDuration')
  })

  test('success icon', () => {
    expect(content).toContain('✅')
  })

  test('failure icon', () => {
    expect(content).toContain('❌')
  })
})
