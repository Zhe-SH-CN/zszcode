# 18 — 端到端集成测试 TDD 任务计划

**模块职责**：验证 zszcode 完整功能：CLI 交互、Web UI、双端同步、权限确认。

---

## 任务 209：CLI 启动进入交互模式

**所属模块**：18-integration-test
**依赖**：任务 205
**预估耗时**：15 分钟

### 功能点要求
运行 `bun run src/entrypoints/cli.tsx`，成功进入 CLI 交互模式。启动后显示 zszcode 欢迎信息和输入提示符。进程持续运行，等待用户输入。启动过程无报错，exit code 不为非零。使用 `--print` 或 `--message` 参数可直接发送消息并获取回复（非交互模式）。

### 测试用例（必须先写，确认 RED）
1. test_cli_starts_successfully — 验证 CLI 启动无报错
2. test_cli_shows_welcome — 验证显示欢迎信息
3. test_cli_shows_prompt — 验证显示输入提示符
4. test_cli_process_stays_alive — 验证进程持续运行（不立即退出）
5. test_cli_exits_on_exit_command — 验证 `/exit` 命令退出进程

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证 CLI 启动行为 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-209.test.ts
```

---

## 任务 210：CLI --version 输出 zszcode 0.1.0

**所属模块**：18-integration-test
**依赖**：任务 204
**预估耗时**：8 分钟

### 功能点要求
运行 `bun run src/entrypoints/cli.tsx --version`，输出精确为 `zszcode 0.1.0\n`。退出码为 0。stderr 为空。此测试验证 CLI 入口的 Commander.js 配置和 MACRO.VERSION 注入在完整构建流程中正确工作。

### 测试用例（必须先写，确认 RED）
1. test_cli_version_integration_exits_zero — 验证退出码为 0
2. test_cli_version_integration_exact_output — 验证输出精确匹配
3. test_cli_version_integration_stderr_empty — 验证 stderr 为空
4. test_cli_version_integration_no_extra_lines — 验证输出只有一行
5. test_cli_version_integration_fast — 验证执行时间 < 5 秒

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证版本号输出 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-210.test.ts
```

---

## 任务 211：CLI 默认使用 mimo-v2.5-pro

**所属模块**：18-integration-test
**依赖**：任务 68, 209
**预估耗时**：12 分钟

### 功能点要求
CLI 启动后，API 请求默认使用 `mimo-v2.5-pro` 模型。可通过日志或 API 请求 URL 确认。`--model` flag 可覆盖默认模型。不指定 `--model` 时，使用配置文件中的 model 字段（默认 `mimo-v2.5-pro`）。API 请求发送到 `https://token-plan-cn.xiaomimimo.com/anthropic`。

### 测试用例（必须先写，确认 RED）
1. test_cli_default_model — 验证默认使用 mimo-v2.5-pro
2. test_cli_model_flag_override — 验证 --model flag 覆盖默认模型
3. test_cli_api_endpoint — 验证 API 请求发送到正确的 endpoint
4. test_cli_model_in_config — 验证从配置文件读取 model
5. test_cli_model_fallback — 验证无配置时使用默认模型

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证模型配置 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-211.test.ts
```

---

## 任务 212：CLI 底部显示 Web UI URL

**所属模块**：18-integration-test
**依赖**：任务 141, 209
**预估耗时**：10 分钟

### 功能点要求
CLI 启动后，底部状态栏显示 `Web UI: http://localhost:3000?token=xxx`。URL 包含正确的端口号和随机 token。端口号与实际 Web 服务器监听端口一致。URL 使用 cyan 颜色高亮显示。前缀 "Web UI:" 使用 dim 样式。

