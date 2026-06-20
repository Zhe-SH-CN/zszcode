分析 `zszcode/src/` 下的 Claude Code 源码，确认 zszcode 的修改方案。

## 你要做的事

### 第一步：分析源码架构

1. 通读 `src/entrypoints/cli.tsx`、`src/main.tsx`、`src/entrypoints/init.ts`，理解启动链
2. 通读 `src/query.ts`，理解 agent loop（query 生成器）
3. 通读 `src/services/api/client.ts` 和 `src/services/api/claude.ts`，理解 API 调用和流式处理
4. 通读 `src/services/tools/toolExecution.ts` 和 `src/services/tools/toolOrchestration.ts`，理解工具执行流程
5. 通读 `src/tools/AgentTool/runAgent.ts`，理解子 agent 生成
6. 通读 `src/services/mcp/client.ts`，理解 MCP 协议交互
7. 通读 `src/state/store.ts` 和 `src/state/AppStateStore.ts`，理解状态管理
8. 通读 `src/screens/REPL.tsx`，理解终端 UI 渲染
9. 通读 `src/utils/hooks.ts`，理解 hook 系统
10. 通读 `src/ink/ink.tsx`，理解 Ink 渲染器

**在分析时必须覆盖以下维度**：

- **启动链**：从 `cli.tsx` 到 `main.tsx` 到 `init()` 到 `createRoot()` 到 `launchRepl()` 的完整流程
- **`bun:bundle` feature flags**：所有 `feature()` 调用的位置和用途
- **MACRO 常量**：`MACRO.VERSION` 等编译时常量的位置
- **API 客户端创建**：`baseURL`、`apiKey` 的注入点
- **query 生成器**：yield 的消息类型、可注入可观测性的位置
- **工具执行**：权限检查流程、pre/post hooks
- **状态管理**：`store.subscribe()` 和 `onChange` 回调
- **REPL 渲染**：状态栏位置、bottom slot 可用空间

### 第二步：向用户确认关键决策

分析完架构后，逐一向用户提问确认（每次只问一个问题）：

- **bun:bundle shim 策略**：全部 flags 设 false 还是部分需要保留
- **入口点改造方式**：cli.tsx 加 fast-path 还是在 main.tsx 的 action handler 中注入
- **Web 服务器注入点**：init() 之前还是 showSetupScreens() 之后
- **状态栏渲染位置**：SpinnerWithVerb 旁边还是 FullscreenLayout bottom slot
- **权限桥接方式**：拦截 canUseTool 还是在 checkPermissionsAndCallTool 中注入

不要替用户做决定，给候选 + 优劣分析 + 推荐，让用户选。

### 第三步：生成 Spec 文件

决策确认后，为每个模块生成独立 spec 文件，输出到 `docs/specs/`：

```
docs/specs/
├── 00-overview.md          # 总览：依赖图、模块关系、修改顺序
├── 01-build-system.md      # 构建系统：package.json, tsconfig, bun:bundle shim
├── 02-config.md            # 配置模块：~/.zszcode/settings.json
├── 03-event-bus.md         # 事件总线：全局事件系统
├── 04-web-server.md        # Web 服务器：Bun.serve, HTTP/WS
├── 05-api-adapter.md       # API 适配：baseURL, apiKey, 默认模型
├── 06-query-observability.md # query.ts 可观测性注入
├── 07-tool-observability.md  # 工具执行可观测性注入
├── 08-agent-observability.md # agent 生命周期可观测性
├── 09-mcp-observability.md   # MCP 交互可观测性
├── 10-state-observability.md # 状态变更可观测性
├── 11-permission-bridge.md   # Web/CLI 权限同步
├── 12-repl-statusbar.md      # REPL 状态栏 Web URL 显示
├── 13-frontend-chat.md       # 前端 Chat Tab
├── 14-frontend-workflow.md   # 前端 Workflow Tab（Agent 树）
├── 15-frontend-signals.md    # 前端 Signals Tab（过滤信号流）
├── 16-frontend-layout.md     # 前端整体布局和组件
├── 17-binary-compile.md      # 编译独立二进制
└── 18-integration-test.md    # 端到端集成测试
```

每个 spec 文件必须包含：模块职责、修改的文件清单、关键修改位置（行号）、接口定义、测试要求。

### 约束

- 不写代码，只做分析和设计
- spec 是后续 step-2 拆任务的唯一输入
- 每个 spec 文件独立可读
- 每个 spec 只覆盖一个模块
- 00-overview.md 中的依赖图精确到"哪个文件的哪个符号被谁依赖"
- 所有修改基于 zszcode/src/ 副本，不碰官方 Claude Code
