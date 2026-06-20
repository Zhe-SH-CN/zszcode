# 14 — 前端 Workflow Tab TDD 任务计划

**模块职责**：树形可视化 Agent 父子关系，展示数据流动态粒子效果。

**新增文件**：
- `web/src/components/WorkflowView.tsx`
- `web/src/components/AgentTreeNode.tsx`
- `web/src/components/ToolCallNode.tsx`
- `web/src/components/DataFlowLine.tsx`

---

## 任务 182：WorkflowView 主容器组件

**所属模块**：14-frontend-workflow
**依赖**：任务 147
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/WorkflowView.tsx`，接收 `rootNode` prop（AgentNode 类型或 null）。容器占满父组件高度和宽度，使用 `overflow: auto` 支持滚动。渲染根节点的 AgentTreeNode 组件。当 rootNode 为 null 时显示 "Waiting for agent activity..." 占位文字。使用 `data-testid="workflow-view"` 标识。容器使用 SVG 或 div 实现树形布局。

### 测试用例（必须先写，确认 RED）
1. test_workflow_view_renders — 验证组件渲染不报错
2. test_workflow_view_shows_root_node — 验证渲染根节点
3. test_workflow_view_empty_placeholder — 验证无节点时显示占位文字
4. test_workflow_view_has_testid — 验证有 data-testid="workflow-view"
5. test_workflow_view_scrollable — 验证容器可滚动

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 WorkflowView 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-182.test.ts
```

---

## 任务 183：AgentTreeNode 渲染 agent ID 和 type

**所属模块**：14-frontend-workflow
**依赖**：任务 182
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/AgentTreeNode.tsx`，接收 `node: AgentNode` prop。渲染节点卡片：显示 agent ID（截取前 8 字符，等宽字体）、agentType（如 "main", "subagent"，粗体）、status 状态指示灯（running=绿色闪烁, completed=灰色, failed=红色）。使用 `data-testid="agent-node"` 标识。节点卡片圆角边框，深色背景。

### 测试用例（必须先写，确认 RED）
1. test_agent_node_renders — 验证组件渲染不报错
2. test_agent_node_shows_id — 验证显示截取后的 agent ID
3. test_agent_node_shows_type — 验证显示 agentType
4. test_agent_node_running_green — 验证 running 状态绿色指示灯
5. test_agent_node_completed_gray — 验证 completed 状态灰色指示灯

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 AgentTreeNode 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-183.test.ts
```

---

## 任务 184：AgentTreeNode 从 agent_spawn 事件构建

**所属模块**：14-frontend-workflow
**依赖**：任务 183
**预估耗时**：12 分钟

### 功能点要求
实现从 `agent_spawn` WebSocket 事件构建 AgentNode 数据结构的逻辑。事件数据包含 `{ agentId, parentId, agentType, description }`。当 parentId 不存在时为根节点。每个 agent_spawn 事件创建一个新节点，插入到父节点的 children 数组中。使用 `useMemo` 或 reducer 管理树形状态。根节点（Main Agent）在无 parentId 时自动创建。

### 测试用例（必须先写，确认 RED）
1. test_build_tree_from_spawn_event — 验证从 agent_spawn 构建节点
2. test_build_tree_root_node — 验证无 parentId 时创建根节点
3. test_build_tree_child_node — 验证有 parentId 时添加到父节点 children
4. test_build_tree_multiple_children — 验证同一父节点可有多个子节点
5. test_build_tree_preserves_order — 验证子节点按事件接收顺序排列

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现树形构建逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-184.test.ts
```

---

## 任务 185：AgentTreeNode 父子关系树形展示

**所属模块**：14-frontend-workflow
**依赖**：任务 183
**预估耗时**：12 分钟

### 功能点要求
AgentTreeNode 递归渲染子节点，形成树形结构。父子之间使用缩进（左侧 padding）表示层级关系。每个子节点前有连接线（竖线 + 横线，CSS 实现）。树形结构使用 flex column 布局。最大缩进深度 10 层后不再增加（防止过深）。子节点区域可独立滚动。

### 测试用例（必须先写，确认 RED）
1. test_agent_tree_renders_children — 验证渲染子节点列表
2. test_agent_tree_indentation — 验证子节点有缩进
3. test_agent_tree_connection_lines — 验证父子之间有连接线
4. test_agent_tree_max_depth — 验证最大缩进深度限制
5. test_agent_tree_nested_recursion — 验证深层嵌套节点正确渲染

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现树形布局 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-185.test.ts
```

---

## 任务 186：AgentTreeNode 可展开/折叠

**所属模块**：14-frontend-workflow
**依赖**：任务 183
**预估耗时**：10 分钟

