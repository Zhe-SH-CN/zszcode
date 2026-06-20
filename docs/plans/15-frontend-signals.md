# 15 — 前端 Signals Tab TDD 任务计划

**模块职责**：实时信号流，带过滤器，展示 agent 内部运转的每一个事件。

**新增文件**：
- `web/src/components/SignalsView.tsx`
- `web/src/components/SignalFilter.tsx`
- `web/src/components/SignalCard.tsx`

---

## 任务 195：SignalsView 主容器组件

**所属模块**：15-frontend-signals
**依赖**：任务 147
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/SignalsView.tsx`，接收 `events: ZszCodeEvent[]` prop。容器分上下两部分：顶部 SignalFilter 过滤器，下方信号列表（SignalCard 列表）。使用 `data-testid="signals-view"` 标识。信号列表使用 `overflow-y: auto` 支持滚动。无事件时显示 "No signals yet" 占位文字。列表按时间倒序排列（最新在上）。

### 测试用例（必须先写，确认 RED）
1. test_signals_view_renders — 验证组件渲染不报错
2. test_signals_view_shows_filter — 验证渲染 SignalFilter 组件
3. test_signals_view_shows_events — 验证渲染事件列表
4. test_signals_view_empty_placeholder — 验证无事件时显示占位文字
5. test_signals_view_has_testid — 验证有 data-testid="signals-view"

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 SignalsView 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-195.test.ts
```

---

## 任务 196：SignalFilter 过滤器 checkbox 列表（11 种类型）

**所属模块**：15-frontend-signals
**依赖**：任务 195
**预估耗时**：15 分钟

### 功能点要求
创建 `web/src/components/SignalFilter.tsx`，接收 `{ activeFilters, onToggle }` prop。显示 11 种过滤类型的 checkbox 列表：API Stream、Tool Call、Permission、Agent、MCP、Skill、State、Hook、Context、Message、Turn。每种类型对应一组事件 type（如 "API Stream" 对应 api_stream_start, api_stream_event, api_stream_end）。使用 `data-testid="signal-filter"` 标识。横向排列，超出换行。

### 测试用例（必须先写，确认 RED）
1. test_signal_filter_renders — 验证组件渲染不报错
2. test_signal_filter_has_11_types — 验证显示 11 种过滤类型
3. test_signal_filter_has_checkboxes — 验证每种类型有 checkbox
4. test_signal_filter_api_stream_label — 验证 "API Stream" 标签存在
5. test_signal_filter_tool_call_label — 验证 "Tool Call" 标签存在

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 SignalFilter 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-196.test.ts
```

---

## 任务 197：SignalFilter 默认全部选中

**所属模块**：15-frontend-signals
**依赖**：任务 196
**预估耗时**：8 分钟

### 功能点要求
SignalFilter 中所有 11 种过滤类型默认选中（checkbox checked 状态）。初始 `activeFilters` 为包含所有 11 种类型的 Set 或数组。取消选中某类型时，对应的事件不再显示在列表中。使用受控组件模式（checked 状态由父组件管理）。

### 测试用例（必须先写，确认 RED）
1. test_signal_filter_all_checked_by_default — 验证所有 checkbox 默认选中
2. test_signal_filter_uncheck_hides — 验证取消选中后对应事件隐藏
3. test_signal_filter_recheck_shows — 验证重新选中后事件显示
4. test_signal_filter_initial_active_count — 验证初始 activeFilters 包含 11 项
5. test_signal_filter_controlled_component — 验证 checkbox 状态由 props 控制

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现默认选中逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-197.test.ts
```

---

## 任务 198：SignalFilter 变更立即生效过滤事件

**所属模块**：15-frontend-signals
**依赖**：任务 197
**预估耗时**：10 分钟

### 功能点要求
SignalFilter checkbox 状态变化时，立即通过 `onToggle(filterType)` 回调通知父组件。父组件更新 `activeFilters` 后，信号列表立即过滤：只显示 `activeFilters` 中包含的事件类型。过滤逻辑：事件 type 映射到 filterType（如 `api_stream_start` -> "API Stream"），检查 filterType 是否在 activeFilters 中。过滤无延迟（同步更新）。

