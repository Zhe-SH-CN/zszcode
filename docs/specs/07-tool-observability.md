# 07 — 工具执行可观测性

## 模块职责
在工具执行流程中注入可观测性事件，使 Web 端能实时看到每个 tool 的调用、权限检查和结果。

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/services/tools/toolExecution.ts` | 337 | runToolUse() 入口 emit tool_call_start |
| `src/services/tools/toolExecution.ts` | 1207 | tool.call() 前后 emit tool_call_start/end |
| `src/services/tools/toolExecution.ts` | 800 | runPreToolUseHooks() emit hook_fire |
| `src/services/tools/toolExecution.ts` | 921 | 权限检查 emit tool_permission_request |
| `src/services/tools/toolExecution.ts` | 1483 | runPostToolUseHooks() emit hook_fire |
| `src/services/tools/toolOrchestration.ts` | 19 | runTools() 入口 emit 批次信息 |
| `src/services/tools/StreamingToolExecutor.ts` | 76 | addTool() emit tool_call_start |
| `src/services/tools/StreamingToolExecutor.ts` | 265 | executeTool() emit tool_call_end |

## 事件注入详情

### tool.call() 前后 (toolExecution.ts line 1207)
```typescript
import { eventBus } from '../../../zszcode/events.js'

// Before tool.call():
const startTime = Date.now()
eventBus.emit({
  type: 'tool_call_start',
  toolName: tool.name,
  toolUseId: toolUseID,
  input: callInput,
  agentId: toolUseContext.options.agentId ?? 'main',
  timestamp: startTime
})

const result = await tool.call(callInput, ...)

// After tool.call():
eventBus.emit({
  type: 'tool_call_end',
  toolName: tool.name,
  toolUseId: toolUseID,
  success: true,
  duration: Date.now() - startTime,
  output: result.data,
  timestamp: Date.now()
})
```

### 权限检查 (toolExecution.ts line 921)
```typescript
eventBus.emit({
  type: 'tool_permission_request',
  toolName: tool.name,
  toolUseId: toolUseID,
  input: processedInput,
  timestamp: Date.now()
})
```

### 流式工具执行 (StreamingToolExecutor.ts line 76)
```typescript
// In addTool():
eventBus.emit({
  type: 'tool_call_start',
  toolName: toolDef.name,
  toolUseId: block.id,
  input: parsedInput,
  agentId: 'streaming',
  timestamp: Date.now()
})
```

## 测试要求
1. tool_call_start 在 tool.call() 前发出
2. tool_call_end 在 tool.call() 后发出且 success=true
3. 错误时 tool_call_end 发出且 success=false
4. 权限请求时 tool_permission_request 发出
5. hook_fire 对 pre/post hooks 都发出
6. duration 测量正确
