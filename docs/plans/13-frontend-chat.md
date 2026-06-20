# 13 — 前端 Chat Tab TDD 任务计划

**模块职责**：浅层对话体验，渲染消息流（thinking, text, tool use, tool result, system, result）。

**新增文件**：
- `web/src/components/StreamView.tsx`
- `web/src/components/MessageBlock.tsx`
- `web/src/components/ThinkingBlock.tsx`
- `web/src/components/TextBlock.tsx`
- `web/src/components/ToolUseBlock.tsx`
- `web/src/components/ToolResultBlock.tsx`
- `web/src/components/ResultBlock.tsx`
- `web/src/components/SystemBlock.tsx`
- `web/src/components/ChatInput.tsx`

---

## 任务 164：StreamView 主消息流容器组件

**所属模块**：13-frontend-chat
**依赖**：任务 147
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/StreamView.tsx`，接收 `messages` 数组 prop（每条消息含 type 和 data），渲染消息列表。容器使用 `overflow-y: auto` 实现滚动，新消息到达时自动滚动到底部。使用 `data-testid="stream-view"` 标识。消息列表从上到下按时间顺序排列。空消息时显示 "No messages yet" 占位文字。

### 测试用例（必须先写，确认 RED）
1. test_stream_view_renders_messages — 验证渲染消息列表
2. test_stream_view_auto_scroll — 验证新消息到达后自动滚动到底部
3. test_stream_view_empty_placeholder — 验证无消息时显示占位文字
4. test_stream_view_has_testid — 验证有 data-testid="stream-view"
5. test_stream_view_scroll_container — 验证容器有 overflow-y: auto

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 StreamView 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-164.test.ts
```

---

## 任务 165：MessageBlock 根据 type 分发到对应 Block 组件

**所属模块**：13-frontend-chat
**依赖**：任务 164
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/MessageBlock.tsx`，接收单条消息 prop，根据 `message.type` 分发到对应子组件：`thinking` -> ThinkingBlock、`text` -> TextBlock、`tool_use` -> ToolUseBlock、`tool_result` -> ToolResultBlock、`result` -> ResultBlock、`system` -> SystemBlock。未知类型显示原始 JSON（灰色小字）。每种类型使用对应的 `data-testid`。

### 测试用例（必须先写，确认 RED）
1. test_message_block_thinking — 验证 type=thinking 渲染 ThinkingBlock
2. test_message_block_text — 验证 type=text 渲染 TextBlock
3. test_message_block_tool_use — 验证 type=tool_use 渲染 ToolUseBlock
4. test_message_block_tool_result — 验证 type=tool_result 渲染 ToolResultBlock
5. test_message_block_unknown_type — 验证未知 type 显示原始 JSON

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 MessageBlock 分发逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-165.test.ts
```

---

## 任务 166：ThinkingBlock 默认折叠显示

**所属模块**：13-frontend-chat
**依赖**：任务 165
**预估耗时**：10 分钟

### 功能点要求
创建 `web/src/components/ThinkingBlock.tsx`，接收 `{ content }` prop。默认折叠状态：显示灰色背景区域，标题 "Thinking..." 后跟内容前 100 个字符加 "..."。折叠时高度固定，overflow hidden。使用 `data-testid="thinking-block"` 标识。深色灰色背景（bg-gray-800），圆角边框。

### 测试用例（必须先写，确认 RED）
1. test_thinking_block_renders — 验证组件渲染不报错
2. test_thinking_block_collapsed_by_default — 验证默认折叠状态
3. test_thinking_block_shows_preview — 验证显示前 100 字符预览
4. test_thinking_block_has_testid — 验证有 data-testid="thinking-block"
5. test_thinking_block_gray_background — 验证灰色背景样式

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 ThinkingBlock 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-166.test.ts
```

---

## 任务 167：ThinkingBlock 点击展开显示完整内容

**所属模块**：13-frontend-chat
**依赖**：任务 166
**预估耗时**：10 分钟

### 功能点要求
ThinkingBlock 点击标题区域切换展开/折叠。展开时显示完整内容，高度自适应。标题文字从 "Thinking..." 变为 "Thinking (click to collapse)"。展开/折叠有 CSS transition 动画（max-height 过渡）。展开状态使用 `data-testid="thinking-block-expanded"` 区分。

### 测试用例（必须先写，确认 RED）
1. test_thinking_block_click_expands — 验证点击后展开显示完整内容
2. test_thinking_block_click_collapses — 验证再次点击折叠
3. test_thinking_block_expanded_full_content — 验证展开后显示完整文本
4. test_thinking_block_title_changes — 验证展开时标题文字变化
5. test_thinking_block_transition — 验证有 CSS transition 动画

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现展开/折叠交互 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-167.test.ts
```

