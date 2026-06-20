import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-40: listener 异常不影响其他', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_throwing_listener_does_not_block_others — A 抛异常 B 正常', () => {
    let bCalled = false
    bus.onEvent(() => { throw new Error('boom') })
    bus.onEvent(() => { bCalled = true })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(bCalled).toBe(true)
  })

  test('test_throwing_listener_does_not_throw_from_emit — emit 不抛异常', () => {
    bus.onEvent(() => { throw new Error('boom') })
    expect(() => {
      bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    }).not.toThrow()
  })

  test('test_throwing_listener_still_in_history — 事件仍记录', () => {
    bus.onEvent(() => { throw new Error('boom') })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(bus.getHistory().length).toBe(1)
  })

  test('test_throwing_listener_called_once — 只调用一次', () => {
    let count = 0
    bus.onEvent(() => { count++; throw new Error('boom') })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(count).toBe(1)
  })

  test('test_multiple_throwing_listeners — 多个抛异常', () => {
    let cCalled = false
    bus.onEvent(() => { throw new Error('a') })
    bus.onEvent(() => { throw new Error('b') })
    bus.onEvent(() => { cCalled = true })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(cCalled).toBe(true)
  })
})
