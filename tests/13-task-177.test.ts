import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 177: SystemBlock component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'SystemBlock.tsx'), 'utf-8')

  test('SystemBlock.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports SystemBlock', () => {
    expect(content).toContain('export const SystemBlock')
  })

  test('has data-testid=system-block', () => {
    expect(content).toContain('data-testid="system-block"')
  })

  test('info level blue border', () => {
    expect(content).toContain('border-blue-500')
  })

  test('warning level yellow border', () => {
    expect(content).toContain('border-yellow-500')
  })

  test('error level red border', () => {
    expect(content).toContain('border-red-500')
  })

  test('default level is info', () => {
    expect(content).toContain("level = 'info'")
  })
})
