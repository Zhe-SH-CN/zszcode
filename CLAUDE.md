# 项目记忆文件

长程执行中每轮由 /goal 自动读取。

## 每轮启动协议

新轮启动时先执行以下恢复流程（每步均有兜底）：

```
1. 读 progress.json
   - 不存在 → 报错并停止（progress.json 应在 step-2 结束时生成，若缺失说明阶段不完整）
   - 存在 → 找第一个 status=="pending" 的任务 ID；若无 pending 任务，检查是否有 failed 任务可重试
2. 读 docs/plans/00-plan-overview.md → 定位任务 ID 所属模块及对应 plan 文件（不存在则报错）
3. 读对应 plan 文件 → 获取任务详情
4. git log --oneline -5 → 了解最近变更（无记录则跳过）
5. 读任务涉及的源文件 → 了解当前代码状态（不存在则按需创建）
6. 开始 TDD 执行
```

## 每轮执行流程

```
1. 按启动协议恢复状态，确定当前任务
2. progress.json 中标记该任务 "in_progress"
3. TDD：写全部测试（≥5）→ 确认 RED（全失败）→ 实现 → 确认 GREEN（全过）
4. ⚠️ 类型检查 gate（强制，不过不准 commit）：
   bunx tsc --noEmit                    # 必须零错误
   任一失败 → 修复 → 重跑确认通过 → 才能继续
5. git add + git commit -m "task-N: <描述>"
6. progress.json 中标记该任务 "done"，completed+1，rounds+1
7. bun run check_progress.ts
   - "all tasks done" → 停止
   - 否则 → 清空上下文，进入下一轮
```

**类型检查 gate 规则**：
- tsc 有错误 → 逐个修复 → 重跑到 "zero errors"
- **类型检查未通过就 commit = 违规**，发现必须 `git commit --amend` 补修

每次 commit 即为当前阶段提交点，commit 后上下文将被清空。

## check_progress.ts

此脚本在 step-2 全部 plan 输出后由模型生成到项目根目录，内容如下：

```typescript
import { readFileSync } from 'fs'
import { join } from 'path'

const PROGRESS_FILE = join(import.meta.dir, 'progress.json')

try {
  const p = JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'))
  const remaining = Object.entries(p.tasks)
    .filter(([_, t]: [string, any]) => t.status !== 'done')
    .sort(([a], [b]) => Number(a) - Number(b))

  if (remaining.length === 0) {
    console.log('all tasks done')
    console.log(`total: ${p.total_tasks}, completed: ${p.completed}, rounds: ${p.rounds}`)
    process.exit(0)
  }

  console.log(`${remaining.length} tasks remaining out of ${p.total_tasks}`)
  for (const [tid, t] of remaining.slice(0, 20)) {
    console.log(`  task ${tid}: ${(t as any).status}`)
  }
  if (remaining.length > 20) {
    console.log(`  ... and ${remaining.length - 20} more`)
  }
  process.exit(1)
} catch {
  console.log('no progress file — tasks not started')
  process.exit(1)
}
```

## progress.json

```json
{
  "started_at": "",
  "updated_at": "",
  "total_tasks": 0,
  "completed": 0,
  "rounds": 0,
  "interventions": 0,
  "tasks": {}
}
```

`total_tasks` 在 `progress.json` 初始化时从 `00-plan-overview.md` 末尾标注的总任务数提取。`rounds` 每轮 +1，`interventions` 人工介入时 +1。
状态：`pending` → `in_progress` → `done` | `failed`

## 约束

- **单线程串行开发**：严禁 spawn 多 agent / workflow / Task 并行写代码。每个 task 由主线程顺序完成后才能开始下一个。允许只读 Explore agent 分析代码，禁止并行写代码。
- **严格 TDD**：每个 task 测试用例 ≥ 5 个（正常≥2 + 边界≥2 + 异常≥1），流程：①先写全部测试 ②确认 RED（全失败）③实现到 GREEN。跳过 RED 确认则测试无效。
- 禁止假实现：stub / echo / placeholder 一律不算 done
- 涉及 Web 服务器的 task 必须实际启动 + curl 验证
- 涉及 CLI 的 task 必须实际运行 `bun run src/entrypoints/cli.tsx` 验证
- 每 task 结束后自动 code review
- 只 import 已存在的模块
- 同任务失败 >3 轮 → 标记 failed，记录原因，继续下一个
- **不修改官方 Claude Code 源码**：所有修改在 zszcode/src/ 副本中进行
- **二进制名称**：编译产物为 `zszcode`，不使用 `claude` 名称
