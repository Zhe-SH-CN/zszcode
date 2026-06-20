# 06 — Query 可观测性 TDD 任务计划

**模块职责**：在 agent loop（query 生成器）中注入可观测性事件，使 Web 端能实时看到 API 调用和消息流。

**修改文件**：
- `src/query.ts`（多处修改）

---

## 任务 75：query() 入口 emit turn_start 事件

**所属模块**：06-query-observability
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/query.ts` 的 `query()` 生成器函数入口处（约 line 219），调用 `eventBus.emit()` 发出 `turn_start` 事件。事件包含 `turnNumber: 0`（首次迭代）和 `timestamp: Date.now()`。通过 `import { eventBus } from '../zszcode/events.js'` 导入事件总线。

### 测试用例（必须先写，确认 RED）
1. test_query_emits_turn_start — 调用 `query()` 后 eventBus 收到 `turn_start` 事件
2. test_turn_start_turn_number_zero — 首次 `turn_start` 的 `turnNumber` 为 0
3. test_turn_start_has_timestamp — 事件包含 `timestamp` 字段且为数字
4. test_turn_start_emitted_before_yield — 事件在第一个 yield 之前发出
5. test_turn_start_imports_event_bus — 文件包含正确的 eventBus import

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 在 `query()` 入口添加 emit 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-75.test.ts
```

---

## 任务 76：turn_start 包含正确 turnNumber

**所属模块**：06-query-observability
**依赖**：任务 75
**预估耗时**：8 分钟

### 功能点要求
`turn_start` 事件的 `turnNumber` 字段正确反映当前的迭代次数。首次迭代为 0，后续每次循环递增。在 query 循环的不同时机发出的 `turn_start` 应有不同的 `turnNumber`。

### 测试用例（必须先写，确认 RED）
1. test_turn_number_first_is_zero — 第一次 `turn_start` 的 `turnNumber` 为 0
2. test_turn_number_increments — 后续迭代的 `turnNumber` 递增
3. test_turn_number_type — `typeof turnNumber === 'number'`
4. test_turn_number_integer — `turnNumber` 是整数
5. test_turn_number_non_negative — `turnNumber` >= 0

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 `state.turnCount` 使用正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-76.test.ts
```

---

## 任务 77：API 调用前 emit api_stream_start

**所属模块**：06-query-observability
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/query.ts` 中，`deps.callModel()` 调用之前（约 line 337，`yield { type: 'stream_request_start' }` 之前），发出 `api_stream_start` 事件。事件包含 `model: currentModel` 和 `timestamp: Date.now()`。

### 测试用例（必须先写，确认 RED）
1. test_api_stream_start_emitted — API 调用前 eventBus 收到 `api_stream_start` 事件
2. test_api_stream_start_has_model — 事件包含 `model` 字段
3. test_api_stream_start_model_correct — `model` 值为当前使用的模型名
4. test_api_stream_start_before_call — 事件在 `callModel()` 之前发出
5. test_api_stream_start_has_timestamp — 事件包含 `timestamp` 字段

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 在 `callModel()` 前添加 emit 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-77.test.ts
```

---

## 任务 78：api_stream_start 包含正确 model 名称

**所属模块**：06-query-observability
**依赖**：任务 77
**预估耗时**：8 分钟

### 功能点要求
`api_stream_start` 事件的 `model` 字段值来自 query 循环中当前使用的模型变量（如 `currentModel`）。值应与实际发送给 API 的模型名一致。

### 测试用例（必须先写，确认 RED）
1. test_model_name_not_empty — `model` 字段不为空字符串
2. test_model_name_type_string — `typeof model === 'string'`
3. test_model_name_matches_config — `model` 与配置的默认模型一致
4. test_model_name_no_undefined — `model` 不是 `undefined`
5. test_model_name_no_null — `model` 不是 `null`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认使用正确的模型变量 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-78.test.ts
```

---

## 任务 79：deps.callModel() 循环内每个 streaming event emit api_stream_event

