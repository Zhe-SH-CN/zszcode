import { test, expect, describe } from 'bun:test'
import { eventBus } from '../src/zszcode/events'

describe('task-44: eventBus 单例', () => {
  test('test_event_bus_singleton_identity — 同一引用', async () => {
    const { eventBus: bus2 } = await import('../src/zszcode/events')
    expect(eventBus).toBe(bus2)
  })

  test('test_event_bus_cross_module_receive — 跨模块接收', async () => {
    const { eventBus: bus2 } = await import('../src/zszcode/events')
    let received = false
    bus2.onEvent(() => { received = true })
    eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(received).toBe(true)
  })

  test('test_event_bus_shared_history — 共享历史', async () => {
    const { eventBus: bus2 } = await import('../src/zszcode/events')
    eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(bus2.getHistory().length).toBeGreaterThan(0)
  })

  test('test_event_bus_singleton_not_new_instance — 不是新实例', async () => {
    const { eventBus: bus2 } = await import('../src/zszcode/events')
    expect(eventBus).toBe(bus2)
  })

  test('test_event_bus_singleton_has_same_listeners — 共享 listener', async () => {
    const { eventBus: bus2 } = await import('../src/zszcode/events')
    let called = false
    bus2.onEvent(() => { called = true })
    eventBus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(called).toBe(true)
  })
})
