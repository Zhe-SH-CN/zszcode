import { test, expect, describe } from 'bun:test'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const WEB_DIST = join(ROOT, 'web', 'dist')

describe('task-208: 前端 build:web 生成 web/dist/', () => {
  test('test_web_dist_exists — web/dist/ 目录存在', () => {
    expect(existsSync(WEB_DIST)).toBe(true)
  })

  test('test_web_dist_has_index_html — index.html 存在', () => {
    expect(existsSync(join(WEB_DIST, 'index.html'))).toBe(true)
  })

  test('test_web_dist_has_assets — assets 目录有文件', () => {
    const assetsDir = join(WEB_DIST, 'assets')
    expect(existsSync(assetsDir)).toBe(true)
  })

  test('test_web_dist_index_references_assets — index.html 引用资源', () => {
    const html = readFileSync(join(WEB_DIST, 'index.html'), 'utf-8')
    expect(html).toContain('/assets/')
  })

  test('test_web_dist_size_reasonable — 总大小 < 5MB', () => {
    const { execSync } = require('child_process')
    const output = execSync(`du -sb ${WEB_DIST}`, { encoding: 'utf-8' })
    const size = parseInt(output.split('\t')[0])
    expect(size).toBeLessThan(5 * 1024 * 1024)
  })
})
