# 16 — 前端整体布局 TDD 任务计划

**模块职责**：Web 页面整体布局，包含顶栏、侧边栏、三个 Tab 主区域、底部输入栏和权限确认栏。

**新增文件**：
- `web/src/App.tsx`
- `web/src/hooks/useWebSocket.ts`
- `web/src/hooks/useSession.ts`
- `web/src/components/SessionSidebar.tsx`
- `web/src/components/ContextGauge.tsx`
- `web/src/components/PermissionBar.tsx`
- `web/src/types/events.ts`
- `web/vite.config.ts`
- `web/tailwind.config.js`
- `web/index.html`

---

## 任务 145：Vite + React + TypeScript + Tailwind 项目初始化

**所属模块**：16-frontend-layout
**依赖**：无
**预估耗时**：15 分钟

### 功能点要求
在 `web/` 目录下初始化 Vite + React 18 + TypeScript 项目。包含 `package.json`（依赖 react、react-dom、react-markdown、react-syntax-highlighter、tailwindcss、postcss、autoprefixer）、`vite.config.ts`、`tsconfig.json`、`tailwind.config.js`、`postcss.config.js`、`src/main.tsx` 入口。`bun install` 安装成功，`bun run dev` 可启动开发服务器。

### 测试用例（必须先写，确认 RED）
1. test_web_package_json_exists — 验证 `web/package.json` 文件存在
2. test_web_vite_config_exists — 验证 `web/vite.config.ts` 文件存在
3. test_web_tailwind_config_exists — 验证 `web/tailwind.config.js` 文件存在
4. test_web_src_main_exists — 验证 `web/src/main.tsx` 文件存在
5. test_web_tsconfig_exists — 验证 `web/tsconfig.json` 文件存在

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 初始化项目 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-145.test.ts
```

---

## 任务 146：index.html 入口文件含 root div

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：8 分钟

### 功能点要求
创建 `web/index.html`，包含 `<!DOCTYPE html>`、`<html lang="en">`、`<head>` 含 charset 和 viewport meta、`<title>` 为 "ZSZCode"、`<body>` 含 `<div id="root"></div>`、`<script type="module" src="/src/main.tsx"></script>`。文件位于 `web/` 根目录，Vite 以此作为入口 HTML。

### 测试用例（必须先写，确认 RED）
1. test_index_html_exists — 验证 `web/index.html` 文件存在
2. test_index_html_has_doctype — 验证文件包含 `<!DOCTYPE html>`
3. test_index_html_has_root_div — 验证文件包含 `<div id="root"></div>`
4. test_index_html_has_script — 验证文件包含指向 `/src/main.tsx` 的 script 标签
5. test_index_html_title — 验证 `<title>` 为 `ZSZCode`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 创建 `web/index.html` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-146.test.ts
```

---

## 任务 147：App.tsx 主布局（ContextGauge + Sidebar + Tabs + Input + PermissionBar）

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：15 分钟

### 功能点要求
创建 `web/src/App.tsx`，实现主布局：顶部 ContextGauge 占满宽度，下方左侧 SessionSidebar（固定宽度 240px），右侧主区域包含 Tab 栏（Chat/Workflow/Signals）和内容区，底部 ChatInput 固定，PermissionBar 在有权限请求时条件显示。使用 Tailwind CSS flex/grid 布局，深色主题（bg-gray-900 text-white）。