**所属模块**：06-query-observability
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/query.ts` 的 `deps.callModel()` for-await 循环内部（约 line 659），每个 streaming event 被 yield 之前，发出 `api_stream_event` 事件。事件包含 `event: message`（原始 streaming event 数据）和 `timestamp: Date.now()`。

### 测试用例（必须先写，确认 RED）
1. test_api_stream_event_emitted — 每个 streaming event 都触发 `api_stream_event`
2. test_api_stream_event_has_event_data — 事件包含原始 event 数据
3. test_api_stream_event_multiple — 多个 streaming event 各自触发独立事件
4. test_api_stream_event_before_yield — 事件在 yield 之前发出
5. test_api_stream_event_has_timestamp — 事件包含 `timestamp` 字段

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 在 streaming 循环内添加 emit 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-79.test.ts
```

---

## 任务 80：api_stream_event 包含原始 event 数据

**所属模块**：06-query-observability
**依赖**：任务 79
**预估耗时**：8 分钟

### 功能点要求
`api_stream_event` 事件的 `event` 字段包含 Anthropic SDK streaming 的原始 event 对象。数据不经过任何转换或过滤，Web 端可获取完整的 streaming 信息。

### 测试用例（必须先写，确认 RED）
1. test_stream_event_data_type — `event` 字段是对象
2. test_stream_event_data_not_null — `event` 不是 `null`
3. test_stream_event_preserves_original — 数据与原始 streaming event 相同
4. test_stream_event_no_modification — 数据未被修改
5. test_stream_event_serializable — 数据可被 `JSON.stringify` 序列化

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认事件构造使用原始数据 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-80.test.ts
```

---

## 任务 81：API 调用结束 emit api_stream_end

**所属模块**：06-query-observability
**依赖**：任务 77
**预估耗时**：10 分钟

### 功能点要求
在 `deps.callModel()` 的 for-await 循环结束后，发出 `api_stream_end` 事件。事件包含 `duration: number`（API 调用耗时，毫秒）和 `tokens: any`（token 使用统计）。`duration` 通过记录 `api_stream_start` 的时间戳计算得出。

### 测试用例（必须先写，确认 RED）
1. test_api_stream_end_emitted — API 调用结束后 eventBus 收到 `api_stream_end` 事件
2. test_api_stream_end_has_duration — 事件包含 `duration` 字段
3. test_api_stream_end_duration_positive — `duration` > 0
4. test_api_stream_end_has_tokens — 事件包含 `tokens` 字段
5. test_api_stream_end_after_start — `api_stream_end` 在 `api_stream_start` 之后发出

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 在循环结束后添加 emit 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-81.test.ts
```

---

## 任务 82：api_stream_end 包含 duration 和 tokens

**所属模块**：06-query-observability
**依赖**：任务 81
**预估耗时**：8 分钟

### 功能点要求
`api_stream_end` 事件的 `duration` 是从 `api_stream_start` 到循环结束的毫秒数。`tokens` 包含 Anthropic SDK 返回的 usage 统计（如 `input_tokens`、`output_tokens`）。

### 测试用例（必须先写，确认 RED）
1. test_duration_is_milliseconds — `duration` 是毫秒级数值
2. test_duration_reasonable_range — `duration` 在 0-60000 范围内
3. test_tokens_has_input — `tokens` 包含 `input_tokens` 或类似字段
4. test_tokens_has_output — `tokens` 包含 `output_tokens` 或类似字段
5. test_duration_calculated_correctly — `duration` 接近实际耗时

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 duration 计算和 tokens 提取 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-82.test.ts
```

---

## 任务 83：runTools() 前 emit turn_start

**所属模块**：06-query-observability
**依赖**：任务 75
**预估耗时**：10 分钟

### 功能点要求
在 `src/query.ts` 中，`runTools()` 调用之前（约 line 1382），发出 `turn_start` 事件。`turnNumber` 为当前 `state.turnCount`。这标记工具执行阶段的开始。

### 测试用例（必须先写，确认 RED）
1. test_turn_start_before_run_tools — `runTools()` 前收到 `turn_start` 事件
2. test_turn_start_correct_turn_number — `turnNumber` 与当前迭代一致
3. test_turn_start_has_timestamp — 事件包含 `timestamp`
4. test_turn_start_type — 事件 `type` 为 `'turn_start'`
5. test_turn_start_before_tool_execution — 事件在任何工具执行之前发出

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 在 `runTools()` 前添加 emit 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-83.test.ts
```

