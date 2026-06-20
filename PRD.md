# ZSZCode — PRD

## 1. 产品定位

**ZSZCode** = Claude Code 的 Web 可视化壳 + 双向通信桥。

一句话：**在浏览器里看到 Claude Code 的每一步在干什么，同时能从浏览器发消息。**

## 2. 核心场景

| 场景 | 描述 |
|------|------|
| **实时观察** | 用户在 CLI 发消息，Web 页面实时显示 agent loop、tool 调用、thinking 过程 |
| **Web 发消息** | 用户在 Web 页面输入消息，消息发送给 claude CLI 处理，结果同时在 Web 和 CLI 显示 |
| **历史回放** | 选择已有的 session JSONL 文件，在 Web 上回放整个对话过程 |
| **多 Session** | 同时监控多个 claude 进程，切换查看 |

## 3. 技术架构

```
┌─────────────────────────────────────────────────────────┐
│  Browser (React + TypeScript + Tailwind)                 │
│                                                          │
│  ┌──────────┐ ┌───────────────┐ ┌────────────────────┐  │
│  │ Session   │ │ Stream View   │ │ Chat Input         │  │
│  │ Sidebar   │ │ (主区域)       │ │ (底部)             │  │
│  │           │ │               │ │                    │  │
│  │ • 历史    │ │ • Thinking    │ │ • 文本输入         │  │
│  │ • 实时    │ │ • Text        │ │ • 发送按钮         │  │
│  │ • 新建    │ │ • Tool Use    │ │                    │  │
│  │           │ │ • Tool Result │ │                    │  │
│  │           │ │ • System 事件 │ │                    │  │
│  └──────────┘ └───────────────┘ └────────────────────┘  │
│       ↕ WebSocket                                        │
├─────────────────────────────────────────────────────────┤
│  Backend (Node.js + Express + ws)                        │
│                                                          │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │ SessionMgr   │ │ StreamBridge │ │ HistoryLoader   │  │
│  │              │ │              │ │                 │  │
│  │ 管理多个     │ │ claude CLI   │ │ 解析已有        │  │
│  │ claude 进程  │ │ stdin/stdout │ │ JSONL 文件      │  │
│  └─────────────┘ └──────────────┘ └─────────────────┘  │
│       ↕ child_process                                    │
├─────────────────────────────────────────────────────────┤
│  claude CLI (installed: v2.1.183)                        │
│  claude -p --input-format stream-json                    │
│          --output-format stream-json --verbose --bare    │
└─────────────────────────────────────────────────────────┘
```

## 4. 数据流

### 4.1 实时 Session（Web 发消息）

```
Browser ──WS──> Backend ──stdin──> claude CLI ──API──> Anthropic
                                     │
Browser <──WS── Backend <──stdout───┘
```

1. 用户在 Web 输入消息
2. Backend 通过 stdin 写入 `{"type":"user","message":{"role":"user","content":"..."},...}`
3. claude CLI 处理，stdout 输出 stream-json
4. Backend 解析 stdout，通过 WebSocket 推送给 Browser
5. Browser 实时渲染 thinking/text/tool_use/result

### 4.2 实时 Session（CLI 发消息）

```
CLI 用户 ──stdin──> claude CLI ──stdout──> Backend (watch JSONL) ──WS──> Browser
```

1. 用户在终端直接和 claude 对话
2. claude 同时写入 `~/.claude/projects/<project>/<session>.jsonl`
3. Backend 用 chokidar watch 文件变化，增量解析新行
4. 通过 WebSocket 推送给 Browser

### 4.3 历史回放

```
Browser ──WS:replay──> Backend ──read──> JSONL file ──parse──> 逐条推送
```

## 5. 消息类型（已验证）

### 5.1 输出流（CLI → Backend → Browser）

| type | subtype | 含义 |
|------|---------|------|
| `system` | `init` | Session 初始化：cwd, tools, model, plugins |
| `system` | `thinking_tokens` | Token 用量追踪 |
| `assistant` | — | LLM 回复，content 含 `thinking`/`text`/`tool_use` 块 |
| `result` | `success`/`error` | 最终结果：duration, usage, cost, stop_reason |