### 测试用例（必须先写，确认 RED）
1. test_cli_web_url_displayed — 验证底部显示 Web UI URL
2. test_cli_web_url_has_port — 验证 URL 包含端口号
3. test_cli_web_url_has_token — 验证 URL 包含 token 参数
4. test_cli_web_url_port_matches — 验证端口号与实际服务器一致
5. test_cli_web_url_format — 验证 URL 格式为 http://localhost:{port}?token={token}

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证 URL 显示 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-212.test.ts
```

---

## 任务 213：curl Web 服务器返回 HTML

**所属模块**：18-integration-test
**依赖**：任务 205
**预估耗时**：10 分钟

### 功能点要求
zszcode 启动后，使用 `curl -s "http://localhost:{port}?token={token}"` 访问 Web 服务器。返回 200 状态码，Content-Type 为 `text/html`。响应体包含 `<!DOCTYPE html>` 和 `<div id="root"></div>`。HTML 内容来自 `web/dist/index.html`。

### 测试用例（必须先写，确认 RED）
1. test_curl_returns_200 — 验证 HTTP 200 状态码
2. test_curl_returns_html — 验证 Content-Type 为 text/html
3. test_curl_has_doctype — 验证响应体包含 `<!DOCTYPE html>`
4. test_curl_has_root_div — 验证响应体包含 `<div id="root"></div>`
5. test_curl_token_required — 验证无 token 时返回 401

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证 Web 服务器响应 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-213.test.ts
```

---

## 任务 214：WebSocket 连接成功

**所属模块**：18-integration-test
**依赖**：任务 205
**预估耗时**：12 分钟

### 功能点要求
使用 WebSocket 客户端（脚本或 wscat）连接 `ws://localhost:{port}/ws?token={token}`。连接成功后收到欢迎消息或连接确认。连接后可接收服务器推送的事件。无 token 的 WebSocket 连接被拒绝（close code 4001）。使用 Node.js `ws` 库编写测试脚本验证连接。

### 测试用例（必须先写，确认 RED）
1. test_ws_connects_successfully — 验证 WebSocket 连接成功
2. test_ws_receives_events — 验证连接后收到事件推送
3. test_ws_no_token_rejected — 验证无 token 连接被拒绝
4. test_ws_invalid_token_rejected — 验证无效 token 连接被拒绝
5. test_ws_message_format_json — 验证收到的消息为 JSON 格式

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证 WebSocket 行为 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-214.test.ts
```

---

## 任务 215：未授权 curl 返回 401

**所属模块**：18-integration-test
**依赖**：任务 205
**预估耗时**：8 分钟

### 功能点要求
不带 token 访问 Web 服务器的任何端点，返回 401 Unauthorized。访问方式包括：无 token 的 URL（`http://localhost:{port}/`）、无 token 的 API 端点（`http://localhost:{port}/api/events`）、无效 token。401 响应体包含错误消息 JSON（`{"error": "Unauthorized"}`）。

### 测试用例（必须先写，确认 RED）
1. test_unauthorized_returns_401 — 验证无 token 返回 401
2. test_unauthorized_api_returns_401 — 验证 API 端点无 token 返回 401
3. test_invalid_token_returns_401 — 验证无效 token 返回 401
4. test_unauthorized_body_json — 验证 401 响应体为 JSON
5. test_unauthorized_body_has_error — 验证响应体包含 error 字段

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证认证行为 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-215.test.ts
```

---

## 任务 216：第二实例自动用 3001 端口

**所属模块**：18-integration-test
**依赖**：任务 205
**预估耗时**：12 分钟

### 功能点要求
第一个 zszcode 实例占用 3000 端口后，启动第二个实例。第二个实例自动递增到 3001 端口（或下一个可用端口）。两个实例同时运行不冲突。每个实例有独立的 token。CLI 底部显示的 Web URL 包含各自的端口号。

### 测试用例（必须先写，确认 RED）
1. test_second_instance_uses_3001 — 验证第二个实例使用 3001 端口
2. test_both_instances_running — 验证两个实例同时运行
3. test_each_has_unique_token — 验证每个实例有独立 token
4. test_urls_have_different_ports — 验证两个 URL 端口号不同
5. test_instances_independent — 验证两个实例互不干扰

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证端口递增 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-216.test.ts
```

---

## 任务 217：Playwright 页面加载三个 Tab 可见

**所属模块**：18-integration-test
**依赖**：任务 208, 213
**预估耗时**：15 分钟

### 功能点要求
使用 Playwright 打开 Web URL（`http://localhost:{port}?token={token}`），验证页面加载完成。页面上可见三个 Tab：Chat、Workflow、Signals。默认选中 Chat Tab。ContextGauge 顶部栏可见。SessionSidebar 左侧栏可见。ChatInput 底部输入框可见。

