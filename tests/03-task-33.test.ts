import { test, expect, describe } from 'bun:test'
import { EventEmitter } from 'events'
import { eventBus } from '../src/zszcode/events'

describe('task-33: ZszCodeEventBus 类', () => {
  test('test_event_bus_is_event_emitter — 继承 EventEmitter', () => {
    expect(eventBus).toBeInstanceOf(EventEmitter)
  })

  test('test_event_bus_has_emit_method — emit 是函数', () => {
    expect(typeof eventBus.emit).toBe('function')
  })

  test('test_event_bus_has_on_event_method — onEvent 是函数', () => {
    expect(typeof eventBus.onEvent).toBe('function')
  })

  test('test_event_bus_has_get_history_method — getHistory 是函数', () => {
    expect(typeof eventBus.getHistory).toBe('function')
  })

  test('test_event_bus_singleton — 单例', async () => {
    const { eventBus: bus2 } = await import('../src/zszcode/events')
    expect(eventBus).toBe(bus2)
  })
})
