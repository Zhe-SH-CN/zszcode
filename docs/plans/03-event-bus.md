# 03 — 事件总线 TDD 任务计划

**模块职责**：全局事件总线，连接 agent loop 和 Web 服务器。所有可观测性事件通过此总线广播。

**新增文件**：
- `src/zszcode/events.ts`

---

## 任务 32：定义 ZszCodeEvent 联合类型含全部 19 种事件

**所属模块**：03-event-bus
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/zszcode/events.ts` 中定义并导出 `ZszCodeEvent` 联合类型，包含 19 种事件变体：`api_stream_start`、`api_stream_event`、`api_stream_end`、`tool_call_start`、`tool_call_end`、`tool_permission_request`、`tool_permission_resolved`、`agent_spawn`、`agent_complete`、`mcp_connect`、`mcp_call`、`skill_load`、`skill_invoke`、`state_change`、`context_compact`、`hook_fire`、`message`、`turn_start`、`turn_end`。每个事件必须包含 `type` 和 `timestamp: number` 字段。

### 测试用例（必须先写，确认 RED）
1. test_event_type_importable — 验证可以导入 `ZszCodeEvent` 类型
2. test_event_has_19_variants — 验证联合类型包含 19 种变体（通过类型测试）
3. test_event_turn_start_valid — 构造 `turn_start` 事件对象不报类型错误
4. test_event_api_stream_start_valid — 构造 `api_stream_start` 事件对象不报类型错误
5. test_event_all_have_timestamp — 每种事件类型都有 `timestamp` 字段

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 定义 `ZszCodeEvent` 联合类型 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-32.test.ts
```

---

## 任务 33：ZszCodeEventBus 类继承 EventEmitter

**所属模块**：03-event-bus
**依赖**：任务 32
**预估耗时**：8 分钟

### 功能点要求
定义 `ZszCodeEventBus` 类，继承 Node.js 的 `EventEmitter`。类中重写 `emit()` 方法使其接受 `ZszCodeEvent` 参数。添加 `onEvent(listener)` 方法注册事件监听器。添加 `getHistory(limit)` 方法获取历史事件。导出单例 `eventBus`。

### 测试用例（必须先写，确认 RED）
1. test_event_bus_is_event_emitter — 验证 `eventBus instanceof EventEmitter`
2. test_event_bus_has_emit_method — 验证 `eventBus.emit` 是函数
3. test_event_bus_has_on_event_method — 验证 `eventBus.onEvent` 是函数
4. test_event_bus_has_get_history_method — 验证 `eventBus.getHistory` 是函数
5. test_event_bus_singleton — 多次导入返回同一实例

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 定义 `ZszCodeEventBus` 类和单例 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-33.test.ts
```

---

## 任务 34：eventBus.emit() 广播事件到所有已注册 listener

**所属模块**：03-event-bus
**依赖**：任务 33
**预估耗时**：8 分钟

### 功能点要求
调用 `eventBus.emit(event)` 时，所有通过 `onEvent()` 注册的 listener 都收到该事件。事件以 `'event'` 作为内部 channel 名称广播。`emit()` 返回 `boolean`（EventEmitter 的标准行为，表示是否有 listener 接收）。

### 测试用例（必须先写，确认 RED）
1. test_emit_calls_listener — 注册 listener 后 emit，验证 listener 被调用
2. test_emit_passes_event_object — listener 收到的参数是正确的事件对象
3. test_emit_returns_boolean — `emit()` 返回 `boolean` 类型
4. test_emit_no_listeners_returns_false — 无 listener 时返回 `false`
5. test_emit_with_listener_returns_true — 有 listener 时返回 `true`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `emit()` 重写 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-34.test.ts
```

---

## 任务 35：eventBus.onEvent() 返回 unsubscribe 函数

**所属模块**：03-event-bus
**依赖**：任务 33
**预估耗时**：8 分钟

### 功能点要求
`onEvent(listener)` 方法将 listener 注册到 `'event'` channel，返回一个 `() => void` 类型的 unsubscribe 函数。调用 unsubscribe 函数后，对应的 listener 被移除。

### 测试用例（必须先写，确认 RED）
1. test_on_event_returns_function — 验证返回值是函数
2. test_on_event_listener_registered — 注册后 listener 能收到事件
3. test_on_event_unsubscribe_type — 返回函数的 `typeof` 为 `'function'`
4. test_on_event_multiple_registrations — 可注册多个不同 listener
5. test_on_event_same_listener_twice — 同一 listener 注册两次会收到两次事件

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `onEvent()` 方法 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-35.test.ts
```

---

## 任务 36：unsubscribe 后不再收到事件

**所属模块**：03-event-bus
**依赖**：任务 35
**预估耗时**：8 分钟

### 功能点要求
调用 `onEvent()` 返回的 unsubscribe 函数后，对应的 listener 不再收到后续事件。unsubscribe 操作不影响其他已注册的 listener。对已 unsubscribe 的函数再次调用不报错。

### 测试用例（必须先写，确认 RED）
1. test_unsubscribe_removes_listener — unsubscribe 后 emit，listener 不被调用
2. test_unsubscribe_does_not_affect_others — unsubscribe 一个 listener 不影响其他 listener
3. test_unsubscribe_twice_no_error — 对同一 unsubscribe 函数调用两次不报错
4. test_unsubscribe_then_emit_count — unsubscribe 后 listener 调用次数不变
5. test_unsubscribe_new_events_only — unsubscribe 只影响后续事件，之前已触发的不受影响

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 unsubscribe 逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-36.test.ts
```

