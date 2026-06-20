# 10 — 状态变更可观测性 TDD 任务计划

模块：10-state-observability
依赖模块：03-event-bus（任务 32-46）

---

## 任务 119：setState() 时 emit state_change 事件

**所属模块**：10-state-observability
**依赖**：任务 34
**预估耗时**：10 分钟

### 功能点要求
在 `state/store.ts` 的 `setState()` 方法中，当状态实际发生变化（`!Object.is(next, prev)`）后，遍历 `next` 对象的 keys，对每个值发生变化的字段通过 `eventBus.emit()` 发出 `state_change` 事件。事件包含 `field`、`oldValue`、`newValue` 和 `timestamp`。

### 测试用例（必须先写，确认 RED）
1. test_state_change_emitted_on_set_state — 验证 setState() 导致状态变化时发出 state_change 事件
2. test_state_change_contains_field — 验证事件包含 field 字段名
3. test_state_change_contains_old_value — 验证事件包含变化前的 oldValue
4. test_state_change_contains_new_value — 验证事件包含变化后的 newValue
5. test_state_change_contains_timestamp — 验证事件包含 timestamp 且为数字

### TDD 流程
1. 写上述全部测试 → `bun test state-change` 确认 **RED**
2. 在 setState() 中 Object.is 检查后插入遍历和 eventBus.emit() → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test state-change`，确认 5 个测试全部绿色。检查 eventBus 历史中包含 state_change 事件。

---

## 任务 120：state_change 包含正确 field 名称

**所属模块**：10-state-observability
**依赖**：任务 119
**预估耗时**：8 分钟

### 功能点要求
`state_change` 事件的 `field` 字段为发生变化的对象属性名（`key`），来自 `Object.keys(nextObj)` 遍历。必须为字符串类型。

### 测试用例（必须先写，确认 RED）
1. test_state_change_field_name_correct — 验证 field 与实际变化的属性名一致
2. test_state_change_field_type_string — 验证 field 类型为 string
3. test_state_change_field_from_next_keys — 验证 field 来自 next 对象的 keys
4. test_state_change_multiple_fields — 验证多个字段变化时每个事件的 field 各不相同
5. test_state_change_field_with_underscore — 验证 field 含下划线时事件正常（如 toolPermissionContext）

### TDD 流程
1. 写上述全部测试 → `bun test state-change-field` 确认 **RED**
2. 确保 field 映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test state-change-field`，确认 5 个测试全部绿色。

---

## 任务 121：state_change 包含 oldValue 和 newValue

**所属模块**：10-state-observability
**依赖**：任务 119
**预估耗时**：8 分钟

### 功能点要求
`state_change` 事件的 `oldValue` 来自 `prevObj[key]`，`newValue` 来自 `nextObj[key]`。两个值的类型和内容必须准确反映状态变化前后的真实值。

### 测试用例（必须先写，确认 RED）
1. test_state_change_old_value_correct — 验证 oldValue 与变化前的属性值一致
2. test_state_change_new_value_correct — 验证 newValue 与变化后的属性值一致
3. test_state_change_values_differ — 验证 oldValue 和 newValue 不相等（Object.is）
4. test_state_change_old_value_null — 验证 oldValue 为 null 时事件正常
5. test_state_change_new_value_complex_object — 验证 newValue 为复杂对象时事件正常