### 测试用例（必须先写，确认 RED）
1. test_playwright_page_loads — 验证页面加载完成
2. test_playwright_chat_tab_visible — 验证 Chat Tab 可见
3. test_playwright_workflow_tab_visible — 验证 Workflow Tab 可见
4. test_playwright_signals_tab_visible — 验证 Signals Tab 可见
5. test_playwright_default_tab_is_chat — 验证默认选中 Chat Tab

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 配置 Playwright 并验证 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-217.test.ts
```

---

## 任务 218：Playwright Chat 发消息收到回复

**所属模块**：18-integration-test
**依赖**：任务 217
**预估耗时**：15 分钟

### 功能点要求
在 Playwright 测试中，在 Chat 输入框输入 "say hello"，点击 Send 按钮。等待 30 秒内收到 assistant 回复消息。回复消息在 StreamView 中可见。输入框在发送后禁用，收到回复后重新启用。测试使用真实的 mimo-v2.5-pro API 调用（非 mock）。

### 测试用例（必须先写，确认 RED）
1. test_playwright_send_message — 验证可以输入并发送消息
2. test_playwright_receive_reply — 验证收到 assistant 回复
3. test_playwright_reply_visible — 验证回复在页面上可见
4. test_playwright_input_disabled_during_thinking — 验证发送后输入框禁用
5. test_playwright_input_enabled_after_reply — 验证收到回复后输入框启用

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 Playwright 测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-218.test.ts
```

---

## 任务 219：Playwright Thinking 折叠显示

**所属模块**：18-integration-test
**依赖**：任务 217
**预估耗时**：12 分钟

### 功能点要求
在 Playwright 测试中，发送消息后等待 ThinkingBlock 出现。验证 ThinkingBlock 默认折叠状态（内容不可见或截断）。点击 ThinkingBlock 展开，验证完整内容可见。再次点击折叠，验证内容隐藏。测试 Thinking 折叠/展开的完整交互流程。

### 测试用例（必须先写，确认 RED）
1. test_playwright_thinking_appears — 验证 ThinkingBlock 出现
2. test_playwright_thinking_collapsed — 验证默认折叠状态
3. test_playwright_thinking_click_expands — 验证点击展开
4. test_playwright_thinking_content_visible — 验证展开后内容可见
5. test_playwright_thinking_click_collapses — 验证再次点击折叠

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 Thinking 交互测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-219.test.ts
```

---

## 任务 220：Playwright Tool Use 卡片显示

**所属模块**：18-integration-test
**依赖**：任务 217
**预估耗时**：12 分钟

### 功能点要求
在 Playwright 测试中，发送会触发 tool use 的消息（如 "read the package.json file"）。等待 ToolUseBlock 出现。验证 ToolUseBlock 显示 tool name（粗体）和输入 JSON（折叠）。点击展开 input JSON，验证 JSON 内容可见。验证 ToolResultBlock 在 tool 执行完成后出现。

### 测试用例（必须先写，确认 RED）
1. test_playwright_tool_use_appears — 验证 ToolUseBlock 出现
2. test_playwright_tool_use_shows_name — 验证显示 tool name
3. test_playwright_tool_use_input_collapsed — 验证 input JSON 默认折叠
4. test_playwright_tool_use_input_expand — 验证点击展开 input JSON
5. test_playwright_tool_result_appears — 验证 ToolResultBlock 出现

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 Tool Use 测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-220.test.ts
```

---

## 任务 221：Playwright Workflow Tab Agent 树可见

**所属模块**：18-integration-test
**依赖**：任务 217
**预估耗时**：12 分钟

### 功能点要求
在 Playwright 测试中，先发送消息触发 agent 活动，然后切换到 Workflow Tab。验证 AgentTreeNode 组件可见，显示 "Main Agent" 或 agent ID。树形结构有层级缩进。如果有子 agent，验证父子关系正确显示。验证 DataFlowLine 连接线可见。

