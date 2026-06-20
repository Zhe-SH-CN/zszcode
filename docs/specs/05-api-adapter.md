# 05 — API 适配

## 模块职责
修改 Anthropic 客户端创建，使用 zszcode 配置的 baseURL/apiKey/默认模型。

## 修改文件
| 文件 | 行号 | 修改内容 |
|------|------|---------|
| `src/services/api/client.ts` | 301-315 | 注入 zszcode 配置的 baseURL 和 apiKey |
| `src/main.tsx` | 280 | 默认模型从 zszcode 配置读取 |

## 修改详情

### client.ts (line 301-315)

原代码：
```typescript
const clientConfig: ConstructorParameters<typeof Anthropic>[0] = {
  apiKey: isClaudeAISubscriber() ? null : apiKey || getAnthropicApiKey(),
  // ...
}
return new Anthropic(clientConfig)
```

修改为：
```typescript
import { loadConfig } from '../../zszcode/config.js'

// In getAnthropicClient(), before building clientConfig:
const zszConfig = loadConfig()

const clientConfig: ConstructorParameters<typeof Anthropic>[0] = {
  apiKey: zszConfig.apiKey || apiKey || getAnthropicApiKey(),
  ...(zszConfig.baseUrl ? { baseURL: zszConfig.baseUrl } : {}),
  // ... existing config
}
return new Anthropic(clientConfig)
```

### main.tsx (line 280)

原代码：
```typescript
const model = parseUserSpecifiedModel(getInitialMainLoopModel() ?? getDefaultMainLoopModel())
```

修改为：
```typescript
import { loadConfig } from './zszcode/config.js'
const zszConfig = loadConfig()
const model = parseUserSpecifiedModel(
  getInitialMainLoopModel() ?? zszConfig.model ?? getDefaultMainLoopModel()
)
```

## 测试要求
1. getAnthropicClient 使用 zszcode 配置的 apiKey
2. getAnthropicClient 使用 zszcode 配置的 baseURL
3. CLI --model flag 覆盖配置默认值
4. 无 CLI flag 时使用配置中的 model
5. 无效 baseURL 产生明确错误
