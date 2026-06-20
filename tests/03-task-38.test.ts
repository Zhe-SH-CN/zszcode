import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-38: 历史缓冲区', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_history_stores_events — emit 后历史包含事件', () => {
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(bus.getHistory().length).toBeGreaterThan(0)
  })

  test('test_history_max_1000 — 最多 1000 条', () => {
    for (let i = 0; i < 1001; i++) {
      bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: i })
    }
    expect(bus.getHistory(2000).length).toBe(1000)
  })

  test('test_history_fifo_order — 最早在前', () => {
    bus.emit({ type: 'turn_start', timestamp: 100, turnNumber: 1 })
    bus.emit({ type: 'turn_start', timestamp: 200, turnNumber: 2 })
    const history = bus.getHistory()
    expect(history[0].timestamp).toBeLessThan(history[1].timestamp)
  })

  test('test_history_initially_empty — 初始为空', () => {
    expect(bus.getHistory()).toEqual([])
  })

  test('test_history_grows_to_limit — 增长到限制', () => {
    for (let i = 0; i < 500; i++) {
      bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: i })
    }
    expect(bus.getHistory(500).length).toBe(500)
  })
})
