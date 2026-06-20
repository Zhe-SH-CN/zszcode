import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 170-171: ToolUseBlock component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'ToolUseBlock.tsx'), 'utf-8')

  test('ToolUseBlock.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports ToolUseBlock', () => {
    expect(content).toContain('export const ToolUseBlock')
  })

  test('has data-testid=tool-use-block', () => {
    expect(content).toContain('data-testid="tool-use-block"')
  })

  test('shows tool name bold', () => {
    expect(content).toContain('font-bold')
    expect(content).toContain('toolName')
  })

  test('has blue left border', () => {
    expect(content).toContain('border-l-4 border-blue-500')
  })

  test('input collapsible', () => {
    expect(content).toContain('Show input')
    expect(content).toContain('Hide input')
  })

  test('JSON formatted with stringify', () => {
    expect(content).toContain('JSON.stringify(input, null, 2)')
  })
})
