import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 156-159: PermissionBar component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'PermissionBar.tsx'), 'utf-8')

  test('PermissionBar.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports PermissionBar', () => {
    expect(content).toContain('export const PermissionBar')
  })

  test('has data-testid=permission-bar', () => {
    expect(content).toContain('data-testid="permission-bar"')
  })

  test('shows tool name', () => {
    expect(content).toContain('toolName')
  })

  test('has Allow button', () => {
    expect(content).toContain('data-testid="allow-button"')
  })

  test('has Deny button', () => {
    expect(content).toContain('data-testid="deny-button"')
  })

  test('has Allow Always button', () => {
    expect(content).toContain('data-testid="allow-always-button"')
  })

  test('has 30s countdown', () => {
    expect(content).toContain('COUNTDOWN_SECS')
  })

  test('sends permission_response via WebSocket', () => {
    expect(content).toContain('permission_response')
  })

  test('fixed at bottom', () => {
    expect(content).toContain('fixed bottom-0')
  })
})
