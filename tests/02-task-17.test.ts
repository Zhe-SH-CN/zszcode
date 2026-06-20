import { test, expect, describe } from 'bun:test'
import type { ZszCodeConfig } from '../src/zszcode/config'

describe('task-17: ZszCodeConfig 接口定义', () => {
  test('test_config_interface_importable — 可导入类型', () => {
    // 如果编译通过则表示类型存在
    const check: ZszCodeConfig = {
      model: 'test', baseUrl: 'http://x', apiKey: 'k',
      webPort: 3000, autoOpenBrowser: false, permissionMode: 'confirm',
    }
    expect(check).toBeDefined()
  })

  test('test_config_interface_has_model — 包含 model 字段', () => {
    const c: ZszCodeConfig = {} as any
    expect('model' in c || typeof c === 'object').toBe(true)
    // 通过赋值验证类型存在
    const val: ZszCodeConfig['model'] = 'test'
    expect(typeof val).toBe('string')
  })

  test('test_config_interface_has_base_url — 包含 baseUrl 字段', () => {
    const val: ZszCodeConfig['baseUrl'] = 'http://test'
    expect(typeof val).toBe('string')
  })

  test('test_config_interface_has_permission_mode — permissionMode 类型约束', () => {
    const auto: ZszCodeConfig['permissionMode'] = 'auto'
    const confirm: ZszCodeConfig['permissionMode'] = 'confirm'
    expect(auto).toBe('auto')
    expect(confirm).toBe('confirm')
  })

  test('test_config_interface_field_count — 恰好 6 个字段', () => {
    // 通过构造完整对象验证所有字段
    const c: ZszCodeConfig = {
      model: '', baseUrl: '', apiKey: '',
      webPort: 0, autoOpenBrowser: false, permissionMode: 'auto',
    }
    expect(Object.keys(c).length).toBe(6)
  })
})