### 功能点要求
AgentTreeNode 支持点击展开/折叠子节点。折叠状态：只显示节点自身，隐藏所有子节点，左侧显示 "▶" 图标。展开状态：显示子节点列表，图标变为 "▼"。默认根节点展开，子节点折叠。展开/折叠有 CSS transition 动画。节点无子节点时图标隐藏。

### 测试用例（必须先写，确认 RED）
1. test_agent_node_collapsed_by_default — 验证子节点默认折叠
2. test_agent_node_root_expanded — 验证根节点默认展开
3. test_agent_node_click_expands — 验证点击展开子节点
4. test_agent_node_click_collapses — 验证再次点击折叠
5. test_agent_node_no_icon_when_leaf — 验证叶子节点无展开图标

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现展开/折叠交互 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-186.test.ts
```

---

## 任务 187：AgentTreeNode 点击显示 input/output JSON

**所属模块**：14-frontend-workflow
**依赖**：任务 183
**预估耗时**：12 分钟

### 功能点要求
点击 AgentTreeNode 卡片（非展开/折叠按钮区域），弹出详情面板（侧边滑出或模态框）。面板显示：agent ID、agentType、description、input JSON（格式化）、output JSON（如果已完成）。JSON 使用等宽字体和语法高亮。面板可关闭（点击 X 或点击外部区域）。使用 `data-testid="agent-detail-panel"` 标识。

### 测试用例（必须先写，确认 RED）
1. test_agent_node_click_shows_detail — 验证点击显示详情面板
2. test_agent_node_detail_shows_id — 验证详情面板显示 agent ID
3. test_agent_node_detail_shows_input_json — 验证显示 input JSON
4. test_agent_node_detail_shows_output_json — 验证显示 output JSON
5. test_agent_node_detail_closeable — 验证面板可关闭

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现详情面板 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-187.test.ts
```

---

## 任务 188：ToolCallNode 显示 tool name 和 duration

**所属模块**：14-frontend-workflow
**依赖**：任务 183
**预估耗时**：10 分钟

### 功能点要求
创建 `web/src/components/ToolCallNode.tsx`，接收 `toolCall: ToolCallInfo` prop。作为 AgentTreeNode 的子节点渲染：显示 tool name（粗体）、duration（如 "230ms"）、成功/失败图标（✅/❌）。使用 `data-testid="tool-call-node"` 标识。节点样式比 AgentTreeNode 小（字体更小，padding 更少）。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_node_renders — 验证组件渲染不报错
2. test_tool_call_node_shows_name — 验证显示 tool name
3. test_tool_call_node_shows_duration — 验证显示 duration
4. test_tool_call_node_success_icon — 验证成功时显示 ✅
5. test_tool_call_node_failure_icon — 验证失败时显示 ❌

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 ToolCallNode 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-188.test.ts
```

---

## 任务 189：ToolCallNode 从 tool_call_start/end 事件构建

**所属模块**：14-frontend-workflow
**依赖**：任务 188
**预估耗时**：12 分钟

### 功能点要求
从 `tool_call_start` 事件创建 ToolCallInfo 对象（toolName, toolUseId, input, success=false, duration=0），关联到对应 agent 节点的 toolCalls 数组。收到 `tool_call_end` 事件后更新 success 和 duration。使用事件中的 agentId 找到对应的 AgentNode。如果找不到对应 agent，挂到根节点。

### 测试用例（必须先写，确认 RED）
1. test_tool_call_from_start_event — 验证从 tool_call_start 创建 ToolCallInfo
2. test_tool_call_from_end_event — 验证从 tool_call_end 更新 success 和 duration
3. test_tool_call_linked_to_agent — 验证 tool call 关联到正确的 agent 节点
4. test_tool_call_fallback_to_root — 验证找不到 agent 时挂到根节点
5. test_tool_call_preserves_order — 验证 tool calls 按事件顺序排列

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现事件到数据的映射 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-189.test.ts
```

---

## 任务 190：DataFlowLine 数据流线条 SVG

**所属模块**：14-frontend-workflow
**依赖**：任务 182
**预估耗时**：12 分钟

### 功能点要求
创建 `web/src/components/DataFlowLine.tsx`，接收 `{ from, to, status }` prop。使用 SVG `<line>` 或 `<path>` 绘制从父节点到子节点的连接线。线条使用 `stroke-dasharray` 实现虚线效果。线条颜色根据 status 变化：running=绿色，completed=灰色，failed=红色。使用 `data-testid="data-flow-line"` 标识。

