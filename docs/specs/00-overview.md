# 00 — 总览

## 项目目标
基于 Claude Code 源码（~512K 行 TypeScript，1900+ 文件）构建独立二进制 `zszcode`：
- 内嵌 HTTP/WebSocket 服务器（Bun.serve）
- Agent 工作流可观测性（agent↔tool, agent↔agent, agent↔mcp, agent↔skill, API 流）
- 自定义模型配置（默认 mimo-v2.5-pro）
- CLI 为主，Web 为副

## 源码统计
| 维度 | 数量 |
|------|------|
| 总文件数 | ~1900 |
| 总行数 | ~512,000 |
| bun:bundle 导入 | 141 个文件 |
| feature() 调用 | 828 处，91 个不同 flag |
| MACRO. 常量 | 141 处，7 个不同常量 |

## 启动链
```
cli.tsx:33 main()
  → cli.tsx:297 import('../main.js').main()
  → main.tsx:585 main()
  → main.tsx:1006 .action() handler
  → main.tsx:2229 createRoot()
  → main.tsx:2241 showSetupScreens()
  → [WEB SERVER INJECT HERE]
  → main.tsx:3134 launchRepl()
  → REPL.tsx renders <App><REPL /></App>
```

## 模块依赖图

```
                    ┌─────────────┐
                    │  cli.tsx    │ (entry)
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  main.tsx   │ (Commander.js, mode dispatch)
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼───┐ ┌──────▼──────┐
       │  init.ts    │ │config│ │  server.ts  │ (NEW)
       │  (config,   │ │      │ │  (HTTP/WS)  │
       │   proxy,    │ └──────┘ └──────┬──────┘
       │   preconnect)│                │
       └─────────────┘                │
                           ┌──────────▼──────────┐
                           │    REPL.tsx          │
                           │    (Ink terminal UI) │
                           └──────────┬──────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                  │
             ┌──────▼──────┐  ┌──────▼──────┐  ┌───────▼───────┐
             │  query.ts   │  │ state/store │  │  hooks.ts     │
             │  (agent     │  │ (AppState)  │  │  (hook system)│
             │   loop)     │  └─────────────┘  └───────────────┘
             └──────┬──────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
  ┌──────▼────┐ ┌──▼──────┐ ┌─▼──────────┐
  │claude.ts  │ │toolExec │ │runAgent.ts │
  │(API call) │ │(tools)  │ │(sub-agents)│
  └───────────┘ └─────────┘ └────────────┘
                          │
                   ┌──────┼──────┐
                   │             │
            ┌──────▼────┐ ┌─────▼──────┐
            │MCP client │ │SkillTool   │
            └───────────┘ └────────────┘
```

## 新增模块

| 模块 | 文件 | 职责 |
|------|------|------|
| 配置 | src/zszcode/config.ts | 读取 ~/.zszcode/settings.json |
| 事件总线 | src/zszcode/events.ts | 全局事件广播 |
| Web 服务器 | src/zszcode/server.ts | Bun.serve HTTP/WS |
| 权限桥接 | src/zszcode/permission-bridge.ts | Web/CLI 权限同步 |
| bun:bundle shim | src/shims/bun-bundle.ts | feature() 和 MACRO 替身 |
| 前端 | web/ | React+Vite+Tailwind |

## 修改顺序
1. 构建系统（package.json, tsconfig, shims）→ 能编译
2. 配置模块 → 能读 settings.json
3. API 适配 → 能调 mimo API
4. 事件总线 → 有全局事件系统
5. query/tool/agent/mcp/store 可观测性注入
6. Web 服务器 → 能 serve HTTP/WS
7. 权限桥接 → Web/CLI 同步确认
8. REPL 状态栏 → 显示 Web URL
9. 前端 → Chat/Workflow/Signals 三个 Tab
10. 编译 → 独立二进制

## 需修改的源码文件（共 13 个）
| 文件 | 修改类型 | 说明 |
|------|---------|------|
| src/query.ts | 注入事件 | agent loop 可观测 |
| src/services/api/client.ts | 改配置 | baseURL/apiKey |
| src/services/tools/toolExecution.ts | 注入事件 | tool 调用可观测 |
| src/services/tools/toolOrchestration.ts | 注入事件 | 批量执行可观测 |
| src/services/tools/StreamingToolExecutor.ts | 注入事件 | 流式执行可观测 |
| src/tools/AgentTool/runAgent.ts | 注入事件 | agent 生命周期可观测 |
| src/services/mcp/client.ts | 注入事件 | MCP 交互可观测 |
| src/state/store.ts | 注入事件 | 状态变更可观测 |
| src/screens/REPL.tsx | 加组件 | Web URL 状态栏 |
| src/main.tsx | 加逻辑 | 启动 Web 服务器 |
| src/entrypoints/cli.tsx | 改名称 | 二进制名 zszcode |
| src/constants/prompts.ts | 可选 | 系统 prompt 微调 |
| src/utils/hooks.ts | 注入事件 | hook 触发可观测 |
