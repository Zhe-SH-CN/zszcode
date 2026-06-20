import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-37: 多 listener 同时接收', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_multiple_listeners_all_called — 3 个 listener 全部调用', () => {
    let count = 0
    bus.onEvent(() => { count++ })
    bus.onEvent(() => { count++ })
    bus.onEvent(() => { count++ })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(count).toBe(3)
  })

  test('test_multiple_listeners_same_event — 收到同一事件引用', () => {
    const received: any[] = []
    bus.onEvent((e) => { received.push(e) })
    bus.onEvent((e) => { received.push(e) })
    const event = { type: 'turn_start' as const, timestamp: Date.now(), turnNumber: 1 }
    bus.emit(event)
    expect(received[0]).toBe(received[1])
  })

  test('test_multiple_listeners_order — 按注册顺序调用', () => {
    const order: number[] = []
    bus.onEvent(() => { order.push(1) })
    bus.onEvent(() => { order.push(2) })
    bus.onEvent(() => { order.push(3) })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(order).toEqual([1, 2, 3])
  })

  test('test_multiple_listeners_one_unsubscribed — 一个 unsubscribe 后其余正常', () => {
    let count = 0
    const unsub = bus.onEvent(() => { count++ })
    bus.onEvent(() => { count++ })
    unsub()
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(count).toBe(1)
  })

  test('test_multiple_listeners_10_listeners — 10 个 listener', () => {
    let count = 0
    for (let i = 0; i < 10; i++) bus.onEvent(() => { count++ })
    bus.emit({ type: 'turn_start', timestamp: Date.now(), turnNumber: 1 })
    expect(count).toBe(10)
  })
})
