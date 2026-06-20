# 06 — Query 可观测性

## 模块职责
在 agent loop (query 生成器) 中注入可观测性事件，使 Web 端能实时看到 API 调用和消息流。

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/query.ts` | 219 | query() 入口 emit turn_start |
| `src/query.ts` | 337 | stream_request_start 前 emit api_stream_start |
| `src/query.ts` | 659 | deps.callModel() 循环内 emit api_stream_event |
| `src/query.ts` | 851 | getCompletedResults() 结果 emit tool_call_end |
| `src/query.ts` | 1001 | executePostSamplingHooks() emit hook_fire |
| `src/query.ts` | 1382 | runTools() 前后 emit turn_start/end |
| `src/query.ts` | 1715 | 循环回顶部 emit turn_end |

## 事件注入详情

### query() 入口 (line 219)
```typescript
import { eventBus } from '../zszcode/events.js'

export async function* query(params: QueryParams) {
  eventBus.emit({ type: 'turn_start', turnNumber: 0, timestamp: Date.now() })
  // ... existing code
}
```

### API 调用前 (line 337 附近)
```typescript
eventBus.emit({
  type: 'api_stream_start',
  model: currentModel,
  timestamp: Date.now()
})
yield { type: 'stream_request_start' }
```

### API 流式事件 (line 659 循环内)
```typescript
for await (const message of deps.callModel({ ... })) {
  eventBus.emit({
    type: 'api_stream_event',
    event: message,
    timestamp: Date.now()
  })
  // ... existing yield
}
```

### 工具执行阶段 (line 1382 附近)
```typescript
// Before runTools():
eventBus.emit({ type: 'turn_start', turnNumber: state.turnCount, timestamp: Date.now() })

// After runTools() completes:
eventBus.emit({ type: 'turn_end', turnNumber: state.turnCount, timestamp: Date.now() })
```

## 测试要求
1. api_stream_start 在模型调用前发出
2. api_stream_event 每个 streaming event 都发出
3. turn_start 在 query loop 入口发出
4. turn_end 在 query loop 出口发出
5. 事件包含正确的 model 名称
6. 事件包含正确的时间戳
