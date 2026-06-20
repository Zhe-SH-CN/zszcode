import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 178-181: ChatInput component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'ChatInput.tsx'), 'utf-8')

  test('ChatInput.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports ChatInput', () => {
    expect(content).toContain('export const ChatInput')
  })

  test('has data-testid=chat-input', () => {
    expect(content).toContain('data-testid="chat-input"')
  })

  test('has data-testid=send-button', () => {
    expect(content).toContain('data-testid="send-button"')
  })

  test('has textarea', () => {
    expect(content).toContain('<textarea')
  })

  test('send disabled when empty', () => {
    expect(content).toContain('!text.trim()')
  })

  test('Enter sends, Shift+Enter does not', () => {
    expect(content).toContain('e.shiftKey')
  })

  test('shows Thinking... when disabled', () => {
    expect(content).toContain('Thinking...')
  })

  test('onSend callback', () => {
    expect(content).toContain('onSend')
  })

  test('auto-resize textarea', () => {
    expect(content).toContain('scrollHeight')
  })
})
