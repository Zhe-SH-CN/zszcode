import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 195: SignalsView component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'SignalsView.tsx'), 'utf-8')

  test('SignalsView.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports SignalsView', () => {
    expect(content).toContain('export const SignalsView')
  })

  test('has data-testid=signals-view', () => {
    expect(content).toContain('data-testid="signals-view"')
  })

  test('renders SignalFilter', () => {
    expect(content).toContain('SignalFilter')
  })

  test('renders SignalCard list', () => {
    expect(content).toContain('SignalCard')
  })

  test('empty placeholder', () => {
    expect(content).toContain('No signals yet')
  })

  test('sorts newest first', () => {
    expect(content).toContain('b.timestamp - a.timestamp')
  })

  test('has pause button', () => {
    expect(content).toContain('data-testid="pause-scroll-button"')
  })
})
