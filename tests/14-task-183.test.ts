import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 183-187: AgentTreeNode component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'AgentTreeNode.tsx'), 'utf-8')

  test('AgentTreeNode.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports AgentTreeNode', () => {
    expect(content).toContain('export const AgentTreeNode')
  })

  test('has data-testid=agent-node', () => {
    expect(content).toContain('data-testid="agent-node"')
  })

  test('shows truncated ID (8 chars)', () => {
    expect(content).toContain('slice(0, 8)')
  })

  test('shows agentType', () => {
    expect(content).toContain('node.agentType')
  })

  test('running status green pulse', () => {
    expect(content).toContain('bg-green-400 animate-pulse')
  })

  test('completed status gray', () => {
    expect(content).toContain('bg-gray-500')
  })

  test('failed status red', () => {
    expect(content).toContain('bg-red-500')
  })

  test('expand/collapse toggle', () => {
    expect(content).toContain('setExpanded')
    expect(content).toContain('▼')
    expect(content).toContain('▶')
  })

  test('recursive children rendering', () => {
    expect(content).toContain('node.children.map')
  })

  test('has detail panel', () => {
    expect(content).toContain('data-testid="agent-detail-panel"')
  })

  test('max depth limit', () => {
    expect(content).toContain('MAX_DEPTH')
  })
})
