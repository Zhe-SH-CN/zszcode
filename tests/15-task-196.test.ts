import { describe, test, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const WEB = join(import.meta.dir, '..', 'web')

describe('task 196-198: SignalFilter component', () => {
  const content = readFileSync(join(WEB, 'src', 'components', 'SignalFilter.tsx'), 'utf-8')

  test('SignalFilter.tsx exists', () => {
    expect(content).toBeTruthy()
  })

  test('exports SignalFilter', () => {
    expect(content).toContain('export const SignalFilter')
  })

  test('has data-testid=signal-filter', () => {
    expect(content).toContain('data-testid="signal-filter"')
  })

  test('renders checkboxes', () => {
    expect(content).toContain('type="checkbox"')
  })

  test('controlled component with checked', () => {
    expect(content).toContain('activeFilters.has(group)')
  })

  test('onToggle callback', () => {
    expect(content).toContain('onToggle(group)')
  })
})
