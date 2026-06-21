import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 163: Tailwind dark theme config', () => {
  test('tailwind.config.js has darkMode class', () => {
    const content = readFileSync(join(WEB, 'tailwind.config.js'), 'utf-8')
    expect(content).toContain("darkMode: 'class'")
  })

  test('content includes src/**/*.{ts,tsx}', () => {
    const content = readFileSync(join(WEB, 'tailwind.config.js'), 'utf-8')
    expect(content).toContain('./src/**/*.{ts,tsx}')
  })

  test('has custom bg colors', () => {
    const content = readFileSync(join(WEB, 'tailwind.config.js'), 'utf-8')
    expect(content).toContain('bg') || expect(content).toContain('primary')
    expect(content).toContain('primary')
    expect(content).toContain('#080b14')
  })

  test('index.css has Tailwind directives', () => {
    const content = readFileSync(join(WEB, 'src', 'index.css'), 'utf-8')
    expect(content).toContain('@tailwind base')
    expect(content).toContain('@tailwind components')
    expect(content).toContain('@tailwind utilities')
  })

  test('index.html has class=dark', () => {
    const content = readFileSync(join(WEB, 'index.html'), 'utf-8')
    expect(content).toContain('class="dark"')
  })
})
