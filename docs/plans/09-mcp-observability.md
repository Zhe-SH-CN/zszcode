# 09 — MCP 交互可观测性 TDD 任务计划

模块：09-mcp-observability
依赖模块：03-event-bus（任务 32-46）

---

## 任务 110：mcp_connect 在 connectToServer() 成功时 success=true

**所属模块**：09-mcp-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `mcp/client.ts` 的 `connectToServer()` 函数返回后，通过 `eventBus.emit()` 发出 `mcp_connect` 事件。连接成功时 `success` 为 `true`，事件包含 `serverName` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_mcp_connect_success_emitted — 验证连接成功时 eventBus 收到 mcp_connect 事件
2. test_mcp_connect_success_true — 验证成功时 success 字段为 true
3. test_mcp_connect_contains_server_name — 验证事件包含正确的 serverName
4. test_mcp_connect_timestamp_is_number — 验证 timestamp 为有效数字类型
5. test_mcp_connect_server_name_matches_config — 验证 serverName 与配置中的名称一致

### TDD 流程
1. 写上述全部测试 → `bun test mcp-connect-success` 确认 **RED**
2. 在 connectToServer() 返回后插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test mcp-connect-success`，确认 5 个测试全部绿色。

---

## 任务 111：mcp_connect 在连接失败时 success=false

**所属模块**：09-mcp-observability
**依赖**：任务 110
**预估耗时**：8 分钟

### 功能点要求
当 `connectToServer()` 连接失败时，`mcp_connect` 事件的 `success` 字段为 `false`。无论失败原因（超时、拒绝、认证错误），事件都必须发出。

### 测试用例（必须先写，确认 RED）
1. test_mcp_connect_failure_emitted — 验证连接失败时 eventBus 收到 mcp_connect 事件
2. test_mcp_connect_failure_success_false — 验证失败时 success 字段为 false
3. test_mcp_connect_failure_on_timeout — 验证超时失败时 success 为 false
4. test_mcp_connect_failure_on_refused — 验证连接被拒绝时 success 为 false
5. test_mcp_connect_failure_still_has_server_name — 验证失败事件仍包含 serverName

### TDD 流程
1. 写上述全部测试 → `bun test mcp-connect-failure` 确认 **RED**
2. 在 connectToServer() 失败路径插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test mcp-connect-failure`，确认 5 个测试全部绿色。

---

## 任务 112：mcp_connect 包含 serverName

**所属模块**：09-mcp-observability
**依赖**：任务 110
**预估耗时**：8 分钟

### 功能点要求
`mcp_connect` 事件的 `serverName` 来自 `connectToServer(name, ...)` 的 `name` 参数。必须为非空字符串，且在成功和失败场景中都正确填充。

### 测试用例（必须先写，确认 RED）
1. test_mcp_connect_server_name_from_param — 验证 serverName 来自 connectToServer 的 name 参数
2. test_mcp_connect_server_name_non_empty — 验证 serverName 不为空字符串
3. test_mcp_connect_server_name_type_string — 验证 serverName 类型为 string
4. test_mcp_connect_server_name_with_special_chars — 验证 serverName 含特殊字符时事件正常
5. test_mcp_connect_server_name_same_on_failure — 验证失败时 serverName 与成功时一致

### TDD 流程
1. 写上述全部测试 → `bun test mcp-connect-name` 确认 **RED**
2. 确保 serverName 映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test mcp-connect-name`，确认 5 个测试全部绿色。

---

## 任务 113：mcp_call 在 client.callTool() 前发出（无 response）

**所属模块**：09-mcp-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `mcp/client.ts` 的 `callMCPTool()` 中，调用 `client.callTool()` 之前，通过 `eventBus.emit()` 发出 `mcp_call` 事件。此事件不含 `response` 字段（请求阶段），包含 `serverName`、`toolName`、`request` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_mcp_call_request_emitted_before_call — 验证 client.callTool() 被调用前发出 mcp_call 事件
2. test_mcp_call_request_no_response — 验证请求阶段事件不含 response 字段
3. test_mcp_call_request_contains_server_name — 验证事件包含 serverName
4. test_mcp_call_request_contains_tool_name — 验证事件包含 toolName
5. test_mcp_call_request_contains_request — 验证事件包含 request 对象（含 name 和 arguments）

### TDD 流程
1. 写上述全部测试 → `bun test mcp-call-request` 确认 **RED**
2. 在 client.callTool() 前插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test mcp-call-request`，确认 5 个测试全部绿色。

---

## 任务 114：mcp_call 在 client.callTool() 后发出（有 response）

**所属模块**：09-mcp-observability
**依赖**：任务 113
**预估耗时**：10 分钟

### 功能点要求
在 `client.callTool()` 执行完毕后，再次通过 `eventBus.emit()` 发出 `mcp_call` 事件。此事件包含 `response` 字段（结果阶段），以及 `duration`。

