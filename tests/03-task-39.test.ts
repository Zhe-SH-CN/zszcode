import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-39: FIFO 淘汰', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_fifo_removes_oldest — 第 1 个被淘汰', () => {
    for (let i = 0; i < 1001; i++) {
      bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    }
    const history = bus.getHistory(2000)
    expect(history[0].timestamp).toBe(1)
  })

  test('test_fifo_keeps_newest — 最新的仍在', () => {
    for (let i = 0; i < 1001; i++) {
      bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    }
    const history = bus.getHistory(2000)
    expect(history[history.length - 1].timestamp).toBe(1000)
  })

  test('test_fifo_length_exactly_1000 — 2000 次后长度 1000', () => {
    for (let i = 0; i < 2000; i++) {
      bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: i })
    }
    expect(bus.getHistory(5000).length).toBe(1000)
  })

  test('test_fifo_order_preserved — 顺序保持', () => {
    for (let i = 0; i < 1005; i++) {
      bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    }
    const history = bus.getHistory(2000)
    for (let i = 1; i < history.length; i++) {
      expect(history[i].timestamp).toBeGreaterThan(history[i - 1].timestamp)
    }
  })

  test('test_fifo_at_boundary — 恰好 1000 不淘汰', () => {
    for (let i = 0; i < 1000; i++) {
      bus.emit({ type: 'turn_start', timestamp: i, turnNumber: i })
    }
    expect(bus.getHistory(2000).length).toBe(1000)
    expect(bus.getHistory(2000)[0].timestamp).toBe(0)
  })
})
