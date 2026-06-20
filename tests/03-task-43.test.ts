import { test, expect, describe, beforeEach } from 'bun:test'
import { ZszCodeEventBus } from '../src/zszcode/events'

describe('task-43: getHistory() 空历史', () => {
  let bus: InstanceType<typeof ZszCodeEventBus>

  beforeEach(() => {
    bus = new ZszCodeEventBus()
  })

  test('test_get_history_empty_returns_array — 返回数组', () => {
    expect(Array.isArray(bus.getHistory())).toBe(true)
  })

  test('test_get_history_empty_length_zero — 长度 0', () => {
    expect(bus.getHistory().length).toBe(0)
  })

  test('test_get_history_empty_not_null — 不是 null', () => {
    expect(bus.getHistory()).not.toBeNull()
  })

  test('test_get_history_empty_not_undefined — 不是 undefined', () => {
    expect(bus.getHistory()).not.toBeUndefined()
  })

  test('test_get_history_empty_with_limit — 带参数也返回空', () => {
    expect(bus.getHistory(100)).toEqual([])
  })
})
