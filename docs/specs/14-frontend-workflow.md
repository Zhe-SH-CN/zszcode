# 14 — 前端 Workflow Tab

## 模块职责
树形可视化 Agent 父子关系，展示数据流动态粒子效果。

## 新增组件
| 组件 | 用途 |
|------|------|
| WorkflowView.tsx | 主容器 |
| AgentTreeNode.tsx | 单个 Agent 节点 |
| ToolCallNode.tsx | Tool 调用子节点 |
| DataFlowLine.tsx | 数据流线条（粒子动画） |

## 数据结构
```typescript
interface AgentNode {
  id: string
  parentId?: string
  agentType: string
  description: string
  status: 'running' | 'completed' | 'failed'
  startTime: number
  endTime?: number
  toolCalls: ToolCallInfo[]
  children: AgentNode[]
}

interface ToolCallInfo {
  toolName: string
  toolUseId: string
  input: any
  output?: any
  success: boolean
  duration: number
}
```

## 树形构建
- `agent_spawn` 事件创建节点
- `tool_call_start/end` 事件添加 tool 子节点
- `agent_complete` 事件更新状态
- Main Agent 为根节点

## 数据流动画
```css
@keyframes flow {
  0% { stroke-dashoffset: 20; }
  100% { stroke-dashoffset: 0; }
}
.data-flow-line {
  stroke-dasharray: 5 5;
  animation: flow 1s linear infinite;
}
```
- 粒子在线条上从父到子流动
- 颜色编码：运行中绿色，完成灰色，失败红色

## 交互
- 节点可展开/折叠
- 点击节点显示详细信息（input/output JSON）
- 缩放和平移

## 测试要求
1. AgentTreeNode 渲染 agent ID 和 type
2. 树从 agent_spawn 事件构建
3. ToolCallNode 显示 tool name 和 duration
4. DataFlowLine 有 CSS 动画
5. 节点点击展开/折叠
6. 完成节点显示绿色状态
