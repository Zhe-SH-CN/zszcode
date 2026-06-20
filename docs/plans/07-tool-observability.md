# 07 — 工具执行可观测性 TDD 任务计划

模块：07-tool-observability
依赖模块：03-event-bus（任务 32-46）

---

## 任务 88：tool_call_start 在 tool.call() 前发出

**所属模块**：07-tool-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `toolExecution.ts` 的 `runToolUse()` 函数中，调用 `tool.call()` 之前，通过 `eventBus.emit()` 发出 `tool_call_start` 事件。事件必须包含 `toolName`、`toolUseId`、`input`、`agentId` 和 `timestamp` 字段。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_start_emitted_before_call — 验证 mock tool.call() 被调用前，eventBus 已收到 tool_call_start 事件
2. test_tool_call_start_contains_required_fields — 验证事件包含 toolName、toolUseId、input、agentId、timestamp 全部字段
3. test_tool_call_start_agent_id_defaults_to_main — 验证 agentId 缺失时默认为 'main'
4. test_tool_call_start_timestamp_is_number — 验证 timestamp 是有效的数字类型
5. test_tool_call_start_with_empty_input — 验证 input 为空对象时事件正常发出

### TDD 流程
1. 写上述全部测试 → `bun test tool-call-start` 确认 **RED**
2. 在 `toolExecution.ts` 中 tool.call() 前插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-call-start`，确认 5 个测试全部绿色。检查 eventBus 历史中第一条事件为 tool_call_start。

---

## 任务 89：tool_call_start 包含完整元数据

**所属模块**：07-tool-observability
**依赖**：任务 88
**预估耗时**：8 分钟

### 功能点要求
`tool_call_start` 事件的各字段值必须准确反映实际调用上下文：`toolName` 来自 `tool.name`，`toolUseId` 来自 `toolUseID`，`input` 来自处理后的 `callInput`，`agentId` 来自 `toolUseContext.options.agentId`。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_start_tool_name_matches — 验证 toolName 与实际 tool.name 一致
2. test_tool_call_start_tool_use_id_matches — 验证 toolUseId 与实际 toolUseID 一致
3. test_tool_call_start_input_is_processed — 验证 input 是处理后的 callInput 而非原始 input
4. test_tool_call_start_agent_id_from_context — 验证 agentId 从 toolUseContext.options.agentId 获取
5. test_tool_call_start_with_special_chars_in_name — 验证 toolName 含特殊字符时事件正常

### TDD 流程
1. 写上述全部测试 → `bun test tool-call-start-meta` 确认 **RED**
2. 确保事件字段映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-call-start-meta`，确认 5 个测试全部绿色。对比事件字段值与 mock 上下文值一致。

---

## 任务 90：tool_call_end 在 tool.call() 后发出

**所属模块**：07-tool-observability
**依赖**：任务 88
**预估耗时**：10 分钟

### 功能点要求
在 `tool.call()` 执行完毕后，通过 `eventBus.emit()` 发出 `tool_call_end` 事件。无论成功或失败都必须发出。事件包含 `toolName`、`toolUseId`、`success`、`duration`、`output` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_end_emitted_after_call — 验证 tool.call() 完成后 eventBus 收到 tool_call_end 事件
2. test_tool_call_end_contains_required_fields — 验证事件包含 toolName、toolUseId、success、duration、timestamp
3. test_tool_call_end_emitted_on_error — 验证 tool.call() 抛异常时仍发出 tool_call_end
4. test_tool_call_end_has_output_data — 验证 output 字段包含 tool.call() 的返回数据
5. test_tool_call_end_order_after_start — 验证 tool_call_end 在 tool_call_start 之后发出

