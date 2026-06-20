import { test, expect, describe } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const ROOT = join(import.meta.dir, '..')
const querySrc = readFileSync(join(ROOT, 'src/query.ts'), 'utf-8')

describe('task-81: api_stream_end 事件', () => {
  test('test_api_stream_end_emitted — 发出 api_stream_end', () => {
    expect(querySrc).toContain("eventBus.emit({ type: 'api_stream_end'")
  })

  test('test_api_stream_end_has_timestamp — 包含 timestamp', () => {
    expect(querySrc).toMatch(/type:\s*'api_stream_end'.*timestamp/s)
  })

  test('test_api_stream_end_has_duration — 包含 duration', () => {
    expect(querySrc).toMatch(/type:\s*'api_stream_end'.*duration/s)
  })

  test('test_api_stream_end_after_streaming — 在 streaming_end 之后', () => {
    const streamingEnd = querySrc.indexOf("queryCheckpoint('query_api_streaming_end')")
    const emitPos = querySrc.indexOf("eventBus.emit({ type: 'api_stream_end'")
    expect(emitPos).toBeGreaterThan(streamingEnd)
  })
})