---

## 任务 37：多个 listener 同时接收同一事件

**所属模块**：03-event-bus
**依赖**：任务 34
**预估耗时**：8 分钟

### 功能点要求
当多个 listener 通过 `onEvent()` 注册时，一次 `emit()` 调用会使所有 listener 都收到同一事件对象。listener 按注册顺序被调用。

### 测试用例（必须先写，确认 RED）
1. test_multiple_listeners_all_called — 3 个 listener 全部被调用
2. test_multiple_listeners_same_event — 所有 listener 收到同一事件引用
3. test_multiple_listeners_order — listener 按注册顺序被调用
4. test_multiple_listeners_one_unsubscribed — 一个 unsubscribe 后其余仍正常
5. test_multiple_listeners_10_listeners — 10 个 listener 全部被调用

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 EventEmitter 多 listener 行为 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-37.test.ts
```

---

## 任务 38：历史缓冲区保留最近 1000 条事件

**所属模块**：03-event-bus
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
`ZszCodeEventBus` 内部维护一个 `history` 数组，每次 `emit()` 时将事件追加到数组。缓冲区上限为 1000 条。`getHistory()` 方法返回历史事件的子集。

### 测试用例（必须先写，确认 RED）
1. test_history_stores_events — emit 后 `getHistory()` 返回包含该事件的数组
2. test_history_max_1000 — emit 1001 次后 `getHistory(2000)` 最多返回 1000 条
3. test_history_fifo_order — 最早的事件在数组前面
4. test_history_initially_empty — 新建的 eventBus `getHistory()` 返回空数组
5. test_history_grows_to_limit — emit 500 次后 `getHistory(500)` 返回 500 条

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 history 缓冲区逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-38.test.ts
```

---

## 任务 39：超出 1000 条后 FIFO 淘汰最旧事件

**所属模块**：03-event-bus
**依赖**：任务 38
**预估耗时**：8 分钟

### 功能点要求
当 history 数组长度超过 `MAX_HISTORY`（1000）时，使用 `shift()` 移除最旧的事件。确保数组长度始终 <= 1000。移除的是最早进入的事件（FIFO）。

### 测试用例（必须先写，确认 RED）
1. test_fifo_removes_oldest — emit 1001 次后，第 1 个事件被淘汰
2. test_fifo_keeps_newest — emit 1001 次后，第 1001 个事件仍在历史中
3. test_fifo_length_exactly_1000 — emit 2000 次后 history 长度恰好为 1000
4. test_fifo_order_preserved — 淘汰后剩余事件按时间顺序排列
5. test_fifo_at_boundary — emit 恰好 1000 次时不淘汰任何事件

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 FIFO 淘汰逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-39.test.ts
```

---

## 任务 40：listener 抛异常不影响其他 listener 执行

**所属模块**：03-event-bus
**依赖**：任务 37
**预估耗时**：10 分钟

### 功能点要求
当某个 listener 在处理事件时抛出异常，其他 listener 仍应正常收到并处理该事件。实现方式：在 `emit()` 中用 try-catch 包裹每个 listener 的调用。

### 测试用例（必须先写，确认 RED）
1. test_throwing_listener_does_not_block_others — listener A 抛异常，listener B 仍被调用
2. test_throwing_listener_does_not_throw_from_emit — emit 本身不抛出异常
3. test_throwing_listener_still_in_history — 事件仍被记录到 history
4. test_throwing_listener_called_once — 抛异常的 listener 仍只被调用一次
5. test_multiple_throwing_listeners — 多个 listener 抛异常，其余正常

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 try-catch 保护逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-40.test.ts
```

---

## 任务 41：getHistory() 返回最近 N 条事件

**所属模块**：03-event-bus
**依赖**：任务 38
**预估耗时**：8 分钟

### 功能点要求
`getHistory(limit)` 方法返回 history 数组中最近的 `limit` 条事件。使用 `slice(-limit)` 实现。当 `limit` 大于 history 长度时，返回全部历史。