---

## 任务 168：TextBlock 使用 react-markdown 渲染

**所属模块**：13-frontend-chat
**依赖**：任务 165
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/TextBlock.tsx`，接收 `{ content }` prop，使用 `react-markdown` 渲染 Markdown 内容。支持标题（h1-h6）、段落、列表（有序/无序）、粗体/斜体、链接（在新标签页打开）、行内代码。使用 `data-testid="text-block"` 标识。纯文本消息也正常渲染为段落。

### 测试用例（必须先写，确认 RED）
1. test_text_block_renders_plain_text — 验证纯文本渲染为段落
2. test_text_block_renders_markdown_heading — 验证 Markdown 标题渲染
3. test_text_block_renders_markdown_list — 验证 Markdown 列表渲染
4. test_text_block_renders_markdown_bold — 验证粗体文本渲染
5. test_text_block_renders_markdown_link — 验证链接渲染且在新标签页打开

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 TextBlock 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-168.test.ts
```

---

## 任务 169：TextBlock 代码块语法高亮（深色主题）

**所属模块**：13-frontend-chat
**依赖**：任务 168
**预估耗时**：12 分钟

### 功能点要求
TextBlock 中的代码块使用 `react-syntax-highlighter` 渲染，采用深色主题（如 `oneDark` 或 `vs2015`）。支持指定语言（如 ```python, ```typescript）。行内代码使用灰色背景（`bg-gray-700`）和等宽字体。代码块右上角显示语言标签。长代码块可水平滚动（`overflow-x: auto`）。

### 测试用例（必须先写，确认 RED）
1. test_text_block_code_block_highlight — 验证代码块有语法高亮
2. test_text_block_code_block_language — 验证指定语言时正确高亮
3. test_text_block_inline_code — 验证行内代码有灰色背景
4. test_text_block_code_dark_theme — 验证代码块使用深色主题
5. test_text_block_code_horizontal_scroll — 验证长代码块可水平滚动

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 配置语法高亮 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-169.test.ts
```

---

## 任务 170：ToolUseBlock 卡片展示 tool name 粗体

**所属模块**：13-frontend-chat
**依赖**：任务 165
**预估耗时**：10 分钟

### 功能点要求
创建 `web/src/components/ToolUseBlock.tsx`，接收 `{ toolName, toolUseId, input }` prop。卡片样式渲染：左侧蓝色边框（border-l-4 border-blue-500）、tool name 粗体显示（font-bold）、灰色背景（bg-gray-800）、圆角。使用 `data-testid="tool-use-block"` 标识。卡片内 tool name 和 input 分两行显示。

### 测试用例（必须先写，确认 RED）
1. test_tool_use_block_renders — 验证组件渲染不报错
2. test_tool_use_block_shows_tool_name — 验证显示 tool name
3. test_tool_use_block_tool_name_bold — 验证 tool name 使用粗体样式
4. test_tool_use_block_blue_left_border — 验证左侧蓝色边框
5. test_tool_use_block_has_testid — 验证有 data-testid="tool-use-block"

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 ToolUseBlock 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-170.test.ts
```

---

## 任务 171：ToolUseBlock input JSON 可折叠

**所属模块**：13-frontend-chat
**依赖**：任务 170
**预估耗时**：10 分钟

### 功能点要求
ToolUseBlock 中的 input JSON 默认折叠，显示 "Show input ▶" 按钮。点击展开显示格式化 JSON（`JSON.stringify(input, null, 2)`），按钮变为 "Hide input ▼"。JSON 使用等宽字体和语法高亮（浅色标记 key/value）。长 JSON 可垂直滚动（max-height: 300px, overflow-y: auto）。

### 测试用例（必须先写，确认 RED）
1. test_tool_use_input_collapsed_by_default — 验证 input 默认折叠
2. test_tool_use_input_show_button — 验证有 "Show input" 按钮
3. test_tool_use_input_click_expands — 验证点击展开显示 JSON
4. test_tool_use_input_formatted_json — 验证展开后显示格式化 JSON
5. test_tool_use_input_click_collapses — 验证再次点击折叠

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 input 折叠逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-171.test.ts
```

---

## 任务 172：ToolResultBlock 默认折叠最多 10 行预览

**所属模块**：13-frontend-chat
**依赖**：任务 165
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/ToolResultBlock.tsx`，接收 `{ content, success }` prop。默认折叠状态：最多显示 10 行内容预览，超出部分截断并显示 "... (N more lines)"。使用 `data-testid="tool-result-block"` 标识。等宽字体显示内容。预览区域灰色背景。

