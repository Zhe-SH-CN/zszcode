import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const onChangeSrc = readFileSync(join(ROOT, 'src/state/onChangeAppState.ts'), 'utf-8')

describe('task-120: state_change for permission mode', () => {
  test('test_state_change_permission_mode — emits for toolPermissionContext.mode', () => {
    expect(onChangeSrc).toContain("field: 'toolPermissionContext.mode'")
  })

  test('test_state_change_mainLoopModel — emits for mainLoopModel', () => {
    expect(onChangeSrc).toContain("field: 'mainLoopModel'")
  })

  test('test_state_change_expandedView — emits for expandedView', () => {
    expect(onChangeSrc).toContain("field: 'expandedView'")
  })

  test('test_state_change_verbose — emits for verbose', () => {
    expect(onChangeSrc).toContain("field: 'verbose'")
  })

  test('test_state_change_settings — emits for settings', () => {
    expect(onChangeSrc).toContain("field: 'settings'")
  })
})