### 测试用例（必须先写，确认 RED）
1. test_app_renders_without_crash — 验证 App 组件渲染不报错
2. test_app_has_context_gauge — 验证渲染包含 ContextGauge 组件
3. test_app_has_sidebar — 验证渲染包含 SessionSidebar 组件
4. test_app_has_tabs — 验证渲染包含 Chat/Workflow/Signals 三个 Tab
5. test_app_has_chat_input — 验证渲染包含 ChatInput 组件

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 App.tsx 布局 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-147.test.ts
```

---

## 任务 148：useWebSocket hook 连接 ws://host/ws?token=xxx

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：15 分钟

### 功能点要求
创建 `web/src/hooks/useWebSocket.ts`，接受 WebSocket URL 参数（含 token），建立 WebSocket 连接。连接成功时设置 `connected` 为 `true`，收到消息时解析 JSON 并追加到 `events` 数组。提供 `sendMessage(data)` 方法通过 WebSocket 发送 JSON 消息。使用 `useRef` 保存 WebSocket 实例，`useState` 管理状态。

### 测试用例（必须先写，确认 RED）
1. test_use_websocket_connects — 验证 hook 调用后建立 WebSocket 连接
2. test_use_websocket_connected_true — 验证连接成功后 connected 为 true
3. test_use_websocket_receives_events — 验证收到消息后 events 数组更新
4. test_use_websocket_send_message — 验证 sendMessage 方法发送 JSON 数据
5. test_use_websocket_parses_json — 验证收到的消息被正确解析为对象

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 useWebSocket hook → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-148.test.ts
```

---

## 任务 149：useWebSocket hook 自动重连机制

**所属模块**：16-frontend-layout
**依赖**：任务 148
**预估耗时**：12 分钟

### 功能点要求
在 useWebSocket hook 中实现自动重连：WebSocket `onclose` 触发后，等待 1 秒后尝试重连，使用指数退避（1s, 2s, 4s, 8s, 最大 16s）。重连成功后重置退避时间。组件卸载时（useEffect cleanup）清除重连 timer 并关闭连接。提供 `reconnectAttempts` 计数。

### 测试用例（必须先写，确认 RED）
1. test_use_websocket_reconnect_on_close — 验证连接断开后自动重连
2. test_use_websocket_exponential_backoff — 验证重连间隔递增（1s, 2s, 4s）
3. test_use_websocket_max_backoff_16s — 验证重连间隔最大不超过 16 秒
4. test_use_websocket_reset_on_success — 验证重连成功后退避时间重置
5. test_use_websocket_cleanup_on_unmount — 验证组件卸载时清除 timer 和连接

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现自动重连逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-149.test.ts
```

---

## 任务 150：useWebSocket hook 返回 events/connected/sendMessage

**所属模块**：16-frontend-layout
**依赖**：任务 148
**预估耗时**：10 分钟

### 功能点要求
useWebSocket hook 返回值类型定义为 `{ events: ZszCodeEvent[], connected: boolean, sendMessage: (data: unknown) => void }`。`events` 为只读数组，包含所有收到的事件（按接收顺序）。`connected` 反映当前连接状态。`sendMessage` 在连接断开时静默丢弃（不抛异常）。使用 TypeScript 泛型确保类型安全。

### 测试用例（必须先写，确认 RED）
1. test_use_websocket_returns_events_array — 验证返回值包含 events 数组
2. test_use_websocket_returns_connected_boolean — 验证返回值包含 connected 布尔值
3. test_use_websocket_returns_send_message — 验证返回值包含 sendMessage 函数
4. test_use_websocket_events_in_order — 验证 events 按接收顺序排列
5. test_use_websocket_send_when_disconnected — 验证断开时 sendMessage 不抛异常

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 完善返回值类型和行为 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-150.test.ts
```

---

## 任务 151：useSession hook 管理 session 状态

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/hooks/useSession.ts`，管理多 session 状态。返回 `{ sessions, activeSessionId, switchSession, createSession }`。`sessions` 为 `{ id, name, createdAt }[]`。`switchSession(id)` 切换活跃 session。`createSession()` 创建新 session 并自动切换。`activeSessionId` 默认为第一个 session 的 id。初始包含一个 "Default" session。

### 测试用例（必须先写，确认 RED）
1. test_use_session_returns_sessions — 验证返回 sessions 数组
2. test_use_session_default_session — 验证初始有一个 "Default" session
3. test_use_session_switch — 验证 switchSession 切换 activeSessionId
4. test_use_session_create — 验证 createSession 添加新 session 并切换
5. test_use_session_create_generates_unique_id — 验证新 session id 唯一

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 useSession hook → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-151.test.ts
```

---

## 任务 152：events.ts 类型定义（ZszCodeEvent 前端副本）

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：10 分钟

