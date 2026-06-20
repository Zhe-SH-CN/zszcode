# 08 — Agent 生命周期可观测性 TDD 任务计划

模块：08-agent-observability
依赖模块：03-event-bus（任务 32-46）

---

## 任务 102：agent_spawn 在 runAgent() 入口发出

**所属模块**：08-agent-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `runAgent.ts` 的 `runAgent()` 函数入口处，通过 `eventBus.emit()` 发出 `agent_spawn` 事件。事件必须包含 `parentId`、`childId`、`agentType`、`description` 和 `timestamp` 字段。

### 测试用例（必须先写，确认 RED）
1. test_agent_spawn_emitted_at_entry — 验证 runAgent() 调用时 eventBus 收到 agent_spawn 事件
2. test_agent_spawn_contains_required_fields — 验证事件包含 parentId、childId、agentType、description、timestamp
3. test_agent_spawn_parent_id_from_context — 验证 parentId 来自 toolUseContext.toolUseId，缺失时为 'root'
4. test_agent_spawn_child_id_generated — 验证 childId 由 createAgentId() 生成或来自 override
5. test_agent_spawn_timestamp_is_number — 验证 timestamp 为有效数字类型

### TDD 流程
1. 写上述全部测试 → `bun test agent-spawn` 确认 **RED**
2. 在 runAgent() 入口插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test agent-spawn`，确认 5 个测试全部绿色。检查 eventBus 历史中第一条事件为 agent_spawn。

---

## 任务 103：agent_spawn 包含 parentId 和 childId

**所属模块**：08-agent-observability
**依赖**：任务 102
**预估耗时**：8 分钟

### 功能点要求
`agent_spawn` 事件的 `parentId` 来自 `toolUseContext.toolUseId ?? 'root'`，`childId` 来自 `override?.agentId ?? createAgentId()`。两个 ID 必须非空且不相等（除非是根 agent）。

### 测试用例（必须先写，确认 RED）
1. test_agent_spawn_parent_id_from_tool_use — 验证 parentId 与 toolUseContext.toolUseId 一致
2. test_agent_spawn_parent_id_root_default — 验证 toolUseId 缺失时 parentId 为 'root'
3. test_agent_spawn_child_id_from_override — 验证 override.agentId 存在时使用该值
4. test_agent_spawn_child_id_generated_when_no_override — 验证无 override 时 childId 由 createAgentId() 生成
5. test_agent_spawn_ids_are_strings — 验证 parentId 和 childId 类型为 string

### TDD 流程
1. 写上述全部测试 → `bun test agent-spawn-ids` 确认 **RED**
2. 确保 ID 映射逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test agent-spawn-ids`，确认 5 个测试全部绿色。

---

## 任务 104：agent_spawn 包含 agentType 和 description

**所属模块**：08-agent-observability
**依赖**：任务 102
**预估耗时**：8 分钟

### 功能点要求
`agent_spawn` 事件的 `agentType` 来自 `agentDefinition.name ?? 'general'`，`description` 来自传入的 description 参数。两个字段都必须为字符串。

### 测试用例（必须先写，确认 RED）
1. test_agent_spawn_agent_type_from_definition — 验证 agentType 与 agentDefinition.name 一致
2. test_agent_spawn_agent_type_default_general — 验证 agentDefinition.name 缺失时为 'general'
3. test_agent_spawn_description_from_param — 验证 description 与传入参数一致
4. test_agent_spawn_description_empty_string — 验证 description 为空字符串时事件正常
5. test_agent_spawn_description_with_unicode — 验证 description 含 Unicode 字符时事件正常

### TDD 流程
1. 写上述全部测试 → `bun test agent-spawn-meta` 确认 **RED**
2. 确保字段映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test agent-spawn-meta`，确认 5 个测试全部绿色。

---

## 任务 105：agent_complete 在 finally 块发出

**所属模块**：08-agent-observability
**依赖**：任务 102
**预估耗时**：10 分钟

### 功能点要求
在 `runAgent()` 的 `finally` 块中，通过 `eventBus.emit()` 发出 `agent_complete` 事件。无论 runAgent 正常结束还是抛异常，都必须发出。事件包含 `agentId`、`duration` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_agent_complete_emitted_in_finally — 验证 runAgent 正常结束时发出 agent_complete 事件
2. test_agent_complete_emitted_on_error — 验证 runAgent 抛异常时仍发出 agent_complete 事件
3. test_agent_complete_contains_required_fields — 验证事件包含 agentId、duration、timestamp
4. test_agent_complete_agent_id_matches_spawn — 验证 agentId 与对应 agent_spawn 的 childId 一致
5. test_agent_complete_order_after_spawn — 验证 agent_complete 在 agent_spawn 之后发出

### TDD 流程
1. 写上述全部测试 → `bun test agent-complete` 确认 **RED**
2. 在 finally 块插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test agent-complete`，确认 5 个测试全部绿色。