### 测试用例（必须先写，确认 RED）
1. test_tool_result_block_renders — 验证组件渲染不报错
2. test_tool_result_block_collapsed_by_default — 验证默认折叠
3. test_tool_result_block_max_10_lines — 验证最多显示 10 行
4. test_tool_result_block_shows_more_count — 验证超出时显示 "... (N more lines)"
5. test_tool_result_block_short_content_no_truncation — 验证短内容不截断

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 ToolResultBlock 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-172.test.ts
```

---

## 任务 173：ToolResultBlock 成功时绿色边框

**所属模块**：13-frontend-chat
**依赖**：任务 172
**预估耗时**：8 分钟

### 功能点要求
当 `success` 为 `true` 时，ToolResultBlock 卡片左边框为绿色（border-l-4 border-green-500）。标题区域显示绿色勾号图标和 "Success" 文字。背景略微偏绿（bg-green-900/10，即 10% 透明度的绿色叠加）。

### 测试用例（必须先写，确认 RED）
1. test_tool_result_success_green_border — 验证成功时绿色左边框
2. test_tool_result_success_check_icon — 验证显示绿色勾号
3. test_tool_result_success_text — 验证显示 "Success" 文字
4. test_tool_result_success_bg — 验证背景有绿色叠加
5. test_tool_result_success_testid — 验证有 data-testid 包含 "success"

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现成功状态样式 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-173.test.ts
```

---

## 任务 174：ToolResultBlock 失败时红色边框

**所属模块**：13-frontend-chat
**依赖**：任务 172
**预估耗时**：8 分钟

### 功能点要求
当 `success` 为 `false` 时，ToolResultBlock 卡片左边框为红色（border-l-4 border-red-500）。标题区域显示红色叉号图标和 "Failed" 文字。背景略微偏红（bg-red-900/10）。错误内容默认展开（不折叠），方便查看错误信息。

### 测试用例（必须先写，确认 RED）
1. test_tool_result_failed_red_border — 验证失败时红色左边框
2. test_tool_result_failed_x_icon — 验证显示红色叉号
3. test_tool_result_failed_text — 验证显示 "Failed" 文字
4. test_tool_result_failed_expanded — 验证失败时默认展开
5. test_tool_result_failed_bg — 验证背景有红色叠加

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现失败状态样式 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-174.test.ts
```

---

## 任务 175：ToolResultBlock 点击展开全文

**所属模块**：13-frontend-chat
**依赖**：任务 172
**预估耗时**：10 分钟

### 功能点要求
ToolResultBlock 折叠状态下点击 "Show more" 按钮展开全文。展开后按钮变为 "Show less"。展开时显示完整内容，无行数限制。展开/折叠使用 CSS transition 动画。长内容展开后可垂直滚动（max-height: 500px）。

### 测试用例（必须先写，确认 RED）
1. test_tool_result_show_more_button — 验证有 "Show more" 按钮
2. test_tool_result_click_expands — 验证点击展开显示完整内容
3. test_tool_result_show_less_button — 验证展开后有 "Show less" 按钮
4. test_tool_result_click_collapses — 验证点击 "Show less" 折叠
5. test_tool_result_transition_animation — 验证展开/折叠有动画

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现展开/折叠交互 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-175.test.ts
```

---

## 任务 176：ResultBlock 显示 duration/tokens/cost/stop_reason

**所属模块**：13-frontend-chat
**依赖**：任务 165
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/ResultBlock.tsx`，接收 `{ duration, inputTokens, outputTokens, cost, stopReason }` prop。底部统计卡片显示：Duration（如 "2.3s"）、Tokens（如 "1.2k in / 500 out"）、Cost（如 "$0.05"）、Stop Reason（如 "end_turn"）。使用 `data-testid="result-block"` 标识。灰色背景，横排布局，各项之间用竖线分隔。

### 测试用例（必须先写，确认 RED）
1. test_result_block_renders — 验证组件渲染不报错
2. test_result_block_shows_duration — 验证显示 duration
3. test_result_block_shows_tokens — 验证显示 input/output tokens
4. test_result_block_shows_cost — 验证显示美元格式 cost
5. test_result_block_shows_stop_reason — 验证显示 stop_reason

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 ResultBlock 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-176.test.ts
```

---

## 任务 177：SystemBlock 顶部通知条样式

**所属模块**：13-frontend-chat
**依赖**：任务 165
**预估耗时**：8 分钟

### 功能点要求
创建 `web/src/components/SystemBlock.tsx`，接收 `{ content, level }` prop。`level` 可选 `'info' | 'warning' | 'error'`，默认 `'info'`。通知条样式：info 为蓝色左边框，warning 为黄色，error 为红色。图标：info 为 ℹ️，warning 为 ⚠️，error 为 ❌。使用 `data-testid="system-block"` 标识。内容为等宽字体。