### 测试用例（必须先写，确认 RED）
1. test_playwright_workflow_tab_switches — 验证切换到 Workflow Tab
2. test_playwright_agent_tree_visible — 验证 Agent 树可见
3. test_playwright_main_agent_node — 验证 Main Agent 节点存在
4. test_playwright_tree_has_hierarchy — 验证树有层级结构
5. test_playwright_data_flow_lines — 验证连接线可见

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 Workflow Tab 测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-221.test.ts
```

---

## 任务 222：Playwright Signals Tab 过滤器可用

**所属模块**：18-integration-test
**依赖**：任务 217
**预估耗时**：12 分钟

### 功能点要求
在 Playwright 测试中，切换到 Signals Tab。验证 SignalFilter 过滤器可见，包含 11 种类型的 checkbox。所有 checkbox 默认选中。取消选中 "Tool Call" checkbox，验证 tool_call 类型的信号不再显示。重新选中，验证信号恢复显示。验证 SignalCard 显示事件 type 和 timestamp。

### 测试用例（必须先写，确认 RED）
1. test_playwright_signals_tab_switches — 验证切换到 Signals Tab
2. test_playwright_filter_visible — 验证过滤器可见
3. test_playwright_filter_all_checked — 验证所有 checkbox 默认选中
4. test_playwright_filter_uncheck_hides — 验证取消选中隐藏对应信号
5. test_playwright_signal_cards_visible — 验证 SignalCard 可见

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 Signals Tab 测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-222.test.ts
```

---

## 任务 223：Playwright 权限确认栏出现

**所属模块**：18-integration-test
**依赖**：任务 217
**预估耗时**：15 分钟

### 功能点要求
在 Playwright 测试中，发送会触发需要权限确认的 tool 操作的消息。等待 PermissionBar 出现在页面底部。验证 PermissionBar 显示 tool 名称和三个按钮（Allow/Deny/Allow Always）。点击 Allow 按钮，验证 PermissionBar 消失，操作继续执行。

### 测试用例（必须先写，确认 RED）
1. test_playwright_permission_bar_appears — 验证权限确认栏出现
2. test_playwright_permission_shows_tool_name — 验证显示 tool 名称
3. test_playwright_permission_has_allow_button — 验证有 Allow 按钮
4. test_playwright_permission_has_deny_button — 验证有 Deny 按钮
5. test_playwright_permission_allow_dismisses — 验证点击 Allow 后确认栏消失

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现权限确认测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-223.test.ts
```

---

## 任务 224：Playwright 30 秒超时自动 deny

**所属模块**：18-integration-test
**依赖**：任务 223
**预估耗时**：15 分钟

### 功能点要求
在 Playwright 测试中，触发权限确认后不点击任何按钮。等待 30 秒，验证 PermissionBar 自动消失（超时 deny）。验证倒计时数字从 30 递减到 0。验证操作被拒绝（tool 未执行）。验证倒计时剩余 10 秒时数字变红色。

### 测试用例（必须先写，确认 RED）
1. test_playwright_timeout_auto_deny — 验证 30 秒后自动 deny
2. test_playwright_countdown_visible — 验证倒计时数字可见
3. test_playwright_countdown_decrements — 验证倒计时递减
4. test_playwright_countdown_red_at_10 — 验证剩余 10 秒变红
5. test_playwright_timeout_dismisses_bar — 验证超时后确认栏消失

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现超时测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-224.test.ts
```

---

## 任务 225：CLI 发消息 Web 同步显示

**所属模块**：18-integration-test
**依赖**：任务 209, 214
**预估耗时**：15 分钟

### 功能点要求
同时运行 CLI 和 Web 两个客户端。在 CLI 中输入消息，验证 Web Chat Tab 实时显示该消息。消息内容一致，无延迟（< 2 秒）。Web 端的 StreamView 中出现对应的消息块。测试使用 WebSocket 事件同步机制。

### 测试用例（必须先写，确认 RED）
1. test_cli_to_web_message_sync — 验证 CLI 消息在 Web 端显示
2. test_cli_to_web_content_match — 验证消息内容一致
3. test_cli_to_web_latency — 验证同步延迟 < 2 秒
4. test_cli_to_web_stream_view — 验证消息在 StreamView 中可见
5. test_cli_to_web_event_received — 验证 Web 端收到 WebSocket 事件

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现双端同步测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-225.test.ts
```

---

## 任务 226：Web 发消息 CLI 同步显示

**所属模块**：18-integration-test
**依赖**：任务 209, 214
**预估耗时**：15 分钟

### 功能点要求
同时运行 CLI 和 Web 两个客户端。在 Web ChatInput 中输入消息并发送，验证 CLI 终端实时显示该消息及 assistant 回复。消息通过 WebSocket 从 Web 端发送到服务器，服务器转发给 CLI。CLI 端的消息显示与直接在 CLI 中输入效果一致。

### 测试用例（必须先写，确认 RED）
1. test_web_to_cli_message_sync — 验证 Web 消息在 CLI 端显示
2. test_web_to_cli_reply_sync — 验证 assistant 回复在 CLI 端显示
3. test_web_to_cli_content_match — 验证消息内容一致
4. test_web_to_cli_latency — 验证同步延迟 < 2 秒
5. test_web_to_cli_bidirectional — 验证双向通信正常

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现反向同步测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-226.test.ts
```

