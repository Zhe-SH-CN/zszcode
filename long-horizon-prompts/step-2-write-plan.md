读取 `docs/specs/` 下的所有 spec 文件，将每个模块拆成**功能点维度**的原子任务。对于文生图和文生视频可以用agnes-ai这个skill

## 核心原则

### 按功能点拆分，不按函数拆分

- ❌ "实现事件总线" — 太粗
- ✅ "eventBus.emit() 在调用时将事件广播到所有已注册的 listener，listener 抛异常不影响其他 listener"
- ✅ "eventBus.onEvent() 返回 unsubscribe 函数，调用后不再收到事件"
- ✅ "事件历史缓冲区保留最近 1000 条，超出后 FIFO 淘汰"

### 任务编号与数量

- 统一编号：1, 2, 3... N（不用 1.1, 1.2）
- 每个 task 粒度约 **8-15 分钟**可完成（含写测试 + 实现 + 自测，不能更短）
- 每个模块至少拆 15-20 个功能点任务
- 宁可过细，不可过粗

### ⚠️ 严格 TDD —— 测试必须充分

每个 task 的测试套件必须满足以下**最低要求**（不满足不准标 done）：

| 维度                   | 最低用例数                     | 说明                              |
| ---------------------- | ------------------------------ | --------------------------------- |
| 正常路径（happy path） | ≥ 2                           | 主要输入变体都要覆盖              |
| 边界条件               | ≥ 2                           | 空值/零值/最大值/越界/单元素      |
| 异常与错误处理         | ≥ 1                           | 非法输入抛正确异常类型 + 错误消息 |
| **合计**         | **≥ 5 个测试用例/task** | 纯类型/常量定义类 task 可降到 3   |

- **TDD 三段式必须在 plan 里写明**：① 先写全部测试 → ② 运行确认 RED（失败）→ ③ 实现到 GREEN（全过）。跳过 RED 确认 = 测试无效。
- 测试名要语义化（`test_event_bus_broadcasts_to_all_listeners` 而非 `test_1`）
- 涉及 I/O（HTTP/文件/子进程）的 task：用 mock + 至少 1 个真实集成测试
- 涉及 WebSocket 的 task：mock 单元测试 + 真实 ws 连接集成测试

### ⚠️ 单线程串行开发 —— 禁止并行 agent

- 开发阶段**严禁** spawn 多个 agent / workflow / Task 并行实现不同 task
- 每个 task 必须由**主线程顺序**完成：写测试 → 实现 → 验证 → commit → 才能开始下一个
- 允许的并行：只读的代码探索（Explore agent 读文件分析），但**不允许并行写代码**

### 首个模块：项目初始化

plan 最前面的几个 task 必须是项目初始化：

1. 创建 `package.json` 并 `bun install`
2. 创建 `tsconfig.json`
3. 创建 `src/shims/bun-bundle.ts`（bun:bundle shim）
4. 创建 `src/shims/bun-test.ts`（bun:test shim）
5. 验证 `bun build src/entrypoints/cli.tsx --outdir dist` 能解析所有导入

## 任务格式

```markdown
## 任务 N：<功能点描述>

**所属模块**：<模块名>
**依赖**：任务 X, Y（无则写"无"）
**预估耗时**：8-15 分钟（写测试 + 实现 + 自测）

### 功能点要求
<具体行为描述，精确到输入/输出/边界>

### 测试用例（必须先写，确认 RED）
列出本 task 要写的全部测试，至少 5 个：
1. test_xxx_normal_case_1 — <验证什么>
2. test_xxx_normal_case_2 — <验证什么>
3. test_xxx_boundary_empty — 空输入
4. test_xxx_boundary_max — 最大值/越界
5. test_xxx_invalid_raises — 非法输入抛异常

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED（全失败）**
2. 实现功能 → 确认 **GREEN（全过）**
3. `bunx tsc --noEmit` 通过

### 验证方法
<运行哪个命令、观察什么结果>
```

## 输出要求

### 文件与编号一一对应

```
docs/plans/
├── 00-plan-overview.md       # 全部任务表格 | N | 功能点 | 模块 | 依赖 |，末尾标注总任务数
├── 01-build-system.md        # 对应 docs/specs/01-build-system.md
├── 02-config.md              # 对应 docs/specs/02-config.md
├── 03-event-bus.md           # 对应 docs/specs/03-event-bus.md
├── 04-web-server.md          # 对应 docs/specs/04-web-server.md
├── 05-api-adapter.md         # 对应 docs/specs/05-api-adapter.md
├── ...
├── 18-integration-test.md    # 对应 docs/specs/18-integration-test.md
```

**约束**：

- 每个 spec 文件生成一个同编号的 plan 文件
- 禁止将多个 spec 合并到一个 plan 文件
- 每个 plan 文件至少拆出该 spec 对应的 15-20 个功能点任务
- plan 文件编号必须与 spec 文件编号完全一致