### TDD 流程
1. 写上述全部测试 → `bun test tool-call-end` 确认 **RED**
2. 在 tool.call() 后插入 eventBus.emit()，用 try/finally 确保异常时也发出 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-call-end`，确认 5 个测试全部绿色。

---

## 任务 91：tool_call_end 成功时 success=true

**所属模块**：07-tool-observability
**依赖**：任务 90
**预估耗时**：8 分钟

### 功能点要求
当 `tool.call()` 正常返回（无异常）时，`tool_call_end` 事件的 `success` 字段必须为 `true`。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_end_success_true_on_normal_return — 验证正常返回时 success 为 true
2. test_tool_call_end_success_true_with_result — 验证返回结果对象时 success 为 true
3. test_tool_call_end_success_true_empty_result — 验证返回空结果时 success 仍为 true
4. test_tool_call_end_success_type_is_boolean — 验证 success 字段类型为 boolean
5. test_tool_call_end_success_true_reflects_no_exception — 验证未抛异常时 success 不为 false

### TDD 流程
1. 写上述全部测试 → `bun test tool-call-end-success` 确认 **RED**
2. 在正常路径设置 success: true → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-call-end-success`，确认 5 个测试全部绿色。

---

## 任务 92：tool_call_end 失败时 success=false

**所属模块**：07-tool-observability
**依赖**：任务 90
**预估耗时**：8 分钟

### 功能点要求
当 `tool.call()` 抛出异常时，`tool_call_end` 事件的 `success` 字段必须为 `false`。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_end_success_false_on_exception — 验证抛异常时 success 为 false
2. test_tool_call_end_success_false_on_timeout — 验证超时异常时 success 为 false
3. test_tool_call_end_emitted_despite_error — 验证异常后事件仍被发出（不被吞掉）
4. test_tool_call_end_error_no_output — 验证异常时 output 为 undefined 或错误信息
5. test_tool_call_end_success_false_on_rejection — 验证 Promise rejection 时 success 为 false

### TDD 流程
1. 写上述全部测试 → `bun test tool-call-end-fail` 确认 **RED**
2. 在 catch/finally 路径设置 success: false → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-call-end-fail`，确认 5 个测试全部绿色。

---

## 任务 93：tool_call_end 包含正确 duration

**所属模块**：07-tool-observability
**依赖**：任务 90
**预估耗时**：8 分钟

### 功能点要求
`tool_call_end` 事件的 `duration` 字段为 `Date.now() - startTime`，单位毫秒，必须大于等于 0。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_end_duration_is_positive — 验证 duration >= 0
2. test_tool_call_end_duration_is_milliseconds — 验证 duration 单位为毫秒（用 mock 时间差验证）
3. test_tool_call_end_duration_approximate — 验证 duration 近似等于实际执行时间
4. test_tool_call_end_duration_zero_for_instant — 验证瞬时完成时 duration 为 0
5. test_tool_call_end_duration_type_is_number — 验证 duration 类型为 number

### TDD 流程
1. 写上述全部测试 → `bun test tool-call-end-duration` 确认 **RED**
2. 计算 `Date.now() - startTime` 并赋值给 duration → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-call-end-duration`，确认 5 个测试全部绿色。

---

## 任务 94：tool_call_end 包含 output 数据

**所属模块**：07-tool-observability
**依赖**：任务 90
**预估耗时**：8 分钟

### 功能点要求
`tool_call_end` 事件的 `output` 字段包含 `tool.call()` 的返回结果数据。成功时为结果对象，失败时为 undefined 或错误摘要。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_end_output_contains_result — 验证 output 包含 tool.call() 返回值
2. test_tool_call_end_output_undefined_on_error — 验证异常时 output 为 undefined
3. test_tool_call_end_output_serializable — 验证 output 可 JSON 序列化（无循环引用）
4. test_tool_call_end_output_matches_call_return — 验证 output 与 tool.call() 返回值严格相等
5. test_tool_call_end_output_null_handled — 验证 tool.call() 返回 null 时 output 为 null

