# 12 — REPL 状态栏 Web URL 显示

## 模块职责
在 CLI 状态栏显示 Web 服务器 URL（带 token），方便用户在浏览器中打开。

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/screens/REPL.tsx` | 526 | Props 类型添加 webUrl? |
| `src/screens/REPL.tsx` | 4587 | SpinnerWithVerb 附近添加 WebUrlBanner |
| `src/screens/REPL.tsx` | 4590 | bottom slot 添加 URL 显示 |
| `src/main.tsx` | 2241 | 启动 Web 服务器，传递 URL |
| `src/main.tsx` | 3134 | launchRepl() 传递 webUrl prop |

## 修改详情

### REPL.tsx Props (line 526)
```typescript
export type Props = {
  // ... existing props
  webUrl?: string
}
```

### 新增组件 (REPL.tsx 内)
```tsx
function WebUrlBanner({ url }: { url: string }) {
  return (
    <Box>
      <Text dimColor>Web UI: </Text>
      <Text color="cyan">{url}</Text>
    </Box>
  )
}
```

### bottom slot (line 4590)
```tsx
bottom={
  <Box flexDirection="column">
    {webUrl && <WebUrlBanner url={webUrl} />}
    {permissionStickyFooter}
    {/* ... existing bottom content */}
  </Box>
}
```

### main.tsx (line 2241 之后)
```typescript
import { startWebServer } from './zszcode/server.js'
import { loadConfig } from './zszcode/config.js'

const zszConfig = loadConfig()
const webServer = startWebServer(zszConfig)
// Pass webServer.url to REPL via launchRepl props
```

## 测试要求
1. WebUrlBanner 渲染 URL 文本
2. WebUrlBanner 显示 dim "Web UI:" 前缀
3. WebUrlBanner 显示 cyan 颜色的 URL
4. webUrl 为 undefined 时不显示 banner
5. URL 包含 token 参数
