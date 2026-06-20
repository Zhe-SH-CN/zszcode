# 00 — 总览 Plan

## 任务总表

| N | 功能点 | 模块 | 依赖 |
|---|--------|------|------|
| 1 | 创建 package.json 声明所有依赖和脚本 | 01-build-system | 无 |
| 2 | 创建 tsconfig.json 含 paths 映射 bun:bundle 和 bun:test | 01-build-system | 无 |
| 3 | 创建 src/shims/bun-bundle.ts 的 feature() 函数（始终返回 false） | 01-build-system | 无 |
| 4 | 创建 src/shims/bun-bundle.ts 的 MACRO 常量对象（7 个字段） | 01-build-system | 无 |
| 5 | 创建 src/shims/bun-test.ts 空 stub 导出 | 01-build-system | 无 |
| 6 | bun install 成功安装所有依赖无报错 | 01-build-system | 1 |
| 7 | bun build 解析所有 src/ 导入无 ModuleNotFound 错误 | 01-build-system | 2,3,4,5,6 |
| 8 | feature() 对任意字符串输入返回 false | 01-build-system | 3 |
| 9 | MACRO.VERSION 返回 '0.1.0' | 01-build-system | 4 |
| 10 | MACRO.PACKAGE_URL 返回正确的 GitHub URL | 01-build-system | 4 |
| 11 | MACRO.BUILD_TIME 返回 ISO 8601 格式字符串 | 01-build-system | 4 |
| 12 | MACRO.ISSUES_EXPLAINER 返回正确的 issue 报告 URL | 01-build-system | 4 |
| 13 | tsconfig paths 正确解析 bun:bundle 到 shim 文件 | 01-build-system | 2 |
| 14 | tsconfig paths 正确解析 bun:test 到 shim 文件 | 01-build-system | 2 |
| 15 | bunx tsc --noEmit 类型检查通过（或仅有少量已知错误） | 01-build-system | 7 |
| 16 | bun run src/entrypoints/cli.tsx --version 输出 zszcode 0.1.0 | 01-build-system | 7,9 |
| 17 | 定义 ZszCodeConfig 接口含全部 6 个字段 | 02-config | 无 |
| 18 | 定义 DEFAULTS 常量含正确的默认值 | 02-config | 17 |
| 19 | loadConfig() 配置文件不存在时创建默认 settings.json | 02-config | 18 |
| 20 | loadConfig() 配置文件存在时读取并合并 | 02-config | 18 |
| 21 | loadConfig() 缺失字段用默认值填充 | 02-config | 20 |
| 22 | loadConfig() 自定义值覆盖默认值 | 02-config | 20 |
| 23 | loadConfig() 配置目录不存在时自动创建 ~/.zszcode/ | 02-config | 19 |
| 24 | loadConfig() 无效 JSON 抛出明确错误 | 02-config | 18 |
| 25 | CONFIG_DIR 常量为 ~/.zszcode 绝对路径 | 02-config | 17 |
| 26 | CONFIG_FILE 常量为 ~/.zszcode/settings.json 绝对路径 | 02-config | 25 |
| 27 | ZszCodeConfig.permissionMode 类型约束为 'auto' | 'confirm' | 02-config | 17 |
| 28 | loadConfig() 返回对象包含所有必需字段（无 undefined） | 02-config | 21 |
| 29 | loadConfig() 幂等性：连续调用返回相同结果 | 02-config | 20 |
| 30 | loadConfig() settings.json 为空对象时返回全部默认值 | 02-config | 18 |
| 31 | loadConfig() settings.json 含多余字段时不报错 | 02-config | 20 |
| 32 | 定义 ZszCodeEvent 联合类型含全部 19 种事件 | 03-event-bus | 无 |
| 33 | ZszCodeEventBus 类继承 EventEmitter | 03-event-bus | 32 |
| 34 | eventBus.emit() 广播事件到所有已注册 listener | 03-event-bus | 33 |
| 35 | eventBus.onEvent() 返回 unsubscribe 函数 | 03-event-bus | 33 |
| 36 | unsubscribe 后不再收到事件 | 03-event-bus | 35 |
| 37 | 多个 listener 同时接收同一事件 | 03-event-bus | 34 |
| 38 | 历史缓冲区保留最近 1000 条事件 | 03-event-bus | 34 |
| 39 | 超出 1000 条后 FIFO 淘汰最旧事件 | 03-event-bus | 38 |
| 40 | listener 抛异常不影响其他 listener 执行 | 03-event-bus | 34 |
| 41 | getHistory() 返回最近 N 条事件 | 03-event-bus | 38 |
| 42 | getHistory() 默认返回最近 100 条 | 03-event-bus | 41 |
| 43 | getHistory() 历史为空时返回空数组 | 03-event-bus | 41 |
| 44 | eventBus 单例全局唯一 | 03-event-bus | 33 |
| 45 | emit() 返回 boolean（EventEmitter 行为） | 03-event-bus | 34 |
| 46 | 事件对象必须包含 timestamp 字段 | 03-event-bus | 32 |
| 47 | startWebServer() 返回 WebServerHandle 含 port/token/url/close | 04-web-server | 无 |
| 48 | 服务器在配置端口启动 | 04-web-server | 47 |
| 49 | 启动时生成 48 字符随机 token | 04-web-server | 47 |
| 50 | 无 token 的 HTTP 请求返回 401 | 04-web-server | 48 |
| 51 | 有效 token 的 HTTP 请求返回 200 | 04-web-server | 48,49 |
| 52 | URL query 参数 ?token=xxx 认证方式 | 04-web-server | 50,51 |
| 53 | Authorization: Bearer xxx 认证方式 | 04-web-server | 50,51 |
| 54 | GET / 返回 index.html（含 DOCTYPE） | 04-web-server | 51 |
| 55 | GET /* 返回 web/dist/ 下的静态文件 | 04-web-server | 51 |
| 56 | GET /api/events 返回最近 100 条事件 JSON 数组 | 04-web-server | 51 |
| 57 | POST /api/permission/resolve 处理权限确认 | 04-web-server | 51 |
| 58 | 端口被占用时自动递增到下一个可用端口 | 04-web-server | 48 |
| 59 | 最多尝试 100 个端口后失败 | 04-web-server | 58 |
| 60 | WebSocket 连接成功（ws://host/ws?token=xxx） | 04-web-server | 48,49 |
| 61 | WebSocket 连接无 token 被拒绝 | 04-web-server | 60 |
| 62 | WebSocket 连接后接收到事件广播 | 04-web-server | 60 |
| 63 | close() 方法停止服务器释放端口 | 04-web-server | 47 |
| 64 | url 属性格式为 http://localhost:{port}?token={token} | 04-web-server | 47,49 |
| 65 | 修改 client.ts 的 getAnthropicClient() 注入 zszcode apiKey | 05-api-adapter | 无 |
| 66 | 修改 client.ts 的 getAnthropicClient() 注入 zszcode baseURL | 05-api-adapter | 65 |
| 67 | CLI --model flag 覆盖配置默认模型 | 05-api-adapter | 66 |
| 68 | 无 CLI --model 时使用配置中的 model 字段 | 05-api-adapter | 66 |
| 69 | 无配置时回退到 getDefaultMainLoopModel() | 05-api-adapter | 68 |
| 70 | 无效 baseURL 产生明确错误消息 | 05-api-adapter | 66 |
| 71 | apiKey 优先级：zszcode 配置 > 环境变量 > 默认 | 05-api-adapter | 65 |
| 72 | baseURL 为空字符串时不覆盖默认值 | 05-api-adapter | 66 |
| 73 | loadConfig() 只调用一次（缓存/幂等） | 05-api-adapter | 65 |
| 74 | model 字符串通过 parseUserSpecifiedModel 标准化 | 05-api-adapter | 67 |
| 75 | query() 入口 emit turn_start 事件 | 06-query-observability | 34 |
| 76 | turn_start 包含正确 turnNumber | 06-query-observability | 75 |
| 77 | API 调用前 emit api_stream_start | 06-query-observability | 34 |
| 78 | api_stream_start 包含正确 model 名称 | 06-query-observability | 77 |
| 79 | deps.callModel() 循环内每个 streaming event emit api_stream_event | 06-query-observability | 34 |
| 80 | api_stream_event 包含原始 event 数据 | 06-query-observability | 79 |
| 81 | API 调用结束 emit api_stream_end | 06-query-observability | 77 |
| 82 | api_stream_end 包含 duration 和 tokens | 06-query-observability | 81 |
| 83 | runTools() 前 emit turn_start | 06-query-observability | 75 |
| 84 | runTools() 后 emit turn_end | 06-query-observability | 83 |
| 85 | executePostSamplingHooks() 后 emit hook_fire | 06-query-observability | 34 |
| 86 | query loop 每次迭代 emit turn_start/turn_end 配对 | 06-query-observability | 75,84 |
| 87 | 事件在 yield 之前发出（保证实时性） | 06-query-observability | 79 |
| 88 | tool_call_start 在 tool.call() 前发出 | 07-tool-observability | 34 |
| 89 | tool_call_start 包含 toolName, toolUseId, input, agentId | 07-tool-observability | 88 |
| 90 | tool_call_end 在 tool.call() 后发出 | 07-tool-observability | 88 |
| 91 | tool_call_end 成功时 success=true | 07-tool-observability | 90 |
| 92 | tool_call_end 失败时 success=false | 07-tool-observability | 90 |
| 93 | tool_call_end 包含 duration（毫秒） | 07-tool-observability | 90 |
| 94 | tool_call_end 包含 output 数据 | 07-tool-observability | 90 |
| 95 | tool_permission_request 在权限检查时发出 | 07-tool-observability | 34 |
| 96 | tool_permission_request 包含 toolName, toolUseId, input | 07-tool-observability | 95 |
| 97 | hook_fire 在 runPreToolUseHooks 时发出 | 07-tool-observability | 34 |
| 98 | hook_fire 在 runPostToolUseHooks 时发出 | 07-tool-observability | 97 |
| 99 | StreamingToolExecutor.addTool() emit tool_call_start | 07-tool-observability | 88 |
| 100 | StreamingToolExecutor.executeTool() emit tool_call_end | 07-tool-observability | 90 |
| 101 | runTools() 入口 emit 批次信息（并发/串行） | 07-tool-observability | 34 |
| 102 | agent_spawn 在 runAgent() 入口发出 | 08-agent-observability | 34 |
| 103 | agent_spawn 包含 parentId 和 childId | 08-agent-observability | 102 |
| 104 | agent_spawn 包含 agentType 和 description | 08-agent-observability | 102 |
| 105 | agent_complete 在 finally 块发出 | 08-agent-observability | 102 |
| 106 | agent_complete 包含正确 duration | 08-agent-observability | 105 |
| 107 | message 事件对 query() 循环中每个 yield 的消息发出 | 08-agent-observability | 34 |
| 108 | message 事件包含 role 和 content | 08-agent-observability | 107 |
| 109 | executeSubagentStartHooks() 时 emit hook_fire | 08-agent-observability | 102 |
| 110 | mcp_connect 在 connectToServer() 成功时 success=true | 09-mcp-observability | 34 |
| 111 | mcp_connect 在连接失败时 success=false | 09-mcp-observability | 110 |
| 112 | mcp_connect 包含 serverName | 09-mcp-observability | 110 |
| 113 | mcp_call 在 client.callTool() 前发出（无 response） | 09-mcp-observability | 34 |
| 114 | mcp_call 在 client.callTool() 后发出（有 response） | 09-mcp-observability | 113 |
| 115 | mcp_call 包含正确 duration | 09-mcp-observability | 114 |
| 116 | mcp_call 包含 serverName, toolName, request | 09-mcp-observability | 113 |
| 117 | skill_load 在 fetchToolsForClient() 注册工具时发出 | 09-mcp-observability | 34 |
| 118 | skill_load 包含 name 和 source | 09-mcp-observability | 117 |
| 119 | setState() 时 emit state_change 事件 | 10-state-observability | 34 |
| 120 | state_change 包含正确 field 名称 | 10-state-observability | 119 |
| 121 | state_change 包含 oldValue 和 newValue | 10-state-observability | 119 |
| 122 | Object.is 相同时不发出 state_change | 10-state-observability | 119 |
| 123 | 多个字段变化发出多个独立 state_change 事件 | 10-state-observability | 119 |
| 124 | 只遍历 next 对象的 keys（不遍历 prev 独有） | 10-state-observability | 119 |
| 125 | 嵌套对象引用变化触发事件（即使深层相等） | 10-state-observability | 119 |
| 126 | requestWebPermission() 返回 Promise | 11-permission-bridge | 34 |
| 127 | resolveWebPermission() 调用后 Promise resolve 为对应 decision | 11-permission-bridge | 126 |
| 128 | 30 秒超时自动 resolve 为 'deny' | 11-permission-bridge | 126 |
| 129 | tool_permission_request 事件在请求时发出 | 11-permission-bridge | 126 |
| 130 | tool_permission_resolved 事件在 resolve 时发出 | 11-permission-bridge | 127 |
| 131 | tool_permission_resolved 包含 source ('web' 或 'cli') | 11-permission-bridge | 130 |
| 132 | allow_always 决策在会话期间持续生效 | 11-permission-bridge | 127 |
| 133 | 重复 resolve 同一 toolUseId 不报错（幂等） | 11-permission-bridge | 127 |
| 134 | resolve 后超时 timer 被清除 | 11-permission-bridge | 128 |
| 135 | Promise.race 集成：Web 和 CLI 谁先谁赢 | 11-permission-bridge | 126,127 |
| 136 | REPL Props 类型添加 webUrl 可选字段 | 12-repl-statusbar | 无 |
| 137 | WebUrlBanner 组件渲染 dim "Web UI:" 前缀 | 12-repl-statusbar | 136 |
| 138 | WebUrlBanner 组件渲染 cyan 颜色 URL | 12-repl-statusbar | 136 |
| 139 | webUrl 为 undefined 时不显示 banner | 12-repl-statusbar | 136 |
| 140 | URL 包含 token 查询参数 | 12-repl-statusbar | 138 |
| 141 | bottom slot 中 banner 在 permissionStickyFooter 之上 | 12-repl-statusbar | 137 |
| 142 | main.tsx 启动 Web 服务器并获取 url | 12-repl-statusbar | 无 |
| 143 | main.tsx 将 webUrl 传递给 launchRepl() | 12-repl-statusbar | 142 |
| 144 | launchRepl 将 webUrl 传给 REPL 组件 | 12-repl-statusbar | 143 |
| 145 | Vite + React + TypeScript + Tailwind 项目初始化 | 16-frontend-layout | 无 |
| 146 | index.html 入口文件含 root div | 16-frontend-layout | 145 |
| 147 | App.tsx 主布局（ContextGauge + Sidebar + Tabs + Input + PermissionBar） | 16-frontend-layout | 145 |
| 148 | useWebSocket hook 连接 ws://host/ws?token=xxx | 16-frontend-layout | 145 |
| 149 | useWebSocket hook 自动重连机制 | 16-frontend-layout | 148 |
| 150 | useWebSocket hook 返回 events/connected/sendMessage | 16-frontend-layout | 148 |
| 151 | useSession hook 管理 session 状态 | 16-frontend-layout | 145 |
| 152 | events.ts 类型定义（ZszCodeEvent 前端副本） | 16-frontend-layout | 145 |
| 153 | SessionSidebar 组件渲染 session 列表 | 16-frontend-layout | 151 |
| 154 | SessionSidebar 点击切换 session | 16-frontend-layout | 153 |
| 155 | ContextGauge 显示 Token/Cost/Model/Agent 状态 | 16-frontend-layout | 145 |
| 156 | PermissionBar 底部固定栏显示 tool 信息 | 16-frontend-layout | 145 |
| 157 | PermissionBar 三个按钮 Allow/Deny/Allow Always | 16-frontend-layout | 156 |
| 158 | PermissionBar 30 秒倒计时自动 deny | 16-frontend-layout | 156 |
| 159 | PermissionBar 通过 WebSocket 发送 decision | 16-frontend-layout | 156 |
| 160 | Tab 切换逻辑（Chat/Workflow/Signals） | 16-frontend-layout | 147 |
| 161 | 未授权时显示 401 错误页面 | 16-frontend-layout | 148 |
| 162 | Vite 配置代理 WebSocket 到后端 | 16-frontend-layout | 145 |
| 163 | Tailwind 配置深色主题 | 16-frontend-layout | 145 |
| 164 | StreamView 主消息流容器组件 | 13-frontend-chat | 147 |
| 165 | MessageBlock 根据 type 分发到对应 Block 组件 | 13-frontend-chat | 164 |
| 166 | ThinkingBlock 默认折叠显示 | 13-frontend-chat | 165 |
| 167 | ThinkingBlock 点击展开显示完整内容 | 13-frontend-chat | 166 |
| 168 | TextBlock 使用 react-markdown 渲染 | 13-frontend-chat | 165 |
| 169 | TextBlock 代码块语法高亮（深色主题） | 13-frontend-chat | 168 |
| 170 | ToolUseBlock 卡片展示 tool name 粗体 | 13-frontend-chat | 165 |
| 171 | ToolUseBlock input JSON 可折叠 | 13-frontend-chat | 170 |
| 172 | ToolResultBlock 默认折叠最多 10 行预览 | 13-frontend-chat | 165 |
| 173 | ToolResultBlock 成功时绿色边框 | 13-frontend-chat | 172 |
| 174 | ToolResultBlock 失败时红色边框 | 13-frontend-chat | 172 |
| 175 | ToolResultBlock 点击展开全文 | 13-frontend-chat | 172 |
| 176 | ResultBlock 显示 duration/tokens/cost/stop_reason | 13-frontend-chat | 165 |
| 177 | SystemBlock 顶部通知条样式 | 13-frontend-chat | 165 |
| 178 | ChatInput 底部输入框 | 13-frontend-chat | 164 |
| 179 | ChatInput 发送消息通过 WebSocket | 13-frontend-chat | 178 |
| 180 | ChatInput 发送后禁用等待 result | 13-frontend-chat | 179 |
| 181 | ChatInput agent 处理中可排队输入 | 13-frontend-chat | 178 |
| 182 | WorkflowView 主容器组件 | 14-frontend-workflow | 147 |
| 183 | AgentTreeNode 渲染 agent ID 和 type | 14-frontend-workflow | 182 |
| 184 | AgentTreeNode 从 agent_spawn 事件构建 | 14-frontend-workflow | 183 |
| 185 | AgentTreeNode 父子关系树形展示 | 14-frontend-workflow | 183 |
| 186 | AgentTreeNode 可展开/折叠 | 14-frontend-workflow | 183 |
| 187 | AgentTreeNode 点击显示 input/output JSON | 14-frontend-workflow | 183 |
| 188 | ToolCallNode 显示 tool name 和 duration | 14-frontend-workflow | 183 |
| 189 | ToolCallNode 从 tool_call_start/end 事件构建 | 14-frontend-workflow | 188 |
| 190 | DataFlowLine 数据流线条 SVG | 14-frontend-workflow | 182 |
| 191 | DataFlowLine CSS 粒子动画（stroke-dashoffset） | 14-frontend-workflow | 190 |
| 192 | DataFlowLine 颜色编码：运行中绿色/完成灰色/失败红色 | 14-frontend-workflow | 190 |
| 193 | agent_complete 事件更新节点状态 | 14-frontend-workflow | 183 |
| 194 | 树形数据结构从事件流实时构建 | 14-frontend-workflow | 184 |
| 195 | SignalsView 主容器组件 | 15-frontend-signals | 147 |
| 196 | SignalFilter 过滤器 checkbox 列表（11 种类型） | 15-frontend-signals | 195 |
| 197 | SignalFilter 默认全部选中 | 15-frontend-signals | 196 |
| 198 | SignalFilter 变更立即生效过滤事件 | 15-frontend-signals | 196 |
| 199 | SignalCard 显示事件 type 和 timestamp | 15-frontend-signals | 195 |
| 200 | SignalCard 可展开查看完整 JSON | 15-frontend-signals | 199 |
| 201 | 新事件自动滚动到底部 | 15-frontend-signals | 195 |
| 202 | 暂停按钮停止自动滚动 | 15-frontend-signals | 201 |
| 203 | bun build --compile 成功生成独立二进制 | 17-binary-compile | 7 |
| 204 | ./zszcode --version 输出 0.1.0 | 17-binary-compile | 203 |
| 205 | ./zszcode 启动 CLI + Web 服务器 | 17-binary-compile | 203 |
| 206 | 不依赖已安装的 claude 命令 | 17-binary-compile | 203 |
| 207 | which claude 仍指向官方 | 17-binary-compile | 203 |
| 208 | 前端 build:web 生成 web/dist/ | 17-binary-compile | 145 |
| 209 | CLI 启动进入交互模式 | 18-integration-test | 205 |
| 210 | CLI --version 输出 zszcode 0.1.0 | 18-integration-test | 204 |
| 211 | CLI 默认使用 mimo-v2.5-pro | 18-integration-test | 68,209 |
| 212 | CLI 底部显示 Web UI URL | 18-integration-test | 141,209 |
| 213 | curl Web 服务器返回 HTML | 18-integration-test | 205 |
| 214 | WebSocket 连接成功 | 18-integration-test | 205 |
| 215 | 未授权 curl 返回 401 | 18-integration-test | 205 |
| 216 | 第二实例自动用 3001 端口 | 18-integration-test | 205 |
| 217 | Playwright 页面加载三个 Tab 可见 | 18-integration-test | 208,213 |
| 218 | Playwright Chat 发消息收到回复 | 18-integration-test | 217 |
| 219 | Playwright Thinking 折叠显示 | 18-integration-test | 217 |
| 220 | Playwright Tool Use 卡片显示 | 18-integration-test | 217 |
| 221 | Playwright Workflow Tab Agent 树可见 | 18-integration-test | 217 |
| 222 | Playwright Signals Tab 过滤器可用 | 18-integration-test | 217 |
| 223 | Playwright 权限确认栏出现 | 18-integration-test | 217 |
| 224 | Playwright 30 秒超时自动 deny | 18-integration-test | 223 |
| 225 | CLI 发消息 Web 同步显示 | 18-integration-test | 209,214 |
| 226 | Web 发消息 CLI 同步显示 | 18-integration-test | 209,214 |
| 227 | Web 点 Allow CLI 确认框消失 | 18-integration-test | 209,214 |
| 228 | bunx tsc --noEmit 零错误 | 18-integration-test | 203 |
| 229 | bun test 全绿 | 18-integration-test | 203 |
| 230 | check_progress.ts 返回 all tasks done | 18-integration-test | 全部 |

**总任务数：230**