### 测试用例（必须先写，确认 RED）
1. test_get_history_returns_last_n — emit 10 次后 `getHistory(5)` 返回最后 5 条
2. test_get_history_limit_exceeds_length — `getHistory(100)` 在只有 10 条时返回 10 条
3. test_get_history_returns_array — 返回值是数组
4. test_get_history_elements_are_events — 返回的每个元素都有 `type` 和 `timestamp`
5. test_get_history_preserves_order — 返回的事件按时间顺序排列

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `getHistory(limit)` 方法 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-41.test.ts
```

---

## 任务 42：getHistory() 默认返回最近 100 条

**所属模块**：03-event-bus
**依赖**：任务 41
**预估耗时**：5 分钟

### 功能点要求
`getHistory()` 不传参数时，默认 `limit = 100`，返回最近 100 条事件。

### 测试用例（必须先写，确认 RED）
1. test_get_history_default_100 — emit 200 次后 `getHistory()` 返回 100 条
2. test_get_history_default_less_than_100 — emit 50 次后 `getHistory()` 返回 50 条
3. test_get_history_default_equals_get_history_100 — `getHistory()` 和 `getHistory(100)` 结果相同
4. test_get_history_default_returns_array — 返回值是数组
5. test_get_history_default_last_element — 最后一个元素是最近一次 emit 的事件

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 设置默认参数 `limit = 100` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-42.test.ts
```

---

## 任务 43：getHistory() 历史为空时返回空数组

**所属模块**：03-event-bus
**依赖**：任务 41
**预估耗时**：5 分钟

### 功能点要求
当没有任何事件被 emit 时，`getHistory()` 返回空数组 `[]`。不返回 `null`、`undefined` 或其他值。

### 测试用例（必须先写，确认 RED）
1. test_get_history_empty_returns_array — 返回值 `Array.isArray()` 为 `true`
2. test_get_history_empty_length_zero — 返回数组长度为 0
3. test_get_history_empty_not_null — 返回值不是 `null`
4. test_get_history_empty_not_undefined — 返回值不是 `undefined`
5. test_get_history_empty_with_limit — `getHistory(100)` 在空历史时也返回 `[]`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认空数组行为正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-43.test.ts
```

---

## 任务 44：eventBus 单例全局唯一

**所属模块**：03-event-bus
**依赖**：任务 33
**预估耗时**：8 分钟

### 功能点要求
`src/zszcode/events.ts` 导出的 `eventBus` 是全局单例。多次 `import` 返回同一实例。在一个模块中 emit 的事件，在另一个模块中通过同一 `eventBus` 能收到。

### 测试用例（必须先写，确认 RED）
1. test_event_bus_singleton_identity — 两次导入的 `eventBus` 是同一引用（`===`）
2. test_event_bus_cross_module_receive — 在一个地方 emit，另一个地方的 listener 收到
3. test_event_bus_shared_history — 不同导入点访问的 `getHistory()` 返回相同数据
4. test_event_bus_singleton_not_new_instance — 不是每次 import 都创建新实例
5. test_event_bus_singleton_has_same_listeners — 注册的 listener 在所有引用中可见

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认模块级单例导出 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-44.test.ts
```

---

## 任务 45：emit() 返回 boolean（EventEmitter 行为）

**所属模块**：03-event-bus
**依赖**：任务 34
**预估耗时**：5 分钟

### 功能点要求
`eventBus.emit()` 的返回值遵循 EventEmitter 标准：有 listener 接收时返回 `true`，无 listener 时返回 `false`。

### 测试用例（必须先写，确认 RED）
1. test_emit_returns_true_with_listener — 有 listener 时返回 `true`
2. test_emit_returns_false_without_listener — 无 listener 时返回 `false`
3. test_emit_returns_boolean_type — `typeof` 为 `'boolean'`
4. test_emit_returns_true_after_unsubscribe_partial — 部分 unsubscribe 后仍有 listener 时返回 `true`
5. test_emit_returns_false_after_unsubscribe_all — 全部 unsubscribe 后返回 `false`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认返回值逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-45.test.ts
```

---

## 任务 46：事件对象必须包含 timestamp 字段

**所属模块**：03-event-bus
**依赖**：任务 32
**预估耗时**：8 分钟

### 功能点要求
所有 19 种 `ZszCodeEvent` 变体都必须包含 `timestamp: number` 字段。`timestamp` 值应使用 `Date.now()` 生成，表示事件发生的毫秒时间戳。验证方式：构造每种事件类型，检查 `timestamp` 字段存在且为数字。

### 测试用例（必须先写，确认 RED）
1. test_event_timestamp_type — 验证 `timestamp` 的 `typeof` 为 `'number'`
2. test_event_timestamp_positive — 验证 `timestamp` 大于 0
3. test_event_timestamp_is_now — 验证 `timestamp` 接近 `Date.now()`（误差 < 100ms）
4. test_event_timestamp_in_range — 验证在合理时间范围内（2024-2030 年）
5. test_event_timestamp_milliseconds — 验证是毫秒级（> 1000000000000）

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认事件构造时使用 `Date.now()` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/03-task-46.test.ts
```
