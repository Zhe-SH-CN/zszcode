# 03 — 事件总线

## 模块职责
全局事件总线，连接 agent loop 和 Web 服务器。所有可观测性事件通过此总线广播。

## 新增文件
| 文件 | 用途 |
|------|------|
| `src/zszcode/events.ts` | 事件总线实现 |

## 事件类型定义

```typescript
export type ZszCodeEvent =
  | { type: 'api_stream_start'; model: string; timestamp: number }
  | { type: 'api_stream_event'; event: any; timestamp: number }
  | { type: 'api_stream_end'; duration: number; tokens: any; timestamp: number }
  | { type: 'tool_call_start'; toolName: string; toolUseId: string; input: any; agentId: string; timestamp: number }
  | { type: 'tool_call_end'; toolName: string; toolUseId: string; success: boolean; duration: number; output?: any; timestamp: number }
  | { type: 'tool_permission_request'; toolName: string; toolUseId: string; input: any; timestamp: number }
  | { type: 'tool_permission_resolved'; toolName: string; toolUseId: string; decision: string; source: 'web' | 'cli'; timestamp: number }
  | { type: 'agent_spawn'; parentId: string; childId: string; agentType: string; description: string; timestamp: number }
  | { type: 'agent_complete'; agentId: string; duration: number; timestamp: number }
  | { type: 'mcp_connect'; serverName: string; success: boolean; timestamp: number }
  | { type: 'mcp_call'; serverName: string; toolName: string; request: any; response?: any; duration: number; timestamp: number }
  | { type: 'skill_load'; name: string; source: string; timestamp: number }
  | { type: 'skill_invoke'; name: string; args: any; timestamp: number }
  | { type: 'state_change'; field: string; oldValue: any; newValue: any; timestamp: number }
  | { type: 'context_compact'; beforeTokens: number; afterTokens: number; timestamp: number }
  | { type: 'hook_fire'; hookType: string; details: any; timestamp: number }
  | { type: 'message'; role: string; content: any; timestamp: number }
  | { type: 'turn_start'; turnNumber: number; timestamp: number }
  | { type: 'turn_end'; turnNumber: number; timestamp: number }
```

## 类实现

```typescript
import { EventEmitter } from 'events'

class ZszCodeEventBus extends EventEmitter {
  private history: ZszCodeEvent[] = []
  private readonly MAX_HISTORY = 1000

  emit(event: ZszCodeEvent): boolean {
    this.history.push(event)
    if (this.history.length > MAX_HISTORY) {
      this.history.shift()
    }
    return super.emit('event', event)
  }

  onEvent(listener: (event: ZszCodeEvent) => void): () => void {
    this.on('event', listener)
    return () => this.off('event', listener)
  }

  getHistory(limit = 100): ZszCodeEvent[] {
    return this.history.slice(-limit)
  }
}

export const eventBus = new ZszCodeEventBus()
```

## 测试要求
1. emit 广播到所有 listener
2. onEvent 返回 unsubscribe 函数
3. unsubscribe 后不再收到事件
4. 多个 listener 接收同一事件
5. 历史缓冲区保留最近 1000 条
6. 超出 1000 条后 FIFO 淘汰
7. listener 抛异常不影响其他 listener
