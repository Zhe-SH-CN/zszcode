import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 153-154: SessionSidebar component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'SessionSidebar.tsx'), 'utf-8')

  test('SessionSidebar.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports SessionSidebar', () => {
    expect(content).toContain('export const SessionSidebar')
  })

  test('renders session list', () => {
    expect(content).toContain('sessions.map')
  })

  test('has data-testid=session-sidebar', () => {
    expect(content).toContain('data-testid="session-sidebar"')
  })

  test('has New Session button', () => {
    expect(content).toContain('New Session')
  })
})