### 测试用例（必须先写，确认 RED）
1. test_system_block_renders — 验证组件渲染不报错
2. test_system_block_info_blue — 验证 info 级别蓝色左边框
3. test_system_block_warning_yellow — 验证 warning 级别黄色左边框
4. test_system_block_error_red — 验证 error 级别红色左边框
5. test_system_block_default_info — 验证未指定 level 默认为 info

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 SystemBlock 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-177.test.ts
```

---

## 任务 178：ChatInput 底部输入框

**所属模块**：13-frontend-chat
**依赖**：任务 164
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/ChatInput.tsx`，底部固定输入框。包含 `<textarea>`（自动增高，最小 1 行，最大 10 行）和 "Send" 按钮。textarea 支持 Enter 发送（Shift+Enter 换行）。使用 `data-testid="chat-input"` 标识 textarea，`data-testid="send-button"` 标识按钮。空内容时 Send 按钮禁用。深色主题样式（bg-gray-800）。

### 测试用例（必须先写，确认 RED）
1. test_chat_input_renders — 验证输入框渲染
2. test_chat_input_has_textarea — 验证有 textarea 元素
3. test_chat_input_has_send_button — 验证有 Send 按钮
4. test_chat_input_send_disabled_when_empty — 验证空内容时按钮禁用
5. test_chat_input_send_enabled_with_text — 验证有内容时按钮可用

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 ChatInput 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-178.test.ts
```

---

## 任务 179：ChatInput 发送消息通过 WebSocket

**所属模块**：13-frontend-chat
**依赖**：任务 178, 150
**预估耗时**：10 分钟

### 功能点要求
ChatInput 发送消息时，通过 WebSocket 发送 `{ type: 'send', sessionId, content }` JSON 消息。发送后清空 textarea 内容。发送时调用 `onSend(content)` 回调，由父组件通过 useWebSocket hook 的 sendMessage 转发。Enter 键触发发送（Shift+Enter 不触发）。

### 测试用例（必须先写，确认 RED）
1. test_chat_input_send_calls_on_send — 验证发送时调用 onSend 回调
2. test_chat_input_send_passes_content — 验证 onSend 接收正确内容
3. test_chat_input_send_clears_textarea — 验证发送后 textarea 清空
4. test_chat_input_enter_sends — 验证 Enter 键触发发送
5. test_chat_input_shift_enter_no_send — 验证 Shift+Enter 不触发发送

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现发送逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-179.test.ts
```

---

## 任务 180：ChatInput 发送后禁用等待 result

**所属模块**：13-frontend-chat
**依赖**：任务 179
**预估耗时**：10 分钟

### 功能点要求
ChatInput 发送消息后，textarea 和 Send 按钮立即禁用，显示 "Thinking..." 提示文字。收到 `result` 类型的 WebSocket 事件后重新启用输入框。禁用期间 textarea 不可编辑，按钮不可点击。使用 `disabled` prop 控制状态。

### 测试用例（必须先写，确认 RED）
1. test_chat_input_disabled_after_send — 验证发送后输入框禁用
2. test_chat_input_shows_thinking — 验证禁用时显示 "Thinking..."
3. test_chat_input_enabled_on_result — 验证收到 result 后重新启用
4. test_chat_input_no_send_when_disabled — 验证禁用时无法发送
5. test_chat_input_textarea_not_editable — 验证禁用时 textarea 不可编辑

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现禁用/启用逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-180.test.ts
```

---

## 任务 181：ChatInput agent 处理中可排队输入

**所属模块**：13-frontend-chat
**依赖**：任务 178
**预估耗时**：12 分钟

### 功能点要求
当 agent 正在处理时（已发送消息但未收到 result），ChatInput 允许用户继续输入新消息（textarea 可编辑），但不立即发送。新输入的内容排入队列，当前对话结束后自动发送队列中的第一条消息。显示队列中待发送消息数量（如 "1 queued"）。队列最多保存 5 条消息。

### 测试用例（必须先写，确认 RED）
1. test_chat_input_queue_allows_typing — 验证 agent 处理中可继续输入
2. test_chat_input_queue_shows_count — 验证显示排队消息数量
3. test_chat_input_queue_auto_sends — 验证当前对话结束后自动发送队列消息
4. test_chat_input_queue_max_5 — 验证队列最多 5 条
5. test_chat_input_queue_fifo — 验证队列按 FIFO 顺序发送

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现消息排队逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/13-task-181.test.ts
```