### 测试用例（必须先写，确认 RED）
1. test_data_flow_line_renders — 验证 SVG 线条渲染
2. test_data_flow_line_dashed — 验证使用虚线样式
3. test_data_flow_line_running_green — 验证 running 状态绿色线条
4. test_data_flow_line_completed_gray — 验证 completed 状态灰色线条
5. test_data_flow_line_failed_red — 验证 failed 状态红色线条

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 DataFlowLine 组件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-190.test.ts
```

---

## 任务 191：DataFlowLine CSS 粒子动画（stroke-dashoffset）

**所属模块**：14-frontend-workflow
**依赖**：任务 190
**预估耗时**：10 分钟

### 功能点要求
DataFlowLine 实现粒子流动动画：使用 CSS `@keyframes` 动画 `stroke-dashoffset` 从 20 递减到 0，循环播放（`animation: flow 1s linear infinite`）。动画方向从父节点到子节点。`stroke-dasharray: 5 5` 实现虚线间隔。动画在 status 为 running 时播放，completed/failed 时停止。

### 测试用例（必须先写，确认 RED）
1. test_data_flow_animation_keyframes — 验证 CSS @keyframes 定义存在
2. test_data_flow_animation_dasharray — 验证 stroke-dasharray 为 "5 5"
3. test_data_flow_animation_running_plays — 验证 running 状态播放动画
4. test_data_flow_animation_completed_stops — 验证 completed 状态停止动画
5. test_data_flow_animation_infinite — 验证动画无限循环

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 CSS 粒子动画 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-191.test.ts
```

---

## 任务 192：DataFlowLine 颜色编码：运行中绿色/完成灰色/失败红色

**所属模块**：14-frontend-workflow
**依赖**：任务 190
**预估耗时**：8 分钟

### 功能点要求
DataFlowLine 的线条颜色根据 status prop 变化：`running` 为绿色（#22c55e）、`completed` 为灰色（#6b7280）、`failed` 为红色（#ef4444）。颜色变化使用 CSS transition 过渡（0.3s）。颜色值使用 Tailwind CSS 自定义属性或 CSS 变量管理。

### 测试用例（必须先写，确认 RED）
1. test_data_flow_color_running — 验证 running 状态颜色为绿色
2. test_data_flow_color_completed — 验证 completed 状态颜色为灰色
3. test_data_flow_color_failed — 验证 failed 状态颜色为红色
4. test_data_flow_color_transition — 验证颜色变化有 CSS transition
5. test_data_flow_color_default — 验证未指定 status 默认灰色

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现颜色编码逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-192.test.ts
```

---

## 任务 193：agent_complete 事件更新节点状态

**所属模块**：14-frontend-workflow
**依赖**：任务 183, 184
**预估耗时**：10 分钟

### 功能点要求
收到 `agent_complete` WebSocket 事件时，更新对应 AgentNode 的 status 为 `completed`（成功时）或 `failed`（失败时），设置 `endTime`。事件数据包含 `{ agentId, success, duration }`。如果 success 为 false，status 设为 `failed`。更新后 DataFlowLine 颜色同步变化。

### 测试用例（必须先写，确认 RED）
1. test_agent_complete_updates_status — 验证 agent_complete 更新节点 status
2. test_agent_complete_success — 验证 success=true 时 status 为 completed
3. test_agent_complete_failure — 验证 success=false 时 status 为 failed
4. test_agent_complete_sets_end_time — 验证设置 endTime
5. test_agent_complete_unknown_agent — 验证未知 agentId 不报错

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现事件处理逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-193.test.ts
```

---

## 任务 194：树形数据结构从事件流实时构建

**所属模块**：14-frontend-workflow
**依赖**：任务 184, 189, 193
**预估耗时**：15 分钟

### 功能点要求
将 agent_spawn、tool_call_start、tool_call_end、agent_complete 四种事件统一处理，实时构建和更新树形数据结构。使用 `useReducer` 管理状态，reducer 根据事件 type 分发更新。树形数据结构类型为 `AgentNode`（含 children 和 toolCalls 数组）。支持增量更新（不重建整棵树）。提供 `buildTreeFromEvents(events: ZszCodeEvent[]): AgentNode | null` 工具函数。

### 测试用例（必须先写，确认 RED）
1. test_tree_builder_from_events — 验证从事件数组构建完整树
2. test_tree_builder_incremental_update — 验证增量更新不重建整棵树
3. test_tree_builder_mixed_events — 验证混合多种事件类型正确处理
4. test_tree_builder_empty_events — 验证空事件数组返回 null
5. test_tree_builder_preserves_existing_nodes — 验证更新时保留已有节点数据

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现树形数据构建逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/14-task-194.test.ts
```