### TDD 流程
1. 写上述全部测试 → `bun test tool-call-end-output` 确认 **RED**
2. 将 tool.call() 结果赋值给 output 字段 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-call-end-output`，确认 5 个测试全部绿色。

---

## 任务 95：tool_permission_request 在权限检查时发出

**所属模块**：07-tool-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `toolExecution.ts` 的权限检查处（约 line 921），调用权限检查逻辑前，通过 `eventBus.emit()` 发出 `tool_permission_request` 事件。事件包含 `toolName`、`toolUseId`、`input` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_tool_permission_request_emitted — 验证权限检查时 eventBus 收到 tool_permission_request 事件
2. test_tool_permission_request_contains_tool_name — 验证事件包含正确的 toolName
3. test_tool_permission_request_contains_tool_use_id — 验证事件包含正确的 toolUseId
4. test_tool_permission_request_contains_input — 验证事件包含处理后的 input
5. test_tool_permission_request_not_emitted_when_no_permission_check — 验证无需权限检查时不发出事件

### TDD 流程
1. 写上述全部测试 → `bun test tool-permission-request` 确认 **RED**
2. 在权限检查处插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-permission-request`，确认 5 个测试全部绿色。

---

## 任务 96：tool_permission_request 包含完整上下文

**所属模块**：07-tool-observability
**依赖**：任务 95
**预估耗时**：8 分钟

### 功能点要求
`tool_permission_request` 事件的 `toolName` 来自 `tool.name`，`toolUseId` 来自 `toolUseID`，`input` 来自 `processedInput`（处理后的输入），各字段值必须准确。

### 测试用例（必须先写，确认 RED）
1. test_permission_request_tool_name_from_tool — 验证 toolName 取自 tool.name
2. test_permission_request_tool_use_id_from_context — 验证 toolUseId 取自当前 toolUseID
3. test_permission_request_input_is_processed — 验证 input 是 processedInput 而非原始 input
4. test_permission_request_timestamp_is_current — 验证 timestamp 在权限检查时刻附近
5. test_permission_request_with_complex_input — 验证 input 为复杂对象时事件正常

### TDD 流程
1. 写上述全部测试 → `bun test tool-permission-request-meta` 确认 **RED**
2. 确保字段映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test tool-permission-request-meta`，确认 5 个测试全部绿色。

---

## 任务 97：hook_fire 在 runPreToolUseHooks 时发出

**所属模块**：07-tool-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `toolExecution.ts` 的 `runPreToolUseHooks()` 执行时，通过 `eventBus.emit()` 发出 `hook_fire` 事件。事件的 `hookType` 为 `'pre_tool_use'`，`details` 包含 tool 相关上下文。

### 测试用例（必须先写，确认 RED）
1. test_hook_fire_pre_tool_use_emitted — 验证 runPreToolUseHooks 执行时发出 hook_fire 事件
2. test_hook_fire_pre_tool_use_hook_type — 验证 hookType 为 'pre_tool_use'
3. test_hook_fire_pre_tool_use_details — 验证 details 包含 toolName 和 toolUseId
4. test_hook_fire_pre_tool_use_timestamp — 验证 timestamp 为有效数字
5. test_hook_fire_pre_tool_use_no_hooks_registered — 验证无 hook 注册时仍发出事件

### TDD 流程
1. 写上述全部测试 → `bun test hook-fire-pre` 确认 **RED**
2. 在 runPreToolUseHooks 中插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test hook-fire-pre`，确认 5 个测试全部绿色。

---

## 任务 98：hook_fire 在 runPostToolUseHooks 时发出

**所属模块**：07-tool-observability
**依赖**：任务 97
**预估耗时**：8 分钟

### 功能点要求
在 `toolExecution.ts` 的 `runPostToolUseHooks()` 执行时，通过 `eventBus.emit()` 发出 `hook_fire` 事件。事件的 `hookType` 为 `'post_tool_use'`，`details` 包含 tool 结果上下文。

### 测试用例（必须先写，确认 RED）
1. test_hook_fire_post_tool_use_emitted — 验证 runPostToolUseHooks 执行时发出 hook_fire 事件
2. test_hook_fire_post_tool_use_hook_type — 验证 hookType 为 'post_tool_use'
3. test_hook_fire_post_tool_use_details — 验证 details 包含 toolName 和 result
4. test_hook_fire_post_tool_use_after_execution — 验证事件在 tool 执行之后发出
5. test_hook_fire_post_tool_use_on_error — 验证 tool 执行失败时仍发出 post hook_fire

