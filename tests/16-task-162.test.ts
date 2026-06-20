import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 162: Vite proxy config', () => {
  const content = readFileSync(join(WEB, 'vite.config.ts'), 'utf-8')

  test('has proxy config', () => {
    expect(content).toContain('proxy')
  })

  test('proxies /api to localhost:3000', () => {
    expect(content).toContain("'/api'")
    expect(content).toContain('http://localhost:3000')
  })

  test('proxies /ws with ws: true', () => {
    expect(content).toContain("'/ws'")
    expect(content).toContain('ws: true')
  })
})
