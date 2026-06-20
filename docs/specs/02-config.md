# 02 — 配置模块

## 模块职责
管理 `~/.zszcode/settings.json` 配置文件，提供默认值，支持合并覆盖。

## 新增文件
| 文件 | 用途 |
|------|------|
| `src/zszcode/config.ts` | 配置加载和管理 |

## 接口定义

```typescript
export interface ZszCodeConfig {
  model: string           // 默认模型名
  baseUrl: string         // API base URL
  apiKey: string          // API key
  webPort: number         // Web 服务器端口
  autoOpenBrowser: boolean // 自动打开浏览器
  permissionMode: 'auto' | 'confirm'  // 权限模式
}

export const CONFIG_DIR: string   // ~/.zszcode
export const CONFIG_FILE: string  // ~/.zszcode/settings.json

export function loadConfig(): ZszCodeConfig
```

## 默认值
```typescript
const DEFAULTS: ZszCodeConfig = {
  model: 'mimo-v2.5-pro',
  baseUrl: 'https://token-plan-cn.xiaomimimo.com/anthropic',
  apiKey: 'tp-c2vyjcx7y4xxzfs6s8sz8htsw7ou3ts2afdulks4mcc0iecy',
  webPort: 3000,
  autoOpenBrowser: false,
  permissionMode: 'confirm',
}
```

## 行为
1. `loadConfig()` 检查 `~/.zszcode/` 目录，不存在则创建
2. 检查 `~/.zszcode/settings.json`，不存在则写入默认值并返回
3. 存在则读取 JSON，与 DEFAULTS 合并（用户值覆盖默认值）
4. 返回合并后的完整配置

## 测试要求
1. loadConfig 返回包含所有必需字段的对象
2. 缺失字段使用默认值填充
3. 自定义值正确覆盖默认值
4. 配置目录不存在时自动创建
5. 配置文件不存在时创建默认文件
6. 无效 JSON 抛出明确错误
