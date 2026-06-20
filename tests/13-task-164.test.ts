import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 164: StreamView component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'StreamView.tsx'), 'utf-8')

  test('StreamView.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports StreamView', () => {
    expect(content).toContain('export const StreamView')
  })

  test('has data-testid=stream-view', () => {
    expect(content).toContain('data-testid="stream-view"')
  })

  test('renders messages list', () => {
    expect(content).toContain('messages.map')
  })

  test('has auto-scroll with useEffect', () => {
    expect(content).toContain('useEffect')
    expect(content).toContain('scrollHeight')
  })

  test('shows empty placeholder', () => {
    expect(content).toContain('No messages yet')
  })

  test('has overflow-y auto', () => {
    expect(content).toContain('overflow-y-auto')
  })
})