### 5.2 输入流（Backend → CLI）

```json
{
  "type": "user",
  "message": {
    "role": "user",
    "content": "用户输入的文本"
  },
  "parent_tool_use_id": null,
  "session_id": ""
}
```

### 5.3 历史 JSONL 消息类型

| type | 含义 |
|------|------|
| `user` | 用户输入 + tool_result |
| `assistant` | LLM 回复 |
| `system` | 系统事件（hook, compaction） |
| `attachment` | 附件（hook 输出） |
| `mode` / `permission-mode` | 模式切换 |
| `ai-title` | Session 标题 |
| `file-history-snapshot` | 文件快照 |

## 6. 前端组件

### 6.1 SessionSidebar

- 列出 `~/.claude/projects/` 下所有 session
- 按项目分组
- 显示：session ID（缩写）、ai-title、消息数、最后时间
- 点击加载历史 / 连接实时

### 6.2 StreamView（主区域）

按时间线渲染每条消息：

- **Thinking 块**：灰色折叠区域，显示模型思考过程
- **Text 块**：正常文本渲染（Markdown）
- **Tool Use 块**：卡片式展示，含 tool name、input 参数
- **Tool Result 块**：折叠的输出区域
- **System 事件**：顶部通知条
- **Result 块**：最终统计（duration, tokens, cost）

### 6.3 ContextGauge（顶栏）

- Token 用量条：input_tokens / context_window
- Cost 累计
- Turn 计数
- Model 名称

### 6.4 ChatInput（底栏）

- 文本输入框
- 发送按钮
- 发送后禁用，等待 result 消息后重新启用

## 7. 后端模块

### 7.1 SessionManager

```typescript
class SessionManager {
  // 创建新的实时 session（spawn claude CLI）
  createLiveSession(opts: { cwd, model, permissionMode }): SessionHandle

  // 连接已有 session（通过 JSONL watch）
  attachToSession(sessionId: string): void

  // 发送消息到活跃 session
  sendMessage(sessionId: string, content: string): void

  // 列出所有 session
  listSessions(): SessionInfo[]

  // 关闭 session
  closeSession(sessionId: string): void
}
```

### 7.2 StreamBridge

```typescript
class StreamBridge {
  // 管理一个 claude CLI 进程的 stdin/stdout
  constructor(claudeProcess: ChildProcess)

  // 发送用户消息
  sendUserMessage(content: string): void

  // 注册消息回调
  onMessage(callback: (msg: StreamMessage) => void): void

  // 关闭
  close(): void
}
```

### 7.3 HistoryLoader

```typescript
class HistoryLoader {
  // 加载 JSONL 文件，返回结构化 session
  static loadSession(filePath: string): Session

  // 增量解析新行
  static parseNewLines(filePath: string, fromOffset: number): Message[]
}
```

### 7.4 FileWatcher

```typescript
class FileWatcher {
  // 监控 ~/.claude/projects/ 目录
  constructor(basePath: string)

  // 文件变化回调
  onChange(callback: (filePath: string, newLines: string[]) => void): void
}
```

## 8. API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/sessions` | 列出所有 session |
| GET | `/api/sessions/:id` | 获取 session 详情 |
| POST | `/api/sessions` | 创建新 session |
| WS | `/ws` | WebSocket：实时消息流 |

WebSocket 消息协议：

```typescript
// Client → Server
type ClientMessage =
  | { type: 'subscribe', sessionId: string }     // 订阅 session
  | { type: 'unsubscribe', sessionId: string }   // 取消订阅
  | { type: 'send', sessionId: string, content: string }  // 发送消息
  | { type: 'replay', sessionId: string }        // 回放历史
  | { type: 'new_session', cwd: string }         // 新建 session

// Server → Client
type ServerMessage =
  | { type: 'stream', sessionId: string, data: StreamMessage }  // 流式消息
  | { type: 'session_list', sessions: SessionInfo[] }           // session 列表
  | { type: 'error', message: string }                          // 错误
  | { type: 'session_status', sessionId: string, status: 'running'|'done'|'error' }
```

