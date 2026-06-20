import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const statusLineSrc = readFileSync(join(ROOT, 'src/components/StatusLine.tsx'), 'utf-8')

describe('task-136: StatusLine webUrl prop', () => {
  test('test_statusline_has_webUrl_prop — Props type includes webUrl', () => {
    expect(statusLineSrc).toMatch(/webUrl\??\s*:\s*string/)
  })

  test('test_statusline_inner_accepts_webUrl — StatusLineInner destructures webUrl', () => {
    expect(statusLineSrc).toMatch(/StatusLineInner\(\{[^}]*webUrl/s)
  })

  test('test_statusline_buildFn_accepts_webUrl — buildStatusLineCommandInput accepts webUrl param', () => {
    expect(statusLineSrc).toContain('vimMode?: VimMode, webUrl?: string')
  })

  test('test_statusline_passes_webUrl_to_build — calls buildStatusLineCommandInput with webUrl', () => {
    expect(statusLineSrc).toContain('vimModeRef.current, webUrl)')
  })

  test('test_statusline_includes_web_url_in_output — includes web_url in return value', () => {
    expect(statusLineSrc).toContain('web_url: webUrl')
  })
})
