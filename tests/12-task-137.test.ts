import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const statusLineTypeSrc = readFileSync(join(ROOT, 'src/types/statusLine.ts'), 'utf-8')

describe('task-137: StatusLineCommandInput type with web_url', () => {
  test('test_type_file_exists — statusLine.ts type file exists', () => {
    expect(statusLineTypeSrc).toBeTruthy()
  })

  test('test_type_exports_StatusLineCommandInput — exports the type', () => {
    expect(statusLineTypeSrc).toContain('StatusLineCommandInput')
  })

  test('test_type_has_web_url — includes web_url field', () => {
    expect(statusLineTypeSrc).toMatch(/web_url\??\s*:\s*string/)
  })

  test('test_type_has_model — includes model field', () => {
    expect(statusLineTypeSrc).toContain('model:')
  })

  test('test_type_has_workspace — includes workspace field', () => {
    expect(statusLineTypeSrc).toContain('workspace:')
  })

  test('test_type_has_cost — includes cost field', () => {
    expect(statusLineTypeSrc).toContain('cost:')
  })
})
