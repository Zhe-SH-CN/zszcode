import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-42: getHistory() 默认 100', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_get_history_default_100 — 200 次后返回 100', () => {
    for (let i = 0; i < 200; i++) bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: i })
    expect(bus.getHistory().length).toBe(100)
  })

  test('test_get_history_default_less_than_100 — 50 次后返回 50', () => {
    for (let i = 0; i < 50; i++) bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: i })
    expect(bus.getHistory().length).toBe(50)
  })

  test('test_get_history_default_equals_get_history_100 — 默认等于 100', () => {
    for (let i = 0; i < 150; i++) bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: i })
    expect(JSON.stringify(bus.getHistory())).toBe(JSON.stringify(bus.getHistory(100)))
  })

  test('test_get_history_default_returns_array — 返回数组', () => {
    expect(Array.isArray(bus.getHistory())).toBe(true)
  })

  test('test_get_history_default_last_element — 最后是最近事件', () => {
    for (let i = 0; i < 150; i++) bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    const h = bus.getHistory()
    expect(h[h.length - 1].turnNumber).toBe(149)
  })
})
