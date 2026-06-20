# 11 — 权限桥接 TDD 任务计划

模块：11-permission-bridge
依赖模块：03-event-bus（任务 32-46）

---

## 任务 126：requestWebPermission() 返回 Promise

**所属模块**：11-permission-bridge
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `src/zszcode/permission-bridge.ts` 中实现 `requestWebPermission()` 函数，接收 `toolUseId`、`toolName`、`input` 参数，返回 `Promise<'allow' | 'deny' | 'allow_always'>`。函数内部创建一个待 resolve 的 Promise，并存储到内部 Map 中。

### 测试用例（必须先写，确认 RED）
1. test_request_returns_promise — 验证 requestWebPermission() 返回 Promise 对象
2. test_request_promise_type — 验证 Promise resolve 类型为 'allow' | 'deny' | 'allow_always'
3. test_request_stores_pending — 验证调用后内部存储了对应的 pending 请求
4. test_request_different_ids — 验证不同 toolUseId 的请求互不影响
5. test_request_with_empty_input — 验证 input 为空对象时函数正常返回 Promise

### TDD 流程
1. 写上述全部测试 → `bun test permission-request` 确认 **RED**
2. 实现 requestWebPermission() 函数 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-request`，确认 5 个测试全部绿色。

---

## 任务 127：resolveWebPermission() 调用后 Promise resolve

**所属模块**：11-permission-bridge
**依赖**：任务 126
**预估耗时**：10 分钟

### 功能点要求
实现 `resolveWebPermission()` 函数，接收 `toolUseId`、`decision`、`source` 参数。调用后，对应 `requestWebPermission()` 返回的 Promise 应 resolve 为传入的 `decision` 值。

### 测试用例（必须先写，确认 RED）
1. test_resolve_promise_resolves — 验证 resolveWebPermission() 调用后 Promise resolve
2. test_resolve_with_allow — 验证 decision 为 'allow' 时 Promise resolve 为 'allow'
3. test_resolve_with_deny — 验证 decision 为 'deny' 时 Promise resolve 为 'deny'
4. test_resolve_with_allow_always — 验证 decision 为 'allow_always' 时 Promise resolve 为 'allow_always'
5. test_resolve_unknown_id_no_error — 验证 resolve 不存在的 toolUseId 时不抛异常

### TDD 流程
1. 写上述全部测试 → `bun test permission-resolve` 确认 **RED**
2. 实现 resolveWebPermission() 函数 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-resolve`，确认 5 个测试全部绿色。

---

## 任务 128：30 秒超时自动 resolve 为 'deny'

**所属模块**：11-permission-bridge
**依赖**：任务 126
**预估耗时**：10 分钟

### 功能点要求
`requestWebPermission()` 创建的 Promise 在 30 秒内未被 `resolveWebPermission()` 调用时，自动 resolve 为 `'deny'`。使用 `setTimeout` 实现，超时后清除 timer。

### 测试用例（必须先写，确认 RED）
1. test_timeout_resolves_to_deny — 验证 30 秒超时后 Promise resolve 为 'deny'
2. test_timeout_duration_30_seconds — 验证超时时长为 30 秒（mock timer）
3. test_timeout_cleared_on_resolve — 验证手动 resolve 后 timer 被清除
4. test_timeout_no_double_resolve — 验证超时后再次 resolve 不报错
5. test_timeout_timer_cleanup — 验证 resolve 后无残留 timer

### TDD 流程
1. 写上述全部测试 → `bun test permission-timeout` 确认 **RED**
2. 在 requestWebPermission 中添加 setTimeout 30s → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-timeout`，确认 5 个测试全部绿色。使用 `vi.useFakeTimers()` 或 `bun:test` 的 mock timer 验证。

---

## 任务 129：tool_permission_request 事件在请求时发出

**所属模块**：11-permission-bridge
**依赖**：任务 126
**预估耗时**：8 分钟

### 功能点要求
`requestWebPermission()` 调用时，通过 `eventBus.emit()` 发出 `tool_permission_request` 事件。事件包含 `toolName`、`toolUseId`、`input` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_permission_request_event_emitted — 验证 requestWebPermission 调用时发出事件
2. test_permission_request_event_type — 验证事件 type 为 'tool_permission_request'
3. test_permission_request_event_tool_name — 验证事件包含正确的 toolName
4. test_permission_request_event_tool_use_id — 验证事件包含正确的 toolUseId
5. test_permission_request_event_input — 验证事件包含正确的 input

### TDD 流程
1. 写上述全部测试 → `bun test permission-request-event` 确认 **RED**
2. 在 requestWebPermission 中插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-request-event`，确认 5 个测试全部绿色。

---

## 任务 130：tool_permission_resolved 事件在 resolve 时发出

**所属模块**：11-permission-bridge
**依赖**：任务 127
**预估耗时**：8 分钟

### 功能点要求
`resolveWebPermission()` 调用时，通过 `eventBus.emit()` 发出 `tool_permission_resolved` 事件。事件包含 `toolName`、`toolUseId`、`decision`、`source` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_permission_resolved_event_emitted — 验证 resolveWebPermission 调用时发出事件
2. test_permission_resolved_event_type — 验证事件 type 为 'tool_permission_resolved'
3. test_permission_resolved_event_decision — 验证事件包含正确的 decision
4. test_permission_resolved_event_source — 验证事件包含正确的 source
5. test_permission_resolved_event_timestamp — 验证 timestamp 为有效数字

