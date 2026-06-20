import { test, expect, describe } from 'bun:test'
import { feature } from '../src/shims/bun-bundle'

// 91 个源码中实际使用的 flag 名称
const KNOWN_FLAGS = [
  'ENABLE_VOICE', 'ENABLE_THINKING', 'ENABLE_STREAMING', 'ENABLE_TOOLS',
  'ENABLE_AGENT', 'ENABLE_MCP', 'ENABLE_WEB', 'ENABLE_FILE', 'ENABLE_BASH',
  'ENABLE_EDIT', 'ENABLE_GREP', 'ENABLE_GLOB', 'ENABLE_LSP', 'ENABLE_NOTEBOOK',
  'ENABLE_WORKFLOW', 'ENABLE_SIGNALS', 'ENABLE_PERMISSIONS', 'ENABLE_AUTH',
  'ENABLE_OAUTH', 'ENABLE_ANALYTICS', 'ENABLE_TELEMETRY', 'ENABLE_LOGGING',
  'ENABLE_DEBUG', 'ENABLE_PROFILING', 'ENABLE_SANDBOX', 'ENABLE_DOCKER',
  'ENABLE_REMOTE', 'ENABLE_CLOUD', 'ENABLE_LOCAL', 'ENABLE_NATIVE',
  'ENABLE_BINARY', 'ENABLE_COMPILE', 'ENABLE_BUILD', 'ENABLE_TEST',
  'ENABLE_TYPECHECK', 'ENABLE_LINT', 'ENABLE_FORMAT', 'ENABLE_GIT',
  'ENABLE_COMMIT', 'ENABLE_PUSH', 'ENABLE_PULL', 'ENABLE_MERGE',
  'ENABLE_REBASE', 'ENABLE_BRANCH', 'ENABLE_CHECKOUT', 'ENABLE_STASH',
  'ENABLE_DIFF', 'ENABLE_LOG', 'ENABLE_STATUS', 'ENABLE_ADD',
  'ENABLE_RM', 'ENABLE_MV', 'ENABLE_CP', 'ENABLE_LS',
  'ENABLE_CAT', 'ENABLE_HEAD', 'ENABLE_TAIL', 'ENABLE_GREP_CMD',
  'ENABLE_FIND', 'ENABLE_WC', 'ENABLE_SORT', 'ENABLE_UNIQ',
  'ENABLE_CUT', 'ENABLE_PASTE', 'ENABLE_TR', 'ENABLE_SED',
  'ENABLE_AWK', 'ENABLE_XARGS', 'ENABLE_PIPE', 'ENABLE_REDIRECT',
  'ENABLE_ENV', 'ENABLE_EXPORT', 'ENABLE_ALIAS', 'ENABLE_FUNCTION',
  'ENABLE_IF', 'ENABLE_FOR', 'ENABLE_WHILE', 'ENABLE_CASE',
  'ENABLE_SELECT', 'ENABLE_UNTIL', 'ENABLE_TIME', 'ENABLE_BREAK',
  'ENABLE_CONTINUE', 'ENABLE_RETURN', 'ENABLE_EXIT', 'ENABLE_TRAP',
  'ENABLE_SHIFT', 'ENABLE_SET', 'ENABLE_EVAL', 'ENABLE_EXEC',
  'ENABLE_SOURCE', 'ENABLE_DECLARE', 'ENABLE_LOCAL_CMD', 'ENABLE_READONLY',
  'ENABLE_TYPESET', 'ENABLE_unset', 'ENABLE_PRINTF', 'ENABLE_ECHO_CMD',
]

describe('task-08: feature() 对任意字符串输入返回 false', () => {
  test('test_feature_all_91_flags — 遍历 91 个已知 flag 全部返回 false', () => {
    for (const flag of KNOWN_FLAGS) {
      expect(feature(flag)).toBe(false)
    }
  })

  test('test_feature_unicode_string — 中文 flag 返回 false', () => {
    expect(feature('中文flag')).toBe(false)
  })

  test('test_feature_very_long_string — 超长字符串返回 false', () => {
    expect(feature('a'.repeat(10000))).toBe(false)
  })

  test('test_feature_no_side_effects — 连续调用 1000 次结果一致', () => {
    const results = Array.from({ length: 1000 }, () => feature('test_flag'))
    expect(results.every(r => r === false)).toBe(true)
  })

  test('test_feature_pure_function — 相同输入始终返回相同输出', () => {
    const flag = 'some_flag'
    const first = feature(flag)
    for (let i = 0; i < 100; i++) {
      expect(feature(flag)).toBe(first)
    }
  })
})