### 测试用例（必须先写，确认 RED）
1. test_signal_filter_toggle_calls_callback — 验证 checkbox 变化调用 onToggle
2. test_signal_filter_passes_type — 验证 onToggle 传递正确的 filterType
3. test_signal_filter_immediate_effect — 验证过滤立即生效
4. test_signal_filter_type_mapping — 验证事件 type 正确映射到 filterType
5. test_signal_filter_multiple_types — 验证同组类型（如 api_stream_*）一起过滤

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现过滤逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-198.test.ts
```

---

## 任务 199：SignalCard 显示事件 type 和 timestamp

**所属模块**：15-frontend-signals
**依赖**：任务 195
**预估耗时**：10 分钟

### 功能点要求
创建 `web/src/components/SignalCard.tsx`，接收 `{ event: ZszCodeEvent }` prop。卡片显示：事件 type（粗体，左侧）、timestamp（右侧，格式 HH:mm:ss.SSS）。type 使用颜色编码：不同事件类型组使用不同颜色（如 api_* 为蓝色，tool_* 为绿色，agent_* 为紫色）。使用 `data-testid="signal-card"` 标识。卡片有左边框颜色条。

### 测试用例（必须先写，确认 RED）
1. test_signal_card_renders — 验证组件渲染不报错
2. test_signal_card_shows_type — 验证显示事件 type
3. test_signal_card_shows_timestamp — 验证显示 timestamp
4. test_signal_card_type_bold — 验证 type 使用粗体
5. test_signal_card_color_coding — 验证不同类型有不同颜色

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 SignalCard 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-199.test.ts
```

---

## 任务 200：SignalCard 可展开查看完整 JSON

**所属模块**：15-frontend-signals
**依赖**：任务 199
**预估耗时**：10 分钟

### 功能点要求
SignalCard 默认只显示 type 和 timestamp 行。点击卡片展开显示完整事件 JSON（`JSON.stringify(event, null, 2)`）。展开时显示 "▼" 图标，折叠时显示 "▶" 图标。JSON 使用等宽字体、深色代码块背景、语法高亮。展开/折叠使用 CSS transition 动画。使用 `data-testid="signal-card-expanded"` 区分展开状态。

### 测试用例（必须先写，确认 RED）
1. test_signal_card_collapsed_by_default — 验证默认折叠
2. test_signal_card_click_expands — 验证点击展开显示 JSON
3. test_signal_card_shows_json — 验证展开后显示格式化 JSON
4. test_signal_card_click_collapses — 验证再次点击折叠
5. test_signal_card_toggle_icon — 验证展开/折叠图标切换

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现展开/折叠交互 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-200.test.ts
```

---

## 任务 201：新事件自动滚动到底部

**所属模块**：15-frontend-signals
**依赖**：任务 195
**预估耗时**：10 分钟

### 功能点要求
SignalsView 信号列表在新事件到达时自动滚动到底部（最新事件可见）。使用 `useEffect` 监听 events 数组变化，调用 `scrollIntoView({ behavior: 'smooth' })` 或设置 `scrollTop = scrollHeight`。自动滚动仅在用户当前在底部附近时触发（距离底部 < 50px）。用户向上滚动后不自动滚动（避免打断阅读）。

### 测试用例（必须先写，确认 RED）
1. test_signals_auto_scroll_new_event — 验证新事件到达后自动滚动
2. test_signals_auto_scroll_smooth — 验证滚动使用平滑动画
3. test_signals_no_scroll_when_scrolled_up — 验证用户向上滚动后不自动滚动
4. test_signals_scroll_threshold — 验证距离底部 < 50px 时触发自动滚动
5. test_signals_scroll_on_filter_change — 验证过滤器变化后也滚动到底部

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现自动滚动逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-201.test.ts
```

---

## 任务 202：暂停按钮停止自动滚动

**所属模块**：15-frontend-signals
**依赖**：任务 201
**预估耗时**：10 分钟

### 功能点要求
SignalsView 右下角显示悬浮暂停按钮（圆形，图标 ⏸/▶️）。点击暂停按钮停止自动滚动，按钮图标变为 ▶️。再次点击恢复自动滚动，图标变回 ⏸。暂停状态在新事件到达时保持（不自动恢复）。按钮使用 `data-testid="pause-scroll-button"` 标识。暂停时显示事件计数徽章（如 "+5" 表示暂停后新增 5 条）。

### 测试用例（必须先写，确认 RED）
1. test_pause_button_renders — 验证暂停按钮渲染
2. test_pause_button_stops_scroll — 验证点击暂停后停止自动滚动
3. test_pause_button_toggles_icon — 验证按钮图标在 ⏸/▶️ 间切换
4. test_pause_button_resumes — 验证再次点击恢复自动滚动
5. test_pause_button_shows_count — 验证暂停时显示新增事件计数

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现暂停/恢复逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/15-task-202.test.ts
```
