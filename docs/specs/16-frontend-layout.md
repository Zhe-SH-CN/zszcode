# 16 — 前端整体布局

## 模块职责
Web 页面整体布局，包含顶栏、侧边栏、三个 Tab 主区域、底部输入栏和权限确认栏。

## 新增文件
| 文件 | 用途 |
|------|------|
| `web/src/App.tsx` | 主布局 |
| `web/src/hooks/useWebSocket.ts` | WebSocket 连接 |
| `web/src/hooks/useSession.ts` | Session 状态管理 |
| `web/src/components/SessionSidebar.tsx` | 左栏 session 列表 |
| `web/src/components/ContextGauge.tsx` | 顶栏 token/cost |
| `web/src/components/PermissionBar.tsx` | 底部权限确认 |
| `web/src/types/events.ts` | 事件类型定义 |

## 布局
```
┌─────────────────────────────────────────────────────────┐
│  ContextGauge: Token/Cost | Model | Agent 状态           │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Session  │  主区域（Tab 切换）                            │
│ Sidebar  │                                              │
│          │  ┌────────────┬────────────┬──────────────┐  │
│ • 历史   │  │  Chat      │  Workflow  │  Signals     │  │
│ • 实时   │  │            │            │              │  │
│ • 新建   │  └────────────┴────────────┴──────────────┘  │
│          │                                              │
│          ├──────────────────────────────────────────────┤
│          │  ChatInput                                   │
├──────────┴──────────────────────────────────────────────┤
│  PermissionBar（条件显示）                                │
└─────────────────────────────────────────────────────────┘
```

## 技术栈
- React 18 + TypeScript
- Tailwind CSS
- Vite 构建

## WebSocket 连接
```typescript
// web/src/hooks/useWebSocket.ts
export function useWebSocket(url: string) {
  // 连接 ws://localhost:{port}/ws?token=xxx
  // 自动重连
  // 返回 { events, connected, sendMessage }
}
```

## 认证
- URL 中的 ?token=xxx 传给 WebSocket 连接
- 页面加载时验证 token

## 测试要求
1. 页面加载显示三个 Tab
2. Tab 切换正确显示对应内容
3. WebSocket 连接成功
4. 未授权时显示 401 错误
5. SessionSidebar 显示 session 列表
