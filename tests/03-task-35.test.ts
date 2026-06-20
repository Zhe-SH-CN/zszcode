import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-35: onEvent() 返回 unsubscribe', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_on_event_returns_function — 返回函数', () => {
    const unsub = bus.onEvent(() => {})
    expect(typeof unsub).toBe('function')
  })

  test('test_on_event_listener_registered — listener 能收到事件', () => {
    let received = false
    bus.onEvent(() => { received = true })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(received).toBe(true)
  })

  test('test_on_event_unsubscribe_type — 返回函数类型', () => {
    const unsub = bus.onEvent(() => {})
    expect(typeof unsub).toBe('function')
  })

  test('test_on_event_multiple_registrations — 多个 listener', () => {
    let count = 0
    bus.onEvent(() => { count++ })
    bus.onEvent(() => { count++ })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(count).toBe(2)
  })

  test('test_on_event_same_listener_twice — 同一 listener 注册两次', () => {
    let count = 0
    const listener = () => { count++ }
    bus.onEvent(listener)
    bus.onEvent(listener)
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(count).toBe(2)
  })
})