### 测试用例（必须先写，确认 RED）
1. test_mcp_call_response_emitted_after_call — 验证 client.callTool() 完成后发出带 response 的 mcp_call 事件
2. test_mcp_call_response_has_response_field — 验证事件包含 response 字段
3. test_mcp_call_response_has_duration — 验证事件包含 duration 字段
4. test_mcp_call_response_contains_result — 验证 response 包含 callTool() 的返回值
5. test_mcp_call_two_events_per_call — 验证每次 callTool() 产生两个 mcp_call 事件（请求+响应）

### TDD 流程
1. 写上述全部测试 → `bun test mcp-call-response` 确认 **RED**
2. 在 client.callTool() 后插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test mcp-call-response`，确认 5 个测试全部绿色。

---

## 任务 115：mcp_call 包含正确 duration

**所属模块**：09-mcp-observability
**依赖**：任务 114
**预估耗时**：8 分钟

### 功能点要求
响应阶段的 `mcp_call` 事件 `duration` 字段为 `Date.now() - startTime`，单位毫秒。仅在响应阶段事件中包含，请求阶段无 duration。

### 测试用例（必须先写，确认 RED）
1. test_mcp_call_duration_positive — 验证 duration >= 0
2. test_mcp_call_duration_is_milliseconds — 验证 duration 单位为毫秒
3. test_mcp_call_duration_only_on_response — 验证仅响应阶段事件包含 duration
4. test_mcp_call_duration_zero_for_instant — 验证瞬时完成时 duration 为 0
5. test_mcp_call_duration_type_is_number — 验证 duration 类型为 number

### TDD 流程
1. 写上述全部测试 → `bun test mcp-call-duration` 确认 **RED**
2. 在响应阶段计算 duration 并赋值 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test mcp-call-duration`，确认 5 个测试全部绿色。

---

## 任务 116：mcp_call 包含 serverName、toolName、request

**所属模块**：09-mcp-observability
**依赖**：任务 113
**预估耗时**：8 分钟

### 功能点要求
请求和响应阶段的 `mcp_call` 事件都必须包含 `serverName`（来自 MCP 服务器名称）、`toolName`（来自 `tool.name`）、`request`（包含 `name` 和 `arguments`）。

### 测试用例（必须先写，确认 RED）
1. test_mcp_call_server_name_from_connection — 验证 serverName 来自 MCP 连接配置
2. test_mcp_call_tool_name_from_tool — 验证 toolName 来自 tool.name
3. test_mcp_call_request_has_name — 验证 request.name 与 toolName 一致
4. test_mcp_call_request_has_arguments — 验证 request.arguments 包含传入参数
5. test_mcp_call_fields_consistent_across_phases — 验证请求和响应阶段的公共字段一致

### TDD 流程
1. 写上述全部测试 → `bun test mcp-call-fields` 确认 **RED**
2. 确保字段映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test mcp-call-fields`，确认 5 个测试全部绿色。

---

## 任务 117：skill_load 在 fetchToolsForClient() 注册工具时发出

**所属模块**：09-mcp-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `mcp/client.ts` 的 `fetchToolsForClient()` 中，每个工具注册时通过 `eventBus.emit()` 发出 `skill_load` 事件。事件包含 `name`（工具名）和 `source`（来源服务器名）。

### 测试用例（必须先写，确认 RED）
1. test_skill_load_emitted_on_register — 验证工具注册时发出 skill_load 事件
2. test_skill_load_contains_name — 验证事件包含工具名称
3. test_skill_load_contains_source — 验证事件包含来源服务器名
4. test_skill_load_multiple_tools — 验证注册多个工具时发出多个事件
5. test_skill_load_name_matches_tool — 验证 name 与注册的工具名一致

### TDD 流程
1. 写上述全部测试 → `bun test skill-load` 确认 **RED**
2. 在 fetchToolsForClient() 注册工具处插入 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test skill-load`，确认 5 个测试全部绿色。

---

## 任务 118：skill_load 包含 name 和 source

**所属模块**：09-mcp-observability
**依赖**：任务 117
**预估耗时**：8 分钟

### 功能点要求
`skill_load` 事件的 `name` 来自工具定义的名称，`source` 来自 MCP 服务器名称。两个字段都必须为非空字符串。

### 测试用例（必须先写，确认 RED）
1. test_skill_load_name_from_tool_def — 验证 name 来自工具定义
2. test_skill_load_source_from_server — 验证 source 来自 MCP 服务器名称
3. test_skill_load_name_non_empty — 验证 name 不为空字符串
4. test_skill_load_source_non_empty — 验证 source 不为空字符串
5. test_skill_load_with_dot_in_name — 验证 name 含点号（如 'server.tool'）时事件正常

### TDD 流程
1. 写上述全部测试 → `bun test skill-load-fields` 确认 **RED**
2. 确保字段映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test skill-load-fields`，确认 5 个测试全部绿色。
