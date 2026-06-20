import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 160: Tab switching', () => {
  const content = readFileSync(join(WEB, 'src', 'App.tsx'), 'utf-8')

  test('has Tab type', () => {
    expect(content).toContain("type Tab")
  })

  test('default tab is chat', () => {
    expect(content).toContain("useState<Tab>('chat')")
  })

  test('has tab buttons with data-testid', () => {
    expect(content).toContain('data-testid={`tab-${tab}`}')
  })

  test('has tab content sections', () => {
    expect(content).toContain('data-testid="tab-content-chat"')
    expect(content).toContain('data-testid="tab-content-workflow"')
    expect(content).toContain('data-testid="tab-content-signals"')
  })

  test('active tab has highlight style', () => {
    expect(content).toContain('border-b-2 border-accent-blue')
  })
})