### TDD 流程
1. 写上述全部测试 → `bun test hook-fire-post` 确认 **RED**
2. 在 runPostToolUseHooks 中插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test hook-fire-post`，确认 5 个测试全部绿色。

---

## 任务 99：StreamingToolExecutor.addTool() emit tool_call_start

**所属模块**：07-tool-observability
**依赖**：任务 88
**预估耗时**：10 分钟

### 功能点要求
在 `StreamingToolExecutor.ts` 的 `addTool()` 方法中，工具注册时通过 `eventBus.emit()` 发出 `tool_call_start` 事件。`agentId` 固定为 `'streaming'`，`toolUseId` 来自 `block.id`。

### 测试用例（必须先写，确认 RED）
1. test_streaming_add_tool_emits_start — 验证 addTool() 调用时发出 tool_call_start 事件
2. test_streaming_add_tool_agent_id_streaming — 验证 agentId 为 'streaming'
3. test_streaming_add_tool_use_id_from_block — 验证 toolUseId 来自 block.id
4. test_streaming_add_tool_name_from_def — 验证 toolName 来自 toolDef.name
5. test_streaming_add_tool_input_parsed — 验证 input 为解析后的 parsedInput

### TDD 流程
1. 写上述全部测试 → `bun test streaming-add-tool` 确认 **RED**
2. 在 StreamingToolExecutor.addTool() 中插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test streaming-add-tool`，确认 5 个测试全部绿色。

---

## 任务 100：StreamingToolExecutor.executeTool() emit tool_call_end

**所属模块**：07-tool-observability
**依赖**：任务 90
**预估耗时**：10 分钟

### 功能点要求
在 `StreamingToolExecutor.ts` 的 `executeTool()` 方法中，工具执行完毕后通过 `eventBus.emit()` 发出 `tool_call_end` 事件。包含 `success`、`duration`、`output` 等字段。

### 测试用例（必须先写，确认 RED）
1. test_streaming_execute_tool_emits_end — 验证 executeTool() 完成后发出 tool_call_end 事件
2. test_streaming_execute_tool_success_true — 验证正常执行时 success 为 true
3. test_streaming_execute_tool_success_false_on_error — 验证执行失败时 success 为 false
4. test_streaming_execute_tool_duration — 验证 duration 为有效毫秒数
5. test_streaming_execute_tool_output — 验证 output 包含执行结果

### TDD 流程
1. 写上述全部测试 → `bun test streaming-execute-tool` 确认 **RED**
2. 在 StreamingToolExecutor.executeTool() 中插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test streaming-execute-tool`，确认 5 个测试全部绿色。

---

## 任务 101：runTools() 入口 emit 批次信息

**所属模块**：07-tool-observability
**依赖**：任务 34
**预估耗时**：8 分钟

### 功能点要求
在 `toolOrchestration.ts` 的 `runTools()` 入口处，通过 `eventBus.emit()` 发出 `hook_fire` 事件，`hookType` 为 `'run_tools_batch'`，`details` 包含执行模式（并发/串行）和工具数量。

### 测试用例（必须先写，确认 RED）
1. test_run_tools_batch_emitted — 验证 runTools() 入口发出批次事件
2. test_run_tools_batch_contains_count — 验证 details 包含工具数量
3. test_run_tools_batch_contains_mode — 验证 details 包含执行模式（parallel/sequential）
4. test_run_tools_batch_empty_tools — 验证工具列表为空时事件正常发出
5. test_run_tools_batch_hook_type — 验证 hookType 为 'run_tools_batch'

### TDD 流程
1. 写上述全部测试 → `bun test run-tools-batch` 确认 **RED**
2. 在 toolOrchestration.ts runTools() 入口插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test run-tools-batch`，确认 5 个测试全部绿色。