### TDD 流程
1. 写上述全部测试 → `bun test state-change-values` 确认 **RED**
2. 确保 oldValue 和 newValue 映射正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test state-change-values`，确认 5 个测试全部绿色。

---

## 任务 122：Object.is 相同时不发出 state_change

**所属模块**：10-state-observability
**依赖**：任务 119
**预估耗时**：8 分钟

### 功能点要求
当 `setState()` 的 updater 返回的对象与当前状态 `Object.is` 相等时，不发出任何 `state_change` 事件。当某个字段的 `Object.is(prevObj[key], nextObj[key])` 为 true 时，该字段不发出事件。

### 测试用例（必须先写，确认 RED）
1. test_state_change_not_emitted_when_same_reference — 验证返回同一引用时不发出事件
2. test_state_change_not_emitted_when_same_values — 验证所有字段值相同时不发出事件
3. test_state_change_skips_unchanged_fields — 验证只有变化的字段发出事件，未变化的跳过
4. test_state_change_empty_update — 验证 updater 不修改任何字段时不发出事件
5. test_state_change_no_event_count_on_same — 验证 eventBus 历史中无新增 state_change

### TDD 流程
1. 写上述全部测试 → `bun test state-change-skip` 确认 **RED**
2. 在遍历中加入 `Object.is` 检查 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test state-change-skip`，确认 5 个测试全部绿色。

---

## 任务 123：多个字段变化发出多个独立 state_change 事件

**所属模块**：10-state-observability
**依赖**：任务 119
**预估耗时**：8 分钟

### 功能点要求
当一次 `setState()` 调用导致多个字段同时变化时，每个变化的字段独立发出一个 `state_change` 事件。事件数量等于变化字段的数量。

### 测试用例（必须先写，确认 RED）
1. test_state_change_multiple_events — 验证两个字段变化时发出两个事件
2. test_state_change_each_event_has_different_field — 验证每个事件的 field 值不同
3. test_state_change_event_count_matches_changes — 验证事件数量等于变化字段数
4. test_state_change_three_fields — 验证三个字段变化时发出三个事件
5. test_state_change_mixed_changed_unchanged — 验证部分字段变化时只发出变化字段的事件

### TDD 流程
1. 写上述全部测试 → `bun test state-change-multi` 确认 **RED**
2. 确保遍历逻辑正确，每个变化字段独立 emit → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test state-change-multi`，确认 5 个测试全部绿色。

---

## 任务 124：只遍历 next 对象的 keys（不遍历 prev 独有）

**所属模块**：10-state-observability
**依赖**：任务 119
**预估耗时**：8 分钟

### 功能点要求
状态变更检测只遍历 `Object.keys(nextObj)`，不遍历 `prev` 独有的 keys。这意味着如果 prev 有某字段但 next 没有，不会为该字段发出 state_change 事件。

### 测试用例（必须先写，确认 RED）
1. test_state_change_only_next_keys — 验证只遍历 next 的 keys
2. test_state_change_prev_extra_key_ignored — 验证 prev 独有的 key 不产生事件
3. test_state_change_new_key_in_next — 验证 next 新增的 key 产生事件
4. test_state_change_key_count_from_next — 验证遍历的 key 数量与 next 的 key 数量一致
5. test_state_change_prev_key_deleted_no_event — 验证删除 prev 中的 key 不产生事件

### TDD 流程
1. 写上述全部测试 → `bun test state-change-next-keys` 确认 **RED**
2. 确保使用 `Object.keys(nextObj)` 遍历 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test state-change-next-keys`，确认 5 个测试全部绿色。

---

## 任务 125：嵌套对象引用变化触发事件（即使深层相等）

**所属模块**：10-state-observability
**依赖**：任务 119
**预估耗时**：8 分钟

### 功能点要求
当字段值是对象类型时，使用 `Object.is` 比较引用。即使新旧对象深层内容相等但引用不同，也会触发 `state_change` 事件。这是设计上的简化，不做深比较。

### 测试用例（必须先写，确认 RED）
1. test_state_change_nested_object_ref_change — 验证嵌套对象引用变化时触发事件
2. test_state_change_nested_object_same_ref_no_event — 验证同一引用时不触发事件
3. test_state_change_deep_equal_but_different_ref — 验证深层相等但引用不同时触发事件
4. test_state_change_array_ref_change — 验证数组引用变化时触发事件
5. test_state_change_nested_old_value_is_original — 验证 oldValue 为原始对象引用

### TDD 流程
1. 写上述全部测试 → `bun test state-change-nested` 确认 **RED**
2. 确保使用 `Object.is` 而非深比较 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test state-change-nested`，确认 5 个测试全部绿色。
