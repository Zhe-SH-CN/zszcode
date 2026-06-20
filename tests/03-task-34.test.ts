import { test, expect, describe, beforeEach } from 'bun:test'
import { eventBus, ZszCodeEventBus } from '../src/zszcode/events'

describe('task-34: emit() 广播事件', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_emit_calls_listener — listener 被调用', () => {
    let received = false
    bus.onEvent(() => { received = true })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(received).toBe(true)
  })

  test('test_emit_passes_event_object — 传递正确事件', () => {
    let received: any = null
    bus.onEvent((e) => { received = e })
    const event = { type: 'turn_start' as const, timestamp: Date.now(), turnNumber: 1 }
    bus.emit(event)
    expect(received.type).toBe('turn_start')
  })

  test('test_emit_returns_boolean — 返回 boolean', () => {
    bus.onEvent(() => {})
    const result = bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(typeof result).toBe('boolean')
  })

  test('test_emit_no_listeners_returns_false — 无 listener 返回 false', () => {
    const result = bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(result).toBe(false)
  })

  test('test_emit_with_listener_returns_true — 有 listener 返回 true', () => {
    bus.onEvent(() => {})
    const result = bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(result).toBe(true)
  })
})
