import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 155: ContextGauge component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'ContextGauge.tsx'), 'utf-8')

  test('ContextGauge.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports ContextGauge', () => {
    expect(content).toContain('export const ContextGauge')
  })

  test('shows token count', () => {
    expect(content).toContain('tokenCount')
    expect(content).toContain('maxTokens')
  })

  test('shows cost', () => {
    expect(content).toContain('cost')
  })

  test('shows model', () => {
    expect(content).toContain('model')
  })

  test('shows agent status', () => {
    expect(content).toContain('agentStatus')
  })

  test('progress bar red at 80%', () => {
    expect(content).toContain('pct >= 80')
    expect(content).toContain('accent-rose')
  })
})
