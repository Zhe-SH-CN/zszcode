# 08 — Agent 生命周期可观测性

## 模块职责
在子 agent 生成和完成时注入可观测性事件，使 Web 端能构建 Agent 父子关系树。

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/tools/AgentTool/runAgent.ts` | 248 | runAgent() 入口 emit agent_spawn |
| `src/tools/AgentTool/runAgent.ts` | 347 | createAgentId() 获取 childId |
| `src/tools/AgentTool/runAgent.ts` | 532 | executeSubagentStartHooks() emit hook_fire |
| `src/tools/AgentTool/runAgent.ts` | 748 | query() 循环 yield 的 message emit message |
| `src/tools/AgentTool/runAgent.ts` | 816 | finally 块 emit agent_complete |

## 事件注入详情

### runAgent() 入口 (line 248-347)
```typescript
import { eventBus } from '../../../zszcode/events.js'

export async function* runAgent({ ... }) {
  const agentId = override?.agentId ?? createAgentId()
  const startTime = Date.now()

  eventBus.emit({
    type: 'agent_spawn',
    parentId: toolUseContext.toolUseId ?? 'root',
    childId: agentId,
    agentType: agentDefinition.name ?? 'general',
    description: description ?? '',
    timestamp: startTime
  })

  // ... existing code
}
```

### finally 块 (line 816)
```typescript
} finally {
  eventBus.emit({
    type: 'agent_complete',
    agentId,
    duration: Date.now() - startTime,
    timestamp: Date.now()
  })

  // ... existing cleanup
}
```

### query() 循环 (line 748)
```typescript
for await (const message of query({ ... })) {
  eventBus.emit({
    type: 'message',
    role: message.type,
    content: message,
    timestamp: Date.now()
  })
  yield message
}
```

## 测试要求
1. agent_spawn 在 runAgent 入口发出
2. agent_spawn 包含正确的 parentId 和 childId
3. agent_complete 在 finally 块发出
4. agent_complete 包含正确的 duration
5. message 事件对每个 yield 的消息发出
