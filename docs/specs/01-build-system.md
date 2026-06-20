# 01 — 构建系统

## 模块职责
为 zszcode 源码创建完整的构建配置，使其能被 Bun 编译运行。处理 `bun:bundle` 的 feature flags 和 MACRO 常量。

## 新增文件清单
| 文件 | 用途 |
|------|------|
| `package.json` | 项目依赖和脚本 |
| `tsconfig.json` | TypeScript 配置 |
| `src/shims/bun-bundle.ts` | bun:bundle feature() 和 MACRO 替身 |
| `src/shims/bun-test.ts` | bun:test 空 stub |

## package.json

```json
{
  "name": "zszcode",
  "version": "0.1.0",
  "type": "module",
  "bin": { "zszcode": "./dist/cli.js" },
  "scripts": {
    "build": "bun build src/entrypoints/cli.tsx --outdir dist --target bun",
    "build:binary": "bun build --compile src/entrypoints/cli.tsx --outfile zszcode",
    "dev": "bun run src/entrypoints/cli.tsx",
    "build:web": "cd web && bun run build",
    "test": "bun test",
    "typecheck": "bunx tsc --noEmit"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "latest",
    "@modelcontextprotocol/sdk": "latest",
    "react": "^18",
    "react-reconciler": "^0.29",
    "commander": "latest",
    "chalk": "^5",
    "zod": "^4",
    "ws": "^8",
    "express": "^4",
    "chokidar": "^3"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/ws": "^8",
    "@types/express": "^4",
    "typescript": "^5"
  }
}
```

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "baseUrl": ".",
    "paths": {
      "bun:bundle": ["src/shims/bun-bundle.ts"],
      "bun:test": ["src/shims/bun-test.ts"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "dist", "web"]
}
```

## src/shims/bun-bundle.ts

```typescript
// bun:bundle shim — all feature flags default to false for external build
export function feature(_name: string): boolean {
  return false
}

// MACRO shim — build-time constants
export const MACRO = {
  VERSION: '0.1.0',
  PACKAGE_URL: 'https://github.com/Zhe-SH-CN/zszcode',
  NATIVE_PACKAGE_URL: '',
  FEEDBACK_CHANNEL: 'github',
  BUILD_TIME: new Date().toISOString(),
  VERSION_CHANGELOG: '',
  ISSUES_EXPLAINER: 'Report issues at https://github.com/Zhe-SH-CN/zszcode/issues',
}
```

**影响范围**: 141 个文件导入了 `bun:bundle`，828 处 `feature()` 调用全部返回 `false`（等价于官方外部构建的死代码消除）。7 个 MACRO 常量全部提供默认值。

## src/shims/bun-test.ts

```typescript
// bun:test shim — empty stub since src/ has no test imports
// Tests use bun:test directly in test files, not via src/ imports
export {}
```

## 关键修改点

### tsconfig paths 映射
- `bun:bundle` → `src/shims/bun-bundle.ts`
- `bun:test` → `src/shims/bun-test.ts`

Bun 的 bundler 会通过 `paths` 映射自动解析这些导入。

### Bun build 命令
```bash
# 开发运行
bun run src/entrypoints/cli.tsx

# 生产构建
bun build src/entrypoints/cli.tsx --outdir dist --target bun

# 独立二进制
bun build --compile src/entrypoints/cli.tsx --outfile zszcode
```

## 测试要求
1. `bun install` 成功安装所有依赖
2. `bun build src/entrypoints/cli.tsx --outdir dist` 能解析所有导入
3. `bun run src/entrypoints/cli.tsx --version` 输出 `0.1.0`
4. `bunx tsc --noEmit` 类型检查通过（或仅有少量已知错误）
5. feature() 调用返回 false（写测试验证 shim 行为）
6. MACRO.VERSION 返回 '0.1.0'
