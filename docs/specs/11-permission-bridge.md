# 11 — 权限桥接

## 模块职责
实现 Web 端和 CLI 端的权限确认同步。任一端先确认，另一端自动取消。

## 新增文件
| 文件 | 用途 |
|------|------|
| `src/zszcode/permission-bridge.ts` | 权限桥接实现 |

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/services/tools/toolExecution.ts` | 921 | 权限检查处集成 Web 权限 |

## 接口定义

```typescript
export function requestWebPermission(
  toolUseId: string,
  toolName: string,
  input: any,
): Promise<'allow' | 'deny' | 'allow_always'>

export function resolveWebPermission(
  toolUseId: string,
  decision: 'allow' | 'deny' | 'allow_always',
  source: 'web' | 'cli',
): void
```

## 功能点

### requestWebPermission
- 创建 Promise，30 秒超时自动 deny
- 发送 `tool_permission_request` 事件到 Web
- Web 服务器监听 `/api/permission/resolve` 调用 resolveWebPermission

### resolveWebPermission
- 由 Web 服务器调用
- resolve 对应的 Promise
- 发送 `tool_permission_resolved` 事件

### 集成到 toolExecution.ts (line 921)
```typescript
import { requestWebPermission } from '../../../zszcode/permission-bridge.js'

// 在权限检查处，同时向 CLI 和 Web 发起确认
const webDecision = requestWebPermission(toolUseID, tool.name, processedInput)
const cliDecision = canUseTool(tool, processedInput, toolUseContext, assistantMessage, toolUseID)
const decision = await Promise.race([
  webDecision.then(d => ({ source: 'web' as const, decision: d })),
  cliDecision.then(d => ({ source: 'cli' as const, decision: d })),
])
```

## 测试要求
1. requestWebPermission 返回 Promise
2. resolveWebPermission 调用后 Promise resolve
3. 30 秒超时自动 deny
4. tool_permission_request 事件发出
5. tool_permission_resolved 事件在 resolve 时发出
6. allow_always 决策在会话期间持续
