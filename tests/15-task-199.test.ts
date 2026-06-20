import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 199-200: SignalCard component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'SignalCard.tsx'), 'utf-8')

  test('SignalCard.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports SignalCard', () => {
    expect(content).toContain('export const SignalCard')
  })

  test('has data-testid=signal-card', () => {
    expect(content).toContain('signal-card')
  })

  test('has data-testid=signal-card-expanded', () => {
    expect(content).toContain('signal-card-expanded')
  })

  test('shows event type', () => {
    expect(content).toContain('event.type')
  })

  test('shows timestamp formatted HH:mm:ss.SSS', () => {
    expect(content).toContain('formatTimestamp')
    expect(content).toContain('getMilliseconds')
  })

  test('type color coding', () => {
    expect(content).toContain('typeColor')
    expect(content).toContain('border-blue-500')   // api
    expect(content).toContain('border-green-500')  // tool
    expect(content).toContain('border-purple-500') // agent
  })

  test('collapsible with JSON', () => {
    expect(content).toContain('JSON.stringify(event, null, 2)')
  })

  test('toggle on click', () => {
    expect(content).toContain('setExpanded')
  })
})
