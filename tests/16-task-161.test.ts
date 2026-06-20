import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 161: 401 unauthorized page', () => {
  const content = readFileSync(join(WEB, 'src', 'App.tsx'), 'utf-8')

  test('has unauthorized check', () => {
    expect(content).toContain('unauthorized')
  })

  test('shows Unauthorized text', () => {
    expect(content).toContain('Unauthorized')
  })

  test('shows Invalid or missing token', () => {
    expect(content).toContain('Invalid or missing token')
  })

  test('has Retry button', () => {
    expect(content).toContain('data-testid="retry-button"')
  })

  test('retry reloads page', () => {
    expect(content).toContain('window.location.reload()')
  })
})
