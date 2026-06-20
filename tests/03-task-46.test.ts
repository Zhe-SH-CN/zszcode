import { test, expect, describe } from 'bun:test'
import type { ZszCodeEvent } from '../src/zszcode/events'

describe('task-46: 事件 timestamp 字段', () => {
  test('test_event_timestamp_type — typeof 为 number', () => {
    const e: ZszCodeEvent = { type: 'turn_start', timestamp: Date.now(), turnNumber: 1 }
    expect(typeof e.timestamp).toBe('number')
  })

  test('test_event_timestamp_positive — 大于 0', () => {
    const e: ZszCodeEvent = { type: 'turn_start', timestamp: Date.now(), turnNumber: 1 }
    expect(e.timestamp).toBeGreaterThan(0)
  })

  test('test_event_timestamp_is_now — 接近 Date.now()', () => {
    const before = Date.now()
    const e: ZszCodeEvent = { type: 'turn_start', timestamp: Date.now(), turnNumber: 1 }
    const after = Date.now()
    expect(e.timestamp).toBeGreaterThanOrEqual(before)
    expect(e.timestamp).toBeLessThanOrEqual(after)
  })

  test('test_event_timestamp_in_range — 在 2024-2030 年', () => {
    const e: ZszCodeEvent = { type: 'turn_start', timestamp: Date.now(), turnNumber: 1 }
    const year = new Date(e.timestamp).getFullYear()
    expect(year).toBeGreaterThanOrEqual(2024)
    expect(year).toBeLessThanOrEqual(2030)
  })

  test('test_event_timestamp_milliseconds — 毫秒级', () => {
    const e: ZszCodeEvent = { type: 'turn_start', timestamp: Date.now(), turnNumber: 1 }
    expect(e.timestamp).toBeGreaterThan(1000000000000)
  })
})
