# 09 — MCP 交互可观测性

## 模块职责
在 MCP 连接和工具调用时注入可观测性事件。

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/services/mcp/client.ts` | 595 | connectToServer() 返回后 emit mcp_connect |
| `src/services/mcp/client.ts` | 1743 | fetchToolsForClient() 注册工具时 emit skill_load |
| `src/services/mcp/client.ts` | 2813 | callMCPToolWithUrlElicitationRetry() 前后 emit mcp_call |
| `src/services/mcp/client.ts` | 3029 | callMCPTool() 内部 emit 带 duration 的 mcp_call |

## 事件注入详情

### connectToServer() (line 595)
```typescript
import { eventBus } from '../../../zszcode/events.js'

// After connection attempt:
eventBus.emit({
  type: 'mcp_connect',
  serverName: name,
  success: connection.status === 'connected',
  timestamp: Date.now()
})
```

### callMCPTool() (line 3029)
```typescript
const startTime = Date.now()
eventBus.emit({
  type: 'mcp_call',
  serverName: name,
  toolName: tool.name,
  request: { name: tool.name, arguments: args },
  timestamp: startTime
})

const result = await client.callTool({ name: tool.name, arguments: args })

eventBus.emit({
  type: 'mcp_call',
  serverName: name,
  toolName: tool.name,
  request: { name: tool.name, arguments: args },
  response: result,
  duration: Date.now() - startTime,
  timestamp: Date.now()
})
```

## 测试要求
1. mcp_connect 在连接成功时发出 success=true
2. mcp_connect 在连接失败时发出 success=false
3. mcp_call 在 client.callTool() 前发出（无 response）
4. mcp_call 在 client.callTool() 后发出（有 response）
5. mcp_call 包含正确的 duration