## 9. 技术栈

| 层 | 技术 |
|----|------|
| 前端 | React 18 + TypeScript + Tailwind CSS + Vite |
| 后端 | Node.js + Express + ws |
| CLI 桥接 | child_process.spawn |
| 文件监控 | chokidar |
| JSONL 解析 | 逐行 readline |
| Python 工具 | uv 虚拟环境（用于 MiMo 批量任务，非核心） |

## 10. 目录结构

```
/home/zsz/Mimo/zszcode/
├── PRD.md                    # 本文档
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── server/
│   ├── index.ts              # Express + WS server 入口
│   ├── SessionManager.ts     # Session 生命周期管理
│   ├── StreamBridge.ts       # claude CLI stdin/stdout 桥接
│   ├── HistoryLoader.ts      # JSONL 历史加载
│   ├── FileWatcher.ts        # 文件变化监控
│   └── types.ts              # 共享类型
├── src/
│   ├── main.tsx              # React 入口
│   ├── App.tsx               # 主布局
│   ├── hooks/
│   │   ├── useWebSocket.ts   # WebSocket 连接管理
│   │   └── useSession.ts     # Session 状态管理
│   ├── components/
│   │   ├── SessionSidebar.tsx # 左栏 session 列表
│   │   ├── StreamView.tsx     # 主区域消息流
│   │   ├── ContextGauge.tsx   # 顶栏 token/cost 仪表
│   │   ├── ChatInput.tsx      # 底部输入框
│   │   ├── MessageBlock.tsx   # 单条消息渲染
│   │   ├── ThinkingBlock.tsx  # Thinking 折叠块
│   │   ├── ToolUseBlock.tsx   # Tool 调用卡片
│   │   └── ResultBlock.tsx    # 结果统计
│   └── types/
│       └── session.ts         # 前端类型
└── scripts/
    └── test-bridge.ts         # 通信测试脚本
```

## 11. 验收标准

| # | 验收项 | 验证方法 |
|---|--------|----------|
| 1 | Web 能列出所有历史 session | 打开页面，左栏显示 session 列表 |
| 2 | 点击历史 session 能回放 | 选择一个 session，消息逐条显示 |
| 3 | 新建 session 后 Web 能发消息 | 输入 "say hello"，收到回复 |
| 4 | Web 发消息后 CLI 也能看到 | 同一 session 的 JSONL 包含新消息 |
| 5 | CLI 发消息后 Web 实时更新 | CLI 输入，Web 页面几秒内显示 |
| 6 | Thinking 过程可折叠查看 | Thinking 块默认折叠，点击展开 |
| 7 | Tool 调用显示 input/output | Tool 卡片展示完整参数和结果 |
| 8 | Token/Cost 实时更新 | ContextGauge 数值随消息更新 |
| 9 | 自我验证：沙箱内 claude 调用 | ZSZCode 自己 spawn claude 验证通信 |

## 12. 开发计划

| Step | 内容 | 产出 |
|------|------|------|
| 1 | 项目脚手架 | package.json, tsconfig, vite, tailwind |
| 2 | StreamBridge + SessionManager | 能 spawn claude 并读写 stdin/stdout |
| 3 | WebSocket server + 前端骨架 | WS 连通，页面布局完成 |
| 4 | StreamView 消息渲染 | Thinking/Text/ToolUse/Result 各块渲染 |
| 5 | HistoryLoader + SessionSidebar | 能加载和浏览历史 session |
| 6 | FileWatcher + 实时更新 | CLI 发消息 Web 自动刷新 |
| 7 | ChatInput + Web 发消息 | Web 输入消息并收到回复 |
| 8 | ContextGauge + 打磨 | Token/Cost 统计 + UI polish |
| 9 | 自我验证 | ZSZCode spawn claude 验证完整流程 |

## 13. 约束

- **不编译 claude-code-main 源码**：直接用已安装的 `claude` CLI (v2.1.183)
- **不修改 claude CLI**：纯外部包装
- **Python 用 uv**：所有 Python 脚本在 uv 虚拟环境中运行
- **零外部付费服务**：只用本地 claude CLI + MiMo API
