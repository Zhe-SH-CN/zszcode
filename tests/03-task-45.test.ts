import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-45: emit() 返回 boolean', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_emit_returns_true_with_listener — 有 listener 返回 true', () => {
    bus.onEvent(() => {})
    expect(bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })).toBe(true)
  })

  test('test_emit_returns_false_without_listener — 无 listener 返回 false', () => {
    expect(bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })).toBe(false)
  })

  test('test_emit_returns_boolean_type — 类型为 boolean', () => {
    const result = bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(typeof result).toBe('boolean')
  })

  test('test_emit_returns_true_after_unsubscribe_partial — 部分 unsubscribe 后 true', () => {
    const unsub = bus.onEvent(() => {})
    bus.onEvent(() => {})
    unsub()
    expect(bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })).toBe(true)
  })

  test('test_emit_returns_false_after_unsubscribe_all — 全部 unsubscribe 后 false', () => {
    const unsub1 = bus.onEvent(() => {})
    const unsub2 = bus.onEvent(() => {})
    unsub1()
    unsub2()
    expect(bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })).toBe(false)
  })
})
