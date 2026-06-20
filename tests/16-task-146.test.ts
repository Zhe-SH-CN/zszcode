import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 146: index.html entry file', () => {
  const content = readFileSync(join(WEB, 'index.html'), 'utf-8')

  test('index.html exists', () => {
    expect(content).toBeTruthy()
  })

  test('has DOCTYPE', () => {
    expect(content).toContain('<!DOCTYPE html>')
  })

  test('has root div', () => {
    expect(content).toContain('<div id="root"></div>')
  })

  test('has script pointing to main.tsx', () => {
    expect(content).toContain('src="/src/main.tsx"')
  })

  test('title is ZSZCode', () => {
    expect(content).toContain('<title>ZSZCode</title>')
  })
})
