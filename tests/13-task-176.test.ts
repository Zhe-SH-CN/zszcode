import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 176: ResultBlock component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'ResultBlock.tsx'), 'utf-8')

  test('ResultBlock.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports ResultBlock', () => {
    expect(content).toContain('export const ResultBlock')
  })

  test('has data-testid=result-block', () => {
    expect(content).toContain('data-testid="result-block"')
  })

  test('shows duration', () => {
    expect(content).toContain('duration')
  })

  test('shows tokens', () => {
    expect(content).toContain('inputTokens')
    expect(content).toContain('outputTokens')
  })

  test('shows cost in dollar format', () => {
    expect(content).toContain('cost')
    expect(content).toContain('.toFixed(2)')
  })

  test('shows stop reason', () => {
    expect(content).toContain('stopReason')
  })
})