---

## 任务 84：runTools() 后 emit turn_end

**所属模块**：06-query-observability
**依赖**：任务 83
**预估耗时**：10 分钟

### 功能点要求
在 `src/query.ts` 中，`runTools()` 调用完成之后（约 line 1382 后），发出 `turn_end` 事件。`turnNumber` 与对应的 `turn_start` 相同。标记工具执行阶段的结束。

### 测试用例（必须先写，确认 RED）
1. test_turn_end_after_run_tools — `runTools()` 后收到 `turn_end` 事件
2. test_turn_end_matches_start — `turnNumber` 与对应的 `turn_start` 相同
3. test_turn_end_has_timestamp — 事件包含 `timestamp`
4. test_turn_end_after_start — `turn_end` 在 `turn_start` 之后发出
5. test_turn_end_type — 事件 `type` 为 `'turn_end'`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 在 `runTools()` 后添加 emit 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-84.test.ts
```

---

## 任务 85：executePostSamplingHooks() 后 emit hook_fire

**所属模块**：06-query-observability
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/query.ts` 中，`executePostSamplingHooks()` 调用之后（约 line 1001），发出 `hook_fire` 事件。事件包含 `hookType: 'post_sampling'` 和 `details`（hook 执行结果）。

### 测试用例（必须先写，确认 RED）
1. test_hook_fire_emitted — hook 执行后收到 `hook_fire` 事件
2. test_hook_fire_has_hook_type — 事件包含 `hookType` 字段
3. test_hook_fire_hook_type_value — `hookType` 为 `'post_sampling'` 或相关值
4. test_hook_fire_has_details — 事件包含 `details` 字段
5. test_hook_fire_has_timestamp — 事件包含 `timestamp`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 在 `executePostSamplingHooks()` 后添加 emit 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-85.test.ts
```

---

## 任务 86：query loop 每次迭代 emit turn_start/turn_end 配对

**所属模块**：06-query-observability
**依赖**：任务 75, 84
**预估耗时**：10 分钟

### 功能点要求
query 循环的每次迭代都发出一对 `turn_start` 和 `turn_end` 事件。`turnNumber` 在同一迭代内保持一致。事件配对保证 Web 端能正确计算每个 turn 的耗时。

### 测试用例（必须先写，确认 RED）
1. test_turn_pair_first_iteration — 第一次迭代有 `turn_start(0)` 和 `turn_end(0)`
2. test_turn_pair_same_number — 配对的 `turn_start` 和 `turn_end` 有相同 `turnNumber`
3. test_turn_pair_sequential — `turn_start` 在 `turn_end` 之前
4. test_turn_pair_multiple_iterations — 多次迭代产生多对事件
5. test_turn_pair_no_mismatch — 不会出现 `turn_start(1)` 后跟 `turn_end(0)`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认循环内配对逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-86.test.ts
```

---

## 任务 87：事件在 yield 之前发出（保证实时性）

**所属模块**：06-query-observability
**依赖**：任务 79
**预估耗时**：10 分钟

### 功能点要求
所有注入的 `eventBus.emit()` 调用必须在对应的 `yield` 语句之前执行。这保证了 Web 端通过 WebSocket 收到事件时，CLI 端尚未将结果呈现给用户，确保实时性。

### 测试用例（必须先写，确认 RED）
1. test_event_before_yield_stream_start — `api_stream_start` 在 `yield stream_request_start` 之前
2. test_event_before_yield_stream_event — `api_stream_event` 在 yield streaming 数据之前
3. test_event_before_yield_turn_start — `turn_start` 在对应 yield 之前
4. test_event_before_yield_turn_end — `turn_end` 在对应 yield 之前
5. test_emit_call_order — 通过 mock 验证 emit 在 yield 之前被调用

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认所有 emit 在 yield 之前 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/06-task-87.test.ts
```