### 功能点要求
创建 `web/src/types/events.ts`，定义前端使用的事件类型。包含 `ZszCodeEventType` 联合类型（19 种事件类型字符串）、`ZszCodeEvent` 基础接口（type, timestamp）、各事件具体接口（TurnStartEvent, ApiStreamStartEvent, ToolCallStartEvent 等）。类型定义与后端 `src/zszcode/event-bus.ts` 保持一致但独立（前端副本，不跨项目引用）。

### 测试用例（必须先写，确认 RED）
1. test_events_type_union_has_19_types — 验证 ZszCodeEventType 包含 19 种事件类型
2. test_events_base_has_type_and_timestamp — 验证基础事件接口包含 type 和 timestamp
3. test_events_turn_start_has_turn_number — 验证 TurnStartEvent 包含 turnNumber
4. test_events_tool_call_start_has_tool_name — 验证 ToolCallStartEvent 包含 toolName
5. test_events_compile_check — 验证类型文件可通过 TypeScript 编译

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 events.ts 类型定义 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-152.test.ts
```

---

## 任务 153：SessionSidebar 组件渲染 session 列表

**所属模块**：16-frontend-layout
**依赖**：任务 151
**预估耗时**：10 分钟

### 功能点要求
创建 `web/src/components/SessionSidebar.tsx`，接收 `sessions` 和 `activeSessionId` props，渲染 session 列表。每个 session 显示名称，活跃 session 高亮（bg-gray-700）。列表上方显示 "Sessions" 标题，下方有 "New Session" 按钮。使用 Tailwind CSS 样式，深色主题。

### 测试用例（必须先写，确认 RED）
1. test_sidebar_renders_sessions — 验证渲染所有 session 名称
2. test_sidebar_highlights_active — 验证活跃 session 有高亮样式
3. test_sidebar_has_title — 验证显示 "Sessions" 标题
4. test_sidebar_has_new_button — 验证有 "New Session" 按钮
5. test_sidebar_empty_sessions — 验证 sessions 为空时不报错

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 SessionSidebar 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-153.test.ts
```

---

## 任务 154：SessionSidebar 点击切换 session

**所属模块**：16-frontend-layout
**依赖**：任务 153
**预估耗时**：10 分钟

### 功能点要求
SessionSidebar 的每个 session 项可点击，点击时调用 `onSwitchSession(sessionId)` 回调。点击 "New Session" 按钮调用 `onCreateSession()` 回调。活跃 session 项不可重复点击（或点击无效）。使用 `data-testid` 属性方便测试定位。

### 测试用例（必须先写，确认 RED）
1. test_sidebar_click_switches_session — 验证点击非活跃 session 调用 onSwitchSession
2. test_sidebar_click_new_calls_create — 验证点击 "New Session" 调用 onCreateSession
3. test_sidebar_click_active_noop — 验证点击活跃 session 不重复调用
4. test_sidebar_receives_correct_id — 验证 onSwitchSession 接收到正确的 session id
5. test_sidebar_keyboard_accessible — 验证 session 项可通过键盘 Enter 触发

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现点击交互逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-154.test.ts
```

---

## 任务 155：ContextGauge 显示 Token/Cost/Model/Agent 状态

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/ContextGauge.tsx`，接收 `{ tokenCount, maxTokens, cost, model, agentStatus }` props。显示：Token 使用量（`tokenCount / maxTokens`，带进度条）、累计 Cost（美元格式，如 `$0.05`）、当前 Model 名称、Agent 状态（idle/thinking/tool_calling）。进度条在 token 使用超过 80% 时变红色。固定在页面顶部，高度 40px。

### 测试用例（必须先写，确认 RED）
1. test_gauge_renders_token_count — 验证显示 token 使用量
2. test_gauge_renders_cost — 验证显示美元格式 cost
3. test_gauge_renders_model — 验证显示 model 名称
4. test_gauge_renders_agent_status — 验证显示 agent 状态
5. test_gauge_progress_bar_red_at_80_percent — 验证 token 超 80% 进度条变红

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 ContextGauge 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-155.test.ts
```

---

## 任务 156：PermissionBar 底部固定栏显示 tool 信息

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/PermissionBar.tsx`，接收 `{ toolName, toolUseId, input, onAllow, onDeny, onAllowAlways }` props。显示 tool 名称（粗体）、input JSON（可折叠，默认折叠）、倒计时秒数。固定在页面底部，z-index 最高。当 props 为 null/undefined 时不渲染（`return null`）。深色背景，带边框区分。