---

## 任务 227：Web 点 Allow CLI 确认框消失

**所属模块**：18-integration-test
**依赖**：任务 209, 214
**预估耗时**：15 分钟

### 功能点要求
同时运行 CLI 和 Web 两个客户端。触发需要权限确认的 tool 操作。在 Web 端点击 Allow 按钮，验证 CLI 端的权限确认提示自动消失。权限决定通过 WebSocket 从 Web 端发送到服务器，服务器同步到 CLI 端。验证 tool 操作在 Allow 后正常执行。

### 测试用例（必须先写，确认 RED）
1. test_web_allow_cli_sync — 验证 Web 点 Allow 后 CLI 确认框消失
2. test_permission_sync_event — 验证权限同步事件正确传递
3. test_tool_executes_after_allow — 验证 Allow 后 tool 正常执行
4. test_permission_bidirectional — 验证 CLI 点 Allow Web 也同步
5. test_deny_sync — 验证 Deny 决定也正确同步

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现权限同步测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-227.test.ts
```

---

## 任务 228：bunx tsc --noEmit 零错误

**所属模块**：18-integration-test
**依赖**：任务 203
**预估耗时**：15 分钟

### 功能点要求
在项目根目录运行 `bunx tsc --noEmit`，TypeScript 类型检查零错误。涵盖所有 `src/**/*.ts`、`src/**/*.tsx`、`web/src/**/*.ts`、`web/src/**/*.tsx` 文件。如果有已知的、不影响功能的类型错误，需记录在白名单中并说明原因。检查包括前端和后端所有代码。

### 测试用例（必须先写，确认 RED）
1. test_tsc_integration_exits_zero — 验证 tsc 退出码为 0
2. test_tsc_no_errors_in_src — 验证 src/ 目录无类型错误
3. test_tsc_no_errors_in_web — 验证 web/src/ 目录无类型错误
4. test_tsc_shim_files_clean — 验证 shim 文件无类型错误
5. test_tsc_config_valid — 验证 tsconfig.json 语法正确

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 修复所有类型错误 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-228.test.ts
```

---

## 任务 229：bun test 全绿

**所属模块**：18-integration-test
**依赖**：任务 203
**预估耗时**：15 分钟

### 功能点要求
在项目根目录运行 `bun test`，所有测试文件全部通过（0 failures）。测试涵盖所有模块的单元测试和集成测试。测试执行时间合理（< 5 分钟）。无跳过的测试（skip/todo 数量为 0）。测试覆盖率报告可选生成。

### 测试用例（必须先写，确认 RED）
1. test_all_tests_pass — 验证 bun test 退出码为 0
2. test_no_failures — 验证输出中 failures 为 0
3. test_no_skipped — 验证无跳过的测试
4. test_execution_time — 验证总执行时间 < 5 分钟
5. test_all_test_files_found — 验证所有测试文件被发现并执行

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 修复所有失败测试 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-229.test.ts
```

---

## 任务 230：check_progress.ts 返回 all tasks done

**所属模块**：18-integration-test
**依赖**：全部任务
**预估耗时**：10 分钟

### 功能点要求
运行 `bun run check_progress.ts`，脚本读取 `progress.json`，验证所有 230 个任务状态为 `done`。输出 "All 230 tasks done!" 并以 exit code 0 退出。如果有未完成任务，输出未完成任务列表并以非零 exit code 退出。脚本使用 TypeScript 编写，使用 `bun run` 执行。

### 测试用例（必须先写，确认 RED）
1. test_check_progress_exits_zero — 验证全部完成时退出码为 0
2. test_check_progress_all_done_message — 验证输出包含 "all tasks done"
3. test_check_progress_reads_progress_json — 验证读取 progress.json
4. test_check_progress_task_count — 验证任务总数为 230
5. test_check_progress_fails_on_pending — 验证有 pending 任务时退出码非零

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 check_progress.ts → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/18-task-230.test.ts
```
