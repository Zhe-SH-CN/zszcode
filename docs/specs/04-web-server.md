# 04 — Web 服务器

## 模块职责
内嵌 HTTP/WebSocket 服务器，静态托管前端，广播事件，处理权限确认。

## 新增文件
| 文件 | 用途 |
|------|------|
| `src/zszcode/server.ts` | Web 服务器实现 |

## 接口定义

```typescript
export interface WebServerHandle {
  port: number
  token: string
  url: string
  close: () => void
}

export function startWebServer(config: ZszCodeConfig): WebServerHandle
```

## 功能点

### HTTP 路由
| 路径 | 方法 | 说明 |
|------|------|------|
| `/` | GET | 返回 index.html（SPA） |
| `/*` | GET | 静态文件（web/dist/） |
| `/ws` | WS | WebSocket 事件流 |
| `/api/events` | GET | 返回最近 100 条事件历史 |
| `/api/permission/resolve` | POST | 处理 Web 端权限确认 |

### 认证
- 启动时生成 48 字符随机 token
- 所有请求必须带 `?token=xxx` 或 `Authorization: Bearer xxx`
- 未授权返回 401

### 端口管理
- 默认端口 3000
- 端口被占用时自动递增（3001, 3002, ...），最多试 100 个

### WebSocket
- 连接时验证 token
- 连接后广播所有 ZszCodeEvent
- 客户端消息格式：`{ type: 'subscribe'|'send'|'replay', ... }`

### 权限确认
```typescript
// POST /api/permission/resolve
// Body: { toolUseId: string, decision: 'allow' | 'deny' | 'allow_always' }
```

## 测试要求
1. 服务器在配置端口启动
2. 无 token 请求返回 401
3. 有效 token 请求返回 200
4. WebSocket 连接接收事件广播
5. /api/events 返回事件历史
6. /api/permission/resolve 解决待处理权限
7. 端口占用时自动递增
8. 静态文件正确托管