### 测试用例（必须先写，确认 RED）
1. test_permission_bar_renders_tool_name — 验证显示 tool 名称
2. test_permission_bar_renders_input_json — 验证显示 input JSON（折叠态）
3. test_permission_bar_hidden_when_no_request — 验证 props 为空时不渲染
4. test_permission_bar_fixed_at_bottom — 验证 CSS position 为 fixed，bottom 为 0
5. test_permission_bar_input_toggle — 验证点击可展开/折叠 input JSON

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 PermissionBar 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-156.test.ts
```

---

## 任务 157：PermissionBar 三个按钮 Allow/Deny/Allow Always

**所属模块**：16-frontend-layout
**依赖**：任务 156
**预估耗时**：10 分钟

### 功能点要求
PermissionBar 底部显示三个按钮：绿色 "Allow"（调用 onAllow）、红色 "Deny"（调用 onDeny）、蓝色 "Allow Always"（调用 onAllowAlways）。按钮使用 Tailwind 样式，hover 时加深。按钮点击后 PermissionBar 立即隐藏（由父组件控制）。按钮使用 `data-testid` 属性。

### 测试用例（必须先写，确认 RED）
1. test_permission_bar_allow_button — 验证存在 "Allow" 按钮
2. test_permission_bar_deny_button — 验证存在 "Deny" 按钮
3. test_permission_bar_allow_always_button — 验证存在 "Allow Always" 按钮
4. test_permission_bar_allow_calls_callback — 验证点击 Allow 调用 onAllow
5. test_permission_bar_deny_calls_callback — 验证点击 Deny 调用 onDeny

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现按钮交互 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-157.test.ts
```

---

## 任务 158：PermissionBar 30 秒倒计时自动 deny

**所属模块**：16-frontend-layout
**依赖**：任务 156
**预估耗时**：12 分钟

### 功能点要求
PermissionBar 显示时启动 30 秒倒计时，每秒更新显示剩余秒数（如 "29s", "28s"...）。倒计时结束自动调用 onDeny。倒计时在组件卸载时清除 timer（避免内存泄漏）。剩余 10 秒内数字变红色警示。倒计时显示在按钮右侧。

### 测试用例（必须先写，确认 RED）
1. test_permission_bar_shows_countdown — 验证显示倒计时数字
2. test_permission_bar_countdown_decrements — 验证倒计时每秒递减
3. test_permission_bar_auto_deny_at_zero — 验证倒计时到 0 自动调用 onDeny
4. test_permission_bar_countdown_red_at_10s — 验证剩余 10 秒数字变红
5. test_permission_bar_timer_cleanup — 验证组件卸载时清除 timer

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现倒计时逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-158.test.ts
```

---

## 任务 159：PermissionBar 通过 WebSocket 发送 decision

**所属模块**：16-frontend-layout
**依赖**：任务 157, 150
**预估耗时**：10 分钟

### 功能点要求
PermissionBar 的三个按钮点击后，通过 WebSocket 发送权限决定消息：`{ type: 'permission_response', toolUseId, decision: 'allow' | 'deny' | 'allow_always' }`。消息通过 useWebSocket hook 的 sendMessage 方法发送。发送后 PermissionBar 隐藏。发送前验证 toolUseId 不为空。

### 测试用例（必须先写，确认 RED）
1. test_permission_bar_sends_allow — 验证点击 Allow 发送正确 JSON 消息
2. test_permission_bar_sends_deny — 验证点击 Deny 发送正确 JSON 消息
3. test_permission_bar_sends_allow_always — 验证点击 Allow Always 发送正确 JSON 消息
4. test_permission_bar_message_has_tool_use_id — 验证消息包含 toolUseId
5. test_permission_bar_hides_after_send — 验证发送后组件隐藏

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 WebSocket 发送逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-159.test.ts
```

---

## 任务 160：Tab 切换逻辑（Chat/Workflow/Signals）

