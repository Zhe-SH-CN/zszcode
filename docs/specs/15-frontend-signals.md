# 15 — 前端 Signals Tab

## 模块职责
实时信号流，带过滤器，展示 agent 内部运转的每一个事件。

## 新增组件
| 组件 | 用途 |
|------|------|
| SignalsView.tsx | 主容器 |
| SignalFilter.tsx | 过滤器（checkbox 列表） |
| SignalCard.tsx | 单条信号卡片 |

## 过滤器
| 过滤项 | 对应事件 type |
|--------|-------------|
| API Stream | api_stream_start, api_stream_event, api_stream_end |
| Tool Call | tool_call_start, tool_call_end |
| Permission | tool_permission_request, tool_permission_resolved |
| Agent | agent_spawn, agent_complete |
| MCP | mcp_connect, mcp_call |
| Skill | skill_load, skill_invoke |
| State | state_change |
| Hook | hook_fire |
| Context | context_compact |
| Message | message |
| Turn | turn_start, turn_end |

默认全部选中。

## 信号卡片渲染
```tsx
function SignalCard({ event }: { event: ZszCodeEvent }) {
  return (
    <div className="signal-card">
      <span className="signal-type">{event.type}</span>
      <span className="signal-time">{formatTime(event.timestamp)}</span>
      <pre className="signal-data">{JSON.stringify(event, null, 2)}</pre>
    </div>
  )
}
```

## 行为
- 实时滚动到底部
- 可暂停滚动（点击暂停按钮）
- 每条信号可展开查看完整 JSON
- 过滤器变更立即生效

## 测试要求
1. SignalsView 渲染所有事件
2. 过滤器正确过滤事件类型
3. 默认全部选中
4. 新事件自动滚动到底部
5. 暂停按钮停止自动滚动