### TDD 流程
1. 写上述全部测试 → `bun test permission-resolved-event` 确认 **RED**
2. 在 resolveWebPermission 中插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-resolved-event`，确认 5 个测试全部绿色。

---

## 任务 131：tool_permission_resolved 包含 source

**所属模块**：11-permission-bridge
**依赖**：任务 130
**预估耗时**：8 分钟

### 功能点要求
`tool_permission_resolved` 事件的 `source` 字段标识决策来源，值为 `'web'` 或 `'cli'`。由 `resolveWebPermission()` 的 `source` 参数决定。

### 测试用例（必须先写，确认 RED）
1. test_permission_resolved_source_web — 验证 source 为 'web' 时事件正确记录
2. test_permission_resolved_source_cli — 验证 source 为 'cli' 时事件正确记录
3. test_permission_resolved_source_type — 验证 source 类型为 'web' | 'cli'
4. test_permission_resolved_source_from_param — 验证 source 来自函数参数
5. test_permission_resolved_source_with_allow_always — 验证 allow_always 决策时 source 也正确记录

### TDD 流程
1. 写上述全部测试 → `bun test permission-resolved-source` 确认 **RED**
2. 确保 source 字段从参数正确映射 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-resolved-source`，确认 5 个测试全部绿色。

---

## 任务 132：allow_always 决策在会话期间持续生效

**所属模块**：11-permission-bridge
**依赖**：任务 127
**预估耗时**：10 分钟

### 功能点要求
当 `resolveWebPermission()` 的 `decision` 为 `'allow_always'` 时，需要在内部维护一个允许列表。后续对同一 `toolName` 的 `requestWebPermission()` 调用应自动 resolve 为 `'allow_always'`，无需等待 Web 端确认。

### 测试用例（必须先写，确认 RED）
1. test_allow_always_stored — 验证 allow_always 决策被记录
2. test_allow_always_auto_resolves — 验证后续同一 toolName 的请求自动 resolve
3. test_allow_always_different_tool_not_affected — 验证不同 toolName 的请求不受影响
4. test_allow_always_persists_through_session — 验证 allow_always 在多次调用间持续
5. test_allow_always_returns_allow_always — 验证自动 resolve 的值为 'allow_always'

### TDD 流程
1. 写上述全部测试 → `bun test allow-always` 确认 **RED**
2. 在 permission-bridge 中维护 allowAlways Set，request 时检查 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test allow-always`，确认 5 个测试全部绿色。

---

## 任务 133：重复 resolve 同一 toolUseId 不报错（幂等）

**所属模块**：11-permission-bridge
**依赖**：任务 127
**预估耗时**：8 分钟

### 功能点要求
对同一个 `toolUseId` 多次调用 `resolveWebPermission()` 不应抛出异常。第一次 resolve 后，后续调用应静默忽略（幂等）。

### 测试用例（必须先写，确认 RED）
1. test_resolve_idempotent_no_error — 验证重复 resolve 不抛异常
2. test_resolve_first_takes_effect — 验证第一次 resolve 的 decision 生效
3. test_resolve_second_ignored — 验证第二次 resolve 被忽略
4. test_resolve_after_timeout_ignored — 验证超时后 resolve 被忽略
5. test_resolve_different_ids_independent — 验证不同 toolUseId 的 resolve 互不影响

### TDD 流程
1. 写上述全部测试 → `bun test permission-idempotent` 确认 **RED**
2. resolve 后从 Map 中删除 pending 请求 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-idempotent`，确认 5 个测试全部绿色。

---

## 任务 134：resolve 后超时 timer 被清除

**所属模块**：11-permission-bridge
**依赖**：任务 128
**预估耗时**：8 分钟

### 功能点要求
当 `resolveWebPermission()` 被调用后，对应的 30 秒超时 timer 必须被 `clearTimeout()` 清除，避免不必要的超时触发。

### 测试用例（必须先写，确认 RED）
1. test_timer_cleared_after_resolve — 验证 resolve 后 timer 被清除
2. test_no_timeout_after_resolve — 验证 resolve 后不会触发超时
3. test_timer_cleared_for_correct_id — 验证只清除对应 toolUseId 的 timer
4. test_other_timers_not_affected — 验证其他 toolUseId 的 timer 不受影响
5. test_clear_timeout_called — 验证 clearTimeout 被调用（spy 验证）

### TDD 流程
1. 写上述全部测试 → `bun test permission-timer-cleanup` 确认 **RED**
2. resolve 时 clearTimeout 对应 timer → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-timer-cleanup`，确认 5 个测试全部绿色。

---

## 任务 135：Promise.race 集成：Web 和 CLI 谁先谁赢

**所属模块**：11-permission-bridge
**依赖**：任务 126、127
**预估耗时**：10 分钟

### 功能点要求
在 `toolExecution.ts` 的权限检查处，使用 `Promise.race()` 同时等待 Web 权限和 CLI 权限。谁先返回就采用谁的决策，另一个自动取消。返回结果包含 `source`（'web' 或 'cli'）和 `decision`。

### 测试用例（必须先写，确认 RED）
1. test_race_web_wins — 验证 Web 先 resolve 时采用 Web 决策
2. test_race_cli_wins — 验证 CLI 先 resolve 时采用 CLI 决策
3. test_race_result_has_source — 验证结果包含 source 字段
4. test_race_result_has_decision — 验证结果包含 decision 字段
5. test_race_timeout_fallback — 验证两端都超时时回退为 deny

### TDD 流程
1. 写上述全部测试 → `bun test permission-race` 确认 **RED**
2. 在 toolExecution.ts 中实现 Promise.race 集成 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test permission-race`，确认 5 个测试全部绿色。
