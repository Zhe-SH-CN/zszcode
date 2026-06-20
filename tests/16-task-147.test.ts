import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 147: App.tsx main layout', () => {
  const content = readFileSync(join(WEB, 'src', 'App.tsx'), 'utf-8')

  test('App.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('imports ContextGauge', () => {
    expect(content).toContain('ContextGauge')
  })

  test('imports SessionSidebar', () => {
    expect(content).toContain('SessionSidebar')
  })

  test('has Chat/Workflow/Signals tabs', () => {
    expect(content).toContain("'chat'")
    expect(content).toContain("'workflow'")
    expect(content).toContain("'signals'")
  })

  test('imports ChatInput', () => {
    expect(content).toContain('ChatInput')
  })
})
