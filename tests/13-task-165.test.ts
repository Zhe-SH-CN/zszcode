import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 165: MessageBlock component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'MessageBlock.tsx'), 'utf-8')

  test('MessageBlock.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports MessageBlock', () => {
    expect(content).toContain('export const MessageBlock')
  })

  test('dispatches thinking to ThinkingBlock', () => {
    expect(content).toContain("case 'thinking'")
    expect(content).toContain('ThinkingBlock')
  })

  test('dispatches text to TextBlock', () => {
    expect(content).toContain("case 'text'")
    expect(content).toContain('TextBlock')
  })

  test('dispatches tool_use to ToolUseBlock', () => {
    expect(content).toContain("case 'tool_use'")
    expect(content).toContain('ToolUseBlock')
  })

  test('dispatches tool_result to ToolResultBlock', () => {
    expect(content).toContain("case 'tool_result'")
    expect(content).toContain('ToolResultBlock')
  })

  test('shows JSON for unknown type', () => {
    expect(content).toContain('default')
    expect(content).toContain('JSON.stringify')
  })
})
