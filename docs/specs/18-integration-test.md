# 18 — 端到端集成测试

## 模块职责
验证 zszcode 完整功能：CLI 交互、Web UI、双端同步、权限确认。

## 测试矩阵

### CLI 验证（必须）
| # | 测试项 | 命令 | 预期结果 |
|---|--------|------|---------|
| 1 | 启动 | `bun run src/entrypoints/cli.tsx` | 进入 CLI 交互模式 |
| 2 | 版本号 | `bun run src/entrypoints/cli.tsx --version` | 输出 `zszcode 0.1.0` |
| 3 | 默认模型 | CLI 发消息 | 使用 mimo-v2.5-pro |
| 4 | 状态栏 | 观察 CLI 底部 | 显示 `Web UI: http://localhost:3000?token=xxx` |

### Web 服务器验证（必须，curl）
| # | 测试项 | 命令 | 预期结果 |
|---|--------|------|---------|
| 5 | 启动 | `curl -s "http://localhost:3000?token=xxx"` | 返回 HTML |
| 6 | WebSocket | wscat 连接 `ws://localhost:3000/ws?token=xxx` | 连接成功 |
| 7 | 未授权 | `curl -s http://localhost:3000` | 返回 401 |
| 8 | 端口递增 | 开第二个 zszcode | 自动用 3001 |

### Web UI 验证（必须，Playwright）
| # | 测试项 | 操作 | 预期结果 |
|---|--------|------|---------|
| 9 | 页面加载 | Playwright 打开 URL | 三个 Tab 可见 |
| 10 | Chat 发消息 | 输入 "hello"，点 Send | 收到 mimo 回复 |
| 11 | 消息渲染 | 观察消息 | Thinking 折叠，Tool Use 卡片 |
| 12 | Workflow Tab | 切换 Tab | Agent 树可见 |
| 13 | Signals Tab | 切换 Tab | 过滤器可用 |
| 14 | 权限确认 | 触发需权限操作 | 底部确认栏出现 |
| 15 | 超时拒绝 | 30 秒不操作 | 自动 deny |

### 双端同步验证（必须）
| # | 测试项 | 操作 | 预期结果 |
|---|--------|------|---------|
| 16 | CLI→Web | CLI 输入消息 | Web Chat 实时显示 |
| 17 | Web→CLI | Web 输入消息 | CLI 实时显示回复 |
| 18 | 权限同步 | Web 点 Allow | CLI 确认框消失 |

### 质量验证（必须）
| # | 测试项 | 命令 | 预期结果 |
|---|--------|------|---------|
| 19 | 类型检查 | `bunx tsc --noEmit` | 零错误 |
| 20 | 测试全过 | `bun test` | 全绿 |
| 21 | 进度检查 | `bun run check_progress.ts` | "all tasks done" |

### 编译验证（必须）
| # | 测试项 | 命令 | 预期结果 |
|---|--------|------|---------|
| 22 | 编译 | `bun build --compile src/entrypoints/cli.tsx --outfile zszcode` | 成功 |
| 23 | 运行 | `./zszcode --version` | 输出版本号 |
| 24 | 独立性 | `which claude` | 仍指向官方 |

### Playwright 测试脚本示例
```typescript
import { test, expect } from '@playwright/test'

test('full integration', async ({ page }) => {
  // 1. 页面加载
  await page.goto('http://localhost:3000?token=TEST_TOKEN')
  await expect(page.getByText('Chat')).toBeVisible()
  await expect(page.getByText('Workflow')).toBeVisible()
  await expect(page.getByText('Signals')).toBeVisible()

  // 2. Chat 发消息
  await page.getByPlaceholder('Type a message...').fill('say hello')
  await page.getByRole('button', { name: 'Send' }).click()
  await expect(page.locator('.message.assistant').last())
    .toBeVisible({ timeout: 30000 })

  // 3. Workflow Tab
  await page.getByText('Workflow').click()
  await expect(page.getByText('Main Agent')).toBeVisible()

  // 4. Signals Tab
  await page.getByText('Signals').click()
  await expect(page.getByText('api_stream_start')).toBeVisible()
})
```