---

## 任务 106：agent_complete 包含正确 duration

**所属模块**：08-agent-observability
**依赖**：任务 105
**预估耗时**：8 分钟

### 功能点要求
`agent_complete` 事件的 `duration` 字段为 `Date.now() - startTime`，其中 `startTime` 在 `runAgent()` 入口记录。单位毫秒，必须大于等于 0。

### 测试用例（必须先写，确认 RED）
1. test_agent_complete_duration_positive — 验证 duration >= 0
2. test_agent_complete_duration_is_milliseconds — 验证 duration 单位为毫秒（mock 时间差验证）
3. test_agent_complete_duration_approximate — 验证 duration 近似等于实际执行时间
4. test_agent_complete_duration_zero_for_instant — 验证瞬时完成时 duration 为 0
5. test_agent_complete_duration_type_is_number — 验证 duration 类型为 number

### TDD 流程
1. 写上述全部测试 → `bun test agent-complete-duration` 确认 **RED**
2. 计算 `Date.now() - startTime` 赋值给 duration → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test agent-complete-duration`，确认 5 个测试全部绿色。

---

## 任务 107：message 事件对每个 yield 的消息发出

**所属模块**：08-agent-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `runAgent()` 中 `query()` 循环的每次 `yield` 前，通过 `eventBus.emit()` 发出 `message` 事件。事件包含 `role`（消息类型）和 `content`（消息内容）。

### 测试用例（必须先写，确认 RED）
1. test_message_event_emitted_per_yield — 验证 query() 每次 yield 时发出 message 事件
2. test_message_event_contains_role — 验证 role 字段与消息 type 一致
3. test_message_event_contains_content — 验证 content 字段包含完整消息对象
4. test_message_event_multiple_yields — 验证多次 yield 时发出多个 message 事件
5. test_message_event_emitted_before_yield — 验证事件在 yield 之前发出（保证实时性）

### TDD 流程
1. 写上述全部测试 → `bun test agent-message` 确认 **RED**
2. 在 query() 循环 yield 前插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test agent-message`，确认 5 个测试全部绿色。

---

## 任务 108：message 事件包含 role 和 content

**所属模块**：08-agent-observability
**依赖**：任务 107
**预估耗时**：8 分钟

### 功能点要求
`message` 事件的 `role` 来自 `message.type`（如 'assistant'、'tool_result' 等），`content` 为完整的 message 对象。两个字段都必须非空。

### 测试用例（必须先写，确认 RED）
1. test_message_role_from_type — 验证 role 与 message.type 一致
2. test_message_content_is_full_object — 验证 content 为完整的 message 对象引用
3. test_message_role_assistant_type — 验证 assistant 消息时 role 为 'assistant'
4. test_message_role_tool_result_type — 验证工具结果消息时 role 为 'tool_result'
5. test_message_content_not_null — 验证 content 不为 null 或 undefined

### TDD 流程
1. 写上述全部测试 → `bun test agent-message-fields` 确认 **RED**
2. 确保 role 和 content 映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test agent-message-fields`，确认 5 个测试全部绿色。

---

## 任务 109：executeSubagentStartHooks() 时 emit hook_fire

**所属模块**：08-agent-observability
**依赖**：任务 102
**预估耗时**：8 分钟

### 功能点要求
在 `runAgent()` 中调用 `executeSubagentStartHooks()` 时，通过 `eventBus.emit()` 发出 `hook_fire` 事件。`hookType` 为 `'subagent_start'`，`details` 包含 agentId 和 agentType。

### 测试用例（必须先写，确认 RED）
1. test_hook_fire_subagent_start_emitted — 验证 executeSubagentStartHooks 执行时发出 hook_fire 事件
2. test_hook_fire_subagent_start_hook_type — 验证 hookType 为 'subagent_start'
3. test_hook_fire_subagent_start_details_agent_id — 验证 details 包含正确的 agentId
4. test_hook_fire_subagent_start_details_agent_type — 验证 details 包含正确的 agentType
5. test_hook_fire_subagent_start_before_query — 验证事件在 query() 调用之前发出

### TDD 流程
1. 写上述全部测试 → `bun test hook-fire-subagent` 确认 **RED**
2. 在 executeSubagentStartHooks 处插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test hook-fire-subagent`，确认 5 个测试全部绿色。
