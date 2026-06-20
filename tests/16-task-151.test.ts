import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 151: useSession hook', () => {
  const content = readFileSync(join(WEB, 'src', 'hooks', 'useSession.ts'), 'utf-8')

  test('useSession.ts exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports useSession function', () => {
    expect(content).toContain('export function useSession')
  })

  test('returns sessions array', () => {
    expect(content).toContain('sessions')
  })

  test('returns activeSessionId', () => {
    expect(content).toContain('activeSessionId')
  })

  test('provides switchSession', () => {
    expect(content).toContain('switchSession')
  })

  test('provides createSession', () => {
    expect(content).toContain('createSession')
  })

  test('has Default session', () => {
    expect(content).toContain("'Default'")
  })
})
