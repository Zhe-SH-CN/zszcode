import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const onChangeSrc = readFileSync(join(ROOT, 'src/state/onChangeAppState.ts'), 'utf-8')

describe('task-119: state_change event import', () => {
  test('test_onChange_imports_event_bus — onChangeAppState.ts imports eventBus', () => {
    expect(onChangeSrc).toContain("import { eventBus }")
    expect(onChangeSrc).toContain("from '../zszcode/events.js'")
  })

  test('test_state_change_emitted — emits state_change event', () => {
    expect(onChangeSrc).toContain("type: 'state_change'")
  })

  test('test_state_change_has_field — includes field field', () => {
    expect(onChangeSrc).toMatch(/type:\s*'state_change'.*field/s)
  })

  test('test_state_change_has_oldValue — includes oldValue field', () => {
    expect(onChangeSrc).toMatch(/type:\s*'state_change'.*oldValue/s)
  })

  test('test_state_change_has_newValue — includes newValue field', () => {
    expect(onChangeSrc).toMatch(/type:\s*'state_change'.*newValue/s)
  })

  test('test_state_change_has_timestamp — includes timestamp: Date.now()', () => {
    expect(onChangeSrc).toMatch(/type:\s*'state_change'.*timestamp:\s*Date\.now\(\)/s)
  })
})
