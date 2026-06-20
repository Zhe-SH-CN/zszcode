import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 182: WorkflowView component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'WorkflowView.tsx'), 'utf-8')

  test('WorkflowView.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports WorkflowView', () => {
    expect(content).toContain('export const WorkflowView')
  })

  test('has data-testid=workflow-view', () => {
    expect(content).toContain('data-testid="workflow-view"')
  })

  test('renders AgentTreeNode', () => {
    expect(content).toContain('AgentTreeNode')
  })

  test('empty placeholder', () => {
    expect(content).toContain('Waiting for agent activity')
  })

  test('scrollable container', () => {
    expect(content).toContain('overflow-auto')
  })
})
