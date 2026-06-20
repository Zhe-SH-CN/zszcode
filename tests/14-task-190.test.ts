import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 190-192: DataFlowLine component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'DataFlowLine.tsx'), 'utf-8')

  test('DataFlowLine.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports DataFlowLine', () => {
    expect(content).toContain('export const DataFlowLine')
  })

  test('has data-testid=data-flow-line', () => {
    expect(content).toContain('data-testid="data-flow-line"')
  })

  test('uses SVG line element', () => {
    expect(content).toContain('<line')
  })

  test('stroke-dasharray 5 5', () => {
    expect(content).toContain('strokeDasharray="5 5"')
  })

  test('running status green (#22c55e)', () => {
    expect(content).toContain('#22c55e')
  })

  test('completed status gray (#6b7280)', () => {
    expect(content).toContain('#6b7280')
  })

  test('failed status red (#ef4444)', () => {
    expect(content).toContain('#ef4444')
  })

  test('animate-flow class for running', () => {
    expect(content).toContain('animate-flow')
  })

  test('CSS transition on stroke', () => {
    expect(content).toContain('transition')
  })
})
