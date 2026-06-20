import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 172-175: ToolResultBlock component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'ToolResultBlock.tsx'), 'utf-8')

  test('ToolResultBlock.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports ToolResultBlock', () => {
    expect(content).toContain('export const ToolResultBlock')
  })

  test('has data-testid=tool-result-block', () => {
    expect(content).toContain('tool-result-block')
  })

  test('max 10 lines preview', () => {
    expect(content).toContain('MAX_LINES')
    expect(content).toContain('10')
  })

  test('success green border', () => {
    expect(content).toContain('border-green-500')
  })

  test('failed red border', () => {
    expect(content).toContain('border-red-500')
  })

  test('shows more lines count', () => {
    expect(content).toContain('more lines')
  })

  test('Show more/less toggle', () => {
    expect(content).toContain('Show more')
    expect(content).toContain('Show less')
  })
})