**所属模块**：16-frontend-layout
**依赖**：任务 147
**预估耗时**：10 分钟

### 功能点要求
App.tsx 中实现 Tab 切换：三个 Tab 按钮（Chat/Workflow/Signals），点击切换显示对应内容区域。默认选中 Chat Tab。活跃 Tab 有下划线或高亮样式。Tab 内容区域使用条件渲染（非 display:none）。每个 Tab 内容区域有 `data-testid` 属性。

### 测试用例（必须先写，确认 RED）
1. test_tab_default_is_chat — 验证默认选中 Chat Tab
2. test_tab_click_workflow — 验证点击 Workflow Tab 切换内容
3. test_tab_click_signals — 验证点击 Signals Tab 切换内容
4. test_tab_click_chat — 验证从其他 Tab 切回 Chat
5. test_tab_active_highlight — 验证活跃 Tab 有高亮样式

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 Tab 切换逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-160.test.ts
```

---

## 任务 161：未授权时显示 401 错误页面

**所属模块**：16-frontend-layout
**依赖**：任务 148
**预估耗时**：10 分钟

### 功能点要求
当 WebSocket 连接被服务器拒绝（close code 4001 或 HTTP 401）时，显示全屏错误页面：标题 "Unauthorized"、说明文字 "Invalid or missing token"、"Retry" 按钮重新加载页面。不显示主布局内容。错误页面居中显示，深色主题。

### 测试用例（必须先写，确认 RED）
1. test_401_shows_error_page — 验证未授权时显示错误页面
2. test_401_shows_unauthorized_text — 验证显示 "Unauthorized" 文字
3. test_401_shows_retry_button — 验证显示 "Retry" 按钮
4. test_401_hides_main_layout — 验证不显示主布局内容
5. test_401_retry_reloads — 验证点击 Retry 触发页面重新加载

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 401 错误页面 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-161.test.ts
```

---

## 任务 162：Vite 配置代理 WebSocket 到后端

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：10 分钟

### 功能点要求
在 `web/vite.config.ts` 中配置 dev server 代理：HTTP 请求 `/api/*` 代理到 `http://localhost:3000`，WebSocket `/ws` 代理到 `ws://localhost:3000`（`ws: true`）。代理配置使前端开发时无需手动处理跨域。代理目标端口可配置（默认 3000）。

### 测试用例（必须先写，确认 RED）
1. test_vite_config_has_proxy — 验证 vite.config.ts 包含 proxy 配置
2. test_vite_proxy_api_target — 验证 `/api` 代理目标为 `http://localhost:3000`
3. test_vite_proxy_ws — 验证 WebSocket 代理配置 `ws: true`
4. test_vite_proxy_ws_target — 验证 `/ws` 代理目标正确
5. test_vite_config_is_valid — 验证 vite.config.ts 可被 Vite 正确解析

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 配置 Vite 代理 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-162.test.ts
```

---

## 任务 163：Tailwind 配置深色主题

**所属模块**：16-frontend-layout
**依赖**：任务 145
**预估耗时**：8 分钟

### 功能点要求
在 `web/tailwind.config.js` 中配置 `darkMode: 'class'`，`content` 覆盖 `./src/**/*.{ts,tsx}`。自定义颜色扩展：`surface: '#1a1a2e'`、`surfaceLight: '#16213e'`、`accent: '#0f3460'`。在 `web/src/index.css` 中引入 Tailwind directives（`@tailwind base; @tailwind components; @tailwind utilities;`），并在 `<html>` 标签添加 `class="dark"`。

### 测试用例（必须先写，确认 RED）
1. test_tailwind_config_dark_mode — 验证 tailwind.config.js 设置 darkMode 为 'class'
2. test_tailwind_config_content — 验证 content 包含 `./src/**/*.{ts,tsx}`
3. test_tailwind_custom_colors — 验证自定义 surface/surfaceLight/accent 颜色
4. test_tailwind_css_directives — 验证 index.css 包含 Tailwind directives
5. test_tailwind_html_dark_class — 验证 index.html 的 html 标签有 `class="dark"`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 配置 Tailwind 深色主题 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/16-task-163.test.ts
```
