import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-36: unsubscribe 后不再收到事件', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_unsubscribe_removes_listener — 不再收到事件', () => {
    let count = 0
    const unsub = bus.onEvent(() => { count++ })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(count).toBe(1)
    unsub()
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 2 })
    expect(count).toBe(1)
  })

  test('test_unsubscribe_does_not_affect_others — 不影响其他 listener', () => {
    let countA = 0, countB = 0
    const unsubA = bus.onEvent(() => { countA++ })
    bus.onEvent(() => { countB++ })
    unsubA()
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(countA).toBe(0)
    expect(countB).toBe(1)
  })

  test('test_unsubscribe_twice_no_error — 重复 unsubscribe 不报错', () => {
    const unsub = bus.onEvent(() => {})
    unsub()
    expect(() => unsub()).not.toThrow()
  })

  test('test_unsubscribe_then_emit_count — unsubscribe 后计数不变', () => {
    let count = 0
    const unsub = bus.onEvent(() => { count++ })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    unsub()
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 2 })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 3 })
    expect(count).toBe(1)
  })

  test('test_unsubscribe_new_events_only — 只影响后续事件', () => {
    const events: number[] = []
    const unsub = bus.onEvent((e) => { events.push((e as any).turnNumber) })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    unsub()
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 2 })
    expect(events).toEqual([1])
  })
})
