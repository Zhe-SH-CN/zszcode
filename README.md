# zszcode

基于 Claude Code 源码的 fork，添加 Web UI 可观测性层。通过内嵌 HTTP/WebSocket 服务器，实时广播 agent loop 中的 API 调用、工具执行、权限确认等事件到浏览器端。

## 特性

- **实时事件流** — 19 种事件类型，通过 WebSocket 实时推送到 Web UI
- **Web 控制台** — React + Tailwind 深色主题，Chat/Workflow/Signals 三个视图
- **权限桥接** — Web 端可远程确认工具权限请求（Allow/Deny/Allow Always）
- **独立二进制** — `bun build --compile` 生成单文件可执行程序，无需 Node.js 环境
- **配置管理** — `~/.zszcode/settings.json` 管理模型、API Key、端口等配置

## 快速开始

### 安装依赖

```bash
bun install
cd web && bun install
```

### 开发模式

```bash
# 启动 CLI + Web 服务器
bun run src/entrypoints/cli.tsx

# 底部会显示 Web UI URL: http://localhost:3000?token=xxx
```

### 编译二进制

```bash
# 构建前端
cd web && bun run build && cd ..

# 编译独立二进制
bun build --compile src/entrypoints/cli.tsx --outfile zszcode

# 运行
./zszcode --version
```

### 运行测试

```bash
bun test
```

## 配置

配置文件位于 `~/.zszcode/settings.json`，首次运行自动创建。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `model` | string | `mimo-v2.5-pro` | 默认模型 |
| `baseUrl` | string | `https://token-plan-cn.xiaomimimo.com/anthropic` | API Base URL |
| `apiKey` | string | - | API Key |
| `webPort` | number | `3000` | Web 服务器端口 |
| `autoOpenBrowser` | boolean | `false` | 自动打开浏览器 |
| `permissionMode` | `'auto' \| 'confirm'` | `'confirm'` | 权限确认模式 |

## 架构

```
src/
├── zszcode/
│   ├── config.ts      # 配置管理
│   ├── events.ts      # 事件总线（19 种事件类型）
│   └── server.ts      # HTTP/WebSocket 服务器
├── entrypoints/
│   └── cli.tsx        # CLI 入口
├── services/
│   ├── api/           # API 客户端（注入 zszcode 配置）
│   ├── tools/         # 工具执行（发射 tool_call 事件）
│   └── mcp/           # MCP 连接（发射 mcp 事件）
└── query.ts           # Agent loop（发射 turn/api_stream 事件）

web/
├── src/
│   ├── App.tsx        # 主布局
│   ├── components/    # UI 组件
│   │   ├── StreamView.tsx      # 消息流
│   │   ├── WorkflowView.tsx    # Agent 树
│   │   ├── SignalsView.tsx     # 事件信号
│   │   └── PermissionBar.tsx   # 权限确认栏
│   └── hooks/
│       ├── useWebSocket.ts     # WebSocket 连接
│       └── useSession.ts       # 会话管理
└── dist/              # 构建输出
```

## 事件类型

| 事件 | 触发时机 | 关键字段 |
|------|----------|----------|
| `turn_start` | Agent loop 开始迭代 | `turnNumber` |
| `turn_end` | Agent loop 结束迭代 | `turnNumber` |
| `api_stream_start` | API 调用开始 | `model` |
| `api_stream_end` | API 调用结束 | `duration`, `tokens` |
| `tool_call_start` | 工具执行开始 | `toolName`, `toolUseId`, `input` |
| `tool_call_end` | 工具执行结束 | `toolName`, `success`, `duration` |
| `tool_permission_request` | 权限请求 | `toolName`, `toolUseId` |
| `tool_permission_resolved` | 权限确认 | `toolUseId`, `decision`, `source` |
| `agent_spawn` | 子 agent 启动 | `parentId`, `childId`, `agentType` |
| `agent_complete` | 子 agent 完成 | `agentId`, `duration` |
| `mcp_connect` | MCP 服务器连接 | `serverName`, `success` |
| `mcp_call` | MCP 工具调用 | `serverName`, `toolName`, `duration` |
| `state_change` | 状态变更 | `field`, `oldValue`, `newValue` |
| `message` | 消息产出 | `role`, `content` |
| `hook_fire` | Hook 触发 | `hookName` |
| `skill_load` | 技能加载 | `name`, `source` |
| `skill_invoke` | 技能调用 | `name` |
| `context_compact` | 上下文压缩 | - |

## CLI 参数

```bash
zszcode [options]

Options:
  --version              输出版本号
  --model <model>        指定模型（覆盖配置）
  --print, -p            非交互模式，打印响应后退出
  --bare                 最小模式（跳过 hooks、LSP 等）
  --debug                调试模式
  --settings <file>      指定配置文件
```

## 开发

### 项目结构

```
zszcode/
├── src/                # 源码（Claude Code fork + zszcode 扩展）
├── web/                # React 前端
├── tests/              # 测试文件（666 个测试）
├── docs/plans/         # TDD 任务计划
├── progress.json       # 任务进度追踪
├── package.json
├── tsconfig.json
└── check_progress.ts   # 进度检查脚本
```

### 测试

```bash
# 运行全部测试
bun test

# 运行特定模块测试
bun test tests/01-task-*.test.ts
bun test tests/04-task-*.test.ts

# 类型检查
bunx tsc --noEmit
```

### 添加新事件

1. 在 `src/zszcode/events.ts` 中添加事件类型到 `ZszCodeEvent` 联合类型
2. 在相关源文件中导入 `eventBus` 并调用 `eventBus.emit()`
3. 在 `web/src/types/events.ts` 中同步前端类型定义
4. 在 `web/src/components/` 中添加对应的 UI 组件

## 许可证

本项目基于 Claude Code 源码 fork，仅用于个人研究和学习目的。
