# ZSZCode 实施计划

## 概述

基于 Claude Code 源码（`src/`，~512K 行 TypeScript），构建独立二进制 `zszcode`：
- 内嵌 HTTP/WebSocket 服务器（Bun.serve）
- Web UI 可观测 Agent 工作流内部运转
- 默认模型 `mimo-v2.5-pro`，自定义 base URL
- CLI 为主，Web 为副，URL 显示在状态栏

---

## Phase 1: 项目脚手架 + 构建系统

### Step 1.1: 创建 package.json

在 `/home/zsz/Mimo/zszcode/` 下创建 `package.json`：

```json
{
  "name": "zszcode",
  "version": "0.1.0",
  "type": "module",
  "bin": { "zszcode": "./dist/cli.js" },
  "scripts": {
    "build": "bun build src/entrypoints/cli.tsx --outdir dist --target bun",
    "dev": "bun run src/entrypoints/cli.tsx",
    "build:web": "cd web && bun run build"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "latest",
    "@modelcontextprotocol/sdk": "latest",
    "react": "^18",
    "react-reconciler": "^0.29",
    "ink": "file:./src/ink",
    "commander": "latest",
    "chalk": "^5",
    "zod": "^4",
    "ws": "^8",
    "express": "^4",
    "chokidar": "^3"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/ws": "^8",
    "@types/express": "^4",
    "typescript": "^5"
  }
}
```

**验证：** `bun install` 成功

### Step 1.2: 创建 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": ".",
    "paths": {
      "bun:bundle": ["src/shims/bun-bundle.ts"],
      "bun:test": ["src/shims/bun-test.ts"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "web"]
}
```

**验证：** `bunx tsc --noEmit` 无（或极少）错误

### Step 1.3: 创建 bun:bundle shim

源码大量使用 `import { feature } from 'bun:bundle'` 和 `MACRO.VERSION`。
创建 `src/shims/bun-bundle.ts`：

```typescript
// bun:bundle shim — all feature flags default to false for external build
export function feature(_name: string): boolean {
  return false
}

// MACRO shim — build-time constants
export const MACRO = {
  VERSION: '0.1.0',
}
```

还需要处理 `bun:test` shim（如果有测试代码引用）。

**验证：** `bun build src/entrypoints/cli.tsx --outdir dist` 能解析 `bun:bundle` 导入

### Step 1.4: 创建 zszcode 配置模块

创建 `src/zszcode/config.ts`：

```typescript
import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export interface ZszCodeConfig {
  model: string
  baseUrl: string
  apiKey: string
  webPort: number
  autoOpenBrowser: boolean
  permissionMode: 'auto' | 'confirm'
}

const CONFIG_DIR = join(homedir(), '.zszcode')
const CONFIG_FILE = join(CONFIG_DIR, 'settings.json')

const DEFAULTS: ZszCodeConfig = {
  model: 'mimo-v2.5-pro',
  baseUrl: 'https://token-plan-cn.xiaomimimo.com/anthropic',
  apiKey: 'tp-c2vyjcx7y4xxzfs6s8sz8htsw7ou3ts2afdulks4mcc0iecy',
  webPort: 3000,
  autoOpenBrowser: false,
  permissionMode: 'confirm',
}

export function loadConfig(): ZszCodeConfig {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true })
  if (!existsSync(CONFIG_FILE)) {
    writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULTS, null, 2))
    return { ...DEFAULTS }
  }
  const file = JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'))
  return { ...DEFAULTS, ...file }
}
```

**验证：** 运行后自动创建 `~/.zszcode/settings.json`

---

## Phase 2: 事件系统（可观测性核心）

### Step 2.1: 创建全局事件总线

创建 `src/zszcode/events.ts`：

```typescript
import { EventEmitter } from 'events'

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

class ZszCodeEventBus extends EventEmitter {
  emit(event: ZszCodeEvent) {
    return super.emit('event', event)
  }
  onEvent(listener: (event: ZszCodeEvent) => void) {
    this.on('event', listener)
    return () => this.off('event', listener)
  }
}

