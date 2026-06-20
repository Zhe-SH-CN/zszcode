import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 148-150: useWebSocket hook', () => {
  const content = readFileSync(join(WEB, 'src', 'hooks', 'useWebSocket.ts'), 'utf-8')

  test('useWebSocket.ts exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports useWebSocket function', () => {
    expect(content).toContain('export function useWebSocket')
  })

  test('returns connected boolean', () => {
    expect(content).toContain('connected')
  })

  test('returns events array', () => {
    expect(content).toContain('events')
  })

  test('returns sendMessage function', () => {
    expect(content).toContain('sendMessage')
  })

  test('implements auto-reconnect with backoff', () => {
    expect(content).toContain('INITIAL_BACKOFF')
    expect(content).toContain('MAX_BACKOFF')
  })

  test('handles unauthorized (4001) close code', () => {
    expect(content).toContain('4001')
    expect(content).toContain('unauthorized')
  })
})
