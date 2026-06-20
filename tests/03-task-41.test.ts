import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-41: getHistory(limit)', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_get_history_returns_last_n — 返回最后 N 条', () => {
    for (let i = 0; i < 10; i++) bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    const h = bus.getHistory(5)
    expect(h.length).toBe(5)
    expect(h[0].turnNumber).toBe(5)
  })

  test('test_get_history_limit_exceeds_length — 超出返回全部', () => {
    for (let i = 0; i < 10; i++) bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    expect(bus.getHistory(100).length).toBe(10)
  })

  test('test_get_history_returns_array — 返回数组', () => {
    expect(Array.isArray(bus.getHistory())).toBe(true)
  })

  test('test_get_history_elements_are_events — 元素有 type 和 timestamp', () => {
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    const h = bus.getHistory()
    expect(h[0]).toHaveProperty('type')
    expect(h[0]).toHaveProperty('timestamp')
  })

  test('test_get_history_preserves_order — 按时间顺序', () => {
    for (let i = 0; i < 10; i++) bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    const h = bus.getHistory(10)
    for (let i = 1; i < h.length; i++) {
      expect(h[i].timestamp).toBeGreaterThan(h[i - 1].timestamp)
    }
  })
})