export const eventBus = new ZszCodeEventBus()
```

**验证：** `eventBus.emit(...)` 和 `eventBus.onEvent(...)` 工作正常

### Step 2.2: 在 query.ts 中注入可观测性事件

修改 `src/query.ts`：
- 在 `deps.callModel()` 调用前 emit `api_stream_start`
- 在 streaming 事件循环中 emit `api_stream_event`
- 在 `runTools()` 调用前后 emit `turn_start` / `turn_end`
- 在每次迭代开始 emit `turn_start`

**关键修改位置：**
- Line 337（yield stream_request_start）附近：emit `api_stream_start`
- Line 658-708（deps.callModel 循环）内部：emit 每个 stream event
- Line 1366-1408（tool execution phase）前后：emit `turn_start` / `turn_end`

**验证：** 运行 zszcode，Web 端能收到流式事件

### Step 2.3: 在 toolExecution.ts 中注入工具调用事件

修改 `src/services/tools/toolExecution.ts`：
- 在 `checkPermissionsAndCallTool()` 的 `tool.call()` 调用前：emit `tool_call_start`
- 在 `tool.call()` 返回后：emit `tool_call_end`
- 在权限请求时：emit `tool_permission_request`
- 在权限解决时：emit `tool_permission_resolved`

**关键修改位置：**
- Line 1206-1222（tool.call() 调用）前后
- Line 920-931（permission resolution）附近

**验证：** Web 端能实时看到每个 tool 的调用和结果

### Step 2.4: 在 runAgent.ts 中注入 agent 生命周期事件

修改 `src/tools/AgentTool/runAgent.ts`：
- 在 `runAgent()` 开头：emit `agent_spawn`
- 在 `runAgent()` 结束（finally 块）：emit `agent_complete`

**关键修改位置：**
- Line 347（agent ID 创建）后
- Line 816（finally 块）中

**验证：** Web 端能看到 agent 父子关系树

### Step 2.5: 在 MCP client 中注入事件

修改 `src/services/mcp/client.ts`：
- 在 `connectToServer()` 结果处：emit `mcp_connect`
- 在 `callMCPTool()` 前后：emit `mcp_call`

**关键修改位置：**
- Line 595（connectToServer）返回后
- Line 3029（callMCPTool）前后

### Step 2.6: 在 store.ts 中注入状态变更事件

修改 `src/state/store.ts`：
- 在 `setState()` 的 `onChange` 回调中：emit `state_change`

**关键修改位置：**
- Line 20（setState 实现）中，`onChange?.()` 调用附近

---

## Phase 3: Web 服务器嵌入

### Step 3.1: 创建 Web 服务器模块

创建 `src/zszcode/server.ts`：

```typescript
import { serve, Server } from 'bun'
import { readFileSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { eventBus, ZszCodeEvent } from './events'
import type { ZszCodeConfig } from './config'

export interface WebServerHandle {
  port: number
  token: string
  url: string
  close: () => void
}

export function startWebServer(config: ZszCodeConfig): WebServerHandle {
  const token = randomBytes(24).toString('hex')
  const webDistDir = join(import.meta.dir, '../../web/dist')
  
  // WebSocket clients
  const wsClients = new Set<any>()
  
  // Permission request queue (for web-based confirm)
  const pendingPermissions = new Map<string, {
    resolve: (decision: 'allow' | 'deny') => void
    timeout: ReturnType<typeof setTimeout>
  }>()
  
  // Event history buffer (last 1000 events)
  const eventHistory: ZszCodeEvent[] = []
  const MAX_HISTORY = 1000
  
  eventBus.onEvent((event) => {
    eventHistory.push(event)
    if (eventHistory.length > MAX_HISTORY) eventHistory.shift()
    // Broadcast to all WS clients
    const msg = JSON.stringify(event)
    for (const ws of wsClients) {
      try { ws.send(msg) } catch {}
    }
  })

  let port = config.webPort
  let server: Server

  // Try ports starting from config.webPort
  for (let p = config.webPort; p < config.webPort + 100; p++) {
    try {
      server = serve({
        port: p,
        fetch(req, server) {
          const url = new URL(req.url)
          
          // Auth check
          const reqToken = url.searchParams.get('token') || 
                           req.headers.get('Authorization')?.replace('Bearer ', '')
          if (reqToken !== token) {
            return new Response('Unauthorized', { status: 401 })
          }
          
          // WebSocket upgrade
          if (url.pathname === '/ws') {
            if (server.upgrade(req)) return undefined
            return new Response('WebSocket upgrade failed', { status: 500 })
          }
          
          // REST API
          if (url.pathname === '/api/events') {
            return Response.json(eventHistory.slice(-100))
          }
          if (url.pathname === '/api/permission/resolve' && req.method === 'POST') {
            // Handle permission resolution from web
            const body = await req.json()
            const pending = pendingPermissions.get(body.toolUseId)
            if (pending) {
              clearTimeout(pending.timeout)
              pending.resolve(body.decision)
              pendingPermissions.delete(body.toolUseId)
            }
            return Response.json({ ok: true })
          }
          
          // Static files
          try {
            const filePath = url.pathname === '/' ? '/index.html' : url.pathname
            const file = readFileSync(join(webDistDir, filePath))
            return new Response(file)
          } catch {
            return new Response('Not Found', { status: 404 })
          }
        },
        websocket: {
          open(ws) { wsClients.add(ws) },
          close(ws) { wsClients.delete(ws) },
          message(ws, msg) {
            // Handle client messages (subscribe, send, etc.)
            const data = JSON.parse(String(msg))
            // ... handle message types
          },
        },
      })
      port = p
      break
    } catch {
      continue
    }
  }

  return {
    port,
    token,
    url: `http://localhost:${port}?token=${token}`,
    close: () => server.stop(),
  }
}
```

**验证：** `curl http://localhost:3000?token=xxx` 返回 HTML

### Step 3.2: 在 main.tsx 中注入 Web 服务器启动

修改 `src/main.tsx`：
- 在 `showSetupScreens()` 之后、`launchRepl()` 之前（约 line 2320）启动 Web 服务器
- 将 Web 服务器 URL 传递给 REPL

```typescript
// After showSetupScreens, before launchRepl
const { startWebServer } = await import('../zszcode/server.js')
const { loadConfig } = await import('../zszcode/config.js')
const zszConfig = loadConfig()
const webServer = startWebServer(zszConfig)
```

**关键修改位置：** main.tsx action handler，line ~2320

**验证：** 启动 zszcode 后 Web 服务器自动启动

### Step 3.3: 在 REPL 状态栏显示 Web URL

修改 `src/screens/REPL.tsx`：
- 在 `Props` 类型中添加 `webUrl?: string`
- 在 `bottom` slot（line ~4590）添加 URL 显示组件

```tsx
// 新增组件
function WebUrlBanner({ url }: { url: string }) {
  return (
    <Box>
      <Text dimColor>Web UI: </Text>
      <Text color="cyan">{url}</Text>
    </Box>
  )
}

// 在 FullscreenLayout bottom slot 中添加
{webUrl && <WebUrlBanner url={webUrl} />}
```

**关键修改位置：** REPL.tsx line 4590 附近（bottom slot）

**验证：** CLI 底部显示 `Web UI: http://localhost:3000?token=xxx`

---

## Phase 4: API 客户端适配

### Step 4.1: 修改 Anthropic 客户端创建

修改 `src/services/api/client.ts`：
- 在 `getAnthropicClient()` 的直接 API 路径（line 301-315）中，使用 zszcode 配置的 baseURL 和 apiKey

```typescript
// 在 line 301 附近
import { loadConfig } from '../../zszcode/config.js'

// 在直接 API 创建处
const zszConfig = loadConfig()
return new Anthropic({
  apiKey: zszConfig.apiKey || apiKey,
  baseURL: zszConfig.baseUrl || undefined,
  ...otherOptions,
})
```

**关键修改位置：** client.ts line 301-315

**验证：** `zszcode` 发送的 API 请求指向 mimo endpoint

### Step 4.2: 修改默认模型

修改 `src/main.tsx`：
- 在 Commander action handler 中，如果用户没有指定 `--model`，使用 zszcode 配置的默认模型

**关键修改位置：** main.tsx 中 model 参数的默认值处理

**验证：** `zszcode` 默认使用 `mimo-v2.5-pro`

---

## Phase 5: 权限系统 Web 同步

### Step 5.1: 创建 Web 权限桥接

创建 `src/zszcode/permission-bridge.ts`：

```typescript
import { eventBus } from './events'

// Pending permission requests from the agent loop
const pendingRequests = new Map<string, {
  resolve: (decision: 'allow' | 'deny' | 'allow_always') => void
  timeout: ReturnType<typeof setTimeout>
}>()

// Called by toolExecution.ts when permission is needed
export function requestWebPermission(
  toolUseId: string,
  toolName: string,
  input: any,
): Promise<'allow' | 'deny' | 'allow_always'> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      pendingRequests.delete(toolUseId)
      resolve('deny')  // 30s timeout → auto deny
    }, 30000)
    
    pendingRequests.set(toolUseId, { resolve, timeout })
    
    // Broadcast to web clients
    eventBus.emit({
      type: 'tool_permission_request',
      toolName, toolUseId, input,
      timestamp: Date.now(),
    })
  })
}

// Called by web server when user clicks Allow/Deny
export function resolveWebPermission(
  toolUseId: string,
  decision: 'allow' | 'deny' | 'allow_always',
  source: 'web' | 'cli',
) {
  const pending = pendingRequests.get(toolUseId)
  if (pending) {
    clearTimeout(pending.timeout)
    pending.resolve(decision)
    pendingRequests.delete(toolUseId)
  }
}
```

### Step 5.2: 修改权限检查流程

修改 `src/services/tools/toolExecution.ts` 中的 `checkPermissionsAndCallTool()`：
- 在权限检查处（line 920-931），同时向 CLI 和 Web 发起确认
- 使用 `Promise.race()` 等待任一端先响应

**关键修改位置：** toolExecution.ts line 920-931

**验证：** Web 端点击 Allow 后，CLI 的确认框自动消失

---

## Phase 6: Web 前端

### Step 6.1: 创建 Vite + React + Tailwind 项目

在 `/home/zsz/Mimo/zszcode/web/` 下创建前端项目：

```
web/
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── index.html
├── tsconfig.json
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── hooks/
    │   ├── useWebSocket.ts
    │   └── useSession.ts
    ├── components/
    │   ├── SessionSidebar.tsx
    │   ├── StreamView.tsx      # Chat Tab
    │   ├── WorkflowView.tsx    # Workflow Tab (Agent tree)
    │   ├── SignalsView.tsx     # Signals Tab (filterable)
    │   ├── ContextGauge.tsx    # Token/Cost top bar
    │   ├── ChatInput.tsx       # Bottom input
    │   ├── PermissionBar.tsx   # Bottom permission confirm
    │   ├── MessageBlock.tsx
    │   ├── ThinkingBlock.tsx
    │   ├── ToolUseBlock.tsx
    │   ├── ResultBlock.tsx
    │   └── AgentTreeNode.tsx
    └── types/
        └── events.ts
```

**验证：** `cd web && bun run dev` 启动 Vite dev server

### Step 6.2: WebSocket 连接

创建 `web/src/hooks/useWebSocket.ts`：

```typescript
import { useEffect, useRef, useState, useCallback } from 'react'

export function useWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const ws = new WebSocket(url)
    wsRef.current = ws
    
    ws.onopen = () => setConnected(true)
    ws.onclose = () => setConnected(false)
    ws.onmessage = (e) => {
      const event = JSON.parse(e.data)
      setEvents(prev => [...prev, event])
    }
    
    return () => ws.close()
  }, [url])

  const sendMessage = useCallback((msg: any) => {
    wsRef.current?.send(JSON.stringify(msg))
  }, [])

  return { events, connected, sendMessage }
}
```

### Step 6.3: Chat Tab（StreamView）

消息渲染组件：
- Thinking：灰色折叠块，默认折叠
- Text：Markdown 渲染（react-markdown + syntax highlighter）
- Tool Use：卡片展示 tool name + input JSON
- Tool Result：折叠块，成功绿色/失败红色，最多 10 行预览
- Result：最终统计

### Step 6.4: Workflow Tab（Agent 树）

树形可视化：
- Main Agent 为根节点
- 子 Agent 为子节点
- 每个节点显示：Turn 编号、tool 调用数量、耗时
- 数据流线条带粒子动画效果（CSS animation）
- 节点可展开/折叠查看详细输入输出

### Step 6.5: Signals Tab（过滤信号流）

实时信号流：
- 顶部过滤器：checkbox 列表（API Stream / Tool Call / Agent / MCP / Skill / State / Hook / Context Compact）
- 主区域：时间线列表，每条信号是一个卡片
- 自动滚动到底部，可暂停

### Step 6.6: 权限确认栏

底部固定栏：
- 显示 tool name、input 摘要
- 三个按钮：Allow / Deny / Allow Always
- 30 秒倒计时，超时自动 Deny
- 通过 WebSocket 发送 decision 到后端

### Step 6.7: 构建前端

```bash
cd web && bun run build  # 输出到 web/dist/
```

Web 服务器静态托管 `web/dist/`。

---

## Phase 7: 编译独立二进制

### Step 7.1: Bun 编译

```bash
bun build src/entrypoints/cli.tsx --outdir dist --target bun
```

或者使用 `bun compile` 生成独立可执行文件：

```bash
bun build --compile src/entrypoints/cli.tsx --outfile zszcode
```

### Step 7.2: 处理 bun:bundle 的 MACRO.VERSION

在 `src/shims/bun-bundle.ts` 中硬编码版本号：
```typescript
export const MACRO = { VERSION: '0.1.0' }
```

### Step 7.3: 验证

```bash
./zszcode --version  # 输出 zszcode 0.1.0
./zszcode            # 启动 CLI + Web 服务器
```

---

## Phase 8: 验收测试

| # | 验收项 | 验证方法 |
|---|--------|----------|
| 1 | `zszcode` 命令启动 CLI + Web 服务器 | 运行 `zszcode`，终端显示 CLI，状态栏显示 Web URL |
| 2 | CLI 能正常对话 | 在终端输入消息，收到 mimo-v2.5-pro 回复 |
| 3 | Web Chat Tab 能发消息 | 在浏览器输入消息，收到回复，CLI 也同步显示 |
| 4 | Web 能看到 Thinking 过程 | Chat Tab 折叠展示 thinking 块 |
| 5 | Web 能看到 Tool 调用 | Tool Use 卡片展示 input/output |
| 6 | Workflow Tab 展示 Agent 树 | 触发 sub-agent 后，树形展示父子关系 |
| 7 | Signals Tab 实时信号流 | 过滤后能看到 tool call、API stream 等信号 |
| 8 | 权限确认 Web/CLI 同步 | Web 点 Allow 后 CLI 确认框消失 |
| 9 | 权限超时自动拒绝 | 不操作 30 秒后自动 deny |
| 10 | 多实例端口递增 | 开两个 zszcode，第二个自动用 3001 |
| 11 | 配置文件生效 | 修改 `~/.zszcode/settings.json` 后重启生效 |
| 12 | 不污染官方 Claude Code | `which claude` 仍指向官方 |

---

## 修改文件清单

| 文件 | 修改类型 | 说明 |
|------|---------|------|
| `src/shims/bun-bundle.ts` | 新建 | bun:bundle 和 MACRO shim |
| `src/zszcode/config.ts` | 新建 | 配置加载模块 |
| `src/zszcode/events.ts` | 新建 | 全局事件总线 |
| `src/zszcode/server.ts` | 新建 | HTTP/WS 服务器 |
| `src/zszcode/permission-bridge.ts` | 新建 | Web 权限桥接 |
| `src/query.ts` | 修改 | 注入可观测性事件 |
| `src/services/api/client.ts` | 修改 | 使用 zszcode 配置的 baseURL/apiKey |
| `src/services/tools/toolExecution.ts` | 修改 | 注入工具调用事件 + Web 权限 |
| `src/services/tools/toolOrchestration.ts` | 修改 | 注入批量执行事件 |
| `src/services/tools/StreamingToolExecutor.ts` | 修改 | 注入流式执行事件 |
| `src/tools/AgentTool/runAgent.ts` | 修改 | 注入 agent 生命周期事件 |
| `src/services/mcp/client.ts` | 修改 | 注入 MCP 连接/调用事件 |
| `src/state/store.ts` | 修改 | 注入状态变更事件 |
| `src/screens/REPL.tsx` | 修改 | 添加 Web URL 状态栏显示 |
| `src/main.tsx` | 修改 | 启动 Web 服务器，默认模型配置 |
| `src/entrypoints/cli.tsx` | 修改 | 二进制名称 |
| `web/` | 新建目录 | 完整前端项目 |

---

## 开发顺序

```
Phase 1 (脚手架) → Phase 4 (API 适配) → Phase 3 (Web 服务器) → Phase 2 (事件系统)
→ Phase 5 (权限桥接) → Phase 6 (前端) → Phase 7 (编译) → Phase 8 (验收)
```

**推荐先做 Phase 1 + Phase 4**，确保 zszcode 能独立运行并调用 mimo API。
然后做 Phase 3 + Phase 2，确保 Web 服务器能接收事件。
最后做 Phase 6 前端渲染。
