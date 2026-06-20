import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 168-169: TextBlock component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'TextBlock.tsx'), 'utf-8')

  test('TextBlock.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports TextBlock', () => {
    expect(content).toContain('export const TextBlock')
  })

  test('has data-testid=text-block', () => {
    expect(content).toContain('data-testid="text-block"')
  })

  test('uses react-markdown', () => {
    expect(content).toContain('ReactMarkdown')
  })

  test('links open in new tab', () => {
    expect(content).toContain('target="_blank"')
  })

  test('has code block styling', () => {
    expect(content).toContain('bg-gray-800')
  })

  test('inline code has gray bg', () => {
    expect(content).toContain('bg-gray-700')
  })
})
