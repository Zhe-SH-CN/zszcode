/goal 逐轮执行 docs/plans 中的全部任务直到 bun run check_progress.ts 返回0。每轮严格 TDD：① 读 progress.json 找第一个 pending 任务 ② 读对应 plan ③ 先写 plan 里列出的全部测试用例（至少5个）→ 运行确认 RED（全失败，跳过此步则测试无效）④ 实现功能 → 确认 GREEN（全过）⑤ 类型检查 gate 强制：bunx tsc --noEmit 必须零错误，失败必须修复到通过才能 commit ⑥ git commit -- task-N ⑦ 更新 progress.json（done, completed+1, rounds+1）。禁止 stub/echo/placeholder 假实现；涉及 Web 服务器的任务必须实际启动 + curl 验证真实回复；涉及 Web UI 的任务必须用 Playwright 打开浏览器验证页面渲染和交互（参考zszcode/long-horizon-prompts/step-3-goal-execute.md）。如果 check_progress.ts 返回0则停止，否则继续下一任务，完成一个plans文件（不是原子任务）进行git commit和push。

## Playwright 验证规范

涉及 Web UI 的 task，必须用 Playwright 进行真实浏览器验证：

```typescript
// 验证页面加载
import { test, expect } from '@playwright/test'

test('web page loads correctly', async ({ page }) => {
  await page.goto('http://localhost:3000?token=YOUR_TOKEN')
  await expect(page).toHaveTitle(/zszcode/)
  // 验证三个 Tab 存在
  await expect(page.getByText('Chat')).toBeVisible()
  await expect(page.getByText('Workflow')).toBeVisible()
  await expect(page.getByText('Signals')).toBeVisible()
})

// 验证 Chat 发消息
test('chat sends message and receives reply', async ({ page }) => {
  await page.goto('http://localhost:3000?token=YOUR_TOKEN')
  await page.getByPlaceholder('Type a message...').fill('hello')
  await page.getByRole('button', { name: 'Send' }).click()
  // 等待 assistant 回复出现
  await expect(page.locator('.message.assistant').last()).toBeVisible({ timeout: 30000 })
})

// 验证权限确认
test('permission bar appears and resolves', async ({ page }) => {
  // 触发一个需要权限的操作
  // 验证底部确认栏出现
  await expect(page.getByText('Permission Request')).toBeVisible()
  // 点击 Allow
  await page.getByRole('button', { name: 'Allow' }).click()
  // 验证确认栏消失
  await expect(page.getByText('Permission Request')).not.toBeVisible()
})
```

每个涉及 Web 的 task 验证时：

1. 启动 zszcode（`bun run src/entrypoints/cli.tsx`）
2. 用 Playwright 打开 Web URL
3. 执行交互操作
4. 断言预期结果
5. 关闭浏览器
