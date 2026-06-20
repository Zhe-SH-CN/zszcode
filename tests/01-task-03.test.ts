import { test, expect } from 'bun:test'
import { feature } from '../src/shims/bun-bundle'

test('test_feature_returns_false — feature("any_flag") 返回 false', () => {
  expect(feature('any_flag')).toBe(false)
})

test('test_feature_empty_string — feature("") 返回 false', () => {
  expect(feature('')).toBe(false)
})

test('test_feature_known_flag — feature("ENABLE_VOICE") 返回 false', () => {
  expect(feature('ENABLE_VOICE')).toBe(false)
})

test('test_feature_numeric_string — feature("123") 返回 false', () => {
  expect(feature('123')).toBe(false)
})

test('test_feature_return_type_boolean — typeof 为 boolean', () => {
  expect(typeof feature('test')).toBe('boolean')
})
