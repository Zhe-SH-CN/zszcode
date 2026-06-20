import { test, expect, describe } from 'bun:test'
import { startWebServer } from '../src/zszcode/server'
import { DEFAULTS } from '../src/zszcode/config'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

describe('task-55: 静态文件服务', () => {
  // Create test files
  const webDist = join(process.cwd(), 'web', 'dist')
  mkdirSync(webDist, { recursive: true })
  writeFileSync(join(webDist, 'test.js'), 'console.log("test")')
  writeFileSync(join(webDist, 'test.css'), 'body{}')

  const h = startWebServer({ ...DEFAULTS, webPort: 0 })

  test('test_static_js_file — .js 文件返回 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/test.js?token=${h.token}`)
    expect(res.status).toBe(200)
  })

  test('test_static_css_file — .css 文件返回 200', async () => {
    const res = await fetch(`http://localhost:${h.port}/test.css?token=${h.token}`)
    expect(res.status).toBe(200)
  })

  test('test_static_not_found — 不存在文件返回 404', async () => {
    const res = await fetch(`http://localhost:${h.port}/nonexistent.xyz?token=${h.token}`)
    expect(res.status).toBe(404)
  })

  test('test_static_content_type_js — .js Content-Type', async () => {
    const res = await fetch(`http://localhost:${h.port}/test.js?token=${h.token}`)
    expect(res.headers.get('content-type')).toContain('javascript')
  })

  test('test_static_no_directory_traversal — 路径遍历被拒', async () => {
    const res = await fetch(`http://localhost:${h.port}/../../../etc/passwd?token=${h.token}`)
    expect([403, 404]).toContain(res.status)
  })

})
