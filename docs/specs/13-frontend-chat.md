# 13 — 前端 Chat Tab

## 模块职责
浅层对话体验，渲染消息流（thinking, text, tool use, tool result, system, result）。

## 新增目录
`web/src/components/` 下的组件：

| 组件 | 用途 |
|------|------|
| StreamView.tsx | 主消息流容器 |
| MessageBlock.tsx | 单条消息分发 |
| ThinkingBlock.tsx | Thinking 折叠块 |
| TextBlock.tsx | Markdown 渲染 |
| ToolUseBlock.tsx | Tool 调用卡片 |
| ToolResultBlock.tsx | Tool 结果（折叠，10 行预览） |
| ResultBlock.tsx | 最终统计 |
| SystemBlock.tsx | 系统消息 |
| ChatInput.tsx | 底部输入框 |

## 渲染规则

| 块类型 | 渲染方式 |
|--------|---------|
| Thinking | 灰色背景，折叠，点击展开 |
| Text | react-markdown + react-syntax-highlighter（深色主题） |
| Tool Use | 卡片：tool name 粗体，input JSON 可折叠 |
| Tool Result | 折叠，最多 10 行预览，成功绿色/失败红色边框 |
| Result | 底部统计：duration, tokens, cost, stop_reason |
| System | 顶部通知条样式 |

## ChatInput 行为
- 发送消息通过 WebSocket: `{ type: 'send', sessionId, content }`
- 发送后禁用输入框
- 收到 result 消息后重新启用
- 消息排队：agent 处理中也可输入

## 数据流
```
WebSocket → useWebSocket hook → events[] 
  → StreamView 过滤 type='message' 
  → MessageBlock 分发到对应 Block 组件
```

## 依赖
- react-markdown
- react-syntax-highlighter

## 测试要求
1. StreamView 从 WebSocket 事件渲染消息
2. ThinkingBlock 默认折叠
3. ToolResultBlock 最多 10 行预览
4. ChatInput 通过 WebSocket 发送消息
5. agent 处理中 ChatInput 禁用
6. TextBlock 渲染 markdown 语法高亮