`00-plan-overview.md` 中的表格覆盖所有任务（N 列从 1 到最后一个编号），末尾附加一行「总任务数：X」。

## 收尾验证任务

计划末尾必须包含以下验证任务，这些是**项目能真正交付的硬性 gate**：

### CLI 验证（必须）

1. **zszcode 启动**：`bun run src/entrypoints/cli.tsx` 成功进入 CLI 交互模式
2. **版本号**：`bun run src/entrypoints/cli.tsx --version` 输出 `zszcode 0.1.0`
3. **默认模型**：CLI 使用 `mimo-v2.5-pro` 发送 API 请求（可通过日志确认）
4. **状态栏**：CLI 底部显示 `Web UI: http://localhost:3000?token=xxx`

### Web 服务器验证（必须，用 curl 自测）

5. **Web 服务器启动**：`curl -s "http://localhost:3000?token=xxx"` 返回 HTML（含 `<!DOCTYPE html>`）
6. **WebSocket 连接**：用 wscat 或脚本连接 `ws://localhost:3000/ws?token=xxx` 成功
7. **未授权访问拒绝**：`curl -s http://localhost:3000` 返回 401
8. **端口递增**：第二个 zszcode 实例自动使用 3001 端口

### Web UI 验证（必须，用 Playwright 自动化测试）

9. **页面加载**：Playwright 打开 Web URL，页面加载完成，三个 Tab 可见
10. **Chat Tab**：在 Chat 输入框输入消息，收到回复（mimo-v2.5-pro 响应）
11. **消息渲染**：Thinking 块折叠显示，Tool Use 卡片展示 input/output
12. **Workflow Tab**：切换到 Workflow Tab，Agent 树形结构可见
13. **Signals Tab**：切换到 Signals Tab，过滤器可用，信号实时流入
14. **权限确认**：触发需要权限的 tool，Web 底部弹出确认栏，点击 Allow 后操作继续
15. **超时拒绝**：权限确认 30 秒不操作，自动 deny

### 双端同步验证（必须）

16. **CLI 发消息 Web 同步**：CLI 输入消息，Web Chat Tab 实时显示
17. **Web 发消息 CLI 同步**：Web 输入消息，CLI 实时显示回复
18. **权限同步**：Web 点击 Allow，CLI 确认框自动消失

### 质量验证（必须）

19. **TypeScript 类型检查**：`bunx tsc --noEmit` 零错误
20. **测试全过**：`bun test` 全绿
21. **check_progress.ts 返回 all tasks done**（exit 0）

### 编译验证（必须）

22. **独立二进制**：`bun build --compile src/entrypoints/cli.tsx --outfile zszcode` 成功
23. **二进制运行**：`./zszcode --version` 输出版本号
24. **不依赖官方 claude**：`which claude` 仍指向官方

### ⚠️ 反 stub 约束

- **禁止**：`return ""` / `pass` / `throw new Error('not implemented')` / 纯 echo / 硬编码回复
- **必须**：调用真实依赖（Anthropic API / WebSocket / 文件系统）或有实际业务逻辑
- Web 服务器 task 必须实际启动 + curl 验证
- Chat 功能必须真实调用 mimo-v2.5-pro API

## 附加约束

- 零占位符：禁止 TBD / TODO / "后续实现"
- 每个任务独立可执行，不依赖其他任务的"部分完成"
- 测试必须能先失败：一开始就通过说明测试无效
- 禁止将多个 spec 模块合并到一个 plan 文件输出
- 所有修改基于 zszcode/src/ 副本，不碰官方 Claude Code 源码

---

确认后开始。先输出 00-plan-overview.md，过目后再逐个模块输出。

全部 plan 输出完毕后，初始化 `progress.json`（从 00-plan-overview.md 末尾的「总任务数」提取 total_tasks，填充 tasks 字段，全部 pending）并生成 `check_progress.ts`。完成后告知用户可进入 Step 3。

## ⚠️ progress.json 强制更新规则

**任何时候重新执行本提示词，结束前必须做以下操作：**

1. **先删旧后重建** `progress.json`：
   - 删除项目根目录现有的 `progress.json`
   - 用 `00-plan-overview.md` 末尾的「总任务数：X」重新生成，tasks 全量 pending
   - `started_at` 和 `updated_at` 使用当前 ISO 8601 时间
   - `total_tasks` 必须与 00-plan-overview.md 末尾数字严格一致
2. **生成/更新** `check_progress.ts` — 内容固定，直接写入项目根目录
3. **验证**：`bun run check_progress.ts` 必须返回非零退出码（表示有 pending 任务）

严禁在新 plan 输出完毕后保留旧的 progress.json。如果 progress.json 已经存在且任务数不匹配，必须无条件覆盖。
