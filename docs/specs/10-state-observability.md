# 10 — 状态变更可观测性

## 模块职责
在 AppState 变更时注入可观测性事件，使 Web 端能追踪权限模式切换、agent 状态变化等。

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/state/store.ts` | 20 | setState() 中 emit state_change |

## 修改详情

原代码 (line 20-27):
```typescript
setState: (updater: (prev: T) => T) => {
  const prev = state
  const next = updater(prev)
  if (Object.is(next, prev)) return
  state = next
  onChange?.({ newState: next, oldState: prev })
  for (const listener of listeners) listener()
}
```

修改为:
```typescript
import { eventBus } from '../zszcode/events.js'

setState: (updater: (prev: T) => T) => {
  const prev = state
  const next = updater(prev)
  if (Object.is(next, prev)) return
  state = next
  onChange?.({ newState: next, oldState: prev })

  // Emit state change events for key fields
  const prevObj = prev as Record<string, unknown>
  const nextObj = next as Record<string, unknown>
  for (const key of Object.keys(nextObj)) {
    if (!Object.is(prevObj[key], nextObj[key])) {
      eventBus.emit({
        type: 'state_change',
        field: key,
        oldValue: prevObj[key],
        newValue: nextObj[key],
        timestamp: Date.now()
      })
    }
  }

  for (const listener of listeners) listener()
}
```

## 关键监控字段
| 字段 | 位置 | 含义 |
|------|------|------|
| tasks | AppStateStore.ts:160 | agent task 状态 |
| mcp | AppStateStore.ts:173 | MCP 连接状态 |
| todos | AppStateStore.ts:220 | 每个 agent 的 todo |
| toolPermissionContext | AppStateStore.ts:109 | 权限模式 |
| speculation | AppStateStore.ts:392 | 推测执行状态 |

## 测试要求
1. state_change 在 setState 时发出
2. state_change 包含正确的 field 名称
3. state_change 包含 oldValue 和 newValue
4. Object.is 相同时不发出事件
5. 多个字段变化发出多个事件
