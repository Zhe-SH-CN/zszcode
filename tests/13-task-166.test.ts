import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 166-167: ThinkingBlock component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'ThinkingBlock.tsx'), 'utf-8')

  test('ThinkingBlock.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports ThinkingBlock', () => {
    expect(content).toContain('export const ThinkingBlock')
  })

  test('has data-testid=thinking-block', () => {
    expect(content).toContain('thinking-block')
  })

  test('has data-testid=thinking-block-expanded', () => {
    expect(content).toContain('thinking-block-expanded')
  })

  test('collapsed by default', () => {
    expect(content).toContain('useState(false)')
  })

  test('shows 100 char preview', () => {
    expect(content).toContain('100')
  })

  test('toggle on click', () => {
    expect(content).toContain('setExpanded')
  })
})
