import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 201-202: Signals auto-scroll and pause', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'SignalsView.tsx'), 'utf-8')

  test('auto-scroll on new events', () => {
    expect(content).toContain('scrollHeight')
  })

  test('near-bottom threshold check', () => {
    expect(content).toContain('< 50')
  })

  test('pause state', () => {
    expect(content).toContain('paused')
    expect(content).toContain('setPaused')
  })

  test('pause button exists', () => {
    expect(content).toContain('data-testid="pause-scroll-button"')
  })

  test('shows new event count when paused', () => {
    expect(content).toContain('data-testid="new-event-count"')
    expect(content).toContain('newCount')
  })
})
